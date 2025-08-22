import { TrendingUp, Activity, AlertTriangle, Brain, Zap } from 'lucide-react';

const AnalysisPanel: React.FC = () => {
  return (
    <section className="py-10 px-4 bg-black/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-6">
            AI <span className="text-green-400">Analysis</span> Dashboard
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Real-time AI-powered analysis combining technical indicators, whale activity, and market intelligence
          </p>
        </div>

        {/* Main Metrics Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-green-400 font-semibold">AI Score</h3>
              <Brain className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">87/100</div>
            <div className="flex items-center text-green-400 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+12% from yesterday</span>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-green-400 font-semibold">Risk Level</h3>
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-3xl font-bold text-yellow-400 mb-2">Medium</div>
            <div className="flex items-center text-gray-400 text-sm">
              <Activity className="w-4 h-4 mr-1" />
              <span>Volatility: 23%</span>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-green-400 font-semibold">Whale Activity</h3>
              <Zap className="w-5 h-5 text-red-400" />
            </div>
            <div className="text-3xl font-bold text-red-400 mb-2">High</div>
            <div className="flex items-center text-red-400 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>3 large transactions</span>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-green-400 font-semibold">Market Signal</h3>
              <Activity className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-green-400 mb-2">Bullish</div>
            <div className="flex items-center text-green-400 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>Strong momentum</span>
            </div>
          </div>
        </div>

        {/* Technical Analysis */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Technical Indicators</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                <div>
                  <p className="text-white font-medium">RSI (14)</p>
                  <p className="text-gray-400 text-sm">Relative Strength Index</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold text-xl">67.3</p>
                  <p className="text-green-400 text-sm">Bullish</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                <div>
                  <p className="text-white font-medium">MACD</p>
                  <p className="text-gray-400 text-sm">Moving Average Convergence</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold text-xl">+0.024</p>
                  <p className="text-green-400 text-sm">Buy Signal</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                <div>
                  <p className="text-white font-medium">Bollinger Bands</p>
                  <p className="text-gray-400 text-sm">Volatility Indicator</p>
                </div>
                <div className="text-right">
                  <p className="text-yellow-400 font-bold text-xl">Mid</p>
                  <p className="text-yellow-400 text-sm">Neutral</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">AI Predictions</h3>
            <div className="space-y-6">
              <div className="p-4 bg-black/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-green-400 font-semibold">24H Forecast</h4>
                  <span className="text-green-400 text-sm">85% Confidence</span>
                </div>
                <p className="text-white text-lg font-bold">+12.5% to +18.3%</p>
                <p className="text-gray-400 text-sm">Expected price range</p>
              </div>

              <div className="p-4 bg-black/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-green-400 font-semibold">7D Outlook</h4>
                  <span className="text-yellow-400 text-sm">72% Confidence</span>
                </div>
                <p className="text-white text-lg font-bold">+25% to +35%</p>
                <p className="text-gray-400 text-sm">Weekly projection</p>
              </div>

              <div className="p-4 bg-black/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-green-400 font-semibold">Key Signals</h4>
                  <span className="text-green-400 text-sm">Active</span>
                </div>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Volume spike detected (+340%)</li>
                  <li>• Whale accumulation pattern</li>
                  <li>• Technical breakout confirmed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalysisPanel;