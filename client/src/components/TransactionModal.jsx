import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const CATEGORIES = [
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
];

const PAYMENT_METHODS = ['UPI', 'Card', 'Cash', 'Net Banking'];

export default function TransactionModal({ isOpen, onClose, onSave, editingTxn }) {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: 'Dining',
    paymentMethod: 'UPI',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTxn) {
      setFormData({
        title: editingTxn.title || '',
        amount: editingTxn.amount || '',
        type: editingTxn.type || 'expense',
        category: editingTxn.category || 'Dining',
        paymentMethod: editingTxn.paymentMethod || 'UPI',
        date: editingTxn.date ? new Date(editingTxn.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        notes: editingTxn.notes || ''
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        type: 'expense',
        category: 'Dining',
        paymentMethod: 'UPI',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
    }
    setError('');
  }, [editingTxn, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.amount || Number(formData.amount) <= 0) {
      setError('Please provide a valid title and positive amount.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onSave(formData, editingTxn?._id);
      onClose();
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Accent Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-400" />
              {editingTxn ? 'Edit Entry (PUT)' : 'Record Transaction (POST)'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {editingTxn ? 'Update entry details and recalculate balances' : 'Log a new income credit or expense debit'}
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Income vs Expense Pill Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-800/80 rounded-xl">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'expense', category: formData.category === 'Salary' || formData.category === 'Freelance' ? 'Dining' : formData.category })}
              className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition ${
                formData.type === 'expense'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowDownRight className="w-4 h-4" />
              <span>Expense (Debit)</span>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'income', category: 'Salary' })}
              className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition ${
                formData.type === 'income'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Income (Credit)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Transaction Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Monthly Rent / Client Invoice"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-800/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Amount (₹ INR) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="e.g. 5000"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-800/80 border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500 transition font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-800/80 border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500 transition"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-slate-900">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Payment Method
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-800/80 border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500 transition"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m} className="bg-slate-900">
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Date
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-800/80 border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500 transition font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Remarks & Notes (Optional)
            </label>
            <textarea
              rows="2"
              placeholder="e.g. Split with roomate or transaction reference ID"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-800/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
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
              className="px-5 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-2 font-bold"
            >
              {loading && <span className="animate-spin">⏳</span>}
              <span>{editingTxn ? 'Save Changes' : 'Confirm Entry'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
