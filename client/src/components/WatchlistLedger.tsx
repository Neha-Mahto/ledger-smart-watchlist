import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';
import { Trash2, Clock, ChevronRight, Plus, LayoutGrid, TableProperties } from 'lucide-react';
import { WatchlistItemData } from '../types';
import { AttentionRatingWidget } from './AttentionRatingWidget';

interface WatchlistLedgerProps {
  items: WatchlistItemData[];
  onSelectSymbol: (symbol: string) => void;
  onRemoveSymbol: (symbol: string) => void;
  onOpenAddModal: () => void;
}

export const WatchlistLedger: React.FC<WatchlistLedgerProps> = ({
  items,
  onSelectSymbol,
  onRemoveSymbol,
  onOpenAddModal
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  if (items.length === 0) {
    return (
      <div className="groww-card rounded-2xl p-10 text-center">
        <h3 className="font-sans font-bold text-xl text-[#111827] dark:text-slate-100 mb-1">
          Your Watchlist is Empty
        </h3>
        <p className="text-xs text-[#7C7E8C] max-w-sm mx-auto mb-4 font-sans">
          Add market symbols to monitor statistical price moves, volume surges, and 52-week range breaks.
        </p>
        <button
          onClick={onOpenAddModal}
          className="groww-btn-mint inline-flex items-center space-x-2 px-5 py-2.5 shadow-md shadow-[#00D09C]/20"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Stock to Watchlist</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Groww Section Bar & View Mode Switcher */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-sans font-extrabold text-xl text-[#111827] dark:text-slate-100 tracking-tight">
            Market Watchlist ({items.length})
          </h3>
          <p className="text-xs text-[#7C7E8C] font-sans">
            Real-time feed with 52-week ranges and statistical change scores
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Grid / Table View Switcher */}
          <div className="flex items-center space-x-1 bg-white dark:bg-slate-900 border border-[#EBECEF] dark:border-slate-800 p-1 rounded-xl shadow-2xs font-sans text-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-[#00D09C] text-white font-bold shadow-sm'
                  : 'text-[#7C7E8C] hover:text-[#111827] dark:hover:text-slate-100'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'table'
                  ? 'bg-[#00D09C] text-white font-bold shadow-sm'
                  : 'text-[#7C7E8C] hover:text-[#111827] dark:hover:text-slate-100'
              }`}
            >
              <TableProperties className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={onOpenAddModal}
            className="groww-btn-mint hidden sm:flex items-center space-x-1.5 px-4 py-2 text-xs shadow-sm"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Stock</span>
          </button>
        </div>
      </div>

      {/* 1. GROWW STOCK CARDS GRID VIEW */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => {
            const isPos = item.changePercent >= 0;
            const dayLow = item.dayLow || item.price * 0.98;
            const dayHigh = item.dayHigh || item.price * 1.02;
            const rangePct = Math.min(100, Math.max(0, ((item.price - dayLow) / (dayHigh - dayLow || 1)) * 100));
            const sparkData = (item.sparkline && item.sparkline.length > 0 ? item.sparkline : [item.price, item.price]).map((val, idx) => ({ i: idx, val }));

            return (
              <div
                key={item.symbol}
                onClick={() => onSelectSymbol(item.symbol)}
                className="groww-card p-5 flex flex-col justify-between cursor-pointer transition-all duration-300 group"
              >
                {/* Top Header: Symbol Avatar Logo, Sector & Actions */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#00D09C]/10 dark:bg-emerald-950/60 border border-[#00D09C]/30 text-[#00B386] flex items-center justify-center font-mono font-extrabold text-sm group-hover:scale-105 transition-transform">
                      {item.symbol.substring(0, 3)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-sans font-extrabold text-base text-[#111827] dark:text-slate-100 group-hover:text-[#00D09C] transition-colors">
                          {item.symbol}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F8F9FA] dark:bg-slate-800 text-[#7C7E8C] border border-[#EBECEF] dark:border-slate-700">
                          {item.sector}
                        </span>
                      </div>
                      <p className="text-xs text-[#7C7E8C] font-sans line-clamp-1">
                        {item.name}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveSymbol(item.symbol);
                    }}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-[#7C7E8C] hover:text-[#EB5757] transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove stock"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Price & Change Pill */}
                <div className="my-2 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#7C7E8C]">Market Price</span>
                    <div className="font-mono font-extrabold text-xl text-[#111827] dark:text-slate-100 tabular-nums">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>

                  <span className={`inline-flex items-center font-mono font-bold text-xs px-2.5 py-1 rounded-xl ${
                    isPos ? 'text-[#00B386] bg-[#E6F9F5] dark:bg-emerald-950/60' : 'text-[#EB5757] bg-[#FDE8E8] dark:bg-red-950/60'
                  }`}>
                    {isPos ? '+' : ''}{item.changePercent.toFixed(2)}%
                  </span>
                </div>

                {/* Day Range Progress Bar */}
                <div className="my-2 space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-[#7C7E8C] tabular-nums">
                    <span>Low: ${dayLow.toFixed(1)}</span>
                    <span>High: ${dayHigh.toFixed(1)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#F8F9FA] dark:bg-slate-800 rounded-full overflow-hidden border border-[#EBECEF] dark:border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-[#00D09C] to-[#00B386] rounded-full transition-all duration-300"
                      style={{ width: `${rangePct}%` }}
                    />
                  </div>
                </div>

                {/* Bottom Footer: Attention Rating & Mini Sparkline */}
                <div className="pt-3 border-t border-[#EBECEF] dark:border-slate-800 flex items-center justify-between mt-2">
                  <AttentionRatingWidget
                    score={item.attentionScore}
                    signals={item.signals}
                    explainableReason={item.explainableReason}
                    variant="compact"
                  />

                  <div className="w-20 h-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sparkData}>
                        <Line
                          type="monotone"
                          dataKey="val"
                          stroke={isPos ? '#00D09C' : '#EB5757'}
                          strokeWidth={1.5}
                          dot={false}
                          isAnimationActive={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* 2. DENSE LEDGER TABLE VIEW */
        <div className="groww-card overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#EBECEF] dark:border-slate-800 text-[11px] font-mono uppercase text-[#7C7E8C] bg-[#F8F9FA] dark:bg-slate-950/40">
                  <th className="py-3.5 px-4 font-bold">Stock & Sector</th>
                  <th className="py-3.5 px-4 text-right font-bold">Price ($)</th>
                  <th className="py-3.5 px-4 text-right font-bold">24h Change (%)</th>
                  <th className="py-3.5 px-4 hidden md:table-cell font-bold">Day Range (Low / High)</th>
                  <th className="py-3.5 px-4 text-center font-bold">Attention Score</th>
                  <th className="py-3.5 px-4 hidden lg:table-cell text-center font-bold">Sparkline</th>
                  <th className="py-3.5 px-4 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBECEF]/80 dark:divide-slate-800/80 text-xs font-sans">
                {items.map((item) => {
                  const isPos = item.changePercent >= 0;
                  const dayLow = item.dayLow || item.price * 0.98;
                  const dayHigh = item.dayHigh || item.price * 1.02;
                  const rangePct = Math.min(100, Math.max(0, ((item.price - dayLow) / (dayHigh - dayLow || 1)) * 100));
                  const sparkData = (item.sparkline && item.sparkline.length > 0 ? item.sparkline : [item.price, item.price]).map((val, idx) => ({ i: idx, val }));

                  return (
                    <tr
                      key={item.symbol}
                      onClick={() => onSelectSymbol(item.symbol)}
                      className="hover:bg-[#F8F9FA] dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-xl bg-[#00D09C]/10 text-[#00B386] flex items-center justify-center font-mono font-bold text-xs">
                            {item.symbol.substring(0, 3)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-extrabold text-sm text-[#111827] dark:text-slate-100 group-hover:text-[#00D09C] transition-colors">
                                {item.symbol}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#F8F9FA] dark:bg-slate-800 text-[#7C7E8C] border">
                                {item.sector}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#7C7E8C] line-clamp-1">{item.name}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-sm text-[#111827] dark:text-slate-100 tabular-nums">
                        ${item.price.toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-xs tabular-nums">
                        <span className={`inline-block px-2.5 py-1 rounded-xl ${
                          isPos ? 'text-[#00B386] bg-[#E6F9F5]' : 'text-[#EB5757] bg-[#FDE8E8]'
                        }`}>
                          {isPos ? '+' : ''}{item.changePercent.toFixed(2)}%
                        </span>
                      </td>

                      <td className="py-3.5 px-4 hidden md:table-cell min-w-[160px]">
                        <div className="flex justify-between text-[10px] font-mono text-[#7C7E8C] mb-1 tabular-nums">
                          <span>${dayLow.toFixed(1)}</span>
                          <span>${dayHigh.toFixed(1)}</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#F8F9FA] dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#00D09C] rounded-full transition-all duration-300"
                            style={{ width: `${rangePct}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <AttentionRatingWidget
                          score={item.attentionScore}
                          signals={item.signals}
                          explainableReason={item.explainableReason}
                          variant="compact"
                        />
                      </td>

                      <td className="py-3.5 px-4 hidden lg:table-cell w-[110px]">
                        <div className="w-24 h-8 mx-auto">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sparkData}>
                              <Line
                                type="monotone"
                                dataKey="val"
                                stroke={isPos ? '#00D09C' : '#EB5757'}
                                strokeWidth={1.5}
                                dot={false}
                                isAnimationActive={false}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveSymbol(item.symbol);
                            }}
                            className="p-1.5 rounded hover:bg-red-50 text-[#7C7E8C] hover:text-[#EB5757] transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <ChevronRight className="w-4 h-4 text-[#7C7E8C] group-hover:text-[#00D09C] transition-colors" />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
