'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  MailCheck,
  BarChart3,
  ShieldCheck,
  FileCheck2,
  Settings,
  LogOut,
  HelpCircle,
  Briefcase
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const DOCK_ITEMS = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'New Case', href: '/dashboard/cases/new', icon: PlusCircle },
  { name: 'My Cases', href: '/dashboard', icon: Briefcase },
  { name: 'Documents', href: '/dashboard/documents', icon: FileText },
  { name: 'Supplier Outreach', href: '/dashboard/supplier-requests', icon: MailCheck },
  { name: 'Emissions Analysis', href: '/dashboard/emissions', icon: BarChart3 },
  { name: 'Audit Verification', href: '/dashboard/verification', icon: ShieldCheck },
  { name: 'Reports', href: '/dashboard/reports', icon: FileCheck2 },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    localStorage.removeItem('carbongaurd_user');
    router.push('/login');
  };

  return (
    <aside className="w-20 md:w-20 bg-[#162210] border-r border-[#24361b] flex flex-col items-center py-6 justify-between shrink-0 z-40 transition-all select-none">
      {/* Brand Icon with Glow (Image 5 Style) */}
      <div className="flex flex-col items-center gap-6">
        <Link href="/" className="group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#22c55e] to-[#15803d] flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform duration-300">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-6 h-6">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
        </Link>

        {/* Icon Dock Items */}
        <nav className="flex flex-col items-center gap-3">
          {DOCK_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                title={item.name}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-[#22c55e] text-white shadow-md shadow-emerald-500/25'
                    : 'text-stone-400 hover:text-white hover:bg-[#24361b]'
                }`}
              >
                <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                {/* Floating tooltip on hover */}
                <span className="absolute left-14 px-2.5 py-1 rounded-md bg-[#1c2b14] border border-[#2d4420] text-white text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg z-50">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions: Settings & Logout */}
      <div className="flex flex-col items-center gap-3 pt-4 border-t border-[#24361b] w-full">
        <Link
          href="/dashboard/settings"
          title="Settings"
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-stone-400 hover:text-white hover:bg-[#24361b] transition-all group relative"
        >
          <Settings className="w-5 h-5 transition-transform group-hover:rotate-45" />
          <span className="absolute left-14 px-2.5 py-1 rounded-md bg-[#1c2b14] border border-[#2d4420] text-white text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg z-50">
            Settings
          </span>
        </Link>

        <button
          onClick={handleLogout}
          title="Sign Out"
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-rose-400 hover:text-white hover:bg-rose-950/60 transition-all group relative"
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
          <span className="absolute left-14 px-2.5 py-1 rounded-md bg-rose-950 border border-rose-800 text-rose-200 text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg z-50">
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
}
