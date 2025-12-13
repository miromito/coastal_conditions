# Deployment Guide

This project can be deployed to several free hosting platforms. Choose the one that works best for you!

## 🚀 Firebase Hosting (Recommended)

Firebase Hosting is free, fast, and easy to use.

### Prerequisites
- Node.js installed
- A Google account

### Setup Steps

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase in your project**:
   ```bash
   firebase init hosting
   ```
   
   When prompted:
   - Select "Use an existing project" or "Create a new project"
   - Set public directory to: `build`
   - Configure as single-page app: `Yes`
   - Set up automatic builds: `No` (we'll build manually)
   - Overwrite index.html: `No`

4. **Build and Deploy**:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

5. **Your app will be live at**: `https://your-project-id.web.app`

### Quick Deploy Script
```bash
npm run build && firebase deploy --only hosting
```

---

## 🌐 Vercel (Alternative - Very Easy)

Vercel is excellent for React apps and has a great free tier.

### Setup Steps

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```
   
   Follow the prompts. Vercel will automatically detect it's a React app.

3. **For production deployment**:
   ```bash
   vercel --prod
   ```

**Or use the web interface**: Just connect your GitHub repo at [vercel.com](https://vercel.com)

---

## 📦 Netlify (Alternative)

Netlify also offers great free hosting for static sites.

### Setup Steps

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**:
   ```bash
   netlify login
   ```

3. **Deploy**:
   ```bash
   npm run build
   netlify deploy --prod --dir=build
   ```

**Or use the web interface**: Drag and drop your `build` folder at [netlify.com](https://netlify.com)

---

## 🔄 Continuous Deployment

### Firebase
- Connect your GitHub repo in Firebase Console
- Enable automatic deployments on push to main branch

### Vercel/Netlify
- Connect your GitHub repo
- Automatic deployments on every push

---

## 📝 Notes

- All platforms offer free SSL certificates
- Custom domains are supported on all platforms
- Firebase: 10 GB storage, 360 MB/day bandwidth (free tier)
- Vercel: Unlimited bandwidth, 100 GB (free tier)
- Netlify: 100 GB bandwidth, 300 build minutes/month (free tier)

---

## 🐳 Docker Alternative

If you prefer to keep using Docker, you can deploy the container to:
- **Railway** (free tier available)
- **Render** (free tier available)
- **Fly.io** (free tier available)

Just push your Docker image and point them to your `docker-compose.yml`.


