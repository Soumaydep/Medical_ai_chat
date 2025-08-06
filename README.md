# MediChat AI - Medical Report Simplifier

A full-stack AI-powered application that simplifies complex medical reports and provides follow-up Q&A using OpenAI's GPT-4. Upload medical images, extract text with OCR, and get easy-to-understand explanations in multiple languages.

## 🚀 Features

- **Medical Text Simplification**: Convert complex medical jargon into plain language
- **Multi-language Support**: Get explanations in English, Hindi, Bengali, Spanish, French, German, Chinese, Japanese, Arabic, and Portuguese
- **OCR Text Extraction**: Upload medical report images (JPG, PNG, PDF) and extract text using Tesseract.js
- **Interactive Q&A Chat**: Ask follow-up questions about your medical reports
- **Modern UI**: Beautiful, responsive interface built with React and TailwindCSS
- **Secure & Private**: Medical data is processed securely with OpenAI API

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **TailwindCSS** - Utility-first CSS framework
- **Tesseract.js** - Client-side OCR text extraction
- **React Dropzone** - File upload handling
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **OpenAI GPT-4** - AI text processing
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logging

## 📁 Project Structure

```
medichat-ai/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Header.js
│   │   │   ├── LanguageSelector.js
│   │   │   ├── OCRUpload.js
│   │   │   ├── MedicalTextInput.js
│   │   │   ├── SimplifiedOutput.js
│   │   │   └── ChatBot.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── vercel.json         # Vercel deployment config
├── server/                 # Express backend
│   ├── index.js           # Main server file
│   ├── package.json
│   └── railway.json       # Railway deployment config
├── package.json           # Root package.json
├── env.example           # Environment variables template
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd medichat-ai
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install all project dependencies (client + server)
npm run install:all
```

### 3. Environment Setup

1. Copy the environment template:
```bash
cp env.example .env
```

2. Add your OpenAI API key to `.env`:
```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

3. Get your OpenAI API key:
   - Go to [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Make sure you have GPT-4 access

### 4. Run Development Servers

```bash
# Run both frontend and backend concurrently
npm run dev
```

This will start:
- Frontend at `http://localhost:3000`
- Backend at `http://localhost:5000`

### 5. Individual Commands

```bash
# Run only backend
npm run server:dev

# Run only frontend
npm run client:dev
```

## 📱 How to Use

1. **Select Language**: Choose your preferred output language from the dropdown
2. **Upload Image** (Optional): Drag & drop or select medical report images for OCR text extraction
3. **Enter Medical Text**: Paste or type medical text in the textarea
4. **Simplify**: Click "Simplify Medical Text" to get an AI explanation
5. **Ask Questions**: Use the chat interface to ask follow-up questions about your report

### Example Medical Text

Try pasting this sample blood test report:

```
CBC: WBC 12.5 x10³/μL (elevated), RBC 4.2 x10⁶/μL, Hgb 13.2 g/dL, Hct 39%, PLT 285 x10³/μL. CMP: Glucose 110 mg/dL, BUN 18 mg/dL, Creatinine 1.1 mg/dL, eGFR >60, AST 35 U/L, ALT 28 U/L.
```

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Push to GitHub**: Make sure your code is in a GitHub repository

2. **Deploy to Vercel**:
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Set the root directory to `client`
   - Add environment variable: `REACT_APP_API_URL` with your backend URL
   - Deploy

3. **Vercel CLI** (Alternative):
```bash
cd client
npx vercel --prod
```

### Backend Deployment (Railway)

1. **Deploy to Railway**:
   - Go to [Railway](https://railway.app)
   - Create a new project
   - Connect your GitHub repository
   - Set the root directory to `server`
   - Add environment variables:
     - `OPENAI_API_KEY`: Your OpenAI API key
     - `NODE_ENV`: `production`
     - `FRONTEND_URL`: Your Vercel frontend URL
   - Deploy

2. **Railway CLI** (Alternative):
```bash
cd server
railway login
railway deploy
```

### Environment Variables for Production

**Frontend (Vercel):**
```env
REACT_APP_API_URL=https://your-backend-url.railway.app
```

**Backend (Railway):**
```env
OPENAI_API_KEY=your_openai_api_key
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
PORT=5000
```

## 🔒 Security & Privacy

- **No Data Storage**: Medical data is not stored on our servers
- **Secure API**: All communications use HTTPS in production
- **OpenAI Privacy**: Data sent to OpenAI follows their privacy policy
- **Client-side OCR**: Text extraction happens in your browser

## ⚠️ Medical Disclaimer

This tool is for educational purposes only and should not replace professional medical advice. Always consult with qualified healthcare professionals for proper medical interpretation and treatment decisions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

1. **OpenAI API Errors**: 
   - Verify your API key is correct
   - Check if you have GPT-4 access
   - Ensure you have sufficient API credits

2. **OCR Not Working**:
   - Try with clearer, higher-resolution images
   - Ensure the image contains readable text
   - PDF OCR might take longer to process

3. **Development Server Issues**:
   - Check if ports 3000 and 5000 are available
   - Restart the development servers
   - Clear browser cache

4. **Deployment Issues**:
   - Verify all environment variables are set correctly
   - Check deployment logs for specific errors
   - Ensure the API URL is accessible

### Support

For additional support, please:
- Check the [Issues](https://github.com/your-repo/issues) page
- Create a new issue with detailed error information
- Include browser console logs and server logs

## 🚀 Future Enhancements

- [ ] Support for more file formats (DOCX, TXT)
- [ ] Batch processing of multiple reports
- [ ] Medical report templates and examples
- [ ] Integration with more AI models
- [ ] Voice-to-text input
- [ ] Export functionality (PDF, Word)
- [ ] User authentication and report history
- [ ] Medical term dictionary
- [ ] Integration with healthcare APIs

---

Built with ❤️ using React, Express, and OpenAI GPT-4 