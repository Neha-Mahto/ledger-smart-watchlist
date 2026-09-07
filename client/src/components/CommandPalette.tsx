import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { Search, Plus, Sparkles, Zap, CheckCheck, X } from 'lucide-react';
import { WatchlistItemData, SimulatedSymbolInfo } from '../types';
import { fetchAvailableSymbols } from '../services/api';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  items: WatchlistItemData[];
  onSelectSymbol: (symbol: string) => void;
  onAddSymbol: (symbol: string) => void;
  onAcknowledgeDigest: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  items,
  onSelectSymbol,
  onAddSymbol,
  onAcknowledgeDigest
}) => {
  const [allSymbols, setAllSymbols] = useState<SimulatedSymbolInfo[]>([]);

  useEffect(() => {
    fetchAvailableSymbols().then(setAllSymbols).catch(() => {});
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent via shortcut
        }
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-start justify-center pt-20 p-4 animate-fadeIn">
      <div className="bg-ledger-bg border border-ledger-border w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden glass-panel">
        <div className="p-3 border-b border-ledger-border flex items-center justify-between">
          <div className="flex items-center space-x-2 text-ledger-gold text-xs font-mono">
            <Search className="w-4 h-4" />
            <span>LEDGER COMMAND PALETTE</span>
          </div>
          <button onClick={onClose} className="text-ledger-text-dim hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <Command className="p-2">
          <Command.Input
            placeholder="Type a command or search symbol (e.g. 'TCS', 'Acknowledge', 'Add')..."
            className="w-full bg-ledger-card border border-ledger-border rounded-xl px-4 py-2.5 text-xs text-white placeholder-ledger-text-dim focus:outline-none font-mono"
          />

          <Command.List className="max-h-72 overflow-y-auto mt-2 space-y-1">
            <Command.Empty className="p-4 text-xs font-mono text-ledger-text-dim text-center">
              No matching commands or symbols found.
            </Command.Empty>

            <Command.Group heading="Quick Actions" className="text-[10px] font-mono uppercase text-ledger-text-dim px-2 py-1">
              <Command.Item
                onSelect={() => {
                  onAcknowledgeDigest();
                  onClose();
                }}
                className="p-2.5 rounded-lg flex items-center space-x-3 text-xs text-white hover:bg-ledger-gold/20 hover:text-ledger-gold cursor-pointer transition-colors"
              >
                <CheckCheck className="w-4 h-4 text-ledger-gold" />
                <span className="font-mono">Acknowledge Digest Snapshot</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Watched Symbols (Jump to Detail)" className="text-[10px] font-mono uppercase text-ledger-text-dim px-2 py-1">
              {items.map(item => (
                <Command.Item
                  key={item.symbol}
                  onSelect={() => {
                    onSelectSymbol(item.symbol);
                    onClose();
                  }}
                  className="p-2.5 rounded-lg flex items-center justify-between text-xs text-white hover:bg-ledger-card cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-2 font-mono">
                    <span className="font-bold text-ledger-gold">{item.symbol}</span>
                    <span className="text-ledger-text-dim">- {item.name}</span>
                  </div>
                  <span className="text-[10px] font-mono bg-ledger-surface px-2 py-0.5 rounded text-ledger-text-dim">
                    Score: {item.attentionScore}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="Add Available Symbols" className="text-[10px] font-mono uppercase text-ledger-text-dim px-2 py-1">
              {allSymbols.map(sym => (
                <Command.Item
                  key={sym.symbol}
                  onSelect={() => {
                    onAddSymbol(sym.symbol);
                    onClose();
                  }}
                  className="p-2.5 rounded-lg flex items-center justify-between text-xs text-white hover:bg-ledger-card cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-2 font-mono">
                    <Plus className="w-3.5 h-3.5 text-ledger-gold" />
                    <span>Add {sym.symbol} ({sym.sector})</span>
                  </div>
                  <span className="text-ledger-text-dim font-mono text-[11px]">${sym.basePrice}</span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
};
