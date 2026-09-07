import express, { Response } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { prisma } from './db/prisma';
import { authMiddleware, AuthRequest, JWT_SECRET } from './middleware/auth';
import { MarketSimulator, INITIAL_SYMBOLS } from './engine/marketSimulator';
import { searchSymbols } from './engine/symbolUniverse';
import { DeltaEngine } from './engine/deltaEngine';
import { MarketTick, AttentionEvaluation, UserPriceAlert, SectorStory, DigestSummary } from './engine/types';

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const simulator = new MarketSimulator();
const deltaEngine = new DeltaEngine();

// In-memory sparkline buffer & recent evaluation cache
const sparklineBuffer: Map<string, number[]> = new Map();
const latestEvaluations: Map<string, AttentionEvaluation> = new Map();

// Helper to update sparklines
function appendSparklinePrice(symbol: string, price: number) {
  const current = sparklineBuffer.get(symbol) || [];
  current.push(price);
  if (current.length > 30) current.shift();
  sparklineBuffer.set(symbol, current);
}

// Subscribe simulator to delta engine & socket push
simulator.subscribe(async (tick: MarketTick) => {
  appendSparklinePrice(tick.symbol, tick.price);

  // Fetch active alerts for this symbol
  let activeAlerts: UserPriceAlert[] = [];
  try {
    const dbAlerts = await prisma.priceAlert.findMany({
      where: { symbol: tick.symbol, triggered: false }
    });
    activeAlerts = dbAlerts.map(a => ({
      id: a.id,
      userId: a.userId,
      symbol: a.symbol,
      targetPrice: a.targetPrice,
      direction: a.direction as 'ABOVE' | 'BELOW',
      triggered: a.triggered
    }));
  } catch (err) {
    // Fallback if db query fails
  }

  const evaluation = deltaEngine.processTick(tick, activeAlerts);
  latestEvaluations.set(tick.symbol, evaluation);

  // Check if price alerts fired, update db
  for (const sig of evaluation.signals) {
    if (sig.type === 'PRICE_ALERT') {
      await prisma.priceAlert.updateMany({
        where: { symbol: tick.symbol, triggered: false },
        data: { triggered: true }
      }).catch(() => {});
    }

    // Persist high attention events (> 40 score) to event history table
    if (evaluation.attentionScore >= 40) {
      await prisma.attentionEvent.create({
        data: {
          symbol: evaluation.symbol,
          attentionScore: evaluation.attentionScore,
          reason: evaluation.explainableReason,
          price: evaluation.price,
          changePercent: evaluation.changePercent,
          volumeSurge: tick.volume
        }
      }).catch(() => {});
    }
  }

  // Push tick update to all connected clients via Socket.IO
  io.emit('price:tick', {
    ...evaluation,
    sparkline: sparklineBuffer.get(tick.symbol) || [tick.price],
    dayHigh: tick.dayHigh,
    dayLow: tick.dayLow,
    prevClose: tick.prevClose
  });
});

// Start Market Simulator
simulator.start(1500);

// --- REST API Endpoints ---

