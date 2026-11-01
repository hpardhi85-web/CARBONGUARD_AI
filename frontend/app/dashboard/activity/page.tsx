'use client';

import { useState, useEffect } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { ActivityLog } from '@/lib/types';
import { History, RefreshCw, Loader2 } from 'lucide-react';

export default function ActivityHistoryPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="flex h-screen bg-[#1c2b14] text-stone-100 overflow-hidden">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-gradient-to-br from-[#1c2b14] via-[#213518] to-[#162410]">
        <DashboardHeader
          title="Multi-Agent Activity Log"
          subtitle="Complete historical event log of all autonomous agent actions, extractions, emails, and audit checks"
        />

        <main className="p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6 text-[#1c2b14]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Total Events: {logs.length}</span>
            <button
              onClick={fetchLogs}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-emerald-600 bg-white shadow-sm transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            {loading ? (
              <div className="p-12 text-center text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                <span>Loading activity history...</span>
              </div>
            ) : logs.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                No activity records recorded yet.
              </div>
            ) : (
              <div className="flow-root">
                <ul className="-mb-8">
                  {logs.map((log, idx) => (
                    <li key={log.id}>
                      <div className="relative pb-8">
                        {idx !== logs.length - 1 && (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
                        )}
                        <div className="relative flex space-x-3.5">
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-white text-[10px] font-bold ${
                            log.agent_name.includes('Verifier')
                              ? 'bg-purple-100 text-purple-700'
                              : log.agent_name.includes('Calculator')
                              ? 'bg-emerald-100 text-emerald-700'
                              : log.agent_name.includes('Outreach')
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-teal-100 text-teal-700'
                          }`}>
                            {log.agent_name[0]}
                          </span>
                          <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-xs">{log.agent_name}</span>
                                <span className="text-[10px] text-slate-400 font-mono">[{log.action}]</span>
                              </div>
                              <p className="text-xs text-slate-600 mt-0.5">{log.description}</p>
                            </div>
                            <div className="whitespace-nowrap text-right text-[10px] text-slate-400 font-mono">
                              {new Date(log.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

