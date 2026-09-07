import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface MarketIndexItem {
  name: string;
  value: number;
  changeAmount: number;
  changePercent: number;
}

export const DEMO_INDICES: MarketIndexItem[] = [
  { name: 'NIFTY 50', value: 24850.40, changeAmount: 118.25, changePercent: 0.48 },
  { name: 'SENSEX', value: 81200.15, changeAmount: 420.10, changePercent: 0.52 },
  { name: 'NIFTY BANK', value: 51340.80, changeAmount: 178.60, changePercent: 0.35 },
  { name: 'NIFTY IT', value: 42150.90, changeAmount: 512.40, changePercent: 1.23 }
];

export const MarketIndicesBanner: React.FC = () => {
  return (
    <div className="w-full bg-white dark:bg-slate-900 border-b border-[#EBECEF] dark:border-slate-800 px-4 lg:px-8 py-2.5 overflow-x-auto no-scrollbar transition-colors">
      <div className="flex items-center space-x-3 max-w-7xl mx-auto min-w-max">
        <span className="text-[11px] font-bold text-[#7C7E8C] font-mono uppercase tracking-wider pr-1">
          INDICES
        </span>

        {DEMO_INDICES.map((idx) => {
          const isPos = idx.changePercent >= 0;
          return (
            <div
              key={idx.name}
              className="flex items-center space-x-3 px-3 py-1.5 rounded-xl border border-[#EBECEF] dark:border-slate-800 bg-[#F8F9FA] dark:bg-slate-950/60 hover:border-[#00D09C] transition-all cursor-pointer group shadow-2xs"
            >
              <span className="font-sans font-extrabold text-xs text-[#111827] dark:text-slate-100 group-hover:text-[#00D09C]">
                {idx.name}
              </span>

              <div className="flex items-center space-x-1.5 font-mono text-xs tabular-nums">
                <span className="font-bold text-[#111827] dark:text-slate-100">
                  {idx.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className={`flex items-center font-bold text-[11px] px-1.5 py-0.2 rounded-md ${
                  isPos ? 'text-[#00D09C] bg-[#E6F9F5] dark:bg-emerald-950/50' : 'text-[#EB5757] bg-[#FDE8E8] dark:bg-red-950/50'
                }`}>
                  {isPos ? '+' : ''}{idx.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
