import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import fetch from 'node-fetch';
import { Client } from 'xrpl';
import { LRUCache } from 'lru-cache';
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config({ path: new URL('../.env', import.meta.url).pathname });

const PORT = process.env.PORT || 4000;
const LOG_LEVEL = (process.env.LOG_LEVEL || 'info').toLowerCase();
const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const shouldLog = (lvl) => (LEVELS[lvl] ?? 2) <= (LEVELS[LOG_LEVEL] ?? 2);
const LOG_BUFFER_MAX = 2000;
const logBuffer = [];
const log = (level, message, meta = {}) => {
  if (!shouldLog(level)) return;
  try {
    const payload = { ts: new Date().toISOString(), level, message, ...meta };
    console.log(JSON.stringify(payload));
    logBuffer.push(payload);
    if (logBuffer.length > LOG_BUFFER_MAX) {
      logBuffer.splice(0, logBuffer.length - LOG_BUFFER_MAX);
    }
  } catch {
    console.log(`[${level}] ${message}`);
  }
};
const app = express();
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const reqId = Math.random().toString(36).slice(2, 10);
  req.id = reqId;
  log('info', 'req.start', { reqId, method: req.method, url: req.originalUrl, ip: req.ip, ua: req.headers['user-agent'] });
  res.on('finish', () => {
    log('info', 'req.end', { reqId, status: res.statusCode, durationMs: Date.now() - start });
  });
  next();
});

const XRPL_RPC_URL = process.env.XRPL_RPC_URL || 'wss://xrplcluster.com';
const XRPSCAN_BASE = process.env.XRPSCAN_BASE || 'https://api.xrpscan.com/api/v1';
const SELF_BASE_URL = process.env.SELF_BASE_URL || 'http://127.0.0.1:4000';
const xrplClient = new Client(XRPL_RPC_URL);
let xrplReady = false;
xrplClient.connect().then(() => { xrplReady = true; log('info', 'xrpl.connected', { url: XRPL_RPC_URL }); }).catch((e) => { log('error', 'xrpl.connect_error_startup', { error: e?.message || String(e) }); });

const ensureXRPLConnected = async () => {
  try {
    if (!xrplReady || !xrplClient.isConnected()) {
      await xrplClient.connect();
      xrplReady = true;
      log('info', 'xrpl.connected', { url: XRPL_RPC_URL });
    }
  } catch (e) {
    xrplReady = false;
    log('error', 'xrpl.connect_error', { error: e?.message || String(e) });
    throw e;
  }
};

const cache = new LRUCache({ max: 500, ttl: 30_000 });

const withCache = async (key, fn) => {
  const hit = cache.get(key);
  if (hit) return hit;
  const value = await fn();
  cache.set(key, value);
  return value;
};

const decodeCurrencyHex = (hex) => {
  try {
    const bytes = (hex || '').toUpperCase().match(/.{1,2}/g) || [];
    const ascii = bytes.map((b) => String.fromCharCode(parseInt(b, 16))).join('');
    return ascii.replace(/\u0000+$/g, '').replace(/[^\x20-\x7E]/g, '').trim();
  } catch {
    return '';
  }
};

const fetchXRPLtoToken = async (identifier) => {
  const url = `https://api.xrpl.to/api/token/${encodeURIComponent(identifier)}`;
  const t0 = Date.now();
  log('debug', 'xrplto.token.fetch.start', { url });
  const r = await fetch(url);
  const ms = Date.now() - t0;
  log('debug', 'xrplto.token.fetch.end', { status: r.status, durationMs: ms });
  if (!r.ok) throw new Error(`xrpl.to token ${r.status}`);
  const json = await r.json();
  log('info', 'xrplto.token.ok', { durationMs: ms, hasToken: Boolean(json?.token), md5: json?.token?.md5 || null, holders: json?.token?.holders ?? null });
  return json;
};

