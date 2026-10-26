import React from 'react';
import { Wallet, TrendingUp, TrendingDown, Percent, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCards({ summary }) {
  const { totalIncome = 0, totalExpense = 0, totalBalance = 0, savingsRate = 0 } = summary || {};

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Balance Card */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-850 p-5 rounded-2xl border border-slate-800 shadow-xl overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Balance</span>
          <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-emerald-400">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {formatCurrency(totalBalance)}
        </div>
        <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1 font-mono">
          <span className="text-emerald-400">Net Liquidity</span> &bull; Current Cash Flow
        </div>
      </div>

      {/* Total Income Card */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-850 p-5 rounded-2xl border border-slate-800 shadow-xl overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Income</span>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">
          +{formatCurrency(totalIncome)}
        </div>
        <div className="mt-2 text-[11px] text-emerald-400/80 flex items-center gap-1 font-mono">
          <ArrowUpRight className="w-3.5 h-3.5" /> Salary, Freelance & Gains
        </div>
      </div>

      {/* Monthly Expenses Card */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-850 p-5 rounded-2xl border border-slate-800 shadow-xl overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Expenses</span>
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 tracking-tight">
          -{formatCurrency(totalExpense)}
        </div>
        <div className="mt-2 text-[11px] text-rose-400/80 flex items-center gap-1 font-mono">
          <ArrowDownRight className="w-3.5 h-3.5" /> Bills, Food, Rent & Utilities
        </div>
      </div>

      {/* Savings Rate Card */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-850 p-5 rounded-2xl border border-slate-800 shadow-xl overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Savings Rate</span>
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Percent className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 tracking-tight">
          {savingsRate}%
        </div>
        {/* Visual Progress Bar */}
        <div className="mt-2.5 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-teal-400 to-cyan-400 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, savingsRate))}%` }}
          />
        </div>
      </div>
    </div>
  );
}
