import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import config from '../config';

const MedicalDictionary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const { colors } = useTheme();

  // Built-in dictionary for demo purposes
  const builtInTerms = {
    'hemoglobin': {
      pronunciation: 'HEE-muh-glow-bin',
      definition: 'A protein in red blood cells that carries oxygen throughout your body',
      category: 'blood',
      normalRange: '12-16 g/dL (women), 14-18 g/dL (men)',
      significance: 'Low levels may indicate anemia, high levels may suggest dehydration or lung disease',
      relatedTerms: ['anemia', 'red blood cells', 'oxygen'],
      audioAvailable: true
    },
    'creatinine': {
      pronunciation: 'kree-AT-uh-neen',
      definition: 'A waste product filtered by your kidneys, used to measure kidney function',
      category: 'kidney',
      normalRange: '0.6-1.2 mg/dL',
      significance: 'High levels may indicate kidney problems',
      relatedTerms: ['kidney function', 'BUN', 'eGFR'],
      audioAvailable: true
    },
    'triglycerides': {
      pronunciation: 'try-GLIS-ur-ides',
      definition: 'A type of fat in your blood that provides energy to your body',
      category: 'cardiovascular',
      normalRange: 'Less than 150 mg/dL',
      significance: 'High levels increase risk of heart disease and stroke',
      relatedTerms: ['cholesterol', 'HDL', 'LDL'],
      audioAvailable: true
    },
    'lymphocytes': {
      pronunciation: 'LIM-fuh-sites',
      definition: 'White blood cells that help fight infections and diseases',
      category: 'immune',
      normalRange: '20-40% of total white blood cells',
      significance: 'High levels may indicate viral infection or immune disorders',
      relatedTerms: ['white blood cells', 'immune system', 'infection'],
      audioAvailable: true
    },
    'bilirubin': {
      pronunciation: 'bil-ih-ROO-bin',
      definition: 'A yellow substance produced when red blood cells break down',
      category: 'liver',
      normalRange: '0.3-1.2 mg/dL',
      significance: 'High levels may indicate liver problems or blood disorders',
      relatedTerms: ['liver function', 'jaundice', 'red blood cells'],
      audioAvailable: true
    },
    'glucose': {
      pronunciation: 'GLOO-kose',
      definition: 'A simple sugar that serves as the main source of energy for your body',
      category: 'metabolic',
      normalRange: '70-100 mg/dL (fasting)',
      significance: 'High levels may indicate diabetes or prediabetes',
      relatedTerms: ['diabetes', 'insulin', 'blood sugar'],
      audioAvailable: true
    },
    'platelets': {
      pronunciation: 'PLAYT-lets',
      definition: 'Small blood cells that help with blood clotting',
      category: 'blood',
      normalRange: '150,000-450,000 per microliter',
      significance: 'Low levels increase bleeding risk, high levels increase clotting risk',
      relatedTerms: ['blood clotting', 'bleeding', 'thrombocytes'],
      audioAvailable: true
    }
  };

  const searchTerms = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    const queryLower = query.toLowerCase();
    const results = [];

    // Search built-in terms
    Object.keys(builtInTerms).forEach(term => {
      const termData = builtInTerms[term];
      if (term.includes(queryLower) || 
          termData.definition.toLowerCase().includes(queryLower) ||
          termData.category.toLowerCase().includes(queryLower) ||
          termData.relatedTerms.some(related => related.toLowerCase().includes(queryLower))) {
        results.push({
          term,
          ...termData
        });
      }
    });

    setTimeout(() => {
      setSearchResults(results);
      setIsLoading(false);
    }, 300);
  };

  const handleSearch = (query) => {
    setSearchTerm(query);
    searchTerms(query);
    
    // Add to recent searches
    if (query.trim() && !recentSearches.includes(query.trim())) {
      setRecentSearches(prev => [query.trim(), ...prev.slice(0, 4)]);
    }
  };

  const speakPronunciation = (term, pronunciation) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(term);
      utterance.rate = 0.7;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      blood: '🩸',
      kidney: '🫘',
      cardiovascular: '❤️',
      immune: '🛡️',
      liver: '🫀',
      metabolic: '🔥',
      default: '🔬'
    };
    return icons[category] || icons.default;
  };

  const getCategoryColor = (category) => {
    const colors = {
      blood: 'bg-red-100 text-red-800',
      kidney: 'bg-yellow-100 text-yellow-800',
      cardiovascular: 'bg-pink-100 text-pink-800',
      immune: 'bg-green-100 text-green-800',
      liver: 'bg-purple-100 text-purple-800',
      metabolic: 'bg-orange-100 text-orange-800',
      default: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.default;
  };

  const popularTerms = ['hemoglobin', 'creatinine', 'cholesterol', 'glucose', 'platelets'];

  return (
    <div className={`${colors.card} rounded-lg shadow-md p-6 transition-all duration-300`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-indigo-100 dark:bg-indigo-800 p-3 rounded-lg transition-all duration-300">
          <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div>
          <h3 className={`text-xl font-semibold ${colors.textPrimary}`}>📚 Medical Dictionary</h3>
          <p className={`text-sm ${colors.textSecondary}`}>Search medical terms with pronunciations and explanations</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search medical terms (e.g., hemoglobin, creatinine, glucose...)"
            className={`w-full px-4 py-3 pl-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ${colors.input} ${colors.inputFocus}`}
          />
          <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {isLoading && (
            <div className="absolute right-4 top-3.5">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
            </div>
          )}
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && !searchTerm && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">Recent searches:</p>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((recent, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(recent)}
                  className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {recent}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Popular Terms */}
        {!searchTerm && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-3">🔥 Popular medical terms:</p>
            <div className="flex flex-wrap gap-2">
              {popularTerms.map((term) => (
                <button
                  key={term}
                  onClick={() => handleSearch(term)}
                  className="px-3 py-2 text-sm bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors capitalize"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">Search Results ({searchResults.length})</h4>
          {searchResults.map((result, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors cursor-pointer"
              onClick={() => setSelectedTerm(result)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h5 className="text-lg font-semibold text-gray-800 capitalize">{result.term}</h5>
                    <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(result.category)}`}>
                      {getCategoryIcon(result.category)} {result.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm text-gray-600">🔊 {result.pronunciation}</span>
                    {result.audioAvailable && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          speakPronunciation(result.term, result.pronunciation);
                        }}
                        className="p-1 text-indigo-600 hover:text-indigo-800 transition-colors"
                        title="Listen to pronunciation"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.814L4.043 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.043l4.34-3.814a1 1 0 011 .814zM12.55 5.22a.75.75 0 00-1.06 1.06L13.44 8.22a.75.75 0 101.06-1.06L12.55 5.22zm2.83 2.83a.75.75 0 10-1.06 1.06l1.06 1.06a.75.75 0 101.06-1.06l-1.06-1.06z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-2">{result.definition}</p>
                  
                  {result.normalRange && (
                    <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded inline-block">
                      Normal: {result.normalRange}
                    </div>
                  )}
                </div>
                
                <button className="text-indigo-600 hover:text-indigo-800 ml-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Term View */}
      {selectedTerm && (
        <div className="mt-6 p-6 bg-indigo-50 rounded-lg border border-indigo-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xl font-semibold text-indigo-800 capitalize">{selectedTerm.term}</h4>
            <button
              onClick={() => setSelectedTerm(null)}
              className="text-indigo-600 hover:text-indigo-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 text-sm rounded-full ${getCategoryColor(selectedTerm.category)}`}>
                {getCategoryIcon(selectedTerm.category)} {selectedTerm.category}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">🔊 {selectedTerm.pronunciation}</span>
                {selectedTerm.audioAvailable && (
                  <button
                    onClick={() => speakPronunciation(selectedTerm.term, selectedTerm.pronunciation)}
                    className="p-1 text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.814L4.043 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.043l4.34-3.814a1 1 0 011 .814zM12.55 5.22a.75.75 0 00-1.06 1.06L13.44 8.22a.75.75 0 101.06-1.06L12.55 5.22zm2.83 2.83a.75.75 0 10-1.06 1.06l1.06 1.06a.75.75 0 101.06-1.06l-1.06-1.06z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">📖 Definition:</h5>
              <p className="text-gray-700">{selectedTerm.definition}</p>
            </div>
            
            {selectedTerm.normalRange && (
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">📊 Normal Range:</h5>
                <p className="text-green-700 bg-green-100 px-3 py-2 rounded">{selectedTerm.normalRange}</p>
              </div>
            )}
            
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">🎯 Clinical Significance:</h5>
              <p className="text-gray-700">{selectedTerm.significance}</p>
            </div>
            
            {selectedTerm.relatedTerms && selectedTerm.relatedTerms.length > 0 && (
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">🔗 Related Terms:</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedTerm.relatedTerms.map((related, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(related)}
                      className="px-3 py-1 text-sm bg-white text-indigo-700 border border-indigo-200 rounded-full hover:bg-indigo-50 transition-colors"
                    >
                      {related}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* No Results */}
      {searchTerm && searchResults.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.464-.881-6.08-2.33C5.388 12.152 5 11.615 5 11V4a1 1 0 011-1h12a1 1 0 011 1v7c0 .615-.388 1.152-.92 1.67A7.962 7.962 0 0112 15z" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-600 mb-2">No terms found</h4>
          <p className="text-gray-500">Try searching for common medical terms like "hemoglobin", "glucose", or "cholesterol"</p>
        </div>
      )}
    </div>
  );
};

export default MedicalDictionary; 