const fetchSparkline = async (md5) => {
  if (!md5) return null;
  const url = `https://api.xrpl.to/api/sparkline/${encodeURIComponent(md5)}`;
  const t0 = Date.now();
  log('debug', 'xrplto.sparkline.fetch.start', { url });
  const r = await fetch(url);
  const ms = Date.now() - t0;
  log('debug', 'xrplto.sparkline.fetch.end', { status: r.status, durationMs: ms });
  if (!r.ok) return null;
  const json = await r.json();
  log('info', 'xrplto.sparkline.ok', { durationMs: ms, points: json?.data?.prices?.length ?? 0 });
  return json;
};

// XRPSCAN token info fallback
const fetchXRPSCANToken = async (issuer, currencyHex) => {
  try {
    const code = decodeCurrencyHex(currencyHex);
    if (!code) return null;
    const url = `${XRPSCAN_BASE}/token/${encodeURIComponent(code)}.${encodeURIComponent(issuer)}`;
    const t0 = Date.now();
    log('debug', 'xrpscan.token.fetch.start', { url });
    const r = await fetch(url);
    const ms = Date.now() - t0;
    log('debug', 'xrpscan.token.fetch.end', { status: r.status, durationMs: ms });
    if (!r.ok) return null;
    const j = await r.json();
    // Normalize into our token shape similar to xrpl.to
    const token = {
      issuer,
      currency: currencyHex,
      name: code,
      holders: j.holders ?? null,
      usd: j.price ?? null,
      marketcap: j.marketcap ?? null,
      blackholed: j.blackholed ?? null,
      amms: j.amms ?? null,
      metrics: j.metrics ?? null,
      source: 'xrpscan',
    };
    log('info', 'xrpscan.token.ok', { durationMs: ms, holders: token.holders ?? null, usd: token.usd ?? null });
    return { token };
  } catch (e) {
    log('warn', 'xrpscan.token.error', { error: e?.message || String(e) });
    return null;
  }
};

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

const AI_SYSTEM_PROMPT = `You are Agent Smith, an AI trading analyser suggester focused on XRPL tokens.
Goals:
- Provide practical insights using only the provided data. Do not invent metrics.
- Be conversational, human, and clear. Keep answers succinct but useful.
- Understand follow-up questions; keep short-term memory of the chat to maintain context.
- Emphasize uncertainty when data is missing; avoid definitive claims.
- Be suggestive but cautious; this is NOT financial advice.
- Note that historical and real-time data may be incomplete and will improve in future versions.

Output format:
- 5-10 short bullet points covering: issuer flags & risks (freeze, master key), liquidity/AMM & fee, holder concentration, orderbook depth/health, pricing/sparkline trends if present, notable red flags.
- End with a single-sentence recommendation label: Good / Speculative / High Risk — with a short reason.
- End with a brief caution: data may be incomplete; consider further research.`;

const aiAnalyze = async (payload) => {
  if (!openai.apiKey) { log('debug', 'ai.disabled'); return null; }
  const prompt = `DATA:\n${JSON.stringify(payload)}`;
  try {
    const t0 = Date.now();
    log('debug', 'ai.start');
    const chat = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        { role: 'system', content: AI_SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.4,
      max_tokens: 500,
    });
    const ms = Date.now() - t0;
    const content = chat.choices?.[0]?.message?.content || null;
    log('info', 'ai.ok', { durationMs: ms, hasContent: Boolean(content) });
    return content;
  } catch (e) {
    log('warn', 'ai.error', { error: e?.message || String(e) });
    return null;
  }
};

