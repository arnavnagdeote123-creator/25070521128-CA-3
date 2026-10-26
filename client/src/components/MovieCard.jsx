import React, { useState } from 'react';
import { Star, Clock, Calendar, Edit3, Trash2, Tv, Sparkles, ChevronDown, ChevronUp, Eye } from 'lucide-react';

export default function MovieCard({ movie, onEdit, onDelete, onStatusChange }) {
  const [showNotes, setShowNotes] = useState(false);

  // Platform badge color helper
  const getPlatformStyle = (platform) => {
    switch (platform) {
      case 'Netflix':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Prime Video':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'Disney+':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Apple TV':
        return 'bg-slate-500/10 text-slate-300 border-slate-500/20';
      case 'Max':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
  };

  // Status badge color helper
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Favorites':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      case 'Watched':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    }
  };

  return (
    <div className="group relative bg-slate-900/60 hover:bg-slate-800/80 rounded-2xl border border-slate-800 hover:border-rose-500/40 transition-all duration-300 shadow-xl hover:shadow-rose-500/10 flex flex-col justify-between overflow-hidden">
      <div>
        {/* Poster & Header Overlay */}
        <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden bg-slate-800">
          <img
            src={movie.poster || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80'}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80';
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-between p-3">
            {/* Top Badges */}
            <div className="flex items-center justify-between gap-1">
              <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border backdrop-blur-md ${getPlatformStyle(movie.streamingPlatform)}`}>
                <Tv className="w-2.5 h-2.5 inline mr-1" />
                {movie.streamingPlatform}
              </span>

              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-md ${getStatusStyle(movie.status)}`}>
                {movie.status === 'Favorites' ? '❤️ Favorites' : movie.status === 'Watched' ? '✓ Watched' : '📌 Watchlist'}
              </span>
            </div>

            {/* Bottom Meta */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
              <span className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-md">
                <Calendar className="w-3 h-3 text-rose-400" />
                {movie.year}
              </span>
              <span className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-md">
                <Clock className="w-3 h-3 text-orange-400" />
                {movie.duration || '2h 10m'}
              </span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-2.5">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-extrabold text-slate-100 text-base leading-snug group-hover:text-rose-400 transition-colors" title={movie.title}>
                {movie.title}
              </h3>
              {/* Star Rating */}
              <div className="flex items-center text-amber-400 text-xs shrink-0 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/60">
                <Star className="w-3 h-3 fill-amber-400 mr-1" />
                <span className="font-bold">{movie.rating || 5}</span>
                <span className="text-[10px] text-slate-400">/5</span>
              </div>
            </div>

            <p className="text-xs text-rose-400/90 font-medium mt-0.5 truncate">
              Dir. {movie.director}
            </p>
          </div>

          {/* Genre Tag */}
          <div>
            <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
              {movie.genre}
            </span>
          </div>

          {/* Review Quote */}
          {movie.review && (
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed italic border-l-2 border-rose-500/40 pl-2">
              "{movie.review}"
            </p>
          )}

          {/* Director Notes Collapsible */}
          {movie.directorNotes && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowNotes(!showNotes)}
                className="text-[11px] font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition"
              >
                <Sparkles className="w-3 h-3" />
                <span>Director's Technique & Notes</span>
                {showNotes ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
              {showNotes && (
                <div className="mt-1.5 p-2.5 rounded-xl bg-slate-850/90 border border-slate-700/80 text-[11px] text-slate-300 leading-relaxed animate-in fade-in duration-200">
                  {movie.directorNotes}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 pt-2 border-t border-slate-800/80 flex items-center justify-between">
        {/* Quick Status Cycle Button */}
        <button
          onClick={() => {
            const nextStatus = movie.status === 'Watchlist' ? 'Watched' : movie.status === 'Watched' ? 'Favorites' : 'Watchlist';
            onStatusChange(movie, nextStatus);
          }}
          title="Click to toggle watch status"
          className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition"
        >
          <Eye className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[10px] underline decoration-slate-700">Cycle Status</span>
        </button>

        {/* Edit & Delete Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(movie)}
            title="Edit Film (PUT)"
            className="p-1.5 rounded-lg text-slate-400 hover:text-orange-400 hover:bg-orange-500/10 transition"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(movie)}
            title="Delete Film (DELETE)"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
