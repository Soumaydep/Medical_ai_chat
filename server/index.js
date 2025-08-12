process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { sampleMedicalReports, chatbotResponses, medicalEducationContent } = require('./dummy-data');
const { getLanguageExample, getTranslatedResponse } = require('./multi-language-examples');
const { medicalInsights, medicalDictionary, healthRecommendations } = require('./ai-analytics');
const { EnhancedMedicalNLP } = require('./enhanced-medical-nlp');
const OpenAI = require('openai');

// Fix SSL certificate issues in development
if (process.env.NODE_ENV === 'development') {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
}

// Additional SSL fixes for Windows
const https = require('https');
const originalAgent = https.globalAgent;
https.globalAgent = new https.Agent({
  rejectUnauthorized: false,
  secureProtocol: 'TLSv1_2_method'
});

// Load environment variables
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const PORT = process.env.PORT || 5000;

// Validate Gemini API key
if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
  console.warn('⚠️  Warning: Gemini API key not configured. Please add your API key to .env');
  console.warn('   The app will run but AI features will not work until you add your API key.');
}

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy-key');

// Initialize Enhanced Medical NLP
const medicalNLP = new EnhancedMedicalNLP();
console.log('✅ Enhanced Medical NLP initialized');

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'MediChat AI Server is running' });
});

// Sample medical reports endpoint
app.get('/api/sample-reports', (req, res) => {
  res.json({
    success: true,
    reports: sampleMedicalReports,
    message: 'Sample medical reports for testing and demo purposes'
  });
});

// Get specific sample report
app.get('/api/sample-reports/:id', (req, res) => {
  const reportId = parseInt(req.params.id);
  const report = sampleMedicalReports.find(r => r.id === reportId);
  
  if (!report) {
    return res.status(404).json({ error: 'Sample report not found' });
  }
  
  res.json({
    success: true,
    report: report
  });
});

// Chatbot suggestions endpoint
app.get('/api/chatbot/suggestions', (req, res) => {
  const suggestions = [
    "What do these test results mean?",
    "Should I be worried about anything?",
    "What are normal values for blood work?",
    "What questions should I ask my doctor?",
    "Explain medical terms in my report",
    "What lifestyle changes should I make?",
    "When should I retest these values?"
  ];
  
  res.json({
    success: true,
    suggestions: suggestions
  });
});

// Enhanced chatbot endpoint with better responses
app.post('/api/chatbot/ask', async (req, res) => {
  try {
    const { question, context } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const questionLower = question.toLowerCase();
    
    // Check for greetings
    if (questionLower.includes('hello') || questionLower.includes('hi') || questionLower.includes('hey')) {
      const greeting = chatbotResponses.greetings[Math.floor(Math.random() * chatbotResponses.greetings.length)];
      return res.json({
        success: true,
        answer: greeting,
        type: 'greeting'
      });
    }

    // Check for common medical questions
    for (const [key, response] of Object.entries(chatbotResponses.commonQuestions)) {
      if (questionLower.includes(key)) {
        return res.json({
          success: true,
          answer: response,
          type: 'common_question'
        });
      }
    }

    // Check for test explanations
    for (const [key, explanation] of Object.entries(chatbotResponses.testExplanations)) {
      if (questionLower.includes(key)) {
        return res.json({
          success: true,
          answer: explanation,
          type: 'test_explanation'
        });
      }
    }

    // Check for medical terms
    for (const [term, definition] of Object.entries(chatbotResponses.medicalTerms)) {
      if (questionLower.includes(term)) {
        return res.json({
          success: true,
          answer: definition,
          type: 'medical_term'
        });
      }
    }

    // Fallback response
    const fallback = chatbotResponses.fallbacks[Math.floor(Math.random() * chatbotResponses.fallbacks.length)];
    res.json({
      success: true,
      answer: fallback,
      type: 'fallback'
    });

  } catch (error) {
    console.error('Error in chatbot endpoint:', error);
    res.status(500).json({
      error: 'Failed to process chatbot request',
      message: error.message
    });
  }
});