// Lightweight chat endpoint for follow-up questions
// POST /api/ask { issuer, currency, question }
app.post('/api/ask', async (req, res) => {
  try {
    const { issuer, currency, question, history } = req.body || {};
    if (!issuer || !currency || !question) {
      return res.status(400).json({ error: 'bad_request', message: 'issuer, currency, and question are required' });
    }
    const analyzeUrl = `${SELF_BASE_URL}/api/analyze/${encodeURIComponent(issuer)}/${encodeURIComponent(currency)}`;
    const t0 = Date.now();
    const baseResp = await fetch(analyzeUrl);
    const baseData = baseResp.ok ? await baseResp.json() : null;
    const messages = [
      { role: 'system', content: AI_SYSTEM_PROMPT },
      { role: 'user', content: `DATA:\n${JSON.stringify(baseData || {})}` },
    ];
    // include short conversation history if provided
    try {
      const hist = Array.isArray(history) ? history.slice(-6) : [];
      for (const m of hist) {
        if (!m || typeof m.text !== 'string') continue;
        const role = m.from === 'ai' ? 'assistant' : 'user';
        messages.push({ role, content: m.text });
      }
    } catch {}
    messages.push({ role: 'user', content: `Follow-up: ${question}` });
    const chat = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages,
      temperature: 0.5,
      max_tokens: 400,
    });
    const answer = chat.choices?.[0]?.message?.content || '';
    log('info', 'ask.ok', { durationMs: Date.now() - t0 });
    res.json({ answer });
  } catch (e) {
    log('error', 'ask.error', { error: e?.message || String(e) });
    res.status(500).json({ error: 'ask_error', message: String(e) });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', xrpl: xrplReady, rpcUrl: XRPL_RPC_URL });
});

// Diagnostics: return recent logs (for local debugging)
app.get('/api/logs', (req, res) => {
  const limit = Math.min(parseInt((req.query.limit || '200').toString(), 10) || 200, LOG_BUFFER_MAX);
  res.json(logBuffer.slice(-limit));
});

app.get('/api/token/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    if (!identifier || !identifier.includes('_')) {
      return res.status(400).json({ error: 'identifier must be {issuer}_{currencyHex}' });
    }
    const url = `https://api.xrpl.to/api/token/${encodeURIComponent(identifier)}`;
    log('debug', 'proxy.token.start', { url });
    const upstream = await fetch(url);
    res.status(upstream.status);
    upstream.headers.forEach((v, k) => {
      if (k.toLowerCase() === 'content-type') res.setHeader('content-type', v);
    });
    const body = await upstream.text();
    log('info', 'proxy.token.end', { status: upstream.status, bytes: body.length });
    res.send(body);
  } catch (err) {
    log('error', 'proxy.token.error', { error: String(err) });
    res.status(500).json({ error: 'upstream_error', message: String(err) });
  }
});

app.get('/api/sparkline/:md5', async (req, res) => {
  try {
    const { md5 } = req.params;
    if (!md5) return res.status(400).json({ error: 'md5 required' });
    const url = `https://api.xrpl.to/api/sparkline/${encodeURIComponent(md5)}`;
    log('debug', 'proxy.sparkline.start', { url });
    const upstream = await fetch(url);
    res.status(upstream.status);
    upstream.headers.forEach((v, k) => {
      if (k.toLowerCase() === 'content-type') res.setHeader('content-type', v);
    });
    const body = await upstream.text();
    log('info', 'proxy.sparkline.end', { status: upstream.status, bytes: body.length });
    res.send(body);
  } catch (err) {
    log('error', 'proxy.sparkline.error', { error: String(err) });
    res.status(500).json({ error: 'upstream_error', message: String(err) });
  }
});

app.get('/api/image/:md5', (req, res) => {
  const { md5 } = req.params;
  if (!md5) return res.status(400).json({ error: 'md5 required' });
  const target = `https://s1.xrpl.to/token/${encodeURIComponent(md5)}`;
  res.redirect(302, target);
});

// ========= XRPSCAN proxies =========
app.get('/api/xrpscan/token/:issuer/:currency', async (req, res) => {
  try {
    const { issuer, currency } = req.params;
    const code = decodeCurrencyHex(currency);
    if (!issuer || !currency || !code) return res.status(400).json({ error: 'issuer and currency (hex) required' });
    const url = `${XRPSCAN_BASE}/token/${encodeURIComponent(code)}.${encodeURIComponent(issuer)}`;
    log('debug', 'proxy.xrpscan.token.start', { url });
    const upstream = await fetch(url);
    res.status(upstream.status);
    upstream.headers.forEach((v, k) => { if (k.toLowerCase() === 'content-type') res.setHeader('content-type', v); });
    const body = await upstream.text();
    log('info', 'proxy.xrpscan.token.end', { status: upstream.status, bytes: body.length });
    res.send(body);
  } catch (err) {
    log('error', 'proxy.xrpscan.token.error', { error: String(err) });
    res.status(500).json({ error: 'upstream_error', message: String(err) });
  }
});

