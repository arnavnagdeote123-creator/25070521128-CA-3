import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Wallet, Plus, LogOut, TrendingUp, Sparkles, ShieldCheck } from 'lucide-react';

export default function Navbar({ onOpenAddModal, onSeedData, isSeeding }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-900/85 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 ring-1 ring-white/20">
            <Wallet className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                FinWise
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                CA-03
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              PRN: <span className="text-emerald-400 font-semibold">25070521128</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onSeedData}
            disabled={isSeeding}
            title="Load sample monthly ledger into database"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 hover:text-white rounded-lg border border-slate-700/60 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {isSeeding ? 'Seeding...' : 'Seed Ledger'}
          </button>

          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-lg shadow-md shadow-emerald-500/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4 font-bold" />
            <span>Add Entry</span>
          </button>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-slate-800">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-200">{user?.name || 'Account Holder'}</span>
              <span className="text-[10px] text-slate-400 truncate max-w-[130px]">{user?.email || 'Logged In'}</span>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
