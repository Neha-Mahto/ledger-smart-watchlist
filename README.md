# Ledger — Smart Market Watchlist & Delta Digest

> **Product Thesis**: A watchlist's job is to protect the user's attention, not just display data. Most of the value is in deciding what is worth noticing, not in rendering raw numbers.

Ledger is a high-density, modern financial terminal web application designed to eliminate market noise. Instead of forcing users to scan dozens of flickering price rows, Ledger's **Delta Engine** statistically isolates meaningful market anomalies (volatility-relative price moves, volume surges, range breaks, custom price alerts, and feed staleness) and synthesizes them into an actionable **"Since You Last Checked"** digest and correlated sector stories.

---

## 🏆 Presentation Pitch (For Hackathon Judges)

> *"Most financial watchlists bombard traders with dozens of flickering numbers, forcing them to scan for signal amidst overwhelming noise. Ledger flips this paradigm: it is an attention-protecting market watchlist powered by a statistical delta engine. By scoring market events relative to a symbol's own historical realized volatility and volume averages, Ledger aggregates anomalies into a ranked 'Since You Last Checked' digest and correlated sector stories. Backed by a Node.js + Express + Prisma SQLite engine and Socket.IO real-time push, Ledger protects investor attention by surfacing only what genuinely demands notice."*

---

## ⚡ Tech Stack

- **Frontend**: React + TypeScript + Vite, Tailwind CSS (Custom Dark Obsidian Ledger Design Tokens with Glassmorphism), Lucide React, Framer Motion, Recharts (Sparklines & Intraday charts), `cmdk` Command Palette (`⌘K` / `Ctrl+K`).
- **Backend**: Node.js + Express + TypeScript, Socket.IO for real-time WebSocket tick fan-out.
- **Persistence**: SQLite via Prisma ORM (`prisma/schema.prisma`). Upgrade path to PostgreSQL is a single connection string change in Prisma.
- **Testing**: Vitest unit test suite covering 100% of Delta Engine statistical rules.
- **Infrastructure**: Multi-stage `Dockerfile` and `docker-compose.yml` for local one-command startup.

---

## 📊 Delta & Attention Engine (Core IP)

Traditional watchlists rely on naive fixed percentage thresholds (e.g. "flag if change > 2%"). A 2% move in a penny stock is noise, whereas a 2% move in a mega-cap stock is historic. Ledger's **Delta Engine** evaluates ticks against symbol-specific 30-period rolling windows:

1. **Volatility-Relative Price Move ($Z_{vol}$)**:
   Calculates realized volatility $\sigma = \sqrt{\frac{1}{N-1}\sum (r_i - \bar{r})^2}$. Measures price moves in terms of standard deviation Z-scores:
   $$Z_{vol} = \frac{|r_{current}|}{\sigma_{realized}}$$
2. **Volume Surge Ratio ($R_{vol}$)**:
   Measures volume against trailing 30-period Simple Moving Average:
   $$R_{vol} = \frac{V_{current}}{\text{SMA}_{30}(V)}$$
3. **24h Range Break**:
   Triggers when current tick breaches previous day high or low.
4. **User Price Alerts**:
   Direct price threshold triggers that always fire regardless of statistical distributions.
5. **Feed Staleness Detection**:
   Explicitly detects feed timeouts (>10s) and surfaces starvation as a signal rather than silently displaying stale numbers as live.
6. **Combined 0–100 Attention Score**:
   Multi-signal composition weighting that ranks multi-anomalous events higher than isolated single signals.

---

## 📱 Features

### Tier 1 — MVP Core
- **Token Identity & Watchlist CRUD**: JWT auth identity with server-persisted watchlists in SQLite.
- **Real-Time Price & Sparklines**: Tabular ledger alignment, day high/low progress bars, and Recharts mini sparklines.
- **"Since You Last Checked" Digest**: Ranked summary of market anomalies computed against a server-side `LastSeenSnapshot`.
- **Feed Starvation Demo**: Simulated feed starvation timer on `ONGC` to demonstrate live staleness detection.

### Tier 2 — High-Impact Additions
- **Real-time Push (Socket.IO)**: Low-latency WebSocket push for price ticks and attention scores.
- **Correlated Sector Stories**: Detects sector-wide co-movements (e.g., *"IT sector: TCS, INFY, WIPRO all up +2.1% on volume"*) and groups N rows into 1 story card.
- **Market Pulse Panel**: Compares user watchlist average performance against a synthetic benchmark index (Nifty 50).
- **Explainable Confidence in UI**: Detail inspector displays exact z-scores, volume surge ratios, and historical event timelines.
- **Command Palette (`⌘K` / `Ctrl+K`)**: Power-user overlay for search, jumping to detail views, and adding symbols.

---

## 🚀 Running Locally

### Option 1: Docker Compose (One Command)
```bash
docker-compose up --build
```
Open [http://localhost:4000](http://localhost:4000) in your browser.

### Option 2: Local Node.js Development
1. **Server Setup**:
   ```bash
   cd server
   npm install
   npx prisma db push
   npm run db:seed
   npm run test      # Run Vitest unit tests
   npm run dev       # Starts Express + Socket.IO server on port 4000
   ```
2. **Client Setup**:
   ```bash
   cd client
   npm install
   npm run dev       # Starts Vite dev server on http://localhost:3000
   ```

---

## 🧪 Running Unit Tests

To run the Vitest test suite for the Delta Engine:
```bash
cd server
npm run test
```

Expected output:
```
 ✓ src/engine/__tests__/deltaEngine.test.ts (6 tests)
 Test Files  1 passed (1)
      Tests  6 passed (6)
```

---

## 🔍 Engineering & Architecture Q&A

### How state persists across devices?
User identity is token-authenticated server-side. Watchlists, price alerts, and `LastSeenSnapshot` records are stored in SQLite via Prisma. When a user logs in from a second device or incognito window, the backend computes unread digests relative to the server-side snapshot rather than browser `localStorage`.

### How stale/conflicting data is handled?
Rather than silently showing stale prices as live, the `MarketSimulator` and `DeltaEngine` measure tick elapsed time. Feeds exceeding 10s without ticks are flagged `isStale: true` with a visible age counter (`STALE (14s)`), and the staleness itself is passed to the attention engine as an anomaly signal.

### How this scales to millions of users & symbols?
1. **Ingestion Decoupling**: Separate market feed ingestion workers from client Express API servers using Redis Pub/Sub channels.
2. **Symbol-Keyed Socket Fan-Out**: Shard WebSocket servers by symbol rooms so clients only receive push updates for symbols present on their active watchlist.
3. **Digest Pre-Computation**: Pre-compute attention scores asynchronously on incoming tick events and store in a distributed Redis cache, avoiding on-the-fly computation during user HTTP requests.
