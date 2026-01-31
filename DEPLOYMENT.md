# Deployment Guide

This guide provides step-by-step instructions for deploying the Pupuseria Management System to Railway.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Deploy to Railway](#quick-deploy-to-railway)
- [Manual Railway Setup](#manual-railway-setup)
- [Environment Configuration](#environment-configuration)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app/)
2. **Git Repository**: Your code must be in a Git repository (GitHub, GitLab, Bitbucket)
3. **Railway CLI** (optional): `npm i -g @railway/cli`

## Quick Deploy to Railway

### Option 1: Deploy via Railway Dashboard (Recommended)

#### Step 1: Deploy Backend

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Click **"Add Service"** → **"GitHub Repo"**
5. Configure:
   - **Service Name**: `pupuseria-backend`
   - **Root Directory**: `backend`
   - Railway will auto-detect the Dockerfile

6. Add Environment Variables (click on service → Variables):
   ```
   APP_NAME=Pupas API
   DEBUG=false
   PORT=${{PORT}}
   HOST=0.0.0.0
   LOG_LEVEL=INFO
   CORS_ORIGINS=["*"]
   DATABASE_URL=sqlite:////app/data/restaurant.db
   ```

7. Add Volume for Database Persistence:
   - Go to service → **Volumes** → **New Volume**
   - **Mount Path**: `/app/data`
   - Click **Add**

8. Click **Deploy** and wait for build to complete

9. **Copy the Backend URL** (e.g., `https://pupuseria-backend-production.up.railway.app`)

#### Step 2: Deploy Frontend

1. In the same Railway project, click **"New Service"** → **"GitHub Repo"**
2. Select the same repository
3. Configure:
   - **Service Name**: `pupuseria-frontend`
   - **Root Directory**: `frontend`

4. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```
   **Important**: Replace with your actual backend URL from Step 1.9

5. Click **Deploy**

6. **Copy the Frontend URL** (e.g., `https://pupuseria-frontend-production.up.railway.app`)

#### Step 3: Update CORS

1. Go back to **Backend Service** → **Variables**
2. Update `CORS_ORIGINS`:
   ```
   CORS_ORIGINS=["https://your-frontend-url.railway.app"]
   ```
   Replace with your actual frontend URL from Step 2.6

3. Backend will automatically redeploy with new CORS settings

4. **Done!** Visit your frontend URL to use the app

### Option 2: Deploy via Railway CLI

```bash
# Login to Railway
railway login

# Create new project
railway init

# Deploy backend
cd backend
railway up
railway variables set APP_NAME="Pupas API"
railway variables set DEBUG=false
railway variables set LOG_LEVEL=INFO
railway variables set CORS_ORIGINS='["*"]'
railway variables set DATABASE_URL="sqlite:////app/data/restaurant.db"

# Get backend URL
railway domain

# Deploy frontend
cd ../frontend
railway up
railway variables set VITE_API_URL="https://your-backend-url.railway.app"

# Get frontend URL
railway domain
```

## Manual Railway Setup

### Backend Configuration

**Required Environment Variables:**

| Variable | Value | Description |
|----------|-------|-------------|
| `PORT` | `${{PORT}}` | Railway auto-assigns this |
| `HOST` | `0.0.0.0` | Listen on all interfaces |
| `CORS_ORIGINS` | `["https://your-frontend.railway.app"]` | Frontend URL(s) |
| `DATABASE_URL` | `sqlite:////app/data/restaurant.db` | Database path |

**Optional Environment Variables:**

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_NAME` | `Pupas API` | Application name |
| `DEBUG` | `false` | Debug mode |
| `LOG_LEVEL` | `INFO` | Logging level (DEBUG, INFO, WARNING, ERROR) |
| `CORS_ALLOW_CREDENTIALS` | `true` | Allow credentials in CORS |

**Volume Configuration:**

- **Mount Path**: `/app/data`
- **Purpose**: Persist SQLite database across deployments

### Frontend Configuration

**Required Environment Variables:**

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_URL` | `https://your-backend.railway.app` | Backend API URL |

**Build Arguments:**

The frontend Dockerfile accepts `VITE_API_URL` as a build argument. Railway will automatically use the environment variable during build.

## Environment Configuration

### Development vs Production

#### Development (.env.local)

**Backend:**
```env
APP_NAME=Pupas API
DEBUG=true
HOST=0.0.0.0
PORT=8000
LOG_LEVEL=DEBUG
CORS_ORIGINS=["http://localhost:5173","http://localhost:3000"]
DATABASE_URL=sqlite:///./restaurant.db
```

**Frontend:**
```env
VITE_API_URL=http://localhost:8000
```

#### Production (Railway)

**Backend:**
```env
APP_NAME=Pupas API
DEBUG=false
HOST=0.0.0.0
PORT=${{PORT}}
LOG_LEVEL=INFO
CORS_ORIGINS=["https://your-frontend.railway.app"]
DATABASE_URL=sqlite:////app/data/restaurant.db
```

**Frontend:**
```env
VITE_API_URL=https://your-backend.railway.app
```

### Security Considerations

1. **CORS**: Only allow your frontend domain in production
   ```env
   CORS_ORIGINS=["https://your-frontend.railway.app"]
   ```

2. **Debug Mode**: Always set to `false` in production
   ```env
   DEBUG=false
   ```

3. **Database**: Use volume mount to persist data
   - Mount path: `/app/data`
   - Database URL: `sqlite:////app/data/restaurant.db`

4. **HTTPS**: Railway provides automatic HTTPS for all services

## Post-Deployment

### Verify Deployment

1. **Backend Health Check:**
   ```bash
   curl https://your-backend.railway.app/health
   ```
   Expected response: `{"status":"healthy"}`

2. **Frontend Health Check:**
   ```bash
   curl https://your-frontend.railway.app/health
   ```
   Expected response: `healthy`

3. **API Documentation:**
   Visit: `https://your-backend.railway.app/docs`

### Test the Application

1. Open your frontend URL
2. Navigate to Waiter View
3. Create a test order
4. Navigate to Kitchen View
5. Verify order appears
6. Test drag-and-drop functionality

### Monitor Logs

**Railway Dashboard:**
- Go to your service → **Deployments** → **View Logs**
- Monitor for errors or warnings

**CLI:**
```bash
railway logs
```

### Set Up Custom Domain (Optional)

1. Go to service → **Settings** → **Domains**
2. Click **Add Domain**
3. Enter your custom domain
4. Update DNS records as instructed
5. Update environment variables with new domain

## Troubleshooting

### Backend Issues

#### Build Fails

**Problem:** Docker build fails

**Solutions:**
- Check `pyproject.toml` exists and is valid
- Verify `uv.lock` is committed to repository
- Check Railway build logs for specific errors
- Ensure Dockerfile is in `backend/` directory

#### Service Won't Start

**Problem:** Backend service crashes on startup

**Solutions:**
- Check logs: `railway logs`
- Verify `PORT` environment variable is set to `${{PORT}}`
- Ensure `HOST=0.0.0.0`
- Check database path is correct

#### Database Not Persisting

**Problem:** Data is lost after redeployment

**Solutions:**
- Add volume mount at `/app/data`
- Verify `DATABASE_URL=sqlite:////app/data/restaurant.db`
- Check volume is attached in Railway dashboard

### Frontend Issues

#### Build Fails

**Problem:** Frontend build fails

**Solutions:**
- Verify `VITE_API_URL` is set
- Check `package.json` exists
- Ensure all dependencies are listed
- Check Railway build logs

#### Can't Connect to Backend

**Problem:** Frontend shows connection errors

**Solutions:**
1. Check `VITE_API_URL` is correct (with `https://`)
2. Verify backend is running: `curl https://backend-url/health`
3. Check CORS settings in backend
4. Open browser console for detailed errors
5. Verify backend URL in Network tab

#### CORS Errors

**Problem:** Browser shows CORS errors

**Solutions:**
1. Update backend `CORS_ORIGINS` to include frontend URL
2. Ensure URL includes protocol (`https://`)
3. Check for trailing slashes
4. Redeploy backend after CORS changes

### General Issues

#### Environment Variables Not Working

**Problem:** App doesn't use new environment variables

**Solutions:**
- Railway automatically redeploys when variables change
- Wait for redeployment to complete
- Check logs to verify new values are used
- For `VITE_*` variables, trigger a new build

#### Slow Performance

**Problem:** App is slow or unresponsive

**Solutions:**
- Check Railway metrics for resource usage
- Review logs for errors or warnings
- Consider upgrading Railway plan
- Optimize database queries
- Enable caching

#### Service Keeps Restarting

**Problem:** Service restarts repeatedly

**Solutions:**
- Check health check endpoint is working
- Review logs for crash reasons
- Verify environment variables are correct
- Check for port conflicts
- Increase health check timeout

## Updating Your Deployment

### Automatic Updates

Railway automatically redeploys when you push to your connected Git branch:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

### Manual Redeploy

**Dashboard:**
- Go to service → **Deployments** → **Redeploy**

**CLI:**
```bash
railway up
```

### Rollback

**Dashboard:**
- Go to service → **Deployments**
- Find previous successful deployment
- Click **Redeploy**

## Database Migration

### SQLite to PostgreSQL (Optional)

If you need to scale beyond SQLite:

1. **Add PostgreSQL Plugin** in Railway
2. **Update Backend Environment:**
   ```env
   DATABASE_URL=${{DATABASE_URL}}
   ```
   Railway automatically provides PostgreSQL connection string

3. **Update Dependencies** in `pyproject.toml`:
   ```toml
   dependencies = [
       "fastapi>=0.115.0",
       "uvicorn[standard]>=0.32.0",
       "pydantic>=2.9.0",
       "pydantic-settings>=2.6.0",
       "sqlalchemy>=2.0.0",
       "psycopg2-binary>=2.9.0",  # Add this
   ]
   ```

4. **Redeploy** backend

## Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Railway CLI Reference](https://docs.railway.app/develop/cli)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Vite Production Build](https://vitejs.dev/guide/build.html)

## Support

For deployment issues:
1. Check Railway status: [status.railway.app](https://status.railway.app/)
2. Review Railway logs
3. Open an issue on GitHub
4. Contact Railway support

---

**Last Updated:** January 2026
