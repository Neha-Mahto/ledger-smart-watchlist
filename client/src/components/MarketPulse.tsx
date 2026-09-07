import React from 'react';
import { WatchlistItemData } from '../types';

interface MarketPulseProps {
  items: WatchlistItemData[];
}

export const MarketPulse: React.FC<MarketPulseProps> = ({ items }) => {
  if (items.length === 0) return null;

  const avgWatchlistMove = items.reduce((sum, item) => sum + item.changePercent, 0) / items.length;
  const benchmarkMove = 0.42;
  const isOutperforming = avgWatchlistMove >= benchmarkMove;
  const diff = avgWatchlistMove - benchmarkMove;

  return (
    <div className="broadsheet-panel rounded-xl p-3.5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center space-x-3 font-sans">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-serif font-bold text-[#18222F] dark:text-slate-100">Market Pulse</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
              Synthetic Benchmark (Nifty 50)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Your watchlist avg move ({avgWatchlistMove >= 0 ? '+' : ''}{avgWatchlistMove.toFixed(2)}%) is{' '}
            <strong className={isOutperforming ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-red-700 dark:text-red-400 font-semibold'}>
              {isOutperforming ? `ahead of benchmark by +${diff.toFixed(2)}%` : `trailing benchmark by ${diff.toFixed(2)}%`}
            </strong>
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3 text-xs font-mono tabular-nums">
        <div className="bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded border border-slate-200 dark:border-slate-700">
          <span className="text-slate-500 mr-1 font-sans">Watchlist Avg:</span>
          <span className={avgWatchlistMove >= 0 ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-red-700 dark:text-red-400 font-bold'}>
            {avgWatchlistMove >= 0 ? '+' : ''}{avgWatchlistMove.toFixed(2)}%
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded border border-slate-200 dark:border-slate-700">
          <span className="text-slate-500 mr-1 font-sans">Benchmark:</span>
          <span className="text-slate-900 dark:text-slate-100 font-bold">+{benchmarkMove.toFixed(2)}%</span>
        </div>
      </div>
    </div>
  );
};
