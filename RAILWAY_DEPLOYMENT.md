# Railway Deployment Guide for The Written Hug

## Overview
This guide explains how to deploy "The Written Hug" application to Railway with proper Node.js 20+ compatibility and environment configuration.

## Pre-Deployment Steps

### 1. Node.js Version Configuration
- Railway deployment uses Node.js 20+ as specified in `.nvmrc`
- Nixpacks configuration in `nixpacks.toml` ensures proper Node.js version

### 2. Environment Variables
Set these environment variables in your Railway project:

**Required Variables:**
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase admin key
- `SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `BREVO_API_KEY` - Your Brevo email service API key
- `ADMIN_FROM_EMAIL` - Email address for admin notifications

### 3. Build Configuration
The application uses a custom build process:
1. Frontend: Vite builds React client to `dist/public`
2. Backend: ESBuild bundles Node.js server to `dist/index.js`

## Deployment Commands
Railway automatically runs:
```bash
npm ci           # Install dependencies
npm run build    # Build both frontend and backend
npm run start    # Start production server
```

## Production Server
- Uses Node.js compatible static file serving (no import.meta.dirname)
- Serves on Railway's dynamic PORT or fallback to 5000
- Handles both API routes and static client files

## Troubleshooting

### Common Issues:
1. **Node.js Version Error**: Ensure `.nvmrc` contains "20"
2. **Build Path Error**: Verify `dist/public` and `dist/index.js` exist after build
3. **Environment Variables**: Check all required variables are set in Railway dashboard

### Build Verification:
Run `./deploy-railway.sh` locally to test build process before deployment.

## Files Created for Railway:
- `railway.json` - Railway configuration
- `nixpacks.toml` - Node.js 20 requirement
- `.nvmrc` - Node version specification
- `Procfile` - Process definition
- `server/production.ts` - Production-compatible server functions
- `deploy-railway.sh` - Build verification script