'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { ComplianceCase } from '@/lib/types';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, Bug, ExternalLink, Loader2 } from 'lucide-react';

export default function VerificationDeskPage() {
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

  return (
    <div className="flex h-screen bg-[#1c2b14] text-stone-100 overflow-hidden">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-gradient-to-br from-[#1c2b14] via-[#213518] to-[#162410]">
        <DashboardHeader
          title="Audit & Verification Desk"
          subtitle="Multi-document reconciliation, arithmetic challenge, and planted error anomaly detection"
        />

        <main className="p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 text-[#1c2b14]">
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
            <b>Verifier Agent Standards:</b> The Verifier Agent operates independently from the Collector and Calculator agents. It verifies arithmetic formulas, checks unit harmonization, validates CEA emission factor geographic applicability, and cross-checks physical documents (invoice vs test certificate vs packing list) to prevent false declarations.
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                <span>Loading verification audit logs...</span>
              </div>
            ) : cases.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                No active compliance cases to audit.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {cases.map(c => {
                  const isPass = c.verification_status === 'PASS';
                  const isFlagged = c.verification_status === 'FLAGGED';

                  return (
                    <div key={c.id} className="p-6 hover:bg-slate-50/50 transition-colors space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900 text-sm">{c.product_name}</h3>
                            <span className="text-[10px] font-mono text-slate-400">({c.case_number})</span>
                          </div>
                          <p className="text-xs text-slate-500">
                            Destination: {c.destination_country} • Buyer: {c.buyer_company} • Consignment: {c.product_quantity} {c.quantity_unit}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                            isPass
                              ? 'bg-emerald-100 text-emerald-800'
                              : isFlagged
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {isPass && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {isFlagged && <XCircle className="w-3.5 h-3.5" />}
                            {!isPass && !isFlagged && <AlertTriangle className="w-3.5 h-3.5" />}
                            <span>Audit: {c.verification_status}</span>
                          </span>

                          <Link
                            href={`/dashboard/cases/${c.id}`}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors inline-flex items-center gap-1"
                          >
                            <span>Inspect Findings</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>

                      {/* Display Audit Checks for this case */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        {c.verification_findings?.findings.slice(0, 4).map((f, fIdx) => (
                          <div
                            key={f.check_id || f.title || (f as any).check_name || `vf-${fIdx}`}
                            className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                              f.status === 'PASSED'
                                ? 'bg-slate-50 border-slate-200'
                                : 'bg-red-50/70 border-red-200'
                            }`}
                          >
                            {f.status === 'PASSED' ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <div className="font-bold text-slate-800">{f.title}</div>
                              <div className="text-[11px] text-slate-600 leading-tight mt-0.5">{f.description}</div>
                            </div>
                          </div>
                        ))}
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

