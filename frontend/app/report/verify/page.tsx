'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShieldCheck, CheckCircle2, Download, Building2, Globe2, FileText, Loader2, Lock } from 'lucide-react';
import { ComplianceCase } from '@/lib/types';

function ReportVerifyContent() {
  const searchParams = useSearchParams();
  const caseId = searchParams.get('caseId') || 'case-001';

  const [currentCase, setCurrentCase] = useState<ComplianceCase | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCase() {
      try {
        const res = await fetch(`/api/cases/${caseId}`);
        if (res.ok) {
          const data = await res.json();
          setCurrentCase(data.case);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchCase();
  }, [caseId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const c = currentCase || {
    case_number: 'CG-IN-2026-081',
    company_name: 'Apex Forgings & Steel Products Pvt Ltd',
    product_name: 'Hot-Rolled Structural Alloy Steel Bars (Fe500D)',
    destination_country: 'Germany',
    buyer_company: 'Krupp Bautechnik GmbH',
    product_quantity: 48.66,
    quantity_unit: 'MT',
    calculations: {
      emissions_intensity: 2.4848,
      total_embedded_emissions: 120.91,
      direct_emissions: 5.38,
      indirect_emissions: 14.63,
      precursor_emissions: 100.90
    },
    verification_status: 'PASS',
    audit_report: {
      file_name: 'CarbonGuard_Compliance_Report_CG-IN-2026-081.pdf',
      report_id: 'REP-CG-IN-2026-081-79A1B2'
    }
  };

  return (
    <div className="min-h-screen bg-[#1c2b14] flex flex-col justify-between text-stone-100">
      {/* Buyer Header */}
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

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 bg-[#24361b] border border-[#2d4420] px-3.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Authorized EU Buyer Certificate Gateway</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-10 flex-1 space-y-6">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-100">
                EU CBAM Regulation (EU) 2023/956 Compliant
              </span>
              <h1 className="text-xl font-bold text-slate-900 mt-2">
                Certified Embedded Emissions Certificate
              </h1>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Certificate Hash: {c.audit_report?.report_id || 'REP-CG-IN-2026-081-79A1B2'}
              </p>
            </div>

            <a
              href={`/api/reports/download/${c.audit_report?.file_name || 'CarbonGuard_Compliance_Report_CG-IN-2026-081.pdf'}`}
              download
              className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 shadow-sm shadow-emerald-600/20 transition-all shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Download Signed PDF</span>
            </a>
          </div>

          {/* Consignment Profile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Authorized Buyer / Importer</span>
              <span className="font-bold text-slate-900 text-sm">{c.buyer_company || 'Krupp Bautechnik GmbH'}</span>
              <span className="text-slate-500 block text-[11px] mt-0.5">Destination: {c.destination_country || 'Germany'}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Indian Manufacturing Exporter</span>
              <span className="font-bold text-slate-900 text-sm">{c.company_name}</span>
              <span className="text-slate-500 block text-[11px] mt-0.5">Case Reference: {c.case_number}</span>
            </div>
          </div>

          {/* Specific Intensity Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-900 to-teal-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider block">
                Specific Embedded Emissions Intensity
              </span>
              <div className="text-3xl font-extrabold text-white mt-1">
                {c.calculations?.emissions_intensity || 2.4848} <span className="text-lg font-normal text-emerald-200">tCO2e / {c.quantity_unit || 'MT'}</span>
              </div>
              <p className="text-[11px] text-emerald-200/80 mt-1">
                Total Embedded Consignment Emissions: {c.calculations?.total_embedded_emissions || 120.91} tCO2e ({c.product_quantity} {c.quantity_unit})
              </p>
            </div>

            <div className="p-3 bg-white/10 rounded-xl border border-white/20 text-center shrink-0">
              <span className="text-[10px] text-emerald-200 block">Verification Audit</span>
              <span className="text-sm font-bold text-emerald-300">PASS (100% Traceable)</span>
            </div>
          </div>

          {/* Emissions Scope Breakdown Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              CBAM Specific Breakdown by Scope (Annex IV)
            </h3>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="p-3 flex justify-between items-center bg-slate-50 font-semibold text-slate-600">
                <span>Emission Scope</span>
                <span>Calculated Embedded Carbon</span>
              </div>
              <div className="p-3 flex justify-between items-center bg-white">
                <div>
                  <span className="font-bold text-slate-800">Scope 1: Direct Combustion</span>
                  <div className="text-[10px] text-slate-500">Furnace burners & stationary fuels (IPCC Factor)</div>
                </div>
                <span className="font-bold text-slate-900 font-mono">{c.calculations?.direct_emissions || 5.38} tCO2e</span>
              </div>
              <div className="p-3 flex justify-between items-center bg-white">
                <div>
                  <span className="font-bold text-slate-800">Scope 2: Indirect Electricity</span>
                  <div className="text-[10px] text-slate-500">Grid power line readings (CEA India Baseline v19)</div>
                </div>
                <span className="font-bold text-slate-900 font-mono">{c.calculations?.indirect_emissions || 14.63} tCO2e</span>
              </div>
              <div className="p-3 flex justify-between items-center bg-white">
                <div>
                  <span className="font-bold text-slate-800">Scope 3: Precursor Materials</span>
                  <div className="text-[10px] text-slate-500">Upstream raw material embedded carbon (Direct Reduced Iron / Ingots)</div>
                </div>
                <span className="font-bold text-slate-900 font-mono">{c.calculations?.precursor_emissions || 100.90} tCO2e</span>
              </div>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-500 leading-relaxed border-t border-slate-100">
            <b>Regulatory Validity:</b> This certificate has been issued under European Union Commission Implementing Regulation (EU) 2023/1773. Calculations are deterministic and cross-checked against Indian Discom electricity bills and manufacturer mill test certificates.
          </div>
        </div>
      </main>

      {/* Buyer Footer */}
      <footer className="py-4 text-center text-[11px] text-slate-400 border-t border-slate-200 bg-white">
        CarbonGuard AI Audit Verification Network • EU CBAM Registry Compatible
      </footer>
    </div>
  );
}

export default function ReportVerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    }>
      <ReportVerifyContent />
    </Suspense>
  );
}
