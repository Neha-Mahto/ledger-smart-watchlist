import { describe, it, expect, beforeEach } from 'vitest';
import { DeltaEngine } from '../deltaEngine';
import { MarketTick, UserPriceAlert } from '../types';

describe('DeltaEngine - Statistical Anomaly & Attention Scoring', () => {
  let engine: DeltaEngine;

  beforeEach(() => {
    engine = new DeltaEngine();
  });

  it('should detect volatility-relative price moves using statistical Z-score', () => {
    // Prime symbol history with low volatility returns (0.1% changes)
    for (let i = 0; i < 20; i++) {
      const price = 100 + (i % 2 === 0 ? 0.1 : -0.1);
      engine.processTick({
        symbol: 'TCS',
        name: 'Tata Consultancy Services',
        sector: 'IT',
        price,
        ts: Date.now() - (20 - i) * 1000,
        volume: 10000,
        dayHigh: 105,
        dayLow: 95,
        prevClose: 100,
        source: 'Simulated'
      });
    }

    // Now emit a sudden 3% jump price move
    const spikeTick: MarketTick = {
      symbol: 'TCS',
      name: 'Tata Consultancy Services',
      sector: 'IT',
      price: 103.5,
      ts: Date.now(),
      volume: 10000,
      dayHigh: 105,
      dayLow: 95,
      prevClose: 100,
      source: 'Simulated'
    };

    const evaluation = engine.processTick(spikeTick);
    const volSignal = evaluation.signals.find(s => s.type === 'VOLATILITY');

    expect(volSignal).toBeDefined();
    expect(volSignal?.detail).toContain('volatility swing');
    expect(evaluation.attentionScore).toBeGreaterThan(20);
  });

  it('should detect volume spikes against trailing average volume', () => {
    // Prime with average volume 5,000
    for (let i = 0; i < 15; i++) {
      engine.processTick({
        symbol: 'INFY',
        name: 'Infosys Ltd',
        sector: 'IT',
        price: 1500,
        ts: Date.now() - (15 - i) * 1000,
        volume: 5000,
        dayHigh: 1520,
        dayLow: 1480,
        prevClose: 1500,
        source: 'Simulated'
      });
    }

    // Emit 3.5x volume surge (17,500 volume)
    const surgeTick: MarketTick = {
      symbol: 'INFY',
      name: 'Infosys Ltd',
      sector: 'IT',
      price: 1502,
      ts: Date.now(),
      volume: 17500,
      dayHigh: 1520,
      dayLow: 1480,
      prevClose: 1500,
      source: 'Simulated'
    };

    const evalRes = engine.processTick(surgeTick);
    const volumeSignal = evalRes.signals.find(s => s.type === 'VOLUME_SPIKE');

    expect(volumeSignal).toBeDefined();
    expect(volumeSignal?.detail).toContain('Volume surge 3.5×');
  });

  it('should detect day high and day low range breaks', () => {
    const rangeBreakTick: MarketTick = {
      symbol: 'RELIANCE',
      name: 'Reliance Industries',
      sector: 'Energy',
      price: 2950, // Higher than dayHigh 2900
      ts: Date.now(),
      volume: 8000,
      dayHigh: 2900,
      dayLow: 2800,
      prevClose: 2880,
      source: 'Simulated'
    };

    const evalRes = engine.processTick(rangeBreakTick);
    const rangeSignal = evalRes.signals.find(s => s.type === 'RANGE_BREAK');

    expect(rangeSignal).toBeDefined();
    expect(rangeSignal?.detail).toContain('Broke 24h High');
  });

  it('should trigger user-defined price alerts regardless of statistical threshold', () => {
    const alertTick: MarketTick = {
      symbol: 'HDFCBANK',
      name: 'HDFC Bank',
      sector: 'Banking',
      price: 1650,
      ts: Date.now(),
      volume: 2000,
      dayHigh: 1700,
      dayLow: 1600,
      prevClose: 1640,
      source: 'Simulated'
    };

    const activeAlerts: UserPriceAlert[] = [
      {
        id: 'alert-1',
        userId: 'user-123',
        symbol: 'HDFCBANK',
        targetPrice: 1645,
        direction: 'ABOVE',
        triggered: false
      }
    ];

    const evalRes = engine.processTick(alertTick, activeAlerts);
    const alertSignal = evalRes.signals.find(s => s.type === 'PRICE_ALERT');

    expect(alertSignal).toBeDefined();
    expect(alertSignal?.detail).toContain('User price alert triggered at $1645.00');
  });

  it('should detect feed staleness if tick update exceeds time threshold', () => {
    const staleTick: MarketTick = {
      symbol: 'ONGC',
      name: 'Oil & Natural Gas Corp',
      sector: 'Energy',
      price: 240,
      ts: Date.now(),
      volume: 1000,
      dayHigh: 250,
      dayLow: 230,
      prevClose: 240,
      source: 'Simulated',
      isStale: true,
      staleAgeSec: 15
    };

    const evalRes = engine.processTick(staleTick);
    expect(evalRes.isStale).toBe(true);
    expect(evalRes.staleAgeSec).toBe(15);
    const staleSignal = evalRes.signals.find(s => s.type === 'STALENESS');
    expect(staleSignal).toBeDefined();
  });

  it('should rank multi-signal anomaly combinations higher than single signals', () => {
    // Tick with both volume surge and range break
    const multiSignalTick: MarketTick = {
      symbol: 'TATAMOTORS',
      name: 'Tata Motors',
      sector: 'Auto',
      price: 980,
      ts: Date.now(),
      volume: 25000, // Spike vs baseline
      dayHigh: 950,
      dayLow: 900,
      prevClose: 940,
      source: 'Simulated'
    };

    // Prime engine baseline volume
    engine.processTick({ ...multiSignalTick, price: 940, volume: 5000 });

    const evalRes = engine.processTick(multiSignalTick);
    expect(evalRes.signals.length).toBeGreaterThanOrEqual(2);
    expect(evalRes.attentionScore).toBeGreaterThan(45);
  });
});
