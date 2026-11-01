'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1c2b14] text-[#f4f6f1] pt-20 pb-12 border-t border-[#2a3f1e]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#2d4320]">
          {/* Brand Info & Mission */}
          <div className="md:col-span-4 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 flex items-center justify-center text-[#f4f6f1]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
                  <line x1="12" y1="2" x2="12" y2="22" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                  <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
                  <circle cx="12" cy="12" r="3.5" fill="#f4f6f1" />
                </svg>
              </div>
              <span className="font-serif text-xl tracking-wider font-semibold text-white">
                CARBON<span className="font-light opacity-80">GUARD</span>
              </span>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed max-w-sm font-light">
              Strategic carbon infrastructure for the next generation of Indian market leaders. Engineered in India, deployed globally across European ports.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-stone-600/60 flex items-center justify-center text-stone-300 hover:text-white hover:border-white transition-colors text-xs font-semibold"
              >
                𝕏
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-stone-600/60 flex items-center justify-center text-stone-300 hover:text-white hover:border-white transition-colors text-xs font-semibold"
              >
                in
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-stone-600/60 flex items-center justify-center text-stone-300 hover:text-white hover:border-white transition-colors text-xs font-semibold"
              >
                🌐
              </a>
            </div>
          </div>

          {/* Protocols / Capabilities */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-serif text-sm text-stone-200 tracking-wide">Protocols</h4>
            <ul className="space-y-2 text-xs text-stone-400 font-light">
              <li><Link href="#features" className="hover:text-stone-200 transition-colors">Diagnostic Audit</Link></li>
              <li><Link href="#agents" className="hover:text-stone-200 transition-colors">Autonomous Outreach</Link></li>
              <li><Link href="#outcomes" className="hover:text-stone-200 transition-colors">Strategic Verifier</Link></li>
              <li><Link href="#cbam" className="hover:text-stone-200 transition-colors">CBAM Deterministic Engine</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-serif text-sm text-stone-200 tracking-wide">Company</h4>
            <ul className="space-y-2 text-xs text-stone-400 font-light">
              <li><Link href="#about" className="hover:text-stone-200 transition-colors">About CarbonGuard</Link></li>
              <li><Link href="#briefings" className="hover:text-stone-200 transition-colors">Regulatory Briefings</Link></li>
              <li className="flex items-center gap-1.5">
                <Link href="#careers" className="hover:text-stone-200 transition-colors">Careers</Link>
                <span className="text-[9px] uppercase px-1.5 py-0.2 bg-[#2d4420] text-emerald-300 rounded font-semibold">Hiring</span>
              </li>
              <li><Link href="#contact" className="hover:text-stone-200 transition-colors">Contact Command</Link></li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-serif text-sm text-stone-200 tracking-wide">Subscribe</h4>
            <p className="text-xs text-stone-400 font-light">
              Receive declassified CBAM compliance doctrines & Indian CEA grid updates quarterly.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="pt-2 flex items-center border-b border-stone-500/60 pb-1.5">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent text-xs text-white placeholder:text-stone-500 focus:outline-none"
              />
              <button type="submit" className="text-stone-300 hover:text-white transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 font-mono tracking-wider gap-4">
          <div>
            © 2026 CARBONGUARD SYSTEMS INC. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-stone-300 transition-colors uppercase">Privacy Policy</Link>
            <Link href="#" className="hover:text-stone-300 transition-colors uppercase">Terms of Service</Link>
            <Link href="#" className="hover:text-stone-300 transition-colors uppercase">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
