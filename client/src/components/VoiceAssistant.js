import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const VoiceAssistant = ({ onVoiceInput, onVoiceCommand }) => {
  const { colors } = useTheme();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceSettings, setVoiceSettings] = useState({
    rate: 1,
    pitch: 1,
    volume: 1,
    voice: null
  });
  const [isRecognitionSupported, setIsRecognitionSupported] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [keyboardMode, setKeyboardMode] = useState(false);
  const [audioBookmarks, setAudioBookmarks] = useState([]);
  const [emergencyAlerts, setEmergencyAlerts] = useState([]);
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const currentUtteranceRef = useRef(null);
  const keyboardShortcutsRef = useRef(null);

  // Medical pronunciation dictionary
  const medicalPronunciations = {
    'cholesterol': 'kuh-LES-tuh-rawl',
    'hemoglobin': 'HEE-muh-gloh-bin',
    'creatinine': 'kree-AT-uh-neen',
    'glucose': 'GLOO-kohs',
    'triglycerides': 'try-GLIS-uh-rydz',
    'pneumonia': 'noo-MOH-nyuh',
    'myocardial': 'my-uh-KAHR-dee-uhl',
    'hypertension': 'hy-per-TEN-shuhn',
    'diabetes': 'dy-uh-BEE-teez',
    'gastroenteritis': 'gas-troh-en-tuh-RY-tis'
  };

  // Keyboard shortcuts for accessibility
  const keyboardShortcuts = {
    'Alt+V': () => toggleListening(),
    'Alt+S': () => stopSpeaking(),
    'Alt+R': () => readCurrentContent(),
    'Alt+P': () => toggleKeyboardMode(),
    'Alt+H': () => speakHelp(),
    'Alt+1': () => navigateToSection('medical-input'),
    'Alt+2': () => navigateToSection('simplified-output'),
    'Alt+3': () => navigateToSection('chatbot'),
    'Alt+4': () => navigateToSection('voice-assistant')
  };

  useEffect(() => {
    initializeVoiceFeatures();
    initializeKeyboardShortcuts();
    announcePageLoad();
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (currentUtteranceRef.current) {
        speechSynthesis.cancel();
      }
      removeKeyboardShortcuts();
    };
  }, []);

  const initializeVoiceFeatures = () => {
    // Check for Speech Recognition support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsRecognitionSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);
        
        if (finalTranscript) {
          handleVoiceCommand(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        speak('Sorry, I had trouble understanding. Please try again.');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Check for Speech Synthesis support
    if ('speechSynthesis' in window) {
      setIsSpeechSupported(true);
      synthRef.current = window.speechSynthesis;
      
      // Load available voices
      const loadVoices = () => {
        const voices = synthRef.current.getVoices();
        const preferredVoice = voices.find(voice => 
          voice.lang.startsWith('en') && voice.name.includes('Natural')
        ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
        
        setVoiceSettings(prev => ({ ...prev, voice: preferredVoice }));
      };

      synthRef.current.onvoiceschanged = loadVoices;
      loadVoices();
    }
  };

  const initializeKeyboardShortcuts = () => {
    const handleKeyDown = (event) => {
      const shortcut = `${event.altKey ? 'Alt+' : ''}${event.ctrlKey ? 'Ctrl+' : ''}${event.key}`;
      
      if (keyboardShortcuts[shortcut]) {
        event.preventDefault();
        keyboardShortcuts[shortcut]();
      }

      // Tab navigation enhancement
      if (event.key === 'Tab') {
        announceCurrentElement(event.target);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    keyboardShortcutsRef.current = handleKeyDown;
  };

  const removeKeyboardShortcuts = () => {
    if (keyboardShortcutsRef.current) {
      document.removeEventListener('keydown', keyboardShortcutsRef.current);
    }
  };

  const announcePageLoad = () => {
    setTimeout(() => {
      speak('IntelliHealth Assistant loaded. Press Alt+H for help with voice commands and keyboard shortcuts.');
    }, 1000);
  };

  const announceCurrentElement = (element) => {
    if (!element) return;
    
    const label = element.getAttribute('aria-label') || 
                  element.getAttribute('title') || 
                  element.textContent?.trim() || 
                  element.placeholder;
    
    if (label && keyboardMode) {
      speak(label, { interrupt: false, priority: 'low' });
    }
  };

  const navigateToSection = (sectionId) => {
    const element = document.getElementById(sectionId) || document.querySelector(`[data-section="${sectionId}"]`);
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      speak(`Navigated to ${sectionId.replace('-', ' ')} section`);
    }
  };

  const toggleListening = () => {
    if (!isRecognitionSupported) {
      speak('Speech recognition is not supported in this browser. Please use a modern browser like Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      speak('Voice input stopped');
    } else {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
      speak('Voice input started. Speak your medical text or ask a question.');
    }
  };

  const speak = (text, options = {}) => {
    if (!isSpeechSupported || !text) return;

    const { interrupt = true, priority = 'normal' } = options;

    if (interrupt && currentUtteranceRef.current) {
      synthRef.current.cancel();
    }

    // Check for emergency keywords
    const emergencyKeywords = ['urgent', 'emergency', 'critical', 'severe', 'immediate'];
    const isEmergency = emergencyKeywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    );

    if (isEmergency) {
      setEmergencyAlerts(prev => [...prev, { text, timestamp: new Date() }]);
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = voiceSettings.rate;
    utterance.pitch = isEmergency ? 1.2 : voiceSettings.pitch;
    utterance.volume = isEmergency ? 1 : voiceSettings.volume;
    utterance.voice = voiceSettings.voice;

    // Add pronunciation guide for medical terms
    let spokenText = text;
    Object.entries(medicalPronunciations).forEach(([term, pronunciation]) => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      spokenText = spokenText.replace(regex, `${term}, pronounced ${pronunciation},`);
    });
    utterance.text = spokenText;

    utterance.onstart = () => {
      setIsSpeaking(true);
      currentUtteranceRef.current = utterance;
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      currentUtteranceRef.current = null;
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setIsSpeaking(false);
      currentUtteranceRef.current = null;
    };

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      currentUtteranceRef.current = null;
    }
  };

  const handleVoiceCommand = (command) => {
    const lowerCommand = command.toLowerCase().trim();
    
    // Voice navigation commands
    if (lowerCommand.includes('go to') || lowerCommand.includes('navigate to')) {
      if (lowerCommand.includes('input') || lowerCommand.includes('text')) {
        navigateToSection('medical-input');
      } else if (lowerCommand.includes('output') || lowerCommand.includes('result')) {
        navigateToSection('simplified-output');
      } else if (lowerCommand.includes('chat') || lowerCommand.includes('bot')) {
        navigateToSection('chatbot');
      } else if (lowerCommand.includes('voice') || lowerCommand.includes('assistant')) {
        navigateToSection('voice-assistant');
      }
      return;
    }

    // Reading commands
    if (lowerCommand.includes('read') || lowerCommand.includes('speak')) {
      if (lowerCommand.includes('current') || lowerCommand.includes('this')) {
        readCurrentContent();
      } else if (lowerCommand.includes('report') || lowerCommand.includes('document')) {
        readMedicalReport();
      }
      return;
    }

    // Bookmark commands
    if (lowerCommand.includes('bookmark') || lowerCommand.includes('save')) {
      addAudioBookmark();
      return;
    }

    // Help command
    if (lowerCommand.includes('help') || lowerCommand.includes('commands')) {
      speakHelp();
      return;
    }

    // Pass to parent component for processing
    if (onVoiceCommand) {
      onVoiceCommand(command);
    }
  };

  const readCurrentContent = () => {
    const activeElement = document.activeElement;
    const mainContent = document.querySelector('main') || document.body;
    
    let contentToRead = '';
    
    if (activeElement && activeElement.textContent) {
      contentToRead = activeElement.textContent;
    } else {
      // Read the main content area
      const sections = mainContent.querySelectorAll('section, article, .content-area');
      if (sections.length > 0) {
        contentToRead = Array.from(sections)
          .map(section => section.textContent)
          .join('. ');
      } else {
        contentToRead = mainContent.textContent;
      }
    }
    
    if (contentToRead) {
      speak(contentToRead.slice(0, 500) + (contentToRead.length > 500 ? '... Use voice commands to navigate or ask questions.' : ''));
    } else {
      speak('No content found to read. Use voice commands to navigate to different sections.');
    }
  };

  const readMedicalReport = () => {
    const reportElement = document.querySelector('#medical-text') || 
                         document.querySelector('[data-content="medical-report"]') ||
                         document.querySelector('textarea');
    
    if (reportElement && reportElement.value) {
      speak(`Reading medical report: ${reportElement.value}`);
    } else {
      speak('No medical report found. Please upload or paste your medical text first.');
    }
  };

  const addAudioBookmark = () => {
    const timestamp = new Date();
    const currentSection = document.activeElement?.closest('[data-section]')?.dataset.section || 'unknown';
    
    const bookmark = {
      id: Date.now(),
      section: currentSection,
      timestamp,
      label: `Bookmark ${audioBookmarks.length + 1}`
    };
    
    setAudioBookmarks(prev => [...prev, bookmark]);
    speak(`Bookmark added for ${currentSection} section`);
  };

  const speakHelp = () => {
    const helpText = `
      IntelliHealth Assistant Voice Help.
      Voice Commands:
      - Say "read this" or "read current" to read the current content
      - Say "go to input" to navigate to medical text input
      - Say "go to results" to navigate to simplified output
      - Say "go to chat" to navigate to chatbot
      - Say "bookmark this" to save current location
      - Say "help" for this help message
      
      Keyboard Shortcuts:
      - Alt+V: Start or stop voice input
      - Alt+S: Stop speaking
      - Alt+R: Read current content
      - Alt+H: Help
      - Alt+1 through Alt+4: Navigate to different sections
      - Tab: Navigate through elements with audio descriptions
      
      The intelligent assistant will pronounce medical terms correctly and provide emergency audio alerts for urgent information.
    `;
    
    speak(helpText);
  };

  const toggleKeyboardMode = () => {
    setKeyboardMode(!keyboardMode);
    speak(keyboardMode ? 'Keyboard mode disabled' : 'Keyboard mode enabled. Tab through elements for audio descriptions.');
  };

  return (
    <div className={`${colors.card} rounded-lg shadow-md p-6 transition-all duration-300`} role="region" aria-label="Voice Assistant">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-green-100 dark:bg-green-800 p-3 rounded-lg transition-all duration-300">
            <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <div>
            <h3 className={`text-xl font-semibold ${colors.textPrimary}`}>🎙️ Voice Assistant</h3>
            <p className={`text-sm ${colors.textSecondary}`}>Hands-free interaction with speech and audio</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={speakHelp}
            className={`p-2 rounded-lg ${colors.buttonSecondary} transition-all duration-300`}
            aria-label="Voice Assistant Help"
            title="Get help with voice commands (Alt+H)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          
          <button
            onClick={toggleKeyboardMode}
            className={`p-2 rounded-lg transition-all duration-300 ${
              keyboardMode 
                ? 'bg-green-500 text-white' 
                : colors.buttonSecondary
            }`}
            aria-label={`${keyboardMode ? 'Disable' : 'Enable'} keyboard navigation mode`}
            title="Toggle keyboard navigation mode (Alt+P)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Voice Controls */}
      <div className={`${colors.cardLight} rounded-lg p-4 mb-6`}>
        <h4 className={`font-medium ${colors.textPrimary} mb-3`}>Voice Controls</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={toggleListening}
            disabled={!isRecognitionSupported}
            className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : isRecognitionSupported 
                  ? colors.buttonPrimary
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
            }`}
            aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
            title="Start or stop voice input (Alt+V)"
          >
            {isListening ? (
              <>
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <span>Stop Listening</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <span>{isRecognitionSupported ? 'Start Voice Input' : 'Voice Not Supported'}</span>
              </>
            )}
          </button>

          <button
            onClick={stopSpeaking}
            disabled={!isSpeechSupported || !isSpeaking}
            className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
              isSpeaking
                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                : colors.buttonSecondary
            }`}
            aria-label="Stop speaking"
            title="Stop audio output (Alt+S)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 5.586l12.828 12.828M9 9v6m4-6v6m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Stop Speaking</span>
          </button>
        </div>
      </div>

      {/* Transcript Display */}
      {isListening && (
        <div className={`${colors.cardLight} rounded-lg p-4 mb-4`}>
          <h4 className={`font-medium ${colors.textPrimary} mb-2`}>Voice Input:</h4>
          <p className={`text-sm ${colors.textSecondary} min-h-[40px] italic`} aria-live="polite">
            {transcript || 'Listening for your voice...'}
          </p>
        </div>
      )}

      {/* Emergency Alerts */}
      {emergencyAlerts.length > 0 && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg p-4 mb-4" role="alert">
          <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">⚠️ Emergency Alerts</h4>
          {emergencyAlerts.slice(-3).map((alert, index) => (
            <p key={index} className="text-sm text-red-700 dark:text-red-300 mb-1">
              {alert.text}
            </p>
          ))}
        </div>
      )}

      {/* Audio Bookmarks */}
      {audioBookmarks.length > 0 && (
        <div className={`${colors.cardLight} rounded-lg p-4 mb-4`}>
          <h4 className={`font-medium ${colors.textPrimary} mb-2`}>📌 Audio Bookmarks</h4>
          <div className="space-y-1">
            {audioBookmarks.slice(-5).map((bookmark) => (
              <button
                key={bookmark.id}
                onClick={() => navigateToSection(bookmark.section)}
                className={`text-left text-sm ${colors.textSecondary} hover:${colors.textPrimary} transition-colors`}
              >
                {bookmark.label} - {bookmark.section} ({bookmark.timestamp.toLocaleTimeString()})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className={`${colors.cardLight} rounded-lg p-4`}>
        <h4 className={`font-medium ${colors.textPrimary} mb-3`}>Quick Actions</h4>
        
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={readCurrentContent}
            className={`py-2 px-3 text-sm rounded ${colors.buttonSecondary} transition-all duration-300`}
            title="Read current content (Alt+R)"
          >
            📖 Read Current
          </button>
          
          <button
            onClick={readMedicalReport}
            className={`py-2 px-3 text-sm rounded ${colors.buttonSecondary} transition-all duration-300`}
          >
            🩺 Read Report
          </button>
          
          <button
            onClick={() => navigateToSection('medical-input')}
            className={`py-2 px-3 text-sm rounded ${colors.buttonSecondary} transition-all duration-300`}
            title="Go to input section (Alt+1)"
          >
            📝 Input
          </button>
          
          <button
            onClick={() => navigateToSection('chatbot')}
            className={`py-2 px-3 text-sm rounded ${colors.buttonSecondary} transition-all duration-300`}
            title="Go to chatbot (Alt+3)"
          >
            💬 Chat
          </button>
        </div>
      </div>

      {/* Accessibility Status */}
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400" aria-live="polite">
        Voice Recognition: {isRecognitionSupported ? '✅' : '❌'} | 
        Text-to-Speech: {isSpeechSupported ? '✅' : '❌'} | 
        Keyboard Mode: {keyboardMode ? '✅' : '❌'}
      </div>
    </div>
  );
};

export default VoiceAssistant; 