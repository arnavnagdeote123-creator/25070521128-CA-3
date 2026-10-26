import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import SongCard from '../components/SongCard';
import SongModal from '../components/SongModal';
import DeleteModal from '../components/DeleteModal';
import AudioPlayer from '../components/AudioPlayer';
import { songsAPI } from '../services/api';
import { Search, SlidersHorizontal, Music, Disc3, Headphones, Star, AlertCircle, RefreshCw } from 'lucide-react';

const GENRES = ['All', 'Pop', 'Electronic', 'Lo-Fi', 'Rock', 'Acoustic / Pop', 'Ambient', 'Hip-Hop'];

export default function DashboardPage() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [currentTrack, setCurrentTrack] = useState(null);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
  const [deletingSong, setDeletingSong] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchSongs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await songsAPI.getAll({
        search,
        genre: selectedGenre,
        sort: sortBy
      });
      if (res.success && res.data) {
        setSongs(res.data);
        if (!currentTrack && res.data.length > 0) {
          setCurrentTrack(res.data[0]);
        }
      }
    } catch (err) {
      showNotification(err.message || 'Error fetching tracks', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, selectedGenre, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSongs();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchSongs]);

  // Handle Save (Create or Update)
  const handleSaveSong = async (songData, id) => {
    if (id) {
      // PUT (Update)
      const res = await songsAPI.update(id, songData);
      showNotification('Track successfully updated!');
      if (currentTrack?._id === id) {
        setCurrentTrack(res.data);
      }
    } else {
      // POST (Create)
      await songsAPI.create(songData);
      showNotification('New track added to library!');
    }
    fetchSongs();
  };

  // Handle Delete (DELETE)
  const handleConfirmDelete = async (id) => {
    try {
      setActionLoading(true);
      await songsAPI.delete(id);
      setIsDeleteOpen(false);
      setDeletingSong(null);
      showNotification('Track deleted successfully');
      if (currentTrack?._id === id) {
        setCurrentTrack(null);
      }
      fetchSongs();
    } catch (err) {
      showNotification(err.message || 'Failed to delete track', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Seed
  const handleSeedTracks = async () => {
    try {
      setActionLoading(true);
      await songsAPI.seed();
      showNotification('Default music library seeded successfully!');
      fetchSongs();
    } catch (err) {
      showNotification(err.message || 'Seeding failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (song) => {
    setEditingSong(song);
    setIsModalOpen(true);
  };

  // Open Add Modal
  const openAddModal = () => {
    setEditingSong(null);
    setIsModalOpen(true);
  };

  // Open Delete Modal
  const openDeleteModal = (song) => {
    setDeletingSong(song);
    setIsDeleteOpen(true);
  };

  // Calculate stats
  const totalTracks = songs.length;
  const uniqueGenres = new Set(songs.map((s) => s.genre)).size;
  const avgRating = totalTracks
    ? (songs.reduce((acc, s) => acc + (s.rating || 5), 0) / totalTracks).toFixed(1)
    : '5.0';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28">
      {/* Top Navigation */}
      <Navbar
        onOpenAddModal={openAddModal}
        onSeedTracks={handleSeedTracks}
        isSeeding={actionLoading}
      />

      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl border text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-4 duration-300 ${
            notification.type === 'error'
              ? 'bg-rose-950/90 border-rose-500/40 text-rose-300'
              : 'bg-emerald-950/90 border-emerald-500/40 text-emerald-300'
          }`}
        >
          <span>{notification.message}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Hero Banner */}
        <section aria-label="Hero Overview" className="relative rounded-3xl overflow-hidden p-6 sm:p-10 bg-gradient-to-r from-violet-900/40 via-purple-900/30 to-slate-900/60 border border-slate-800 shadow-2xl mb-8">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-violet-500/20 text-violet-300 border border-violet-500/30 mb-3">
              <Headphones className="w-3.5 h-3.5" /> High-Fidelity Audio Streaming
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Curate, Stream & Explore Your Audio Library
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Complete full-stack CRUD application powered by Node.js, Express, MongoDB, and React with responsive controls and interactive audio preview.
            </p>
          </div>

          {/* Key Metrics Chips */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-800/80 max-w-lg">
            <div className="bg-slate-900/60 backdrop-blur-md rounded-xl p-3 border border-slate-800">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Music className="w-3.5 h-3.5 text-violet-400" /> Total Tracks
              </div>
              <span className="text-xl font-bold text-white">{totalTracks}</span>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-md rounded-xl p-3 border border-slate-800">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Disc3 className="w-3.5 h-3.5 text-fuchsia-400" /> Active Genres
              </div>
              <span className="text-xl font-bold text-white">{uniqueGenres}</span>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-md rounded-xl p-3 border border-slate-800">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Star className="w-3.5 h-3.5 text-amber-400" /> Avg Rating
              </div>
              <span className="text-xl font-bold text-white">{avgRating} ★</span>
            </div>
          </div>
        </section>

        {/* Search, Filter & Sort Controls */}
        <section aria-label="Filters and Sorting" className="space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search tracks by title, artist, album..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-900/90 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition shadow-inner"
              />
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-xs sm:text-sm bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-violet-500 transition cursor-pointer"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="title">Sort: Title (A-Z)</option>
                <option value="artist">Sort: Artist (A-Z)</option>
                <option value="rating">Sort: Highest Rated</option>
                <option value="plays">Sort: Most Played</option>
              </select>
            </div>
          </div>

          {/* Genre Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedGenre === genre
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:bg-slate-850'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </section>

        {/* Songs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-slate-900/40 rounded-2xl p-4 border border-slate-800 animate-pulse">
                <div className="aspect-square bg-slate-800/60 rounded-xl mb-3" />
                <div className="h-4 bg-slate-800 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-800/60 rounded w-1/2 mb-3" />
                <div className="h-6 bg-slate-800/40 rounded-full w-1/3" />
              </div>
            ))}
          </div>
        ) : songs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {songs.map((song) => (
              <SongCard
                key={song._id}
                song={song}
                isPlaying={currentTrack?._id === song._id}
                onPlay={(s) => setCurrentTrack(s)}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 px-4 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-slate-800/80 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Music className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-200">No tracks match your query</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Try adjusting your search keywords, choose another genre, or add a new track to your collection.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                onClick={openAddModal}
                className="px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-xl transition"
              >
                Add First Song
              </button>
              <button
                onClick={handleSeedTracks}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl transition"
              >
                Seed Sample Tracks
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Persistent Audio Player */}
      <AudioPlayer currentTrack={currentTrack} />

      {/* Add / Edit Song Modal */}
      <SongModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSong(null);
        }}
        onSave={handleSaveSong}
        editingSong={editingSong}
      />

      {/* Delete Song Modal */}
      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingSong(null);
        }}
        onConfirm={handleConfirmDelete}
        song={deletingSong}
        loading={actionLoading}
      />
    </div>
  );
}
