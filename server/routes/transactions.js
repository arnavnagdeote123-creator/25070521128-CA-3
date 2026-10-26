const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

// Default starter transactions
const defaultTransactions = [
  {
    _id: '65f1a2b3c4d5e6f7a8b9t001',
    title: 'Monthly Tech Internship Stipend',
    amount: 45000,
    type: 'income',
    category: 'Salary',
    paymentMethod: 'Net Banking',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    notes: 'Received stipend for Software Engineering intern role',
    createdAt: new Date().toISOString()
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9t002',
    title: 'Apartment Rent & Society Maintenance',
    amount: 14500,
    type: 'expense',
    category: 'Rent',
    paymentMethod: 'UPI',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    notes: 'Transferred via UPI to landlord for monthly rent',
    createdAt: new Date().toISOString()
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9t003',
    title: 'Freelance Full Stack UI Project',
    amount: 18500,
    type: 'income',
    category: 'Freelance',
    paymentMethod: 'Net Banking',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    notes: 'Milestone payment for client web application dashboard',
    createdAt: new Date().toISOString()
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9t004',
    title: 'Supermarket Groceries & Essentials',
    amount: 3850,
    type: 'expense',
    category: 'Groceries',
    paymentMethod: 'Card',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    notes: 'Weekly vegetables, dairy, and household supplies',
    createdAt: new Date().toISOString()
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9t005',
    title: 'Weekend Dining & Cafe with Friends',
    amount: 1420,
    type: 'expense',
    category: 'Dining',
    paymentMethod: 'UPI',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    notes: 'Dinner at Italian bistro',
    createdAt: new Date().toISOString()
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9t006',
    title: 'High-Speed Fiber Internet & Electricity',
    amount: 2100,
    type: 'expense',
    category: 'Utilities',
    paymentMethod: 'UPI',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    notes: 'Monthly broadband wifi and electricity bill',
    createdAt: new Date().toISOString()
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9t007',
    title: 'Mutual Fund SIP & Index Investment',
    amount: 5000,
    type: 'expense',
    category: 'Investments',
    paymentMethod: 'Net Banking',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    notes: 'Monthly systematic investment plan into index funds',
    createdAt: new Date().toISOString()
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9t008',
    title: 'IMAX Cinema & Streaming Subscriptions',
    amount: 950,
    type: 'expense',
    category: 'Entertainment',
    paymentMethod: 'Card',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    notes: 'Movie tickets and monthly media streaming services',
    createdAt: new Date().toISOString()
  }
];

let memoryTransactions = [...defaultTransactions];

// Calculate summary stats helper
const calculateSummary = (items) => {
  const totalIncome = items
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalExpense = items
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalBalance = totalIncome - totalExpense;

  const savingsRate = totalIncome > 0
    ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100))
    : 0;

  return {
    totalIncome,
    totalExpense,
    totalBalance,
    savingsRate
  };
};

// @route   GET /api/transactions
// @desc    Get all transactions with filters, search, and summary stats
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { type, category, paymentMethod, search, sort } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = {};
      const count = await Transaction.countDocuments();
      if (count === 0) {
        await Transaction.insertMany(defaultTransactions.map(({ _id, ...rest }) => rest));
      }

      if (type && type !== 'All') {
        query.type = type.toLowerCase();
      }

      if (category && category !== 'All') {
        query.category = category;
      }

      if (paymentMethod && paymentMethod !== 'All') {
        query.paymentMethod = paymentMethod;
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { notes: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } }
        ];
      }

      let sortOption = { date: -1 };
      if (sort === 'amount_desc') sortOption = { amount: -1 };
      if (sort === 'amount_asc') sortOption = { amount: 1 };
      if (sort === 'date_asc') sortOption = { date: 1 };
      if (sort === 'title') sortOption = { title: 1 };

      const allItemsForSummary = await Transaction.find({});
      const summary = calculateSummary(allItemsForSummary);

      const transactions = await Transaction.find(query).sort(sortOption);

      return res.status(200).json({
        success: true,
        count: transactions.length,
        summary,
        data: transactions
      });
    } else {
      // In-Memory Fallback
      let result = [...memoryTransactions];

      if (type && type !== 'All') {
        result = result.filter((t) => t.type.toLowerCase() === type.toLowerCase());
      }

      if (category && category !== 'All') {
        result = result.filter((t) => t.category.toLowerCase() === category.toLowerCase());
      }

      if (paymentMethod && paymentMethod !== 'All') {
        result = result.filter((t) => t.paymentMethod === paymentMethod);
      }

      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (t) =>
            t.title.toLowerCase().includes(s) ||
            (t.notes && t.notes.toLowerCase().includes(s)) ||
            t.category.toLowerCase().includes(s)
        );
      }

      if (sort === 'amount_desc') result.sort((a, b) => b.amount - a.amount);
      else if (sort === 'amount_asc') result.sort((a, b) => a.amount - b.amount);
      else if (sort === 'date_asc') result.sort((a, b) => new Date(a.date) - new Date(b.date));
      else if (sort === 'title') result.sort((a, b) => a.title.localeCompare(b.title));
      else result.sort((a, b) => new Date(b.date) - new Date(a.date));

      const summary = calculateSummary(memoryTransactions);

      return res.status(200).json({
        success: true,
        count: result.length,
        summary,
        data: result,
        mode: 'fallback'
      });
    }
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch transactions', error: error.message });
  }
});

