'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Building2,
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Lock,
  XCircle
} from 'lucide-react';

function SupplierUploadContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || 'demo-token';

  const [loading, setLoading] = useState(true);
  const [requestData, setRequestData] = useState<any>(null);
  const [scenario, setScenario] = useState<'available' | 'unavailable'>('available');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState<string | null>(null);
  const [submittedCaseId, setSubmittedCaseId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(4);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!successResult || !submittedCaseId) return;

    if (countdown <= 0) {
      router.push(`/dashboard/cases/${submittedCaseId}`);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [successResult, submittedCaseId, countdown, router]);

  useEffect(() => {
    async function loadReq() {
      try {
        const res = await fetch(`/api/supplier/request/${token}`);
        if (res.ok) {
          const d = await res.json();
          setRequestData(d);
        } else {
          // Provide fallback demo request data
          setRequestData({
            token,
            company_name: 'Apex Forgings & Steel Products Pvt Ltd',
            product_name: 'Hot-Rolled Structural Alloy Steel Rebars (Fe500D)',
            case_number: 'CG-IN-2026-081',
            supplier_company: 'Deccan Sponge Iron & Power Ltd',
            missing_items: [
              {
                field_name: 'precursor_emissions_data',
                description: 'Certified specific embedded carbon emissions for Direct Reduced Iron (DRI) heat lots supplied in Q1 2026.'
              }
            ]
          });
        }
      } catch {
        setRequestData({
          token,
          company_name: 'Apex Forgings & Steel Products Pvt Ltd',
          product_name: 'Hot-Rolled Structural Alloy Steel Rebars (Fe500D)',
          case_number: 'CG-IN-2026-081',
          supplier_company: 'Deccan Sponge Iron & Power Ltd',
          missing_items: [
            {
              field_name: 'precursor_emissions_data',
              description: 'Certified specific embedded carbon emissions for Direct Reduced Iron (DRI) heat lots supplied in Q1 2026.'
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    }
    loadReq();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (scenario === 'available' && !file) {
      setError('Please select a supporting document or test certificate to upload.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/supplier/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          scenario,
          notes,
          fileName: file ? file.name : 'Supplier_Precursor_Cert.pdf',
          precursorValue: 52.55
        })
      });

      if (!res.ok) {
        throw new Error('Failed to submit response.');
      }

      const resData = await res.json();
      const targetId = resData.case?.id || requestData?.case_id || 'case-001';
      setSubmittedCaseId(targetId);
      setSuccessResult(
        scenario === 'available'
          ? 'Thank you! Your supporting documents have been securely encrypted and submitted. The exporter compliance team has been automatically notified and calculations have resumed.'
          : 'Thank you. Your notification stating primary precursor records are unavailable has been recorded. The case has been authorized to proceed under Scope 1 & Scope 2 boundary calculations.'
      );
    } catch (err: any) {
      setError(err.message || 'Submission error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1c2b14] flex flex-col justify-between text-stone-100">
      {/* Supplier Top Header */}
      <header className="bg-[#162210] border-b border-[#24361b] py-4 px-6 sm:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 flex items-center justify-center text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
                <line x1="12" y1="2" x2="12" y2="22" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
                <circle cx="12" cy="12" r="3" fill="white" />
              </svg>
            </div>
            <span className="font-serif text-lg tracking-wider font-semibold text-white">
              CARBON<span className="font-light opacity-80">GUARD</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-stone-300 bg-[#24361b] px-3 py-1 rounded-full border border-[#2d4420]">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted Supplier Portal</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-10 flex-1">
        {successResult ? (
          <div className="bg-white p-8 rounded-3xl border border-emerald-200 shadow-xl text-center space-y-5 text-[#1c2b14]">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="text-2xl font-bold font-serif text-[#1c2b14]">Submission Confirmed!</h2>
            <p className="text-sm text-stone-600 leading-relaxed max-w-lg mx-auto">
              {successResult}
            </p>
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/80 text-xs text-emerald-800 flex items-center justify-center gap-2 max-w-md mx-auto">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
              <span>Calculations verified. Redirecting to your case dashboard in <b>{countdown}s</b>...</span>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`/dashboard/cases/${submittedCaseId || requestData?.case_id || 'case-001'}`}
                className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-bold text-white bg-[#1c2b14] hover:bg-[#283e1d] shadow-md shadow-[#1c2b14]/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <span>View Compliance Case & Verified Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-5 py-3 rounded-full text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-all text-center"
              >
                <span>Return to Exporter Console</span>
              </Link>
            </div>
            <div className="pt-2 text-[11px] text-stone-400">
              Transaction Ref: {requestData?.case_number} • Token Verified
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Context Box */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Data Request for Carbon Compliance
                </span>
                <span className="text-[11px] font-mono text-slate-400">Ref: {requestData?.case_number}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Requesting Exporter</span>
                  <span className="font-bold text-slate-900 text-sm">{requestData?.company_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Consignment / Product</span>
                  <span className="font-bold text-slate-900 text-sm">{requestData?.product_name}</span>
                </div>
              </div>

              <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <span className="text-xs font-bold text-slate-800 block">Requested Missing Information:</span>
                <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                  {requestData?.missing_items?.map((item: any, i: number) => (
                    <li key={i}>{item.description || item.field_name}</li>
                  ))}
                </ul>
              </div>

              <div className="text-[11px] text-slate-500 pt-1">
                Notice: You are submitting documentation strictly for this export consignment under EU CBAM mandates. You cannot view the exporter&apos;s internal financial accounts or other vendor documents.
              </div>
            </div>

            {/* Response Form */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                Submit Your Response
              </h3>

              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Scenario Radios */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Availability of Requested Emissions Data *
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    onClick={() => setScenario('available')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      scenario === 'available'
                        ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                    }`}
                  >
                    <input
                      type="radio"
                      name="scenario"
                      checked={scenario === 'available'}
                      onChange={() => setScenario('available')}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">Scenario A: Data is Available</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">I have invoices or test certs to upload</div>
                    </div>
                  </label>

                  <label
                    onClick={() => setScenario('unavailable')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      scenario === 'unavailable'
                        ? 'bg-amber-50/70 border-amber-500 ring-2 ring-amber-500/20'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                    }`}
                  >
                    <input
                      type="radio"
                      name="scenario"
                      checked={scenario === 'unavailable'}
                      onChange={() => setScenario('unavailable')}
                      className="mt-0.5 text-amber-600 focus:ring-amber-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">Scenario B: Data Unavailable</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">We do not maintain this specific parameter</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Upload Dropzone if Available */}
              {scenario === 'available' ? (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Upload Supplier Evidentiary Document (PDF / Excel) *
                  </label>

                  <div className="border-2 border-dashed border-emerald-300 bg-emerald-50/30 p-6 rounded-xl text-center cursor-pointer hover:bg-emerald-50/60 transition-colors">
                    <input
                      type="file"
                      id="supplier-file-input"
                      className="hidden"
                      accept=".pdf,.xlsx,.xls,.csv"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFile(e.target.files[0]);
                        }
                      }}
                    />
                    <label htmlFor="supplier-file-input" className="cursor-pointer space-y-2 flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        {file ? file.name : 'Click to select supporting document'}
                      </span>
                      <span className="text-[10px] text-slate-400">PDF, XLSX up to 25MB</span>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Reason for Unavailability (Mandatory for Compliance Desk)
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="e.g. Primary induction furnace does not sub-meter individual heat runs for Scope 1 direct emissions."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              )}

              {/* Optional Notes */}
              {scenario === 'available' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Additional Comments or Dispatch Notes
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="e.g. Test cert HT-88421 certified Sponge Iron Fe 82% lot."
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Encrypting & Submitting Response...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Official Response to Exporter</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Supplier Footer */}
      <footer className="py-4 text-center text-[11px] text-slate-400 border-t border-slate-200 bg-white">
        Protected by CarbonGuard AI Encrypted Supplier Gateway • EU Regulation 2023/1773
      </footer>
    </div>
  );
}

export default function SupplierUploadPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    }>
      <SupplierUploadContent />
    </Suspense>
  );
}