app.get('/api/xrpscan/account/:issuer/obligations', async (req, res) => {
  try {
    const { issuer } = req.params;
    const url = `${XRPSCAN_BASE}/account/${encodeURIComponent(issuer)}/obligations`;
    log('debug', 'proxy.xrpscan.obligations.start', { url });
    const upstream = await fetch(url);
    res.status(upstream.status);
    upstream.headers.forEach((v, k) => { if (k.toLowerCase() === 'content-type') res.setHeader('content-type', v); });
    const body = await upstream.text();
    log('info', 'proxy.xrpscan.obligations.end', { status: upstream.status, bytes: body.length });
    res.send(body);
  } catch (err) {
    log('error', 'proxy.xrpscan.obligations.error', { error: String(err) });
    res.status(500).json({ error: 'upstream_error', message: String(err) });
  }
});

app.get('/api/xrpscan/account/:issuer/assets', async (req, res) => {
  try {
    const { issuer } = req.params;
    const url = `${XRPSCAN_BASE}/account/${encodeURIComponent(issuer)}/assets`;
    const upstream = await fetch(url);
    res.status(upstream.status);
    upstream.headers.forEach((v, k) => { if (k.toLowerCase() === 'content-type') res.setHeader('content-type', v); });
    const body = await upstream.text();
    res.send(body);
  } catch (err) {
    res.status(500).json({ error: 'upstream_error', message: String(err) });
  }
});

app.get('/api/xrpscan/account/:issuer/transactions', async (req, res) => {
  try {
    const { issuer } = req.params;
    const { limit, marker } = req.query;
    const params = new URLSearchParams();
    if (limit) params.set('limit', String(limit));
    if (marker) params.set('marker', String(marker));
    const qs = params.toString();
    const url = `${XRPSCAN_BASE}/account/${encodeURIComponent(issuer)}/transactions${qs ? `?${qs}` : ''}`;
    const upstream = await fetch(url);
    res.status(upstream.status);
    upstream.headers.forEach((v, k) => { if (k.toLowerCase() === 'content-type') res.setHeader('content-type', v); });
    const body = await upstream.text();
    res.send(body);
  } catch (err) {
    res.status(500).json({ error: 'upstream_error', message: String(err) });
  }
});

// ========= On-chain endpoints =========

// GET /api/onchain/issuer/:issuer/summary
app.get('/api/onchain/issuer/:issuer/summary', async (req, res) => {
  try {
    const { issuer } = req.params;
    if (!issuer) return res.status(400).json({ error: 'issuer required' });
    const result = await withCache(`issuer_summary:${issuer}`, async () => {
      await ensureXRPLConnected();
      const t0 = Date.now();
      const accountInfo = await xrplClient.request({ command: 'account_info', account: issuer, ledger_index: 'validated' });
      log('info', 'xrpl.account_info.ok', { issuer, durationMs: Date.now() - t0 });
      const flags = accountInfo.result.account_data.Flags || 0;
      const transferRate = accountInfo.result.account_data.TransferRate || null;
      const domainHex = accountInfo.result.account_data.Domain || null;
      const domain = domainHex ? Buffer.from(domainHex, 'hex').toString('ascii') : null;
      const regularKey = accountInfo.result.account_data.RegularKey || null;
      const lsfDefaultRipple = 0x00800000;
      const lsfGlobalFreeze = 0x00400000;
      const lsfNoFreeze = 0x00200000;
      const lsfDisableMaster = 0x00100000;
      const summary = {
        account: issuer,
        flags: {
          defaultRipple: Boolean(flags & lsfDefaultRipple),
          globalFreeze: Boolean(flags & lsfGlobalFreeze),
          noFreeze: Boolean(flags & lsfNoFreeze),
          masterDisabled: Boolean(flags & lsfDisableMaster),
        },
        transferRate,
        tickSize: accountInfo.result.account_data.TickSize ?? null,
        ownerCount: accountInfo.result.account_data.OwnerCount ?? null,
        domain,
        regularKeySet: Boolean(regularKey),
      };
      return summary;
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'xrpl_error', message: String(err) });
  }
});

