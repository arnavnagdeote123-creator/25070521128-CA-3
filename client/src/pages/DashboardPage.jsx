import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import StatCards from '../components/StatCards';
import TransactionRow from '../components/TransactionRow';
import TransactionModal from '../components/TransactionModal';
import DeleteModal from '../components/DeleteModal';
import { transactionsAPI } from '../services/api';
import { Search, SlidersHorizontal, Wallet, ArrowDownRight, ArrowUpRight, Filter, PieChart, Sparkles } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Salary',
  'Freelance',
  'Investments',
  'Rent',
  'Groceries',
  'Dining',
  'Entertainment',
  'Utilities',
  'Health',
  'Transport'
];

const TYPE_TABS = [
  { id: 'All', label: 'All Transactions' },
  { id: 'expense', label: 'Expenses Only' },
  { id: 'income', label: 'Income Only' }
];

export default function DashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    totalBalance: 0,
    savingsRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTxn, setEditingTxn] = useState(null);
  const [deletingTxn, setDeletingTxn] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await transactionsAPI.getAll({
        type: selectedType,
        category: selectedCategory,
        paymentMethod: selectedPaymentMethod,
        search,
        sort: sortBy
      });
      if (res.success && res.data) {
        setTransactions(res.data);
        if (res.summary) {
          setSummary(res.summary);
        }
      }
    } catch (err) {
      showNotification(err.message || 'Error fetching transactions', 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedType, selectedCategory, selectedPaymentMethod, search, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTransactions();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchTransactions]);

  // Handle Create or Update
  const handleSaveTransaction = async (txnData, id) => {
    if (id) {
      // PUT (Update)
      await transactionsAPI.update(id, txnData);
      showNotification('Transaction updated successfully!');
    } else {
      // POST (Create)
      await transactionsAPI.create(txnData);
      showNotification('New transaction logged to ledger!');
    }
    fetchTransactions();
  };

  // Handle Delete
  const handleConfirmDelete = async (id) => {
    try {
      setActionLoading(true);
      await transactionsAPI.delete(id);
      setIsDeleteOpen(false);
      setDeletingTxn(null);
      showNotification('Transaction deleted from ledger');
      fetchTransactions();
    } catch (err) {
      showNotification(err.message || 'Failed to delete transaction', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Seed
  const handleSeedData = async () => {
    try {
      setActionLoading(true);
      await transactionsAPI.seed();
      showNotification('Sample monthly ledger seeded successfully!');
      fetchTransactions();
    } catch (err) {
      showNotification(err.message || 'Seeding failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (txn) => {
    setEditingTxn(txn);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingTxn(null);
    setIsModalOpen(true);
  };

  const openDeleteModal = (txn) => {
    setDeletingTxn(txn);
    setIsDeleteOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Navbar */}
      <Navbar
        onOpenAddModal={openAddModal}
        onSeedData={handleSeedData}
        isSeeding={actionLoading}
      />

      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl border text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-4 duration-300 ${
            notification.type === 'error'
              ? 'bg-rose-950/90 border-rose-500/40 text-rose-300'
              : 'bg-emerald-950/90 border-emerald-500/40 text-emerald-300'
          }`}
        >
          <span>{notification.message}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Dynamic Financial Stat Cards */}
        <StatCards summary={summary} />

        {/* Transaction Type Tabs */}
        <section aria-label="Transaction Type Filter" className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6 overflow-x-auto">
          {TYPE_TABS.map((tab) => {
            const isActive = selectedType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedType(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-850'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </section>

        {/* Search & Filter Toolbar */}
        <section aria-label="Filter Toolbar" className="space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search transaction, remarks, or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-900/90 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition shadow-inner"
              />
            </div>

            {/* Payment Method & Sort Selectors */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
              <select
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="px-3 py-2 text-xs sm:text-sm bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500 transition cursor-pointer"
              >
                <option value="All">All Payment Modes</option>
                <option value="UPI">UPI</option>
                <option value="Card">Debit / Credit Card</option>
                <option value="Cash">Cash</option>
                <option value="Net Banking">Net Banking</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-xs sm:text-sm bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500 transition cursor-pointer"
              >
                <option value="newest">Sort: Date (Newest First)</option>
                <option value="date_asc">Sort: Date (Oldest First)</option>
                <option value="amount_desc">Sort: Amount (High to Low)</option>
                <option value="amount_asc">Sort: Amount (Low to High)</option>
                <option value="title">Sort: Title (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:bg-slate-850'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Ledger List */}
        <section aria-label="Transaction Ledger" className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-2">
            <span>Showing {transactions.length} record(s)</span>
            <span>Ledger Currency: INR (₹)</span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="bg-slate-900/40 rounded-2xl p-4 border border-slate-800 animate-pulse h-18" />
              ))}
            </div>
          ) : transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((txn) => (
                <TransactionRow
                  key={txn._id}
                  txn={txn}
                  onEdit={openEditModal}
                  onDelete={openDeleteModal}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16 px-4 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800 max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/80 flex items-center justify-center mx-auto mb-4 text-emerald-400">
                <Wallet className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-200">No transactions recorded yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Start tracking by recording your first income or expense, or seed sample monthly data.
              </p>
              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  onClick={openAddModal}
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition font-bold"
                >
                  Add First Entry
                </button>
                <button
                  onClick={handleSeedData}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl transition"
                >
                  Seed Sample Ledger
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Add / Edit Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTxn(null);
        }}
        onSave={handleSaveTransaction}
        editingTxn={editingTxn}
      />

      {/* Delete Transaction Modal */}
      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingTxn(null);
        }}
        onConfirm={handleConfirmDelete}
        transaction={deletingTxn}
        loading={actionLoading}
      />
    </div>
  );
}
