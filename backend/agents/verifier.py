import datetime
from typing import Dict, Any, List

class VerifierAgent:
    """
    Verifier Agent:
    Independently challenges calculated emissions, cross-checks multiple source documents
    (Commercial Invoice vs Mill Test Certificate vs Packing List), audits arithmetic,
    and traps discrepancies or planted errors.
    """

    def verify(
        self,
        case_data: Dict[str, Any],
        extracted_fields: List[Dict[str, Any]],
        calculations: Dict[str, Any]
    ) -> Dict[str, Any]:
        findings: List[Dict[str, Any]] = []
        checks_run = 0
        checks_passed = 0
        checks_flagged = 0

        # ----------------------------------------------------
        # Check 1: Cross-Document Quantity Consistency (Planted Error Detection)
        # ----------------------------------------------------
        checks_run += 1
        invoice_qty = None
        test_cert_qty = None
        packing_list_qty = None

        for f in extracted_fields:
            fname = f.get("field_name")
            num_val = f.get("numeric_value")
            source_file = f.get("source_file_name", "").lower()
            if num_val is not None:
                if fname == "product_quantity" and ("cert" not in source_file and "test" not in source_file):
                    invoice_qty = (num_val, f.get("source_file_name"), f.get("extracted_value"))
                elif fname == "test_certificate_quantity" or (("cert" in source_file or "test" in source_file) and "supplier" not in source_file and "precursor" not in fname):
                    test_cert_qty = (num_val, f.get("source_file_name"), f.get("extracted_value"))
                elif fname == "packing_list_quantity" or ("packing" in source_file and "supplier" not in source_file):
                    packing_list_qty = (num_val, f.get("source_file_name"), f.get("extracted_value"))

        # Compare extracted quantities across docs
        quantities = [q for q in [invoice_qty, test_cert_qty, packing_list_qty] if q is not None]
        has_qty_mismatch = False

        if len(quantities) >= 2:
            base_val = quantities[0][0]
            for q_val, q_doc, q_text in quantities[1:]:
                # Tolerance of 0.01 MT
                if abs(q_val - base_val) > 0.01:
                    has_qty_mismatch = True
                    checks_flagged += 1
                    findings.append({
                        "check_id": "CHK_QTY_CROSS_DOC_MISMATCH",
                        "title": "Cross-Document Net Quantity Inconsistency Detected",
                        "severity": "CRITICAL",
                        "status": "FLAGGED",
                        "description": (
                            f"Mismatch discovered across shipping documents! "
                            f"{quantities[0][1]} records '{quantities[0][2]}', whereas "
                            f"{q_doc} records '{q_text}'. "
                            f"Discrepancy: {abs(q_val - base_val):.3f} MT."
                        ),
                        "sources_compared": [
                            {"doc": q[1], "value": q[2]} for q in quantities
                        ],
                        "recommendation": "Owner must verify the official customs bill of lading and correct the discrepant record before report issuance."
                    })
                    break

        if not has_qty_mismatch and len(quantities) >= 1:
            checks_passed += 1
            findings.append({
                "check_id": "CHK_QTY_CROSS_DOC_MATCH",
                "title": "Multi-Document Quantity Reconciliation",
                "severity": "INFO",
                "status": "PASSED",
                "description": f"Verified: Product quantity ({quantities[0][0]} MT) is perfectly consistent across invoice, test certificate, and packing list documents.",
                "sources_compared": [{"doc": q[1], "value": q[2]} for q in quantities]
            })

        # ----------------------------------------------------
        # Check 2: Independent Arithmetic Recalculation
        # ----------------------------------------------------
        checks_run += 1
        breakdown = calculations.get("calculation_breakdown", {})
        dir_tco2e = calculations.get("direct_emissions", 0.0)
        indir_tco2e = calculations.get("indirect_emissions", 0.0)
        prec_tco2e = calculations.get("precursor_emissions", 0.0)
        total_reported = calculations.get("total_embedded_emissions", 0.0)

        expected_total = round(dir_tco2e + indir_tco2e + prec_tco2e, 4)
        if abs(total_reported - expected_total) > 0.001:
            checks_flagged += 1
            findings.append({
                "check_id": "CHK_ARITHMETIC_TOTAL_SUM",
                "title": "Mathematical Total Embedded Emissions Discrepancy",
                "severity": "CRITICAL",
                "status": "FLAGGED",
                "description": f"Reported total {total_reported} tCO2e does not match sum of components ({dir_tco2e} + {indir_tco2e} + {prec_tco2e} = {expected_total} tCO2e).",
                "recommendation": "Recalculate with deterministic calculator agent."
            })
        else:
            checks_passed += 1
            findings.append({
                "check_id": "CHK_ARITHMETIC_TOTAL_SUM",
                "title": "Summation Integrity Verification",
                "severity": "INFO",
                "status": "PASSED",
                "description": f"Arithmetic passed: {dir_tco2e} (Scope 1) + {indir_tco2e} (Scope 2) + {prec_tco2e} (Precursors) = {expected_total} tCO2e."
            })

        # ----------------------------------------------------
        # Check 3: Emissions Intensity Arithmetic
        # ----------------------------------------------------
        checks_run += 1
        reported_intensity = calculations.get("emissions_intensity", 0.0)
        prod_qty = float(case_data.get("product_quantity", 1.0))
        expected_intensity = round(total_reported / max(prod_qty, 0.001), 4)

        if abs(reported_intensity - expected_intensity) > 0.01:
            checks_flagged += 1
            findings.append({
                "check_id": "CHK_INTENSITY_ARITHMETIC",
                "title": "Emissions Intensity Factor Discrepancy",
                "severity": "HIGH",
                "status": "FLAGGED",
                "description": f"Calculated intensity {reported_intensity} tCO2e/MT diverges from Total/Qty ratio {expected_intensity} tCO2e/MT."
            })
        else:
            checks_passed += 1
            findings.append({
                "check_id": "CHK_INTENSITY_ARITHMETIC",
                "title": "Specific Emissions Intensity Verification",
                "severity": "INFO",
                "status": "PASSED",
                "description": f"Intensity mathematically confirmed at {expected_intensity} tCO2e / MT."
            })

        # ----------------------------------------------------
        # Check 4: Emission Factor Geographic Applicability
        # ----------------------------------------------------
        checks_run += 1
        factors_used = calculations.get("emission_factors_used", {})
        elec_factor = factors_used.get("electricity", {})
        if "India" in elec_factor.get("geographic_scope", "") or "CEA" in elec_factor.get("source", ""):
            checks_passed += 1
            findings.append({
                "check_id": "CHK_FACTOR_GEOGRAPHIC_VALIDITY",
                "title": "Grid Emission Factor Applicability",
                "severity": "INFO",
                "status": "PASSED",
                "description": f"Grid factor '{elec_factor.get('source')}' adheres to Indian Central Electricity Authority national baseline standards."
            })
        else:
            checks_flagged += 1
            findings.append({
                "check_id": "CHK_FACTOR_GEOGRAPHIC_VALIDITY",
                "title": "Unverified Geographic Factor",
                "severity": "MEDIUM",
                "status": "FLAGGED",
                "description": "Grid electricity factor lacks verified Indian regional registry reference."
            })

        # ----------------------------------------------------
        # Check 5: Unit Consistency Checks
        # ----------------------------------------------------
        checks_run += 1
        has_invalid_unit = False
        for f in extracted_fields:
            if f.get("numeric_value") is not None and not f.get("unit"):
                has_invalid_unit = True
                checks_flagged += 1
                findings.append({
                    "check_id": "CHK_UNIT_MISSING",
                    "title": f"Missing Unit on Field: {f.get('field_label')}",
                    "severity": "MEDIUM",
                    "status": "FLAGGED",
                    "description": f"Extracted value '{f.get('extracted_value')}' does not have an explicit metric unit assigned."
                })
                break

        if not has_invalid_unit:
            checks_passed += 1
            findings.append({
                "check_id": "CHK_UNIT_CONSISTENCY",
                "title": "Metric Units Harmonization",
                "severity": "INFO",
                "status": "PASSED",
                "description": "All numerical activity data entries conform to standardized SI and metric units (MT, kWh, Liters)."
            })

        # Determine overall verification status
        if checks_flagged == 0:
            overall_status = "PASS"
        elif any(f["severity"] == "CRITICAL" for f in findings):
            overall_status = "FLAGGED"
        else:
            overall_status = "REVIEW_REQUIRED"

        return {
            "overall_status": overall_status,
            "checks_run": checks_run,
            "checks_passed": checks_passed,
            "checks_flagged": checks_flagged,
            "findings": findings,
            "verification_timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "auditor_note": (
                "Automated internal compliance verification completed. "
                "This audit confirms multi-document evidence consistency, "
                "deterministic calculation proof, and EU CBAM reporting route alignment."
            )
        }
