import React, { useState } from 'react';
import { AnomalySignal } from '../types';

interface AttentionRatingWidgetProps {
  score: number;
  signals?: AnomalySignal[];
  explainableReason?: string;
  variant?: 'compact' | 'full';
}

export const AttentionRatingWidget: React.FC<AttentionRatingWidgetProps> = ({
  score,
  signals = [],
  explainableReason,
  variant = 'compact'
}) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  let label = 'Quiet';
  let badgeBg = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  let fillPct = Math.min(100, Math.max(5, score));
  let barColor = 'bg-slate-400';

  if (score >= 61) {
    label = 'Urgent Attention';
    badgeBg = 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-700/60';
    barColor = 'bg-amber-600';
  } else if (score >= 31) {
    label = 'Noticed';
    badgeBg = 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    barColor = 'bg-blue-600';
  }

  if (variant === 'compact') {
    return (
      <div
        className="relative inline-block"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className={`inline-flex items-center space-x-2 px-2.5 py-1 rounded-md border font-mono text-xs cursor-help transition-all ${badgeBg}`}>
          <div className="w-10 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className={`h-full ${barColor} transition-all duration-300`} style={{ width: `${fillPct}%` }} />
          </div>
          <span className="font-bold">{score}</span>
          <span className="text-[10px] font-sans font-semibold uppercase">{label}</span>
        </div>

        {/* Hover Signal Breakdown Tooltip */}
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl text-xs z-40 animate-fadeIn pointer-events-none">
            <div className="flex justify-between items-center pb-1.5 mb-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="font-sans font-bold text-slate-900 dark:text-slate-100">Attention Rating Breakdown</span>
              <span className="font-mono font-bold text-amber-600">{score}/100</span>
            </div>
            <p className="font-sans text-[11px] text-slate-600 dark:text-slate-400 mb-2 leading-tight">
              {explainableReason || 'Statistical anomaly score calculated relative to rolling realized volatility.'}
            </p>
            {signals.length > 0 && (
              <div className="space-y-1">
                {signals.map((sig, idx) => (
                  <div key={idx} className="flex justify-between font-mono text-[10px] text-slate-700 dark:text-slate-300">
                    <span className="truncate pr-1">• {sig.type}</span>
                    <span className="font-bold text-amber-600">+{sig.scoreContrib}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Full Variant for Detail Inspector
  return (
    <div className={`p-4 rounded-xl border ${badgeBg} space-y-3`}>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">Data Urgency Rating</span>
          <h4 className="font-display font-bold text-lg text-slate-900 dark:text-slate-100">{label}</h4>
        </div>
        <div className="text-right">
          <span className="font-mono text-2xl font-bold text-slate-900 dark:text-slate-100">{score}</span>
          <span className="text-xs font-mono text-slate-500"> / 100</span>
        </div>
      </div>

      {/* Dial Gauge Bar */}
      <div className="space-y-1">
        <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-300/60 dark:border-slate-700">
          <div className={`h-full ${barColor} transition-all duration-500`} style={{ width: `${fillPct}%` }} />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400 px-0.5">
          <span>Quiet (0)</span>
          <span>Noticed (35)</span>
          <span>Urgent (65+)</span>
        </div>
      </div>

      {/* Signal Breakdown List */}
      {signals.length > 0 && (
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 space-y-1.5">
          <span className="text-[11px] font-sans font-semibold text-slate-700 dark:text-slate-300">Contributing Signals:</span>
          {signals.map((sig, idx) => (
            <div key={idx} className="flex justify-between items-center font-mono text-xs bg-white/80 dark:bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-200/80 dark:border-slate-800">
              <span className="text-slate-800 dark:text-slate-200">{sig.detail}</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">+{sig.scoreContrib}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
