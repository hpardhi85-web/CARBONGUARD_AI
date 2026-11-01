import datetime
from typing import Dict, Any, Literal
from langgraph.graph import StateGraph, START, END

from backend.agents.state import ComplianceCaseState
from backend.agents.collector import CollectorAgent
from backend.agents.checker import MissingDataChecker
from backend.agents.outreach import OutreachAgent
from backend.agents.calculator import CalculatorAgent
from backend.agents.verifier import VerifierAgent
from backend.agents.report_generator import ReportGenerationAgent

# Initialize agent instances
collector_agent = CollectorAgent()
checker_agent = MissingDataChecker()
outreach_agent = OutreachAgent()
calculator_agent = CalculatorAgent()
verifier_agent = VerifierAgent()
report_agent = ReportGenerationAgent()

def collector_node(state: ComplianceCaseState) -> Dict[str, Any]:
    """Agent 1: Extracts structured data from all uploaded documents."""
    case_dict = state.model_dump()
    extracted = collector_agent.process_documents(state.documents, case_dict)
    
    # Merge existing and newly extracted fields (keyed by field and document)
    merged_fields = list(state.extracted_fields)
    existing_keys = {(f.get("field_name"), f.get("source_document_id")) for f in merged_fields}
    for item in extracted:
        item_key = (item.get("field_name"), item.get("source_document_id"))
        if item_key not in existing_keys:
            merged_fields.append(item)
            existing_keys.add(item_key)

    log_entry = {
        "agent": "Collector Agent",
        "action": "DOCUMENT_EXTRACTION_COMPLETED",
        "description": f"Extracted {len(extracted)} structured activity parameters with document citations.",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }

    return {
        "extracted_fields": merged_fields,
        "current_agent": "missing_data_checker",
        "status": "collecting",
        "activity_logs": state.activity_logs + [log_entry]
    }

def checker_node(state: ComplianceCaseState) -> Dict[str, Any]:
    """Agent 2: Checks if extracted parameters meet CBAM category calculation requirements."""
    case_dict = state.model_dump()
    supplier_info = {
        "supplier_company": state.supplier_company,
        "supplier_email": state.supplier_email,
        "supplier_contact": state.supplier_contact_person
    }
    
    missing_items, conflicts = checker_agent.check(
        state.product_category,
        state.extracted_fields,
        supplier_info
    )

    log_entry = {
        "agent": "Missing Data Checker",
        "action": "VALIDATION_COMPLETED",
        "description": f"Audited CBAM requirements for {state.product_category}. Found {len(missing_items)} missing items.",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }

    new_status = "missing_data" if len(missing_items) > 0 else "calculating"

    return {
        "missing_data_items": missing_items,
        "current_agent": "outreach" if len(missing_items) > 0 else "calculator",
        "status": new_status,
        "activity_logs": state.activity_logs + [log_entry]
    }

def missing_data_decision(state: ComplianceCaseState) -> Literal["outreach", "calculator"]:
    """Decision Node: If missing data items exist and supplier outreach is authorized -> outreach, else calculator."""
    if len(state.missing_data_items) > 0 and state.outreach_authorized and not state.supplier_response:
        return "outreach"
    return "calculator"

def outreach_node(state: ComplianceCaseState) -> Dict[str, Any]:
    """Agent 3: Contacts supplier with tokenized upload link to request missing data."""
    req = outreach_agent.prepare_supplier_request(
        case_id=state.case_id,
        case_number=state.case_number,
        company_name=state.company_name,
        product_name=state.product_name,
        supplier_company=state.supplier_company,
        supplier_contact=state.supplier_contact_person,
        supplier_email=state.supplier_email,
        missing_items=state.missing_data_items,
        extracted_fields=state.extracted_fields,
        documents=state.documents
    )

    log_entry = {
        "agent": "Outreach Agent",
        "action": "SUPPLIER_EMAIL_SENT",
        "description": f"Autonomous email dispatched to {state.supplier_email} requesting missing emissions parameters.",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }

    return {
        "supplier_request": req,
        "status": "waiting_for_supplier",
        "current_agent": "waiting_for_supplier",
        "activity_logs": state.activity_logs + [log_entry]
    }

def calculator_node(state: ComplianceCaseState) -> Dict[str, Any]:
    """Agent 4: Deterministically calculates embedded emissions and intensity."""
    calc_result = calculator_agent.calculate(
        case_data=state.model_dump(),
        extracted_fields=state.extracted_fields
    )

    log_entry = {
        "agent": "Calculator Agent",
        "action": "EMISSIONS_CALCULATED",
        "description": f"Calculated Total Embedded Emissions: {calc_result['total_embedded_emissions']} tCO2e ({calc_result['emissions_intensity']} {calc_result['intensity_unit']}).",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }

    return {
        "calculations": calc_result,
        "current_agent": "verifier",
        "status": "verifying",
        "activity_logs": state.activity_logs + [log_entry]
    }

