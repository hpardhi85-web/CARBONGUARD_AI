import { ComplianceCase, ActivityLog } from './types';

// Seed demo compliance cases reflecting Indian MSME exporter scenarios
const INITIAL_CASES: ComplianceCase[] = [
  {
    id: "case-001",
    case_number: "CG-IN-2026-081",
    company_name: "Apex Forgings & Steel Products Pvt Ltd",
    manufacturing_facility: "Unit 3 Induction Furnace & Rolling Mill",
    facility_location: "Ludhiana Industrial Area, Punjab, India",
    company_contact: "+91 98140 55432",
    product_name: "Hot-Rolled Structural Alloy Steel Bars (Fe500D)",
    product_category: "Iron and Steel",
    product_grade: "Fe500D CBAM High Strength",
    product_quantity: 48.66,
    quantity_unit: "MT",
    manufacturing_period: "January 2026 - March 2026",
    destination_country: "Germany",
    cbam_classification: "7214 20 00 (Bars & rods of iron/non-alloy steel)",
    supplier_company: "Deccan Sponge Iron & Power Ltd",
    supplier_contact_person: "Rajesh Sharma",
    supplier_email: "r.sharma@deccansponge.in",
    supplier_phone: "+91 94221 88301",
    outreach_authorized: true,
    buyer_company: "Krupp Bautechnik GmbH",
    buyer_contact_person: "Klaus Hoffmann",
    buyer_email: "k.hoffmann@krupp-bau.de",
    reporting_period: "Q1 2026 (Transitional-to-Definitive)",
    reporting_year: 2026,
    reporting_route: "Standard EU CBAM Route (Annex IV)",
    additional_remarks: "Commercial export lot dispatched via Mundra Port to Hamburg.",
    status: "verified",
    verification_status: "PASS",
    current_agent: "completed",
    created_at: "2026-10-24T09:30:00Z",
    updated_at: "2026-10-25T14:15:00Z",
    documents: [
      {
        id: "doc-101",
        case_id: "case-001",
        file_name: "PSPCL_Industrial_Electricity_Bill_Q1.pdf",
        file_size: 421000,
        file_type: "application/pdf",
        storage_path: "documents/case-001/PSPCL_Industrial_Electricity_Bill_Q1.pdf",
        category: "electricity_bill",
        is_supplier_document: false,
        extraction_status: "completed",
        created_at: "2026-10-24T10:00:00Z"
      },
      {
        id: "doc-102",
        case_id: "case-001",
        file_name: "IOCL_Furnace_Oil_Fuel_Invoice_981.pdf",
        file_size: 285000,
        file_type: "application/pdf",
        storage_path: "documents/case-001/IOCL_Furnace_Oil_Fuel_Invoice_981.pdf",
        category: "fuel_record",
        is_supplier_document: false,
        extraction_status: "completed",
        created_at: "2026-10-24T10:05:00Z"
      },
      {
        id: "doc-103",
        case_id: "case-001",
        file_name: "Commercial_Export_Invoice_APEX_2026_044.pdf",
        file_size: 340000,
        file_type: "application/pdf",
        storage_path: "documents/case-001/Commercial_Export_Invoice_APEX_2026_044.pdf",
        category: "purchase_invoice",
        is_supplier_document: false,
        extraction_status: "completed",
        created_at: "2026-10-24T10:10:00Z"
      },
      {
        id: "doc-104",
        case_id: "case-001",
        file_name: "Mill_Test_Certificate_HT88421.pdf",
        file_size: 512000,
        file_type: "application/pdf",
        storage_path: "documents/case-001/Mill_Test_Certificate_HT88421.pdf",
        category: "test_cert",
        is_supplier_document: false,
        extraction_status: "completed",
        created_at: "2026-10-24T10:15:00Z"
      },
      {
        id: "doc-105",
        case_id: "case-001",
        file_name: "Deccan_Sponge_DRI_Emissions_Cert.pdf",
        file_size: 390000,
        file_type: "application/pdf",
        storage_path: "documents/case-001/Deccan_Sponge_DRI_Emissions_Cert.pdf",
        category: "supplier_doc",
        is_supplier_document: true,
        extraction_status: "completed",
        created_at: "2026-10-25T11:20:00Z"
      }
    ],
    extracted_fields: [
      {
        id: "ext-1",
        case_id: "case-001",
        field_name: "product_quantity",
        field_label: "Commercial Export Invoice Net Quantity",
        extracted_value: "48.66 MT",
        numeric_value: 48.66,
        unit: "MT",
        source_file_name: "Commercial_Export_Invoice_APEX_2026_044.pdf",
        page_number: 1,
        sheet_row: "Item 1, Net Dispatch Quantity",
        confidence: 0.99,
        extraction_timestamp: "2026-10-24T10:20:00Z"
      },
      {
        id: "ext-2",
        case_id: "case-001",
        field_name: "test_certificate_quantity",
        field_label: "Mill Test Certificate Certified Net Mass",
        extracted_value: "48.66 MT",
        numeric_value: 48.66,
        unit: "MT",
        source_file_name: "Mill_Test_Certificate_HT88421.pdf",
        page_number: 1,
        sheet_row: "Heat HT-88421, Certified Net Weight",
        confidence: 0.99,
        extraction_timestamp: "2026-10-24T10:20:00Z"
      },
      {
        id: "ext-3",
        case_id: "case-001",
        field_name: "electricity_consumption",
        field_label: "PSPCL Industrial Grid Electricity Reading",
        extracted_value: "20,437.2 kWh",
        numeric_value: 20437.2,
        unit: "kWh",
        source_file_name: "PSPCL_Industrial_Electricity_Bill_Q1.pdf",
        page_number: 1,
        sheet_row: "Active Consumption Units (kWh)",
        confidence: 0.98,
        extraction_timestamp: "2026-10-24T10:20:00Z"
      },
      {
        id: "ext-4",
        case_id: "case-001",
        field_name: "fuel_consumption",
        field_label: "Furnace Oil Fuel Consumption (IOCL)",
        extracted_value: "1,727.4 Liters",
        numeric_value: 1727.4,
        unit: "Liters",
        source_file_name: "IOCL_Furnace_Oil_Fuel_Invoice_981.pdf",
        page_number: 1,
        sheet_row: "Billed Quantity (HFO)",
        confidence: 0.97,
        extraction_timestamp: "2026-10-24T10:20:00Z"
      },
      {
        id: "ext-5",
        case_id: "case-001",
        field_name: "precursor_emissions_data",
        field_label: "Supplier DRI Raw Material Precursor Lot",
        extracted_value: "52.55 MT Sponge Iron",
        numeric_value: 52.55,
        unit: "MT",
        source_file_name: "Deccan_Sponge_DRI_Emissions_Cert.pdf",
        page_number: 1,
        sheet_row: "Direct Reduced Iron (Gas/Coal DRI)",
        confidence: 0.96,
        extraction_timestamp: "2026-10-25T11:22:00Z"
      }
    ],
    missing_data_items: [],
    calculations: {
      methodology: "EU CBAM Annex IV (Direct + Indirect + Precursors)",
      methodology_version: "Commission Implementing Regulation (EU) 2023/1773",
      calculation_timestamp: "2026-10-25T11:25:00Z",
      product_quantity: 48.66,
      quantity_unit: "MT",
      direct_emissions: 5.38,
      indirect_emissions: 14.63,
      precursor_emissions: 100.90,
      total_embedded_emissions: 120.91,
      emissions_intensity: 2.4848,
      intensity_unit: "tCO2e / MT",
      calculation_breakdown: {
        direct_combustion: {
          input_value: 1727.4,
          input_unit: "Liters",
          emission_factor: 3.114,
          factor_source: "IPCC 2006 Stationary Combustion",
          formula: "(1,727.4 L × 3.114) / 1000",
          result_tco2e: 5.38
        },
        indirect_electricity: {
          input_value: 20437.2,
          input_unit: "kWh",
          emission_factor: 0.716,
          factor_source: "CEA CO2 Baseline Database v19 (Govt of India)",
          formula: "(20,437.2 kWh × 0.716) / 1000",
          result_tco2e: 14.63
        },
        precursor_materials: {
          precursor_name: "Direct Reduced Iron (DRI / Sponge Iron)",
          input_value: 52.55,
          input_unit: "MT",
          emission_factor: 1.92,
          factor_source: "EU CBAM Transitional Benchmark - Gas/Coal DRI",
          formula: "52.55 MT × 1.92 tCO2e/MT",
          result_tco2e: 100.90
        }
      },
      emission_factors_used: {
        electricity: { factor: 0.716, source: "CEA Baseline Database v19" },
        fuel: { factor: 3.114, source: "IPCC 2006 Fuel Factors" },
        precursor: { factor: 1.92, source: "EU CBAM Benchmark" }
      }
    },
    verification_findings: {
      overall_status: "PASS",
      checks_run: 5,
      checks_passed: 5,
      checks_flagged: 0,
      findings: [
        {
          check_id: "CHK_QTY_CROSS_DOC_MATCH",
          title: "Multi-Document Quantity Reconciliation",
          severity: "INFO",
          status: "PASSED",
          description: "Verified: Product quantity (48.660 MT) matches perfectly across Commercial Invoice and Mill Test Certificate HT-88421."
        },
        {
          check_id: "CHK_ARITHMETIC_TOTAL_SUM",
          title: "Summation Integrity Verification",
          severity: "INFO",
          status: "PASSED",
          description: "Arithmetic passed: 5.38 (Scope 1) + 14.63 (Scope 2) + 100.90 (Precursors) = 120.91 tCO2e."
        },
        {
          check_id: "CHK_INTENSITY_ARITHMETIC",
          title: "Specific Emissions Intensity Verification",
          severity: "INFO",
          status: "PASSED",
          description: "Intensity mathematically confirmed at 2.4848 tCO2e / MT."
        },
        {
          check_id: "CHK_FACTOR_GEOGRAPHIC_VALIDITY",
          title: "Grid Emission Factor Applicability",
          severity: "INFO",
          status: "PASSED",
          description: "CEA Baseline factor (0.716 kg CO2/kWh) is compliant with Indian Central Electricity Authority national benchmarks."
        },
        {
          check_id: "CHK_UNIT_CONSISTENCY",
          title: "Metric Units Harmonization",
          severity: "INFO",
          status: "PASSED",
          description: "All numerical activity records adhere to standardized metric units (MT, kWh, Liters)."
        }
      ],
      verification_timestamp: "2026-10-25T11:30:00Z",
      auditor_note: "Verified audit-ready compliance certificate issued."
    },
    audit_report: {
      report_id: "REP-CG-IN-2026-081-79A1B2",
      file_name: "CarbonGuard_Compliance_Report_CG-IN-2026-081.pdf",
      file_path: "reports/CarbonGuard_Compliance_Report_CG-IN-2026-081.pdf",
      file_size: 148200,
      verification_status: "PASS",
      generated_at: "2026-10-25T11:35:00Z"
    }
  },
  {
    id: "case-002",
    case_number: "CG-IN-2026-092",
    company_name: "Hindalco Smelting & Extrusions Partner",
    manufacturing_facility: "Renukoot Extrusion Facility",
    facility_location: "Uttar Pradesh, India",
    company_contact: "+91 94550 22119",
    product_name: "Extruded Aluminium Profiles & Rods (6063 T6)",
    product_category: "Aluminium",
    product_grade: "AA 6063-T6",
    product_quantity: 32.50,
    quantity_unit: "MT",
    manufacturing_period: "February 2026",
    destination_country: "France",
    cbam_classification: "7604 10 10 (Aluminium bars, rods and profiles)",
    supplier_company: "Vedanta Ingot Supplies Ltd",
    supplier_contact_person: "Anil Goel",
    supplier_email: "a.goel@vedantaingots.in",
    supplier_phone: "+91 97112 33445",
    outreach_authorized: true,
    buyer_company: "Saint-Gobain Solutions SAS",
    buyer_contact_person: "Pierre Dubois",
    buyer_email: "p.dubois@saint-gobain.fr",
    reporting_period: "Q1 2026",
    reporting_year: 2026,
    reporting_route: "Standard EU CBAM Route",
    additional_remarks: "Requires precursor primary aluminium ingot emissions verification.",
    status: "waiting_for_supplier",
    verification_status: "pending",
    current_agent: "waiting_for_supplier",
    created_at: "2026-10-28T08:00:00Z",
    updated_at: "2026-10-28T10:30:00Z",
    documents: [
      {
        id: "doc-201",
        case_id: "case-002",
        file_name: "UPPCL_Renukoot_Electricity_Bill.pdf",
        file_size: 388000,
        file_type: "application/pdf",
        storage_path: "documents/case-002/UPPCL_Renukoot_Electricity_Bill.pdf",
        category: "electricity_bill",
        is_supplier_document: false,
        extraction_status: "completed",
        created_at: "2026-10-28T08:15:00Z"
      },
      {
        id: "doc-202",
        case_id: "case-002",
        file_name: "SaintGobain_Export_Invoice_092.pdf",
        file_size: 295000,
        file_type: "application/pdf",
        storage_path: "documents/case-002/SaintGobain_Export_Invoice_092.pdf",
        category: "purchase_invoice",
        is_supplier_document: false,
        extraction_status: "completed",
        created_at: "2026-10-28T08:20:00Z"
      }
    ],
    extracted_fields: [
      {
        id: "ext-201",
        case_id: "case-002",
        field_name: "product_quantity",
        field_label: "Export Invoice Net Quantity",
        extracted_value: "32.50 MT",
        numeric_value: 32.50,
        unit: "MT",
        source_file_name: "SaintGobain_Export_Invoice_092.pdf",
        page_number: 1,
        confidence: 0.99,
        extraction_timestamp: "2026-10-28T08:30:00Z"
      },
      {
        id: "ext-202",
        case_id: "case-002",
        field_name: "electricity_consumption",
        field_label: "UPPCL High Voltage Extrusion Power Reading",
        extracted_value: "28,600.0 kWh",
        numeric_value: 28600.0,
        unit: "kWh",
        source_file_name: "UPPCL_Renukoot_Electricity_Bill.pdf",
        page_number: 1,
        confidence: 0.98,
        extraction_timestamp: "2026-10-28T08:30:00Z"
      }
    ],
    missing_data_items: [
      {
        id: "mis-201",
        case_id: "case-002",
        field_name: "precursor_emissions_data",
        description: "Certified primary aluminium smelting embedded emissions or specific supplier emissions factor from Vedanta Ingot Supplies Ltd.",
        priority: "mandatory",
        is_supplier_data: true,
        status: "requested"
      }
    ],
    supplier_request: {
      id: "req-201",
      case_id: "case-002",
      token: "vedanta-q1-2026-token-841",
      supplier_name: "Anil Goel",
      supplier_email: "a.goel@vedantaingots.in",
      email_subject: "Action Required: Upstream Aluminium Ingot Carbon Emissions Request — Ref: CG-IN-2026-092",
      email_body: "Automated request dispatched for missing upstream primary smelting data.",
      upload_link: "http://localhost:3000/supplier/upload?token=vedanta-q1-2026-token-841",
      missing_items: [],
      status: "sent",
      sent_at: "2026-10-28T08:45:00Z"
    }
  }
];

