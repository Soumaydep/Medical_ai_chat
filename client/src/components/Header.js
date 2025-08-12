import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-4">
            <Logo />
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Medical AI Assistant
              </h1>
              <p className="text-blue-100 text-sm font-medium">
                AI-Powered Medical Document Analysis
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-blue-100 text-sm">
                <span className="font-semibold">AI-Powered</span> • Secure • Professional
              </div>
            </div>
            
            <ThemeToggle />
            
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-100 text-xs font-medium">System Online</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 