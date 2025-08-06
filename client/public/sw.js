// IntelliHealth Assistant Service Worker
// Provides offline functionality, caching, and PWA features

const CACHE_NAME = 'intellihealth-assistant-v1.0.0';
const API_CACHE_NAME = 'intellihealth-api-v1.0.0';
const OFFLINE_DATA_CACHE = 'intellihealth-offline-v1.0.0';

// Files to cache for offline use
const STATIC_CACHE_URLS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  // Add other static assets
];

// API endpoints to cache for offline fallback
const API_CACHE_URLS = [
  '/api/sample-reports',
  '/api/chatbot/suggestions',
  '/api/health'
];

// Medical data for offline processing
const OFFLINE_MEDICAL_DATA = {
  basicTerms: {
    'blood pressure': 'Force of blood against artery walls',
    'cholesterol': 'Waxy substance that can clog arteries',
    'glucose': 'Blood sugar that provides energy',
    'hemoglobin': 'Protein that carries oxygen in blood'
  },
  emergencyKeywords: [
    'chest pain', 'difficulty breathing', 'severe headache',
    'high fever', 'allergic reaction', 'stroke symptoms'
  ],
  normalRanges: {
    'blood pressure': '120/80 mmHg or lower',
    'cholesterol': 'Under 200 mg/dL total',
    'glucose': '70-100 mg/dL fasting',
    'hemoglobin': 'Men: 14-18 g/dL, Women: 12-16 g/dL'
  }
};

// Install event - cache essential files
self.addEventListener('install', (event) => {
        console.log('IntelliHealth Assistant Service Worker installing...');
      
      event.waitUntil(
        Promise.all([
          // Cache static assets
          caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching static assets...');
            return cache.addAll(STATIC_CACHE_URLS.filter(url => url !== '/'));
          }),
          
          // Cache offline medical data
          caches.open(OFFLINE_DATA_CACHE).then((cache) => {
            console.log('Caching offline medical data...');
            const offlineResponse = new Response(
              JSON.stringify(OFFLINE_MEDICAL_DATA),
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Cache-Control': 'max-age=86400' // 24 hours
                }
              }
            );
            return cache.put('/offline-medical-data', offlineResponse);
          })
        ]).then(() => {
          console.log('IntelliHealth Assistant Service Worker installed successfully');
          // Force activation
          return self.skipWaiting();
        })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('MediClarify Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches
          if (cacheName !== CACHE_NAME && 
              cacheName !== API_CACHE_NAME && 
              cacheName !== OFFLINE_DATA_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('MediClarify Service Worker activated');
      // Take control of all clients
      return self.clients.claim();
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }

  // Handle different types of requests
  if (url.pathname.startsWith('/api/')) {
    // API requests - Network first, then cache
    event.respondWith(handleApiRequest(request));
  } else if (url.pathname === '/' || url.pathname.includes('.')) {
    // Static assets - Cache first, then network
    event.respondWith(handleStaticRequest(request));
  } else {
    // SPA routes - Serve index.html from cache
    event.respondWith(handleSpaRoute(request));
  }
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(API_CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    console.log('Network failed, trying cache for:', url.pathname);
    
    // Try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline fallback for specific endpoints
    return handleOfflineFallback(url.pathname);
  }
}

// Handle static requests with cache-first strategy
async function handleStaticRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Try network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache the response
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Both cache and network failed for:', request.url);
    
    // Return offline page for HTML requests
    if (request.headers.get('accept')?.includes('text/html')) {
      return createOfflinePage();
    }
    
    throw error;
  }
}

// Handle SPA routes
async function handleSpaRoute(request) {
  try {
    // Try cache for index.html
    const cache = await caches.open(CACHE_NAME);
    const cachedIndex = await cache.match('/');
    
    if (cachedIndex) {
      return cachedIndex;
    }
    
    // Try network
    return await fetch('/');
  } catch (error) {
    return createOfflinePage();
  }
}

// Create offline fallback responses
function handleOfflineFallback(pathname) {
  const offlineResponses = {
    '/api/simplify': createOfflineAnalysisResponse(),
    '/api/followup': createOfflineChatResponse(),
    '/api/sample-reports': createOfflineSampleReports(),
    '/api/chatbot/suggestions': createOfflineChatSuggestions(),
    '/api/health': createOfflineHealthCheck()
  };
  
  return offlineResponses[pathname] || createGenericOfflineResponse();
}

// Offline response creators
function createOfflineAnalysisResponse() {
  const response = {
    success: true,
    mode: 'offline',
    simplifiedText: `**Offline Analysis Available**

This is a basic offline analysis of your medical text. While offline, I can identify common medical terms and provide basic explanations.

**Important Note**: This offline analysis is limited. For comprehensive AI-powered explanations and personalized insights, please connect to the internet.

**What I can do offline:**
• Identify common medical terms
• Provide basic explanations and normal ranges
• Detect emergency keywords
• Offer general health recommendations

**Next Steps:**
• Connect to the internet for full AI analysis
• Discuss results with your healthcare provider
• Keep a copy of your medical records`,
    language: 'English',
    isOffline: true,
    limitation: 'Limited offline analysis. Connect to internet for full AI features.'
  };
  
  return new Response(JSON.stringify(response), {
    headers: { 'Content-Type': 'application/json' },
    status: 200
  });
}