def verifier_node(state: ComplianceCaseState) -> Dict[str, Any]:
    """Agent 5: Audits arithmetic, cross-checks documents, traps planted errors."""
    verif_result = verifier_agent.verify(
        case_data=state.model_dump(),
        extracted_fields=state.extracted_fields,
        calculations=state.calculations or {}
    )

    log_entry = {
        "agent": "Verifier Agent",
        "action": "VERIFICATION_COMPLETED",
        "description": f"Audit Result: {verif_result['overall_status']}. Checks run: {verif_result['checks_run']}, Passed: {verif_result['checks_passed']}, Flagged: {verif_result['checks_flagged']}.",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }

    return {
        "verification_findings": verif_result,
        "verification_status": verif_result["overall_status"],
        "current_agent": "report_generator" if verif_result["overall_status"] == "PASS" else "owner_review",
        "status": "verified" if verif_result["overall_status"] == "PASS" else "review_required",
        "activity_logs": state.activity_logs + [log_entry]
    }

def verification_decision(state: ComplianceCaseState) -> Literal["report_generator", "owner_review"]:
    """Decision Node: Pass -> Report Generator, Flagged/Review -> Owner Review."""
    if state.verification_status == "PASS":
        return "report_generator"
    return "owner_review"

def report_node(state: ComplianceCaseState) -> Dict[str, Any]:
    """Agent 6: Generates traceable, audit-ready PDF compliance report and delivers to receiver."""
    report_info = report_agent.generate_pdf_report(
        case_data=state.model_dump(),
        extracted_fields=state.extracted_fields,
        calculations=state.calculations or {},
        verification_findings=state.verification_findings or {}
    )

    # Automatically notify and dispatch verified calculations and PDF link to designated receiver email
    target_email = state.supplier_email or os.getenv("DEFAULT_RECEIVER_EMAIL", "lalchandkuhikar5@gmail.com")
    pdf_download_url = report_info.get("supabase_url") or report_info.get("download_url") or f"http://localhost:3000/api/reports/download/{report_info.get('file_name', '')}"
    try:
        outreach_agent.send_completed_report_email(
            to_email=target_email,
            case_data=state.model_dump(),
            calculations=state.calculations or {},
            audit_report=report_info,
            pdf_url=pdf_download_url,
            recipient_name=state.supplier_contact_person or state.company_name
        )
    except Exception as e:
        print(f"[Workflow] Report email notification notice: {e}")

    log_entry = {
        "agent": "Report Generation Agent",
        "action": "REPORT_GENERATED",
        "description": f"Generated audit-ready compliance PDF certificate: {report_info['file_name']} and dispatched verified declaration to {target_email}.",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }

    return {
        "audit_report": report_info,
        "status": "completed",
        "current_agent": "completed",
        "activity_logs": state.activity_logs + [log_entry]
    }

def owner_review_node(state: ComplianceCaseState) -> Dict[str, Any]:
    """Halts automatic generation for human owner inspection when a discrepancy is caught."""
    log_entry = {
        "agent": "Verifier Agent",
        "action": "OWNER_REVIEW_TRIGGERED",
        "description": "Cross-document discrepancy flagged. Awaiting owner clarification.",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }
    return {
        "status": "review_required",
        "current_agent": "owner_review",
        "activity_logs": state.activity_logs + [log_entry]
    }

# Build LangGraph StateGraph
def create_compliance_graph():
    builder = StateGraph(ComplianceCaseState)

    # Add Nodes
    builder.add_node("collector", collector_node)
    builder.add_node("checker", checker_node)
    builder.add_node("outreach", outreach_node)
    builder.add_node("calculator", calculator_node)
    builder.add_node("verifier", verifier_node)
    builder.add_node("report_generator", report_node)
    builder.add_node("owner_review", owner_review_node)

    # Add Edges & Conditional Routing
    builder.add_edge(START, "collector")
    builder.add_edge("collector", "checker")
    builder.add_conditional_edges(
        "checker",
        missing_data_decision,
        {
            "outreach": "outreach",
            "calculator": "calculator"
        }
    )
    # Outreach pauses for supplier response
    builder.add_edge("outreach", END)
    
    # Calculation -> Verification
    builder.add_edge("calculator", "verifier")
    
    # Verification Decision
    builder.add_conditional_edges(
        "verifier",
        verification_decision,
        {
            "report_generator": "report_generator",
            "owner_review": "owner_review"
        }
    )
    
    builder.add_edge("report_generator", END)
    builder.add_edge("owner_review", END)

    return builder.compile()

# Compile global workflow
compliance_workflow = create_compliance_graph()

