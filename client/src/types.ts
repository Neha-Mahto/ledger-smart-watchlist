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
  attentionScore: number;
  signals: AnomalySignal[];
  explainableReason: string;
  isStale: boolean;
  staleAgeSec: number;
  timestamp: number;
  sparkline?: number[];
  dayHigh?: number;
  dayLow?: number;
  prevClose?: number;
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

export interface WatchlistItemData extends AttentionEvaluation {
  id: string;
}

export interface UserPriceAlert {
  id: string;
  userId: string;
  symbol: string;
  targetPrice: number;
  direction: 'ABOVE' | 'BELOW';
  triggered: boolean;
  createdAt: string;
}

export interface AttentionEventRecord {
  id: string;
  symbol: string;
  attentionScore: number;
  reason: string;
  price: number;
  changePercent: number;
  volumeSurge: number;
  createdAt: string;
}

export interface SimulatedSymbolInfo {
  symbol: string;
  name: string;
  sector: string;
  basePrice: number;
  prevClose: number;
}
