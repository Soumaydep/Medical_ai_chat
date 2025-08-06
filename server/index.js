const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

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

const app = express();
const PORT = process.env.PORT || 5000;

// Validate Gemini API key
if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
  console.warn('⚠️  Warning: Gemini API key not configured. Please add your API key to .env');
  console.warn('   The app will run but AI features will not work until you add your API key.');
}

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy-key');

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

// Simplify medical text endpoint
app.post('/api/simplify', async (req, res) => {
  try {
    const { medicalText, language = 'English' } = req.body;

    if (!medicalText) {
      return res.status(400).json({ error: 'Medical text is required' });
    }

    // Check if API key is configured - if not, use demo mode
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here' || process.env.GEMINI_API_KEY === 'dummy-key') {
      // Demo mode - return a sample response
      const demoResponse = {
        success: true,
        originalText: medicalText,
        simplifiedText: `🔬 **DEMO MODE** - Here's what a real AI explanation would look like:

**In Simple Terms:**
Your blood test shows some values that are easy to understand:

• **White Blood Cells (WBC)**: 12.5 - This is slightly higher than normal (normal is 4-11). This usually means your body might be fighting off an infection or dealing with some inflammation.

• **Red Blood Cells (RBC) & Hemoglobin (Hgb)**: These are normal, which means your blood is carrying oxygen well throughout your body.

• **Platelets (PLT)**: 285 - This is normal, which means your blood can clot properly if you get a cut.

• **Blood Sugar (Glucose)**: 110 - This is slightly elevated but still acceptable (normal is under 100 when fasting).

• **Kidney Function**: Your creatinine and other kidney markers look good, meaning your kidneys are working well.

• **Liver Function**: Your liver enzymes (AST, ALT) are normal, so your liver is healthy.

**What this means:** Overall, your blood work looks mostly good! The slightly high white blood cell count might just mean you're fighting off a minor infection. It's worth discussing with your doctor, but nothing here looks alarming.

---
⚠️ **Note:** This is a demo response. To get real AI-powered explanations, please add your Gemini API key to the .env file.`,
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

// Follow-up questions endpoint
app.post('/api/followup', async (req, res) => {
  try {
    const { originalText, simplifiedText, question, language = 'English' } = req.body;

    if (!originalText || !question) {
      return res.status(400).json({ error: 'Original text and question are required' });
    }

    // Check if API key is configured - if not, use demo mode
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here' || process.env.GEMINI_API_KEY === 'dummy-key') {
      // Demo mode - return a sample response
      const demoAnswers = {
        'what do these test results mean?': 'In demo mode: Your test results show mostly normal values with slightly elevated white blood cells, which often indicates your body is fighting a minor infection.',
        'should i be concerned about anything?': 'In demo mode: The slightly high white blood cell count is worth mentioning to your doctor, but it\'s usually not serious. Everything else looks good!',
        'what are the next steps?': 'In demo mode: I\'d recommend discussing the elevated WBC with your doctor at your next appointment. They might want to recheck it in a few weeks.',
        'explain the medical terms used': 'In demo mode: WBC = White Blood Cells (infection fighters), RBC = Red Blood Cells (oxygen carriers), Hgb = Hemoglobin (oxygen protein), PLT = Platelets (clotting helpers).',
        'what questions should i ask my doctor?': 'In demo mode: Ask: "What could cause my elevated WBC?" and "Should I retest this in a few weeks?" and "Are there any symptoms I should watch for?"'
      };

      const questionLower = question.toLowerCase();
      let demoAnswer = demoAnswers[questionLower];
      
      if (!demoAnswer) {
        // Generic demo response
        demoAnswer = `🔬 **DEMO MODE**: This is a sample response to "${question}". 

In a real scenario, the AI would analyze your specific medical report and provide a detailed, personalized answer to your question. The AI can explain medical terms, discuss test results, suggest follow-up questions for your doctor, and help you understand what your results mean in simple language.

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