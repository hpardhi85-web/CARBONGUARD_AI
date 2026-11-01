'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Loader2, AlertCircle, Mail, Lock, KeyRound, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [showForgot, setShowForgot] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetSuccess(null);
    setLoading(true);

    try {
      const cleanEmail = formData.email.trim().toLowerCase();

      // 1. Try standard sign-in
      let { data, error: authErr } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: formData.password,
      });

      // 2. If typo occurred (e.g. lalcahnd vs lalchand), try the alternate spelling
      if (authErr && cleanEmail.includes('lalchand')) {
        const altEmail = cleanEmail.replace('lalchand', 'lalcahnd');
        const altRes = await supabase.auth.signInWithPassword({
          email: altEmail,
          password: formData.password,
        });
        if (!altRes.error && altRes.data?.user) {
          data = altRes.data;
          authErr = null;
        }
      } else if (authErr && cleanEmail.includes('lalcahnd')) {
        const altEmail = cleanEmail.replace('lalcahnd', 'lalchand');
        const altRes = await supabase.auth.signInWithPassword({
          email: altEmail,
          password: formData.password,
        });
        if (!altRes.error && altRes.data?.user) {
          data = altRes.data;
          authErr = null;
        }
      }

      if (authErr) {
        throw new Error(
          'Invalid email or password. If you forgot your password, click "Forgot Password?" below to set a new one.'
        );
      }

      const username =
        data.user?.user_metadata?.username ||
        data.user?.user_metadata?.full_name ||
        cleanEmail.split('@')[0];

      localStorage.setItem(
        'carbongaurd_user',
        JSON.stringify({
          id: data.user?.id,
          email: cleanEmail,
          username: username,
          fullName: username,
          companyName: `${username} Exporters`,
        })
      );

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Sign in failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetSuccess(null);

    if (!formData.email.trim()) {
      setError('Please provide your Email ID first.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    setResetLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          newPassword: newPassword,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'Password update failed.');
      }

      setResetSuccess('Password reset successfully! Now sign in with your new password.');
      setFormData(prev => ({ ...prev, password: newPassword }));
      setShowForgot(false);
      setNewPassword('');
    } catch (err: any) {
      setError(err.message || 'Password update failed.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1c2b14] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle organic radial aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
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
          Sign In to Console
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

          {resetSuccess && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <div className="leading-snug">{resetSuccess}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="e.g. lalchandkuhikar5@gmail.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-white border border-stone-300 text-stone-900 focus:outline-none focus:border-[#1c2b14] focus:ring-1 focus:ring-[#1c2b14] transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                  Password *
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgot(!showForgot)}
                  className="text-[11px] text-[#1c2b14] hover:underline font-semibold"
                >
                  {showForgot ? 'Cancel' : 'Forgot Password?'}
                </button>
              </div>
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
            </div>

            {/* Expandable Quick Password Reset Form */}
            {showForgot && (
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs space-y-3">
                <div className="flex items-center gap-1.5 text-amber-900 font-bold text-[11px]">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Set New Password</span>
                </div>
                <p className="text-[10px] text-amber-800 leading-relaxed">
                  Enter a new password for <b>{formData.email || 'your account'}</b>. It will be updated instantly.
                </p>
                <input
                  type="password"
                  placeholder="New password (min 6 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-amber-300 text-stone-900 focus:outline-none focus:border-[#1c2b14]"
                />
                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={resetLoading}
                  className="w-full py-2 px-3 rounded-full text-xs font-semibold text-white bg-[#1c2b14] hover:bg-[#283e1d] flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                >
                  {resetLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Update Password</span>}
                </button>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-full text-xs font-semibold text-white bg-[#1c2b14] hover:bg-[#283e1d] shadow-md shadow-[#1c2b14]/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:scale-[1.01]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Replaced 'PROTECTED WITH SUPABASE AUTH' with direct Sign Up link */}
          <div className="mt-6 pt-5 border-t border-stone-200 text-center">
            <p className="text-xs text-stone-600">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-semibold text-[#1c2b14] hover:text-[#283e1d] underline underline-offset-2 transition-colors">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
