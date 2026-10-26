import React from 'react';
import { Play, Pause, Edit3, Trash2, Star, Clock, Music } from 'lucide-react';

export default function SongCard({ song, isPlaying, onPlay, onEdit, onDelete }) {
  return (
    <div className="group relative bg-slate-900/60 hover:bg-slate-800/80 rounded-2xl p-4 border border-slate-800 hover:border-violet-500/40 transition-all duration-300 shadow-lg hover:shadow-violet-500/10 flex flex-col justify-between">
      <div>
        {/* Cover Image & Overlay Play Button */}
        <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-slate-800">
          <img
            src={song.coverImage || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80'}
            alt={song.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
            <span className="text-[11px] font-mono text-slate-300 flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-md">
              <Clock className="w-3 h-3 text-violet-400" />
              {song.duration || '3:30'}
            </span>

            <button
              onClick={() => onPlay(song)}
              className="w-10 h-10 rounded-full bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center shadow-lg shadow-violet-600/50 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 translate-x-0.5" />}
            </button>
          </div>
        </div>

        {/* Track Title and Artist */}
        <div className="space-y-1 mb-2">
          <h3 className="font-bold text-slate-100 text-base leading-snug truncate group-hover:text-violet-400 transition-colors" title={song.title}>
            {song.title}
          </h3>
          <p className="text-xs text-slate-400 truncate" title={song.artist}>
            {song.artist}
          </p>
          <p className="text-[11px] text-slate-500 truncate" title={song.album}>
            {song.album || 'Single'}
          </p>
        </div>
      </div>

      {/* Meta Footer & Action Buttons */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between mt-2">
        <span className="inline-block text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
          {song.genre}
        </span>

        {/* Rating Stars */}
        <div className="flex items-center text-amber-400 text-xs gap-0.5">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span className="font-semibold text-slate-300">{song.rating || 5}</span>
        </div>

        {/* CRUD Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(song)}
            title="Edit Track (PUT)"
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(song)}
            title="Delete Track (DELETE)"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
