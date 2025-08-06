import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Header from './components/Header';
import MedicalTextInput from './components/MedicalTextInput';
import SimplifiedOutput from './components/SimplifiedOutput';
import ChatBot from './components/ChatBot';
import LanguageSelector from './components/LanguageSelector';
import OCRUpload from './components/OCRUpload';
import SampleReports from './components/SampleReports';
import LanguageDemo from './components/LanguageDemo';
import MedicalDictionary from './components/MedicalDictionary';
import HealthInsights from './components/HealthInsights';
import VoiceAssistant from './components/VoiceAssistant';
import GastricDietGuide from './components/GastricDietGuide';
import config from './config';

function AppContent() {
  const [originalText, setOriginalText] = useState('');
  const [simplifiedText, setSimplifiedText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('main');
  const { colors } = useTheme();

  const handleTextSimplification = async (text) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${config.API_URL}/api/simplify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          medicalText: text,
          language: selectedLanguage
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOriginalText(data.originalText);
        setSimplifiedText(data.simplifiedText);
      } else {
        setError(data.error || 'Failed to simplify text');
      }
    } catch (err) {
      setError('Network error. Please check if the server is running.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOCRText = (extractedText) => {
    setOriginalText(extractedText);
  };

  const handleSampleReportSelect = (reportText) => {
    setOriginalText(reportText);
    // Clear previous results
    setSimplifiedText('');
    setError('');
  };

  const handleVoiceInput = (text) => {
    setOriginalText(text);
    setSimplifiedText('');
    setError('');
  };

  const handleVoiceCommand = (command) => {
    switch (command) {
      case 'simplify':
        if (originalText) {
          handleTextSimplification(originalText);
        }
        break;
      case 'translate':
        // Focus on language selector or show language options
        break;
      default:
        console.log('Unknown voice command:', command);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.gradients.primary} transition-all duration-300`}>
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Tab Navigation */}
        <div className={`flex space-x-1 ${colors.tabBackground} p-1 rounded-lg mb-8 transition-all duration-300`}>
          {[
            { id: 'main', label: '🏠 Medical Analysis', icon: 'main' },
            { id: 'insights', label: '🧠 Health Insights', icon: 'insights' },
            { id: 'dictionary', label: '📚 Medical Dictionary', icon: 'dictionary' },
            { id: 'gastric', label: '🍽️ Gastric Diet Guide', icon: 'gastric' },
            { id: 'voice', label: '🎙️ Voice Assistant', icon: 'voice' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-all duration-300 ${
                activeTab === tab.id
                  ? colors.tabActive
                  : colors.tabInactive
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Tab Content */}
        {activeTab === 'main' && (
          <>
            {/* Sample Reports Section */}
            <div className="mb-8">
              <SampleReports onSelectReport={handleSampleReportSelect} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Language Selector */}
            <LanguageSelector 
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />

            {/* Language Demo */}
            <LanguageDemo />

            {/* OCR Upload */}
            <OCRUpload onTextExtracted={handleOCRText} />

            {/* Medical Text Input */}
            <MedicalTextInput
              onSimplify={handleTextSimplification}
              isLoading={isLoading}
              initialText={originalText}
              onTextChange={setOriginalText}
            />

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Simplified Output */}
            {simplifiedText && (
              <SimplifiedOutput
                originalText={originalText}
                simplifiedText={simplifiedText}
                language={selectedLanguage}
              />
            )}
          </div>

              {/* Right Column - ChatBot */}
              <div className="lg:col-span-1">
                <ChatBot
                  originalText={originalText}
                  simplifiedText={simplifiedText}
                  language={selectedLanguage}
                />
              </div>
            </div>
          </>
        )}

        {/* Health Insights Tab */}
        {activeTab === 'insights' && (
          <HealthInsights 
            medicalData={originalText ? [{ originalText, simplifiedText }] : []}
            userProfile={{}}
          />
        )}

        {/* Medical Dictionary Tab */}
        {activeTab === 'dictionary' && (
          <MedicalDictionary />
        )}

        {/* Gastric Diet Guide Tab */}
        {activeTab === 'gastric' && (
          <GastricDietGuide />
        )}

        {/* Voice Assistant Tab */}
        {activeTab === 'voice' && (
          <VoiceAssistant 
            onTextInput={handleVoiceInput}
            onVoiceCommand={handleVoiceCommand}
            currentText={originalText}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              ⚠️ <strong>Medical Disclaimer:</strong> This tool is for educational purposes only. 
              Always consult with qualified healthcare professionals for medical advice.
            </p>
            <p className="text-xs mt-2">
              MediChat AI © 2024 - Powered by Google Gemini
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App; 