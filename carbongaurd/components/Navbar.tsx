'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Navbar() {
  return (
    <div className="fixed top-5 inset-x-0 z-50 px-4 flex justify-center">
      <header className="w-full max-w-3xl rounded-full bg-white/95 backdrop-blur-md border border-stone-200/80 shadow-sm shadow-stone-900/5 px-5 sm:px-6 py-2.5 flex items-center justify-between transition-all">
        {/* Brand Logo with Asterisk Emblem */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-6 h-6 flex items-center justify-center text-[#1c2b14] group-hover:rotate-45 transition-transform duration-500">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
              <line x1="12" y1="2" x2="12" y2="22" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
              <circle cx="12" cy="12" r="3" fill="#1c2b14" />
            </svg>
          </div>
          <span className="font-serif text-base tracking-wider font-semibold text-[#1c2b14]">
            CARBON<span className="font-normal opacity-75">GUARD</span>
          </span>
        </Link>

        {/* Minimalist Centered Navigation Links with Perfect Balanced Proportion */}
        <nav className="hidden sm:flex items-center gap-8 text-[11px] tracking-widest uppercase font-medium text-stone-600">
          <Link href="#features" className="hover:text-[#1c2b14] transition-colors">Platform</Link>
          <Link href="#outcomes" className="hover:text-[#1c2b14] transition-colors">Outcomes</Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/login"
            className="text-xs font-medium text-stone-700 hover:text-[#1c2b14] px-2.5 py-1.5 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-4 py-1.5 text-xs font-semibold text-white bg-[#1c2b14] hover:bg-[#283e1d] rounded-full shadow-sm hover:shadow transition-all duration-200 flex items-center gap-1.5 group"
          >
            <span>Launch Console</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </header>
    </div>
  );
}
