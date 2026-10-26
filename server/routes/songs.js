const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Song = require('../models/Song');
const { protect } = require('../middleware/auth');

// Default starter tracks
const defaultTracks = [
  {
    _id: '65f1a2b3c4d5e6f7a8b9c001',
    title: 'Midnight City Lights',
    artist: 'Neon Dreams',
    album: 'Synthwave Odyssey',
    genre: 'Electronic',
    duration: '3:45',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    rating: 5,
    plays: 1240,
    createdAt: new Date().toISOString()
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9c002',
    title: 'Coffee in Rain',
    artist: 'Lofi Chilled',
    album: 'Sunday Morning Notes',
    genre: 'Lo-Fi',
    duration: '2:50',
    coverImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    rating: 4,
    plays: 980,
    createdAt: new Date().toISOString()
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9c003',
    title: 'Echoes of Eternity',
    artist: 'Solaris Wave',
    album: 'Deep Cosmos',
    genre: 'Ambient',
    duration: '4:15',
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    rating: 5,
    plays: 2450,
    createdAt: new Date().toISOString()
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9c004',
    title: 'Golden Horizon',
    artist: 'The Velvet Strings',
    album: 'Acoustic Memories',
    genre: 'Acoustic / Pop',
    duration: '3:20',
    coverImage: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    rating: 4,
    plays: 870,
    createdAt: new Date().toISOString()
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9c005',
    title: 'Cyberpunk Drive',
    artist: 'Glitch Runner',
    album: 'Sector 7',
    genre: 'Rock',
    duration: '3:55',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    rating: 5,
    plays: 3100,
    createdAt: new Date().toISOString()
  }
];

let memorySongs = [...defaultTracks];

// @route   GET /api/songs
// @desc    Get all songs (with search, genre filter, sort)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, genre, sort } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = {};
      const count = await Song.countDocuments();
      if (count === 0) {
        await Song.insertMany(defaultTracks.map(({ _id, ...rest }) => rest));
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { artist: { $regex: search, $options: 'i' } },
          { album: { $regex: search, $options: 'i' } }
        ];
      }

      if (genre && genre !== 'All') {
        query.genre = { $regex: new RegExp(`^${genre}$`, 'i') };
      }

      let sortOption = { createdAt: -1 };
      if (sort === 'title') sortOption = { title: 1 };
      if (sort === 'artist') sortOption = { artist: 1 };
      if (sort === 'rating') sortOption = { rating: -1 };
      if (sort === 'plays') sortOption = { plays: -1 };

      const songs = await Song.find(query).sort(sortOption);
      return res.status(200).json({ success: true, count: songs.length, data: songs });
    } else {
      // In-Memory Fallback
      let result = [...memorySongs];

      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (t) =>
            t.title.toLowerCase().includes(s) ||
            t.artist.toLowerCase().includes(s) ||
            (t.album && t.album.toLowerCase().includes(s))
        );
      }

      if (genre && genre !== 'All') {
        result = result.filter((t) => t.genre.toLowerCase() === genre.toLowerCase());
      }

      if (sort === 'title') result.sort((a, b) => a.title.localeCompare(b.title));
      else if (sort === 'artist') result.sort((a, b) => a.artist.localeCompare(b.artist));
      else if (sort === 'rating') result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      else if (sort === 'plays') result.sort((a, b) => (b.plays || 0) - (a.plays || 0));

      return res.status(200).json({
        success: true,
        count: result.length,
        data: result,
        mode: 'fallback'
      });
    }
  } catch (error) {
    console.error('Error fetching songs:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch songs', error: error.message });
  }
});

// @route   GET /api/songs/:id
// @desc    Get single song by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const song = await Song.findById(req.params.id);
      if (!song) return res.status(404).json({ success: false, message: 'Song not found' });
      return res.status(200).json({ success: true, data: song });
    } else {
      const song = memorySongs.find((s) => s._id === req.params.id);
      if (!song) return res.status(404).json({ success: false, message: 'Song not found' });
      return res.status(200).json({ success: true, data: song });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/songs
// @desc    Create a new song (POST)
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, artist, album, genre, duration, coverImage, audioUrl, rating } = req.body;

    if (!title || !artist) {
      return res.status(400).json({
        success: false,
        message: 'Title and artist are required fields'
      });
    }

    const payload = {
      title,
      artist,
      album: album || 'Single',
      genre: genre || 'Pop',
      duration: duration || '3:30',
      coverImage: coverImage || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
      audioUrl: audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      rating: rating || 5,
      user: req.user ? req.user._id : null
    };

    if (mongoose.connection.readyState === 1) {
      const song = await Song.create(payload);
      return res.status(201).json({ success: true, message: 'Song added successfully', data: song });
    } else {
      const newSong = {
        _id: 'sng_' + Date.now(),
        ...payload,
        plays: 0,
        createdAt: new Date().toISOString()
      };
      memorySongs.unshift(newSong);
      return res.status(201).json({ success: true, message: 'Song added successfully (Memory Mode)', data: newSong });
    }
  } catch (error) {
    console.error('Create song error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/songs/:id
// @desc    Update a song (PUT)
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let song = await Song.findById(req.params.id);
      if (!song) return res.status(404).json({ success: false, message: 'Song not found' });

      song = await Song.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      return res.status(200).json({ success: true, message: 'Song updated successfully', data: song });
    } else {
      const idx = memorySongs.findIndex((s) => s._id === req.params.id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Song not found' });

      memorySongs[idx] = { ...memorySongs[idx], ...req.body };
      return res.status(200).json({ success: true, message: 'Song updated successfully', data: memorySongs[idx] });
    }
  } catch (error) {
    console.error('Update song error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/songs/:id
// @desc    Delete a song (DELETE)
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const song = await Song.findById(req.params.id);
      if (!song) return res.status(404).json({ success: false, message: 'Song not found' });

      await Song.findByIdAndDelete(req.params.id);
      return res.status(200).json({ success: true, message: 'Song deleted successfully' });
    } else {
      const idx = memorySongs.findIndex((s) => s._id === req.params.id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Song not found' });

      memorySongs.splice(idx, 1);
      return res.status(200).json({ success: true, message: 'Song deleted successfully' });
    }
  } catch (error) {
    console.error('Delete song error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/songs/seed
// @desc    Reset / Seed default tracks
// @access  Public
router.post('/seed', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await Song.deleteMany();
      const seeded = await Song.insertMany(defaultTracks.map(({ _id, ...rest }) => rest));
      return res.status(201).json({ success: true, message: 'Database seeded with default tracks', data: seeded });
    } else {
      memorySongs = [...defaultTracks];
      return res.status(201).json({ success: true, message: 'Tracks reset to default tracks', data: memorySongs });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