// Simplify medical text endpoint
app.post('/api/simplify', async (req, res) => {
  try {
    const { medicalText, language = 'English' } = req.body;

    if (!medicalText) {
      return res.status(400).json({ error: 'Medical text is required' });
    }

    // Check if API key is configured - if not, use demo mode
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here' || process.env.GEMINI_API_KEY === 'dummy-key') {
      // Enhanced demo mode - use sample data if medical text matches
      let demoSimplification = null;
      
      // Check if we have a translation for the selected language
      if (language !== 'English') {
        const languageExample = getLanguageExample(language, 'cbc');
        if (languageExample && medicalText.toLowerCase().includes('cbc')) {
          demoSimplification = languageExample;
        }
      }
      
      // If no language-specific example, check English samples
      if (!demoSimplification) {
        for (const report of sampleMedicalReports) {
          if (medicalText.toLowerCase().includes('cbc') && report.title.includes('CBC')) {
            demoSimplification = report.simplifiedText;
            break;
          } else if (medicalText.toLowerCase().includes('cmp') && report.title.includes('CMP')) {
            demoSimplification = report.simplifiedText;
            break;
          } else if (medicalText.toLowerCase().includes('thyroid') && report.title.includes('Thyroid')) {
            demoSimplification = report.simplifiedText;
            break;
          } else if (medicalText.toLowerCase().includes('cholesterol') && report.title.includes('Lipid')) {
            demoSimplification = report.simplifiedText;
            break;
          }
        }
      }
      
      // If no specific match, use a generic demo response
      if (!demoSimplification) {
        demoSimplification = `🔬 **DEMO MODE** - Here's what a real AI explanation would look like:

**In Simple Terms:**
Your medical report contains several important health markers:

• **Test Results**: The values in your report help doctors understand how different parts of your body are working.

• **Normal Ranges**: Each test has a normal range, and your results are compared to these standards.

• **What to Watch**: Any values outside normal ranges may need attention or follow-up with your doctor.

• **Overall Health**: Most test results work together to give a complete picture of your health.

**What this means:** AI would analyze each specific value in your report and explain what it means for your health in simple, easy-to-understand language.

---
⚠️ **Note:** This is a demo response. To get real AI-powered explanations, please add your Gemini API key to the .env file.`;
      } else {
        // Add demo note to the matched sample
        demoSimplification += `

---
🔬 **DEMO MODE**: This is a sample explanation based on typical test results${language !== 'English' ? ` in ${language}` : ''}. 
⚠️ **Note:** To get real AI-powered explanations for your specific medical reports, please add your Gemini API key to the .env file.`;
      }
      
      const demoResponse = {
        success: true,
        originalText: medicalText,
        simplifiedText: demoSimplification,
        language: language,
        demo: true
      };
      
      return res.json(demoResponse);
    }

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemInstruction = "You are a helpful medical assistant that specializes in explaining complex medical information in simple, easy-to-understand language for patients and their families.";
    
    const prompt = `${systemInstruction}

Explain the following medical text in simple, layman-friendly language that anyone can understand. Use clear, non-technical terms and avoid medical jargon. If the language requested is not English, provide the explanation in ${language}:

Medical Text: ${medicalText}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const simplifiedText = response.text();

    res.json({
      success: true,
      originalText: medicalText,
      simplifiedText: simplifiedText,
      language: language
    });

  } catch (error) {
    console.error('Error in /api/simplify:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to simplify medical text';
    if (error.code === 'UNABLE_TO_GET_ISSUER_CERT_LOCALLY' || error.errno === 'UNABLE_TO_GET_ISSUER_CERT_LOCALLY') {
      errorMessage = 'SSL certificate error detected. Attempting to use demo mode due to network configuration issues.';
      
      // Fallback to demo mode for SSL issues
      const demoResponse = {
        success: true,
        originalText: medicalText,
        simplifiedText: `🔬 **SSL ISSUE - DEMO MODE** - Network configuration prevented real AI processing:

**In Simple Terms (Demo Response):**
Your blood test shows some values that are easy to understand:

• **White Blood Cells (WBC)**: 12.5 - This is slightly higher than normal (normal is 4-11). This usually means your body might be fighting off an infection or dealing with some inflammation.

• **Red Blood Cells (RBC) & Hemoglobin (Hgb)**: These are normal, which means your blood is carrying oxygen well throughout your body.

• **Platelets (PLT)**: 285 - This is normal, which means your blood can clot properly if you get a cut.

• **Blood Sugar (Glucose)**: 110 - This is slightly elevated but still acceptable (normal is under 100 when fasting).

• **Kidney Function**: Your creatinine and other kidney markers look good, meaning your kidneys are working well.

• **Liver Function**: Your liver enzymes (AST, ALT) are normal, so your liver is healthy.

**What this means:** Overall, your blood work looks mostly good! The slightly high white blood cell count might just mean you're fighting off a minor infection. It's worth discussing with your doctor, but nothing here looks alarming.

---
⚠️ **Note:** This is a demo response due to SSL certificate issues. To resolve this, try: 1) Check your corporate firewall/proxy settings, 2) Update your system certificates, or 3) Contact your IT department.`,
        language: language,
        demo: true,
        sslError: true
      };
      
      return res.json(demoResponse);
    } else if (error.status === 401) {
      errorMessage = 'Invalid OpenAI API key. Please check your API key configuration.';
    } else if (error.status === 429) {
      errorMessage = 'OpenAI API rate limit exceeded. Please try again later.';
    } else if (error.status === 403) {
      errorMessage = 'Access denied. Please check if you have GPT-4 access on your OpenAI account.';
    }
    
    res.status(500).json({
      error: errorMessage,
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Simplify medical report endpoint
app.post('/api/simplify-report', async (req, res) => {
    const { report } = req.body;
    if (!report) {
        return res.status(400).json({ error: 'No report provided' });
    }
    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a helpful medical assistant. Simplify the following medical report for a patient in plain language.' },
                { role: 'user', content: report }
            ],
            max_tokens: 512,
            temperature: 0.5,
        });
        const simplified = completion.choices[0].message.content.trim();
        res.json({ simplified });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to simplify report' });
  }
});

// Follow-up questions endpoint
app.post('/api/followup', async (req, res) => {
  try {
    const { originalText, simplifiedText, question, language = 'English' } = req.body;

    if (!originalText || !question) {
      return res.status(400).json({ error: 'Original text and question are required' });
    }

    // Check if API key is configured - if not, use demo mode
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here' || process.env.GEMINI_API_KEY === 'dummy-key') {
      // Enhanced demo mode with better responses
      const questionLower = question.toLowerCase();
      let demoAnswer = null;

      // Check for common medical questions using our chatbot responses
      for (const [key, response] of Object.entries(chatbotResponses.commonQuestions)) {
        if (questionLower.includes(key)) {
          // Check if we have a translation for this language
          const translatedResponse = getTranslatedResponse(language, key);
          if (translatedResponse && language !== 'English') {
            demoAnswer = `🔬 **DEMO MODE** (${language}): ${translatedResponse}`;
          } else {
            demoAnswer = `🔬 **DEMO MODE**: ${response}`;
          }
          break;
        }
      }

      // Check for medical terms
      if (!demoAnswer) {
        for (const [term, definition] of Object.entries(chatbotResponses.medicalTerms)) {
          if (questionLower.includes(term)) {
            demoAnswer = `🔬 **DEMO MODE**: ${definition}`;
            break;
          }
        }
      }

      // Check for test explanations
      if (!demoAnswer) {
        for (const [test, explanation] of Object.entries(chatbotResponses.testExplanations)) {
          if (questionLower.includes(test)) {
            demoAnswer = `🔬 **DEMO MODE**: ${explanation}`;
            break;
          }
        }
      }

      // Fallback to generic demo response
      if (!demoAnswer) {
        demoAnswer = `🔬 **DEMO MODE**: This is a sample response to "${question}". 

