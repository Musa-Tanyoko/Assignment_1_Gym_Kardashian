<<<<<<< HEAD
# Staging Deployment Guide

This guide will help you deploy the Fitness App to staging environment.

## Prerequisites

1. **Node.js** (>=18.0.0)
2. **pnpm** (>=8.0.0)
3. **Firebase Project** configured for staging
4. **Environment Variables** set up for staging

## Environment Setup

### 1. Firebase Configuration

You'll need to set up Firebase environment variables for staging. Create a `.env.staging` file in the root directory:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_staging_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_staging_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_staging_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_staging_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_staging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_staging_app_id

# Firebase Admin SDK
FIREBASE_PRIVATE_KEY=your_staging_private_key
FIREBASE_CLIENT_EMAIL=your_staging_client_email

# Environment Variables
NODE_ENV=staging
NEXT_PUBLIC_ENVIRONMENT=staging
```

## Deployment Options

### Option 1: Local Build (Recommended for testing)

```bash
# Navigate to the project directory
cd docs/fitness-app

# Install dependencies
pnpm install

# Build for staging
pnpm build:staging

# Run type checks and linting
pnpm type-check
pnpm lint

# Start staging server locally
pnpm start:staging
```

### Option 2: Using Deployment Scripts

#### For Windows (PowerShell):

```powershell
# Navigate to the project directory
cd docs/fitness-app

# Run the PowerShell deployment script
.\deploy-staging.ps1
```

#### For Unix/Linux/macOS:

```bash
# Navigate to the project directory
cd docs/fitness-app

# Make the script executable
chmod +x deploy-staging.sh

# Run the deployment script
./deploy-staging.sh
```

### Option 3: Vercel Deployment

1. **Install Vercel CLI**:

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:

   ```bash
   vercel login
   ```

3. **Deploy to staging**:

   ```bash
   cd docs/fitness-app
   vercel --prod
   ```

4. **Set environment variables in Vercel dashboard**:
   - Go to your project settings
   - Add all Firebase environment variables
   - Set `NODE_ENV=staging`
   - Set `NEXT_PUBLIC_ENVIRONMENT=staging`

### Option 4: Netlify Deployment

1. **Install Netlify CLI**:

   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:

   ```bash
   netlify login
   ```

3. **Deploy to staging**:

   ```bash
   cd docs/fitness-app
   netlify deploy --prod
   ```

4. **Set environment variables in Netlify dashboard**:
   - Go to Site settings > Environment variables
   - Add all Firebase environment variables
   - Set `NODE_ENV=staging`
   - Set `NEXT_PUBLIC_ENVIRONMENT=staging`

## Verification

After deployment, verify the following:

1. **Application loads** without errors
2. **Firebase connection** is working
3. **Environment variables** are correctly set
4. **All features** function as expected
5. **Console logs** show staging environment

## Troubleshooting

### Common Issues:

1. **Build fails**: Check if all dependencies are installed

   ```bash
   pnpm install
   ```

2. **Environment variables missing**: Ensure all Firebase variables are set

   ```bash
   # Check if variables are loaded
   echo $NEXT_PUBLIC_FIREBASE_API_KEY
   ```

3. **Type errors**: Run type checking

   ```bash
   pnpm type-check
   ```

4. **Linting errors**: Fix code style issues
   ```bash
   pnpm lint
   ```

### Getting Help:

- Check the build logs for specific error messages
- Verify Firebase project configuration
- Ensure all environment variables are correctly set
- Test locally before deploying

## Next Steps

After successful staging deployment:

1. **Test all features** thoroughly
2. **Document any issues** found
3. **Prepare for production** deployment
4. **Set up monitoring** and analytics
5. **Configure CI/CD** pipeline for automated deployments
=======
# Staging Deployment Guide

This guide will help you deploy the Fitness App to staging environment.

## Prerequisites

1. **Node.js** (>=18.0.0)
2. **pnpm** (>=8.0.0)
3. **Firebase Project** configured for staging
4. **Environment Variables** set up for staging

## Environment Setup

### 1. Firebase Configuration

You'll need to set up Firebase environment variables for staging. Create a `.env.staging` file in the root directory:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_staging_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_staging_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_staging_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_staging_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_staging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_staging_app_id

# Firebase Admin SDK
FIREBASE_PRIVATE_KEY=your_staging_private_key
FIREBASE_CLIENT_EMAIL=your_staging_client_email

# Environment Variables
NODE_ENV=staging
NEXT_PUBLIC_ENVIRONMENT=staging
```

## Deployment Options

### Option 1: Local Build (Recommended for testing)

```bash
# Navigate to the project directory
cd docs/fitness-app

# Install dependencies
pnpm install

# Build for staging
pnpm build:staging

# Run type checks and linting
pnpm type-check
pnpm lint

# Start staging server locally
pnpm start:staging
```

### Option 2: Using Deployment Scripts

#### For Windows (PowerShell):

```powershell
# Navigate to the project directory
cd docs/fitness-app

# Run the PowerShell deployment script
.\deploy-staging.ps1
```

#### For Unix/Linux/macOS:

```bash
# Navigate to the project directory
cd docs/fitness-app

# Make the script executable
chmod +x deploy-staging.sh

# Run the deployment script
./deploy-staging.sh
```

### Option 3: Vercel Deployment

1. **Install Vercel CLI**:

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:

   ```bash
   vercel login
   ```

3. **Deploy to staging**:

   ```bash
   cd docs/fitness-app
   vercel --prod
   ```

4. **Set environment variables in Vercel dashboard**:
   - Go to your project settings
   - Add all Firebase environment variables
   - Set `NODE_ENV=staging`
   - Set `NEXT_PUBLIC_ENVIRONMENT=staging`

### Option 4: Netlify Deployment

1. **Install Netlify CLI**:

   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:

   ```bash
   netlify login
   ```

3. **Deploy to staging**:

   ```bash
   cd docs/fitness-app
   netlify deploy --prod
   ```

4. **Set environment variables in Netlify dashboard**:
   - Go to Site settings > Environment variables
   - Add all Firebase environment variables
   - Set `NODE_ENV=staging`
   - Set `NEXT_PUBLIC_ENVIRONMENT=staging`

## Verification

After deployment, verify the following:

1. **Application loads** without errors
2. **Firebase connection** is working
3. **Environment variables** are correctly set
4. **All features** function as expected
5. **Console logs** show staging environment

## Troubleshooting

### Common Issues:

1. **Build fails**: Check if all dependencies are installed

   ```bash
   pnpm install
   ```

2. **Environment variables missing**: Ensure all Firebase variables are set

   ```bash
   # Check if variables are loaded
   echo $NEXT_PUBLIC_FIREBASE_API_KEY
   ```

3. **Type errors**: Run type checking

   ```bash
   pnpm type-check
   ```

4. **Linting errors**: Fix code style issues
   ```bash
   pnpm lint
   ```

### Getting Help:

- Check the build logs for specific error messages
- Verify Firebase project configuration
- Ensure all environment variables are correctly set
- Test locally before deploying

## Next Steps

After successful staging deployment:

1. **Test all features** thoroughly
2. **Document any issues** found
3. **Prepare for production** deployment
4. **Set up monitoring** and analytics
5. **Configure CI/CD** pipeline for automated deployments
>>>>>>> 5c09f258344849581786557d82863e5b3589e033
