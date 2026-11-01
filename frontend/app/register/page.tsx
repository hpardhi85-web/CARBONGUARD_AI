'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Loader2, AlertCircle, User, Mail, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.username.trim()) {
      setError('Please provide a user name.');
      return;
    }

    if (!formData.email.trim()) {
      setError('Please provide a valid email ID.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      // 1. Call Route Handler using Supabase Admin for instant account creation
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed. Please try again.');
      }

      // 2. Direct Supabase client sign-in
      try {
        await supabase.auth.signInWithPassword({
          email: formData.email.trim(),
          password: formData.password,
        });
      } catch (authErr) {
        console.warn('Client signIn note:', authErr);
      }

      // 3. Persist local user session
      localStorage.setItem('carbongaurd_user', JSON.stringify({
        email: formData.email.trim(),
        fullName: formData.username.trim(),
        username: formData.username.trim(),
        companyName: `${formData.username.trim()} Exporters`,
      }));

      // 4. Navigate to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1c2b14] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle organic radial aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        {/* Asterisk Logo */}
        <Link href="/" className="inline-flex items-center gap-2 group mb-4">
          <div className="w-8 h-8 flex items-center justify-center text-white group-hover:rotate-45 transition-transform duration-500">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
              <line x1="12" y1="2" x2="12" y2="22" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
              <circle cx="12" cy="12" r="3" fill="white" />
            </svg>
          </div>
          <span className="font-serif text-2xl tracking-wider font-semibold text-white">
            CARBON<span className="font-light opacity-80">GUARD</span>
          </span>
        </Link>

        <h2 className="font-serif text-3xl font-normal text-white tracking-tight">
          Create Exporter Account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#f4f7f2] py-8 px-6 shadow-2xl rounded-3xl border border-white/20 sm:px-10 text-[#1c2b14]">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div className="leading-snug">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Field 1: User Name */}
            <div>
              <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                User Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="e.g. PardhaSaradhi"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-white border border-stone-300 text-stone-900 focus:outline-none focus:border-[#1c2b14] focus:ring-1 focus:ring-[#1c2b14] transition-all"
                />
              </div>
            </div>

            {/* Field 2: Email ID */}
            <div>
              <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                Email ID *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. pardha@company.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-white border border-stone-300 text-stone-900 focus:outline-none focus:border-[#1c2b14] focus:ring-1 focus:ring-[#1c2b14] transition-all"
                />
              </div>
            </div>

            {/* Field 3: Password */}
            <div>
              <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-white border border-stone-300 text-stone-900 focus:outline-none focus:border-[#1c2b14] focus:ring-1 focus:ring-[#1c2b14] transition-all"
                />
              </div>
              <p className="mt-1 text-[10px] text-stone-500">Minimum 6 characters</p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-full text-xs font-semibold text-white bg-[#1c2b14] hover:bg-[#283e1d] shadow-md shadow-[#1c2b14]/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:scale-[1.01]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting to Supabase...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Replaced 'SECURED WITH SUPABASE POSTGRESQL' with direct Log In link */}
          <div className="mt-6 pt-5 border-t border-stone-200 text-center">
            <p className="text-xs text-stone-600">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-[#1c2b14] hover:text-[#283e1d] underline underline-offset-2 transition-colors">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
