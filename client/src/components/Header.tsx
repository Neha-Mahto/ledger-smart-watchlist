import React, { useState } from 'react';
import { Search, Plus, Command, User, LogOut, Sun, Moon, Activity } from 'lucide-react';
import { SimulatedSymbolInfo } from '../types';
import { rankSymbolSearch } from '../utils/search';

interface HeaderProps {
  username: string;
  isConnected: boolean;
  onOpenCommandPalette: () => void;
  onOpenAuthModal: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  activeSection: 'dashboard' | 'watchlist' | 'alerts';
  onSelectSection: (sec: 'dashboard' | 'watchlist' | 'alerts') => void;
  onSelectLogout: () => void;
  availableSymbols: SimulatedSymbolInfo[];
  onAddSymbol: (symbol: string) => void;
  sortBy: 'attention' | 'symbol' | 'change';
  onSelectSort: (sort: 'attention' | 'symbol' | 'change') => void;
}

export const Header: React.FC<HeaderProps> = ({
  username,
  isConnected,
  onOpenCommandPalette,
  onOpenAuthModal,
  theme,
  onToggleTheme,
  activeSection,
  onSelectSection,
  onSelectLogout,
  availableSymbols,
  onAddSymbol,
  sortBy,
  onSelectSort
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchFocused, setSearchFocused] = useState<boolean>(false);

  const filteredAutocomplete = rankSymbolSearch(searchInput, availableSymbols).slice(0, 6);

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-[#E2E8F0] dark:border-slate-800 transition-colors shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo & Name: LEDGER */}
        <div className="flex items-center space-x-8">
          <div
            className="flex items-center space-x-2.5 cursor-pointer group"
            onClick={() => onSelectSection('dashboard')}
          >
            <div className="w-9 h-9 rounded-xl bg-[#2962FF] flex items-center justify-center shadow-md shadow-[#2962FF]/20 group-hover:bg-[#1E53E5] transition-colors">
              <Activity className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-sans font-extrabold text-xl text-[#0F172A] dark:text-slate-100 tracking-tight">
                  Ledger
                </span>
                <span className="bg-[#ECFDF5] text-[#10B981] border border-emerald-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                  Engine
                </span>
              </div>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1 font-sans text-xs font-bold">
            <button
              onClick={() => onSelectSection('dashboard')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeSection === 'dashboard'
                  ? 'bg-[#EFF6FF] text-[#2962FF] font-extrabold dark:bg-blue-950/60 dark:text-blue-300'
                  : 'text-[#64748B] hover:bg-[#F8FAFC] dark:text-slate-400 hover:text-[#0F172A]'
              }`}
            >
              Explore Cards
            </button>
            <button
              onClick={() => onSelectSection('watchlist')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeSection === 'watchlist'
                  ? 'bg-[#EFF6FF] text-[#2962FF] font-extrabold dark:bg-blue-950/60 dark:text-blue-300'
                  : 'text-[#64748B] hover:bg-[#F8FAFC] dark:text-slate-400 hover:text-[#0F172A]'
              }`}
            >
              Watchlist Table
            </button>
            <button
              onClick={() => onSelectSection('alerts')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeSection === 'alerts'
                  ? 'bg-[#EFF6FF] text-[#2962FF] font-extrabold dark:bg-blue-950/60 dark:text-blue-300'
                  : 'text-[#64748B] hover:bg-[#F8FAFC] dark:text-slate-400 hover:text-[#0F172A]'
              }`}
            >
              Price Alerts
            </button>
          </nav>
        </div>

        {/* Center Search Bar with Autocomplete */}
        <div className="flex-1 max-w-md relative hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              placeholder="Search ticker, company name, or sector (e.g. GROWW, Banking, Fintech)..."
              className="w-full bg-[#F8FAFC] dark:bg-slate-950/60 border border-[#E2E8F0] dark:border-slate-800 rounded-xl pl-10 pr-10 py-2 text-xs text-[#0F172A] dark:text-slate-100 placeholder-[#64748B] font-sans focus:outline-none focus:border-[#2962FF] focus:bg-white transition-all shadow-2xs"
            />
            <kbd className="absolute right-3 top-2.5 bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 text-[10px] font-mono text-[#64748B] px-1.5 py-0.5 rounded-md">
              Ctrl+K
            </kbd>
          </div>

          {/* Search Autocomplete Dropdown */}
          {searchFocused && searchInput.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden font-sans">
              {filteredAutocomplete.length > 0 ? (
                filteredAutocomplete.map((sym) => (
                  <div
                    key={sym.symbol}
                    onClick={() => {
                      onAddSymbol(sym.symbol);
                      setSearchInput('');
                    }}
                    className="p-3 hover:bg-[#F8FAFC] dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between transition-colors border-b border-[#E2E8F0]/60 dark:border-slate-800/60 last:border-none"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-xs text-[#0F172A] dark:text-slate-100">{sym.symbol}</span>
                        <span className="text-[10px] font-mono bg-[#EFF6FF] text-[#2962FF] font-bold px-1.5 py-0.2 rounded border border-blue-200">
                          {sym.sector}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#64748B] font-sans">{sym.name}</p>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-[#2962FF] font-semibold">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-[#64748B] text-xs font-sans">
                  No stocks found matching <strong className="text-[#0F172A] dark:text-slate-100">"{searchInput}"</strong>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right User Actions & Controls */}
        <div className="flex items-center space-x-3">
          {/* Socket Indicator */}
          <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#ECFDF5] text-[#10B981] text-[11px] font-mono font-bold">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#10B981] animate-pulse' : 'bg-amber-500'}`} />
            <span>{isConnected ? 'LIVE WS' : 'RECONNECT'}</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl border border-[#E2E8F0] dark:border-slate-800 hover:border-[#2962FF] bg-white dark:bg-slate-900 text-[#64748B] hover:text-[#0F172A] dark:hover:text-slate-100 transition-all shadow-2xs"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* User Profile Chip */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#0F172A] dark:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm hover:scale-[1.02]"
            >
              <div className="w-5 h-5 rounded-full bg-[#2962FF] text-white flex items-center justify-center font-bold text-[10px]">
                {username.substring(0, 1).toUpperCase()}
              </div>
              <span className="capitalize">{username || 'User'}</span>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-2xl shadow-xl py-1 z-40 text-xs font-sans">
                <div className="px-3 py-2 border-b border-[#E2E8F0] dark:border-slate-800 font-mono text-[11px] text-[#64748B]">
                  Account: <strong className="text-[#0F172A] dark:text-slate-100">{username}</strong>
                </div>
                <button
                  onClick={() => {
                    onOpenAuthModal();
                    setUserMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-[#F8FAFC] dark:hover:bg-slate-800 text-[#0F172A] dark:text-slate-200"
                >
                  Switch Account
                </button>
                <button
                  onClick={() => {
                    onSelectLogout();
                    setUserMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-[#FEE2E2] text-[#EF4444] flex items-center justify-between border-t border-[#E2E8F0] dark:border-slate-800"
                >
                  <span>Log Out</span>
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
