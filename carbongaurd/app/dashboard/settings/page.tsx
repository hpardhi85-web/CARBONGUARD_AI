'use client';

import { useState, useEffect } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { Building2, Save, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    fullName: 'Vikram Singhania',
    email: 'v.singhania@apexsteel.in',
    companyName: 'Apex Forgings & Steel Products Pvt Ltd',
    companyType: 'Manufacturer / Exporter (MSME)',
    businessAddress: 'Plot 42, Focal Point Industrial Zone, Ludhiana, Punjab, India',
    gstin: '03AAACA1234F1Z5',
    iecCode: '0308012345',
    udyamRegNo: 'UDYAM-PB-12-0049210',
    contactNumber: '+91 98140 55432',
    defaultCountry: 'Germany'
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('carbongaurd_user');
      if (stored) {
        const u = JSON.parse(stored);
        setProfile(prev => ({
          ...prev,
          fullName: u.fullName || prev.fullName,
          email: u.email || prev.email,
          companyName: u.companyName || prev.companyName
        }));
      }
    } catch {}
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('carbongaurd_user', JSON.stringify({
      fullName: profile.fullName,
      email: profile.email,
      companyName: profile.companyName
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex h-screen bg-[#1c2b14] text-stone-100 overflow-hidden">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-gradient-to-br from-[#1c2b14] via-[#213518] to-[#162410]">
        <DashboardHeader
          title="Company & Exporter Profile Settings"
          subtitle="Manage statutory registration, GSTIN, IEC, and MSME identification credentials"
        />

        <main className="p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-6 text-[#1c2b14]">
          {saved && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Company settings saved successfully!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-emerald-800">
              <Building2 className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">Statutory Exporter Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Representative Full Name
                </label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={e => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Official Business Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={e => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={profile.companyName}
                  onChange={e => setProfile({ ...profile, companyName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Company Type
                </label>
                <input
                  type="text"
                  value={profile.companyType}
                  onChange={e => setProfile({ ...profile, companyType: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  GSTIN
                </label>
                <input
                  type="text"
                  value={profile.gstin}
                  onChange={e => setProfile({ ...profile, gstin: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-600 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Import Export Code (IEC)
                </label>
                <input
                  type="text"
                  value={profile.iecCode}
                  onChange={e => setProfile({ ...profile, iecCode: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-600 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  MSME Udyam Registration No.
                </label>
                <input
                  type="text"
                  value={profile.udyamRegNo}
                  onChange={e => setProfile({ ...profile, udyamRegNo: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-600 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Contact Number
                </label>
                <input
                  type="text"
                  value={profile.contactNumber}
                  onChange={e => setProfile({ ...profile, contactNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Registered Manufacturing Address
                </label>
                <input
                  type="text"
                  value={profile.businessAddress}
                  onChange={e => setProfile({ ...profile, businessAddress: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

