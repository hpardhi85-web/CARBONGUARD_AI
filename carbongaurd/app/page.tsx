'use client';

import Link from 'next/link';
import { ArrowRight, ChevronRight, CheckCircle2, Shield, Sparkles, FileText, BarChart3, Database } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfcf9] text-[#1c2b14]">
      <Navbar />

      {/* Hero Section — Styled after Image 1 (KORE Editorial Landscape) */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-36 overflow-hidden">
        {/* Fine-art textured landscape background with sage and moss tones */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#c2d1bd]/70 via-[#d7e1d3]/50 to-[#fbfcf9] pointer-events-none" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#1c2b14_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
          {/* Editorial Serif Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-[#1c2b14] leading-[1.08] max-w-4xl">
            We empower Indian exporters that focus on clarity and sustainable growth.
          </h1>

          {/* Subtitle */}
          <p className="mt-8 text-base sm:text-lg md:text-xl text-stone-600 font-light max-w-2xl leading-relaxed">
            Architecting the intelligent multi-agent systems and deterministic models that drive tomorrow&apos;s MSME market leaders to European carbon clarity.
          </p>

          {/* Action Row */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/register"
              className="px-7 py-3.5 rounded-full text-xs uppercase tracking-wider font-semibold text-white bg-[#1c2b14] hover:bg-[#283e1d] shadow-md shadow-[#1c2b14]/20 flex items-center gap-2.5 transition-all hover:scale-[1.02]"
            >
              <span>Initialize Platform</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="px-7 py-3.5 rounded-full text-xs uppercase tracking-wider font-semibold text-[#1c2b14] bg-white/80 hover:bg-white border border-stone-300/80 shadow-sm transition-all"
            >
              Explore Live Console
            </Link>
          </div>
        </div>
      </section>

      {/* Four Core Pillars — Styled after Image 2 */}
      <section id="features" className="py-24 bg-[#f4f6f1] border-y border-stone-200/80">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="max-w-3xl mb-16">
            <h2 className="text-2xl sm:text-3xl font-normal text-stone-700 leading-snug">
              We help Indian exporters build aligned and efficient operating models by combining{' '}
              <span className="text-[#1c2b14] font-medium">strategic compliance insight</span> with the right{' '}
              <span className="text-[#1c2b14] font-medium">multi-agent enabling technologies</span>.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Strategic Clarity */}
            <div className="bg-white rounded-2xl p-8 border border-stone-200/70 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group hover:-translate-y-1">
              <div className="w-16 h-16 mb-8 text-[#1c2b14] flex items-center justify-center group-hover:scale-110 transition-transform">
                {/* 8-point starburst */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-10 h-10">
                  <line x1="12" y1="2" x2="12" y2="22" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                  <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
                  <circle cx="12" cy="12" r="2.5" fill="#1c2b14" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-medium text-[#1c2b14]">Strategic Clarity</h3>
              <p className="mt-2 text-xs text-stone-500 font-light leading-relaxed">
                Autonomous extraction across power bills, invoices, fuel logs, and test certificates.
              </p>
            </div>

            {/* Card 2: Structural Advantage */}
            <div className="bg-white rounded-2xl p-8 border border-stone-200/70 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group hover:-translate-y-1">
              <div className="w-16 h-16 mb-8 text-[#1c2b14] flex items-center justify-center group-hover:scale-110 transition-transform">
                {/* 6-point cross star */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-10 h-10">
                  <line x1="12" y1="3" x2="12" y2="21" />
                  <line x1="4.2" y1="7.5" x2="19.8" y2="16.5" />
                  <line x1="4.2" y1="16.5" x2="19.8" y2="7.5" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-medium text-[#1c2b14]">Structural Advantage</h3>
              <p className="mt-2 text-xs text-stone-500 font-light leading-relaxed">
                Autonomous email outreach for supplier precursor data with tokenized verification links.
              </p>
            </div>

            {/* Card 3: Industry Foresight */}
            <div className="bg-white rounded-2xl p-8 border border-stone-200/70 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group hover:-translate-y-1">
              <div className="w-16 h-16 mb-8 text-[#1c2b14] flex items-center justify-center group-hover:scale-110 transition-transform">
                {/* Multi-spoke asterisk */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-10 h-10">
                  <line x1="12" y1="2" x2="12" y2="22" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                  <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
                  <line x1="7" y1="2" x2="17" y2="22" />
                  <line x1="2" y1="7" x2="22" y2="17" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-medium text-[#1c2b14]">Industry Foresight</h3>
              <p className="mt-2 text-xs text-stone-500 font-light leading-relaxed">
                Deterministic EU CBAM Annex IV calculation with official CEA v19 Indian grid factors.
              </p>
            </div>

            {/* Card 4: Computational Precision */}
            <div className="bg-white rounded-2xl p-8 border border-stone-200/70 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group hover:-translate-y-1">
              <div className="w-16 h-16 mb-8 text-[#1c2b14] flex items-center justify-center group-hover:scale-110 transition-transform">
                {/* 4-arrow convergence */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-10 h-10">
                  <path d="M5 5l4 4m0 0H5m4 0V5" />
                  <path d="M19 5l-4 4m0 0h4m-4 0V5" />
                  <path d="M5 19l4-4m0 0H5m4 0v4" />
                  <path d="M19 19l-4-4m0 0h4m-4 0v4" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-medium text-[#1c2b14]">Computational Precision</h3>
              <p className="mt-2 text-xs text-stone-500 font-light leading-relaxed">
                Independent cross-document verifier agent that detects inconsistencies and planted errors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Realized Potential & Tangible Outcomes — Styled after Image 3 (Deep #1c2b14 Palette) */}
      <section id="outcomes" className="py-24 bg-[#1c2b14] text-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[#2d4420] gap-6">
            <div>
              <span className="text-xs font-mono text-emerald-400 tracking-wider uppercase">Tangible Impact</span>
              <h2 className="font-serif text-3xl sm:text-5xl font-normal text-white mt-2 tracking-tight">
                Realized Potential &amp; <br />Tangible Outcomes
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-300 font-light max-w-md leading-relaxed">
              We measure our success by the tangible velocity and clarity we inject into our clients&apos; carbon reporting and customs clearance operations.
            </p>
          </div>

          {/* 4 Editorial White Cards with Badges & Large Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Outcome Card 1 */}
            <div className="bg-[#f8faf6] rounded-2xl p-7 text-[#1c2b14] shadow-lg flex flex-col justify-between hover:shadow-2xl transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-serif text-xl font-medium text-[#1c2b14]">Strategic Clarity</h3>
                  <span className="text-[10px] font-mono tracking-widest px-2.5 py-1 rounded bg-stone-200/80 text-stone-700 font-semibold">
                    CBAM-01
                  </span>
                </div>
                <p className="text-xs text-stone-600 font-light leading-relaxed mb-6">
                  Re-architecting unstructured factory paperwork into machine-verified emission inventories with PyMuPDF and OCR.
                </p>

                <div className="flex items-baseline gap-3 mb-6">
                  <span className="font-serif text-5xl font-semibold tracking-tight text-[#1c2b14]">40%</span>
                  <span className="text-xs text-stone-500 font-medium leading-tight">
                    Reduction in<br />Preparation Latency
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200/80 space-y-2 text-[11px] text-stone-600 font-light">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-stone-400 font-medium">01</span>
                  <span>Automated multi-format invoice and electricity bill extraction</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-stone-400 font-medium">02</span>
                  <span>Instant identification of missing emission parameters</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-stone-400 font-medium">03</span>
                  <span>Full page-level source citation mapping</span>
                </div>
              </div>
            </div>

            {/* Outcome Card 2 */}
            <div className="bg-[#f8faf6] rounded-2xl p-7 text-[#1c2b14] shadow-lg flex flex-col justify-between hover:shadow-2xl transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-serif text-xl font-medium text-[#1c2b14]">Supply Chain Outreach</h3>
                  <span className="text-[10px] font-mono tracking-widest px-2.5 py-1 rounded bg-stone-200/80 text-stone-700 font-semibold">
                    OUT-X
                  </span>
                </div>
                <p className="text-xs text-stone-600 font-light leading-relaxed mb-6">
                  Autonomous outreach agent contacting raw-material suppliers to eliminate default fallback penalty taxes.
                </p>

                <div className="flex items-baseline gap-3 mb-6">
                  <span className="font-serif text-5xl font-semibold tracking-tight text-[#1c2b14]">100%</span>
                  <span className="text-xs text-stone-500 font-medium leading-tight">
                    Supplier Inquiry<br />Audit Traceability
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200/80 space-y-2 text-[11px] text-stone-600 font-light">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-stone-400 font-medium">01</span>
                  <span>Direct tokenized supplier upload portal</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-stone-400 font-medium">02</span>
                  <span>Precursor emission verification upon receipt</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-stone-400 font-medium">03</span>
                  <span>Automated gentle follow-up triggers</span>
                </div>
              </div>
            </div>

            {/* Outcome Card 3 */}
            <div className="bg-[#f8faf6] rounded-2xl p-7 text-[#1c2b14] shadow-lg flex flex-col justify-between hover:shadow-2xl transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-serif text-xl font-medium text-[#1c2b14]">Deterministic Calculations</h3>
                  <span className="text-[10px] font-mono tracking-widest px-2.5 py-1 rounded bg-stone-200/80 text-stone-700 font-semibold">
                    CEA-19
                  </span>
                </div>
                <p className="text-xs text-stone-600 font-light leading-relaxed mb-6">
                  100% deterministic mathematical execution using official CEA Indian Grid (0.716 tCO2/MWh) &amp; IPCC factors.
                </p>

                <div className="flex items-baseline gap-3 mb-6">
                  <span className="font-serif text-5xl font-semibold tracking-tight text-[#1c2b14]">0.0%</span>
                  <span className="text-xs text-stone-500 font-medium leading-tight">
                    Calculation Error<br />or AI Hallucination
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200/80 space-y-2 text-[11px] text-stone-600 font-light">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-stone-400 font-medium">01</span>
                  <span>Pure deterministic Python calculations</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-stone-400 font-medium">02</span>
                  <span>Planted error detection trap to foil tampered documents</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-stone-400 font-medium">03</span>
                  <span>Direct + Indirect + Precursor multi-tier attribution</span>
                </div>
              </div>
            </div>

            {/* Outcome Card 4 */}
            <div className="bg-[#f8faf6] rounded-2xl p-7 text-[#1c2b14] shadow-lg flex flex-col justify-between hover:shadow-2xl transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-serif text-xl font-medium text-[#1c2b14]">Customs Clearance</h3>
                  <span className="text-[10px] font-mono tracking-widest px-2.5 py-1 rounded bg-stone-200/80 text-stone-700 font-semibold">
                    REP-04
                  </span>
                </div>
                <p className="text-xs text-stone-600 font-light leading-relaxed mb-6">
                  ReportLab generated audit-ready PDF declaration with cryptographic hash verification for European buyers.
                </p>

                <div className="flex items-baseline gap-3 mb-6">
                  <span className="font-serif text-5xl font-semibold tracking-tight text-[#1c2b14]">12X</span>
                  <span className="text-xs text-stone-500 font-medium leading-tight">
                    Customs Processing<br />Speed &amp; Confidence
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200/80 space-y-2 text-[11px] text-stone-600 font-light">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-stone-400 font-medium">01</span>
                  <span>EU CBAM Registry compliant structure</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-stone-400 font-medium">02</span>
                  <span>Authorized buyer online verification portal</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-stone-400 font-medium">03</span>
                  <span>Cryptographic SHA-256 case document immutability</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