In a real scenario, the AI would analyze your specific medical report and provide a detailed, personalized answer to your question. The AI can explain medical terms, discuss test results, suggest follow-up questions for your doctor, and help you understand what your results mean in simple language.

Here are some things I can help with in full mode:
• Explain specific test values and what they mean
• Discuss whether results are normal or concerning
• Suggest lifestyle changes based on your results
• Recommend questions to ask your doctor
• Define medical terminology in simple terms

---
⚠️ **Note:** This is a demo response. To get real AI-powered answers, please add your Gemini API key to the .env file.`;
      } else {
        demoAnswer += `

---
⚠️ **Note:** This is a demo response. To get real AI-powered answers, please add your Gemini API key to the .env file.`;
      }

      return res.json({
        success: true,
        question: question,
        answer: demoAnswer,
        language: language,
        demo: true
      });
    }

    const prompt = `Based on the following medical information, please answer the user's follow-up question in simple, clear language${language !== 'English' ? ` in ${language}` : ''}:

Original Medical Text: ${originalText}

${simplifiedText ? `Simplified Explanation: ${simplifiedText}` : ''}

User's Question: ${question}

Please provide a helpful, accurate answer that a non-medical person can understand.`;

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemInstruction = "You are a helpful medical assistant that answers follow-up questions about medical reports in simple, understandable language. Always encourage users to consult with their healthcare providers for medical advice.";
    
    const fullPrompt = `${systemInstruction}

