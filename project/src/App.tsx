import React from 'react';
import MatrixRain from './components/MatrixRain';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import AnalysisPanel from './components/AnalysisPanel';
import FooterSection from './components/FooterSection';

function App() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <MatrixRain />
      <Navigation />
      <main className="relative z-10">
        <HeroSection />
        <AnalysisPanel />

        <section id="purpose" className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Our <span className="text-green-400">Purpose</span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              We believe in democratizing AI-powered blockchain analysis and making advanced token evaluation 
              accessible to everyone. Our mission is to provide transparency, security, and artificial intelligence 
              in the rapidly evolving world of XRP and digital assets.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-lg p-6">
                <h3 className="text-green-400 font-semibold mb-3">AI Intelligence</h3>
                <p className="text-gray-400">Machine learning algorithms for predictive analysis</p>
              </div>
              <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-lg p-6">
                <h3 className="text-green-400 font-semibold mb-3">Real-time Data</h3>
                <p className="text-gray-400">Live XRPL streams and AMM pool monitoring</p>
              </div>
              <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-lg p-6">
                <h3 className="text-green-400 font-semibold mb-3">Technical Analysis</h3>
                <p className="text-gray-400">Advanced indicators and pattern recognition</p>
              </div>
              <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-lg p-6">
                <h3 className="text-green-400 font-semibold mb-3">Whale Tracking</h3>
                <p className="text-gray-400">Advanced detection of large holder activities</p>
              </div>
            </div>
          </div>
        </section>

        <section id="tokenomics" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-6">
                Token<span className="text-green-400">omics</span>
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                Comprehensive tokenomics structure designed for sustainable growth and community value
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Token Distribution</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Public Sale</p>
                      <p className="text-gray-400 text-sm">Available for community</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-bold text-xl">40%</p>
                      <div className="w-20 h-2 bg-gray-700 rounded-full mt-1">
                        <div className="w-2/5 h-full bg-green-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Development</p>
                      <p className="text-gray-400 text-sm">Platform development & AI research</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-bold text-xl">25%</p>
                      <div className="w-20 h-2 bg-gray-700 rounded-full mt-1">
                        <div className="w-1/4 h-full bg-green-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Team & Advisors</p>
                      <p className="text-gray-400 text-sm">Locked for 24 months</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-bold text-xl">15%</p>
                      <div className="w-20 h-2 bg-gray-700 rounded-full mt-1">
                        <div className="w-3/20 h-full bg-green-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Marketing & Partnerships</p>
                      <p className="text-gray-400 text-sm">Growth & ecosystem expansion</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-bold text-xl">10%</p>
                      <div className="w-20 h-2 bg-gray-700 rounded-full mt-1">
                        <div className="w-1/10 h-full bg-green-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Reserve Fund</p>
                      <p className="text-gray-400 text-sm">Emergency & future development</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-bold text-xl">10%</p>
                      <div className="w-20 h-2 bg-gray-700 rounded-full mt-1">
                        <div className="w-1/10 h-full bg-green-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Token Utility</h3>
                <div className="space-y-6">
                  <div className="p-4 bg-black/30 rounded-lg">
                    <h4 className="text-green-400 font-semibold mb-2">Premium Analysis Access</h4>
                    <p className="text-gray-400 text-sm">Unlock advanced AI features and real-time analytics</p>
                  </div>
                  <div className="p-4 bg-black/30 rounded-lg">
                    <h4 className="text-green-400 font-semibold mb-2">Governance Rights</h4>
                    <p className="text-gray-400 text-sm">Vote on platform upgrades and feature development</p>
                  </div>
                  <div className="p-4 bg-black/30 rounded-lg">
                    <h4 className="text-green-400 font-semibold mb-2">Staking Rewards</h4>
                    <p className="text-gray-400 text-sm">Earn rewards by staking tokens and supporting the network</p>
                  </div>
                  <div className="p-4 bg-black/30 rounded-lg">
                    <h4 className="text-green-400 font-semibold mb-2">API Access</h4>
                    <p className="text-gray-400 text-sm">Developer access to analysis APIs and data feeds</p>
                  </div>
                  <div className="p-4 bg-black/30 rounded-lg">
                    <h4 className="text-green-400 font-semibold mb-2">Fee Discounts</h4>
                    <p className="text-gray-400 text-sm">Reduced fees for premium services and analysis tools</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-lg p-6 text-center">
                <h4 className="text-green-400 font-semibold mb-2">Total Supply</h4>
                <p className="text-white text-2xl font-bold">1,000,000,000</p>
                <p className="text-gray-400 text-sm">Fixed supply, no inflation</p>
              </div>
              <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-lg p-6 text-center">
                <h4 className="text-green-400 font-semibold mb-2">Initial Price</h4>
                <p className="text-white text-2xl font-bold">$0.001</p>
                <p className="text-gray-400 text-sm">Fair launch pricing</p>
              </div>
              <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-lg p-6 text-center">
                <h4 className="text-green-400 font-semibold mb-2">Vesting Period</h4>
                <p className="text-white text-2xl font-bold">24 Months</p>
                <p className="text-gray-400 text-sm">Team & advisor lockup</p>
              </div>
            </div>
          </div>
        </section>

        <section id="roadmap" className="py-20 px-4 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-6">
                Development <span className="text-green-400">Roadmap</span>
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                Our strategic roadmap for building the most advanced AI-powered token analysis platform
              </p>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-green-400 to-green-600"></div>

              <div className="space-y-12">
                {/* Q1 2024 */}
                <div className="relative flex items-center">
                  <div className="flex-1 pr-8 text-right">
                    <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-xl p-6">
                      <div className="flex items-center justify-end space-x-2 mb-3">
                        <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-bold">COMPLETED</span>
                        <h3 className="text-xl font-bold text-white">Q1 2024</h3>
                      </div>
                      <h4 className="text-green-400 font-semibold mb-2">Foundation & Core Development</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Platform architecture design</li>
                        <li>• Basic AI analysis engine</li>
                        <li>• XRPL integration setup</li>
                        <li>• Technical indicator implementation</li>
                      </ul>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-400 rounded-full border-4 border-black"></div>
                  <div className="flex-1 pl-8"></div>
                </div>

                {/* Q2 2024 */}
                <div className="relative flex items-center">
                  <div className="flex-1 pr-8"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-400 rounded-full border-4 border-black"></div>
                  <div className="flex-1 pl-8">
                    <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-xl p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <h3 className="text-xl font-bold text-white">Q2 2024</h3>
                        <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-bold">COMPLETED</span>
                      </div>
                      <h4 className="text-green-400 font-semibold mb-2">Advanced Analytics & UI</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Whale detection algorithms</li>
                        <li>• Risk assessment framework</li>
                        <li>• Matrix-inspired UI design</li>
                        <li>• Real-time data streaming</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Q3 2024 */}
                <div className="relative flex items-center">
                  <div className="flex-1 pr-8 text-right">
                    <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-xl p-6">
                      <div className="flex items-center justify-end space-x-2 mb-3">
                        <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-bold">IN PROGRESS</span>
                        <h3 className="text-xl font-bold text-white">Q3 2024</h3>
                      </div>
                      <h4 className="text-green-400 font-semibold mb-2">AI Enhancement & Beta Launch</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Machine learning model training</li>
                        <li>• Predictive analytics engine</li>
                        <li>• Beta platform launch</li>
                        <li>• Community testing program</li>
                      </ul>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-400 rounded-full border-4 border-black animate-pulse"></div>
                  <div className="flex-1 pl-8"></div>
                </div>

                {/* Q4 2024 */}
                <div className="relative flex items-center">
                  <div className="flex-1 pr-8"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-400 rounded-full border-4 border-black"></div>
                  <div className="flex-1 pl-8">
                    <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-xl p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <h3 className="text-xl font-bold text-white">Q4 2024</h3>
                        <span className="bg-gray-500/20 text-gray-400 px-3 py-1 rounded-full text-sm font-bold">PLANNED</span>
                      </div>
                      <h4 className="text-green-400 font-semibold mb-2">Token Launch & Public Release</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Token generation event</li>
                        <li>• Public platform launch</li>
                        <li>• API marketplace opening</li>
                        <li>• Partnership integrations</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Q1 2025 */}
                <div className="relative flex items-center">
                  <div className="flex-1 pr-8 text-right">
                    <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-xl p-6">
                      <div className="flex items-center justify-end space-x-2 mb-3">
                        <span className="bg-gray-500/20 text-gray-400 px-3 py-1 rounded-full text-sm font-bold">PLANNED</span>
                        <h3 className="text-xl font-bold text-white">Q1 2025</h3>
                      </div>
                      <h4 className="text-green-400 font-semibold mb-2">Ecosystem Expansion</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Multi-chain support</li>
                        <li>• Advanced AI models</li>
                        <li>• Mobile application</li>
                        <li>• Institutional features</li>
                      </ul>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-400 rounded-full border-4 border-black"></div>
                  <div className="flex-1 pl-8"></div>
                </div>

                {/* Q2 2025 */}
                <div className="relative flex items-center">
                  <div className="flex-1 pr-8"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-400 rounded-full border-4 border-black"></div>
                  <div className="flex-1 pl-8">
                    <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-xl p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <h3 className="text-xl font-bold text-white">Q2 2025</h3>
                        <span className="bg-gray-500/20 text-gray-400 px-3 py-1 rounded-full text-sm font-bold">PLANNED</span>
                      </div>
                      <h4 className="text-green-400 font-semibold mb-2">Global Expansion & Innovation</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Global market expansion</li>
                        <li>• Advanced AI research lab</li>
                        <li>• Enterprise solutions</li>
                        <li>• Regulatory compliance tools</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="whitepaper" className="py-20 px-4 bg-black/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              <span className="text-green-400">Whitepaper</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Discover the AI algorithms, technical indicators, and methodology behind our advanced XRPL analysis platform.
            </p>
            <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-lg p-8">
              <h3 className="text-2xl font-semibold text-white mb-4">AI & Technical Overview</h3>
              <p className="text-gray-300 mb-6">
                Our platform leverages cutting-edge AI models, technical indicators (RSI, MACD, Bollinger Bands), 
                real-time XRPL transaction analysis, social sentiment tracking, and whale detection algorithms to deliver 
                comprehensive token evaluations with predictive insights and social intelligence.
              </p>
              <button className="bg-gradient-to-r from-green-600 to-green-500 text-black font-bold py-3 px-8 rounded-lg hover:from-green-500 hover:to-green-400 transition-all duration-300 transform hover:scale-105">
                Download AI Whitepaper
              </button>
            </div>
          </div>
        </section>

        <section id="tokendoctor" className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Token<span className="text-green-400">Doctor</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              AI-powered diagnostic tools for comprehensive XRP token health assessment, risk evaluation, and investment recommendations.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-lg p-6">
                <h3 className="text-green-400 font-semibold mb-3">AI Health Check</h3>
                <p className="text-gray-400">Complete AI diagnostic scan of token fundamentals, social sentiment, and market conditions</p>
              </div>
              <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-lg p-6">
                <h3 className="text-green-400 font-semibold mb-3">Smart Recommendations</h3>
                <p className="text-gray-400">AI-generated investment advice combining technical, social, and risk management strategies</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  );
}

export default App;