import os
from dotenv import load_dotenv
load_dotenv()
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
from typing import Dict, Any, Optional
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse, HTMLResponse
from pydantic import BaseModel

from backend.agents.state import ComplianceCaseState
from backend.agents.workflow import compliance_workflow, collector_agent, calculator_agent, verifier_agent, report_agent

app = FastAPI(
    title="CarbonGuard AI Multi-Agent API",
    description="Multi-Agent Carbon Compliance Engine for Indian MSME Exporters",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# CarbonGuard AI Multi-Agent Engine (Reloaded)
CASE_STORE: Dict[str, Dict[str, Any]] = {}
TOKEN_MAP: Dict[str, str] = {}  # token -> case_id

@app.get("/", response_class=HTMLResponse)
def read_root(request: Request):
    # If client asks for JSON explicitly, return JSON
    accept = request.headers.get("accept", "")
    if "application/json" in accept and "text/html" not in accept:
        return JSONResponse({
            "platform": "CarbonGuard AI",
            "status": "Operational",
            "version": "1.0.0",
            "agents": [
                "Collector Agent",
                "Missing Data Checker",
                "Outreach Agent",
                "Calculator Agent",
                "Verifier Agent",
                "Report Generation Agent"
            ]
        })

    # Return rich interactive visual HTML status console
    html_content = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CarbonGuard AI — Backend Engine Status</title>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
        <style>
            * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; }
            body { background: #0b0f19; color: #e2e8f0; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 2rem; }
            .card { background: #131b2e; border: 1px solid #1e293b; border-radius: 1.5rem; max-width: 720px; width: 100%; padding: 2.5rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
            .badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); color: #34d399; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 0.35rem 0.85rem; rounded-pill: 9999px; border-radius: 9999px; margin-bottom: 1.5rem; }
            .badge-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 10px #10b981; animation: pulse 2s infinite; }
            @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.85); } }
            h1 { font-size: 2rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem; letter-spacing: -0.02em; }
            p.sub { font-size: 0.95rem; color: #94a3b8; line-height: 1.6; margin-bottom: 2rem; }
            .actions { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; }
            .btn { display: flex; align-items: center; justify-content: center; gap: 0.6rem; padding: 0.9rem 1.25rem; font-size: 0.875rem; font-weight: 700; border-radius: 0.85rem; text-decoration: none; transition: all 0.2s; }
            .btn-primary { background: linear-gradient(135deg, #059669, #0d9488); color: #fff; box-shadow: 0 10px 15px -3px rgba(5, 150, 105, 0.3); }
            .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 15px 20px -3px rgba(5, 150, 105, 0.4); }
            .btn-secondary { background: #1e293b; color: #cbd5e1; border: 1px solid #334155; }
            .btn-secondary:hover { background: #273549; color: #fff; }
            .agents-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-top: 1.5rem; }
            .agent-item { background: #0f172a; border: 1px solid #1e293b; border-radius: 0.75rem; padding: 0.85rem; text-align: left; }
            .agent-title { font-size: 0.8rem; font-weight: 700; color: #e2e8f0; margin-bottom: 0.2rem; }
            .agent-status { font-size: 0.7rem; color: #10b981; font-weight: 600; }
            .info-box { background: rgba(30, 41, 59, 0.5); border-left: 3px solid #0d9488; padding: 0.85rem 1rem; border-radius: 0 0.5rem 0.5rem 0; font-size: 0.8rem; color: #94a3b8; margin-top: 2rem; line-height: 1.5; }
            .info-box b { color: #f1f5f9; }
        </style>
    </head>
    <body>
        <div class="card">
            <div class="badge">
                <span class="badge-dot"></span>
                <span>FastAPI + LangGraph Backend Online</span>
            </div>
            <h1>CarbonGuard AI Engine</h1>
            <p class="sub">
                This is the Python AI Agent Microservice running on <b>Port 8000</b>. To use the full web dashboard, click below to open the Next.js Frontend.
            </p>

            <div class="actions">
                <a href="http://localhost:3000" target="_blank" class="btn btn-primary">
                    <span>🚀 Launch Frontend App (Port 3000)</span>
                </a>
                <a href="/docs" target="_blank" class="btn btn-secondary">
                    <span>📚 Swagger Interactive API Docs</span>
                </a>
            </div>

            <h3 style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 700; margin-top: 1rem;">
                Autonomous Agent Fleet
            </h3>

            <div class="agents-grid">
                <div class="agent-item">
                    <div class="agent-title">1. Collector</div>
                    <div class="agent-status">● PyMuPDF Ready</div>
                </div>
                <div class="agent-item">
                    <div class="agent-title">2. Missing Data</div>
                    <div class="agent-status">● CBAM Rules Active</div>
                </div>
                <div class="agent-item">
                    <div class="agent-title">3. Outreach</div>
                    <div class="agent-status">● Email Engine Ready</div>
                </div>
                <div class="agent-item">
                    <div class="agent-title">4. Calculator</div>
                    <div class="agent-status">● CEA Grid Factors</div>
                </div>
                <div class="agent-item">
                    <div class="agent-title">5. Verifier</div>
                    <div class="agent-status">● Anomaly Trap Active</div>
                </div>
                <div class="agent-item">
                    <div class="agent-title">6. Report Gen</div>
                    <div class="agent-status">● ReportLab PDF Ready</div>
                </div>
            </div>

            <div class="info-box">
                <b>Quick Tip:</b> Always open <b>http://localhost:3000</b> in your browser to view the interactive exporter dashboard, upload invoices, and test the multi-agent pipeline.
            </div>
        </div>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

class ProcessRequest(BaseModel):
    case_data: Dict[str, Any]
    documents: Optional[list] = None
    supplier_response: Optional[Dict[str, Any]] = None

@app.post("/api/agents/process")
async def process_compliance_case(req: ProcessRequest):
    """
    Executes or resumes the LangGraph multi-agent workflow for a compliance case.
    """
    data = req.case_data
    case_id = data.get("id") or data.get("case_id") or "CASE-DEMO"
    
    # Merge existing state if present
    existing_state = CASE_STORE.get(case_id, {})
    merged_data = {**existing_state, **data}
    
    if req.documents:
        merged_data["documents"] = req.documents
    if req.supplier_response:
        merged_data["supplier_response"] = req.supplier_response
        scen = req.supplier_response.get("scenario")
        if scen in ["unavailable", "drop_missing"]:
            merged_data["precursor_dropped"] = True
            drop_extracted = {
                "field_name": "precursor_emissions_data",
                "field_label": "Precursor Emissions: Dropped / Scope 1 & 2 Direct Boundary Applied",
                "extracted_value": "0.00 MT (Dropped per Exporter Authorization)",
                "numeric_value": 0.0,
                "unit": "MT",
                "source_file_name": "Exporter Authorization (Scope 1+2 Boundary)",
                "page_number": 1,
                "confidence": 1.0,
                "extraction_timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
            }
            merged_data["extracted_fields"] = [f for f in merged_data.get("extracted_fields", []) if f.get("field_name") != "precursor_emissions_data"] + [drop_extracted]
            merged_data["missing_data_items"] = []
        elif scen == "available":
            prec_val = float(req.supplier_response.get("precursorValue", 52.55))
            comb_extracted = {
                "field_name": "precursor_emissions_data",
                "field_label": "Supplier Certified Upstream Precursor Ingot Lot",
                "extracted_value": f"{prec_val} MT Sponge Iron / Ingot (Combined with CSV Records)",
                "numeric_value": prec_val,
                "unit": "MT",
                "source_file_name": req.supplier_response.get("fileName", "Certified_DRI_Sponge_Iron_Lot.pdf"),
                "page_number": 1,
                "confidence": 0.99,
                "extraction_timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
            }
            merged_data["extracted_fields"] = [f for f in merged_data.get("extracted_fields", []) if f.get("field_name") != "precursor_emissions_data"] + [comb_extracted]
            merged_data["missing_data_items"] = []

    # Initialize ComplianceCaseState
    state = ComplianceCaseState(
        case_id=case_id,
        case_number=merged_data.get("case_number", f"CG-{case_id[:8].upper()}"),
        company_name=merged_data.get("company_name", "Indian Steel Exporters Ltd"),
        manufacturing_facility=merged_data.get("manufacturing_facility", "Jamshedpur Unit 1"),
        facility_location=merged_data.get("facility_location", "Jharkhand, India"),
        company_contact=merged_data.get("company_contact", "+91 98765 43210"),
        product_name=merged_data.get("product_name", "Hot-Rolled Steel Rebar Grade 60"),
        product_category=merged_data.get("product_category", "Iron and Steel"),
        product_grade=merged_data.get("product_grade", "Fe500D"),
        product_quantity=float(merged_data.get("product_quantity", 48.66)),
        quantity_unit=merged_data.get("quantity_unit", "MT"),
        manufacturing_period=merged_data.get("manufacturing_period", "Q1 2026"),
        destination_country=merged_data.get("destination_country", "Germany"),
        cbam_classification=merged_data.get("cbam_classification", "7214 20 00"),
        supplier_company=merged_data.get("supplier_company", "Supplier Partner"),
        supplier_contact_person=merged_data.get("supplier_contact_person") or (f"{merged_data.get('supplier_company', 'Supplier Partner')} Team"),
        supplier_email=merged_data.get("supplier_email", ""),
        supplier_phone=merged_data.get("supplier_phone", ""),
        outreach_authorized=merged_data.get("outreach_authorized", True),
        buyer_company=merged_data.get("buyer_company", "ThyssenKrupp Materials GmbH"),
        buyer_contact_person=merged_data.get("buyer_contact_person", "Hans Weber"),
        buyer_email=merged_data.get("buyer_email", "h.weber@thyssenkrupp.de"),
        reporting_period=merged_data.get("reporting_period", "January - March 2026"),
        reporting_year=int(merged_data.get("reporting_year", 2026)),
        reporting_route=merged_data.get("reporting_route", "Standard EU CBAM Route"),
        additional_remarks=merged_data.get("additional_remarks", "Primary export batch for EU CBAM filing"),
        documents=merged_data.get("documents", []),
        extracted_fields=merged_data.get("extracted_fields", []),
        missing_data_items=merged_data.get("missing_data_items", []),
        supplier_request=merged_data.get("supplier_request"),
        supplier_response=merged_data.get("supplier_response"),
        calculations=merged_data.get("calculations"),
        verification_findings=merged_data.get("verification_findings"),
        audit_report=merged_data.get("audit_report"),
        activity_logs=merged_data.get("activity_logs", []),
        status=merged_data.get("status", "draft"),
        precursor_dropped=bool(merged_data.get("precursor_dropped", False))
    )

    try:
        # Run LangGraph workflow
        final_state = compliance_workflow.invoke(state)
        
        # Save to store
        result_dict = dict(final_state) if isinstance(final_state, dict) else (
            final_state.model_dump() if hasattr(final_state, 'model_dump') else dict(final_state)
        )
        CASE_STORE[case_id] = result_dict
        
        # Index token if outreach agent generated one
        if result_dict.get("supplier_request") and result_dict["supplier_request"].get("token"):
            TOKEN_MAP[result_dict["supplier_request"]["token"]] = case_id

        return {
            "success": True,
            "case_id": case_id,
            "status": result_dict.get("status"),
            "verification_status": result_dict.get("verification_status"),
            "current_agent": result_dict.get("current_agent"),
            "state": result_dict
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/cases/{case_id}")
def get_case(case_id: str):
    if case_id in CASE_STORE:
        return CASE_STORE[case_id]
    raise HTTPException(status_code=404, detail="Case not found")

@app.get("/api/supplier/request/{token}")
def get_supplier_request(token: str):
    case_id = TOKEN_MAP.get(token)
    if not case_id or case_id not in CASE_STORE:
        for cid, cdata in CASE_STORE.items():
            if cdata.get("supplier_request", {}).get("token") == token:
                case_id = cid
                break

    if not case_id or case_id not in CASE_STORE:
        return {
            "token": token,
            "case_number": "CG-IN-2026-904",
            "company_name": "Bharat Precision Forgings Ltd",
            "product_name": "Hot-Rolled Structural Alloy Billets",
            "supplier_company": "Deccan Sponge Iron Pvt Ltd",
            "supplier_contact": "Supplier Desk",
            "missing_items": [
                {
                    "field_name": "precursor_emissions_data",
                    "description": "Certified specific embedded carbon emissions for Direct Reduced Iron (DRI) heat lots supplied in Q1 2026."
                }
            ],
            "expires_at": "2026-11-10T00:00:00Z"
        }

    cdata = CASE_STORE[case_id]
    return {
        "token": token,
        "case_id": case_id,
        "case_number": cdata.get("case_number"),
        "company_name": cdata.get("company_name"),
        "product_name": cdata.get("product_name"),
        "supplier_company": cdata.get("supplier_company"),
        "supplier_contact": cdata.get("supplier_contact_person"),
        "missing_items": cdata.get("missing_data_items", []),
        "expires_at": cdata.get("supplier_request", {}).get("expires_at")
    }

class SupplierResponseModel(BaseModel):
    token: str
    scenario: str
    notes: Optional[str] = None
    uploaded_file_name: Optional[str] = None
    precursor_val: Optional[float] = None

@app.post("/api/supplier/submit")
def submit_supplier_response(resp: SupplierResponseModel):
    case_id = TOKEN_MAP.get(resp.token)
    if not case_id:
        for cid, cdata in CASE_STORE.items():
            if cdata.get("supplier_request", {}).get("token") == resp.token:
                case_id = cid
                break

    case_data = CASE_STORE.get(case_id, {})
    if not case_data and case_id:
        case_data = {"case_id": case_id}

    if resp.scenario == "available":
        new_doc = {
            "id": f"sup-doc-{resp.token[:6]}",
            "file_name": resp.uploaded_file_name or "Supplier_DRI_Emissions_Cert.pdf",
            "category": "supplier_doc",
            "is_supplier_document": True
        }
        case_data["documents"] = case_data.get("documents", []) + [new_doc]
        
        val = resp.precursor_val or (case_data.get("product_quantity", 48.66) * 1.08)
        new_extracted = {
            "field_name": "precursor_emissions_data",
            "field_label": "Supplier Certified DRI Test Certificate",
            "extracted_value": f"{val} MT Sponge Iron",
            "numeric_value": float(val),
            "unit": "MT",
            "source_file_name": new_doc["file_name"],
            "page_number": 1,
            "confidence": 0.99,
            "extraction_timestamp": "2026-11-01T00:00:00Z"
        }
        case_data["extracted_fields"] = case_data.get("extracted_fields", []) + [new_extracted]
        case_data["missing_data_items"] = []
        case_data["supplier_response"] = {
            "scenario": "available",
            "notes": resp.notes,
            "timestamp": "2026-11-01T00:00:00Z"
        }
        
        calc = calculator_agent.calculate(case_data, case_data["extracted_fields"])
        verif = verifier_agent.verify(case_data, case_data["extracted_fields"], calc)
        rep = report_agent.generate_pdf_report(case_data, case_data["extracted_fields"], calc, verif)

        # Dispatch final verified emissions report and PDF link to designated receiver email
        target_email = case_data.get("supplier_email") or os.getenv("DEFAULT_RECEIVER_EMAIL", "lalchandkuhikar5@gmail.com")
        pdf_download_url = rep.get("supabase_url") or rep.get("download_url") or f"http://localhost:3000/api/reports/download/{rep.get('file_name', '')}"
        try:
            from backend.agents.workflow import outreach_agent
            outreach_agent.send_completed_report_email(
                to_email=target_email,
                case_data=case_data,
                calculations=calc,
                audit_report=rep,
                pdf_url=pdf_download_url,
                recipient_name=case_data.get("supplier_contact_person") or case_data.get("company_name")
            )
        except Exception as mail_err:
            print(f"[Main Submit] Report completion email dispatch notice: {mail_err}")

        case_data["calculations"] = calc
        case_data["verification_findings"] = verif
        case_data["verification_status"] = verif["overall_status"]
        case_data["audit_report"] = rep
        case_data["status"] = "verified" if verif["overall_status"] == "PASS" else "review_required"

        if case_id:
            CASE_STORE[case_id] = case_data

        return {
            "success": True,
            "scenario": "available",
            "message": "Supplier document accepted and integrated. Calculations updated.",
            "verification_status": verif["overall_status"]
        }

    elif resp.scenario in ["unavailable", "drop_missing"]:
        case_data["precursor_dropped"] = True
        case_data["missing_data_items"] = []
        new_extracted = {
            "field_name": "precursor_emissions_data",
            "field_label": "Precursor Emissions: Dropped / Scope 1 & 2 Direct Boundary Applied",
            "extracted_value": "0.00 MT (Dropped per Exporter Authorization)",
            "numeric_value": 0.0,
            "unit": "MT",
            "source_file_name": "Exporter Authorization (Scope 1+2 Boundary)",
            "page_number": 1,
            "confidence": 1.0,
            "extraction_timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
        }
        case_data["extracted_fields"] = [f for f in case_data.get("extracted_fields", []) if f.get("field_name") != "precursor_emissions_data"] + [new_extracted]
        case_data["supplier_response"] = {
            "scenario": "unavailable",
            "notes": resp.notes or "Precursor data unavailable. Exporter authorized dropping parameter; calculating on Scope 1 direct combustion + Scope 2 electricity boundary.",
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
        }

        calc = calculator_agent.calculate(case_data, case_data["extracted_fields"])
        verif = verifier_agent.verify(case_data, case_data["extracted_fields"], calc)
        rep = report_agent.generate_pdf_report(case_data, case_data["extracted_fields"], calc, verif)

        target_email = case_data.get("supplier_email") or os.getenv("DEFAULT_RECEIVER_EMAIL", "lalchandkuhikar5@gmail.com")
        pdf_download_url = rep.get("supabase_url") or rep.get("download_url") or f"http://localhost:3000/api/reports/download/{rep.get('file_name', '')}"
        try:
            from backend.agents.workflow import outreach_agent
            outreach_agent.send_completed_report_email(
                to_email=target_email,
                case_data=case_data,
                calculations=calc,
                audit_report=rep,
                pdf_url=pdf_download_url,
                recipient_name=case_data.get("supplier_contact_person") or case_data.get("company_name")
            )
        except Exception as mail_err:
            print(f"[Main Submit] Report completion email dispatch notice: {mail_err}")

        case_data["calculations"] = calc
        case_data["verification_findings"] = verif
        case_data["verification_status"] = verif["overall_status"]
        case_data["audit_report"] = rep
        case_data["status"] = "verified" if verif["overall_status"] == "PASS" else "review_required"
        case_data["current_agent"] = "completed"

        if case_id:
            CASE_STORE[case_id] = case_data

        return {
            "success": True,
            "scenario": resp.scenario,
            "message": "Missing precursor parameter dropped per authorization. Scope 1 + Scope 2 calculations verified and completed.",
            "verification_status": verif["overall_status"],
            "case": case_data
        }

    return {"success": True, "scenario": resp.scenario}

@app.get("/api/reports/download/{file_name}")
def download_report(file_name: str):
    file_path = os.path.join("reports", file_name)
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="application/pdf", filename=file_name)
    raise HTTPException(status_code=404, detail="Report file not found")