const INITIAL_LOGS: ActivityLog[] = [
  {
    id: "log-1",
    case_id: "case-001",
    agent_name: "Collector Agent",
    action: "DOCUMENT_UPLOADED",
    description: "5 commercial compliance documents uploaded for Case CG-IN-2026-081.",
    created_at: "2026-10-24T10:00:00Z"
  },
  {
    id: "log-2",
    case_id: "case-001",
    agent_name: "Collector Agent",
    action: "EXTRACTION_COMPLETED",
    description: "Extracted electricity (20,437 kWh), furnace oil (1,727 L), and verified weight (48.66 MT).",
    created_at: "2026-10-24T10:20:00Z"
  },
  {
    id: "log-3",
    case_id: "case-001",
    agent_name: "Outreach Agent",
    action: "SUPPLIER_EMAIL_SENT",
    description: "Outreach email sent to r.sharma@deccansponge.in with encrypted upload link.",
    created_at: "2026-10-24T10:30:00Z"
  },
  {
    id: "log-4",
    case_id: "case-001",
    agent_name: "Collector Agent",
    action: "SUPPLIER_RESPONSE_PROCESSED",
    description: "Supplier uploaded Deccan_Sponge_DRI_Emissions_Cert.pdf. Verified precursor lot: 52.55 MT.",
    created_at: "2026-10-25T11:20:00Z"
  },
  {
    id: "log-5",
    case_id: "case-001",
    agent_name: "Calculator Agent",
    action: "CALCULATION_COMPLETED",
    description: "Computed 120.91 tCO2e total embedded emissions (2.4848 tCO2e / MT).",
    created_at: "2026-10-25T11:25:00Z"
  },
  {
    id: "log-6",
    case_id: "case-001",
    agent_name: "Verifier Agent",
    action: "VERIFICATION_PASSED",
    description: "Multi-document quantity reconciliation passed. Arithmetic verified. Status: PASS.",
    created_at: "2026-10-25T11:30:00Z"
  },
  {
    id: "log-7",
    case_id: "case-001",
    agent_name: "Report Generation Agent",
    action: "REPORT_GENERATED",
    description: "Audit-ready PDF report CarbonGuard_Compliance_Report_CG-IN-2026-081.pdf compiled.",
    created_at: "2026-10-25T11:35:00Z"
  }
];

