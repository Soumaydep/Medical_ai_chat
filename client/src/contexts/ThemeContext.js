import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('medai-theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  // Update document class and localStorage when theme changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('medai-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('medai-theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Theme-aware color schemes
  const theme = {
    isDarkMode,
    toggleTheme,
    colors: {
      // Background colors
      primary: isDarkMode ? 'bg-gray-900' : 'bg-white',
      secondary: isDarkMode ? 'bg-gray-800' : 'bg-gray-50',
      tertiary: isDarkMode ? 'bg-gray-700' : 'bg-gray-100',
      
      // Text colors
      textPrimary: isDarkMode ? 'text-white' : 'text-gray-900',
      textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
      textTertiary: isDarkMode ? 'text-gray-400' : 'text-gray-500',
      
      // Border colors
      border: isDarkMode ? 'border-gray-600' : 'border-gray-200',
      borderSecondary: isDarkMode ? 'border-gray-700' : 'border-gray-300',
      
      // Card backgrounds
      card: isDarkMode ? 'bg-gray-800' : 'bg-white',
      cardHover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
      
      // Input backgrounds
      input: isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
      inputFocus: isDarkMode ? 'focus:border-blue-400 focus:ring-blue-400' : 'focus:border-blue-500 focus:ring-blue-500',
      
      // Button variants
      buttonPrimary: isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white',
      buttonSecondary: isDarkMode ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900',
      buttonSuccess: isDarkMode ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white',
      buttonDanger: isDarkMode ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white',
      
      // Status colors
      success: isDarkMode ? 'bg-green-800 text-green-200 border-green-700' : 'bg-green-100 text-green-800 border-green-200',
      warning: isDarkMode ? 'bg-yellow-800 text-yellow-200 border-yellow-700' : 'bg-yellow-100 text-yellow-800 border-yellow-200',
      error: isDarkMode ? 'bg-red-800 text-red-200 border-red-700' : 'bg-red-100 text-red-800 border-red-200',
      info: isDarkMode ? 'bg-blue-800 text-blue-200 border-blue-700' : 'bg-blue-100 text-blue-800 border-blue-200',
      
      // Tab colors
      tabActive: isDarkMode ? 'bg-gray-700 text-blue-400 shadow-sm' : 'bg-white text-blue-600 shadow-sm',
      tabInactive: isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800',
      tabBackground: isDarkMode ? 'bg-gray-800' : 'bg-gray-100',
      
      // Medical specific colors
      medical: {
        blood: isDarkMode ? 'bg-red-800 text-red-200' : 'bg-red-100 text-red-800',
        kidney: isDarkMode ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-100 text-yellow-800',
        cardiovascular: isDarkMode ? 'bg-pink-800 text-pink-200' : 'bg-pink-100 text-pink-800',
        immune: isDarkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800',
        liver: isDarkMode ? 'bg-purple-800 text-purple-200' : 'bg-purple-100 text-purple-800',
        metabolic: isDarkMode ? 'bg-orange-800 text-orange-200' : 'bg-orange-100 text-orange-800',
      },
      
      // Gradient backgrounds
      gradients: {
        primary: isDarkMode ? 'from-gray-800 to-gray-900' : 'from-blue-50 to-indigo-50',
        secondary: isDarkMode ? 'from-gray-700 to-gray-800' : 'from-green-50 to-blue-50',
        accent: isDarkMode ? 'from-purple-800 to-indigo-800' : 'from-purple-50 to-indigo-50',
      }
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}; 