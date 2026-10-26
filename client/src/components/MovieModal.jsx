import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Film, Sparkles } from 'lucide-react';

const GENRES = [
  'Sci-Fi',
  'Psychological Thriller',
  'Action',
  'Drama',
  'Horror',
  'Animation',
  'Crime',
  'Comedy'
];

const PLATFORMS = ['Netflix', 'Prime Video', 'Disney+', 'Apple TV', 'Max', 'Cinema / Other'];
const STATUSES = ['Watchlist', 'Watched', 'Favorites'];

export default function MovieModal({ isOpen, onClose, onSave, editingMovie }) {
  const [formData, setFormData] = useState({
    title: '',
    director: '',
    year: new Date().getFullYear(),
    genre: 'Sci-Fi',
    duration: '2h 15m',
    poster: '',
    streamingPlatform: 'Netflix',
    status: 'Watchlist',
    rating: 5,
    review: '',
    directorNotes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingMovie) {
      setFormData({
        title: editingMovie.title || '',
        director: editingMovie.director || '',
        year: editingMovie.year || new Date().getFullYear(),
        genre: editingMovie.genre || 'Sci-Fi',
        duration: editingMovie.duration || '2h 15m',
        poster: editingMovie.poster || '',
        streamingPlatform: editingMovie.streamingPlatform || 'Netflix',
        status: editingMovie.status || 'Watchlist',
        rating: editingMovie.rating || 5,
        review: editingMovie.review || '',
        directorNotes: editingMovie.directorNotes || ''
      });
    } else {
      setFormData({
        title: '',
        director: '',
        year: new Date().getFullYear(),
        genre: 'Sci-Fi',
        duration: '2h 15m',
        poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
        streamingPlatform: 'Netflix',
        status: 'Watchlist',
        rating: 5,
        review: 'Superb narrative, rich thematic depth, and extraordinary cinematic visuals.',
        directorNotes: 'Impeccable color grading and atmospheric sound composition.'
      });
    }
    setError('');
  }, [editingMovie, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.director.trim() || !formData.year) {
      setError('Title, Director, and Release Year are required fields.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onSave(formData, editingMovie?._id);
      onClose();
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 my-8 overflow-hidden">
        {/* Accent Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1.5 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 rounded-full" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Film className="w-5 h-5 text-rose-500" />
              {editingMovie ? 'Edit Film Details (PUT)' : 'Add Film to Watchlist (POST)'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {editingMovie ? 'Update movie metadata and sync with MongoDB' : 'Catalog a new film or series in CineScope'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Film / Series Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Inception"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-800/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Director Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Christopher Nolan"
                value={formData.director}
                onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-800/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Release Year *
              </label>
              <input
                type="number"
                required
                min="1888"
                max="2035"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className="w-full px-3 py-2 text-sm bg-slate-800/80 border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-rose-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Genre
              </label>
              <select
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-800/80 border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-rose-500 transition"
              >
                {GENRES.map((g) => (
                  <option key={g} value={g} className="bg-slate-900">
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Runtime
              </label>
              <input
                type="text"
                placeholder="e.g. 2h 28m"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-800/80 border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-rose-500 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Streaming Platform
              </label>
              <select
                value={formData.streamingPlatform}
                onChange={(e) => setFormData({ ...formData, streamingPlatform: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-800/80 border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-rose-500 transition"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p} className="bg-slate-900">
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Watch Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-800/80 border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-rose-500 transition"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="bg-slate-900">
                    {s === 'Favorites' ? '❤️ Favorites' : s === 'Watched' ? '✓ Watched' : '📌 Watchlist'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Poster Image URL
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.poster}
              onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-800/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Rating: <span className="text-amber-400 font-bold">{formData.rating} ★ / 5</span>
            </label>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Personal Review / Synopsis
            </label>
            <textarea
              rows="2"
              placeholder="Your impression of the story and performances..."
              value={formData.review}
              onChange={(e) => setFormData({ ...formData, review: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-800/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Director's Technique & Visual Notes
            </label>
            <textarea
              rows="2"
              placeholder="Camera composition, lighting choices, sound design..."
              value={formData.directorNotes}
              onChange={(e) => setFormData({ ...formData, directorNotes: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-800/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 rounded-xl shadow-lg shadow-rose-600/30 transition flex items-center gap-2"
            >
              {loading && <span className="animate-spin">⏳</span>}
              <span>{editingMovie ? 'Save Changes' : 'Add to Catalog'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
