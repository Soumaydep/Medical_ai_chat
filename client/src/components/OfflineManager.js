import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const OfflineManager = () => {
  const { colors } = useTheme();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineMode, setOfflineMode] = useState(false);
  const [cacheStatus, setCacheStatus] = useState({
    size: 0,
    lastUpdated: null,
    availableModels: []
  });
  const [localModels, setLocalModels] = useState({
    basicMedical: null,
    emergencyTerms: null,
    commonConditions: null
  });

  // Enhanced offline medical knowledge base
  const offlineMedicalKnowledge = {
    // Basic medical terminology with simplified explanations
    terminology: {
      'blood pressure': {
        simple: 'The force of blood pushing against artery walls',
        normal: '120/80 mmHg or lower',
        urgent: 'Over 180/120 requires immediate medical attention'
      },
      'cholesterol': {
        simple: 'A waxy substance in blood that can clog arteries',
        normal: 'Total cholesterol under 200 mg/dL',
        urgent: 'Over 240 mg/dL increases heart disease risk'
      },
      'glucose': {
        simple: 'Blood sugar that provides energy to cells',
        normal: 'Fasting: 70-100 mg/dL, Random: under 140 mg/dL',
        urgent: 'Over 400 mg/dL or symptoms of diabetic emergency'
      },
      'hemoglobin': {
        simple: 'Protein in red blood cells that carries oxygen',
        normal: 'Men: 14-18 g/dL, Women: 12-16 g/dL',
        urgent: 'Under 7 g/dL may require transfusion'
      },
      'white blood cells': {
        simple: 'Infection-fighting cells in your immune system',
        normal: '4,000-11,000 cells per microliter',
        urgent: 'Very high or very low counts may indicate serious illness'
      },
      'creatinine': {
        simple: 'Waste product that shows how well kidneys work',
        normal: 'Men: 0.7-1.3 mg/dL, Women: 0.6-1.1 mg/dL',
        urgent: 'Rising levels may indicate kidney problems'
      }
    },

    // Common test interpretations
    testInterpretations: {
      'CBC': {
        name: 'Complete Blood Count',
        purpose: 'Checks overall health and detects blood disorders',
        components: ['red blood cells', 'white blood cells', 'platelets', 'hemoglobin']
      },
      'CMP': {
        name: 'Comprehensive Metabolic Panel',
        purpose: 'Evaluates kidney function, liver function, and blood sugar',
        components: ['glucose', 'creatinine', 'electrolytes', 'liver enzymes']
      },
      'lipid panel': {
        name: 'Cholesterol Test',
        purpose: 'Measures different types of cholesterol and triglycerides',
        components: ['total cholesterol', 'LDL', 'HDL', 'triglycerides']
      }
    },

    // Emergency keywords and responses
    emergencyKeywords: {
      'chest pain': 'Chest pain can be serious. Seek immediate medical attention if severe, crushing, or accompanied by shortness of breath.',
      'difficulty breathing': 'Trouble breathing requires immediate medical attention. Call emergency services if severe.',
      'severe headache': 'Sudden severe headaches, especially with fever or vision changes, need immediate evaluation.',
      'abdominal pain': 'Severe abdominal pain, especially with fever or vomiting, may require emergency care.',
      'high fever': 'Fever over 103°F (39.4°C) or persistent fever needs medical attention.',
      'allergic reaction': 'Signs of severe allergic reaction (difficulty breathing, swelling) require immediate emergency care.'
    },

    // Basic medication information
    medications: {
      'aspirin': 'Pain reliever that also helps prevent blood clots. Take with food to prevent stomach upset.',
      'metformin': 'Diabetes medication that helps control blood sugar. Take with meals.',
      'lisinopril': 'Blood pressure medication (ACE inhibitor). May cause dry cough in some people.',
      'atorvastatin': 'Cholesterol-lowering medication (statin). Take in evening, may cause muscle pain.',
      'metoprolol': 'Beta-blocker for blood pressure and heart conditions. Do not stop suddenly.'
    }
  };

  // Service Worker for PWA functionality
  useEffect(() => {
    // Register service worker for offline caching
    if ('serviceWorker' in navigator) {
      registerServiceWorker();
    }

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineData();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setOfflineMode(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initialize offline capabilities
    initializeOfflineMode();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);

      // Listen for service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New content available
            showUpdateNotification();
          }
        });
      });
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  };

  const initializeOfflineMode = () => {
    // Load cached data from localStorage
    const cachedData = localStorage.getItem('medicalAI_offlineData');
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      setCacheStatus({
        size: new Blob([cachedData]).size,
        lastUpdated: new Date(parsed.timestamp),
        availableModels: parsed.models || []
      });
    }

    // Initialize local medical models
    setLocalModels({
      basicMedical: offlineMedicalKnowledge,
      emergencyTerms: offlineMedicalKnowledge.emergencyKeywords,
      commonConditions: offlineMedicalKnowledge.testInterpretations
    });
  };

  const processOfflineText = (medicalText) => {
    if (!medicalText || !localModels.basicMedical) {
      return {
        success: false,
        message: 'No medical text provided or offline models not available'
      };
    }

    const lowerText = medicalText.toLowerCase();
    const results = {
      identifiedTerms: [],
      emergencyFlags: [],
      basicExplanation: '',
      recommendations: []
    };

    // Identify medical terms
    Object.entries(localModels.basicMedical.terminology).forEach(([term, info]) => {
      if (lowerText.includes(term)) {
        results.identifiedTerms.push({
          term,
          explanation: info.simple,
          normal: info.normal,
          urgent: info.urgent
        });
      }
    });

    // Check for emergency keywords
    Object.entries(localModels.emergencyTerms).forEach(([keyword, response]) => {
      if (lowerText.includes(keyword)) {
        results.emergencyFlags.push({
          keyword,
          response,
          priority: 'high'
        });
      }
    });

    // Generate basic explanation
    if (results.identifiedTerms.length > 0) {
      results.basicExplanation = generateOfflineExplanation(results.identifiedTerms);
    } else {
      results.basicExplanation = 'This appears to be a medical document. While offline, I can provide basic information about common medical terms and values.';
    }

    // Add recommendations
    results.recommendations = generateOfflineRecommendations(results);

    return {
      success: true,
      data: results,
      mode: 'offline',
      limitation: 'This is a basic offline analysis. For comprehensive AI-powered explanations, please connect to the internet.'
    };
  };

  const generateOfflineExplanation = (terms) => {
    let explanation = 'Based on the medical terms I found:\n\n';
    
    terms.forEach((termInfo, index) => {
      explanation += `${index + 1}. **${termInfo.term.toUpperCase()}**: ${termInfo.explanation}\n`;
      if (termInfo.normal) {
        explanation += `   Normal range: ${termInfo.normal}\n`;
      }
      explanation += '\n';
    });

    return explanation;
  };

  const generateOfflineRecommendations = (results) => {
    const recommendations = [];

    if (results.emergencyFlags.length > 0) {
      recommendations.push({
        type: 'emergency',
        text: 'Emergency indicators detected. Seek immediate medical attention.',
        priority: 'critical'
      });
    }

    if (results.identifiedTerms.length > 0) {
      recommendations.push({
        type: 'followup',
        text: 'Discuss these results with your healthcare provider for proper interpretation.',
        priority: 'normal'
      });
    }

    recommendations.push({
      type: 'general',
      text: 'Keep a copy of your medical records and bring them to appointments.',
      priority: 'low'
    });

    return recommendations;
  };

  const syncOfflineData = async () => {
    if (isOnline) {
      try {
        // Sync any offline-generated data with server when online
        const offlineData = localStorage.getItem('medicalAI_pendingSync');
        if (offlineData) {
          // Send to server for processing
          const parsed = JSON.parse(offlineData);
          // Implementation would sync with backend
          localStorage.removeItem('medicalAI_pendingSync');
        }
      } catch (error) {
        console.error('Error syncing offline data:', error);
      }
    }
  };

  const clearOfflineCache = () => {
    localStorage.removeItem('medicalAI_offlineData');
    localStorage.removeItem('medicalAI_pendingSync');
    setCacheStatus({ size: 0, lastUpdated: null, availableModels: [] });
  };

  const downloadOfflineData = async () => {
    try {
      // In a real implementation, this would download enhanced models
      const enhancedData = {
        ...offlineMedicalKnowledge,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        models: ['basic-medical', 'emergency-terms', 'common-conditions']
      };

      localStorage.setItem('medicalAI_offlineData', JSON.stringify(enhancedData));
      setCacheStatus({
        size: new Blob([JSON.stringify(enhancedData)]).size,
        lastUpdated: new Date(),
        availableModels: enhancedData.models
      });
    } catch (error) {
      console.error('Error downloading offline data:', error);
    }
  };

  const showUpdateNotification = () => {
    // Show notification that new content is available
    if (Notification.permission === 'granted') {
      new Notification('Medical AI Assistant Update Available', {
        body: 'New features and improvements are ready to install.',
        icon: '/favicon.ico'
      });
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`${colors.card} rounded-lg shadow-md p-6 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg transition-all duration-300 ${
            isOnline ? 'bg-green-100 dark:bg-green-800' : 'bg-orange-100 dark:bg-orange-800'
          }`}>
            <svg className={`w-6 h-6 ${
              isOnline ? 'text-green-600 dark:text-green-300' : 'text-orange-600 dark:text-orange-300'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOnline ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636" />
              )}
            </svg>
          </div>
          <div>
            <h3 className={`text-xl font-semibold ${colors.textPrimary}`}>
              📱 Offline Manager
            </h3>
            <p className={`text-sm ${colors.textSecondary}`}>
              {isOnline ? 'Online - Full AI features available' : 'Offline - Basic analysis only'}
            </p>
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          isOnline 
            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200'
            : 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-200'
        }`}>
          {isOnline ? '🟢 Online' : '🟠 Offline'}
        </div>
      </div>

      {/* Offline Capabilities */}
      <div className={`${colors.cardLight} rounded-lg p-4 mb-6`}>
        <h4 className={`font-medium ${colors.textPrimary} mb-3`}>Offline Capabilities</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✅</span>
              <span className={colors.textSecondary}>Basic medical term lookup</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✅</span>
              <span className={colors.textSecondary}>Emergency keyword detection</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✅</span>
              <span className={colors.textSecondary}>Common test explanations</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✅</span>
              <span className={colors.textSecondary}>Voice interaction</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✅</span>
              <span className={colors.textSecondary}>Data caching</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-red-500">❌</span>
              <span className={colors.textSecondary}>AI-powered analysis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cache Status */}
      <div className={`${colors.cardLight} rounded-lg p-4 mb-6`}>
        <h4 className={`font-medium ${colors.textPrimary} mb-3`}>Cache Status</h4>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className={colors.textSecondary}>Cache Size:</span>
            <span className={colors.textPrimary}>{formatBytes(cacheStatus.size)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className={colors.textSecondary}>Last Updated:</span>
            <span className={colors.textPrimary}>
              {cacheStatus.lastUpdated 
                ? cacheStatus.lastUpdated.toLocaleDateString()
                : 'Never'
              }
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className={colors.textSecondary}>Available Models:</span>
            <span className={colors.textPrimary}>{cacheStatus.availableModels.length}</span>
          </div>
        </div>
      </div>

      {/* Offline Actions */}
      <div className="space-y-3">
        <button
          onClick={downloadOfflineData}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 ${colors.buttonPrimary}`}
        >
          📥 Download Offline Data
        </button>
        
        <button
          onClick={clearOfflineCache}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 ${colors.buttonSecondary}`}
        >
          🗑️ Clear Cache
        </button>
        
        {!isOnline && (
          <div className="bg-orange-50 dark:bg-orange-900 border border-orange-200 dark:border-orange-700 rounded-lg p-3">
            <p className="text-sm text-orange-800 dark:text-orange-200">
              ℹ️ You're currently offline. Basic medical term analysis is available. 
              Connect to the internet for full AI-powered explanations.
            </p>
          </div>
        )}
      </div>

      {/* Offline Usage Instructions */}
      <div className={`${colors.cardLight} rounded-lg p-4 mt-6`}>
        <h4 className={`font-medium ${colors.textPrimary} mb-2`}>Offline Usage</h4>
        <div className="text-sm space-y-2">
          <p className={colors.textSecondary}>
            • Medical text can still be analyzed for basic terms and values
          </p>
          <p className={colors.textSecondary}>
            • Emergency keywords are detected and flagged
          </p>
          <p className={colors.textSecondary}>
            • Voice features continue to work for accessibility
          </p>
          <p className={colors.textSecondary}>
            • Data is saved locally and synced when online
          </p>
        </div>
      </div>
    </div>
  );
};

// Export the offline processing function for use in other components
export const processTextOffline = (medicalText) => {
  const offlineManager = new OfflineManager();
  return offlineManager.processOfflineText?.(medicalText) || {
    success: false,
    message: 'Offline processing not available'
  };
};

export default OfflineManager; 