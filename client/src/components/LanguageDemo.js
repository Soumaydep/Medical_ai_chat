import React, { useState } from 'react';

const LanguageDemo = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const sampleTranslations = {
    English: "Your blood test shows mostly normal values with slightly elevated white blood cells, which often indicates your body is fighting a minor infection.",
    Spanish: "Tu análisis de sangre muestra valores mayormente normales con glóbulos blancos ligeramente elevados, lo que a menudo indica que tu cuerpo está combatiendo una infección menor.",
    French: "Vos analyses sanguines montrent des valeurs majoritairement normales avec des globules blancs légèrement élevés, ce qui indique souvent que votre corps combat une infection mineure.",
    Hindi: "आपका रक्त परीक्षण ज्यादातर सामान्य मान दिखाता है जिसमें सफेद रक्त कोशिकाएं थोड़ी बढ़ी हुई हैं, जो अक्सर इंगित करता है कि आपका शरीर एक छोटे संक्रमण से लड़ रहा है।",
    German: "Ihr Bluttest zeigt größtenteils normale Werte mit leicht erhöhten weißen Blutkörperchen, was oft darauf hinweist, dass Ihr Körper eine kleine Infektion bekämpft."
  };

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">🌍 Multi-Language AI Explanations</h3>
            <p className="text-sm text-gray-600">See how medical information is explained in different languages</p>
          </div>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
        >
          {isExpanded ? 'Hide Demo' : 'View Demo'}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <h4 className="font-semibold text-gray-800 mb-3">🩸 Sample Medical Explanation in Multiple Languages:</h4>
            <div className="space-y-3">
              {Object.entries(sampleTranslations).map(([language, translation]) => (
                <div key={language} className="border-l-4 border-blue-400 pl-4 py-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-semibold text-blue-600">{language}:</span>
                  </div>
                  <p className="text-sm text-gray-700 italic">"{translation}"</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">✨ How It Works:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Select your preferred language from the dropdown above</li>
              <li>• Input medical text or use sample reports</li>
              <li>• AI will provide explanations in your chosen language</li>
              <li>• Chat responses will also be in your selected language</li>
              <li>• Supports 18+ languages for global accessibility</li>
            </ul>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">🔧 Demo Mode Notes:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Currently showing sample translations for demonstration</li>
              <li>• Add your Gemini API key for full AI-powered translations</li>
              <li>• Real AI provides more accurate and contextual translations</li>
              <li>• Demo includes pre-translated examples in major languages</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageDemo; 