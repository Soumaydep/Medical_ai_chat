import React from 'react';

const LanguageSelector = ({ selectedLanguage, onLanguageChange }) => {
  const languages = [
    { code: 'English', name: 'English', flag: '🇺🇸' },
    { code: 'Hindi', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
    { code: 'Bengali', name: 'বাংলা (Bengali)', flag: '🇧🇩' },
    { code: 'Spanish', name: 'Español', flag: '🇪🇸' },
    { code: 'French', name: 'Français', flag: '🇫🇷' },
    { code: 'German', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'Italian', name: 'Italiano', flag: '🇮🇹' },
    { code: 'Dutch', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'Russian', name: 'Русский', flag: '🇷🇺' },
    { code: 'Chinese', name: '中文 (简体)', flag: '🇨🇳' },
    { code: 'Japanese', name: '日本語', flag: '🇯🇵' },
    { code: 'Korean', name: '한국어', flag: '🇰🇷' },
    { code: 'Arabic', name: 'العربية', flag: '🇸🇦' },
    { code: 'Portuguese', name: 'Português', flag: '🇵🇹' },
    { code: 'Turkish', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'Polish', name: 'Polski', flag: '🇵🇱' },
    { code: 'Swedish', name: 'Svenska', flag: '🇸🇪' },
    { code: 'Norwegian', name: 'Norsk', flag: '🇳🇴' }
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-100 p-2 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            <div>
              <label htmlFor="language-select" className="text-sm font-semibold text-gray-800">
                🌍 Choose Output Language
              </label>
              <p className="text-xs text-gray-600">
                AI will explain medical terms in your selected language
              </p>
            </div>
          </div>
          
          <div className="flex-1 max-w-xs">
            <select
              id="language-select"
              value={selectedLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="w-full px-4 py-2 border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium bg-white"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-blue-200">
          <span className="text-sm font-medium text-gray-700">Current:</span>
          <span className="text-sm font-semibold text-blue-600">
            {languages.find(lang => lang.code === selectedLanguage)?.flag} {selectedLanguage}
          </span>
        </div>
      </div>
      
      <div className="mt-3 p-3 bg-blue-100 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-800 mb-1">✨ Multi-language Support:</h4>
        <p className="text-xs text-blue-700">
          The AI will provide medical explanations in your chosen language, making complex medical information accessible to speakers of different languages.
        </p>
      </div>
    </div>
  );
};

export default LanguageSelector; 