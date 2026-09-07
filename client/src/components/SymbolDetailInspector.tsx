import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { X, TrendingUp, TrendingDown, Bell, Zap, History, Plus, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { WatchlistItemData, UserPriceAlert, AttentionEventRecord } from '../types';
import { fetchPriceAlerts, createPriceAlert, deletePriceAlert, fetchSymbolEventHistory, triggerVolatilityBurst, fetchSymbolChartData } from '../services/api';
import { AttentionRatingWidget } from './AttentionRatingWidget';

interface SymbolDetailInspectorProps {
  item: WatchlistItemData | null;
  onClose: () => void;
}

export const SymbolDetailInspector: React.FC<SymbolDetailInspectorProps> = ({ item, onClose }) => {
  const [alerts, setAlerts] = useState<UserPriceAlert[]>([]);
  const [history, setHistory] = useState<AttentionEventRecord[]>([]);
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M'>('1D');
  const [chartPoints, setChartPoints] = useState<Array<{ time: string; price: number }>>([]);
  const [alertPrice, setAlertPrice] = useState<string>('');
  const [alertDirection, setAlertDirection] = useState<'ABOVE' | 'BELOW'>('ABOVE');
  const [isBursting, setIsBursting] = useState<boolean>(false);

  useEffect(() => {
    if (!item) return;
    loadAlertsAndHistory(item.symbol);
    setAlertPrice(item.price.toFixed(2));
  }, [item?.symbol]);

  useEffect(() => {
    if (!item) return;
    fetchSymbolChartData(item.symbol, timeframe)
      .then(res => setChartPoints(res.points))
      .catch(() => {
        const spark = item.sparkline || [item.price];
        setChartPoints(spark.map((v, i) => ({ time: `${30 - i}m ago`, price: v })));
      });
  }, [item?.symbol, timeframe]);

  const loadAlertsAndHistory = async (symbol: string) => {
    try {
      const allAlerts = await fetchPriceAlerts();
      setAlerts(allAlerts.filter(a => a.symbol === symbol));
      const evHistory = await fetchSymbolEventHistory(symbol);
      setHistory(evHistory);
    } catch (e) {}
  };

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || !alertPrice) return;
    try {
      await createPriceAlert(item.symbol, parseFloat(alertPrice), alertDirection);
      loadAlertsAndHistory(item.symbol);
    } catch (e: any) {
      alert(e.message || 'Failed to set price alert');
    }
  };

  const handleDeleteAlert = async (id: string) => {
    try {
      await deletePriceAlert(id);
      if (item) loadAlertsAndHistory(item.symbol);
    } catch (e) {}
  };

  const handleTriggerBurst = async () => {
    if (!item) return;
    setIsBursting(true);
    try {
      await triggerVolatilityBurst(item.symbol);
      setTimeout(() => setIsBursting(false), 800);
    } catch (e) {
      setIsBursting(false);
    }
  };

  if (!item) return null;

  const isPos = item.changePercent >= 0;
  const dayLow = item.dayLow || item.price * 0.98;
  const dayHigh = item.dayHigh || item.price * 1.02;
  const week52Low = dayLow * 0.85;
  const week52High = dayHigh * 1.25;
  const range52Pct = Math.min(100, Math.max(0, ((item.price - week52Low) / (week52High - week52Low)) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-end p-0 sm:p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border-l sm:border border-[#EBECEF] dark:border-slate-800 w-full max-w-2xl h-full sm:h-[92vh] sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden font-sans">
        {/* Groww Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#EBECEF] dark:border-slate-800 flex items-center justify-between bg-[#F8F9FA] dark:bg-slate-900">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-[#00D09C]/10 text-[#00B386] border border-[#00D09C]/30 flex items-center justify-center font-mono font-extrabold text-lg shadow-2xs">
              {item.symbol.substring(0, 3)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-sans font-extrabold text-2xl text-[#111827] dark:text-slate-100">{item.symbol}</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-[#7C7E8C] border border-[#EBECEF] dark:border-slate-700">
                  {item.sector}
                </span>
              </div>
              <p className="text-xs text-[#7C7E8C] font-sans">{item.name}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleTriggerBurst}
              disabled={isBursting}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-mono transition-all"
              title="Simulate volatility spike for delta engine test"
            >
              <Zap className={`w-3.5 h-3.5 ${isBursting ? 'animate-bounce' : ''}`} />
              <span>{isBursting ? 'Spiking...' : 'Spike Test'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 text-[#7C7E8C] hover:text-[#111827] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Price Banner */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 rounded-2xl border border-[#EBECEF] dark:border-slate-800 bg-[#F8F9FA] dark:bg-slate-950/40">
            <div>
              <span className="text-[11px] font-mono text-[#7C7E8C] uppercase">Market Price</span>
              <div className="flex items-baseline space-x-3 mt-1 font-mono">
                <span className="text-3xl font-extrabold text-[#111827] dark:text-slate-100 tabular-nums">${item.price.toFixed(2)}</span>
                <span className={`inline-flex items-center font-bold text-sm px-2.5 py-1 rounded-xl tabular-nums ${
                  isPos ? 'text-[#00B386] bg-[#E6F9F5]' : 'text-[#EB5757] bg-[#FDE8E8]'
                }`}>
                  {isPos ? <ArrowUpRight className="w-4 h-4 mr-0.5" /> : <ArrowDownRight className="w-4 h-4 mr-0.5" />}
                  {isPos ? '+' : ''}{item.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Attention Urgency Rating Full Widget */}
          <AttentionRatingWidget
            score={item.attentionScore}
            signals={item.signals}
            explainableReason={item.explainableReason}
            variant="full"
          />

          {/* Interactive Groww Chart */}
          <div className="groww-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-sans font-bold text-base text-[#111827] dark:text-slate-100">Performance Chart</h4>
              <div className="flex items-center space-x-1 bg-[#F8F9FA] dark:bg-slate-800 p-1 rounded-xl border border-[#EBECEF] dark:border-slate-700 font-mono text-xs">
                {(['1D', '1W', '1M'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1 rounded-lg transition-all font-bold ${
                      timeframe === tf ? 'bg-[#00D09C] text-white shadow-xs' : 'text-[#7C7E8C] hover:text-[#111827]'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartPoints}>
                  <defs>
                    <linearGradient id="growwChartColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isPos ? '#00D09C' : '#EB5757'} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={isPos ? '#00D09C' : '#EB5757'} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#7C7E8C" fontSize={10} tickLine={false} />
                  <YAxis stroke="#7C7E8C" fontSize={10} domain={['auto', 'auto']} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#EBECEF', borderRadius: '12px', fontSize: '12px' }}
                    formatter={(val: any) => [`$${Number(val).toFixed(2)}`, 'Price']}
                  />
                  <Area type="monotone" dataKey="price" stroke={isPos ? '#00D09C' : '#EB5757'} strokeWidth={2.5} fillOpacity={1} fill="url(#growwChartColor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 52-Week Range & Key Market Stats (Groww Feature) */}
          <div className="groww-card p-5 space-y-4">
            <h4 className="font-sans font-bold text-base text-[#111827] dark:text-slate-100">Performance & Key Stats</h4>
            
            {/* 52-Week Range Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-[#7C7E8C] tabular-nums">
                <span>52W Low: ${week52Low.toFixed(2)}</span>
                <span>52W High: ${week52High.toFixed(2)}</span>
              </div>
              <div className="w-full h-2 bg-[#F8F9FA] dark:bg-slate-800 rounded-full overflow-hidden border border-[#EBECEF] dark:border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-[#00D09C] to-[#00B386] rounded-full transition-all duration-300"
                  style={{ width: `${range52Pct}%` }}
                />
              </div>
            </div>

            {/* Grid Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#EBECEF] dark:border-slate-800 font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-[#F8F9FA] dark:bg-slate-800/60 border border-[#EBECEF] dark:border-slate-800">
                <span className="text-[10px] text-[#7C7E8C] block font-sans">24h Day High</span>
                <span className="font-bold text-[#111827] dark:text-slate-100 tabular-nums">${dayHigh.toFixed(2)}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F8F9FA] dark:bg-slate-800/60 border border-[#EBECEF] dark:border-slate-800">
                <span className="text-[10px] text-[#7C7E8C] block font-sans">24h Day Low</span>
                <span className="font-bold text-[#111827] dark:text-slate-100 tabular-nums">${dayLow.toFixed(2)}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F8F9FA] dark:bg-slate-800/60 border border-[#EBECEF] dark:border-slate-800">
                <span className="text-[10px] text-[#7C7E8C] block font-sans">Previous Close</span>
                <span className="font-bold text-[#111827] dark:text-slate-100 tabular-nums">${(item.prevClose || item.price).toFixed(2)}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F8F9FA] dark:bg-slate-800/60 border border-[#EBECEF] dark:border-slate-800">
                <span className="text-[10px] text-[#7C7E8C] block font-sans">Feed Status</span>
                <span className="font-bold text-[#00B386]">{item.isStale ? `Stale ${item.staleAgeSec}s` : 'Active Live'}</span>
              </div>
            </div>
          </div>

          {/* User Price Alerts Manager */}
          <div className="groww-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-[#00D09C]" />
                <h4 className="font-sans font-bold text-base text-[#111827] dark:text-slate-100">Custom Price Alerts</h4>
              </div>
              <span className="text-xs font-mono text-[#7C7E8C]">{alerts.length} Active</span>
            </div>

            <form onSubmit={handleCreateAlert} className="flex gap-2">
              <select
                value={alertDirection}
                onChange={(e) => setAlertDirection(e.target.value as 'ABOVE' | 'BELOW')}
                className="bg-[#F8F9FA] dark:bg-slate-800 border border-[#EBECEF] dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-[#111827] dark:text-slate-100 font-mono focus:outline-none focus:border-[#00D09C]"
              >
                <option value="ABOVE">Price Above</option>
                <option value="BELOW">Price Below</option>
              </select>
              <input
                type="number"
                step="0.1"
                value={alertPrice}
                onChange={(e) => setAlertPrice(e.target.value)}
                placeholder="Target Price"
                className="bg-[#F8F9FA] dark:bg-slate-800 border border-[#EBECEF] dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-[#111827] dark:text-slate-100 font-mono focus:outline-none focus:border-[#00D09C] flex-1"
              />
              <button
                type="submit"
                className="groww-btn-mint px-4 py-2 text-xs"
              >
                Set Alert
              </button>
            </form>

            {alerts.length > 0 && (
              <div className="space-y-2">
                {alerts.map(a => (
                  <div key={a.id} className="bg-[#F8F9FA] dark:bg-slate-800/60 border border-[#EBECEF] dark:border-slate-700 rounded-xl px-3.5 py-2 flex items-center justify-between text-xs font-mono">
                    <span className="text-[#111827] dark:text-slate-200">Alert if price {a.direction} ${a.targetPrice.toFixed(2)}</span>
                    <button onClick={() => handleDeleteAlert(a.id)} className="text-[#7C7E8C] hover:text-[#EB5757]">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Historical Timeline */}
          <div className="groww-card p-5 space-y-3">
            <div className="flex items-center space-x-2">
              <History className="w-4 h-4 text-[#00D09C]" />
              <h4 className="font-sans font-bold text-base text-[#111827] dark:text-slate-100">Past Attention Event Log</h4>
            </div>
            {history.length > 0 ? (
              <div className="space-y-2">
                {history.map(ev => (
                  <div key={ev.id} className="bg-[#F8F9FA] dark:bg-slate-800/60 border border-[#EBECEF] dark:border-slate-700 rounded-xl p-3 text-xs font-mono">
                    <div className="flex justify-between text-[#7C7E8C] text-[10px] mb-1">
                      <span>{new Date(ev.createdAt).toLocaleTimeString()}</span>
                      <span className="text-[#00B386] font-bold">Score: {ev.attentionScore}</span>
                    </div>
                    <p className="text-[#111827] dark:text-slate-100">{ev.reason}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#7C7E8C] italic">No past anomaly events logged for {item.symbol}.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