// GET /api/onchain/token/:issuer/:currency/holders?limit=..
app.get('/api/onchain/token/:issuer/:currency/holders', async (req, res) => {
  try {
    const { issuer, currency } = req.params;
    const limit = Math.min(parseInt(req.query.limit || '200', 10), 1000);
    if (!issuer || !currency) return res.status(400).json({ error: 'issuer and currency required' });
    const key = `holders:${issuer}:${currency}:${limit}`;
    const result = await withCache(key, async () => {
      await ensureXRPLConnected();
      // Decode currency hex (160-bit) into ASCII symbol if possible
      const hex = currency.toUpperCase();
      const bytes = hex.match(/.{1,2}/g) || [];
      const ascii = bytes.map(b => String.fromCharCode(parseInt(b, 16))).join('').replace(/\u0000+$/g, '');
      const symbol = ascii.replace(/[^\x20-\x7E]/g, '').trim();

      // Fetch issuer trust lines and filter by currency symbol
      let marker = undefined;
      const holders = [];
      let pages = 0;
      do {
        const t0 = Date.now();
        const resp = await xrplClient.request({
          command: 'account_lines', account: issuer, ledger_index: 'validated', limit: 400, marker
        });
        pages += 1;
        log('debug', 'xrpl.account_lines.page', { issuer, currencyHex: hex, pageLines: resp.result.lines?.length ?? 0, durationMs: Date.now() - t0, marker: Boolean(resp.result.marker) });
        for (const l of resp.result.lines) {
          const currencyMatchesSymbol = symbol && l.currency === symbol;
          const currencyMatchesHex = l.currency && l.currency.toUpperCase() === hex;
          if ((currencyMatchesSymbol || currencyMatchesHex)) {
            const issuerPerspectiveBalance = Number(l.balance) || 0;
            // When requesting from issuer perspective, obligations show as negative balances.
            const holderBalance = issuerPerspectiveBalance < 0 ? Math.abs(issuerPerspectiveBalance) : 0;
            if (holderBalance > 0) {
              holders.push({ account: l.account, balance: holderBalance });
            }
          }
        }
        marker = resp.result.marker;
        if (holders.length >= limit) break;
      } while (marker);
      holders.sort((a, b) => b.balance - a.balance);
      let total = holders.reduce((s, x) => s + x.balance, 0);
      let totalHolders = holders.length;
      let top = holders.slice(0, limit);
      let top10 = holders.slice(0, 10).reduce((s, x) => s + x.balance, 0);
      let top50 = holders.slice(0, 50).reduce((s, x) => s + x.balance, 0);

      // Fallback: if empty, approximate using XRPL.to holders count (no addresses)
      if (holders.length === 0) {
        const identifier = `${issuer}_${currency}`;
        try {
          const tok = await fetchXRPLtoToken(identifier);
          totalHolders = tok?.token?.holders ?? 0;
        } catch {}
      }

      log('info', 'holders.ok', { issuer, currencyHex: hex, pages, totalHolders, totalBalance: total });
      return {
        totalHolders,
        totalBalance: total,
        concentration: {
          top10Pct: total ? (top10 / total) * 100 : 0,
          top50Pct: total ? (top50 / total) * 100 : 0,
        },
        top,
      };
    });
    res.json(result);
  } catch (err) {
    log('error', 'holders.error', { error: String(err) });
    res.status(500).json({ error: 'xrpl_error', message: String(err) });
  }
});

