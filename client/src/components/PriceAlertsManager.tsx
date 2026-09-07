import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { UserPriceAlert, WatchlistItemData } from '../types';
import { fetchPriceAlerts, createPriceAlert, deletePriceAlert } from '../services/api';

interface PriceAlertsManagerProps {
  watchlistItems: WatchlistItemData[];
}

export const PriceAlertsManager: React.FC<PriceAlertsManagerProps> = ({ watchlistItems }) => {
  const [alerts, setAlerts] = useState<UserPriceAlert[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>(watchlistItems[0]?.symbol || 'TCS');
  const [targetPrice, setTargetPrice] = useState<string>('');
  const [direction, setDirection] = useState<'ABOVE' | 'BELOW'>('ABOVE');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const data = await fetchPriceAlerts();
      setAlerts(data);
    } catch (e) {
      console.error('Error fetching alerts:', e);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSymbol || !targetPrice) return;
    setLoading(true);
    try {
      await createPriceAlert(selectedSymbol, parseFloat(targetPrice), direction);
      setTargetPrice('');
      loadAlerts();
    } catch (err: any) {
      alert(err.message || 'Failed to create alert');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePriceAlert(id);
      loadAlerts();
    } catch (e) {}
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800 pb-4">
        <div>
          <h2 className="font-sans font-extrabold text-2xl text-[#0F172A] dark:text-slate-100 tracking-tight">
            Price Alerts Manager
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Set custom price threshold targets that override statistical distributions to trigger instant anomaly score boosts.
          </p>
        </div>
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#EFF6FF] text-[#2962FF] text-xs font-mono font-bold">
          <Bell className="w-4 h-4 text-[#2962FF]" />
          <span>{alerts.length} Active Targets</span>
        </div>
      </div>

      {/* Alert Creation Form */}
      <div className="ledger-card-style p-6 shadow-sm">
        <h3 className="font-sans font-bold text-base text-[#0F172A] dark:text-slate-100 mb-4">
          Create New Price Target Alert
        </h3>

        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#64748B] mb-1">Select Stock</label>
            <select
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="w-full bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-[#0F172A] dark:text-slate-100 font-mono focus:outline-none focus:border-[#2962FF]"
            >
              {watchlistItems.map(w => (
                <option key={w.symbol} value={w.symbol}>
                  {w.symbol} (${w.price.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-[#64748B] mb-1">Condition</label>
            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value as 'ABOVE' | 'BELOW')}
              className="w-full bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-[#0F172A] dark:text-slate-100 font-mono focus:outline-none focus:border-[#2962FF]"
            >
              <option value="ABOVE">Price Rises Above (≥)</option>
              <option value="BELOW">Price Drops Below (≤)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-[#64748B] mb-1">Target Price ($)</label>
            <input
              type="number"
              step="0.1"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="e.g. 3600.00"
              className="w-full bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-[#0F172A] dark:text-slate-100 font-mono focus:outline-none focus:border-[#2962FF]"
              required
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary-blue w-full py-2 text-xs flex items-center justify-center space-x-1.5 shadow-sm disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{loading ? 'Creating...' : 'Set Target'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Active Alerts List */}
      <div className="ledger-card-style p-6 shadow-sm space-y-4">
        <h3 className="font-sans font-bold text-base text-[#0F172A] dark:text-slate-100 border-b border-[#E2E8F0] dark:border-slate-800 pb-3">
          Active Price Targets ({alerts.length})
        </h3>

        {alerts.length > 0 ? (
          <div className="divide-y divide-[#E2E8F0] dark:divide-slate-800">
            {alerts.map((a) => (
              <div key={a.id} className="py-3 flex items-center justify-between font-mono text-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] text-[#2962FF] flex items-center justify-center font-bold">
                    {a.symbol.substring(0, 3)}
                  </div>
                  <div>
                    <span className="font-extrabold text-sm text-[#0F172A] dark:text-slate-100">{a.symbol}</span>
                    <p className="text-[11px] text-[#64748B]">
                      Alert when price crosses <strong className="text-[#2962FF]">{a.direction} ${a.targetPrice.toFixed(2)}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    a.triggered ? 'bg-amber-100 text-amber-900' : 'bg-[#ECFDF5] text-[#10B981]'
                  }`}>
                    {a.triggered ? 'TRIGGERED' : 'MONITORING'}
                  </span>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-[#64748B] hover:text-[#EF4444] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#64748B] italic py-4 text-center">
            No active custom price alerts set. Use the form above to set target alerts for watched symbols.
          </p>
        )}
      </div>
    </div>
  );
};
