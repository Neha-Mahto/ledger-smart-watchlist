import { MarketTick, StatisticalWindow, AnomalySignal, AttentionEvaluation, SectorStory, UserPriceAlert } from './types';

export class DeltaEngine {
  private windowSize: number = 30; // Number of historical ticks kept per symbol
  private symbolHistory: Map<string, StatisticalWindow> = new Map();
  private lastTickTimestamps: Map<string, number> = new Map();

  /**
   * Updates rolling statistical window for a symbol and returns attention evaluation
   */
  public processTick(tick: MarketTick, activeAlerts: UserPriceAlert[] = []): AttentionEvaluation {
    const now = tick.ts || Date.now();
    const lastTs = this.lastTickTimestamps.get(tick.symbol) || now;
    this.lastTickTimestamps.set(tick.symbol, now);

    const calculatedStaleAge = Math.floor((now - lastTs) / 1000);
    const staleAgeSec = tick.staleAgeSec && tick.staleAgeSec > 0 ? tick.staleAgeSec : calculatedStaleAge;
    const isStaleFeed = Boolean(tick.isStale) || staleAgeSec > 10;

    let window = this.symbolHistory.get(tick.symbol);
    if (!window) {
      window = {
        symbol: tick.symbol,
        prices: [],
        volumes: [],
        returns: [],
        realizedVol: 0.005, // Initial baseline volatility estimate (0.5%)
        avgVolume: tick.volume || 10000,
        dayHigh: tick.dayHigh || tick.price,
        dayLow: tick.dayLow || tick.price,
        prevClose: tick.prevClose || tick.price
      };
      this.symbolHistory.set(tick.symbol, window);
    }

    // Calculate baseline trailing average volume BEFORE adding current tick
    const trailingAvgVolume = this.calculateAverageVolume(window.volumes.length > 0 ? window.volumes : [window.avgVolume]);

    // Compute return from last known price
    const prevPrice = window.prices.length > 0 ? window.prices[window.prices.length - 1] : tick.prevClose;
    const currentReturn = prevPrice > 0 ? (tick.price - prevPrice) / prevPrice : 0;

    // Update rolling history lists
    window.prices.push(tick.price);
    window.volumes.push(tick.volume);
    window.returns.push(currentReturn);

    if (window.prices.length > this.windowSize) window.prices.shift();
    if (window.volumes.length > this.windowSize) window.volumes.shift();
    if (window.returns.length > this.windowSize) window.returns.shift();

    // Recalculate Realized Volatility & Average Volume
    window.realizedVol = this.calculateRealizedVolatility(window.returns);
    window.avgVolume = trailingAvgVolume;
    
    // Update Day High / Low
    if (tick.price > window.dayHigh) window.dayHigh = tick.price;
    if (tick.price < window.dayLow) window.dayLow = tick.price;

    const signals: AnomalySignal[] = [];

    // 1. Volatility-Relative Price Move Detection
    const volZScore = window.realizedVol > 0 ? Math.abs(currentReturn) / window.realizedVol : 0;
    if (volZScore >= 1.5) {
      const volScore = Math.min(35, Math.round(volZScore * 12));
      signals.push({
        type: 'VOLATILITY',
        scoreContrib: volScore,
        detail: `${volZScore.toFixed(1)}× baseline 30-period volatility swing`
      });
    }

    // 2. Volume Spike Detection
    const volumeSurgeRatio = window.avgVolume > 0 ? tick.volume / window.avgVolume : 1;
    if (volumeSurgeRatio >= 1.8) {
      const surgeScore = Math.min(25, Math.round((volumeSurgeRatio - 1) * 15));
      signals.push({
        type: 'VOLUME_SPIKE',
        scoreContrib: surgeScore,
        detail: `Volume surge ${volumeSurgeRatio.toFixed(1)}× over trailing average`
      });
    }

    // 3. Day High / Low Range Break Detection
    if (tick.price > tick.dayHigh * 0.9995 && tick.price >= window.prevClose * 1.01) {
      signals.push({
        type: 'RANGE_BREAK',
        scoreContrib: 20,
        detail: `Broke 24h High ($${tick.price.toFixed(2)})`
      });
    } else if (tick.price < tick.dayLow * 1.0005 && tick.price <= window.prevClose * 0.99) {
      signals.push({
        type: 'RANGE_BREAK',
        scoreContrib: 20,
        detail: `Broke 24h Low ($${tick.price.toFixed(2)})`
      });
    }

    // 4. User-Defined Price Alerts Triggering
    const matchingAlerts = activeAlerts.filter(a => a.symbol === tick.symbol && !a.triggered);
    for (const alert of matchingAlerts) {
      let fired = false;
      if (alert.direction === 'ABOVE' && tick.price >= alert.targetPrice) fired = true;
      if (alert.direction === 'BELOW' && tick.price <= alert.targetPrice) fired = true;

      if (fired) {
        signals.push({
          type: 'PRICE_ALERT',
          scoreContrib: 35,
          detail: `User price alert triggered at $${alert.targetPrice.toFixed(2)} (${alert.direction})`
        });
      }
    }

    // 5. Explicit Staleness Signal
    if (isStaleFeed) {
      signals.push({
        type: 'STALENESS',
        scoreContrib: 20,
        detail: `Data feed stale: no updates for ${staleAgeSec > 0 ? staleAgeSec : 12}s`
      });
    }

    // 6. Combined Attention Score (0-100)
    let totalScore = signals.reduce((sum, s) => sum + s.scoreContrib, 0);
    // Multi-signal composition bonus: 2 or more signals boost total attention score
    if (signals.length >= 2) {
      totalScore = Math.round(totalScore * 1.25);
    }
    const finalAttentionScore = Math.min(100, Math.max(0, totalScore));

    const changePercent = tick.prevClose > 0 ? ((tick.price - tick.prevClose) / tick.prevClose) * 100 : 0;
    
    // Construct human-readable explainable reason string
    const explainableReason = signals.length > 0
      ? signals.map(s => s.detail).join(' • ')
      : `Routine price tracking (${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)`;

    return {
      symbol: tick.symbol,
      name: tick.name,
      sector: tick.sector,
      price: tick.price,
      changePercent: parseFloat(changePercent.toFixed(2)),
      attentionScore: finalAttentionScore,
      signals,
      explainableReason,
      isStale: isStaleFeed,
      staleAgeSec: isStaleFeed ? (staleAgeSec || 12) : 0,
      timestamp: now
    };
  }

