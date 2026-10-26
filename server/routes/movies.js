const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const { protect } = require('../middleware/auth');

// Curated default movie catalog
const defaultMovies = [
  {
    _id: '65f1a2b3c4d5e6f7a8b9c101',
    title: 'Interstellar',
    director: 'Christopher Nolan',
    year: 2014,
    genre: 'Sci-Fi',
    duration: '2h 49m',
    poster: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80',
    streamingPlatform: 'Prime Video',
    status: 'Favorites',
    rating: 5,
    review: 'A breathtaking masterpiece exploring the limits of love, time, and human survival across dimensions.',
    directorNotes: 'Hoyte van Hoytema shot stunning 70mm IMAX sequences; Hans Zimmer pipe organ score elevates the emotional gravity.',
    createdAt: new Date().toISOString()
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9c102',
    title: 'Parasite',
    director: 'Bong Joon-ho',
    year: 2019,
    genre: 'Psychological Thriller',
    duration: '2h 12m',
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
    streamingPlatform: 'Netflix',
    status: 'Favorites',
    rating: 5,
    review: 'A razor-sharp social satire that seamlessly shifts between dark comedy, tension, and tragedy.',
    directorNotes: 'Brilliant spatial storytelling using architectural lines of vertical ascension and descent to symbolize class struggle.',
    createdAt: new Date().toISOString()
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9c103',
    title: 'Dune: Part Two',
    director: 'Denis Villeneuve',
    year: 2024,
    genre: 'Sci-Fi',
    duration: '2h 46m',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    streamingPlatform: 'Max',
    status: 'Watched',
    rating: 5,
    review: 'An audio-visual triumph and one of the greatest modern science fiction epics ever captured on film.',
    directorNotes: 'Greig Fraser utilized infrared cameras for Giedi Prime; monumental sound design by Mark Mangini.',
    createdAt: new Date().toISOString()
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9c104',
    title: 'Oppenheimer',
    director: 'Christopher Nolan',
    year: 2023,
    genre: 'Drama',
    duration: '3h 00m',
    poster: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=600&q=80',
    streamingPlatform: 'Apple TV',
    status: 'Watched',
    rating: 5,
    review: 'A chilling psychological portrait of intellectual ambition, guilt, and the dawn of atomic power.',
    directorNotes: 'Color sequences depict subjective first-person point of view; black-and-white represents objective historical events.',
    createdAt: new Date().toISOString()
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9c105',
    title: 'Blade Runner 2049',
    director: 'Denis Villeneuve',
    year: 2017,
    genre: 'Sci-Fi',
    duration: '2h 44m',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    streamingPlatform: 'Netflix',
    status: 'Watchlist',
    rating: 5,
    review: 'Philosophical, atmospheric neo-noir expanding upon what it truly means to possess a soul.',
    directorNotes: 'Roger Deakins won Academy Award for masterful atmospheric lighting, fog, and neon color palettes.',
    createdAt: new Date().toISOString()
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9c106',
    title: 'Spirited Away',
    director: 'Hayao Miyazaki',
    year: 2001,
    genre: 'Animation',
    duration: '2h 05m',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
    streamingPlatform: 'Netflix',
    status: 'Favorites',
    rating: 5,
    review: 'A magical, timeless coming-of-age journey through the spirit realm painted with unbridled imagination.',
    directorNotes: 'Hand-drawn frames with Studio Ghibli signature "Ma" (intentional pauses of quiet reflection).',
    createdAt: new Date().toISOString()
  }
];

let memoryMovies = [...defaultMovies];

