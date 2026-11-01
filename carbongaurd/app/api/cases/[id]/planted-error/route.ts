import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';
import { VerificationFindings } from '@/lib/types';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existingCase = dataStore.getCaseById(id);
    if (!existingCase) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    const body = await req.json();
    const injectError = body.inject !== false; // default true if toggling

    if (injectError) {
      // Planted Error: Modified extracted quantity 46.660 MT vs Test Certificate 48.660 MT
      const currentFields = existingCase.extracted_fields || [];
      const updatedFields = currentFields.map(f => {
        if (f.field_name === 'product_quantity') {
          return {
            ...f,
            extracted_value: '46.66 MT',
            numeric_value: 46.66,
            is_discrepant: true,
            discrepancy_reason: 'Discrepancy detected against Mill Test Certificate (48.66 MT)'
          };
        }
        return f;
      });

      const flaggedFindings: VerificationFindings = {
        overall_status: "FLAGGED",
        checks_run: 5,
        checks_passed: 4,
        checks_flagged: 1,
        findings: [
          {
            check_id: "CHK_QTY_CROSS_DOC_MISMATCH",
            title: "Cross-Document Net Quantity Inconsistency Detected",
            severity: "CRITICAL",
            status: "FLAGGED",
            description: "Discrepancy discovered across shipping documents! Commercial Export Invoice records '46.66 MT', whereas Mill Test Certificate HT-88421 records '48.66 MT'. Variance: 2.00 MT.",
            recommendation: "Owner review required. Customs invoice and packing list must be harmonized before EU CBAM declaration submission.",
            sources_compared: [
              { doc: "Commercial_Export_Invoice.pdf", value: "46.66 MT" },
              { doc: "Mill_Test_Certificate_HT88421.pdf", value: "48.66 MT" },
              { doc: "Export_Packing_List.pdf", value: "48.66 MT" }
            ]
          },
          {
            check_id: "CHK_ARITHMETIC_TOTAL_SUM",
            title: "Summation Integrity Verification",
            severity: "INFO",
            status: "PASSED",
            description: "Component arithmetic valid."
          },
          {
            check_id: "CHK_INTENSITY_ARITHMETIC",
            title: "Specific Emissions Intensity Verification",
            severity: "INFO",
            status: "PASSED",
            description: "Recalculated with modified input divisor."
          },
          {
            check_id: "CHK_FACTOR_GEOGRAPHIC_VALIDITY",
            title: "Grid Emission Factor Applicability",
            severity: "INFO",
            status: "PASSED",
            description: "CEA Baseline factor compliant."
          },
          {
            check_id: "CHK_UNIT_CONSISTENCY",
            title: "Metric Units Harmonization",
            severity: "INFO",
            status: "PASSED",
            description: "All units consistent."
          }
        ],
        verification_timestamp: new Date().toISOString(),
        auditor_note: "Planted discrepancy trapped by Verifier Agent. Generation blocked until owner clearance."
      };

      dataStore.addLog({
        case_id: id,
        agent_name: "Verifier Agent",
        action: "DISCREPANCY_FLAGGED",
        description: "Planted error detected: Commercial Invoice (46.66 MT) vs Test Certificate (48.66 MT). Flagged for owner review."
      });

      const updated = dataStore.updateCase(id, {
        extracted_fields: updatedFields,
        verification_findings: flaggedFindings,
        verification_status: "FLAGGED",
        status: "review_required",
        current_agent: "owner_review"
      });

      return NextResponse.json({ success: true, case: updated, mode: 'error_injected' });
    } else {
      // Resolve discrepancy: restore 48.66 MT
      const currentFields = existingCase.extracted_fields || [];
      const updatedFields = currentFields.map(f => {
        if (f.field_name === 'product_quantity') {
          return {
            ...f,
            extracted_value: '48.66 MT',
            numeric_value: 48.66,
            is_discrepant: false,
            discrepancy_reason: undefined
          };
        }
        return f;
      });

      const passedFindings: VerificationFindings = {
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
            description: "Resolved: Commercial Invoice and Mill Test Certificate both reconciled to 48.66 MT."
          },
          {
            check_id: "CHK_ARITHMETIC_TOTAL_SUM",
            title: "Summation Integrity Verification",
            severity: "INFO",
            status: "PASSED",
            description: "Arithmetic valid."
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
            description: "CEA Baseline factor compliant."
          },
          {
            check_id: "CHK_UNIT_CONSISTENCY",
            title: "Metric Units Harmonization",
            severity: "INFO",
            status: "PASSED",
            description: "All units consistent."
          }
        ],
        verification_timestamp: new Date().toISOString(),
        auditor_note: "Discrepancy cleared. Audit-ready compliance certificate released."
      };

      dataStore.addLog({
        case_id: id,
        agent_name: "Verifier Agent",
        action: "DISCREPANCY_RESOLVED",
        description: "Owner confirmed 48.66 MT. Verification status updated to PASS."
      });

      const updated = dataStore.updateCase(id, {
        extracted_fields: updatedFields,
        verification_findings: passedFindings,
        verification_status: "PASS",
        status: "verified",
        current_agent: "completed"
      });

      return NextResponse.json({ success: true, case: updated, mode: 'error_resolved' });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