// GET /api/onchain/token/:issuer/:currency/orderbook?counter=xrp
app.get('/api/onchain/token/:issuer/:currency/orderbook', async (req, res) => {
  try {
    const { issuer, currency } = req.params;
    const counter = (req.query.counter || 'xrp').toString();
    if (!issuer || !currency) return res.status(400).json({ error: 'issuer and currency required' });
    await ensureXRPLConnected();
    const takerGets = { currency, issuer };
    const takerPays = counter.toLowerCase() === 'xrp' ? { currency: 'XRP' } : (() => {
      try { const obj = JSON.parse(counter); return obj; } catch { return { currency: 'XRP' }; }
    })();
    const t0 = Date.now();
    const [bids, asks] = await Promise.all([
      xrplClient.request({ command: 'book_offers', ledger_index: 'validated', taker_pays: takerPays, taker_gets: takerGets, limit: 50 }),
      xrplClient.request({ command: 'book_offers', ledger_index: 'validated', taker_pays: takerGets, taker_gets: takerPays, limit: 50 }),
    ]);
    const mapOffers = (arr) => (arr.result.offers || []).map(o => ({
      price: o.quality ? Number(o.quality) : null,
      takerGets: o.TakerGets,
      takerPays: o.TakerPays,
      funded: o.owner_funds ?? null,
    }));
    const out = { bids: mapOffers(bids), asks: mapOffers(asks) };
    log('info', 'orderbook.ok', { issuer, currencyHex: currency, bids: out.bids.length, asks: out.asks.length, durationMs: Date.now() - t0 });
    res.json(out);
  } catch (err) {
    log('error', 'orderbook.error', { error: String(err) });
    res.status(500).json({ error: 'xrpl_error', message: String(err) });
  }
});

// GET /api/onchain/token/:issuer/:currency/amm
app.get('/api/onchain/token/:issuer/:currency/amm', async (req, res) => {
  try {
    const { issuer, currency } = req.params;
    if (!issuer || !currency) return res.status(400).json({ error: 'issuer and currency required' });
    const counter = (req.query.counter || 'xrp').toString();
    if (!xrplReady) await xrplClient.connect();
    const asset = { currency, issuer };
    const asset2 = counter.toLowerCase() === 'xrp' ? { currency: 'XRP' } : (() => {
      try { return JSON.parse(counter); } catch { return { currency: 'XRP' }; }
    })();

    try {
      const amm = await xrplClient.request({ command: 'amm_info', asset, asset2 });
      return res.json(amm.result);
    } catch (primaryErr) {
      // Try reversed order for safety
      try {
        const ammRev = await xrplClient.request({ command: 'amm_info', asset: asset2, asset2: asset });
        return res.json(ammRev.result);
      } catch (secondaryErr) {
        // Fallback to raw ledger_entry AMM node (both orders)
        try {
          const le = await xrplClient.request({ command: 'ledger_entry', amm: { asset, asset2 } });
          return res.json({ source: 'ledger_entry', ...le.result });
        } catch (tertiaryErr) {
          try {
            const leRev = await xrplClient.request({ command: 'ledger_entry', amm: { asset: asset2, asset2: asset } });
            return res.json({ source: 'ledger_entry', ...leRev.result });
          } catch (quaternaryErr) {
            return res.status(404).json({ no_pool: true, message: String(primaryErr || secondaryErr || tertiaryErr || quaternaryErr) });
          }
        }
      }
    }
  } catch (err) {
    res.status(404).json({ no_pool: true, message: String(err) });
  }
});

