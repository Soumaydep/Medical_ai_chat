import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const MedicalTextInput = ({ onSimplify, isLoading, initialText, onTextChange }) => {
  const [medicalText, setMedicalText] = useState(initialText || '');
  const { colors } = useTheme();
  const [aiSimplified, setAiSimplified] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  useEffect(() => {
    setMedicalText(initialText || '');
  }, [initialText]);

  const handleTextChange = (e) => {
    const text = e.target.value;
    setMedicalText(text);
    onTextChange(text);
    setAiSimplified('');
    setAiError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (medicalText.trim() && !isLoading) {
      onSimplify(medicalText.trim());
    }
  };

  const handleAISimplify = async () => {
    setAiLoading(true);
    setAiError('');
    setAiSimplified('');
    try {
      const response = await fetch('/api/simplify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          medicalText: medicalText,
          language: 'English'
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setAiSimplified(data.simplifiedText);
      } else {
        setAiError(data.error || 'Failed to simplify with AI.');
      }
    } catch (err) {
      setAiError('Network error. Please check your connection.');
    } finally {
      setAiLoading(false);
    }
  };

  const exampleTexts = [
    {
      title: "Blood Test Report",
      text: "CBC: WBC 12.5 x10³/μL (elevated), RBC 4.2 x10⁶/μL, Hgb 13.2 g/dL, Hct 39%, PLT 285 x10³/μL. CMP: Glucose 110 mg/dL, BUN 18 mg/dL, Creatinine 1.1 mg/dL, eGFR >60, AST 35 U/L, ALT 28 U/L."
    },
    {
      title: "Chest X-Ray Report",
      text: "PA and lateral chest radiographs demonstrate clear lung fields bilaterally. No acute infiltrates, pleural effusions, or pneumothorax. Cardiac silhouette normal in size and configuration. Mediastinal contours unremarkable."
    },
    {
      title: "MRI Brain Report",
      text: "MRI brain with and without contrast: No evidence of acute infarction, hemorrhage, or mass lesion. Mild periventricular white matter changes consistent with chronic small vessel ischemic disease. Ventricular system normal in size."
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 transition-all duration-300">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Medical Report Analysis
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Enter your medical report below for AI-powered simplification and analysis
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="medical-text" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Medical Report Text
          </label>
          <textarea
            id="medical-text"
            className="w-full h-40 p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     dark:bg-gray-700 dark:text-white resize-none
                     transition-all duration-200 text-sm leading-relaxed"
            value={medicalText}
            onChange={handleTextChange}
            placeholder="Paste your medical report here for professional AI analysis..."
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            type="submit"
            className="flex-1 min-w-[200px] bg-gradient-to-r from-blue-600 to-blue-700 
                     hover:from-blue-700 hover:to-blue-800 text-white font-semibold 
                     py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={isLoading || !medicalText.trim()}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              'Analyze Report'
            )}
          </button>

          <button
            type="button"
            className="flex-1 min-w-[200px] bg-gradient-to-r from-emerald-600 to-emerald-700 
                     hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold 
                     py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 
                     focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            onClick={handleAISimplify}
            disabled={aiLoading || !medicalText.trim()}
          >
            {aiLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                AI Processing...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI Simplify Report
              </div>
            )}
          </button>
        </div>
      </form>

      {aiError && (
        <div className="mt-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg">
          <div className="flex">
            <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="text-red-800 dark:text-red-200 font-semibold">Processing Error</h4>
              <p className="text-red-700 dark:text-red-300 text-sm mt-1">{aiError}</p>
            </div>
          </div>
        </div>
      )}

      {aiSimplified && (
        <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 
                      border-l-4 border-emerald-500 p-6 rounded-r-lg">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-emerald-600 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h4 className="text-emerald-800 dark:text-emerald-200 font-bold text-lg mb-3">
                AI-Simplified Report
              </h4>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div className="text-gray-800 dark:text-gray-200 whitespace-pre-line leading-relaxed">
                  {aiSimplified}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Try Sample Reports
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {exampleTexts.map((ex, idx) => (
            <button
              key={idx}
              type="button"
              className="text-left p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 
                       rounded-lg border border-gray-200 dark:border-gray-600 transition-all duration-200 
                       hover:shadow-md transform hover:-translate-y-0.5"
              onClick={() => {
                setMedicalText(ex.text);
                onTextChange(ex.text);
                setAiSimplified('');
                setAiError('');
              }}
            >
              <div className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                {ex.title}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-xs line-clamp-2">
                Click to load sample report
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicalTextInput; 