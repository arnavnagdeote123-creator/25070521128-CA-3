const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    director: {
      type: String,
      required: [true, 'Director name is required'],
      trim: true,
      maxlength: [80, 'Director name cannot exceed 80 characters']
    },
    year: {
      type: Number,
      required: [true, 'Release year is required'],
      min: [1888, 'Year must be after 1888'],
      max: [2035, 'Year cannot exceed 2035']
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      trim: true,
      default: 'Sci-Fi'
    },
    duration: {
      type: String,
      default: '2h 15m'
    },
    poster: {
      type: String,
      default: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80'
    },
    streamingPlatform: {
      type: String,
      enum: ['Netflix', 'Prime Video', 'Disney+', 'Apple TV', 'Max', 'Cinema / Other'],
      default: 'Netflix'
    },
    status: {
      type: String,
      enum: ['Watchlist', 'Watched', 'Favorites'],
      default: 'Watchlist'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    review: {
      type: String,
      trim: true,
      default: 'Remarkable cinematography and captivating storytelling.'
    },
    directorNotes: {
      type: String,
      trim: true,
      default: 'Masterclass in pacing, visual composition, and thematic depth.'
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

module.exports = mongoose.model('Movie', movieSchema);
