from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class ExtractedField(BaseModel):
    id: Optional[str] = None
    field_name: str
    field_label: str
    extracted_value: str
    numeric_value: Optional[float] = None
    unit: Optional[str] = None
    source_file_name: str
    source_document_id: Optional[str] = None
    page_number: Optional[int] = None
    sheet_row: Optional[str] = None
    confidence: float = 0.95
    extraction_timestamp: Optional[str] = None
    is_discrepant: bool = False
    discrepancy_reason: Optional[str] = None

class MissingDataItem(BaseModel):
    id: Optional[str] = None
    field_name: str
    description: str
    priority: str = "mandatory"  # mandatory, recommended, optional
    is_supplier_data: bool = True
    status: str = "missing"  # missing, requested, received, waived

class ComplianceCaseState(BaseModel):
    case_id: str
    case_number: str
    company_name: str
    manufacturing_facility: str
    facility_location: str
    company_contact: Optional[str] = None
    product_name: str
    product_category: str
    product_grade: Optional[str] = None
    product_quantity: float
    quantity_unit: str = "MT"
    manufacturing_period: str
    destination_country: str
    cbam_classification: Optional[str] = None
    
    # Supplier Information
    supplier_company: str
    supplier_contact_person: str
    supplier_email: str
    supplier_phone: Optional[str] = None
    outreach_authorized: bool = True
    
    # Buyer Information
    buyer_company: str
    buyer_contact_person: str
    buyer_email: str
    
    # Reporting parameters
    reporting_period: str
    reporting_year: int = 2026
    reporting_route: str = "Standard EU CBAM Route"
    additional_remarks: Optional[str] = None
    
    # Workflow State
    status: str = "draft"  # draft, collecting, missing_data, outreach_sent, calculating, verifying, review_required, verified, completed
    verification_status: str = "pending"  # pending, in_progress, passed, flagged, review_required
    current_agent: str = "collector"
    
    # Artifacts & Outputs
    documents: List[Dict[str, Any]] = Field(default_factory=list)
    extracted_fields: List[Dict[str, Any]] = Field(default_factory=list)
    missing_data_items: List[Dict[str, Any]] = Field(default_factory=list)
    supplier_request: Optional[Dict[str, Any]] = None
    supplier_response: Optional[Dict[str, Any]] = None
    calculations: Optional[Dict[str, Any]] = None
    verification_findings: Optional[Dict[str, Any]] = None
    audit_report: Optional[Dict[str, Any]] = None
    activity_logs: List[Dict[str, Any]] = Field(default_factory=list)
    errors: List[str] = Field(default_factory=list)

