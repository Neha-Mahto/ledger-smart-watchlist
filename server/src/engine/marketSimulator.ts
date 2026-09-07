import { MarketTick } from './types';
import { SYMBOL_UNIVERSE, SymbolDefinition } from './symbolUniverse';

export const INITIAL_SYMBOLS = SYMBOL_UNIVERSE;

export class MarketSimulator {
  private currentTicks: Map<string, MarketTick> = new Map();
  private timer: NodeJS.Timeout | null = null;
  private starveSymbol: string = 'ONGC';
  private starveStartTime: number = 0;
  private isStarved: boolean = false;
  private tickListeners: Array<(tick: MarketTick) => void> = [];

  constructor() {
    // Initialize ticks from base symbol list
    const now = Date.now();
    INITIAL_SYMBOLS.forEach(s => {
      this.currentTicks.set(s.symbol, {
        symbol: s.symbol,
        name: s.name,
        sector: s.sector,
        price: s.basePrice,
        ts: now,
        volume: s.baseVolume,
        dayHigh: Math.max(s.basePrice, s.prevClose * 1.01),
        dayLow: Math.min(s.basePrice, s.prevClose * 0.99),
        prevClose: s.prevClose,
        source: 'Ledger Simulated Feed (Provider Spec)'
      });
    });

    // Schedule feed starvation for ONGC after 10 seconds of starting
    setTimeout(() => {
      this.isStarved = true;
      this.starveStartTime = Date.now();
    }, 10000);
  }

  public subscribe(callback: (tick: MarketTick) => void): () => void {
    this.tickListeners.push(callback);
    return () => {
      this.tickListeners = this.tickListeners.filter(l => l !== callback);
    };
  }

  public start(intervalMs: number = 1500): void {
    if (this.timer) return;
    this.timer = setInterval(() => {
      this.generateTicks();
    }, intervalMs);
  }

  public stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  public getAllCurrentTicks(): MarketTick[] {
    return Array.from(this.currentTicks.values());
  }

  public getTick(symbol: string): MarketTick | undefined {
    return this.currentTicks.get(symbol);
  }

  private generateTicks(): void {
    const now = Date.now();

    this.currentTicks.forEach((tick, symbol) => {
      // If symbol is ONGC and feed is deliberately starved, skip updating timestamp/price to trigger staleness
      if (this.isStarved && symbol === this.starveSymbol) {
        const staleDurationSec = Math.floor((now - this.starveStartTime) / 1000);
        const staleTick: MarketTick = {
          ...tick,
          isStale: true,
          staleAgeSec: staleDurationSec
        };
        this.currentTicks.set(symbol, staleTick);
        this.emitTick(staleTick);
        return;
      }

      // Random walk with occasional volatility burst or volume surge
      const isVolatilityBurst = Math.random() < 0.15; // 15% chance of volatility burst
      const isVolumeSpike = Math.random() < 0.12;      // 12% chance of volume spike

      const maxPctMove = isVolatilityBurst ? 0.025 : 0.003; // Up to 2.5% move on burst vs 0.3% normal
      const pctChange = (Math.random() * 2 - 1) * maxPctMove;
      
      const newPrice = parseFloat((tick.price * (1 + pctChange)).toFixed(2));
      const newDayHigh = Math.max(tick.dayHigh, newPrice);
      const newDayLow = Math.min(tick.dayLow, newPrice);
      
      const volumeMultiplier = isVolumeSpike ? (2.2 + Math.random() * 2) : (0.8 + Math.random() * 0.4);
      const newVolume = Math.round(tick.volume * volumeMultiplier);

      const updatedTick: MarketTick = {
        ...tick,
        price: newPrice,
        ts: now,
        volume: newVolume,
        dayHigh: newDayHigh,
        dayLow: newDayLow,
        isStale: false,
        staleAgeSec: 0
      };

      this.currentTicks.set(symbol, updatedTick);
      this.emitTick(updatedTick);
    });
  }

  private emitTick(tick: MarketTick): void {
    this.tickListeners.forEach(listener => listener(tick));
  }

  public triggerManualVolBurst(symbol: string): void {
    const tick = this.currentTicks.get(symbol);
    if (!tick) return;
    const burstPrice = parseFloat((tick.price * 1.032).toFixed(2)); // +3.2% jump
    const updated: MarketTick = {
      ...tick,
      price: burstPrice,
      ts: Date.now(),
      volume: Math.round(tick.volume * 3.4),
      dayHigh: Math.max(tick.dayHigh, burstPrice)
    };
    this.currentTicks.set(symbol, updated);
    this.emitTick(updated);
  }
}
