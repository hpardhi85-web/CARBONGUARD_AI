'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { ComplianceCase } from '@/lib/types';
import { FileCheck2, Download, Share2, CheckCircle2, ExternalLink, Loader2 } from 'lucide-react';

export default function ReportsPage() {
  const [cases, setCases] = useState<ComplianceCase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCases() {
      try {
        const res = await fetch('/api/cases');
        if (res.ok) {
          const data = await res.json();
          setCases(data.cases || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadCases();
  }, []);

  const reportedCases = cases.filter(c => !!c.audit_report);

  return (
    <div className="flex h-screen bg-[#1c2b14] text-stone-100 overflow-hidden">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-gradient-to-br from-[#1c2b14] via-[#213518] to-[#162410]">
        <DashboardHeader
          title="Generated Compliance Certificates & Reports"
          subtitle="Audit-ready PDF documents generated via ReportLab with complete source document traceability"
        />

        <main className="p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 text-[#1c2b14]">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                <span>Loading report certificates...</span>
              </div>
            ) : reportedCases.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                No reports compiled yet. Complete verification to generate official reports.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {reportedCases.map(c => {
                  const r = c.audit_report!;
                  return (
                    <div key={r.report_id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                          <FileCheck2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">{r.file_name}</h3>
                          <div className="text-xs text-slate-600 mt-0.5">
                            Product: <b>{c.product_name}</b> ({c.product_quantity} {c.quantity_unit})
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                            <span>Ref: <b className="font-mono">{r.report_id}</b></span>
                            <span>•</span>
                            <span>Certified Intensity: <b className="text-emerald-700">{c.calculations?.emissions_intensity} tCO2e/MT</b></span>
                            <span>•</span>
                            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded border border-indigo-200">
                              ✨ {r.generated_by || 'Google Gemini AI'}
                            </span>
                            <span className="text-[10px] bg-teal-50 text-teal-700 font-bold px-1.5 py-0.5 rounded border border-teal-200">
                              ☁️ Supabase Cloud Storage
                            </span>
                            <span>•</span>
                            <span>{new Date(r.generated_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <a
                          href={r.supabase_url || r.download_url || `/api/reports/download/${r.file_name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download PDF (Supabase)</span>
                        </a>

                        <Link
                          href={`/report/verify?caseId=${c.id}`}
                          target="_blank"
                          className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition-colors"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Buyer View</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

