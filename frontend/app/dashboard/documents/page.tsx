'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { CaseDocument } from '@/lib/types';
import { FileText, Download, Trash2, ExternalLink, Loader2, Search } from 'lucide-react';

export default function MyDocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadDocs() {
      try {
        const res = await fetch('/api/cases');
        if (res.ok) {
          const data = await res.json();
          const allDocs: any[] = [];
          (data.cases || []).forEach((c: any) => {
            (c.documents || []).forEach((d: any) => {
              allDocs.push({
                ...d,
                caseNumber: c.case_number,
                productName: c.product_name,
                caseId: c.id
              });
            });
          });
          setDocuments(allDocs);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadDocs();
  }, []);

  const filtered = documents.filter(d =>
    d.file_name.toLowerCase().includes(search.toLowerCase()) ||
    d.category.toLowerCase().includes(search.toLowerCase()) ||
    d.caseNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#1c2b14] text-stone-100 overflow-hidden">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-gradient-to-br from-[#1c2b14] via-[#213518] to-[#162410]">
        <DashboardHeader
          title="My Compliance Documents"
          subtitle="Central repository of uploaded electricity bills, fuel invoices, lab test certs and supplier records"
        />

        <main className="p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 text-[#1c2b14]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search documents or cases..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Total Documents: <b className="text-slate-800">{documents.length}</b>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                <span>Loading documents...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                No compliance documents found matching your search.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-3.5">Document Name</th>
                      <th className="px-6 py-3.5">Category</th>
                      <th className="px-6 py-3.5">Compliance Case</th>
                      <th className="px-6 py-3.5">File Size</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map(doc => (
                      <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-2.5 font-bold text-slate-900">
                          <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{doc.file_name}</span>
                        </td>
                        <td className="px-6 py-4 capitalize text-slate-600">
                          {doc.category.replace(/_/g, ' ')}
                        </td>
                        <td className="px-6 py-4">
                          <Link href={`/dashboard/cases/${doc.caseId}`} className="font-semibold text-emerald-700 hover:underline">
                            {doc.caseNumber}
                          </Link>
                          <div className="text-[10px] text-slate-400 truncate max-w-[180px]">{doc.productName}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-mono">
                          {(doc.file_size / 1024).toFixed(0)} KB
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Extracted
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/dashboard/cases/${doc.caseId}`}
                            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
                          >
                            <span>Inspect</span>
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

