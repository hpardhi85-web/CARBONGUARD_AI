import os
import sys

# Ensure backend package can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.agents.report_generator import ReportGenerationAgent

def generate_seeds():
    agent = ReportGenerationAgent(output_dir="reports")
    
    # Case 001 Seed Report
    case_001 = {
        "case_number": "CG-IN-2026-081",
        "company_name": "Apex Forgings & Steel Products Pvt Ltd",
        "manufacturing_facility": "Unit 3 Induction Furnace & Rolling Mill",
        "facility_location": "Ludhiana, Punjab, India",
        "product_name": "Hot-Rolled Structural Alloy Steel Bars (Fe500D)",
        "product_category": "Iron and Steel",
        "product_quantity": 48.66,
        "quantity_unit": "MT",
        "destination_country": "Germany",
        "cbam_classification": "7214 20 00",
        "supplier_company": "Deccan Sponge Iron & Power Ltd",
        "buyer_company": "Krupp Bautechnik GmbH",
        "reporting_period": "Q1 2026",
        "reporting_year": 2026
    }
    
    extracted_001 = [
        {
            "field_label": "Export Invoice Net Quantity",
            "field_name": "product_quantity",
            "extracted_value": "48.66 MT",
            "source_file_name": "Commercial_Export_Invoice_APEX_2026_044.pdf",
            "page_number": 1,
            "confidence": 0.99
        },
        {
            "field_label": "Mill Test Certificate Certified Net Mass",
            "field_name": "test_certificate_quantity",
            "extracted_value": "48.66 MT",
            "source_file_name": "Mill_Test_Certificate_HT88421.pdf",
            "page_number": 1,
            "confidence": 0.99
        },
        {
            "field_label": "PSPCL Industrial Electricity Reading",
            "field_name": "electricity_consumption",
            "extracted_value": "20,437.2 kWh",
            "source_file_name": "PSPCL_Industrial_Electricity_Bill_Q1.pdf",
            "page_number": 1,
            "confidence": 0.98
        },
        {
            "field_label": "Furnace Oil Fuel Consumption",
            "field_name": "fuel_consumption",
            "extracted_value": "1,727.4 Liters",
            "source_file_name": "IOCL_Furnace_Oil_Fuel_Invoice_981.pdf",
            "page_number": 1,
            "confidence": 0.97
        },
        {
            "field_label": "Supplier DRI Raw Material Precursor Lot",
            "field_name": "precursor_emissions_data",
            "extracted_value": "52.55 MT Sponge Iron",
            "source_file_name": "Deccan_Sponge_DRI_Emissions_Cert.pdf",
            "page_number": 1,
            "confidence": 0.96
        }
    ]
    
    calc_001 = {
        "direct_emissions": 5.38,
        "indirect_emissions": 14.63,
        "precursor_emissions": 100.90,
        "total_embedded_emissions": 120.91,
        "emissions_intensity": 2.4848,
        "quantity_unit": "MT",
        "calculation_breakdown": {
            "direct_combustion": {
                "input_value": 1727.4,
                "input_unit": "Liters",
                "emission_factor": 3.114
            },
            "indirect_electricity": {
                "input_value": 20437.2,
                "input_unit": "kWh",
                "emission_factor": 0.716
            },
            "precursor_materials": {
                "input_value": 52.55,
                "input_unit": "MT",
                "emission_factor": 1.92
            }
        }
    }
    
    verif_001 = {
        "overall_status": "PASS",
        "findings": [
            {
                "title": "Multi-Document Quantity Reconciliation",
                "severity": "INFO",
                "status": "PASSED",
                "description": "Verified: Product quantity (48.660 MT) matches across invoice and test certificate."
            },
            {
                "title": "Summation Integrity Verification",
                "severity": "INFO",
                "status": "PASSED",
                "description": "Arithmetic confirmed: 5.38 + 14.63 + 100.90 = 120.91 tCO2e."
            },
            {
                "title": "Specific Emissions Intensity Verification",
                "severity": "INFO",
                "status": "PASSED",
                "description": "Intensity mathematically confirmed at 2.4848 tCO2e / MT."
            },
            {
                "title": "Grid Emission Factor Applicability",
                "severity": "INFO",
                "status": "PASSED",
                "description": "CEA Baseline factor (0.716 kg CO2/kWh) compliant with Indian benchmarks."
            }
        ]
    }
    
    res = agent.generate_pdf_report(case_001, extracted_001, calc_001, verif_001)
    print(f"Generated seed report: {res['file_path']} ({res['file_size']} bytes)")

if __name__ == "__main__":
    generate_seeds()

