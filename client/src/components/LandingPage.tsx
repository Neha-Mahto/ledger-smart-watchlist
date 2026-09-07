import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { ArrowRight, Sparkles, TrendingUp, ShieldAlert, CheckCircle2, Zap, Activity } from 'lucide-react';
import { fetchSymbolChartData } from '../services/api';

interface LandingPageProps {
  onLaunchApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp }) => {
  const [demoTimeframe, setDemoTimeframe] = useState<'1D' | '1W' | '1M'>('1D');
  const [chartData, setChartData] = useState<Array<{ time: string; price: number }>>([]);

  useEffect(() => {
    fetchSymbolChartData('TCS', demoTimeframe)
      .then(res => setChartData(res.points))
      .catch(() => {
        setChartData([
          { time: '9:30', price: 3500 },
          { time: '11:00', price: 3520 },
          { time: '12:30', price: 3510 },
          { time: '14:00', price: 3565 },
          { time: '15:30', price: 3580 }
        ]);
      });
  }, [demoTimeframe]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans flex flex-col selection:bg-[#EFF6FF] selection:text-[#2962FF]">
      {/* 1. Top Landing Navigation Bar */}
      <nav className="border-b border-[#E2E8F0] bg-white/90 backdrop-blur-md px-6 lg:px-12 py-4 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#2962FF] flex items-center justify-center shadow-md shadow-[#2962FF]/20">
            <Activity className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-sans font-extrabold text-2xl text-[#0F172A] tracking-tight">Ledger</span>
            <span className="bg-[#ECFDF5] text-[#10B981] border border-emerald-200 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full uppercase">
              Smart Market Watchlist
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={onLaunchApp}
            className="text-xs font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            Log In
          </button>
          <button
            onClick={onLaunchApp}
            className="btn-primary-blue inline-flex items-center space-x-2 px-5 py-2.5 text-xs font-bold shadow-md shadow-[#2962FF]/20"
          >
            <span>Launch Ledger</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* 2. Stunning Hero Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Thesis & Headline */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] border border-blue-200 text-[#2962FF] text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>Attention-Protecting Delta Engine</span>
          </div>

          <h1 className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.12] text-[#0F172A] tracking-tight">
            Stop scanning flickering prices. <br />
            <span className="text-[#2962FF] font-extrabold">Start noticing what matters.</span>
          </h1>

          <p className="text-base text-[#64748B] leading-relaxed max-w-xl font-sans">
            Traditional watchlists bombard investors with raw price changes and noise. Ledger’s statistical delta engine filters market moves relative to each stock’s own realized volatility, compiling changes into a ranked digest and sector momentum stories.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={onLaunchApp}
              className="btn-primary-blue inline-flex items-center justify-center space-x-2 px-7 py-3.5 text-sm font-extrabold shadow-lg shadow-[#2962FF]/25 hover:scale-[1.01]"
            >
              <span>Launch Ledger Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center justify-center space-x-2 text-xs font-mono text-[#64748B]">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span>No Credit Card Required</span>
            </div>
          </div>
        </div>

        {/* Right Live Mock Preview Panel */}
        <div className="lg:col-span-6">
          <div className="ledger-card-style p-6 shadow-xl border-l-4 border-l-[#2962FF] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center space-x-2">
                <span className="font-sans font-extrabold text-lg text-[#0F172A]">Since You Last Checked</span>
                <span className="bg-[#2962FF] text-white text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                  3 NEW
                </span>
              </div>
              <span className="text-xs font-mono text-[#64748B]">Server Snapshot</span>
            </div>

            {/* Mock Anomaly Items */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-extrabold text-sm text-[#0F172A]">TCS</span>
                    <span className="text-[10px] font-mono bg-white text-[#64748B] px-1.5 py-0.2 rounded border">IT Sector</span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-0.5 font-mono">
                    2.4× baseline volatility swing • Volume surge 3.1× avg
                  </p>
                </div>
                <div className="text-right font-mono">
                  <span className="text-xs font-bold text-[#10B981] block">+2.15%</span>
                  <span className="text-[10px] font-bold text-[#2962FF] bg-[#EFF6FF] border border-blue-200 px-2 py-0.5 rounded-full">Score 88</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-extrabold text-sm text-[#0F172A]">ONGC</span>
                    <span className="text-[10px] font-mono bg-white text-[#64748B] px-1.5 py-0.2 rounded border">Energy</span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-0.5 font-mono">
                    Data feed stale: no updates for 14s (Feed Starvation)
                  </p>
                </div>
                <div className="text-right font-mono">
                  <span className="text-xs font-bold text-[#EF4444] block">-0.40%</span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">Score 65</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[#64748B] italic pt-1 text-center font-sans">
              Server-persisted snapshot ensures consistent digest baselines across all devices.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Plain-Language Delta Engine Breakdown */}
      <section className="border-t border-[#E2E8F0] bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mb-12">
            <h2 className="font-sans font-extrabold text-3xl text-[#0F172A] tracking-tight mb-3">
              How Ledger decides what demands your notice
            </h2>
            <p className="text-sm text-[#64748B]">
              Instead of arbitrary percentage alerts, Ledger's delta engine evaluates ticks using statistical z-scores and volume surges tailored to each symbol.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2 hover:border-[#2962FF] transition-all">
              <span className="font-mono text-xs font-bold text-[#2962FF] uppercase">01 • Statistical Z-Scores</span>
              <h3 className="font-sans font-bold text-lg text-[#0F172A]">Volatility-Relative Moves</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Compares price shifts against a stock’s own realized volatility rather than an arbitrary fixed percentage.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2 hover:border-[#2962FF] transition-all">
              <span className="font-mono text-xs font-bold text-[#10B981] uppercase">02 • Volume Surges</span>
              <h3 className="font-sans font-bold text-lg text-[#0F172A]">Institutional Accumulation</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Measures trading volume spikes relative to 30-period simple moving averages to spot momentum bursts.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2 hover:border-[#2962FF] transition-all">
              <span className="font-mono text-xs font-bold text-[#2962FF] uppercase">03 • Range Breaches</span>
              <h3 className="font-sans font-bold text-lg text-[#0F172A]">24-Hour Range Breaks</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Automatically flags when prices breakout above previous day highs or breakdown below day lows.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2 hover:border-[#2962FF] transition-all">
              <span className="font-mono text-xs font-bold text-[#10B981] uppercase">04 • Custom Alerts</span>
              <h3 className="font-sans font-bold text-lg text-[#0F172A]">User Price Thresholds</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Your target prices always trigger high-attention scores regardless of statistical distributions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Real Interactive Chart Demo */}
      <section className="py-16 max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <div className="ledger-card-style p-6 lg:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
            <div>
              <span className="text-xs font-mono text-[#64748B] uppercase font-bold">Interactive Analytics Demo</span>
              <h3 className="font-sans font-extrabold text-2xl text-[#0F172A]">TCS — Tata Consultancy Services</h3>
            </div>

            {/* Timeframe Toggles */}
            <div className="flex items-center space-x-1 bg-[#F8FAFC] p-1 rounded-xl border border-[#E2E8F0] font-mono text-xs">
              {(['1D', '1W', '1M'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setDemoTimeframe(tf)}
                  className={`px-3.5 py-1.5 rounded-lg transition-all font-bold ${
                    demoTimeframe === tf ? 'bg-[#2962FF] text-white shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Recharts Area Chart */}
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="landingChartColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2962FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2962FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} domain={['auto', 'auto']} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(val: any) => [`$${Number(val).toFixed(2)}`, 'Price']}
                />
                <Area type="monotone" dataKey="price" stroke="#2962FF" strokeWidth={2.5} fillOpacity={1} fill="url(#landingChartColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* 5. Minimal Honest Footer */}
      <footer className="mt-auto border-t border-[#E2E8F0] bg-white py-8 px-6 lg:px-12 text-xs font-mono text-[#64748B]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-sm text-[#0F172A]">Ledger</span>
            <span>— Smart Market Watchlist & Delta Engine</span>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hover:text-[#2962FF] underline"
          >
            Back to Top ↑
          </button>
        </div>
      </footer>
    </div>
  );
};
