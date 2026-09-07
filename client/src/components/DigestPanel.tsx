import React from 'react';
import { Sparkles, CheckCheck, TrendingUp, TrendingDown, Layers, Clock } from 'lucide-react';
import { DigestSummary } from '../types';
import { AttentionRatingWidget } from './AttentionRatingWidget';

interface DigestPanelProps {
  digest: DigestSummary | null;
  onAcknowledge: () => void;
  onSelectSymbol: (symbol: string) => void;
  isAcknowledging: boolean;
}

export const DigestPanel: React.FC<DigestPanelProps> = ({
  digest,
  onAcknowledge,
  onSelectSymbol,
  isAcknowledging
}) => {
  if (!digest || (digest.items.length === 0 && digest.stories.length === 0)) {
    return (
      <div className="groww-card p-6 mb-6 text-center">
        <h2 className="font-sans font-extrabold text-xl text-[#111827] dark:text-slate-100 mb-1">Since You Last Checked</h2>
        <p className="text-xs text-[#7C7E8C] font-sans max-w-lg mx-auto">
          All watched stocks are trading within baseline parameters. No statistical volatility anomalies, volume surges, or range breaks detected.
        </p>
      </div>
    );
  }

  return (
    <div className="groww-card p-6 mb-6 shadow-sm relative transition-all border-l-4 border-l-[#00D09C]">
      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-[#EBECEF] dark:border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-[#E6F9F5] text-[#00B386]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-sans font-extrabold text-xl text-[#111827] dark:text-slate-100 tracking-tight">Since You Last Checked</h2>
              {digest.unreadCount > 0 && (
                <span className="bg-[#00D09C] text-white text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                  {digest.unreadCount} NEW
                </span>
              )}
            </div>
            <p className="text-xs text-[#7C7E8C] font-sans mt-0.5">
              Ranked statistical change digest computed from server-side snapshot
            </p>
          </div>
        </div>

        {/* Acknowledge Snapshot Button */}
        <button
          onClick={onAcknowledge}
          disabled={isAcknowledging}
          className="groww-btn-mint flex items-center space-x-2 px-4 py-2 text-xs shadow-sm disabled:opacity-50"
        >
          <CheckCheck className="w-4 h-4 stroke-[2.5]" />
          <span>{isAcknowledging ? 'Saving Snapshot...' : 'Acknowledge Digest'}</span>
        </button>
      </div>

      {/* Correlated Sector Stories */}
      {digest.stories && digest.stories.length > 0 && (
        <div className="mb-4 space-y-2">
          {digest.stories.map((story, idx) => (
            <div
              key={idx}
              className="bg-[#E6F9F5] dark:bg-emerald-950/40 border border-[#00D09C]/40 rounded-xl p-3.5 flex items-start space-x-3"
            >
              <div className="p-1 rounded-lg bg-[#00D09C] text-white mt-0.5">
                <Layers className="w-4 h-4" />
              </div>
              <div className="flex-1 font-sans">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-extrabold text-[#00B386] uppercase tracking-wider">
                    SECTOR STORY • {story.sector}
                  </span>
                  <span className="text-[10px] font-mono bg-[#00D09C] text-white px-2 py-0.2 rounded-full font-bold">
                    Score: {story.maxAttentionScore}
                  </span>
                </div>
                <p className="text-xs text-[#111827] dark:text-slate-100 mt-1 font-medium leading-relaxed">
                  {story.storyText}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ranked Anomaly List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {digest.items.slice(0, 4).map((item) => {
          const isPos = item.changePercent >= 0;
          return (
            <div
              key={item.symbol}
              onClick={() => onSelectSymbol(item.symbol)}
              className="bg-[#F8F9FA] dark:bg-slate-950/60 border border-[#EBECEF] dark:border-slate-800 hover:border-[#00D09C] rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-[#00D09C]/10 text-[#00B386] flex items-center justify-center font-mono font-bold text-xs">
                  {item.symbol.substring(0, 3)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-sm text-[#111827] dark:text-slate-100 group-hover:text-[#00D09C] transition-colors">
                      {item.symbol}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white text-[#7C7E8C] border border-[#EBECEF]">
                      {item.sector}
                    </span>
                    {item.isStale && (
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-[#FDE8E8] text-[#EB5757] border border-red-200 flex items-center space-x-1 font-bold">
                        <Clock className="w-3 h-3" />
                        <span>STALE ({item.staleAgeSec}s)</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#7C7E8C] font-mono line-clamp-1 mt-0.5">
                    {item.explainableReason}
                  </p>
                </div>
              </div>

              <div className="text-right flex flex-col items-end">
                <div className="flex items-center space-x-1 font-mono font-bold text-xs tabular-nums">
                  <span className="text-[#111827] dark:text-slate-100">${item.price.toFixed(2)}</span>
                  <span className={`flex items-center text-[11px] px-1.5 py-0.2 rounded-md ${
                    isPos ? 'text-[#00B386] bg-[#E6F9F5]' : 'text-[#EB5757] bg-[#FDE8E8]'
                  }`}>
                    {isPos ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                    {isPos ? '+' : ''}{item.changePercent.toFixed(2)}%
                  </span>
                </div>
                <div className="mt-1">
                  <AttentionRatingWidget
                    score={item.attentionScore}
                    signals={item.signals}
                    explainableReason={item.explainableReason}
                    variant="compact"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
