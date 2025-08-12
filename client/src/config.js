const config = {
  // API Configuration
  API_URL: process.env.REACT_APP_API_URL || (
    process.env.NODE_ENV === 'production' 
      ? 'https://your-production-api.railway.app'  // Replace with your actual Railway deployment URL
      : 'http://localhost:5000'
  ),
  
  // App Configuration
  APP_NAME: 'MediClarify AI',
  APP_VERSION: '2.0.0',
  APP_DESCRIPTION: 'Professional Medical Report Analysis Platform',
  
  // Feature Flags
  FEATURES: {
    VOICE_ASSISTANT: true,
    MULTI_LANGUAGE: true,
    OFFLINE_MODE: true,
    DARK_MODE: true,
    AI_SIMPLIFICATION: true,
    MEDICAL_DICTIONARY: true,
    HEALTH_INSIGHTS: true,
    SAMPLE_REPORTS: true
  },
  
  // AI Configuration
  AI: {
    DEFAULT_LANGUAGE: 'English',
    MAX_INPUT_LENGTH: 10000,
    SUPPORTED_LANGUAGES: [
      'English', 'Spanish', 'French', 'German', 'Italian', 
      'Portuguese', 'Dutch', 'Russian', 'Chinese', 'Japanese',
      'Korean', 'Arabic', 'Hindi'
    ]
  },
  
  // UI Configuration
  UI: {
    DEFAULT_THEME: 'light',
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 500
  },
  
  // Environment Info
  ENV: {
    NODE_ENV: process.env.NODE_ENV,
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
    IS_DEVELOPMENT: process.env.NODE_ENV === 'development'
  }
};

export default config; 