// @route   GET /api/movies
// @desc    Get all movies (supports search, genre, status, streamingPlatform, sort)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, genre, status, platform, sort } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = {};
      const count = await Movie.countDocuments();
      if (count === 0) {
        await Movie.insertMany(defaultMovies.map(({ _id, ...rest }) => rest));
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { director: { $regex: search, $options: 'i' } },
          { review: { $regex: search, $options: 'i' } }
        ];
      }

      if (genre && genre !== 'All') {
        query.genre = { $regex: new RegExp(`^${genre}$`, 'i') };
      }

      if (status && status !== 'All') {
        query.status = status;
      }

      if (platform && platform !== 'All') {
        query.streamingPlatform = platform;
      }

      let sortOption = { createdAt: -1 };
      if (sort === 'rating') sortOption = { rating: -1 };
      if (sort === 'year') sortOption = { year: -1 };
      if (sort === 'title') sortOption = { title: 1 };
      if (sort === 'director') sortOption = { director: 1 };

      const movies = await Movie.find(query).sort(sortOption);
      return res.status(200).json({ success: true, count: movies.length, data: movies });
    } else {
      // In-Memory Fallback
      let result = [...memoryMovies];

      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (m) =>
            m.title.toLowerCase().includes(s) ||
            m.director.toLowerCase().includes(s) ||
            (m.review && m.review.toLowerCase().includes(s))
        );
      }

      if (genre && genre !== 'All') {
        result = result.filter((m) => m.genre.toLowerCase() === genre.toLowerCase());
      }

      if (status && status !== 'All') {
        result = result.filter((m) => m.status === status);
      }

      if (platform && platform !== 'All') {
        result = result.filter((m) => m.streamingPlatform === platform);
      }

      if (sort === 'rating') result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      else if (sort === 'year') result.sort((a, b) => (b.year || 0) - (a.year || 0));
      else if (sort === 'title') result.sort((a, b) => a.title.localeCompare(b.title));
      else if (sort === 'director') result.sort((a, b) => a.director.localeCompare(b.director));
      else result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return res.status(200).json({
        success: true,
        count: result.length,
        data: result,
        mode: 'fallback'
      });
    }
  } catch (error) {
    console.error('Error fetching movies:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch movies', error: error.message });
  }
});

// @route   GET /api/movies/:id
// @desc    Get single movie by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const movie = await Movie.findById(req.params.id);
      if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });
      return res.status(200).json({ success: true, data: movie });
    } else {
      const movie = memoryMovies.find((m) => m._id === req.params.id);
      if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });
      return res.status(200).json({ success: true, data: movie });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/movies
// @desc    Add a new movie (POST)
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      title,
      director,
      year,
      genre,
      duration,
      poster,
      streamingPlatform,
      status,
      rating,
      review,
      directorNotes
    } = req.body;

    if (!title || !director || !year) {
      return res.status(400).json({
        success: false,
        message: 'Title, director, and release year are required fields'
      });
    }

    const payload = {
      title,
      director,
      year: parseInt(year),
      genre: genre || 'Sci-Fi',
      duration: duration || '2h 10m',
      poster: poster || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
      streamingPlatform: streamingPlatform || 'Netflix',
      status: status || 'Watchlist',
      rating: rating ? parseInt(rating) : 5,
      review: review || 'Remarkable storytelling and cinematic artistry.',
      directorNotes: directorNotes || 'Noteworthy cinematography and pacing.',
      user: req.user ? req.user._id : null
    };

    if (mongoose.connection.readyState === 1) {
      const movie = await Movie.create(payload);
      return res.status(201).json({ success: true, message: 'Film added to watchlist', data: movie });
    } else {
      const newMovie = {
        _id: 'mov_' + Date.now(),
        ...payload,
        createdAt: new Date().toISOString()
      };
      memoryMovies.unshift(newMovie);
      return res.status(201).json({ success: true, message: 'Film added to watchlist (Memory Mode)', data: newMovie });
    }
  } catch (error) {
    console.error('Create movie error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/movies/:id
// @desc    Update movie details (PUT)
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let movie = await Movie.findById(req.params.id);
      if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });

      movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      return res.status(200).json({ success: true, message: 'Movie details updated successfully', data: movie });
    } else {
      const idx = memoryMovies.findIndex((m) => m._id === req.params.id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Movie not found' });

      memoryMovies[idx] = { ...memoryMovies[idx], ...req.body };
      return res.status(200).json({ success: true, message: 'Movie details updated successfully', data: memoryMovies[idx] });
    }
  } catch (error) {
    console.error('Update movie error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/movies/:id
// @desc    Delete movie from catalog (DELETE)
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const movie = await Movie.findById(req.params.id);
      if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });

      await Movie.findByIdAndDelete(req.params.id);
      return res.status(200).json({ success: true, message: 'Movie removed from catalog' });
    } else {
      const idx = memoryMovies.findIndex((m) => m._id === req.params.id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Movie not found' });

      memoryMovies.splice(idx, 1);
      return res.status(200).json({ success: true, message: 'Movie removed from catalog' });
    }
  } catch (error) {
    console.error('Delete movie error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/movies/seed
// @desc    Reset / Seed default movie catalog
// @access  Public
router.post('/seed', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await Movie.deleteMany();
      const seeded = await Movie.insertMany(defaultMovies.map(({ _id, ...rest }) => rest));
      return res.status(201).json({ success: true, message: 'Database seeded with curated movie catalog', data: seeded });
    } else {
      memoryMovies = [...defaultMovies];
      return res.status(201).json({ success: true, message: 'Movie catalog reset to default films', data: memoryMovies });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
