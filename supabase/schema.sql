-- ==============================================================================
-- CarbonGuard AI — Complete Supabase Database Schema & Setup Script
-- Project: CarbonGuard AI (EU CBAM Multi-Agent Compliance Platform)
-- Instructions: Run this script in the Supabase Dashboard:
-- SQL Editor -> Click 'New Query' -> Paste this entire script -> Click 'Run'
-- ==============================================================================

-- 0. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. Profiles Table (Synchronized with Supabase auth.users)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company_name TEXT NOT NULL,
  company_type TEXT DEFAULT 'Manufacturer / Exporter (MSME)',
  business_address TEXT,
  country TEXT DEFAULT 'India',
  contact_number TEXT,
  gstin TEXT,
  iec_code TEXT,
  udyam_reg_no TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 2. Compliance Cases Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.compliance_cases (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  case_number TEXT UNIQUE NOT NULL,
  company_name TEXT NOT NULL,
  manufacturing_facility TEXT NOT NULL,
  facility_location TEXT NOT NULL,
  company_contact TEXT,
  product_name TEXT NOT NULL,
  product_category TEXT NOT NULL,
  product_grade TEXT,
  product_quantity NUMERIC NOT NULL,
  quantity_unit TEXT NOT NULL DEFAULT 'MT',
  manufacturing_period TEXT NOT NULL,
  destination_country TEXT NOT NULL,
  cbam_classification TEXT,
  supplier_company TEXT NOT NULL,
  supplier_contact_person TEXT NOT NULL,
  supplier_email TEXT NOT NULL,
  supplier_phone TEXT,
  outreach_authorized BOOLEAN DEFAULT true,
  buyer_company TEXT NOT NULL,
  buyer_contact_person TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  reporting_period TEXT NOT NULL,
  reporting_year INT NOT NULL DEFAULT 2026,
  reporting_route TEXT DEFAULT 'Standard EU CBAM Route',
  additional_remarks TEXT,
  status TEXT DEFAULT 'draft',
  verification_status TEXT DEFAULT 'pending',
  current_agent TEXT DEFAULT 'collector',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 3. Case Documents Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.case_documents (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  case_id TEXT REFERENCES public.compliance_cases(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  category TEXT NOT NULL,
  is_supplier_document BOOLEAN DEFAULT false,
  extraction_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 4. Extracted Fields Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.extracted_fields (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  case_id TEXT REFERENCES public.compliance_cases(id) ON DELETE CASCADE,
  document_id TEXT REFERENCES public.case_documents(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  field_label TEXT NOT NULL,
  extracted_value TEXT NOT NULL,
  numeric_value NUMERIC,
  unit TEXT,
  source_file_name TEXT NOT NULL,
  page_number INT,
  sheet_row TEXT,
  confidence NUMERIC NOT NULL DEFAULT 0.95,
  extraction_timestamp TIMESTAMPTZ DEFAULT now(),
  is_discrepant BOOLEAN DEFAULT false,
  discrepancy_reason TEXT
);

-- ==============================================================================
-- 5. Missing Data Items Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.missing_data_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  case_id TEXT REFERENCES public.compliance_cases(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT DEFAULT 'mandatory',
  is_supplier_data BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'missing',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 6. Supplier Requests Table (External Supplier Token Access)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.supplier_requests (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  case_id TEXT REFERENCES public.compliance_cases(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  supplier_name TEXT NOT NULL,
  supplier_email TEXT NOT NULL,
  email_subject TEXT NOT NULL,
  email_body TEXT NOT NULL,
  missing_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'pending',
  response_notes TEXT,
  sent_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ
);

-- ==============================================================================
-- 7. Calculations Table (EU CBAM Annex IV Emissions Breakdown)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.calculations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  case_id TEXT REFERENCES public.compliance_cases(id) ON DELETE CASCADE,
  methodology TEXT NOT NULL DEFAULT 'EU CBAM Annex IV (Direct + Indirect)',
  direct_emissions NUMERIC NOT NULL,
  indirect_emissions NUMERIC NOT NULL,
  precursor_emissions NUMERIC NOT NULL DEFAULT 0,
  total_embedded_emissions NUMERIC NOT NULL,
  product_quantity NUMERIC NOT NULL,
  quantity_unit TEXT NOT NULL DEFAULT 'MT',
  emissions_intensity NUMERIC NOT NULL,
  calculation_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  emission_factors_used JSONB NOT NULL DEFAULT '{}'::jsonb,
  calculation_timestamp TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 8. Verification Findings Table (Multi-Document Audit Traps)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.verification_findings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  case_id TEXT REFERENCES public.compliance_cases(id) ON DELETE CASCADE,
  overall_status TEXT NOT NULL DEFAULT 'review_required',
  checks_run INT NOT NULL DEFAULT 0,
  checks_passed INT NOT NULL DEFAULT 0,
  checks_flagged INT NOT NULL DEFAULT 0,
  findings JSONB NOT NULL DEFAULT '[]'::jsonb,
  verification_timestamp TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 9. Audit Reports Table (ReportLab PDF Artifacts)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.audit_reports (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  case_id TEXT REFERENCES public.compliance_cases(id) ON DELETE CASCADE,
  report_number TEXT UNIQUE NOT NULL,
  report_version TEXT NOT NULL DEFAULT 'v1.0',
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'verified',
  shared_with_buyer BOOLEAN DEFAULT false,
  buyer_email TEXT,
  buyer_access_token TEXT,
  generated_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 10. Activity Logs Table (Audit Trail)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  case_id TEXT REFERENCES public.compliance_cases(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  agent_name TEXT NOT NULL,
  action TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 11. Triggers and Automated Functions
-- ==============================================================================

-- A. Auto-create Profile record whenever a new user registers in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, company_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'company_name', split_part(NEW.email, '@', 1) || ' Exporters')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- B. Automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_compliance_cases_updated_at ON public.compliance_cases;
CREATE TRIGGER set_compliance_cases_updated_at
  BEFORE UPDATE ON public.compliance_cases
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 12. Row Level Security (RLS) Configuration
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extracted_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missing_data_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Drop any previous policies to allow clean idempotent reruns
DROP POLICY IF EXISTS "Profiles access policy" ON public.profiles;
DROP POLICY IF EXISTS "Cases access policy" ON public.compliance_cases;
DROP POLICY IF EXISTS "Documents access policy" ON public.case_documents;
DROP POLICY IF EXISTS "Extracted fields access policy" ON public.extracted_fields;
DROP POLICY IF EXISTS "Missing data access policy" ON public.missing_data_items;
DROP POLICY IF EXISTS "Supplier requests access policy" ON public.supplier_requests;
DROP POLICY IF EXISTS "Calculations access policy" ON public.calculations;
DROP POLICY IF EXISTS "Verification findings access policy" ON public.verification_findings;
DROP POLICY IF EXISTS "Audit reports access policy" ON public.audit_reports;
DROP POLICY IF EXISTS "Activity logs access policy" ON public.activity_logs;

-- Permissive and secure RLS policies for authenticated users, service role, and anon token operations
CREATE POLICY "Profiles access policy" ON public.profiles
  FOR ALL USING (auth.uid() = id OR auth.role() = 'service_role')
  WITH CHECK (auth.uid() = id OR auth.role() = 'service_role');

CREATE POLICY "Cases access policy" ON public.compliance_cases
  FOR ALL USING (true)
  WITH CHECK (true);

CREATE POLICY "Documents access policy" ON public.case_documents
  FOR ALL USING (true)
  WITH CHECK (true);

CREATE POLICY "Extracted fields access policy" ON public.extracted_fields
  FOR ALL USING (true)
  WITH CHECK (true);

CREATE POLICY "Missing data access policy" ON public.missing_data_items
  FOR ALL USING (true)
  WITH CHECK (true);

CREATE POLICY "Supplier requests access policy" ON public.supplier_requests
  FOR ALL USING (true)
  WITH CHECK (true);

CREATE POLICY "Calculations access policy" ON public.calculations
  FOR ALL USING (true)
  WITH CHECK (true);

CREATE POLICY "Verification findings access policy" ON public.verification_findings
  FOR ALL USING (true)
  WITH CHECK (true);

CREATE POLICY "Audit reports access policy" ON public.audit_reports
  FOR ALL USING (true)
  WITH CHECK (true);

CREATE POLICY "Activity logs access policy" ON public.activity_logs
  FOR ALL USING (true)
  WITH CHECK (true);

-- ==============================================================================
-- 13. Storage Buckets & Policies
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('carbongaurd-documents', 'carbongaurd-documents', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('carbongaurd-reports', 'carbongaurd-reports', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public and authenticated can upload documents" ON storage.objects;
CREATE POLICY "Public and authenticated can upload documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id IN ('carbongaurd-documents', 'carbongaurd-reports'));

DROP POLICY IF EXISTS "Public and authenticated can read documents" ON storage.objects;
CREATE POLICY "Public and authenticated can read documents" ON storage.objects
  FOR SELECT USING (bucket_id IN ('carbongaurd-documents', 'carbongaurd-reports'));

DROP POLICY IF EXISTS "Public and authenticated can update documents" ON storage.objects;
CREATE POLICY "Public and authenticated can update documents" ON storage.objects
  FOR UPDATE USING (bucket_id IN ('carbongaurd-documents', 'carbongaurd-reports'));

-- ==============================================================================
-- 14. Performance Indexes
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_cases_user_id ON public.compliance_cases(user_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON public.compliance_cases(status);
CREATE INDEX IF NOT EXISTS idx_case_documents_case_id ON public.case_documents(case_id);
CREATE INDEX IF NOT EXISTS idx_extracted_fields_case_id ON public.extracted_fields(case_id);
CREATE INDEX IF NOT EXISTS idx_supplier_requests_token ON public.supplier_requests(token);
CREATE INDEX IF NOT EXISTS idx_activity_logs_case_id ON public.activity_logs(case_id);

-- ==============================================================================
-- 15. Initial Seed Compliance Case (Ludhiana Iron & Steel Exporter - CG-IN-2026-081)
-- ==============================================================================
INSERT INTO public.compliance_cases (
  id,
  case_number,
  company_name,
  manufacturing_facility,
  facility_location,
  company_contact,
  product_name,
  product_category,
  product_grade,
  product_quantity,
  quantity_unit,
  manufacturing_period,
  destination_country,
  cbam_classification,
  supplier_company,
  supplier_contact_person,
  supplier_email,
  supplier_phone,
  outreach_authorized,
  buyer_company,
  buyer_contact_person,
  buyer_email,
  reporting_period,
  reporting_year,
  reporting_route,
  additional_remarks,
  status,
  verification_status,
  current_agent
) VALUES (
  'case-001',
  'CG-IN-2026-081',
  'Apex Forgings & Steel Products Pvt Ltd',
  'Unit 3 Induction Furnace & Rolling Mill',
  'Ludhiana Industrial Area, Punjab, India',
  '+91 98140 55432',
  'Hot-Rolled Structural Alloy Steel Bars (Fe500D)',
  'Iron and Steel',
  'Fe500D CBAM High Strength',
  48.66,
  'MT',
  'January 2026 - March 2026',
  'Germany',
  '7214 20 00 (Bars & rods of iron/non-alloy steel)',
  'Deccan Sponge Iron & Power Ltd',
  'Rajesh Sharma',
  'r.sharma@deccansponge.in',
  '+91 94221 88301',
  true,
  'Krupp Bautechnik GmbH',
  'Klaus Hoffmann',
  'k.hoffmann@krupp-bau.de',
  'Q1 2026 (Transitional-to-Definitive)',
  2026,
  'Standard EU CBAM Route (Annex IV)',
  'Commercial export lot dispatched via Mundra Port to Hamburg.',
  'verified',
  'PASS',
  'completed'
) ON CONFLICT (case_number) DO NOTHING;

-- Seed calculations for case-001
INSERT INTO public.calculations (
  case_id,
  methodology,
  direct_emissions,
  indirect_emissions,
  precursor_emissions,
  total_embedded_emissions,
  product_quantity,
  quantity_unit,
  emissions_intensity,
  calculation_breakdown,
  emission_factors_used
) VALUES (
  'case-001',
  'EU CBAM Annex IV (Direct + Indirect)',
  5.3791,
  14.6330,
  100.8960,
  120.9081,
  48.66,
  'MT',
  2.4848,
  '{"direct": {"fuel_oil_liters": 1720, "factor_kgCO2_per_liter": 3.1274, "tCO2e": 5.3791}, "indirect": {"electricity_kwh": 20465.73, "grid_factor_kgCO2_per_kwh": 0.715, "tCO2e": 14.633}, "precursors": {"direct_reduced_iron_mt": 52.008, "supplier_factor_tCO2e_per_mt": 1.94, "tCO2e": 100.896}}'::jsonb,
  '{"electricity_grid": "Central Electricity Authority (CEA) CO2 Baseline Database v19 (Govt of India)", "fuel_oil": "IPCC 2006 Guidelines for National GHG Inventories", "precursors": "Deccan Sponge Iron Mill Specific Emission Certificate v2.1"}'::jsonb
) ON CONFLICT DO NOTHING;

-- Seed verification findings for case-001
INSERT INTO public.verification_findings (
  case_id,
  overall_status,
  checks_run,
  checks_passed,
  checks_flagged,
  findings
) VALUES (
  'case-001',
  'verified',
  5,
  5,
  0,
  '[
    {"check_name": "Multi-Document Quantity Reconciliation", "status": "pass", "details": "Product quantity (48.66 MT) is perfectly consistent across invoice, mill test certificate, and packing list documents."},
    {"check_name": "Summation Integrity Verification", "status": "pass", "details": "Arithmetic passed: 5.3791 (Scope 1) + 14.633 (Scope 2) + 100.896 (Precursors) = 120.9081 tCO2e."},
    {"check_name": "Specific Emissions Intensity Verification", "status": "pass", "details": "Intensity mathematically confirmed at 2.4848 tCO2e / MT."},
    {"check_name": "Grid Emission Factor Applicability", "status": "pass", "details": "Grid factor CEA CO2 Baseline Database v19 adheres to Indian Central Electricity Authority national baseline standards."},
    {"check_name": "Metric Units Harmonization", "status": "pass", "details": "All numerical activity data entries conform to standardized SI and metric units (MT, kWh, Liters)."}
  ]'::jsonb
) ON CONFLICT DO NOTHING;
