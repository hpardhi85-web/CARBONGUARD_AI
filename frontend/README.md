# CarbonGuard AI — Next.js 16 Frontend Web Application

The interactive web console for **CarbonGuard AI**, an autonomous multi-agent EU CBAM carbon compliance platform tailored for Indian MSME exporters.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```
Fill in your Supabase, Gemini AI, and EmailJS API keys.

### 3. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 📦 Key Dependencies
- **Framework**: Next.js 16.4.3 (Turbopack) & React 19
- **Styling**: Tailwind CSS 4 with bespoke `#1c2b14` editorial design palette
- **Icons**: Lucide React
- **Data Visualizations**: Recharts Area & Intensity Charts
- **Cloud & State**: Supabase Client (`@supabase/supabase-js`)
- **Forms & Validation**: React Hook Form, Zod

---

## 🌟 Frontend Features
1. **Interactive AI Companion ("What's on your mind today?")**:
   - Quick action pill for CEA v19 Indian power grid emission factors ($0.7160\text{ tCO}_2/\text{MWh}$).
   - Sandbox Planted Error detection trap.
   - 1-click official audit-ready EU CBAM Declaration PDF download via Supabase Cloud Storage.
   - Autonomous supplier email outreach dispatch.
2. **Autonomous Multi-Agent Mesh Hub**:
   - Live state graph visualization connecting all 6 specialized agents.
   - Zero-hallucination verbatim dialogue inspector with raw JSON payload validation.
3. **Traceable Document Ingestion**:
   - Audits industrial invoices, mill test certs, and smart meter time-series CSVs (35,040 rows).
   - Real-time gap analysis and tokenized supplier upload portal (`/supplier/upload`).
