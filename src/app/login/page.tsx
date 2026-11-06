'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMeherban } from '@/context/MeherbanContext';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Store,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  LogOut,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const {
    authRole,
    currentSeller,
    adminLogin,
    sellerLogin,
    logout,
    addToast,
  } = useMeherban();

  const [portalMode, setPortalMode] = useState<'SELLER' | 'ADMIN'>('SELLER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleModeChange = (mode: 'SELLER' | 'ADMIN') => {
    setPortalMode(mode);
    setErrorMessage(null);
    setEmail('');
    setPassword('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!password.trim()) {
      setErrorMessage('পাসওয়ার্ড লিখুন।');
      return;
    }

    setLoading(true);

    try {
      if (portalMode === 'ADMIN') {
        const success = adminLogin(password);
        if (success) {
          addToast('সুপার অ্যাডমিন হিসেবে সফলভাবে লগইন হয়েছেন!', 'success');
          router.push('/admin');
          return;
        } else {
          setErrorMessage('ভুল অ্যাডমিন পাসওয়ার্ড! সঠিক পাসওয়ার্ড দিয়ে আবার চেষ্টা করুন।');
        }
      } else {
        if (!email.trim()) {
          setErrorMessage('অনুগ্রহ করে বিক্রেতার ইমেইল লিখুন।');
          return;
        }
        const success = sellerLogin(email.trim(), password);
        if (success) {
          addToast('বিক্রেতা অ্যাকাউন্টে সফলভাবে লগইন হয়েছেন!', 'success');
          router.push('/seller');
          return;
        } else {
          setErrorMessage('ভুল ইমেইল অথবা পাসওয়ার্ড! সঠিক তথ্য দিয়ে আবার চেষ্টা করুন।');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex flex-col justify-center items-center px-4 py-12">
      {/* Back to Storefront Link */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-black transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>ওয়েবসাইটে ফিরে যান (Storefront)</span>
        </Link>

        <span className="text-[11px] font-mono text-neutral-400">MEHERBAN SECURE AUTH</span>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-neutral-200/90 overflow-hidden">
        {/* Brand Header */}
        <div className="p-6 sm:p-8 bg-neutral-950 text-white text-center select-none">
          <div className="w-12 h-12 rounded-xl bg-white/10 text-amber-400 border border-white/15 mx-auto mb-3 flex items-center justify-center">
            {portalMode === 'SELLER' ? (
              <Store className="w-6 h-6 stroke-[1.8]" />
            ) : (
              <ShieldCheck className="w-6 h-6 stroke-[1.8] text-emerald-400" />
            )}
          </div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-[0.2em] uppercase">
            MEHERBAN
          </h1>
          <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-400 mt-1 font-mono">
            MANAGEMENT PORTAL LOGIN
          </p>
        </div>

        {/* Already Logged In Banner */}
        {authRole && (
          <div className="p-4 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                আপনি ইতিমধ্যে <strong>{authRole === 'SELLER' ? (currentSeller?.shopName || 'Seller') : 'Super Admin'}</strong> হিসেবে লগইন আছেন।
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={authRole === 'SELLER' ? '/seller' : '/admin'}
                className="px-2.5 py-1 bg-emerald-700 text-white rounded font-medium hover:bg-emerald-800 transition-colors"
              >
                ড্যাশবোর্ডে যান
              </Link>
              <button
                type="button"
                onClick={logout}
                className="p-1 text-neutral-500 hover:text-rose-600 transition-colors"
                title="লগআউট"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-5">
          {/* Role Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-neutral-100 rounded-xl">
            <button
              type="button"
              onClick={() => handleModeChange('SELLER')}
              className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                portalMode === 'SELLER'
                  ? 'bg-white text-neutral-950 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-amber-600" />
              <span>বিক্রেতা (Seller)</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeChange('ADMIN')}
              className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                portalMode === 'ADMIN'
                  ? 'bg-white text-neutral-950 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>অ্যাডমিন (Admin)</span>
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Clean Production Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {portalMode === 'SELLER' && (
              <div>
                <label className="block font-semibold text-neutral-800 mb-1">
                  বিক্রেতার ইমেইল (Seller Email)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="আপনার নিবন্ধিত ইমেইল লিখুন"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-neutral-300 focus:border-black focus:ring-1 focus:ring-black outline-none bg-white text-neutral-900"
                  />
                </div>
              </div>
            )}

            {portalMode === 'ADMIN' && (
              <div>
                <label className="block font-semibold text-neutral-800 mb-1">
                  অ্যাডমিন ইউজার / ইমেইল
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="অ্যাডমিন ইউজারনেম বা ইমেইল"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-neutral-300 focus:border-black focus:ring-1 focus:ring-black outline-none bg-white text-neutral-900"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-neutral-800">
                  পাসওয়ার্ড (Password)
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="পাসওয়ার্ড লিখুন..."
                  className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-neutral-300 focus:border-black focus:ring-1 focus:ring-black outline-none bg-white text-neutral-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 p-1 text-neutral-400 hover:text-neutral-700"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-neutral-950 hover:bg-black disabled:bg-neutral-400 text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>{loading ? 'যাচাই করা হচ্ছে...' : `${portalMode === 'SELLER' ? 'বিক্রেতা' : 'অ্যাডমিন'} পোর্টালে প্রবেশ করুন`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-3 border-t border-neutral-100 text-[11px] text-neutral-500">
            <p>
              নিরাপদ অভ্যন্তরীণ ম্যানেজমেন্ট পোর্টাল।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
