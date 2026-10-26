import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Clapperboard, Plus, LogOut, Film, Sparkles } from 'lucide-react';

export default function Navbar({ onOpenAddModal, onSeedMovies, isSeeding }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-900/85 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-orange-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/25 ring-1 ring-white/20">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                CineScope
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                CA-03
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              PRN: <span className="text-rose-300 font-semibold">25070521128</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onSeedMovies}
            disabled={isSeeding}
            title="Load curated movie catalog into database"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 hover:text-white rounded-lg border border-slate-700/60 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {isSeeding ? 'Seeding...' : 'Seed Catalog'}
          </button>

          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 rounded-lg shadow-md shadow-rose-600/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Film</span>
          </button>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-slate-800">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-200">{user?.name || 'Film Critic'}</span>
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
