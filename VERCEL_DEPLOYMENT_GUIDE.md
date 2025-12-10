# Vercel Deployment Configuration for Futelatosomba Frontend

## Project Settings

### General Settings
- **Framework Preset**: Create React App
- **Root Directory**: `frontend/futelatosomba-react-app`
- **Node Version**: 18.x or later

### Build & Development Settings
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### Environment Variables

Add the following environment variable:

| Key | Value | Environment |
|-----|-------|-------------|
| `REACT_APP_API_URL` | `https://futelatosomba-ldho.onrender.com/api` | Production, Preview, Development |

## Step-by-Step Instructions

### If Root Directory Error Persists:

1. **Option A: Import as New Project**
   - Go to Vercel Dashboard
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - During import, set Root Directory to `frontend/futelatosomba-react-app`
   - Add the environment variable before deploying

2. **Option B: Fix Existing Project**
   - Go to your project Settings
   - Navigate to "General" tab
   - Scroll to "Root Directory"
   - Make sure it's exactly: `frontend/futelatosomba-react-app` (no extra spaces)
   - Save changes
   - Trigger a new deployment from Deployments tab

### After Successful Deployment:

1. Get the Vercel production URL (e.g., `https://your-app.vercel.app`)
2. Update backend CORS settings in Render to allow this URL
3. Update `FRONTEND_URL` and `CLIENT_URL` in backend/start.sh
4. Test the full application flow

## Current Backend URL
`https://futelatosomba-ldho.onrender.com/api`

## Troubleshooting

If build fails:
- Check build logs for specific errors
- Verify all dependencies are in package.json
- Ensure React version compatibility
- Check that REACT_APP_API_URL is set correctly
