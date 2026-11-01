export type ProductCategory = 
  | 'Iron and Steel' 
  | 'Aluminium' 
  | 'Cement' 
  | 'Fertilizers' 
  | 'Hydrogen' 
  | 'Electricity';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  company_name: string;
  company_type?: string;
  business_address?: string;
  country: string;
  contact_number?: string;
  gstin?: string;
  iec_code?: string;
  udyam_reg_no?: string;
}

export interface ComplianceCase {
  id: string;
  case_number: string;
  company_name: string;
  manufacturing_facility: string;
  facility_location: string;
  company_contact: string;
  
  // Product info
  product_name: string;
  product_category: ProductCategory;
  product_grade?: string;
  product_quantity: number;
  quantity_unit: string;
  manufacturing_period: string;
  destination_country: string;
  cbam_classification?: string;
  
  // Supplier info
  supplier_company: string;
  supplier_contact_person: string;
  supplier_email: string;
  supplier_phone?: string;
  outreach_authorized: boolean;
  
  // Buyer info
  buyer_company: string;
  buyer_contact_person: string;
  buyer_email: string;
  
  // Reporting parameters
  reporting_period: string;
  reporting_year: number;
  reporting_route: string;
  additional_remarks?: string;
  
  // Workflow state
  status: 'draft' | 'collecting' | 'missing_data' | 'waiting_for_supplier' | 'calculating' | 'verifying' | 'review_required' | 'verified' | 'completed';
  verification_status: 'pending' | 'in_progress' | 'PASS' | 'FLAGGED' | 'REVIEW_REQUIRED';
  current_agent?: string;
  
  created_at: string;
  updated_at: string;
  
  // Related items
  documents?: CaseDocument[];
  extracted_fields?: ExtractedField[];
  missing_data_items?: MissingDataItem[];
  supplier_request?: SupplierRequest;
  calculations?: CalculationResult;
  verification_findings?: VerificationFindings;
  audit_report?: AuditReport;
}

export interface CaseDocument {
  id: string;
  case_id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  storage_path: string;
  category: 
    | 'purchase_invoice' 
    | 'sales_invoice' 
    | 'electricity_bill' 
    | 'fuel_record' 
    | 'production_log' 
    | 'raw_material' 
    | 'supplier_doc' 
    | 'test_cert' 
    | 'packing_list' 
    | 'other';
  is_supplier_document: boolean;
  extraction_status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
}

export interface ExtractedField {
  id: string;
  case_id: string;
  document_id?: string;
  field_name: string;
  field_label: string;
  extracted_value: string;
  numeric_value?: number;
  unit?: string;
  source_file_name: string;
  page_number?: number;
  sheet_row?: string;
  confidence: number;
  extraction_timestamp: string;
  is_discrepant?: boolean;
  discrepancy_reason?: string;
}

export interface MissingDataItem {
  id: string;
  case_id: string;
  field_name: string;
  description: string;
  priority: 'mandatory' | 'recommended' | 'optional';
  is_supplier_data: boolean;
  status: 'missing' | 'requested' | 'received' | 'waived';
}

export interface SupplierRequest {
  id: string;
  case_id: string;
  token: string;
  supplier_name: string;
  supplier_email: string;
  email_subject: string;
  email_body: string;
  upload_link: string;
  missing_items: MissingDataItem[];
  status: 'pending' | 'sent' | 'viewed' | 'responded' | 'unavailable' | 'expired';
  response_notes?: string;
  sent_at: string;
  expires_at?: string;
  delivery_verified?: boolean;
  delivery_status?: string;
  delivery_timestamp?: string;
  email_dispatched?: boolean;
}

export interface CalculationResult {
  methodology: string;
  methodology_version: string;
  calculation_timestamp: string;
  product_quantity: number;
  quantity_unit: string;
  direct_emissions: number;
  indirect_emissions: number;
  precursor_emissions: number;
  total_embedded_emissions: number;
  emissions_intensity: number;
  intensity_unit: string;
  calculation_breakdown: Record<string, any>;
  emission_factors_used: Record<string, any>;
}

export interface VerificationFindings {
  overall_status: 'PASS' | 'FLAGGED' | 'REVIEW_REQUIRED';
  checks_run: number;
  checks_passed: number;
  checks_flagged: number;
  findings: Array<{
    check_id: string;
    title: string;
    severity: 'INFO' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    status: 'PASSED' | 'FLAGGED';
    description: string;
    recommendation?: string;
    sources_compared?: Array<{ doc: string; value: string }>;
  }>;
  verification_timestamp: string;
  auditor_note?: string;
}

export interface AuditReport {
  report_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  verification_status: string;
  generated_at: string;
  buyer_access_token?: string;
  supabase_url?: string;
  download_url?: string;
  generated_by?: string;
  gemini_narrative?: string;
  storage_provider?: string;
}

export interface ActivityLog {
  id: string;
  case_id?: string;
  agent_name: string;
  action: string;
  description: string;
  created_at: string;
  metadata?: Record<string, any>;
}

