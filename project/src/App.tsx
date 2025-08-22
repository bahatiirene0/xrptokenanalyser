import MatrixRain from './components/MatrixRain';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import FooterSection from './components/FooterSection';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import TokenDoctorPage from './pages/TokenDoctorPage';

function RouteAwareMatrix() {
  const location = useLocation();
  return location.pathname === '/' ? <MatrixRain /> : null;
}

function App() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <BrowserRouter>
        <RouteAwareMatrix />
        <Navigation />
        <main className="relative z-10">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <HeroSection />

                  <section id="tokenomics" className="py-20 px-4 motion-safe:animate-fade-in-up">
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
                          <ul className="text-gray-300 text-sm space-y-2">
                            <li><span className="text-green-400 font-semibold">Total Supply</span>: 1,000,000</li>
                            <li><span className="text-green-400 font-semibold">Team Allocation</span>: 5%</li>
                            <li><span className="text-green-400 font-semibold">LP Burned</span>: 100%</li>
                            <li><span className="text-green-400 font-semibold">Taxes</span>: 0%</li>
                            <li><span className="text-green-400 font-semibold">Marketing & Partnerships</span>: 5%</li>
                          </ul>
                        </div>

                        <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-xl p-8">
                          <h3 className="text-2xl font-bold text-white mb-6">Token Utility</h3>
                          <ul className="text-gray-300 text-sm space-y-2">
                            <li><span className="text-green-400 font-semibold">AI Token Analysis</span>: Automated due diligence</li>
                            <li><span className="text-green-400 font-semibold">API Access</span>: For developers to build AI‑powered trading apps</li>
                            <li><span className="text-green-400 font-semibold">Governance Rights</span>: Community voting on upgrades</li>
                          </ul>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-lg p-6 text-center float-in" style={{animationDelay: '60ms'}}>
                          <h4 className="text-green-400 font-semibold mb-2">Total Supply</h4>
                          <p className="text-white text-2xl font-bold">1,000,000</p>
                          <p className="text-gray-400 text-sm">Fixed supply, no inflation</p>
                        </div>
                        <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-lg p-6 text-center float-in" style={{animationDelay: '90ms'}}>
                          <h4 className="text-green-400 font-semibold mb-2">LP Burned</h4>
                          <p className="text-white text-2xl font-bold">100%</p>
                          <p className="text-gray-400 text-sm">Locked liquidity</p>
                        </div>
                        <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-lg p-6 text-center float-in" style={{animationDelay: '120ms'}}>
                          <h4 className="text-green-400 font-semibold mb-2">Taxes</h4>
                          <p className="text-white text-2xl font-bold">0%</p>
                          <p className="text-gray-400 text-sm">No buy/sell tax</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section id="roadmap" className="py-20 px-4 bg-black/20 motion-safe:animate-fade-in-up">
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
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-green-400 to-green-600"></div>
                        <div className="space-y-12">
                          {/* Q1 2024 */}
                          <div className="relative flex items-center">
                            <div className="flex-1 pr-8 text-right">
                              <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-xl p-6 float-in" style={{animationDelay: '60ms'}}>
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
                              <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-xl p-6 float-in" style={{animationDelay: '90ms'}}>
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
                              <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-xl p-6 float-in" style={{animationDelay: '120ms'}}>
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
                              <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-xl p-6 float-in" style={{animationDelay: '150ms'}}>
                                <div className="flex items-center space-x-2 mb-3">
                                  <h3 className="text-xl font-bold text-white">Q4 2024</h3>
                                  <span className="bg-gray-500/20 text-gray-400 px-3 py-1 rounded-full text-sm font-bold">PLANNED</span>
                                </div>
                                <h4 className="text-green-400 font-semibold mb-2">Token Launch & Public Release</h4>
                                <ul className="text-gray-300 text-sm space-y-1">
                                  <li>• Token generation event</li>
                                  <li>• Marketing push & community shilling</li>
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
                              <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-xl p-6 float-in" style={{animationDelay: '180ms'}}>
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
                              <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-xl p-6 float-in" style={{animationDelay: '210ms'}}>
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

                  <section id="whitepaper" className="py-20 px-4 bg-black/20 motion-safe:animate-fade-in-up">
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
                </>
              }
            />
            <Route
              path="/tokendoctor"
              element={<TokenDoctorPage />}
            />
          </Routes>

        </main>
        <FooterSection />
      </BrowserRouter>
    </div>
  );
}

export default App;