// @route   GET /api/transactions/:id
// @desc    Get single transaction by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const item = await Transaction.findById(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Transaction not found' });
      return res.status(200).json({ success: true, data: item });
    } else {
      const item = memoryTransactions.find((t) => t._id === req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Transaction not found' });
      return res.status(200).json({ success: true, data: item });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/transactions
// @desc    Create a new transaction (POST)
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, amount, type, category, paymentMethod, date, notes } = req.body;

    if (!title || !amount || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, amount, and category are required'
      });
    }

    const payload = {
      title,
      amount: Math.abs(parseFloat(amount)),
      type: type || 'expense',
      category,
      paymentMethod: paymentMethod || 'UPI',
      date: date ? new Date(date) : new Date(),
      notes: notes || '',
      user: req.user ? req.user._id : null
    };

    if (mongoose.connection.readyState === 1) {
      const transaction = await Transaction.create(payload);
      return res.status(201).json({ success: true, message: 'Transaction logged successfully', data: transaction });
    } else {
      const newTransaction = {
        _id: 'txn_' + Date.now(),
        ...payload,
        createdAt: new Date().toISOString()
      };
      memoryTransactions.unshift(newTransaction);
      return res.status(201).json({ success: true, message: 'Transaction logged successfully (Memory Mode)', data: newTransaction });
    }
  } catch (error) {
    console.error('Create transaction error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/transactions/:id
// @desc    Update a transaction (PUT)
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let item = await Transaction.findById(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Transaction not found' });

      item = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      return res.status(200).json({ success: true, message: 'Transaction updated successfully', data: item });
    } else {
      const idx = memoryTransactions.findIndex((t) => t._id === req.params.id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Transaction not found' });

      memoryTransactions[idx] = { ...memoryTransactions[idx], ...req.body };
      return res.status(200).json({ success: true, message: 'Transaction updated successfully', data: memoryTransactions[idx] });
    }
  } catch (error) {
    console.error('Update transaction error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/transactions/:id
// @desc    Delete a transaction (DELETE)
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const item = await Transaction.findById(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Transaction not found' });

      await Transaction.findByIdAndDelete(req.params.id);
      return res.status(200).json({ success: true, message: 'Transaction deleted successfully' });
    } else {
      const idx = memoryTransactions.findIndex((t) => t._id === req.params.id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Transaction not found' });

      memoryTransactions.splice(idx, 1);
      return res.status(200).json({ success: true, message: 'Transaction deleted successfully' });
    }
  } catch (error) {
    console.error('Delete transaction error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/transactions/seed
// @desc    Reset / Seed default monthly transactions
// @access  Public
router.post('/seed', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await Transaction.deleteMany();
      const seeded = await Transaction.insertMany(defaultTransactions.map(({ _id, ...rest }) => rest));
      return res.status(201).json({ success: true, message: 'Financial ledger seeded with sample transactions', data: seeded });
    } else {
      memoryTransactions = [...defaultTransactions];
      return res.status(201).json({ success: true, message: 'Transactions reset to sample data', data: memoryTransactions });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
