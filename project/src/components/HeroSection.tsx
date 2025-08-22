import React from 'react';
import { Brain, Zap, Shield, TrendingUp } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section id="about" className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            AI-Powered <span className="text-green-400">XRP</span>
            <br />
            Token Analysis
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Advanced artificial intelligence meets blockchain analytics. Discover hidden patterns, 
            detect whale movements, and make informed decisions with our cutting-edge XRPL analysis platform.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-lg p-6 hover:border-green-500/40 transition-all duration-300">
            <Brain className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">AI Intelligence</h3>
            <p className="text-gray-400 text-sm">Machine learning algorithms for predictive token analysis</p>
          </div>
          <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-lg p-6 hover:border-green-500/40 transition-all duration-300">
            <Zap className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Real-time Data</h3>
            <p className="text-gray-400 text-sm">Live XRPL streams and instant market analysis</p>
          </div>
          <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-lg p-6 hover:border-green-500/40 transition-all duration-300">
            <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Risk Assessment</h3>
            <p className="text-gray-400 text-sm">Advanced risk evaluation and safety scoring</p>
          </div>
          <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-lg p-6 hover:border-green-500/40 transition-all duration-300">
            <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Whale Detection</h3>
            <p className="text-gray-400 text-sm">Track large holders and market manipulation</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-gradient-to-r from-green-600 to-green-500 text-black font-bold py-4 px-8 rounded-lg hover:from-green-500 hover:to-green-400 transition-all duration-300 transform hover:scale-105">
            Start Analysis
          </button>
          <button className="border border-green-500 text-green-400 font-bold py-4 px-8 rounded-lg hover:bg-green-500/10 transition-all duration-300">
            View Demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;