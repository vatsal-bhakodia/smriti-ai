# 🚀 Smriti AI - Quick Development Setup Guide

## ⚠️ Current Issue: Missing Environment Variables

The 500 errors you're seeing are because the application needs environment variables to connect to services. Here's how to fix it:

## 🔧 Step-by-Step Setup

### 1. **Database Setup (Choose One Option)**

#### Option A: Local PostgreSQL (Recommended for Development)
```bash
# Install PostgreSQL locally, then create a database
createdb smriti_ai

# Update .env.local with your local database URL:
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/smriti_ai?schema=public"
DIRECT_URL="postgresql://your_username:your_password@localhost:5432/smriti_ai?schema=public"
```

#### Option B: Cloud Database (Supabase/Neon - Free Tier)
1. Go to [Supabase](https://supabase.com) or [Neon](https://neon.tech)
2. Create a new project
3. Copy the connection string to your `.env.local`

### 2. **Run Database Migrations**
```bash
# Generate Prisma client
npx prisma generate

# Push the schema to your database
npx prisma db push

# Optional: Open Prisma Studio to view your database
npx prisma studio
```

### 3. **Get API Keys**

#### Clerk (Authentication) - Required
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Copy the publishable key and secret key to `.env.local`

#### Google Gemini (AI) - Required for PDF/Video processing
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add it to `.env.local` as `GEMINI_API_KEY`

#### YouTube API (Optional - for video processing)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable YouTube Data API v3
3. Create credentials and add to `.env.local`

#### Cloudinary (Optional - for file uploads)
1. Go to [Cloudinary](https://cloudinary.com)
2. Get your cloud name, API key, and secret
3. Add to `.env.local`

### 4. **Restart Development Server**
```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

## 🎯 Quick Fix for Testing

If you just want to test the PDF processing feature quickly, you can use a SQLite database temporarily:

1. **Update `prisma/schema.prisma`:**
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

2. **Update `.env.local`:**
```bash
DATABASE_URL="file:./dev.db"
```

3. **Generate and push:**
```bash
npx prisma generate
npx prisma db push
```

This will create a local SQLite database file that doesn't require any external setup.

## ✅ Verification

Once setup is complete, you should see:
- No more 500 errors in the console
- Clerk authentication working
- Database connections successful
- PDF processing API ready to test

## 🧪 Testing PDF Feature

1. Sign up/sign in to the application
2. Create a new topic
3. Upload a PDF resource
4. Try generating a summary from the PDF
5. Test quiz generation from PDF content

## 📝 Notes

- The `.env.local` file I created has placeholder values
- Replace the placeholder values with your actual API keys
- Never commit your `.env.local` file to git (it's already in .gitignore)
- For production deployment, set these environment variables in your hosting platform
