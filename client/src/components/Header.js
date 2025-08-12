import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';

const Header = () => {
  const { colors } = useTheme();
  
  return (
    <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-4">
            <Logo />
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                MediClarify AI
              </h1>
              <p className="text-blue-100 text-sm font-medium">
                Professional Medical Report Analysis Platform
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-blue-100 text-sm">
                <span className="font-semibold">AI-Powered</span> • Secure • Professional
              </div>
            </div>
            
            <LanguageSelector 
              selectedLanguage={selectedLanguage}
              onLanguageChange={onLanguageChange}
            />
            
            <ThemeToggle />
            
            <VoiceAssistant onVoiceInput={onVoiceInput} />
          </div>
        </div>
        
        <div className="pb-4">
          <div className="flex flex-wrap items-center justify-between">
            <nav className="flex space-x-8">
              <button
                onClick={() => onTabChange('main')}
                className={`text-sm font-medium transition-all duration-200 pb-2 border-b-2 ${
                  activeTab === 'main'
                    ? 'text-white border-white'
                    : 'text-blue-200 border-transparent hover:text-white hover:border-blue-300'
                }`}
              >
                Medical Analysis
              </button>
              <button
                onClick={() => onTabChange('dictionary')}
                className={`text-sm font-medium transition-all duration-200 pb-2 border-b-2 ${
                  activeTab === 'dictionary'
                    ? 'text-white border-white'
                    : 'text-blue-200 border-transparent hover:text-white hover:border-blue-300'
                }`}
              >
                Medical Dictionary
              </button>
              <button
                onClick={() => onTabChange('insights')}
                className={`text-sm font-medium transition-all duration-200 pb-2 border-b-2 ${
                  activeTab === 'insights'
                    ? 'text-white border-white'
                    : 'text-blue-200 border-transparent hover:text-white hover:border-blue-300'
                }`}
              >
                Health Insights
              </button>
              <button
                onClick={() => onTabChange('chatbot')}
                className={`text-sm font-medium transition-all duration-200 pb-2 border-b-2 ${
                  activeTab === 'chatbot'
                    ? 'text-white border-white'
                    : 'text-blue-200 border-transparent hover:text-white hover:border-blue-300'
                }`}
              >
                AI Assistant
              </button>
            </nav>
            
            <div className="flex items-center space-x-2 mt-2 md:mt-0">
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