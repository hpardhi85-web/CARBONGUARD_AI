'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import {
  ArrowRight,
  Loader2,
  AlertCircle,
  Building2,
  Package,
  Truck,
  Mail,
  User,
  Phone,
  MapPin
} from 'lucide-react';

const CBAM_CATEGORIES = [
  { name: 'Iron and Steel', defaultCn: '7214 20 00', desc: 'Bars, rods, billets, structural steel, wire rods' },
  { name: 'Aluminium', defaultCn: '7604 10 10', desc: 'Unwrought ingots, extrusions, bars, plates' },
  { name: 'Cement', defaultCn: '2523 10 00', desc: 'Clinker, grey portland cement, aluminous cement' },
  { name: 'Fertilizers', defaultCn: '3102 10 00', desc: 'Urea, ammonia, nitric acid, potassium nitrates' },
  { name: 'Hydrogen', defaultCn: '2804 10 00', desc: 'Electrolytic or natural gas SMR hydrogen' }
];

export default function NewCasePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('');
  const [currentUserName, setCurrentUserName] = useState<string>('');

  const [formData, setFormData] = useState({
    // 1. Sender / User Details
    user_name: 'Lalchand Kuhikar',
    company_contact: '',
    company_name: 'Apex Forgings & Steel Products Pvt Ltd',
    company_phone: '+91 98140 55432',
    facility_location: 'Ludhiana Industrial Focal Point, Punjab, India',
    manufacturing_facility: 'Unit 3 Induction Furnace Plant',

    // 2. Export Product & Consignment
    product_name: 'Hot-Rolled Structural Alloy Steel Rebars (Fe500D)',
    product_category: 'Iron and Steel',
    product_grade: 'Fe500D High Ductility',
    product_quantity: '48.66',
    quantity_unit: 'MT',
    manufacturing_period: 'Q1 2026',
    destination_country: 'Germany',
    cbam_classification: '7214 20 00',

    // 3. Recipient / Supplier Details (Where outreach is received)
    supplier_company: 'Deccan Sponge Iron & Power Ltd',
    supplier_contact_person: '',
    supplier_email: '',
    supplier_phone: '+91 94221 88301',
    outreach_authorized: true,

    // Hidden Defaults for Database Schema Compatibility
    buyer_company: 'EU Importer GmbH',
    buyer_contact_person: 'European Buyer Desk',
    buyer_email: 'buyer@cbam-import.eu',
    reporting_period: 'Q1 2026',
    reporting_year: 2026,
    reporting_route: 'Standard EU CBAM Route (Annex IV)',
    additional_remarks: 'Export lot prepared for EU CBAM declaration.'
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('carbongaurd_user');
      if (stored) {
        const u = JSON.parse(stored);
        const email = u.email || '';
        const name = u.fullName || u.username || (email ? email.split('@')[0] : 'Exporter');
        setCurrentUserEmail(email);
        setCurrentUserName(name);

        if (email) {
          setFormData(prev => ({
            ...prev,
            user_name: name,
            company_contact: email,
            supplier_email: email, // Default recipient to logged-in user for immediate testing
            supplier_contact_person: `${name} (Supplier Desk)`
          }));
        }
      }
    } catch {}
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cat = e.target.value;
    const item = CBAM_CATEGORIES.find(c => c.name === cat);
    setFormData(prev => ({
      ...prev,
      product_category: cat,
      cbam_classification: item ? item.defaultCn : prev.cbam_classification
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          supplier_contact_person: formData.supplier_contact_person || (formData.supplier_company ? `${formData.supplier_company} Team` : 'Supplier Partner'),
          company_contact: formData.company_contact || currentUserEmail
        })
      });

      if (!res.ok) {
        throw new Error('Failed to create compliance case.');
      }

      const data = await res.json();
      const newCaseId = data.case.id;

      // Navigate directly to the upload data section
      router.push(`/dashboard/cases/${newCaseId}/documents`);
    } catch (err: any) {
      setError(err.message || 'Error creating case');
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#1c2b14] text-stone-100 overflow-hidden">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-gradient-to-br from-[#1c2b14] via-[#213518] to-[#162410]">
        <DashboardHeader
          title="Create New Compliance Case"
          subtitle="Configure sender & recipient details, then proceed to document upload"
        />

        <main className="p-6 lg:p-8 max-w-4xl mx-auto w-full text-[#1c2b14]">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Sender / User Information */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-emerald-800">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900">1. Sender & Exporter Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    User / Sender Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="user_name"
                      required
                      value={formData.user_name}
                      onChange={handleChange}
                      placeholder="e.g. Lalchand Kuhikar"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Sender Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="company_contact"
                      required
                      value={formData.company_contact || currentUserEmail}
                      onChange={handleChange}
                      placeholder="e.g. lalchandkuhikar5@gmail.com"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    required
                    value={formData.company_name}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Contact Phone Number *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="company_phone"
                      required
                      value={formData.company_phone}
                      onChange={handleChange}
                      placeholder="e.g. +91 98140 55432"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Origin / Export Location *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="facility_location"
                      required
                      value={formData.facility_location}
                      onChange={handleChange}
                      placeholder="e.g. Ludhiana Industrial Focal Point, Punjab, India"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Data Recipient / Upstream Supplier (Where data/request is received) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-emerald-800">
                  <Truck className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-base font-bold text-slate-900">2. Data Recipient / Upstream Supplier</h2>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  Target for Outreach Agent
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Recipient / Supplier Company Name *
                  </label>
                  <input
                    type="text"
                    name="supplier_company"
                    required
                    value={formData.supplier_company}
                    onChange={handleChange}
                    placeholder="e.g. Deccan Sponge Iron & Power Ltd"
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Recipient Email Address (Where Request Is Received) *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="supplier_email"
                      required
                      value={formData.supplier_email || currentUserEmail}
                      onChange={handleChange}
                      placeholder="e.g. lalchandkuhikar5@gmail.com"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              </div>

              {currentUserEmail && (
                <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50/80 p-3 rounded-lg border border-blue-200">
                  <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    <b>Outreach Target:</b> If raw material data is missing, request email will be received at: <span className="font-mono font-bold">{formData.supplier_email || currentUserEmail}</span>.
                  </span>
                </div>
              )}
            </div>

            {/* Note: Section 4 (European Importer / Buyer) has been completely removed as requested */}

            {/* Submit Action Button -> Directly opens Document Upload Page */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving & Opening Upload Section...</span>
                  </>
                ) : (
                  <>
                    <span>Submit & Proceed to Document Upload</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
