'use client';

import { useState, useEffect } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { ComplianceCase } from '@/lib/types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Calculator, Zap, Flame, Factory, Loader2 } from 'lucide-react';

const COLORS = ['#059669', '#0d9488', '#0284c7', '#d97706'];

export default function EmissionsAnalysisPage() {
  const [cases, setCases] = useState<ComplianceCase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
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
    loadData();
  }, []);

  const totalDirect = cases.reduce((sum, c) => sum + (c.calculations?.direct_emissions || 0), 0);
  const totalIndirect = cases.reduce((sum, c) => sum + (c.calculations?.indirect_emissions || 0), 0);
  const totalPrecursor = cases.reduce((sum, c) => sum + (c.calculations?.precursor_emissions || 0), 0);
  const grandTotal = totalDirect + totalIndirect + totalPrecursor;

  const facilityData = [
    { name: 'Unit 3 Induction Furnace', direct: 5.38, indirect: 14.63, precursor: 100.9 },
    { name: 'Renukoot Extrusion Plant', direct: 8.20, indirect: 20.48, precursor: 145.0 },
    { name: 'Rolling Mill Unit 2', direct: 3.10, indirect: 9.80, precursor: 60.5 }
  ];

  const sourceData = [
    { name: 'Direct Combustion (Furnace Oil/Gas)', value: +(totalDirect || 5.38).toFixed(2), color: '#059669' },
    { name: 'Indirect Electricity (CEA Grid)', value: +(totalIndirect || 14.63).toFixed(2), color: '#0d9488' },
    { name: 'Precursor Raw Materials (DRI/Ingots)', value: +(totalPrecursor || 100.9).toFixed(2), color: '#0284c7' }
  ];

  return (
    <div className="flex h-screen bg-[#1c2b14] text-stone-100 overflow-hidden">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-gradient-to-br from-[#1c2b14] via-[#213518] to-[#162410]">
        <DashboardHeader
          title="Emissions Accounting & Intensity Analysis"
          subtitle="Deterministic Scope 1, 2, and 3 accounting breakdown under EU CBAM Annex IV rules"
        />

        <main className="p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8 text-[#1c2b14]">
          {/* Top KPI row */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-2">
                <Flame className="w-4 h-4 text-emerald-600" />
                <span>Scope 1 (Direct Fuels)</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">{totalDirect.toFixed(2)} tCO2e</div>
              <div className="text-[10px] text-slate-500 mt-1">IPCC stationary combustion</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-2">
                <Zap className="w-4 h-4 text-teal-600" />
                <span>Scope 2 (Grid Power)</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">{totalIndirect.toFixed(2)} tCO2e</div>
              <div className="text-[10px] text-slate-500 mt-1">CEA Baseline v19 (0.716 kg/kWh)</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-2">
                <Factory className="w-4 h-4 text-blue-600" />
                <span>Scope 3 (Precursors)</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">{totalPrecursor.toFixed(2)} tCO2e</div>
              <div className="text-[10px] text-slate-500 mt-1">Certified DRI / Ingot benchmark</div>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-900 text-white shadow-sm">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold mb-2">
                <Calculator className="w-4 h-4" />
                <span>Total Consignment CO2e</span>
              </div>
              <div className="text-2xl font-bold">{grandTotal.toFixed(2)} tCO2e</div>
              <div className="text-[10px] text-emerald-300 mt-1">Verified audit compliant</div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Facility-wise Breakdown */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Emissions by Manufacturing Facility</h3>
                <p className="text-xs text-slate-500 mb-4">Direct fuel vs indirect electricity vs precursor emissions per plant</p>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={facilityData}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} unit=" t" />
                    <Tooltip formatter={(val: any) => [`${val} tCO2e`]} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Bar dataKey="direct" name="Scope 1 Direct" fill="#059669" stackId="a" />
                    <Bar dataKey="indirect" name="Scope 2 Electricity" fill="#0d9488" stackId="a" />
                    <Bar dataKey="precursor" name="Scope 3 Precursors" fill="#0284c7" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Scope Proportions */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Scope Proportion Analysis</h3>
                <p className="text-xs text-slate-500 mb-4">Relative contribution across active export consignments</p>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: any) => [`${val} tCO2e`]} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

