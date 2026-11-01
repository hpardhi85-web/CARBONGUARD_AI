'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { Mail, Clock, CheckCircle2, AlertTriangle, ExternalLink, Loader2 } from 'lucide-react';

export default function SupplierRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRequests() {
      try {
        const res = await fetch('/api/cases');
        if (res.ok) {
          const data = await res.json();
          const reqs: any[] = [];
          (data.cases || []).forEach((c: any) => {
            if (c.supplier_request) {
              reqs.push({
                ...c.supplier_request,
                caseId: c.id,
                caseNumber: c.case_number,
                productName: c.product_name,
                supplierCompany: c.supplier_company,
                supplierEmail: c.supplier_email,
                caseStatus: c.status
              });
            }
          });
          setRequests(reqs);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadRequests();
  }, []);

  return (
    <div className="flex h-screen bg-[#1c2b14] text-stone-100 overflow-hidden">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-gradient-to-br from-[#1c2b14] via-[#213518] to-[#162410]">
        <DashboardHeader
          title="Supplier Data Outreach Requests"
          subtitle="Autonomous agent email tracking, secure tokenized links, and supplier response status"
        />

        <main className="p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 text-[#1c2b14]">
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 leading-relaxed">
            <b>How Supplier Outreach Works:</b> The Outreach Agent automatically emails upstream suppliers with dedicated encrypted links when precursor emissions are missing. Suppliers can upload records or report data unavailable without seeing company internal data.
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                <span>Loading supplier outreach requests...</span>
              </div>
            ) : requests.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                No active supplier outreach requests.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-3.5">Supplier Company</th>
                      <th className="px-6 py-3.5">Supplier Contact / Email</th>
                      <th className="px-6 py-3.5">Case Reference</th>
                      <th className="px-6 py-3.5">Dispatched Date</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-right">Portal Link</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {requests.map(req => (
                      <tr key={req.token} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900">
                          {req.supplierCompany}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-800">{req.supplier_name || 'Contact'}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{req.supplierEmail}</div>
                        </td>
                        <td className="px-6 py-4">
                          <Link href={`/dashboard/cases/${req.caseId}`} className="font-semibold text-emerald-700 hover:underline">
                            {req.caseNumber}
                          </Link>
                          <div className="text-[10px] text-slate-400 truncate max-w-[160px]">{req.productName}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-mono">
                          {new Date(req.sent_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            req.caseStatus === 'verified'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {req.caseStatus === 'verified' ? 'Submitted & Ingested' : 'Pending Response'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/supplier/upload?token=${req.token}`}
                            target="_blank"
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 inline-flex items-center gap-1 transition-colors"
                          >
                            <span>Open Portal</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

