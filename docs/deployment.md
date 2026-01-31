# Deployment and Docker

Owner: TBD
Last validated: 2026-01-31
Scope: Docker, Railway deployment, environment variables, and verification.

## Quick start (Docker)

Use Docker for production-like local testing.

```bash
# Build and run
docker-compose up -d --build

# Logs
docker-compose logs -f

# Stop
docker-compose down
```

Access:
- Backend API: http://localhost:8000
- Backend docs: http://localhost:8000/docs
- Backend health: http://localhost:8000/health
- Frontend: http://localhost
- Frontend health: http://localhost/health

## Railway deployment (dashboard)

### Backend service

1. New project -> Deploy from GitHub repo.
2. Add service from repo.
3. Set root directory to `backend`.
4. Add variables:
   - `PORT=${{PORT}}`
   - `HOST=0.0.0.0`
   - `DEBUG=false`
   - `LOG_LEVEL=INFO`
   - `CORS_ORIGINS=["*"]` (temporary)
   - `DATABASE_URL=sqlite:////app/data/restaurant.db`
5. Add volume mount at `/app/data`.
6. Deploy and copy the backend URL.

### Frontend service

1. Add another service from the same repo.
2. Set root directory to `frontend`.
3. Add variable:
   - `VITE_API_URL=https://your-backend-url.railway.app`
4. Deploy and copy the frontend URL.

### Update CORS

Update the backend `CORS_ORIGINS` to your frontend URL:

```env
CORS_ORIGINS=["https://your-frontend-url.railway.app"]
```

Railway will redeploy automatically.

## Environment variables

### Backend required (Railway)

| Variable | Value | Notes |
| --- | --- | --- |
| `PORT` | `${{PORT}}` | Railway auto-assigns |
| `HOST` | `0.0.0.0` | Listen on all interfaces |
| `CORS_ORIGINS` | `[...]` | JSON array of allowed origins |
| `DATABASE_URL` | `sqlite:////app/data/restaurant.db` | Uses Railway volume |

### Backend optional

| Variable | Default | Notes |
| --- | --- | --- |
| `APP_NAME` | `Pupas API` | App name |
| `DEBUG` | `false` | Debug mode |
| `LOG_LEVEL` | `INFO` | Logging level |
| `CORS_ALLOW_CREDENTIALS` | `true` | Allow credentials |

### Frontend (build-time)

| Variable | Value | Notes |
| --- | --- | --- |
| `VITE_API_URL` | Backend URL | Required for build |

## Verification checklist (short)

- Backend health: `curl https://your-backend-url/health`
- Frontend health: `curl https://your-frontend-url/health`
- API docs load: `https://your-backend-url/docs`
- App loads and can create a test order

## Troubleshooting (common)

- Backend won't start: verify `PORT`, `HOST`, and volume at `/app/data`.
- Frontend can't connect: confirm `VITE_API_URL` and backend CORS origins.
- DB not persisting: ensure Railway volume is attached at `/app/data`.

## Optional: SQLite to PostgreSQL

1. Add Railway Postgres plugin.
2. Set `DATABASE_URL=${{DATABASE_URL}}`.
3. Add `psycopg2-binary` to backend dependencies.
4. Redeploy backend.
