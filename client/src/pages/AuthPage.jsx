import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Wallet, Lock, Mail, User, ArrowRight, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password });
      } else {
        if (!formData.name.trim()) {
          throw new Error('Please enter your full name');
        }
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setFormData({
      name: 'Financial Evaluator',
      email: 'student@symbiosis.edu',
      password: 'password123'
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 shadow-xl shadow-emerald-500/25 mb-4 ring-1 ring-white/20">
            <Wallet className="w-7 h-7 text-slate-950 font-bold" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            FinWise Tracker
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Full Stack CA-03 Submission &bull; PRN: <span className="text-emerald-400 font-semibold">25070521128</span>
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* Tabs */}
          <div className="flex bg-slate-800/80 p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                isLogin
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                !isLogin
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2.5 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Arnav..."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-800/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="student@symbiosis.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-800/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-800/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2 group active:scale-[0.99]"
            >
              <span>{loading ? 'Authenticating...' : isLogin ? 'Access Financial Dashboard' : 'Open FinWise Account'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handleFillDemo}
              className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Autofill Sample Account</span>
            </button>
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Bank-Grade JWT
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
