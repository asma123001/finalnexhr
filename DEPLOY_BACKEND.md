# NexHR Backend Deployment

Deploy this repo as a Node web service on Render.

## Render Settings

- Build command: `npm install && npm run build`
- Start command: `npm run start:deploy`
- Health check: `/api/health`

## Required Environment Variables

Set these in Render, using the same Supabase values from local `.env`:

```env
DATABASE_URL="<transaction-pooler-url-port-6543>?pgbouncer=true&connection_limit=1&sslmode=require"
DIRECT_URL="<session-pooler-url-port-5432>?sslmode=require"
JWT_SECRET="<long-random-secret>"
JWT_EXPIRES_IN="8h"
CORS_ORIGIN="https://asma123001.github.io"
```

After deployment, update the frontend API base before using GitHub Pages with the backend:

```html
<script>
  window.NEXHR_API_BASE = "https://YOUR-RENDER-SERVICE.onrender.com/api";
</script>
```
