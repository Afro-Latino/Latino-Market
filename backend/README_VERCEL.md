# Vercel Deployment Guide

This FastAPI backend is configured for deployment on Vercel.

## Prerequisites

1. A Vercel account
2. MongoDB database (MongoDB Atlas recommended)
3. Environment variables configured

## Deployment Steps

### 1. Install Vercel CLI (optional)

```bash
npm i -g vercel
```

### 2. Set Environment Variables

In your Vercel project dashboard, add the following environment variables:

- `MONGO_URL` - Your MongoDB connection string
- `DB_NAME` - Your MongoDB database name
- `JWT_SECRET` - Secret key for JWT token generation (use a strong random string)
- `JWT_ALGORITHM` - JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration in minutes (default: 10080)
- `STRIPE_API_KEY` - Your Stripe API key (if using Stripe payments)

### 3. Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
vercel
```

Follow the prompts to link your project and deploy.

#### Option B: Using GitHub Integration

1. Push your code to a GitHub repository
2. Import the project in Vercel dashboard
3. Vercel will automatically detect the Python runtime and deploy

### 4. Verify Deployment

After deployment, your API will be available at:
- `https://your-project.vercel.app/api/...`

## Project Structure

```
backend/
├── api/
│   └── index.py          # Vercel serverless function entry point
├── server.py             # Main FastAPI application
├── models.py             # Pydantic models
├── auth.py               # Authentication utilities
├── requirements.txt      # Python dependencies
├── vercel.json           # Vercel configuration
└── .vercelignore         # Files to ignore during deployment
```

## Important Notes

1. **Environment Variables**: Never commit `.env` files. All secrets should be set in Vercel dashboard.

2. **MongoDB Connection**: The connection is configured with connection pooling for serverless environments. Make sure your MongoDB Atlas cluster allows connections from Vercel's IP ranges (or use 0.0.0.0/0 for development).

3. **Cold Starts**: Serverless functions may experience cold starts. Consider using Vercel Pro for better performance.

4. **File Uploads**: If you need file uploads, consider using cloud storage (S3, Cloudinary, etc.) as serverless functions have execution time limits.

5. **Webhooks**: For Stripe webhooks, make sure to configure the webhook URL in your Stripe dashboard to point to:
   `https://your-project.vercel.app/api/payments/stripe/webhook`

## Testing Locally

To test the Vercel setup locally:

```bash
vercel dev
```

This will start a local server that mimics Vercel's serverless environment.

## Troubleshooting

- **Import Errors**: Make sure all dependencies are listed in `requirements.txt`
- **Connection Timeouts**: Check MongoDB connection string and network access
- **Environment Variables**: Verify all required env vars are set in Vercel dashboard
- **Build Failures**: Check Vercel build logs for specific error messages

