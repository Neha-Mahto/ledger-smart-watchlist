import React, { useState } from 'react';
import { X, UserCheck, Shield } from 'lucide-react';
import { loginUser } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string, user: { id: string; username: string }) => void;
  currentUsername: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentUsername
}) => {
  const [usernameInput, setUsernameInput] = useState<string>(currentUsername || 'trader');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser(usernameInput.trim());
      localStorage.setItem('ledger_token', data.token);
      localStorage.setItem('ledger_username', data.user.username);
      onLoginSuccess(data.token, data.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-ledger-bg border border-ledger-border w-full max-w-md rounded-2xl p-6 shadow-2xl relative glass-panel">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-ledger-text-dim hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-xl bg-ledger-gold/15 text-ledger-gold border border-ledger-gold/30">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-white">Server Token Identity</h3>
            <p className="text-xs text-ledger-text-dim">Cross-device state & digest baseline identity</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-ledger-red/20 border border-ledger-red/40 text-ledger-red text-xs font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-ledger-text-dim mb-1">
              Username
            </label>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="e.g. trader, analyst, fund_mgr"
              className="w-full bg-ledger-card border border-ledger-border rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-ledger-gold"
              required
            />
            <p className="text-[11px] text-ledger-text-dim mt-1.5">
              Identifies your server-side watchlist and last-seen snapshot baseline across browser sessions.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-ledger-gold hover:bg-amber-400 text-black font-semibold text-xs transition-all shadow-md shadow-ledger-gold/20 flex items-center justify-center space-x-2"
          >
            <UserCheck className="w-4 h-4 stroke-[2.5]" />
            <span>{loading ? 'Authenticating...' : 'Set Active Identity'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
