import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { Header } from './components/Header';
import { MarketIndicesBanner } from './components/MarketIndicesBanner';
import { DigestPanel } from './components/DigestPanel';
import { MarketPulse } from './components/MarketPulse';
import { WatchlistLedger } from './components/WatchlistLedger';
import { PriceAlertsManager } from './components/PriceAlertsManager';
import { SymbolDetailInspector } from './components/SymbolDetailInspector';
import { AddSymbolModal } from './components/AddSymbolModal';
import { CommandPalette } from './components/CommandPalette';
import { AuthModal } from './components/AuthModal';
import { WatchlistItemData, DigestSummary, AttentionEvaluation, SimulatedSymbolInfo } from './types';
import { loginUser, fetchWatchlist, fetchDigest, acknowledgeDigestSnapshot, addWatchlistSymbol, removeWatchlistSymbol, fetchAvailableSymbols } from './services/api';
import { getSocket } from './services/socket';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'app'>('landing');
  const [activeSection, setActiveSection] = useState<'dashboard' | 'watchlist' | 'alerts'>('dashboard');
  const [sortBy, setSortBy] = useState<'attention' | 'symbol' | 'change'>('attention');
  const [username, setUsername] = useState<string>(localStorage.getItem('ledger_username') || 'trader');
  const [watchlist, setWatchlist] = useState<WatchlistItemData[]>([]);
  const [availableSymbols, setAvailableSymbols] = useState<SimulatedSymbolInfo[]>([]);
  const [digest, setDigest] = useState<DigestSummary | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isAcknowledging, setIsAcknowledging] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  // Handle Theme Toggle on HTML root tag
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Initialize session identity & available symbols
  useEffect(() => {
    const initAuth = async () => {
      const existingToken = localStorage.getItem('ledger_token');
      if (!existingToken) {
        try {
          const authData = await loginUser('trader');
          localStorage.setItem('ledger_token', authData.token);
          localStorage.setItem('ledger_username', authData.user.username);
          setUsername(authData.user.username);
        } catch (e) {
          console.error('Initial auto-auth error:', e);
        }
      }
      loadInitialData();
    };
    initAuth();
    fetchAvailableSymbols().then(setAvailableSymbols).catch(() => {});
  }, []);

  const loadInitialData = async () => {
    try {
      const wl = await fetchWatchlist();
      setWatchlist(wl);
      const dg = await fetchDigest();
      setDigest(dg);
    } catch (e) {
      console.error('Data load error:', e);
    }
  };

  // Socket.IO Real-time Price Push Listener
  useEffect(() => {
    const socket = getSocket();

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    if (socket.connected) setIsConnected(true);

    const handleTick = (tickEval: AttentionEvaluation) => {
      setWatchlist(prevList => {
        return prevList.map(item => {
          if (item.symbol === tickEval.symbol) {
            return {
              ...item,
              price: tickEval.price,
              changePercent: tickEval.changePercent,
              attentionScore: tickEval.attentionScore,
              signals: tickEval.signals,
              explainableReason: tickEval.explainableReason,
              isStale: tickEval.isStale,
              staleAgeSec: tickEval.staleAgeSec,
              sparkline: tickEval.sparkline || item.sparkline,
              dayHigh: tickEval.dayHigh || item.dayHigh,
              dayLow: tickEval.dayLow || item.dayLow,
              prevClose: tickEval.prevClose || item.prevClose
            };
          }
          return item;
        });
      });
    };

    socket.on('price:tick', handleTick);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('price:tick', handleTick);
    };
  }, []);

  const handleAcknowledgeDigest = async () => {
    setIsAcknowledging(true);
    try {
      await acknowledgeDigestSnapshot();
      const updatedDigest = await fetchDigest();
      setDigest(updatedDigest);
    } catch (e) {
      console.error('Acknowledge failed:', e);
    } finally {
      setIsAcknowledging(false);
    }
  };

  const handleAddSymbol = async (symbol: string) => {
    try {
      await addWatchlistSymbol(symbol);
      setIsAddModalOpen(false);
      loadInitialData();
    } catch (err: any) {
      alert(err.message || 'Error adding symbol');
    }
  };

  const handleRemoveSymbol = async (symbol: string) => {
    try {
      await removeWatchlistSymbol(symbol);
      loadInitialData();
    } catch (err: any) {
      alert(err.message || 'Error removing symbol');
    }
  };

  // Sort watchlist dynamically
  const sortedWatchlist = [...watchlist].sort((a, b) => {
    if (sortBy === 'attention') return b.attentionScore - a.attentionScore;
    if (sortBy === 'symbol') return a.symbol.localeCompare(b.symbol);
    if (sortBy === 'change') return Math.abs(b.changePercent) - Math.abs(a.changePercent);
    return 0;
  });

  const activeSelectedItem = watchlist.find(w => w.symbol === selectedSymbol) || null;

  // Render Pre-Login Landing Page if view is 'landing'
  if (currentView === 'landing') {
    return <LandingPage onLaunchApp={() => setCurrentView('app')} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#080C14] text-[#0F172A] dark:text-[#F8FAFC] font-sans flex flex-col transition-colors">
      {/* Header Navigation */}
      <Header
        username={username}
        isConnected={isConnected}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        theme={theme}
        onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
        activeSection={activeSection}
        onSelectSection={(sec) => setActiveSection(sec)}
        onSelectLogout={() => {
          localStorage.removeItem('ledger_token');
          setCurrentView('landing');
        }}
        availableSymbols={availableSymbols}
        onAddSymbol={handleAddSymbol}
        sortBy={sortBy}
        onSelectSort={(s) => setSortBy(s)}
      />

      {/* Market Benchmark Indices Banner (Nifty 50, Sensex, Nifty Bank) */}
      <MarketIndicesBanner />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {/* Shortcut Back to Landing Page */}
        <div className="mb-4 flex items-center justify-between text-xs font-mono text-[#64748B]">
          <button
            onClick={() => setCurrentView('landing')}
            className="hover:text-[#2962FF] underline font-sans"
          >
            ← View Pre-Login Landing Page
          </button>
          <span>Active Session: {username}</span>
        </div>

        {/* Section View Routing */}
        {activeSection === 'alerts' ? (
          <PriceAlertsManager watchlistItems={watchlist} />
        ) : (
          <>
            {/* Hero Digest Panel */}
            <DigestPanel
              digest={digest}
              onAcknowledge={handleAcknowledgeDigest}
              onSelectSymbol={(sym) => setSelectedSymbol(sym)}
              isAcknowledging={isAcknowledging}
            />

            {/* Market Pulse Banner */}
            <MarketPulse items={watchlist} />

            {/* Stock Cards Grid or Watchlist Ledger Table */}
            <WatchlistLedger
              items={sortedWatchlist}
              onSelectSymbol={(sym) => setSelectedSymbol(sym)}
              onRemoveSymbol={handleRemoveSymbol}
              onOpenAddModal={() => setIsAddModalOpen(true)}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] dark:border-slate-800 py-5 px-4 text-center text-xs font-sans text-[#64748B] bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-[#0F172A] dark:text-slate-100">Ledger</span>
            <span>— Attention-Protecting Market Watchlist & Delta Engine</span>
          </div>
          <span>Persisted SQLite • Socket.IO Push</span>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <SymbolDetailInspector
        item={activeSelectedItem}
        onClose={() => setSelectedSymbol(null)}
      />

      <AddSymbolModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        existingSymbols={watchlist.map(w => w.symbol)}
        onAddSymbol={handleAddSymbol}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        items={watchlist}
        onSelectSymbol={(sym) => setSelectedSymbol(sym)}
        onAddSymbol={handleAddSymbol}
        onAcknowledgeDigest={handleAcknowledgeDigest}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(token, user) => {
          setUsername(user.username);
          loadInitialData();
        }}
        currentUsername={username}
      />
    </div>
  );
};
