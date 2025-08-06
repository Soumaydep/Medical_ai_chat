import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const MedicalTextInput = ({ onSimplify, isLoading, initialText, onTextChange }) => {
  const [medicalText, setMedicalText] = useState(initialText || '');
  const { colors } = useTheme();

  useEffect(() => {
    setMedicalText(initialText || '');
  }, [initialText]);

  const handleTextChange = (e) => {
    const text = e.target.value;
    setMedicalText(text);
    onTextChange(text);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (medicalText.trim() && !isLoading) {
      onSimplify(medicalText.trim());
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
    <div className={`${colors.card} rounded-lg shadow-sm ${colors.border} border p-6 transition-all duration-300`}>
      <div className="flex items-center space-x-2 mb-4">
        <svg className={`w-5 h-5 ${colors.textTertiary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className={`text-lg font-medium ${colors.textPrimary}`}>Medical Text to Simplify</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="medical-text" className={`block text-sm font-medium ${colors.textSecondary} mb-2`}>
            Paste your medical report or text here:
          </label>
          <textarea
            id="medical-text"
            value={medicalText}
            onChange={handleTextChange}
            placeholder="Enter medical text, lab results, doctor's notes, or any medical documentation you'd like to understand better..."
            rows={8}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-vertical transition-all duration-300 ${colors.input} ${colors.inputFocus}`}
            disabled={isLoading}
          />
          <div className="mt-1 text-xs text-gray-500">
            {medicalText.length}/5000 characters
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={!medicalText.trim() || isLoading}
            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white transition-all duration-300 ${
              !medicalText.trim() || isLoading
                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                : colors.buttonPrimary + ' focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Simplify Medical Text
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setMedicalText('');
              onTextChange('');
            }}
            disabled={isLoading}
            className={`inline-flex items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ${colors.buttonSecondary} ${colors.border}`}
          >
            Clear
          </button>
        </div>
      </form>

      {/* Example texts */}
      <div className="mt-6 border-t border-gray-200 pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Try these examples:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {exampleTexts.map((example, index) => (
            <button
              key={index}
              onClick={() => {
                setMedicalText(example.text);
                onTextChange(example.text);
              }}
              disabled={isLoading}
              className="text-left p-3 bg-gray-50 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-xs font-medium text-primary-600 mb-1">{example.title}</div>
              <div className="text-xs text-gray-600 line-clamp-3">{example.text}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicalTextInput; 