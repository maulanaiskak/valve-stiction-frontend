# valve-stiction-frontend

Dashboard for the valve stiction fault-detection pipeline. React + TypeScript (Vite). Talks to [valve-stiction-backend](https://github.com/maulanaiskak/valve-stiction-backend)'s REST API and WebSocket for live data — no other backend integration.

Per sensor: a status badge (classic detector + RF model, shown side by side rather than picked between), an animated valve (smooth travel when healthy, stepped/jerky when sticking — the same flat-then-jump shape the detectors score for), a PV-vs-OP phase plot, and PV/OP-over-time charts.

## Run

Dev (Vite proxies `/api` and `/ws` to `http://localhost:8080` — see `vite.config.ts`):

```bash
npm install
npm run dev
```

Production: this repo builds and deploys as its own image, independent of `valve-stiction-backend` — the two never build against each other. `Dockerfile` is a multi-stage build (`npm run build`, then `nginx:alpine` serving the static output); nginx reverse-proxies `/api` and `/ws` to `BACKEND_HOST` so the browser still sees one origin (no CORS to configure) while the two stay separately built/deployed:

```bash
docker build -t valve-stiction-frontend .
docker run -p 8081:80 -e BACKEND_HOST=backend:8080 valve-stiction-frontend
```

| Env var | Default |
|---|---|
| `BACKEND_HOST` | `backend:8080` |
