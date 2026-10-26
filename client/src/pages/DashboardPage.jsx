import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';
import DeleteModal from '../components/DeleteModal';
import { moviesAPI } from '../services/api';
import { Search, SlidersHorizontal, Film, Star, CheckCircle, Heart, Bookmark, Sparkles, Tv } from 'lucide-react';

const GENRES = [
  'All',
  'Sci-Fi',
  'Psychological Thriller',
  'Action',
  'Drama',
  'Horror',
  'Animation',
  'Crime'
];

const STATUS_TABS = [
  { id: 'All', label: 'All Films', icon: Film },
  { id: 'Watchlist', label: 'Watchlist', icon: Bookmark },
  { id: 'Watched', label: 'Watched', icon: CheckCircle },
  { id: 'Favorites', label: 'Favorites', icon: Heart }
];

export default function DashboardPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [deletingMovie, setDeletingMovie] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      const res = await moviesAPI.getAll({
        search,
        genre: selectedGenre,
        status: selectedStatus,
        platform: selectedPlatform,
        sort: sortBy
      });
      if (res.success && res.data) {
        setMovies(res.data);
      }
    } catch (err) {
      showNotification(err.message || 'Error fetching movie catalog', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, selectedGenre, selectedStatus, selectedPlatform, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMovies();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchMovies]);

  // Handle Save (Create or Update)
  const handleSaveMovie = async (movieData, id) => {
    if (id) {
      // PUT (Update)
      await moviesAPI.update(id, movieData);
      showNotification('Film details updated successfully!');
    } else {
      // POST (Create)
      await moviesAPI.create(movieData);
      showNotification('New film added to your watchlist!');
    }
    fetchMovies();
  };

  // Quick Status Cycle Handler
  const handleStatusChange = async (movie, newStatus) => {
    try {
      await moviesAPI.update(movie._id, { status: newStatus });
      showNotification(`Moved "${movie.title}" to ${newStatus}`);
      fetchMovies();
    } catch (err) {
      showNotification(err.message || 'Failed to update status', 'error');
    }
  };

  // Handle Delete (DELETE)
  const handleConfirmDelete = async (id) => {
    try {
      setActionLoading(true);
      await moviesAPI.delete(id);
      setIsDeleteOpen(false);
      setDeletingMovie(null);
      showNotification('Film removed from catalog');
      fetchMovies();
    } catch (err) {
      showNotification(err.message || 'Failed to delete film', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Seed
  const handleSeedMovies = async () => {
    try {
      setActionLoading(true);
      await moviesAPI.seed();
      showNotification('Curated movie catalog seeded successfully!');
      fetchMovies();
    } catch (err) {
      showNotification(err.message || 'Seeding failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (movie) => {
    setEditingMovie(movie);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingMovie(null);
    setIsModalOpen(true);
  };

  const openDeleteModal = (movie) => {
    setDeletingMovie(movie);
    setIsDeleteOpen(true);
  };

  // Metrics
  const totalCount = movies.length;
  const favoritesCount = movies.filter((m) => m.status === 'Favorites').length;
  const watchedCount = movies.filter((m) => m.status === 'Watched').length;
  const avgRating = totalCount
    ? (movies.reduce((acc, m) => acc + (m.rating || 5), 0) / totalCount).toFixed(1)
    : '5.0';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Navbar */}
      <Navbar
        onOpenAddModal={openAddModal}
        onSeedMovies={handleSeedMovies}
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
        {/* Hero Showcase Banner */}
        <section aria-label="CineScope Overview" className="relative rounded-3xl overflow-hidden p-6 sm:p-10 bg-gradient-to-r from-rose-950/40 via-orange-950/30 to-slate-900/60 border border-slate-800 shadow-2xl mb-8">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-500/20 text-rose-300 border border-rose-500/30 mb-3">
              <Film className="w-3.5 h-3.5" /> Curate Your Personal Cinema Archive
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Track, Review & Rate Masterpiece Cinema
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Full-stack movie watchlist application powered by Node.js, Express, MongoDB, and React with streaming availability badges, director technique analysis, and full CRUD operations.
            </p>
          </div>

          {/* Metrics Overview */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80 max-w-2xl">
            <div className="bg-slate-900/60 backdrop-blur-md rounded-xl p-3 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Film className="w-3.5 h-3.5 text-rose-400" /> Total Films
              </div>
              <span className="text-xl font-bold text-white">{totalCount}</span>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-md rounded-xl p-3 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Watched
              </div>
              <span className="text-xl font-bold text-white">{watchedCount}</span>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-md rounded-xl p-3 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Heart className="w-3.5 h-3.5 text-rose-500" /> Favorites
              </div>
              <span className="text-xl font-bold text-white">{favoritesCount}</span>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-md rounded-xl p-3 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Star className="w-3.5 h-3.5 text-amber-400" /> Avg Rating
              </div>
              <span className="text-xl font-bold text-white">{avgRating} ★</span>
            </div>
          </div>
        </section>

        {/* Watch Status Tabs */}
        <section aria-label="Watch Status Filter" className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6 overflow-x-auto">
          {STATUS_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = selectedStatus === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-850'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </section>

        {/* Search, Genre & Platform Toolbar */}
        <section aria-label="Search and Toolbar" className="space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search film title, director, review..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-900/90 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition shadow-inner"
              />
            </div>

            {/* Platform & Sort Selectors */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="px-3 py-2 text-xs sm:text-sm bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500 transition cursor-pointer"
              >
                <option value="All">All Streaming Platforms</option>
                <option value="Netflix">Netflix</option>
                <option value="Prime Video">Prime Video</option>
                <option value="Disney+">Disney+</option>
                <option value="Apple TV">Apple TV</option>
                <option value="Max">Max</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-xs sm:text-sm bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500 transition cursor-pointer"
              >
                <option value="newest">Sort: Recently Added</option>
                <option value="rating">Sort: Highest Rating</option>
                <option value="year">Sort: Release Year (Newest)</option>
                <option value="title">Sort: Title (A-Z)</option>
                <option value="director">Sort: Director (A-Z)</option>
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
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:bg-slate-850'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </section>

        {/* Movies Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-slate-900/40 rounded-2xl p-4 border border-slate-800 animate-pulse">
                <div className="aspect-[16/10] bg-slate-800/60 rounded-xl mb-3" />
                <div className="h-4 bg-slate-800 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-800/60 rounded w-1/2 mb-3" />
                <div className="h-6 bg-slate-800/40 rounded-full w-1/3" />
              </div>
            ))}
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {movies.map((movie) => (
              <MovieCard
                key={movie._id}
                movie={movie}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 px-4 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-slate-800/80 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Film className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-200">No movies match your criteria</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Try adjusting your search query, switch the watch status tab, or add a new film to your collection.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                onClick={openAddModal}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition"
              >
                Add First Film
              </button>
              <button
                onClick={handleSeedMovies}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl transition"
              >
                Seed Film Catalog
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Add / Edit Movie Modal */}
      <MovieModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMovie(null);
        }}
        onSave={handleSaveMovie}
        editingMovie={editingMovie}
      />

      {/* Delete Movie Modal */}
      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingMovie(null);
        }}
        onConfirm={handleConfirmDelete}
        movie={deletingMovie}
        loading={actionLoading}
      />
    </div>
  );
}
