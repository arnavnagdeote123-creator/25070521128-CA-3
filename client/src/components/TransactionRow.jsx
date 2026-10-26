import React from 'react';
import { 
  Briefcase, 
  Home, 
  ShoppingCart, 
  Utensils, 
  Film, 
  Zap, 
  Activity, 
  TrendingUp, 
  CreditCard, 
  Smartphone, 
  Banknote, 
  Landmark, 
  Edit3, 
  Trash2, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';

export default function TransactionRow({ txn, onEdit, onDelete }) {
  // Category icon mapping
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Salary':
      case 'Freelance':
        return <Briefcase className="w-4 h-4 text-emerald-400" />;
      case 'Rent':
        return <Home className="w-4 h-4 text-rose-400" />;
      case 'Groceries':
        return <ShoppingCart className="w-4 h-4 text-amber-400" />;
      case 'Dining':
        return <Utensils className="w-4 h-4 text-orange-400" />;
      case 'Entertainment':
        return <Film className="w-4 h-4 text-purple-400" />;
      case 'Utilities':
        return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'Investments':
        return <TrendingUp className="w-4 h-4 text-cyan-400" />;
      case 'Health':
        return <Activity className="w-4 h-4 text-pink-400" />;
      default:
        return <CreditCard className="w-4 h-4 text-slate-400" />;
    }
  };

  // Payment method icon mapping
  const getPaymentBadge = (method) => {
    switch (method) {
      case 'UPI':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <Smartphone className="w-2.5 h-2.5" /> UPI
          </span>
        );
      case 'Card':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <CreditCard className="w-2.5 h-2.5" /> Card
          </span>
        );
      case 'Net Banking':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Landmark className="w-2.5 h-2.5" /> Net Banking
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Banknote className="w-2.5 h-2.5" /> Cash
          </span>
        );
    }
  };

  const isIncome = txn.type === 'income';

  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(txn.amount);

  const formattedDate = new Date(txn.date || txn.createdAt).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="group bg-slate-900/60 hover:bg-slate-800/80 p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md hover:shadow-xl">
      {/* Left: Icon & Details */}
      <div className="flex items-start sm:items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center shrink-0">
          {getCategoryIcon(txn.category)}
        </div>

        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
              {txn.title}
            </h4>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
              {txn.category}
            </span>
            {getPaymentBadge(txn.paymentMethod)}
          </div>

          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-mono">
            <span>{formattedDate}</span>
            {txn.notes && (
              <>
                <span>&bull;</span>
                <span className="truncate max-w-[200px] sm:max-w-xs italic text-slate-400 font-sans">
                  {txn.notes}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right: Amount & Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
        <div className="text-right">
          <div className={`text-base font-extrabold flex items-center justify-end gap-1 ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isIncome ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            <span>{isIncome ? `+${formattedAmount}` : `-${formattedAmount}`}</span>
          </div>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
            {isIncome ? 'Income' : 'Expense'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 pl-2 border-l border-slate-800">
          <button
            onClick={() => onEdit(txn)}
            title="Edit Transaction (PUT)"
            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(txn)}
            title="Delete Transaction (DELETE)"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
