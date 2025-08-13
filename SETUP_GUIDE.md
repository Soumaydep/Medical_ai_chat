# Quick Setup Guide - MediChat AI

## 🚀 Get Started in 3 Steps

### Step 1: Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the API key (starts with `sk-...`)

> **Important**: Make sure you have GPT-4 access. You can check this in your [OpenAI account settings](https://platform.openai.com/account/limits).

### Step 2: Configure the API Key

1. Open the file `server/.env` in your project
2. Replace `your_openai_api_key_here` with your actual API key:

```env
# Replace this line:
OPENAI_API_KEY=your_openai_api_key_here

# With your actual key:
OPENAI_API_KEY=sk-your-actual-api-key-here
```

### Step 3: Restart the Application

```bash
# Stop the current servers (if running)
# Press Ctrl+C in the terminal

# Start the application
npm run dev
```

## ✅ Test the Application

1. Open http://localhost:3000 in your browser
2. Try this sample medical text:

```
CBC: WBC 12.5 x10³/μL (elevated), RBC 4.2 x10⁶/μL, Hgb 13.2 g/dL, Hct 39%, PLT 285 x10³/μL. CMP: Glucose 110 mg/dL, BUN 18 mg/dL, Creatinine 1.1 mg/dL, eGFR >60, AST 35 U/L, ALT 28 U/L.
```

3. Click "Simplify Medical Text"
4. You should get an AI-powered explanation!

## 🐛 Common Issues

### "OpenAI API key not configured"
- Make sure you saved the `.env` file after adding your API key
- Restart the development servers after making changes

### "Invalid OpenAI API key"
- Double-check your API key is correct
- Make sure there are no extra spaces or characters

### "Access denied" or "GPT-4 access"
- Verify you have GPT-4 access in your OpenAI account
- You may need to add billing information to your OpenAI account

### SSL Certificate Errors
- This should be automatically handled in development
- Try restarting your internet connection if issues persist

## 💡 Features to Try

- **Language Selection**: Choose from 10+ languages
- **OCR Upload**: Drag & drop medical report images
- **Interactive Chat**: Ask follow-up questions about your report
- **Example Texts**: Use the provided medical report examples

## 💰 Cost Information

- GPT-4 costs approximately $0.03 per 1K input tokens and $0.06 per 1K output tokens
- A typical medical report simplification costs around $0.10-$0.30
- Monitor your usage at [OpenAI Usage Dashboard](https://platform.openai.com/usage)

---

Need help? Check the main README.md or create an issue in the repository! 