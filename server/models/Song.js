const mongoose = require('mongoose');

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Song title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    artist: {
      type: String,
      required: [true, 'Artist name is required'],
      trim: true,
      maxlength: [80, 'Artist cannot exceed 80 characters']
    },
    album: {
      type: String,
      trim: true,
      default: 'Single'
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      trim: true,
      default: 'Pop'
    },
    duration: {
      type: String,
      default: '3:30'
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80'
    },
    audioUrl: {
      type: String,
      default: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    plays: {
      type: Number,
      default: 0
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Song', songSchema);
