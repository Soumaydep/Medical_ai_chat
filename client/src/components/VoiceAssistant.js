import React, { useState, useEffect, useRef } from 'react';

const VoiceAssistant = ({ onTextInput, onVoiceCommand, currentText }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState({
    rate: 0.8,
    pitch: 1,
    volume: 0.8,
    voice: null
  });
  const [availableVoices, setAvailableVoices] = useState([]);

  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  useEffect(() => {
    // Check for browser support
    const speechRecognitionSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    const speechSynthesisSupported = 'speechSynthesis' in window;
    
    setIsSupported(speechRecognitionSupported && speechSynthesisSupported);

    if (speechRecognitionSupported) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

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

        setTranscript(finalTranscript + interimTranscript);

        if (finalTranscript) {
          handleVoiceCommand(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    if (speechSynthesisSupported) {
      synthRef.current = window.speechSynthesis;
      
      // Load available voices
      const loadVoices = () => {
        const voices = synthRef.current.getVoices();
        setAvailableVoices(voices);
        
        // Set default voice to a female English voice if available
        const defaultVoice = voices.find(voice => 
          voice.lang.startsWith('en') && voice.name.toLowerCase().includes('female')
        ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
        
        setVoiceSettings(prev => ({ ...prev, voice: defaultVoice }));
      };

      loadVoices();
      synthRef.current.onvoiceschanged = loadVoices;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const handleVoiceCommand = (command) => {
    const lowerCommand = command.toLowerCase().trim();
    
    // Voice commands for medical app
    if (lowerCommand.includes('read') || lowerCommand.includes('speak')) {
      if (currentText) {
        speakText(currentText);
      } else {
        speakText("No text available to read. Please enter or upload medical text first.");
      }
    } else if (lowerCommand.includes('stop speaking') || lowerCommand.includes('stop reading')) {
      stopSpeaking();
    } else if (lowerCommand.includes('simplify') || lowerCommand.includes('explain')) {
      if (onVoiceCommand) {
        onVoiceCommand('simplify');
      }
      speakText("Processing your medical text for simplification. Please wait a moment.");
    } else if (lowerCommand.includes('translate') || lowerCommand.includes('change language')) {
      if (onVoiceCommand) {
        onVoiceCommand('translate');
      }
      speakText("Language options are available in the language selector.");
    } else if (lowerCommand.includes('help') || lowerCommand.includes('commands')) {
      speakVoiceCommands();
    } else {
      // Treat as medical text input
      if (onTextInput) {
        onTextInput(command);
      }
      speakText("Medical text received. You can now ask me to simplify it or ask questions about it.");
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const speakText = (text) => {
    if (synthRef.current && text) {
      // Cancel any ongoing speech
      synthRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = voiceSettings.rate;
      utterance.pitch = voiceSettings.pitch;
      utterance.volume = voiceSettings.volume;
      
      if (voiceSettings.voice) {
        utterance.voice = voiceSettings.voice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const speakVoiceCommands = () => {
    const commands = `
      Here are the available voice commands:
      Say "read" or "speak" to have text read aloud.
      Say "simplify" or "explain" to process medical text.
      Say "stop speaking" to stop audio.
      Say "help" or "commands" to hear this list again.
      You can also speak medical text directly and I'll process it.
    `;
    speakText(commands);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <div className="text-gray-400 mb-2">
          <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>
        <p className="text-sm text-gray-600">Voice features not supported in this browser</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-green-100 p-3 rounded-lg">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">🎙️ Voice Assistant</h3>
          <p className="text-sm text-gray-600">Hands-free interaction with speech and audio</p>
        </div>
      </div>

      {/* Voice Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Speech Recognition */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">🎤 Speech Input</h4>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleListening}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isListening
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isListening ? (
                <>
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  <span>Stop Listening</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                  <span>Start Listening</span>
                </>
              )}
            </button>
            
            {isListening && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>Listening...</span>
              </div>
            )}
          </div>

          {transcript && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-700">
                <strong>Transcript:</strong> {transcript}
              </p>
            </div>
          )}
        </div>

        {/* Text-to-Speech */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">🔊 Speech Output</h4>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => speakText(currentText || "Please enter medical text to have it read aloud.")}
              disabled={!currentText}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.814L4.043 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.043l4.34-3.814a1 1 0 011 .814zM12.55 5.22a.75.75 0 00-1.06 1.06L13.44 8.22a.75.75 0 101.06-1.06L12.55 5.22zm2.83 2.83a.75.75 0 10-1.06 1.06l1.06 1.06a.75.75 0 101.06-1.06l-1.06-1.06z" clipRule="evenodd" />
              </svg>
              <span>Read Text</span>
            </button>
            
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                </svg>
                <span>Stop</span>
              </button>
            )}
          </div>

          {isSpeaking && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="flex space-x-1">
                <div className="w-1 h-4 bg-blue-500 rounded animate-pulse"></div>
                <div className="w-1 h-3 bg-blue-500 rounded animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1 h-5 bg-blue-500 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1 h-2 bg-blue-500 rounded animate-pulse" style={{ animationDelay: '0.3s' }}></div>
              </div>
              <span>Speaking...</span>
            </div>
          )}
        </div>
      </div>

      {/* Voice Settings */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-800">⚙️ Voice Settings</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Speech Rate</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={voiceSettings.rate}
              onChange={(e) => setVoiceSettings(prev => ({ ...prev, rate: parseFloat(e.target.value) }))}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">Rate: {voiceSettings.rate}x</div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pitch</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={voiceSettings.pitch}
              onChange={(e) => setVoiceSettings(prev => ({ ...prev, pitch: parseFloat(e.target.value) }))}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">Pitch: {voiceSettings.pitch}</div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Volume</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={voiceSettings.volume}
              onChange={(e) => setVoiceSettings(prev => ({ ...prev, volume: parseFloat(e.target.value) }))}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">Volume: {Math.round(voiceSettings.volume * 100)}%</div>
          </div>
        </div>

        {availableVoices.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Voice</label>
            <select
              value={voiceSettings.voice?.name || ''}
              onChange={(e) => {
                const selectedVoice = availableVoices.find(voice => voice.name === e.target.value);
                setVoiceSettings(prev => ({ ...prev, voice: selectedVoice }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {availableVoices
                .filter(voice => voice.lang.startsWith('en'))
                .map((voice, index) => (
                  <option key={index} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>

      {/* Voice Commands Help */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-2">💡 Voice Commands</h4>
        <div className="text-sm text-green-700 space-y-1">
          <p>• <strong>"Read"</strong> or <strong>"Speak"</strong> - Read current text aloud</p>
          <p>• <strong>"Simplify"</strong> or <strong>"Explain"</strong> - Process medical text</p>
          <p>• <strong>"Stop speaking"</strong> - Stop audio output</p>
          <p>• <strong>"Help"</strong> or <strong>"Commands"</strong> - Hear available commands</p>
          <p>• Speak medical text directly to input it into the system</p>
        </div>
        
        <button
          onClick={speakVoiceCommands}
          className="mt-3 px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
        >
          🔊 Hear Commands
        </button>
      </div>

      {/* Accessibility Note */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center space-x-2 text-sm text-blue-700">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>Voice features improve accessibility for users with visual impairments or motor difficulties. Ensure microphone permissions are enabled for best experience.</span>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant; 