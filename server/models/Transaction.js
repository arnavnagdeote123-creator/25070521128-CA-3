const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Transaction title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than zero']
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
      enum: ['income', 'expense'],
      default: 'expense'
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Salary',
        'Freelance',
        'Investments',
        'Rent',
        'Groceries',
        'Dining',
        'Entertainment',
        'Utilities',
        'Health',
        'Transport',
        'Other'
      ],
      default: 'Dining'
    },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'Card', 'Cash', 'Net Banking'],
      default: 'UPI'
    },
    date: {
      type: Date,
      default: Date.now
    },
    notes: {
      type: String,
      trim: true,
      default: ''
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

module.exports = mongoose.model('Transaction', transactionSchema);
