import React, { useState } from 'react';
import { Menu, X, BarChart3, FileText, Stethoscope, DollarSign, Map } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'TokenDoctor', icon: Stethoscope, to: '/tokendoctor' },
    { name: 'About', icon: BarChart3, to: '/' },
    { name: 'Tokenomics', icon: DollarSign, to: '/#tokenomics' },
    { name: 'Roadmap', icon: Map, to: '/#roadmap' },
    { name: 'Whitepaper', icon: FileText, to: '/#whitepaper' },
  ];
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-green-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-black" />
            </div>
            <span className="text-green-400 font-bold text-xl tracking-widest font-futuristic">
              XRP <span className="text-white">TokenAnalyser</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => {
                const isActive = item.to === location.pathname || (item.to.startsWith('/#') && location.pathname === '/');
                const className = `group flex items-center space-x-2 ${isActive ? 'text-green-400' : 'text-gray-300'} hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-green-500/10`;
                const isHash = item.to.includes('#');
                return isHash ? (
                  <a key={item.name} href={item.to} className={className}>
                    <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>{item.name}</span>
                  </a>
                ) : (
                  <Link key={item.name} to={item.to} className={className}>
                    <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-green-400 p-2 rounded-md transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-green-500/20">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const isHash = item.to.includes('#');
              const props = {
                className: 'flex items-center space-x-3 text-gray-300 hover:text-green-400 hover:bg-green-500/10 block px-3 py-2 rounded-md text-base font-medium transition-all duration-300',
                onClick: () => setIsMenuOpen(false),
              } as const;
              return isHash ? (
                <a key={item.name} href={item.to} {...props}>
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </a>
              ) : (
                <Link key={item.name} to={item.to} {...props}>
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;