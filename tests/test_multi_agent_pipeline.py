import os
import sys

# Ensure project root is in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.agents.collector import CollectorAgent
from backend.agents.checker import MissingDataChecker
from backend.agents.outreach import OutreachAgent
from backend.agents.calculator import CalculatorAgent
from backend.agents.verifier import VerifierAgent
from backend.agents.report_generator import ReportGenerationAgent
from backend.agents.workflow import compliance_workflow
from backend.agents.state import ComplianceCaseState

def test_full_pipeline():
    print("========================================================")
    print("Testing CarbonGuard AI Multi-Agent Compliance Pipeline")
    print("========================================================")

    # 1. Initialize Test Case
    case_state = ComplianceCaseState(
        case_id="TEST-CASE-001",
        case_number="CG-IN-2026-TEST",
        company_name="Apex Forgings & Steel Products Pvt Ltd",
        manufacturing_facility="Unit 3 Induction Furnace Plant",
        facility_location="Ludhiana, Punjab, India",
        product_name="Hot-Rolled Structural Alloy Steel Rebars (Fe500D)",
        product_category="Iron and Steel",
        product_quantity=48.66,
        quantity_unit="MT",
        manufacturing_period="Q1 2026",
        destination_country="Germany",
        cbam_classification="7214 20 00",
        supplier_company="Deccan Sponge Iron & Power Ltd",
        supplier_contact_person="Rajesh Sharma",
        supplier_email="r.sharma@deccansponge.in",
        buyer_company="Krupp Bautechnik GmbH",
        buyer_contact_person="Klaus Hoffmann",
        buyer_email="k.hoffmann@krupp-bau.de",
        reporting_period="Q1 2026",
        reporting_year=2026,
        documents=[
            {
                "id": "doc-test-1",
                "file_name": "Commercial_Export_Invoice.pdf",
                "category": "purchase_invoice",
                "file_size": 320000
            },
            {
                "id": "doc-test-2",
                "file_name": "Mill_Test_Certificate_HT88421.pdf",
                "category": "test_cert",
                "file_size": 410000
            },
            {
                "id": "doc-test-3",
                "file_name": "PSPCL_Electricity_Bill.pdf",
                "category": "electricity_bill",
                "file_size": 250000
            },
            {
                "id": "doc-test-4",
                "file_name": "Furnace_Oil_Fuel_Invoice.pdf",
                "category": "fuel_record",
                "file_size": 190000
            }
        ]
    )

    # 2. Invoke LangGraph Workflow
    print("\n[Step 1] Invoking LangGraph Multi-Agent Workflow...")
    res = compliance_workflow.invoke(case_state)
    res_dict = dict(res)

    print(f"Workflow State Status: {res_dict.get('status')}")
    print(f"Current Agent: {res_dict.get('current_agent')}")
    print(f"Extracted Fields Count: {len(res_dict.get('extracted_fields', []))}")
    print(f"Missing Items Count: {len(res_dict.get('missing_data_items', []))}")
    
    if res_dict.get("supplier_request"):
        print(f"Outreach Email Generated: Subject -> '{res_dict['supplier_request']['email_subject']}'")
        print(f"Supplier Portal Link: {res_dict['supplier_request']['upload_link']}")

    # 3. Simulate Supplier Response (Scenario A: Available)
    print("\n[Step 2] Simulating Supplier Upload Response (Scenario A)...")
    res_dict["extracted_fields"].append({
        "field_name": "precursor_emissions_data",
        "field_label": "Supplier DRI Raw Material Precursor Lot",
        "extracted_value": "52.55 MT Sponge Iron",
        "numeric_value": 52.55,
        "unit": "MT",
        "source_file_name": "Supplier_DRI_Emissions_Cert.pdf",
        "page_number": 1,
        "confidence": 0.99
    })
    res_dict["missing_data_items"] = []

    # 4. Calculator Agent Execution
    print("\n[Step 3] Running Deterministic Calculator Agent...")
    calc_agent = CalculatorAgent()
    calc = calc_agent.calculate(res_dict, res_dict["extracted_fields"])
    print(f"Direct Combustion (Scope 1): {calc['direct_emissions']} tCO2e")
    print(f"Indirect Electricity (Scope 2): {calc['indirect_emissions']} tCO2e")
    print(f"Precursor Raw Materials (Scope 3): {calc['precursor_emissions']} tCO2e")
    print(f"Total Embedded Emissions: {calc['total_embedded_emissions']} tCO2e")
    print(f"Specific Emissions Intensity: {calc['emissions_intensity']} {calc['intensity_unit']}")

    # 5. Verifier Agent Execution (Clean Audit)
    print("\n[Step 4] Running Verifier Agent (Clean Pass)...")
    verif_agent = VerifierAgent()
    verif = verif_agent.verify(res_dict, res_dict["extracted_fields"], calc)
    print(f"Verifier Status: {verif['overall_status']}")
    print(f"Checks Run: {verif['checks_run']} | Passed: {verif['checks_passed']} | Flagged: {verif['checks_flagged']}")
    for f in verif['findings']:
        print("  ->", f['status'], f['title'], f.get('description'))
    assert verif["overall_status"] == "PASS", "Expected verification to pass"

    # 6. Verifier Agent Planted Error Trap
    print("\n[Step 5] Testing Planted Error Trap in Verifier Agent...")
    discrepant_fields = list(res_dict["extracted_fields"])
    discrepant_fields[0] = {
        **discrepant_fields[0],
        "extracted_value": "46.66 MT",
        "numeric_value": 46.66
    }
    verif_planted = verif_agent.verify(res_dict, discrepant_fields, calc)
    print(f"Planted Error Verification Status: {verif_planted['overall_status']}")
    flagged_findings = [f for f in verif_planted["findings"] if f["status"] == "FLAGGED"]
    print(f"Flagged Issues Trapped: {len(flagged_findings)}")
    for f in flagged_findings:
        print(f"  -> Trapped Issue: {f['title']}: {f['description']}")
    assert verif_planted["overall_status"] in ["FLAGGED", "REVIEW_REQUIRED"], "Verifier must catch discrepancy!"

    # 7. Report Generation Agent
    print("\n[Step 6] Running Report Generation Agent (ReportLab PDF)...")
    rep_agent = ReportGenerationAgent(output_dir="reports")
    rep = rep_agent.generate_pdf_report(res_dict, res_dict["extracted_fields"], calc, verif)
    print(f"Generated PDF Certificate: {rep['file_name']} ({rep['file_size']} bytes)")
    assert os.path.exists(rep["file_path"]), "Report file must exist!"

    print("\n========================================================")
    print("All Multi-Agent Pipeline Tests Passed Successfully!")
    print("========================================================")

if __name__ == "__main__":
    test_full_pipeline()
