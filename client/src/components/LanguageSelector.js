import React from 'react';

const LanguageSelector = ({ selectedLanguage, onLanguageChange }) => {
  const languages = [
    { code: 'English', name: 'English', flag: '🇺🇸' },
    { code: 'Hindi', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
    { code: 'Bengali', name: 'বাংলা (Bengali)', flag: '🇧🇩' },
    { code: 'Spanish', name: 'Español', flag: '🇪🇸' },
    { code: 'French', name: 'Français', flag: '🇫🇷' },
    { code: 'German', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'Chinese', name: '中文', flag: '🇨🇳' },
    { code: 'Japanese', name: '日本語', flag: '🇯🇵' },
    { code: 'Arabic', name: 'العربية', flag: '🇸🇦' },
    { code: 'Portuguese', name: 'Português', flag: '🇵🇹' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          <label htmlFor="language-select" className="text-sm font-medium text-gray-700">
            Output Language:
          </label>
        </div>
        
        <div className="flex-1 max-w-xs">
          <select
            id="language-select"
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="text-xs text-gray-500">
          AI will explain medical terms in your selected language
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector; 