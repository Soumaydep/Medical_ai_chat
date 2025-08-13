# MediChat AI - Deployment Guide

This guide will walk you through deploying the MediChat AI application to production using Vercel (frontend) and Railway (backend).

## 📋 Prerequisites

- OpenAI API key with GPT-4 access
- GitHub account
- Vercel account (free tier available)
- Railway account (free tier available)
- Git installed locally

## 🚀 Deployment Steps

### Step 1: Prepare Your Repository

1. **Push to GitHub**:
```bash
git add .
git commit -m "Initial commit - MediChat AI"
git push origin main
```

### Step 2: Deploy Backend to Railway

1. **Go to Railway**: Visit [railway.app](https://railway.app) and sign in

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your MediChat AI repository

3. **Configure Deployment**:
   - Set the **Root Directory** to `server`
   - Railway will automatically detect it's a Node.js app

4. **Add Environment Variables**:
   Go to your project settings and add these variables:
   ```
   OPENAI_API_KEY=your_actual_openai_api_key_here
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```
   ⚠️ **Important**: You'll need to update `FRONTEND_URL` after deploying the frontend

5. **Deploy**: Railway will automatically build and deploy your backend

6. **Note Your Backend URL**: Save the Railway URL (e.g., `https://your-app.railway.app`)

### Step 3: Deploy Frontend to Vercel

1. **Go to Vercel**: Visit [vercel.com](https://vercel.com) and sign in

2. **Import Project**:
   - Click "Add New..." > "Project"
   - Import your GitHub repository
   - Set the **Root Directory** to `client`

3. **Configure Build Settings**:
   - Framework: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`

4. **Add Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app
   ```
   Use the Railway URL from Step 2

5. **Deploy**: Click "Deploy" and wait for the build to complete

6. **Note Your Frontend URL**: Save the Vercel URL (e.g., `https://your-app.vercel.app`)

### Step 4: Update Backend CORS Settings

1. **Go back to Railway**: Update the `FRONTEND_URL` environment variable with your actual Vercel URL

2. **Redeploy**: Railway will automatically redeploy with the new settings

## 🔧 Configuration Details

### Backend Environment Variables (Railway)

| Variable | Description | Example |
|----------|-------------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | `sk-...` |
| `NODE_ENV` | Environment setting | `production` |
| `PORT` | Server port (Railway sets this automatically) | `5000` |
| `FRONTEND_URL` | Your Vercel frontend URL | `https://medichat-ai.vercel.app` |

### Frontend Environment Variables (Vercel)

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Your Railway backend URL | `https://medichat-ai.railway.app` |

## 📝 Post-Deployment Checklist

- [ ] Backend health check works: `https://your-backend.railway.app/api/health`
- [ ] Frontend loads without errors
- [ ] OpenAI API integration works (test with sample text)
- [ ] OCR functionality works (test with a medical image)
- [ ] Cross-origin requests work (no CORS errors)
- [ ] Language selection works
- [ ] Chat functionality works

## 🔧 Testing Your Deployment

1. **Visit Your Frontend URL**
2. **Test Basic Functionality**:
   - Select a language
   - Paste sample medical text:
     ```
     CBC: WBC 12.5 x10³/μL (elevated), Hgb 13.2 g/dL, PLT 285 x10³/μL
     ```
   - Click "Simplify Medical Text"
   - Ask a follow-up question in the chat

3. **Test OCR**: Upload a clear medical report image

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Verify `FRONTEND_URL` in Railway matches your Vercel URL exactly
   - Check for trailing slashes (remove them)

2. **OpenAI API Errors**:
   - Verify API key is correct
   - Check OpenAI usage limits and billing
   - Ensure you have GPT-4 access

3. **Build Failures**:
   - Check build logs in Vercel/Railway
   - Verify all dependencies are listed in package.json
   - Ensure Node.js version compatibility

4. **Environment Variables Not Working**:
   - Verify variable names are exact (case-sensitive)
   - Redeploy after changing environment variables
   - Check for typos in variable values

### Debug Steps

1. **Check Backend Logs**:
   - Go to Railway dashboard
   - View deployment logs
   - Look for error messages

2. **Check Frontend Console**:
   - Open browser developer tools
   - Look for JavaScript errors
   - Check network requests

3. **Test API Endpoints**:
   ```bash
   # Test health endpoint
   curl https://your-backend.railway.app/api/health
   
   # Test simplify endpoint
   curl -X POST https://your-backend.railway.app/api/simplify \
     -H "Content-Type: application/json" \
     -d '{"medicalText":"Test medical text","language":"English"}'
   ```

## 🔄 Updates and Maintenance

### Updating Your Deployment

1. **Make Changes Locally**
2. **Commit and Push**:
   ```bash
   git add .
   git commit -m "Update: description of changes"
   git push origin main
   ```
3. **Auto-Deploy**: Both Vercel and Railway will automatically redeploy

### Environment Management

- **Development**: Use local `.env` files
- **Production**: Use platform environment variable settings
- **Staging**: Consider creating separate Railway/Vercel projects

## 📊 Monitoring

### Railway Monitoring
- Monitor server performance and logs
- Set up alerts for downtime
- Monitor database usage (if added later)

### Vercel Monitoring
- Monitor build success/failures
- Check function execution logs
- Monitor bandwidth usage

### OpenAI Usage
- Monitor API usage in OpenAI dashboard
- Set up usage alerts
- Track costs and rate limits

## 🛡️ Security Considerations

1. **API Key Security**:
   - Never commit API keys to version control
   - Use environment variables for all secrets
   - Rotate API keys periodically

2. **CORS Configuration**:
   - Restrict to your specific frontend domain
   - Don't use wildcard (*) in production

3. **Rate Limiting**:
   - Consider implementing rate limiting for API endpoints
   - Monitor for unusual usage patterns

4. **HTTPS**:
   - Both Vercel and Railway provide HTTPS by default
   - Ensure all API calls use HTTPS

## 💰 Cost Considerations

### Railway (Backend)
- Free tier: 512MB RAM, $5 credit/month
- Paid plans start at $5/month

### Vercel (Frontend)
- Free tier: 100GB bandwidth, unlimited personal projects
- Paid plans start at $20/month for teams

### OpenAI API
- GPT-4: ~$0.03 per 1K tokens input, ~$0.06 per 1K tokens output
- Monitor usage to control costs
- Consider implementing usage limits

---

🎉 **Congratulations!** Your MediChat AI application is now live and ready to help users understand their medical reports!

For support, check the main README.md or create an issue in the repository. 