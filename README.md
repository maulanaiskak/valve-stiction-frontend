# valve-stiction-frontend

Dashboard for the valve stiction fault-detection pipeline. React + TypeScript (Vite). Talks to [valve-stiction-backend](https://github.com/maulanaiskak/valve-stiction-backend)'s REST API and WebSocket for live data — no other backend integration.

Per sensor: a status badge (classic detector + RF model, shown side by side rather than picked between), an animated valve (smooth travel when healthy, stepped/jerky when sticking — the same flat-then-jump shape the detectors score for), a PV-vs-OP phase plot, and PV/OP-over-time charts.

## Run

```bash
npm install
npm run dev      # proxies /api and /ws to http://localhost:8080 -- see vite.config.ts
```

```bash
npm run build     # outputs dist/ -- what valve-stiction-backend serves in production
```

In production there's no dev proxy: `valve-stiction-backend` serves this build's static output and the API/WebSocket from the same origin.
