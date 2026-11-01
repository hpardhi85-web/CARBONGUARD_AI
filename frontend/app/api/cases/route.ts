import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';
import { ComplianceCase } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { getAdminClient } from '@/lib/supabase';

export async function GET() {
  const cases = dataStore.getCases();
  return NextResponse.json({ cases });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const caseId = `case-${uuidv4().substring(0, 8)}`;
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const caseNumber = `CG-IN-2026-${randomSuffix}`;

    const newCase: ComplianceCase = {
      id: caseId,
      case_number: caseNumber,
      company_name: body.company_name || 'Exporter Enterprise',
      manufacturing_facility: body.manufacturing_facility || 'Main Plant Unit 1',
      facility_location: body.facility_location || 'Industrial Area, India',
      company_contact: body.company_contact || '',
      product_name: body.product_name || 'Industrial Steel Product',
      product_category: body.product_category || 'Iron and Steel',
      product_grade: body.product_grade || 'Standard Grade',
      product_quantity: parseFloat(body.product_quantity) || 1.0,
      quantity_unit: body.quantity_unit || 'MT',
      manufacturing_period: body.manufacturing_period || 'Q1 2026',
      destination_country: body.destination_country || 'Germany',
      cbam_classification: body.cbam_classification || '7214 20 00',
      supplier_company: body.supplier_company || 'Primary Upstream Supplier',
      supplier_contact_person: body.supplier_contact_person || 'Supplier Lead',
      supplier_email: body.supplier_email || '',
      supplier_phone: body.supplier_phone || '',
      outreach_authorized: body.outreach_authorized !== false,
      buyer_company: body.buyer_company || 'EU Buyer GmbH',
      buyer_contact_person: body.buyer_contact_person || 'Buyer Rep',
      buyer_email: body.buyer_email || '',
      reporting_period: body.reporting_period || 'Q1 2026',
      reporting_year: parseInt(body.reporting_year) || 2026,
      reporting_route: body.reporting_route || 'Standard EU CBAM Route',
      additional_remarks: body.additional_remarks || '',
      status: 'draft',
      verification_status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      documents: [],
      extracted_fields: [],
      missing_data_items: []
    };

    const created = dataStore.addCase(newCase);

    // Persist case record to Supabase compliance_cases table
    try {
      const admin = getAdminClient();
      await admin.from('compliance_cases').upsert({
        id: created.id,
        case_number: created.case_number,
        company_name: created.company_name,
        manufacturing_facility: created.manufacturing_facility,
        facility_location: created.facility_location,
        company_contact: created.company_contact,
        product_name: created.product_name,
        product_category: created.product_category,
        product_grade: created.product_grade,
        product_quantity: created.product_quantity,
        quantity_unit: created.quantity_unit,
        manufacturing_period: created.manufacturing_period,
        destination_country: created.destination_country,
        cbam_classification: created.cbam_classification,
        supplier_company: created.supplier_company,
        supplier_contact_person: created.supplier_contact_person,
        supplier_email: created.supplier_email,
        supplier_phone: created.supplier_phone,
        outreach_authorized: created.outreach_authorized,
        buyer_company: created.buyer_company,
        buyer_contact_person: created.buyer_contact_person,
        buyer_email: created.buyer_email,
        reporting_period: created.reporting_period,
        reporting_year: created.reporting_year,
        reporting_route: created.reporting_route,
        additional_remarks: created.additional_remarks,
        status: created.status,
        verification_status: created.verification_status,
      });
    } catch (dbErr) {
      console.warn('Supabase compliance_cases insert notice:', dbErr);
    }

    return NextResponse.json({ success: true, case: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

