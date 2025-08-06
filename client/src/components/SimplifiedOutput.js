import React, { useState } from 'react';

const SimplifiedOutput = ({ originalText, simplifiedText, language }) => {
  const [showOriginal, setShowOriginal] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // Could add a toast notification here
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-medical-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900">Simplified Explanation</h3>
          {language !== 'English' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              {language}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowOriginal(!showOriginal)}
            className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {showOriginal ? 'Hide' : 'Show'} Original
          </button>
          
          <button
            onClick={() => copyToClipboard(simplifiedText)}
            className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy
          </button>
        </div>
      </div>

      {/* Original Text (collapsible) */}
      {showOriginal && (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h4 className="text-sm font-medium text-gray-700">Original Medical Text</h4>
          </div>
          <div className="text-sm text-gray-600 whitespace-pre-wrap max-h-40 overflow-y-auto">
            {originalText}
          </div>
        </div>
      )}

      {/* Simplified Text */}
      <div className="space-y-4">
        <div className="prose prose-sm max-w-none">
          <div className="bg-gradient-to-r from-medical-50 to-primary-50 border border-medical-200 rounded-lg p-4">
            <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {simplifiedText}
            </div>
          </div>
        </div>

        {/* Info footer */}
        <div className="flex items-start space-x-2 text-xs text-gray-500 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <svg className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <p className="font-medium text-yellow-800 mb-1">Important Medical Disclaimer</p>
            <p className="text-yellow-700">
              This simplified explanation is for educational purposes only and should not replace professional medical advice. 
              Always consult with your healthcare provider for proper medical interpretation and treatment decisions.
            </p>
          </div>
        </div>

        {/* AI attribution */}
        <div className="text-xs text-gray-400 text-center border-t border-gray-100 pt-3">
          <div className="flex items-center justify-center space-x-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Simplified by OpenAI GPT-4</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplifiedOutput; 