// Unified analyze endpoint
// GET /api/analyze/:issuer/:currency
app.get('/api/analyze/:issuer/:currency', async (req, res) => {
  try {
    const { issuer, currency } = req.params;
    const identifier = `${issuer}_${currency}`;
    const tAll = Date.now();
    log('info', 'analyze.start', { issuer, currency });
    let [tok, issuerSummary, holders, ob, amm] = await Promise.all([
      fetchXRPLtoToken(identifier).catch((e) => { log('warn', 'xrplto.token.error', { error: e?.message || String(e) }); return null; }),
      (async () => {
        try {
          await ensureXRPLConnected();
          const ai = await xrplClient.request({ command: 'account_info', account: issuer, ledger_index: 'validated' });
          const flags = ai.result.account_data.Flags || 0;
          const domainHex = ai.result.account_data.Domain || null;
          const domain = domainHex ? Buffer.from(domainHex, 'hex').toString('ascii') : null;
          const lsfDefaultRipple = 0x00800000;
          const lsfGlobalFreeze = 0x00400000;
          const lsfNoFreeze = 0x00200000;
          const lsfDisableMaster = 0x00100000;
          return {
            account: issuer,
            flags: {
              defaultRipple: Boolean(flags & lsfDefaultRipple),
              globalFreeze: Boolean(flags & lsfGlobalFreeze),
              noFreeze: Boolean(flags & lsfNoFreeze),
              masterDisabled: Boolean(flags & lsfDisableMaster),
            },
            ownerCount: ai.result.account_data.OwnerCount ?? null,
            transferRate: ai.result.account_data.TransferRate ?? null,
            tickSize: ai.result.account_data.TickSize ?? null,
            domain,
          };
        } catch (e) { log('warn', 'issuer.summary.error', { error: e?.message || String(e) }); return null; }
      })(),
      (async () => {
        const url = `${SELF_BASE_URL}/api/onchain/token/${issuer}/${currency}/holders?limit=50`;
        const t0 = Date.now();
        const r = await fetch(url);
        log('debug', 'analyze.holders.fetch', { status: r.status, durationMs: Date.now() - t0 });
        return r.ok ? r.json() : null;
      })(),
      (async () => {
        const url = `${SELF_BASE_URL}/api/onchain/token/${issuer}/${currency}/orderbook?counter=xrp`;
        const t0 = Date.now();
        const r = await fetch(url);
        log('debug', 'analyze.orderbook.fetch', { status: r.status, durationMs: Date.now() - t0 });
        return r.ok ? r.json() : null;
      })(),
      (async () => {
        const url = `${SELF_BASE_URL}/api/onchain/token/${issuer}/${currency}/amm`;
        const t0 = Date.now();
        const r = await fetch(url);
        log('debug', 'analyze.amm.fetch', { status: r.status, durationMs: Date.now() - t0 });
        return r.ok ? r.json() : null;
      })(),
    ]);
    // Fallback to XRPSCAN if xrpl.to did not return token
    if (!tok || !tok.token) {
      const xrpscanTok = await fetchXRPSCANToken(issuer, currency);
      if (xrpscanTok && xrpscanTok.token) {
        tok = xrpscanTok;
      }
    }
    const md5 = tok?.token?.md5 || null;
    const spark = md5 ? await fetchSparkline(md5) : null;
    log('info', 'analyze.summary', {
      issuer,
      currency,
      md5Present: Boolean(md5),
      tokenFields: tok?.token ? Object.keys(tok.token).length : 0,
      holdersTotal: holders?.totalHolders ?? null,
      bids: ob?.bids?.length ?? null,
      asks: ob?.asks?.length ?? null,
      ammPresent: Boolean(amm && !amm.no_pool),
      sparkPoints: spark?.data?.prices?.length ?? 0,
      durationMs: Date.now() - tAll,
    });
    const analysis = await aiAnalyze({ token: tok?.token || null, issuer: issuerSummary, holders, orderbook: ob, amm, sparkline: spark });
    res.json({ token: tok?.token || null, issuer: issuerSummary, holders, orderbook: ob, amm, sparkline: spark, ai: analysis });
  } catch (err) {
    log('error', 'analyze.error', { error: String(err) });
    res.status(500).json({ error: 'analyze_error', message: String(err) });
  }
});

app.listen(PORT, () => {
  log('info', 'server.start', { port: PORT });
});

// Serve frontend in production when DIST is present
try {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const distDir = path.resolve(__dirname, '../dist');
  app.use(express.static(distDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(distDir, 'index.html'));
  });
  log('info', 'static.enabled', { dir: distDir });
} catch (e) {
  log('warn', 'static.disabled', { error: e?.message || String(e) });
}
