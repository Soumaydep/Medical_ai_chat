const config = {
  API_URL: process.env.REACT_APP_API_URL || (
    process.env.NODE_ENV === 'production' 
      ? 'https://your-backend-url.railway.app' 
      : 'http://localhost:5000'
  )
};

export default config; 