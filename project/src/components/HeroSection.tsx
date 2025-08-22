import React from 'react';
// Icons removed per design update (no icons shown)

const HeroSection: React.FC = () => {
  return (
    <section id="about" className="min-h-screen flex items-center justify-center px-4 pt-24 md:pt-28 pb-12">
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-10 md:mb-12 float-in" style={{animationDelay: '40ms'}}>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight font-futuristic tracking-wide">
            AI-Powered <span className="text-green-400">XRP</span>
            <br />
            Token Analysis
          </h1>
          <p className="text-base md:text-lg text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Advanced artificial intelligence meets blockchain analytics. Discover hidden patterns,
            detect whale movements, and make informed decisions with our cutting-edge XRPL analysis platform.
            This is a research project — experimental and continuously evolving.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 md:gap-8 mb-14">
          <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-lg p-6 hover:border-green-500/40 transition-all duration-300 float-in" style={{animationDelay: '70ms'}}>
            <h3 className="text-white font-semibold mb-1">TokenDoctor</h3>
            <p className="text-gray-400 text-sm">AI-powered due diligence at a glance</p>
          </div>
          <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-lg p-6 hover:border-green-500/40 transition-all duration-300 float-in" style={{animationDelay: '90ms'}}>
            <h3 className="text-white font-semibold mb-1">On‑chain Analysis</h3>
            <p className="text-gray-400 text-sm">Holders, orderbook, AMM pools and more</p>
          </div>
          <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-lg p-6 hover:border-green-500/40 transition-all duration-300 float-in" style={{animationDelay: '110ms'}}>
            <h3 className="text-white font-semibold mb-1">Risk Assessment</h3>
            <p className="text-gray-400 text-sm">Flags, concentration and protocol risks</p>
          </div>
          <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-lg p-6 hover:border-green-500/40 transition-all duration-300 float-in" style={{animationDelay: '130ms'}}>
            <h3 className="text-white font-semibold mb-1">AI Suggestions</h3>
            <p className="text-gray-400 text-sm">Agent Smith gives concise, cautious insights</p>
          </div>
        </div>

        <div className="mt-8 text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
          <p className="mb-6">
            We believe in democratizing AI-powered blockchain analysis and making advanced token evaluation
            accessible to everyone. Our mission is to provide transparency, security, and artificial intelligence
            in the rapidly evolving world of XRP and digital assets.
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-lg p-6 float-in" style={{animationDelay: '150ms'}}>
              <h3 className="text-green-400 font-semibold mb-2">AI‑Powered Analysis</h3>
              <p className="text-gray-400 text-sm">Concise, cautious insights from Agent Smith</p>
            </div>
            <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-lg p-6 float-in" style={{animationDelay: '170ms'}}>
              <h3 className="text-green-400 font-semibold mb-2">On‑chain Coverage</h3>
              <p className="text-gray-400 text-sm">Issuer flags, holders, AMM and orderbooks</p>
            </div>
            <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-lg p-6 float-in" style={{animationDelay: '190ms'}}>
              <h3 className="text-green-400 font-semibold mb-2">Risk & Governance</h3>
              <p className="text-gray-400 text-sm">Concentration, blackhole, freeze and fee context</p>
            </div>
            <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-lg p-6 float-in" style={{animationDelay: '210ms'}}>
              <h3 className="text-green-400 font-semibold mb-2">Future‑Proof</h3>
              <p className="text-gray-400 text-sm">Historical data & real‑time streams coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;