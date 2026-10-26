const express = require('express');
const router = express.Router();
const Song = require('../models/Song');
const { protect } = require('../middleware/auth');

// Sample initial tracks for seeding
const defaultTracks = [
  {
    title: 'Midnight City Lights',
    artist: 'Neon Dreams',
    album: 'Synthwave Odyssey',
    genre: 'Electronic',
    duration: '3:45',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    rating: 5,
    plays: 1240
  },
  {
    title: 'Coffee in Rain',
    artist: 'Lofi Chilled',
    album: 'Sunday Morning Notes',
    genre: 'Lo-Fi',
    duration: '2:50',
    coverImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    rating: 4,
    plays: 980
  },
  {
    title: 'Echoes of Eternity',
    artist: 'Solaris Wave',
    album: 'Deep Cosmos',
    genre: 'Ambient',
    duration: '4:15',
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    rating: 5,
    plays: 2450
  },
  {
    title: 'Golden Horizon',
    artist: 'The Velvet Strings',
    album: 'Acoustic Memories',
    genre: 'Acoustic / Pop',
    duration: '3:20',
    coverImage: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    rating: 4,
    plays: 870
  },
  {
    title: 'Cyberpunk Drive',
    artist: 'Glitch Runner',
    album: 'Sector 7',
    genre: 'Rock / Synth',
    duration: '3:55',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    rating: 5,
    plays: 3100
  }
];

// @route   GET /api/songs
// @desc    Get all songs (with optional search, genre filter, sort)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, genre, sort } = req.query;
    let query = {};

    // Auto-seed if empty
    const count = await Song.countDocuments();
    if (count === 0) {
      await Song.insertMany(defaultTracks);
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

    return res.status(200).json({
      success: true,
      count: songs.length,
      data: songs
    });
  } catch (error) {
    console.error('Error fetching songs:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch songs',
      error: error.message
    });
  }
});

// @route   GET /api/songs/:id
// @desc    Get single song by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ success: false, message: 'Song not found' });
    }
    return res.status(200).json({ success: true, data: song });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/songs
// @desc    Create a new song
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

    const song = await Song.create({
      title,
      artist,
      album: album || 'Single',
      genre: genre || 'Pop',
      duration: duration || '3:30',
      coverImage: coverImage || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
      audioUrl: audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      rating: rating || 5,
      user: req.user ? req.user._id : null
    });

    return res.status(201).json({
      success: true,
      message: 'Song added successfully',
      data: song
    });
  } catch (error) {
    console.error('Create song error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/songs/:id
// @desc    Update a song
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ success: false, message: 'Song not found' });
    }

    song = await Song.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    return res.status(200).json({
      success: true,
      message: 'Song updated successfully',
      data: song
    });
  } catch (error) {
    console.error('Update song error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/songs/:id
// @desc    Delete a song
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ success: false, message: 'Song not found' });
    }

    await Song.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Song deleted successfully'
    });
  } catch (error) {
    console.error('Delete song error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/songs/seed
// @desc    Reset/Seed sample songs
// @access  Public
router.post('/seed', async (req, res) => {
  try {
    await Song.deleteMany();
    const seeded = await Song.insertMany(defaultTracks);
    return res.status(201).json({
      success: true,
      message: 'Database seeded with default tracks',
      data: seeded
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
