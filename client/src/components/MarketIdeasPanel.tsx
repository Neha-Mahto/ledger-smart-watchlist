import React, { useState } from 'react';
import { ChevronDown, Video, Clock, Flame, Tag, ThumbsUp, MessageSquare, ExternalLink, Sparkles } from 'lucide-react';

export interface IdeaItem {
  id: string;
  title: string;
  symbolTag: string;
  author: string;
  timeAgo: string;
  category: string;
  previewImageText: string;
  previewBg: string;
  snippet: string;
  likesCount: number;
  commentsCount: number;
  confidenceScore?: number;
}

export const DEMO_IDEAS: IdeaItem[] = [
  {
    id: 'idea-1',
    title: "You Don't Have to Enter a Trade to Make a Trading Mistake",
    symbolTag: 'MARKET:PSYCHOLOGY',
    author: 'TradingMindset',
    timeAgo: '2h ago',
    category: 'Educational',
    previewImageText: "YOU DON'T HAVE TO ENTER A TRADE TO MAKE A MISTAKE",
    previewBg: 'bg-gradient-to-br from-slate-900 via-slate-800 to-black text-amber-400',
    snippet: 'Most traders think a trading mistake begins when they click Buy or Sell. But some of the most serious mistakes happen before you even place an order — poor position sizing and impulse watching.',
    likesCount: 142,
    commentsCount: 28,
    confidenceScore: 88
  },
  {
    id: 'idea-2',
    title: 'EXICOM - Weekly Analysis - 10% to 44.45% UPSIDE Potential',
    symbolTag: 'NSE:EXICOM',
    author: 'ChartMaster_IN',
    timeAgo: '4h ago',
    category: 'Breakout',
    previewImageText: 'Cup & Handle Breakout Continuation (Weekly)',
    previewBg: 'bg-gradient-to-br from-blue-900 via-slate-900 to-emerald-950 text-emerald-400',
    snippet: 'NSE:EXICOM Exicom Tele-Systems Ltd. is forming a large Cup & Handle Breakout continuation structure on the weekly chart. Volume surge 2.8x trailing average.',
    likesCount: 98,
    commentsCount: 19,
    confidenceScore: 92
  },
  {
    id: 'idea-3',
    title: 'BSE Ltd - Waiting Is Over? | Weekly Breakout Setup',
    symbolTag: 'BSE:BSE',
    author: 'BreakoutTraders',
    timeAgo: '6h ago',
    category: 'Technical Analysis',
    previewImageText: 'Waiting is Over — Channel Support & Surge',
    previewBg: 'bg-gradient-to-br from-purple-950 via-slate-900 to-blue-950 text-sky-400',
    snippet: 'BSE Ltd is currently approaching a crucial long-term support and trendline zone on the weekly chart. Interestingly, the delta engine detected multi-period range break.',
    likesCount: 215,
    commentsCount: 44,
    confidenceScore: 85
  },
  {
    id: 'idea-4',
    title: 'TCS & IT Sector - Volatility Burst & Multi-Year Range Break',
    symbolTag: 'NSE:TCS',
    author: 'DeltaEngine_Official',
    timeAgo: '1h ago',
    category: 'Delta Engine Signal',
    previewImageText: 'IT Sector Co-Movement: TCS + INFY + WIPRO (+2.1%)',
    previewBg: 'bg-gradient-to-br from-amber-950 via-slate-900 to-amber-900 text-amber-300',
    snippet: 'Statistical Z-Score hit 2.8x baseline realized volatility with volume surge 3.1x over 30-period SMA. High probability sector co-movement detected.',
    likesCount: 310,
    commentsCount: 52,
    confidenceScore: 96
  }
];

export const MarketIdeasPanel: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [ideas, setIdeas] = useState<IdeaItem[]>(DEMO_IDEAS);

  return (
    <div className="mb-10 animate-fadeIn">
      {/* TradingView Breadcrumbs */}
      <div className="flex items-center space-x-2 text-xs font-sans text-tv-text-muted mb-2">
        <span className="hover:text-tv-blue cursor-pointer">Markets</span>
        <span>/</span>
        <span className="hover:text-tv-blue cursor-pointer">India</span>
        <span>/</span>
        <span className="hover:text-tv-blue cursor-pointer">Stocks</span>
        <span>/</span>
        <span className="text-tv-text font-medium">Ideas</span>
      </div>

      {/* Hero Dropdown Header (Matching TradingView Screenshot) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 border-b border-tv-border pb-5">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-lg font-bold text-tv-text hover:text-tv-blue cursor-pointer mb-1 group">
            <span className="text-xl">🇮🇳</span>
            <span className="font-display font-bold">Indian stocks</span>
            <ChevronDown className="w-4 h-4 text-tv-text-muted group-hover:text-tv-blue" />
          </div>

          <div className="flex items-center space-x-2">
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-tv-text">
              Ideas
            </h2>
            <ChevronDown className="w-7 h-7 text-tv-text-muted cursor-pointer hover:text-tv-blue mt-2" />
          </div>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center space-x-2 font-sans text-xs">
          <button className="flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-tv-border hover:border-tv-border-hover bg-tv-surface text-tv-text font-medium transition-all shadow-sm">
            <Video className="w-4 h-4 text-tv-text-muted" />
            <span>Videos only</span>
          </button>
          <button className="p-2 rounded-lg border border-tv-border hover:border-tv-border-hover bg-tv-surface text-tv-text-muted hover:text-tv-text transition-all">
            <Clock className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg border border-tv-border hover:border-tv-border-hover bg-tv-surface text-tv-text-muted hover:text-tv-text transition-all">
            <Flame className="w-4 h-4 text-amber-500" />
          </button>
        </div>
      </div>

      {/* Idea Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ideas.map((idea) => (
          <div
            key={idea.id}
            className="tv-card-style rounded-2xl overflow-hidden transition-all duration-300 flex flex-col group cursor-pointer"
          >
            {/* Chart Preview Thumbnail */}
            <div className={`h-48 ${idea.previewBg} p-5 flex flex-col justify-between relative overflow-hidden`}>
              <div className="flex justify-between items-center z-10">
                <span className="bg-black/60 backdrop-blur-md text-white font-mono text-[10px] font-semibold px-2 py-0.5 rounded border border-white/20">
                  {idea.symbolTag}
                </span>
                {idea.confidenceScore && (
                  <span className="bg-tv-blue text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{idea.confidenceScore}% Signal</span>
                  </span>
                )}
              </div>

              <div className="z-10">
                <h4 className="font-display font-extrabold text-base leading-tight text-white drop-shadow-md">
                  {idea.previewImageText}
                </h4>
              </div>

              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
            </div>

            {/* Content Body */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-tv-text group-hover:text-tv-blue transition-colors line-clamp-2 mb-2 leading-snug">
                  {idea.title}
                </h3>
                <p className="text-xs font-sans text-tv-text-muted line-clamp-3 leading-relaxed mb-4">
                  {idea.snippet}
                </p>
              </div>

              {/* Author & Footer Metadata */}
              <div className="pt-3 border-t border-tv-border flex items-center justify-between text-xs font-sans text-tv-text-muted">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-tv-blue text-white font-bold text-[10px] flex items-center justify-center">
                    {idea.author.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="font-medium text-tv-text text-[11px]">{idea.author}</span>
                  <span>•</span>
                  <span className="text-[11px]">{idea.timeAgo}</span>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <span className="flex items-center space-x-1 hover:text-tv-blue">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{idea.likesCount}</span>
                  </span>
                  <span className="flex items-center space-x-1 hover:text-tv-blue">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{idea.commentsCount}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