  /**
   * Helper to calculate realized volatility (standard deviation of returns)
   */
  public calculateRealizedVolatility(returns: number[]): number {
    if (returns.length < 2) return 0.005;
    const mean = returns.reduce((acc, val) => acc + val, 0) / returns.length;
    const variance = returns.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (returns.length - 1);
    return Math.max(0.001, Math.sqrt(variance));
  }

  /**
   * Helper to calculate average volume
   */
  public calculateAverageVolume(volumes: number[]): number {
    if (volumes.length === 0) return 10000;
    const sum = volumes.reduce((acc, val) => acc + val, 0);
    return Math.round(sum / volumes.length);
  }

  /**
   * Group correlated co-moving symbols by sector into unified sector stories
   */
  public detectSectorStories(evaluations: AttentionEvaluation[]): SectorStory[] {
    const sectorMap = new Map<string, AttentionEvaluation[]>();
    for (const ev of evaluations) {
      const list = sectorMap.get(ev.sector) || [];
      list.push(ev);
      sectorMap.set(ev.sector, list);
    }

    const stories: SectorStory[] = [];
    sectorMap.forEach((evals, sector) => {
      if (evals.length >= 2) {
        const positiveMoves = evals.filter(e => e.changePercent > 0.5);
        const negativeMoves = evals.filter(e => e.changePercent < -0.5);

        if (positiveMoves.length >= 2) {
          const avgMove = positiveMoves.reduce((s, e) => s + e.changePercent, 0) / positiveMoves.length;
          const maxScore = Math.max(...positiveMoves.map(e => e.attentionScore));
          const symbols = positiveMoves.map(e => e.symbol);
          stories.push({
            sector,
            symbols,
            averageMovePercent: parseFloat(avgMove.toFixed(2)),
            storyText: `${sector} Sector Momentum: ${symbols.join(', ')} all trending up average +${avgMove.toFixed(2)}% on elevated volume.`,
            maxAttentionScore: Math.max(maxScore, 65),
            timestamp: Date.now()
          });
        } else if (negativeMoves.length >= 2) {
          const avgMove = negativeMoves.reduce((s, e) => s + e.changePercent, 0) / negativeMoves.length;
          const maxScore = Math.max(...negativeMoves.map(e => e.attentionScore));
          const symbols = negativeMoves.map(e => e.symbol);
          stories.push({
            sector,
            symbols,
            averageMovePercent: parseFloat(avgMove.toFixed(2)),
            storyText: `${sector} Sector Pullback: ${symbols.join(', ')} experiencing sector-wide selling average ${avgMove.toFixed(2)}%.`,
            maxAttentionScore: Math.max(maxScore, 65),
            timestamp: Date.now()
          });
        }
      }
    });

    return stories;
  }
}