// Auth Login / Register Endpoint
app.post('/api/auth/login', async (req: express.Request, res: Response) => {
  try {
    const { username } = req.body;
    if (!username || typeof username !== 'string' || username.trim().length === 0) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const cleanUsername = username.trim().toLowerCase();

    const user = await prisma.user.upsert({
      where: { username: cleanUsername },
      update: {},
      create: { username: cleanUsername }
    });

    // Ensure default watchlists exist for new user
    const defaultSymbols = ['TCS', 'INFY', 'HDFCBANK', 'RELIANCE', 'TATAMOTORS', 'ONGC'];
    for (const sym of defaultSymbols) {
      await prisma.watchlistItem.upsert({
        where: { userId_symbol: { userId: user.id, symbol: sym } },
        update: {},
        create: { userId: user.id, symbol: sym }
      });
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: { id: user.id, username: user.username, themePreference: user.themePreference } });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

// Get User Watchlist Endpoint
app.get('/api/watchlist', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const items = await prisma.watchlistItem.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' }
    });

    const watchlistData = items.map(item => {
      const evaluation = latestEvaluations.get(item.symbol) || {
        symbol: item.symbol,
        name: INITIAL_SYMBOLS.find(s => s.symbol === item.symbol)?.name || item.symbol,
        sector: INITIAL_SYMBOLS.find(s => s.symbol === item.symbol)?.sector || 'General',
        price: INITIAL_SYMBOLS.find(s => s.symbol === item.symbol)?.basePrice || 100,
        changePercent: 0,
        attentionScore: 0,
        signals: [],
        explainableReason: 'Initializing feed...',
        isStale: false,
        staleAgeSec: 0,
        timestamp: Date.now()
      };

      const tick = simulator.getTick(item.symbol);

      return {
        id: item.id,
        symbol: item.symbol,
        name: evaluation.name,
        sector: evaluation.sector,
        price: evaluation.price,
        changePercent: evaluation.changePercent,
        attentionScore: evaluation.attentionScore,
        explainableReason: evaluation.explainableReason,
        isStale: evaluation.isStale,
        staleAgeSec: evaluation.staleAgeSec,
        signals: evaluation.signals,
        sparkline: sparklineBuffer.get(item.symbol) || [evaluation.price],
        dayHigh: tick?.dayHigh || evaluation.price,
        dayLow: tick?.dayLow || evaluation.price,
        prevClose: tick?.prevClose || evaluation.price
      };
    });

    return res.json(watchlistData);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Add Symbol to Watchlist
app.post('/api/watchlist', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { symbol } = req.body;
    if (!symbol) return res.status(400).json({ error: 'Symbol required' });

    const upperSymbol = symbol.toUpperCase().trim();
    const existsInSim = INITIAL_SYMBOLS.some(s => s.symbol === upperSymbol);
    if (!existsInSim) {
      return res.status(404).json({ error: `Symbol ${upperSymbol} is not supported in simulated market feed.` });
    }

    const item = await prisma.watchlistItem.upsert({
      where: { userId_symbol: { userId, symbol: upperSymbol } },
      update: {},
      create: { userId, symbol: upperSymbol }
    });

    return res.json(item);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Remove Symbol from Watchlist
app.delete('/api/watchlist/:symbol', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const symbol = req.params.symbol.toUpperCase();

    await prisma.watchlistItem.deleteMany({
      where: { userId, symbol }
    });

    return res.json({ success: true, symbol });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// "Since You Last Checked" Digest Endpoint
app.get('/api/digest', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    
    // Fetch user's watched symbols
    const watchedItems = await prisma.watchlistItem.findMany({ where: { userId } });
    const watchedSymbols = new Set(watchedItems.map(w => w.symbol));

    // Get current evaluations for watched symbols
    const evaluations: AttentionEvaluation[] = [];
    latestEvaluations.forEach((evalRes, sym) => {
      if (watchedSymbols.has(sym)) {
        evaluations.push(evalRes);
      }
    });

    // Rank items by attention score descending
    const rankedItems = evaluations
      .filter(e => e.attentionScore > 0 || e.isStale || Math.abs(e.changePercent) > 0.8)
      .sort((a, b) => b.attentionScore - a.attentionScore);

    // Compute Sector Stories for correlated moves
    const sectorStories: SectorStory[] = deltaEngine.detectSectorStories(evaluations);

    // Fetch LastSeenSnapshot for cross-device unread calculation
    const lastSeenRecord = await prisma.lastSeenSnapshot.findUnique({ where: { userId } });
    let unreadCount = rankedItems.length;

    if (lastSeenRecord) {
      try {
        const lastSeenMap: Record<string, number> = JSON.parse(lastSeenRecord.snapshotData);
        // Count items whose current attention score or timestamp exceeds last seen snapshot
        unreadCount = rankedItems.filter(item => {
          const prevScore = lastSeenMap[item.symbol] || 0;
          return item.attentionScore > prevScore + 5 || item.isStale;
        }).length;
      } catch (e) {}
    }

    const digest: DigestSummary = {
      generatedAt: Date.now(),
      unreadCount,
      items: rankedItems,
      stories: sectorStories
    };

    return res.json(digest);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Acknowledge Digest Snapshot Endpoint (Cross-device persistence)
app.post('/api/digest/acknowledge', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const snapshotObj: Record<string, number> = {};

    latestEvaluations.forEach((evalRes, symbol) => {
      snapshotObj[symbol] = evalRes.attentionScore;
    });

    const snapshotData = JSON.stringify(snapshotObj);

    await prisma.lastSeenSnapshot.upsert({
      where: { userId },
      update: { snapshotData },
      create: { userId, snapshotData }
    });

    return res.json({ success: true, acknowledgedAt: Date.now() });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Price Alerts Endpoints
app.get('/api/alerts', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const alerts = await prisma.priceAlert.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(alerts);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/alerts', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { symbol, targetPrice, direction } = req.body;
    if (!symbol || !targetPrice || !direction) {
      return res.status(400).json({ error: 'symbol, targetPrice, and direction required' });
    }

    const alert = await prisma.priceAlert.create({
      data: {
        userId,
        symbol: symbol.toUpperCase(),
        targetPrice: parseFloat(targetPrice),
        direction: direction.toUpperCase() === 'BELOW' ? 'BELOW' : 'ABOVE'
      }
    });

    return res.json(alert);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.delete('/api/alerts/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    await prisma.priceAlert.deleteMany({
      where: { id: req.params.id, userId }
    });
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Symbol Interactive Chart History Endpoint (1D, 1W, 1M Timeframes)
app.get('/api/symbols/:symbol/chart', (req: express.Request, res: Response) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const timeframe = (req.query.timeframe as string) || '1D';

    const tick = simulator.getTick(symbol);
    const basePrice = tick?.price || 1000;
    const points: Array<{ time: string; price: number; volume: number }> = [];

    if (timeframe === '1D') {
      const history = sparklineBuffer.get(symbol) || [basePrice];
      history.forEach((val, idx) => {
        const minAgo = history.length - idx;
        points.push({
          time: `${minAgo}m ago`,
          price: val,
          volume: Math.round(10000 + Math.random() * 5000)
        });
      });
    } else if (timeframe === '1W') {
      for (let i = 7; i >= 1; i--) {
        const variance = (Math.random() * 0.04 - 0.02); // +/- 2% daily fluctuation
        const p = parseFloat((basePrice * (1 + variance * (i / 7))).toFixed(2));
        points.push({
          time: `Day ${8 - i}`,
          price: p,
          volume: Math.round(50000 + Math.random() * 20000)
        });
      }
    } else if (timeframe === '1M') {
      for (let i = 30; i >= 1; i -= 2) {
        const variance = (Math.random() * 0.08 - 0.04);
        const p = parseFloat((basePrice * (1 + variance * (i / 30))).toFixed(2));
        points.push({
          time: `T-${i}d`,
          price: p,
          volume: Math.round(120000 + Math.random() * 40000)
        });
      }
    }

    return res.json({ symbol, timeframe, points });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// All Available Simulated Symbols List with Search Query Filtering
app.get('/api/symbols', (req: express.Request, res: Response) => {
  const query = req.query.q as string;
  if (query) {
    const results = searchSymbols(query);
    return res.json(results);
  }
  return res.json(INITIAL_SYMBOLS);
});

// Symbol Attention Event History Timeline
app.get('/api/symbols/:symbol/history', async (req: express.Request, res: Response) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const events = await prisma.attentionEvent.findMany({
      where: { symbol },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    return res.json(events);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Trigger Volatility Burst Endpoint (Demo testing trigger)
app.post('/api/simulate/burst', (req: express.Request, res: Response) => {
  const { symbol } = req.body;
  if (!symbol) return res.status(400).json({ error: 'Symbol required' });
  simulator.triggerManualVolBurst(symbol.toUpperCase());
  return res.json({ success: true, message: `Triggered volatility burst for ${symbol.toUpperCase()}` });
});

// Server Listen
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`  Ledger Server Listening on http://localhost:${PORT}`);
  console.log(`  Socket.IO Push Active`);
  console.log(`  Market Simulator Active with Starve Timer on ONGC`);
  console.log(`===================================================`);
});
