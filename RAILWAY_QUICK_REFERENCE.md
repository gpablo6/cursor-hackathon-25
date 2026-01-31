# Railway Quick Reference Card

Quick reference for deploying and managing the Pupuseria Management System on Railway.

## 🚀 Initial Deployment

### Backend Service

```
Service Name: pupuseria-backend
Root Directory: backend
Builder: Dockerfile (auto-detected)
```

**Environment Variables:**
```env
PORT=${{PORT}}
HOST=0.0.0.0
DEBUG=false
LOG_LEVEL=INFO
CORS_ORIGINS=["*"]
DATABASE_URL=sqlite:////app/data/restaurant.db
```

**Volume:**
```
Mount Path: /app/data
```

### Frontend Service

```
Service Name: pupuseria-frontend
Root Directory: frontend
Builder: Dockerfile (auto-detected)
```

**Environment Variables:**
```env
VITE_API_URL=https://your-backend-url.railway.app
```

### Final Step

Update backend CORS after frontend deployment:
```env
CORS_ORIGINS=["https://your-frontend-url.railway.app"]
```

## 📋 Deployment Checklist

- [ ] Backend service created
- [ ] Backend environment variables set
- [ ] Backend volume mounted at `/app/data`
- [ ] Backend deployed successfully
- [ ] Backend URL copied
- [ ] Frontend service created
- [ ] Frontend `VITE_API_URL` set to backend URL
- [ ] Frontend deployed successfully
- [ ] Frontend URL copied
- [ ] Backend CORS updated with frontend URL
- [ ] Both health checks passing
- [ ] Application tested in browser

## 🔍 Health Checks

```bash
# Backend
curl https://your-backend.railway.app/health
# Expected: {"status":"healthy"}

# Frontend
curl https://your-frontend.railway.app/health
# Expected: healthy

# API Docs
open https://your-backend.railway.app/docs
```

## 🛠️ Common Commands

### Railway CLI

```bash
# Login
railway login

# Link project
railway link

# Deploy
railway up

# View logs
railway logs

# Set variable
railway variables set KEY=value

# Get domain
railway domain

# Open in browser
railway open
```

### Environment Variables

```bash
# Set multiple variables
railway variables set DEBUG=false
railway variables set LOG_LEVEL=INFO
railway variables set CORS_ORIGINS='["https://frontend.railway.app"]'

# View all variables
railway variables

# Delete variable
railway variables delete KEY
```

## 🐛 Troubleshooting

### Backend Won't Start

```bash
# Check logs
railway logs

# Verify variables
railway variables

# Common issues:
# - PORT not set to ${{PORT}}
# - CORS_ORIGINS invalid JSON format
# - Missing DATABASE_URL
```

### Frontend Can't Connect

```bash
# Check CORS in backend
railway variables | grep CORS

# Verify API URL in frontend
railway variables | grep VITE_API_URL

# Test backend
curl https://backend-url/health

# Check browser console for errors
```

### Database Not Persisting

```bash
# Check volume is mounted
# Go to: Service → Volumes → Verify /app/data

# Verify DATABASE_URL
railway variables | grep DATABASE_URL
# Should be: sqlite:////app/data/restaurant.db
```

## 📊 Monitoring

### View Metrics

```
Dashboard → Service → Metrics
- CPU usage
- Memory usage
- Network traffic
- Request count
```

### View Logs

```
Dashboard → Service → Deployments → View Logs
```

### Set Up Alerts

```
Dashboard → Project Settings → Notifications
- Deployment failures
- Service crashes
- Resource limits
```

## 🔄 Updates & Rollbacks

### Automatic Deployment

```bash
# Push to connected branch
git push origin main

# Railway auto-deploys
```

### Manual Redeploy

```
Dashboard → Service → Deployments → Redeploy
```

### Rollback

```
Dashboard → Service → Deployments
→ Find previous deployment
→ Click "Redeploy"
```

## 💾 Database Management

### Backup Database

**From Local:**
```bash
# If you have Railway CLI
railway run ./scripts/backup-db.sh

# Or download via Railway dashboard
# Service → Data → Download
```

**Manual:**
```bash
# SSH into service (if enabled)
railway shell
cp /app/data/restaurant.db /tmp/backup.db
```

### Restore Database

**Upload to Railway:**
1. Stop backend service
2. Upload backup to volume
3. Restart backend service

**Or migrate to PostgreSQL:**
```bash
# Add PostgreSQL plugin
Dashboard → New → Database → PostgreSQL

# Update backend DATABASE_URL
railway variables set DATABASE_URL=${{DATABASE_URL}}
```

## 🔐 Security Best Practices

### Environment Variables

```env
# ✅ Good
DEBUG=false
CORS_ORIGINS=["https://specific-domain.com"]

# ❌ Bad
DEBUG=true
CORS_ORIGINS=["*"]
```

### HTTPS

- Railway provides automatic HTTPS
- Always use `https://` in production URLs
- Update all environment variables with HTTPS URLs

### Secrets

- Never commit secrets to Git
- Use Railway environment variables
- Rotate secrets regularly

## 💰 Cost Optimization

### Free Tier Limits

- $5 free credit per month
- Shared CPU and memory
- 500 MB disk per service

### Optimization Tips

1. **Use SQLite** (included in free tier)
2. **Optimize Docker images** (smaller = faster deploys)
3. **Enable caching** (faster builds)
4. **Monitor usage** (avoid overages)

### Upgrade When Needed

- High traffic → Upgrade plan
- Need PostgreSQL → Add database plugin
- Need more storage → Add volume size

## 🔗 Useful Links

### Railway Dashboard
```
https://railway.app/dashboard
```

### Your Services
```
Backend:  https://your-backend.railway.app
Frontend: https://your-frontend.railway.app
API Docs: https://your-backend.railway.app/docs
```

### Documentation
- [Railway Docs](https://docs.railway.app/)
- [Railway CLI](https://docs.railway.app/develop/cli)
- [Railway Pricing](https://railway.app/pricing)

## 📞 Support

### Railway Support
- [Discord](https://discord.gg/railway)
- [GitHub Discussions](https://github.com/railwayapp/railway/discussions)
- [Status Page](https://status.railway.app/)

### Project Support
- [Deployment Guide](./DEPLOYMENT.md)
- [Troubleshooting](./DEPLOYMENT.md#troubleshooting)
- [GitHub Issues](https://github.com/your-repo/issues)

## 📝 Notes

### Service URLs

```
Backend:  _______________________________
Frontend: _______________________________
```

### Deployment Date

```
Initial: _______________________________
Last Update: ___________________________
```

### Important Variables

```
CORS_ORIGINS: __________________________
VITE_API_URL: __________________________
DATABASE_URL: __________________________
```

---

**Quick Start:** [QUICKSTART_DOCKER.md](./QUICKSTART_DOCKER.md)
**Full Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)
**All Docs:** [DOCKER_INDEX.md](./DOCKER_INDEX.md)

**Print this page for quick reference during deployment!**
