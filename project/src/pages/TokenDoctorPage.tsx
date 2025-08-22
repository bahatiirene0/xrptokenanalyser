import React, { useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(CategoryScale, LinearScale, TimeScale, PointElement, LineElement, Tooltip, Filler);

type AnalyzeResponse = {
  token: any | null;
  issuer: any | null;
  holders: { totalHolders?: number; top?: Array<{ account: string; balance: number }>; concentration?: any } | null;
  orderbook: { bids?: any[]; asks?: any[] } | null;
  sparkline: { period?: string; percentChange?: string; data?: { prices?: string[] } } | null;
  ai: string | null;
  amm?: any | null;
};

function toHexCurrencyPadded(symbol: string): string {
  const ascii = symbol.trim();
  const hex = Array.from(ascii).map(ch => ch.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')).join('');
  return (hex + '0'.repeat(40)).slice(0, 40);
}

function hexToAscii(maybeHex: string): string {
  try {
    const bytes = (maybeHex || '').match(/.{1,2}/g) || [];
    return bytes.map(b => String.fromCharCode(parseInt(b, 16))).join('');
  } catch {
    return '';
  }
}

function decodeHexCurrencySymbol(hex: string): string {
  try {
    const ascii = hexToAscii(hex).replace(/\u0000+$/g, '');
    const cleaned = ascii.replace(/[^\x20-\x7E]/g, '').trim();
    return cleaned || hex;
  } catch {
    return hex;
  }
}

function dropsToXrp(drops: string | number): number {
  const n = typeof drops === 'string' ? Number(drops) : drops;
  if (!isFinite(n)) return 0;
  return n / 1_000_000;
}

function parseInputToIdentifier(input: string): { issuer: string; currencyHex: string } | null {
  const s = input.trim();
  // direct identifier
  if (/^r[1-9A-HJ-NP-Za-km-z]{24,35}_[0-9A-Fa-f]{40}$/.test(s)) {
    const [issuer, currencyHex] = s.split('_');
    return { issuer, currencyHex: currencyHex.toUpperCase() };
  }
  try {
    const url = new URL(s);
    const parts = url.pathname.split('/').filter(Boolean);
    // xrpl.to/token/<issuer>-<hex>
    if (url.hostname.includes('xrpl.to') && parts[0] === 'token' && parts[1]?.includes('-')) {
      const [issuer, currencyHex] = parts[1].split('-');
      if (issuer && currencyHex) return { issuer, currencyHex: currencyHex.toUpperCase() };
    }
    // firstledger.net/token/<issuer>/<symbol-or-hex>
    if (url.hostname.includes('firstledger') && parts[0] === 'token' && parts[1] && parts[2]) {
      const issuer = parts[1];
      const raw = parts[2].trim();
      // Handle three cases robustly:
      // 1) Already a 40-char hex: use as-is (uppercased)
      // 2) Double-hex-encoded (e.g. '3432..' which decodes to '4249..'): decode once if the result is a 40-char hex
      // 3) Plain symbol (e.g. 'BITE'): convert to 160-bit hex and pad
      const isHex40 = /^[0-9A-Fa-f]{40}$/.test(raw);
      if (isHex40) {
        // Check for accidental double-hex encoding and correct it
        const decoded = hexToAscii(raw);
        if (/^[0-9A-Fa-f]{40}$/.test(decoded)) {
          return { issuer, currencyHex: decoded.toUpperCase() };
        }
        return { issuer, currencyHex: raw.toUpperCase() };
      }
      // Accept shorter even-length hex and pad (defensive)
      if (/^[0-9A-Fa-f]+$/.test(raw) && raw.length % 2 === 0 && raw.length <= 40) {
        return { issuer, currencyHex: (raw.toUpperCase() + '0'.repeat(40)).slice(0, 40) };
      }
      return { issuer, currencyHex: toHexCurrencyPadded(raw) };
    }
  } catch (_) {}
  return null;
}

const TokenDoctorPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [typedAi, setTypedAi] = useState<string>('');
  const [data, setData] = useState<AnalyzeResponse | null>(null);
  const debug = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debug');

  const debugLog = (...args: any[]) => {
    if (debug) {
      // eslint-disable-next-line no-console
      console.log('[TokenDoctor][debug]', ...args);
    }
  };

  const identifier = useMemo(() => (query ? parseInputToIdentifier(query) : null), [query]);

  const handleAnalyze = async () => {
    setError(null);
    setData(null);
    const id = identifier;
    if (!id) {
      setError('Enter an identifier (issuer_currencyHex) or a supported URL');
      return;
    }
    setLoading(true);
    setProgress(0);
    setPhase('Fetching token & on-chain data…');
    try {
      const t0 = performance.now();
      debugLog('analyze.request.start', { issuer: id.issuer, currencyHex: id.currencyHex });
      const base = (import.meta as any).env?.VITE_API_BASE || '';
      const progressTimer = setInterval(() => setProgress((p) => Math.min(90, p + Math.random() * 7 + 2)), 180);
      const res = await fetch(`${base}/api/analyze/${id.issuer}/${id.currencyHex}`);
      const t1 = performance.now();
      debugLog('analyze.request.end', { ok: res.ok, status: res.status, durationMs: Math.round(t1 - t0) });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const json: AnalyzeResponse = await res.json();
      setPhase('Fetching AMM pool…');
      setProgress((p) => Math.max(p, 60));
      // Fallback: fetch AMM info if not present in analyze payload
      if (!json.amm) {
        try {
          const ammRes = await fetch(`${base}/api/onchain/token/${id.issuer}/${id.currencyHex}/amm`);
          if (ammRes.ok) {
            const amm = await ammRes.json();
            (json as any).amm = amm;
          }
        } catch {}
      }
      setPhase('AI analysis…');
      setProgress((p) => Math.max(p, 85));
      debugLog('analyze.response.summary', {
        tokenFields: json?.token ? Object.keys(json.token).length : 0,
        holdersTotal: json?.holders?.totalHolders ?? null,
        bids: json?.orderbook?.bids?.length ?? 0,
        asks: json?.orderbook?.asks?.length ?? 0,
        ammPresent: Boolean((json as any)?.amm && !(json as any)?.amm?.no_pool),
        sparkPoints: json?.sparkline?.data?.prices?.length ?? 0,
      });
      setData(json);
      // Prepare word-by-word typing
      if (json.ai) {
        const words = json.ai.split(/(\s+)/);
        setTypedAi('');
        let i = 0;
        const step = () => {
          setTypedAi((prev) => prev + (words[i] || ''));
          i += 1;
          if (i < words.length) {
            const delay = words[i]?.trim() === '' ? 20 : 45; // faster on spaces
            window.setTimeout(step, delay);
          }
        };
        window.setTimeout(step, 180);
      }
      setProgress(100);
      clearInterval(progressTimer);
    } catch (e: any) {
      setError(e.message || 'Failed to analyze token');
      debugLog('analyze.error', e?.message || e);
    } finally {
      setLoading(false);
      setTimeout(() => { setPhase(null); setProgress(0); }, 600);
    }
  };

  const verdict = useMemo(() => {
    if (!data) return null;
    const change = Number(data.token?.pro24h ?? 0);
    const riskyFlags = Boolean(data.issuer?.flags?.globalFreeze);
    const masterDisabled = Boolean(data.issuer?.flags?.masterDisabled); // Blackholed if true
    const holders = Number(data.token?.holders ?? data.holders?.totalHolders ?? 0);
    if (riskyFlags) return { label: 'High Risk', color: 'text-red-400' };
    if (masterDisabled) {
      if (holders > 1000 && change >= 0) return { label: 'Good', color: 'text-green-400' };
      return { label: 'Speculative', color: 'text-yellow-400' };
    }
    if (holders > 300 && change > -10) return { label: 'Speculative', color: 'text-yellow-400' };
    return { label: 'High Risk', color: 'text-red-400' };
  }, [data]);

  const chart = useMemo(() => {
    const prices = (data as any)?.sparkline?.data?.prices || [];
    const ts = (data as any)?.sparkline?.data?.timestamps || [];
    const points = (prices as Array<string | number>).map((p: string | number, i: number) => ({ x: ts[i] ? Number(ts[i]) : i, y: Number(p) }));
    return {
      data: {
        datasets: [
          {
            data: points,
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34,197,94,0.15)',
            fill: true,
            borderWidth: 1,
            pointRadius: 0,
            tension: 0.2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: true } },
        scales: { x: { type: ts.length ? 'time' : 'category', display: false }, y: { display: false } },
      } as const,
    };
  }, [data]);

  return (
    <section id="tokendoctor" className="py-20 px-4">
      <div className="max-w-5xl mx-auto text-center mb-10">
        <h2 className="text-4xl font-bold text-white mb-4">Token<span className="text-green-400">Doctor</span></h2>
        <p className="text-gray-300 text-lg mb-6">Paste a token link or identifier to run analysis.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="issuer_currencyHex or xrpl.to / firstledger URL"
            className="w-full sm:w-2/3 px-4 py-3 rounded-lg bg-black/40 border border-green-500/30 text-gray-200 focus:outline-none focus:border-green-500"
          />
          <button onClick={handleAnalyze} disabled={loading} className="bg-gradient-to-r from-green-600 to-green-500 text-black font-bold px-6 py-3 rounded-lg hover:from-green-500 hover:to-green-400 transition-all">
            {loading ? 'Analyzing…' : 'Analyze Token'}
          </button>
        </div>
        {loading && (
          <div className="mt-4 mx-auto max-w-md text-left">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>{phase || 'Loading…'}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-black/40 border border-green-500/20 rounded overflow-hidden shimmer">
              <div className="h-full bg-green-500/50" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
        {identifier && (
          <div className="mt-2 text-xs text-gray-400">Parsed: {identifier.issuer}_{identifier.currencyHex}</div>
        )}
        {error && <div className="mt-3 text-red-400 text-sm">{error}</div>}
      </div>

      {data && (
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-black/40 border border-green-500/20 rounded-lg p-6 text-left">
              <div className="text-gray-400 text-sm mb-1">Token</div>
              <div className="text-white text-xl font-bold">{data.token?.name || 'Unknown'}</div>
              <div className="text-gray-500 text-xs break-all">{data.token?.issuer}</div>
            </div>
            <div className="bg-black/40 border border-green-500/20 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-1">Price (USD)</div>
              <div className="text-white text-2xl font-bold">{data.token?.usd ? Number(data.token.usd).toFixed(8) : '—'}</div>
              <div className="text-gray-500 text-xs">24h: {data.token?.pro24h != null ? `${Number(data.token.pro24h).toFixed(2)}%` : '—'}</div>
            </div>
            <div className="bg-black/40 border border-green-500/20 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-1">Market Cap</div>
              <div className="text-white text-2xl font-bold">{data.token?.marketcap ? Number(data.token.marketcap).toLocaleString() : '—'}</div>
              <div className="text-gray-500 text-xs">Holders: {data.token?.holders ?? data.holders?.totalHolders ?? '—'}</div>
            </div>
            <div className="bg-black/40 border border-green-500/20 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-1">Verdict</div>
              <div className={`text-2xl font-bold ${verdict?.color}`}>{verdict?.label || '—'}</div>
              <div className="text-gray-500 text-xs">Flags: {data.issuer?.flags ? (data.issuer.flags.globalFreeze ? 'GlobalFreeze ' : '') + (data.issuer.flags.masterDisabled ? 'Blackholed' : 'MasterKey Enabled') : '—'}</div>
            </div>
          </div>

          {/* Suggestion moved below cards; will render after AMM section */}

          {/* AI Analysis moved below AMM */}

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-black/40 border border-green-500/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Orderbook Snapshot</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-400 mb-1">Top Bids</div>
                  <ul className="space-y-1">
                    {(data.orderbook?.bids || []).slice(0, 5).map((b, i) => (
                      <li key={i} className="flex justify-between"><span className="text-green-400">{b.price ?? '—'}</span><span className="text-gray-400">qty: {b.takerGets?.value || '—'}</span></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">Top Asks</div>
                  <ul className="space-y-1">
                    {(data.orderbook?.asks || []).slice(0, 5).map((a, i) => (
                      <li key={i} className="flex justify-between"><span className="text-red-400">{a.price ?? '—'}</span><span className="text-gray-400">qty: {a.takerPays?.value || a.takerGets || '—'}</span></li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-black/40 border border-green-500/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Sparkline</h3>
              <div className="text-gray-400 text-sm mb-2">Period: {data.sparkline?.period || '—'} | Points: {data.sparkline?.data?.prices?.length ?? 0}</div>
              <div className="h-28">
                {data.sparkline?.data?.prices?.length ? (
                  <Line data={chart.data} options={chart.options} />
                ) : (
                  <div className="h-full bg-black/30 rounded flex items-center justify-center text-gray-500 text-sm">No data</div>
                )}
              </div>
            </div>
          </div>

          {/* AMM Pool Section */}
          <div className="bg-black/40 border border-green-500/20 rounded-xl p-6 text-left">
            <h3 className="text-xl font-semibold text-white mb-3">AMM Pool</h3>
            {((data as any)?.amm && !(data as any)?.amm?.no_pool) ? (() => {
              const amm = (data as any)?.amm?.amm || (data as any)?.amm;
              const amount = amm?.amount; // token side
              const amount2 = amm?.amount2; // counter side
              const tokenSymbol = decodeHexCurrencySymbol((amount?.currency as string) || '');
              const tokenReserve = Number(amount?.value || 0);
              const counterIsXRP = typeof amount2 === 'string';
              const counterReserve = counterIsXRP ? dropsToXrp(String(amount2)) : Number((amount2 as any)?.value || 0);
              const counterSymbol = counterIsXRP ? 'XRP' : decodeHexCurrencySymbol((amount2 as any)?.currency || '');
              const tradingFee = amm?.trading_fee ?? '—';
              return (
                <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-300">
                  <div>
                    <div className="text-gray-400">Reserves</div>
                    <div className="text-white break-words">{tokenReserve.toLocaleString(undefined, { maximumFractionDigits: 6 })} {tokenSymbol} / {counterReserve.toLocaleString(undefined, { maximumFractionDigits: 6 })} {counterSymbol}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">LP Token</div>
                    <div className="text-white break-all">{amm?.lp_token?.currency || '—'}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Trading Fee</div>
                    <div className="text-white">{tradingFee}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Vote Slots</div>
                    <div className="text-white">{amm?.vote_slots?.length ?? 0}</div>
                  </div>
                </div>
              );
            })() : (
              <div className="text-gray-400">No AMM pool found for XRP pair.</div>
            )}
          </div>

          {/* Suggestion (moved under AMM) */}
          <div className="bg-black/40 border border-green-500/20 rounded-xl p-6 text-left">
            <h3 className="text-xl font-semibold text-white mb-2">Suggestion</h3>
            <div className="text-gray-200 mb-2">Overall: <span className={`font-bold ${verdict?.color}`}>{verdict?.label || '—'}</span></div>
            <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
              <li>Issuer flags: {data.issuer?.flags ? (data.issuer.flags.masterDisabled ? 'Master key disabled' : 'Master key enabled') + (data.issuer.flags.globalFreeze ? ', Global Freeze' : '') : 'unknown'}.</li>
              <li>Holders: {data.token?.holders ?? data.holders?.totalHolders ?? 'unknown'}.</li>
              <li>24h change: {data.token?.pro24h != null ? `${Number(data.token.pro24h).toFixed(2)}%` : 'unknown'}.</li>
              <li>Liquidity: {((data.orderbook?.bids?.length || 0) + (data.orderbook?.asks?.length || 0)) > 0 ? 'orderbook present' : 'unknown'}.</li>
              <li>Note: where data is limited, interpretations are directional and not definitive.</li>
            </ul>
          </div>

          {/* AI Analysis card with word-by-word typing animation */}
          {data.ai && (
            <div className="bg-black/40 border border-green-500/20 rounded-xl p-6 text-left">
              <h3 className="text-2xl font-bold text-green-400 mb-3">AI Analysis</h3>
              <div className="text-green-300 whitespace-pre-wrap leading-relaxed text-sm" style={{maxWidth: '100%'}}>
                {typedAi}
                <span className="caret" />
              </div>
              {/* Mini Q&A chat (up to 3 messages) */}
              <ChatBox issuer={(data.token as any)?.issuer || ''} currency={(data.token as any)?.currency || ''} />
            </div>
          )}

          {debug && (
            <div className="bg-black/60 border border-yellow-400/30 rounded-xl p-4 text-left">
              <div className="text-yellow-300 font-semibold mb-2">Debug</div>
              <pre className="text-xs text-yellow-200 overflow-auto max-h-72">
{JSON.stringify({
  parsed: identifier,
  tokenFields: data?.token ? Object.keys(data.token).length : 0,
  holdersTotal: data?.holders?.totalHolders ?? null,
  bids: data?.orderbook?.bids?.length ?? 0,
  asks: data?.orderbook?.asks?.length ?? 0,
  sparkPoints: data?.sparkline?.data?.prices?.length ?? 0,
  issuerFlags: data?.issuer?.flags ?? null,
}, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default TokenDoctorPage;

// Inline lightweight chat box component
const ChatBox: React.FC<{ issuer: string; currency: string }> = ({ issuer, currency }) => {
  const [q, setQ] = useState('');
  const [msgs, setMsgs] = useState<Array<{ from: 'user' | 'ai'; text: string }>>([]);
  const [busy, setBusy] = useState(false);
  const canAsk = msgs.filter(m => m.from === 'user').length < 3;
  const base = (import.meta as any).env?.VITE_API_BASE || '';

  const ask = async () => {
    if (!q.trim() || !canAsk || busy) return;
    const question = q.trim();
    setQ('');
    setMsgs(m => [...m, { from: 'user', text: question }]);
    setBusy(true);
    try {
      const r = await fetch(`${base}/api/ask`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ issuer, currency, question, history: msgs }),
      });
      const j = await r.json();
      const answer: string = j?.answer || 'No answer available.';
      // word-by-word typing for follow-up answers
      const words = answer.split(/(\s+)/);
      let i = 0;
      setMsgs(m => [...m, { from: 'ai', text: '' }]);
      const step = () => {
        setMsgs(m => {
          const copy = m.slice();
          const last = copy.pop();
          if (!last) return m;
          copy.push({ from: 'ai', text: (last.text || '') + (words[i] || '') });
          return copy;
        });
        i += 1;
        if (i < words.length) {
          const delay = words[i]?.trim() === '' ? 18 : 40;
          window.setTimeout(step, delay);
        }
      };
      window.setTimeout(step, 150);
    } catch (e: any) {
      setMsgs(m => [...m, { from: 'ai', text: 'Sorry — failed to get an answer.' }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-5 border-t border-green-500/10 pt-4">
      <div className="text-xs text-gray-400 mb-2">Ask up to 3 follow-up questions. Responses are suggestive, not financial advice.</div>
      <div className="space-y-2 max-h-48 overflow-auto pr-1">
        {msgs.map((m, i) => (
          <div key={i} className={m.from === 'user' ? 'text-right' : 'text-left'}>
            <span className={m.from === 'user' ? 'inline-block bg-green-500/20 text-green-200 px-3 py-2 rounded-lg' : 'inline-block bg-black/50 text-green-300 px-3 py-2 rounded-lg text-sm'}>
              {m.text}
              {m.from === 'ai' && i === msgs.length - 1 && busy && <span className="caret" />}
            </span>
          </div>
        ))}
        {busy && <div className="text-gray-400 text-xs">AI is thinking…</div>}
      </div>
      <div className="mt-3 flex gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={canAsk ? 'Ask a question…' : 'Question limit reached'} className="flex-1 px-3 py-2 rounded bg-black/40 border border-green-500/20 text-gray-200 focus:outline-none focus:border-green-500" disabled={!canAsk || busy} />
        <button onClick={ask} disabled={!canAsk || busy || !q.trim()} className="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-black font-semibold rounded">
          Ask
        </button>
      </div>
    </div>
  );
};
