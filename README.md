# Ledger — A Smart Market Watchlist

**One-liner:** Ledger protects your attention by surfacing only the market moves that truly matter, not just a stream of raw prices.

![Ledger dashboard](Screenshot.png
)

## The Problem / Why This Exists

Typical watchlists are rows of live prices that leave users to manually decide what is worth noticing. The UI constantly flickers, and most price changes are noise. Ledger flips this paradigm: it protects the investor's attention by automatically highlighting meaningful market events and summarizing them in a "Since You Last Checked" digest.

## What Counts as a "Meaningful Change"

The core differentiator is the **Delta Engine** (see `server/src/engine/deltaEngine.ts`). It evaluates each tick against a symbol-specific 30-period rolling window and generates anomaly signals:

| Signal | How It's Detected | Scoring (≈ points) |
|---|---|---|
| Volatility-Relative Price Move | `\|return\| / rollingStdDev ≥ 1.5×` | up to 30 |
| Volume Spike | `currentVolume / avgVolume ≥ 1.8×` | up to 25 |
| 24h Range Break | Price crosses the previous day's high/low with ≥ 1% move | 20 |
| User-Defined Price Alert | Explicit alert set by the user (always fires) | 35 |
| Feed Staleness | No tick for > 10s (or `isStale` flag) | 20 |

When two or more signals fire for a symbol, the engine adds a composition bonus (×1.25) and caps the total at 100. The resulting `attentionScore` drives the ranking in the digest and drives sector-story detection (`detectSectorStories`).

## How State Persists Across Sessions / Devices

- **Identity & Auth** – JWT-based authentication (`server/src/index.ts`).
- **Persistence Layer** – SQLite managed through Prisma (`server/prisma/schema.prisma`). Watchlists, price alerts, and the `LastSeenSnapshot` (used for the unread digest) are stored here.
- **Cross-Device Consistency** – Because the snapshot lives on the server, any device that authenticates with the same token sees the same unread count and digest, eliminating reliance on browser storage.

## Handling Stale / Conflicting Data

The market simulator flags a tick as stale when:

```ts
const isStaleFeed = Boolean(tick.isStale) || staleAgeSec > 10;
```

Stale ticks generate an explicit `STALENESS` signal (score 20) and are shown in the UI with a visible "STALE (Ns)" badge. This makes data quality transparent rather than silently displaying outdated prices.

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS (custom ledger palette), Recharts, Lucide-React, Framer-Motion, cmdk command palette | Light-blue / emerald theme, responsive UI |
| Backend | Node 20, Express, TypeScript, Socket.IO, Prisma (SQLite) | Real-time push, delta engine, JWT auth |
| Testing | Vitest (unit tests for Delta Engine) | 100% coverage of statistical rules |
| Containerisation | Docker (multi-stage Dockerfile), docker-compose.yml | One-command local environment |
| CI / Lint | ESLint, Prettier (via Vite) | Consistent code style |

## Project Structure

```
ledger-smart-watchlist/
├─ .gitignore
├─ Dockerfile                     # Multi-stage build for server + client
├─ docker-compose.yml             # Spins up both services
├─ README.md
├─ client/                        # Front-end SPA
│  ├─ dist/                       # Production build artifacts
│  ├─ src/
│  │  ├─ App.tsx                  # Main layout, navigation tabs
│  │  ├─ components/              # Header, LandingPage, PriceAlertsManager, etc.
│  │  ├─ services/                # API helpers (fetch symbols, alerts)
│  │  ├─ utils/                   # rankSymbolSearch utility mirroring server ranking
│  │  └─ types.ts                 # Shared TypeScript types
│  ├─ index.html
│  ├─ package.json
│  ├─ tailwind.config.js          # Custom "ledger" color palette
│  └─ vite.config.ts
└─ server/                        # Back-end API & engine
   ├─ prisma/
   │  ├─ dev.db                   # SQLite file (generated)
   │  └─ schema.prisma
   ├─ src/
   │  ├─ engine/
   │  │  ├─ deltaEngine.ts        # Core attention-scoring logic
   │  │  ├─ marketSimulator.ts    # Simulated tick feed (includes staleness)
   │  │  ├─ symbolUniverse.ts     # ~180 static NSE symbols
   │  │  └─ types.ts              # Shared interfaces
   │  ├─ index.ts                 # Express server, routes, Socket.IO
   │  └─ db/
   │     └─ seed.ts               # Seed script for demo data
   ├─ package.json
   └─ tsconfig.json
```


## Running It Locally

### Option 1 – Docker (single command)

```bash
docker-compose up --build
```

- The API listens on `http://localhost:4000` (Socket.IO push).
- The frontend is served on `http://localhost:3000`.

### Option 2 – Manual Node.js Development

```bash
# ── Backend ─────────────────────────────────────
cd server
npm install
npx prisma db push          # Create SQLite schema
npm run db:seed             # (optional) seed demo data
npm run test                # Run Vitest unit tests
npm run dev                 # Starts Express + Socket.IO on port 4000

# ── Frontend ─────────────────────────────────────
cd ../client
npm install
npm run dev                 # Starts Vite dev server at http://localhost:3000
```

All commands are taken directly from the existing `package.json` scripts.

## Where Complexity Was Kept Simple (and the Upgrade Path)

| Simplified Aspect | Reason for Simplicity | Production-grade Upgrade |
|---|---|---|
| Data Source | In-memory static `symbolUniverse.ts` and a deterministic `marketSimulator.ts` make the demo self-contained. | Connect to a real market feed (e.g., WebSocket from a data vendor) and replace the simulator with a streaming ingest service. |
| Persistence | SQLite via Prisma is lightweight and requires no external DB server. | Switch the Prisma datasource to PostgreSQL/MySQL by changing the connection URL in `schema.prisma`. |
| Authentication | JWT tokens for the demo. | Integrate a full OAuth2 provider (Google, Auth0) and refresh-token handling. |
| Scaling of Real-time Push | Single Socket.IO server broadcasts to all clients. | Partition Socket.IO rooms per symbol, shard across multiple Node instances behind a Redis adapter. |
| Sector-Story Detection | Simple in-process aggregation of attention scores. | Run a background worker (e.g., BullMQ) to pre-compute sector stories and cache them in Redis. |

## How This Scales

- **Decoupled Ingestion** – Market data ingestion can be off-loaded to separate workers that publish ticks to a Redis Pub/Sub channel; the API server only consumes the stream.
- **Sharded WebSocket Fan-out** – Socket.IO can use the Redis adapter to broadcast only relevant symbol rooms, reducing bandwidth per client.
- **Digest Pre-computation** – Attention scores are calculated on each tick and stored in a fast cache (Redis); UI requests fetch the pre-computed digest rather than recomputing on the fly.
- **Horizontal Backend Scaling** – The stateless Express server can be replicated behind a load balancer; all instances share the same database and Redis cache.

## License & Credits

- **License:** MIT (see `LICENSE` file).
- **Core contributors:** Neha Mahto (project lead).
- **Thanks:** Vite, Tailwind CSS, Prisma, Socket.IO, Vitest, and the open-source community for the libraries that make this possible.