class DataStore {
  private cases: ComplianceCase[] = [...INITIAL_CASES];
  private logs: ActivityLog[] = [...INITIAL_LOGS];

  getCases(): ComplianceCase[] {
    return this.cases;
  }

  getCaseById(id: string): ComplianceCase | undefined {
    return this.cases.find(c => c.id === id || c.case_number === id);
  }

  addCase(newCase: ComplianceCase): ComplianceCase {
    this.cases = [newCase, ...this.cases];
    this.addLog({
      agent_name: "System",
      action: "CASE_CREATED",
      description: `New compliance case ${newCase.case_number} created for ${newCase.product_name}.`,
      case_id: newCase.id
    });
    return newCase;
  }

  updateCase(id: string, updates: Partial<ComplianceCase>): ComplianceCase | undefined {
    const idx = this.cases.findIndex(c => c.id === id || c.case_number === id);
    if (idx !== -1) {
      this.cases[idx] = { ...this.cases[idx], ...updates, updated_at: new Date().toISOString() };
      return this.cases[idx];
    }
    return undefined;
  }

  getLogs(): ActivityLog[] {
    return this.logs;
  }

  addLog(log: Omit<ActivityLog, 'id' | 'created_at'>): ActivityLog {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      created_at: new Date().toISOString(),
      ...log
    };
    this.logs = [newLog, ...this.logs];
    return newLog;
  }
}

export const dataStore = new DataStore();

