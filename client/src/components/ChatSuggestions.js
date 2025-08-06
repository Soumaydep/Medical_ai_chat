import React, { useState, useEffect } from 'react';
import config from '../config';

const ChatSuggestions = ({ onSelectSuggestion, disabled }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const response = await fetch(`${config.API_URL}/api/chatbot/suggestions`);
      const data = await response.json();
      
      if (data.success) {
        setSuggestions(data.suggestions);
      }
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      // Fallback suggestions if API fails
      setSuggestions([
        "What do these test results mean?",
        "Should I be worried about anything?",
        "What are normal values for blood work?",
        "What questions should I ask my doctor?"
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-8 bg-gray-200 rounded-full w-32 animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-4">
      <p className="text-sm text-gray-600 mb-2">💡 Suggested questions:</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelectSuggestion(suggestion)}
            disabled={disabled}
            className={`
              px-3 py-1 text-sm rounded-full border transition-colors
              ${disabled
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300'
              }
            `}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatSuggestions; 