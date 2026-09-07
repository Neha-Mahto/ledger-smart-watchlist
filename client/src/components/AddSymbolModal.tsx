import React, { useState, useEffect } from 'react';
import { X, Search, Plus, Check } from 'lucide-react';
import { SimulatedSymbolInfo } from '../types';
import { fetchAvailableSymbols } from '../services/api';
import { rankSymbolSearch } from '../utils/search';

interface AddSymbolModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingSymbols: string[];
  onAddSymbol: (symbol: string) => void;
}

export const AddSymbolModal: React.FC<AddSymbolModalProps> = ({
  isOpen,
  onClose,
  existingSymbols,
  onAddSymbol
}) => {
  const [availableSymbols, setAvailableSymbols] = useState<SimulatedSymbolInfo[]>([]);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      fetchAvailableSymbols()
        .then(setAvailableSymbols)
        .catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const existingSet = new Set(existingSymbols.map(s => s.toUpperCase()));
  const filtered = rankSymbolSearch(search, availableSymbols);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 w-full max-w-lg rounded-2xl flex flex-col shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="p-4 border-b border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between bg-[#F8FAFC] dark:bg-slate-950">
          <h3 className="font-sans font-extrabold text-base text-[#0F172A] dark:text-slate-100">Add Stock to Watchlist</h3>
          <button onClick={onClose} className="text-[#64748B] hover:text-[#0F172A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC]/50">
          <div className="relative">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ticker, company name, or sector (e.g. GROWW, Banking, Fintech)..."
              className="w-full bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-[#0F172A] dark:text-slate-100 placeholder-[#64748B] focus:outline-none focus:border-[#2962FF] font-sans"
            />
          </div>
        </div>

        {/* Symbol List */}
        <div className="p-2 max-h-80 overflow-y-auto divide-y divide-[#E2E8F0]/60 dark:divide-slate-800/60">
          {filtered.length > 0 ? (
            filtered.map(s => {
              const added = existingSet.has(s.symbol);
              return (
                <div key={s.symbol} className="p-3 flex items-center justify-between hover:bg-[#F8FAFC] dark:hover:bg-slate-800 rounded-xl transition-colors">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-sm text-[#0F172A] dark:text-slate-100">{s.symbol}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#EFF6FF] text-[#2962FF] font-bold border border-blue-200">
                        {s.sector}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B] font-sans">{s.name}</p>
                  </div>

                  {added ? (
                    <span className="flex items-center space-x-1 text-xs font-mono text-[#10B981] bg-[#ECFDF5] px-2.5 py-1 rounded-lg">
                      <Check className="w-3.5 h-3.5" />
                      <span>Watched</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => onAddSymbol(s.symbol)}
                      className="btn-primary-blue flex items-center space-x-1 px-3 py-1.5 text-xs"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Add</span>
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs font-sans text-[#64748B]">
              No stock results found matching <strong className="text-[#0F172A] dark:text-slate-100">"{search}"</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
