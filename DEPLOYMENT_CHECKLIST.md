# Railway Deployment Checklist

Use this checklist to ensure a smooth deployment to Railway.

## Pre-Deployment

- [ ] Code is committed and pushed to Git repository
- [ ] Railway account created and verified
- [ ] Repository connected to Railway

## Backend Deployment

- [ ] Backend service created in Railway
- [ ] Root directory set to `backend`
- [ ] Dockerfile detected by Railway
- [ ] Environment variables configured:
  - [ ] `PORT=${{PORT}}`
  - [ ] `HOST=0.0.0.0`
  - [ ] `DEBUG=false`
  - [ ] `LOG_LEVEL=INFO`
  - [ ] `CORS_ORIGINS=["*"]` (temporary, will update later)
  - [ ] `DATABASE_URL=sqlite:////app/data/restaurant.db`
- [ ] Volume mounted at `/app/data`
- [ ] Backend deployed successfully
- [ ] Backend URL copied (e.g., `https://xxx.railway.app`)
- [ ] Health check verified: `curl https://backend-url/health`
- [ ] API docs accessible: `https://backend-url/docs`

## Frontend Deployment

- [ ] Frontend service created in Railway
- [ ] Root directory set to `frontend`
- [ ] Dockerfile detected by Railway
- [ ] Environment variables configured:
  - [ ] `VITE_API_URL=https://your-backend-url.railway.app`
- [ ] Frontend deployed successfully
- [ ] Frontend URL copied (e.g., `https://xxx.railway.app`)
- [ ] Health check verified: `curl https://frontend-url/health`
- [ ] Frontend loads in browser

## Post-Deployment Configuration

- [ ] Backend CORS updated with actual frontend URL:
  - [ ] `CORS_ORIGINS=["https://your-frontend-url.railway.app"]`
- [ ] Backend redeployed with new CORS settings
- [ ] Frontend can connect to backend (check browser console)

## Testing

- [ ] Open frontend URL in browser
- [ ] Navigate to Waiter View
- [ ] Create a test order
- [ ] Navigate to Kitchen View
- [ ] Verify order appears in Kitchen View
- [ ] Test drag-and-drop between columns
- [ ] Test order completion
- [ ] Test order deletion
- [ ] Verify data persists after backend redeploy

## Monitoring

- [ ] Backend logs reviewed (no errors)
- [ ] Frontend logs reviewed (no errors)
- [ ] Health checks passing
- [ ] Response times acceptable

## Optional Enhancements

- [ ] Custom domain configured (if needed)
- [ ] DNS records updated
- [ ] Environment variables updated with custom domain
- [ ] PostgreSQL database added (if scaling beyond SQLite)
- [ ] Monitoring/alerts set up
- [ ] Backup strategy implemented

## Troubleshooting Reference

If issues occur, check:

1. **Backend won't start:**
   - Railway logs
   - Environment variables
   - Volume mount configuration

2. **Frontend can't connect:**
   - CORS settings
   - API URL in frontend
   - Backend health endpoint

3. **Database not persisting:**
   - Volume mount at `/app/data`
   - Database URL path

4. **Build failures:**
   - Dockerfile location
   - Dependencies in package files
   - Railway build logs

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed troubleshooting.

---

**Deployment Date:** _____________

**Backend URL:** _____________

**Frontend URL:** _____________

**Deployed By:** _____________