function createOfflineChatResponse() {
  const responses = [
    "I'm currently in offline mode. I can provide basic medical information, but for detailed analysis, please connect to the internet.",
    "While offline, I can help with basic medical terms and emergency guidance. What would you like to know?",
    "In offline mode, I have access to essential medical knowledge. Ask me about common medical terms or symptoms.",
    "I'm working offline right now. I can still help with basic medical questions and emergency information."
  ];
  
  const response = {
    success: true,
    answer: responses[Math.floor(Math.random() * responses.length)],
    mode: 'offline',
    isOffline: true
  };
  
  return new Response(JSON.stringify(response), {
    headers: { 'Content-Type': 'application/json' },
    status: 200
  });
}

function createOfflineSampleReports() {
  const sampleReports = [
    {
      id: 1,
      title: "Basic Blood Work (Offline Demo)",
      category: "Laboratory",
      description: "Sample CBC results for offline demonstration",
      content: "Hemoglobin: 14.2 g/dL\nWhite Blood Cells: 6,500/μL\nPlatelets: 250,000/μL\nGlucose: 95 mg/dL"
    },
    {
      id: 2, 
      title: "Vital Signs Check (Offline Demo)",
      category: "Vital Signs",
      description: "Basic vital signs for offline analysis",
      content: "Blood Pressure: 118/75 mmHg\nHeart Rate: 72 bpm\nTemperature: 98.6°F\nRespiratory Rate: 16/min"
    }
  ];
  
  return new Response(JSON.stringify({ success: true, reports: sampleReports }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200
  });
}

function createOfflineChatSuggestions() {
  const suggestions = [
    "What does my blood pressure reading mean?",
    "Are my glucose levels normal?", 
    "What should I ask my doctor?",
    "How do I read my lab results?",
    "What are emergency warning signs?"
  ];
  
  return new Response(JSON.stringify({ success: true, suggestions }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200
  });
}

function createOfflineHealthCheck() {
  const healthStatus = {
    status: 'offline',
    message: 'Running in offline mode with basic functionality',
    features: {
      textAnalysis: 'basic',
      voiceAssistant: 'available',
      multiLanguage: 'limited',
      aiInsights: 'unavailable'
    },
    timestamp: new Date().toISOString()
  };
  
  return new Response(JSON.stringify(healthStatus), {
    headers: { 'Content-Type': 'application/json' },
    status: 200
  });
}

function createGenericOfflineResponse() {
  const response = {
    success: false,
    error: 'This feature requires an internet connection',
    mode: 'offline',
    message: 'You are currently offline. Basic medical analysis is still available.'
  };
  
  return new Response(JSON.stringify(response), {
    headers: { 'Content-Type': 'application/json' },
    status: 503
  });
}

function createOfflinePage() {
  const offlineHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>MediClarify AI - Offline</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .container {
          max-width: 500px;
          background: rgba(255, 255, 255, 0.1);
          padding: 40px;
          border-radius: 20px;
          backdrop-filter: blur(10px);
        }
        h1 { margin-bottom: 20px; }
        .icon { font-size: 64px; margin-bottom: 20px; }
        .retry-btn {
          background: #fff;
          color: #667eea;
          border: none;
          padding: 12px 24px;
          border-radius: 25px;
          font-weight: bold;
          cursor: pointer;
          margin-top: 20px;
        }
        .retry-btn:hover {
          background: #f0f0f0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">🤖</div>
        <h1>IntelliHealth Assistant</h1>
        <h2>You're Offline</h2>
        <p>Don't worry! Basic medical analysis is still available while offline.</p>
        <p>Connect to the internet for full AI-powered features.</p>
        <button class="retry-btn" onclick="window.location.reload()">
          Try Again
        </button>
      </div>
    </body>
    </html>
  `;
  
  return new Response(offlineHtml, {
    headers: { 'Content-Type': 'text/html' },
    status: 200
  });
}

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-medical-data') {
    event.waitUntil(syncMedicalData());
  }
});

async function syncMedicalData() {
  try {
    // Sync any pending offline data when connection is restored
    const pendingData = await self.registration.sync.getTags();
    console.log('Syncing pending data:', pendingData);
    
    // Implementation would send offline-generated data to server
    // and update local cache with latest medical data
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Push notifications for health reminders (if implemented)
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body || 'IntelliHealth Assistant notification',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: data.data || {},
    actions: [
      {
        action: 'open',
        title: 'Open App'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'IntelliHealth Assistant', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});

console.log('IntelliHealth Assistant Service Worker loaded successfully'); 