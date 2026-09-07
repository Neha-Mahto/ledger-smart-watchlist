import { WatchlistItemData, DigestSummary, UserPriceAlert, SimulatedSymbolInfo, AttentionEventRecord } from '../types';

const API_BASE = '/api';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('ledger_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export async function loginUser(username: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to authenticate');
  }
  return res.json();
}

export async function fetchWatchlist(): Promise<WatchlistItemData[]> {
  const res = await fetch(`${API_BASE}/watchlist`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch watchlist');
  return res.json();
}

export async function addWatchlistSymbol(symbol: string) {
  const res = await fetch(`${API_BASE}/watchlist`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ symbol })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to add symbol');
  }
  return res.json();
}

export async function removeWatchlistSymbol(symbol: string) {
  const res = await fetch(`${API_BASE}/watchlist/${symbol}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to remove symbol');
  return res.json();
}

export async function fetchDigest(): Promise<DigestSummary> {
  const res = await fetch(`${API_BASE}/digest`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch digest');
  return res.json();
}

export async function acknowledgeDigestSnapshot() {
  const res = await fetch(`${API_BASE}/digest/acknowledge`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to acknowledge digest');
  return res.json();
}

export async function fetchPriceAlerts(): Promise<UserPriceAlert[]> {
  const res = await fetch(`${API_BASE}/alerts`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch alerts');
  return res.json();
}

export async function createPriceAlert(symbol: string, targetPrice: number, direction: 'ABOVE' | 'BELOW') {
  const res = await fetch(`${API_BASE}/alerts`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ symbol, targetPrice, direction })
  });
  if (!res.ok) throw new Error('Failed to create alert');
  return res.json();
}

export async function deletePriceAlert(id: string) {
  const res = await fetch(`${API_BASE}/alerts/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete alert');
  return res.json();
}

export async function fetchAvailableSymbols(query?: string): Promise<SimulatedSymbolInfo[]> {
  const url = query ? `${API_BASE}/symbols?q=${encodeURIComponent(query)}` : `${API_BASE}/symbols`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch symbol list');
  return res.json();
}

export async function fetchSymbolEventHistory(symbol: string): Promise<AttentionEventRecord[]> {
  const res = await fetch(`${API_BASE}/symbols/${symbol}/history`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
}

export async function fetchSymbolChartData(symbol: string, timeframe: '1D' | '1W' | '1M' = '1D'): Promise<{
  symbol: string;
  timeframe: string;
  points: Array<{ time: string; price: number; volume: number }>;
}> {
  const res = await fetch(`${API_BASE}/symbols/${symbol}/chart?timeframe=${timeframe}`);
  if (!res.ok) throw new Error('Failed to fetch chart data');
  return res.json();
}

export async function triggerVolatilityBurst(symbol: string) {
  const res = await fetch(`${API_BASE}/simulate/burst`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symbol })
  });
  if (!res.ok) throw new Error('Failed to trigger burst');
  return res.json();
}