${prompt}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const answer = response.text();

    res.json({
      success: true,
      question: question,
      answer: answer,
      language: language
    });

  } catch (error) {
    console.error('Error in /api/followup:', error);
    res.status(500).json({
      error: 'Failed to process follow-up question',
      message: error.message
    });
  }
});

// Extract text from image endpoint (placeholder for OCR integration)
app.post('/api/extract-text', async (req, res) => {
  try {
    const { imageData } = req.body;

    if (!imageData) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    // This will be implemented with Tesseract.js on the frontend
    // For now, return a placeholder response
    res.json({
      success: true,
      extractedText: "OCR functionality will be implemented on the frontend using Tesseract.js",
      message: "Please implement OCR on the frontend and send the extracted text to /api/simplify"
    });

  } catch (error) {
    console.error('Error in /api/extract-text:', error);
    res.status(500).json({
      error: 'Failed to extract text from image',
      message: error.message
    });
  }
});

// Medical dictionary search endpoint
app.get('/api/dictionary/search', (req, res) => {
  try {
    const { q: query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const results = medicalDictionary.searchTerm(query);
    
    res.json({
      success: true,
      results: results,
      query: query
    });
  } catch (error) {
    console.error('Error in dictionary search:', error);
    res.status(500).json({
      error: 'Failed to search medical dictionary',
      message: error.message
    });
  }
});

// Health insights analytics endpoint
app.post('/api/health-insights', async (req, res) => {
  try {
    const { medicalReports, userProfile } = req.body;
    
    // Generate health insights using our analytics engine
    const trends = medicalInsights.analyzeHealthTrends(medicalReports || []);
    const riskAssessment = medicalInsights.generateRiskAssessment(userProfile || {});
    const predictions = medicalInsights.predictHealthOutcomes(trends);
    const recommendations = healthRecommendations.generatePersonalizedPlan(userProfile || {}, medicalReports || []);
    const followUpSchedule = healthRecommendations.generateFollowUpSchedule(riskAssessment);

    res.json({
      success: true,
      insights: {
        trends,
        riskAssessment,
        predictions,
        recommendations,
        followUpSchedule
      }
    });
  } catch (error) {
    console.error('Error generating health insights:', error);
    res.status(500).json({
      error: 'Failed to generate health insights',
      message: error.message
    });
  }
});

// AI-powered follow-up recommendations endpoint
app.post('/api/recommendations', async (req, res) => {
  try {
    const { medicalData, currentSymptoms, riskFactors } = req.body;
    
    if (!medicalData) {
      return res.status(400).json({ error: 'Medical data is required' });
    }

    // Demo recommendations - in real app this would use AI analysis
    const recommendations = {
      immediate: [
        {
          priority: 'high',
          category: 'lifestyle',
          title: 'Monitor Blood Pressure Daily',
          description: 'Track your blood pressure readings twice daily for the next 2 weeks',
          reasoning: 'Recent readings show borderline hypertension',
          timeframe: 'Next 2 weeks'
        },
        {
          priority: 'medium',
          category: 'dietary',
          title: 'Reduce Sodium Intake',
          description: 'Limit sodium to 2,300mg per day. Read food labels and avoid processed foods',
          reasoning: 'High sodium can worsen blood pressure',
          timeframe: 'Start immediately'
        }
      ],
      longTerm: [
        {
          priority: 'medium',
          category: 'exercise',
          title: 'Cardiovascular Exercise Program',
          description: '30 minutes of moderate exercise 5 days per week',
          reasoning: 'Regular exercise improves cardiovascular health and helps control blood pressure',
          timeframe: 'Next 3 months'
        },
        {
          priority: 'low',
          category: 'monitoring',
          title: 'Regular Health Screenings',
          description: 'Schedule lipid panel and glucose test every 6 months',
          reasoning: 'Early detection of metabolic changes',
          timeframe: 'Ongoing'
        }
      ],
      followUp: [
        {
          specialist: 'Cardiologist',
          timeframe: '4-6 weeks',
          reason: 'Borderline hypertension evaluation',
          urgency: 'moderate'
        },
        {
          specialist: 'Primary Care',
          timeframe: '3 months',
          reason: 'Follow-up on lifestyle modifications',
          urgency: 'low'
        }
      ]
    };

    res.json({
      success: true,
      recommendations: recommendations,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({
      error: 'Failed to generate recommendations',
      message: error.message
    });
  }
});

// Gastric diet recommendations endpoint
app.post('/api/gastric-recommendations', async (req, res) => {
  try {
    const { symptoms, severity, age, lifestyle } = req.body;
    
    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({ error: 'Symptoms are required' });
    }

    // Advanced gastric recommendations based on symptoms
    const gastricAdvice = {
      immediate: [],
      dietary: [],
      lifestyle: [],
      supplements: [],
      monitoring: []
    };

    // Severity-based recommendations
    const severityLevel = severity || 'mild';
    
    // Symptom-specific advice
    if (symptoms.includes('acidity')) {
      gastricAdvice.immediate.push({
        action: 'Alkaline Water',
        description: 'Drink lukewarm water with a pinch of baking soda',
        timing: 'When experiencing heartburn'
      });
      gastricAdvice.dietary.push({
        change: 'Reduce Acidic Foods',
        foods: ['Limit tomatoes, citrus, coffee, chocolate'],
        benefit: 'Reduces acid production'
      });
    }

    if (symptoms.includes('bloating')) {
      gastricAdvice.immediate.push({
        action: 'Digestive Tea',
        description: 'Fennel or ginger tea after meals',
        timing: 'Post-meal digestive aid'
      });
      gastricAdvice.lifestyle.push({
        change: 'Eating Habits',
        practice: 'Eat slowly, chew thoroughly, avoid gas-producing foods',
        benefit: 'Reduces gas formation'
      });
    }

    if (symptoms.includes('stomachPain')) {
      gastricAdvice.immediate.push({
        action: 'Warm Compress',
        description: 'Apply warm heating pad to abdomen',
        timing: 'During pain episodes'
      });
      gastricAdvice.dietary.push({
        change: 'Bland Diet',
        foods: ['Rice, bananas, toast, applesauce'],
        benefit: 'Gentle on inflamed stomach'
      });
    }

    if (symptoms.includes('gerd')) {
      gastricAdvice.lifestyle.push({
        change: 'Sleep Position',
        practice: 'Elevate head of bed 6-8 inches',
        benefit: 'Prevents acid reflux at night'
      });
      gastricAdvice.dietary.push({
        change: 'Meal Timing',
        foods: ['Stop eating 3 hours before bed'],
        benefit: 'Allows digestion before lying down'
      });
    }

    // Age-specific recommendations
    if (age && age > 50) {
      gastricAdvice.supplements.push({
        supplement: 'Digestive Enzymes',
        description: 'May help with protein digestion',
        consultation: 'Consult doctor before starting'
      });
    }

    // Lifestyle-based additions
    if (lifestyle === 'sedentary') {
      gastricAdvice.lifestyle.push({
        change: 'Physical Activity',
        practice: '20-minute walk after meals',
        benefit: 'Improves digestion and reduces bloating'
      });
    }

    // General monitoring advice
    gastricAdvice.monitoring = [
      {
        track: 'Symptom Diary',
        description: 'Record foods and symptoms for 2 weeks',
        purpose: 'Identify personal trigger foods'
      },
      {
        track: 'Meal Timing',
        description: 'Note when symptoms occur relative to meals',
        purpose: 'Optimize eating schedule'
      }
    ];

    // Red flag symptoms requiring medical attention
    const redFlags = [];
    if (symptoms.includes('severeAbdominalPain')) {
      redFlags.push('Severe abdominal pain requires immediate medical attention');
    }
    if (symptoms.includes('bloodInStool')) {
      redFlags.push('Blood in stool requires urgent medical evaluation');
    }

    res.json({
      success: true,
      recommendations: gastricAdvice,
      redFlags: redFlags,
      followUp: {
        timeframe: severityLevel === 'severe' ? '1-2 weeks' : '4-6 weeks',
        specialist: severityLevel === 'severe' ? 'Gastroenterologist' : 'Primary Care',
        reason: 'Monitor symptom improvement with dietary changes'
      },
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating gastric recommendations:', error);
    res.status(500).json({
      error: 'Failed to generate gastric recommendations',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 MediChat AI Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

module.exports = app; 