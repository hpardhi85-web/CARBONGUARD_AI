'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Bell, User, Sparkles } from 'lucide-react';

export default function DashboardHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const [user, setUser] = useState<{ fullName?: string; username?: string; companyName?: string } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('carbongaurd_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const displayName = user?.fullName || user?.username || 'Exporter';

  return (
    <header className="h-18 px-6 lg:px-8 bg-[#162210]/95 backdrop-blur-md border-b border-[#24361b] flex items-center justify-between shrink-0 text-white z-20">
      <div>
        <h1 className="text-lg md:text-xl font-serif font-medium text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-stone-400 font-light">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/cases/new"
          className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#1c2b14] bg-emerald-300 hover:bg-emerald-200 rounded-full shadow-sm shadow-emerald-500/20 transition-all hover:scale-105"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Case</span>
        </Link>

        {/* User Pill */}
        <div className="flex items-center gap-2.5 pl-4 border-l border-[#24361b]">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-serif font-bold text-xs">
            {displayName[0].toUpperCase()}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-white leading-tight">
              {displayName}
            </span>
            <span className="text-[10px] text-stone-400 truncate max-w-[140px]">
              {user?.companyName || 'Apex Forgings & Steel Ltd'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
