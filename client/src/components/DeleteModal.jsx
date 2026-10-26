import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

export default function DeleteModal({ isOpen, onClose, onConfirm, transaction, loading }) {
  if (!isOpen || !transaction) return null;

  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(transaction.amount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">
          <h3 className="text-base font-bold text-slate-100">Delete Entry (DELETE)</h3>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            Are you sure you want to delete <span className="font-semibold text-slate-200">"{transaction.title}"</span> for{' '}
            <span className="font-semibold text-slate-200">{formattedAmount}</span> ({transaction.category})? This will permanently remove it from MongoDB and update your account balance.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(transaction._id)}
            disabled={loading}
            className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg shadow-rose-600/30 transition flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>{loading ? 'Deleting...' : 'Delete Entry'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
