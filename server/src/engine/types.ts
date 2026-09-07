export interface MarketTick {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  ts: number;
  volume: number;
  dayHigh: number;
  dayLow: number;
  prevClose: number;
  source: string;
  isStale?: boolean;
  staleAgeSec?: number;
}

export interface StatisticalWindow {
  symbol: string;
  prices: number[];
  volumes: number[];
  returns: number[];
  realizedVol: number; // Standard deviation of percentage returns
  avgVolume: number;   // Simple Moving Average of volume
  dayHigh: number;
  dayLow: number;
  prevClose: number;
}

export interface AnomalySignal {
  type: 'VOLATILITY' | 'VOLUME_SPIKE' | 'RANGE_BREAK' | 'PRICE_ALERT' | 'STALENESS';
  scoreContrib: number;
  detail: string;
}

export interface AttentionEvaluation {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  changePercent: number;
  attentionScore: number; // 0 to 100
  signals: AnomalySignal[];
  explainableReason: string;
  isStale: boolean;
  staleAgeSec: number;
  timestamp: number;
}

export interface SectorStory {
  sector: string;
  symbols: string[];
  averageMovePercent: number;
  storyText: string;
  maxAttentionScore: number;
  timestamp: number;
}

export interface DigestSummary {
  generatedAt: number;
  unreadCount: number;
  items: AttentionEvaluation[];
  stories: SectorStory[];
}

export interface UserPriceAlert {
  id: string;
  userId: string;
  symbol: string;
  targetPrice: number;
  direction: 'ABOVE' | 'BELOW';
  triggered: boolean;
}
