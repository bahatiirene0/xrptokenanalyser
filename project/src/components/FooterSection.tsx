import React from 'react';
import { BarChart3, Twitter, Github, MessageCircle, Mail } from 'lucide-react';

const FooterSection: React.FC = () => {
  return (
    <footer className="bg-black/60 backdrop-blur-sm border-t border-green-500/20 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-black" />
              </div>
              <span className="text-green-400 font-bold text-xl tracking-wider">
                XRP <span className="text-white">TokenAnalyser</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              AI-powered blockchain analysis platform for the XRPL ecosystem.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" className="text-gray-400 hover:text-green-400 transition-colors">About</a></li>
              <li><a href="#purpose" className="text-gray-400 hover:text-green-400 transition-colors">Purpose</a></li>
              <li><a href="#tokendoctor" className="text-gray-400 hover:text-green-400 transition-colors">TokenDoctor</a></li>
              <li><a href="#whitepaper" className="text-gray-400 hover:text-green-400 transition-colors">Whitepaper</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#tokenomics" className="text-gray-400 hover:text-green-400 transition-colors">Tokenomics</a></li>
              <li><a href="#roadmap" className="text-gray-400 hover:text-green-400 transition-colors">Roadmap</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">API Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Developer Guide</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Community</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Bug Reports</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-500/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 XRP TokenAnalyser. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;