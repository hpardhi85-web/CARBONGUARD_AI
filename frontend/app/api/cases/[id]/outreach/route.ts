import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';
import { v4 as uuidv4 } from 'uuid';

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

    const recipient = existingCase.supplier_email || 'lalchandkuhikar5@gmail.com';
    const token = existingCase.supplier_request?.token || `cg-token-${uuidv4()}`;
    const uploadLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/supplier/upload?token=${token}`;

    const justification = `EU CBAM STATUTORY JUSTIFICATION & REASON FOR HOLD:
Under European Union Regulation (EU) 2023/956 Annex IV, ${existingCase.product_name} is legally classified as "Complex Goods".
The statutory carbon accounting process CANNOT proceed to the Calculator Agent because certified upstream embedded carbon intensity for the raw material precursor (DRI / Sponge Iron / Pig Iron) supplied by ${existingCase.supplier_company} is currently MISSING.
To proceed: Please click your secure link below and either upload your mill test certificate / raw material invoice, or select "Data Unavailable" to authorize standard EU transitional default factors.`;

    const emailjsServiceId = process.env.EMAILJS_SERVICE_ID || 'service_3z72i5o';
    const emailjsTemplateId = process.env.EMAILJS_TEMPLATE_ID || 'template_xz25b2h';
    const emailjsPublicKey = process.env.EMAILJS_PUBLIC_KEY || 'TjvuPWcqWncAOIXOt';
    const emailjsPrivateKey = process.env.EMAILJS_PRIVATE_KEY;

    const emailjsPayload = {
      service_id: emailjsServiceId,
      template_id: emailjsTemplateId,
      user_id: emailjsPublicKey,
      ...(emailjsPrivateKey ? { accessToken: emailjsPrivateKey } : {}),
      template_params: {
        email: recipient,
        to_email: recipient,
        supplier_name: (existingCase.supplier_contact_person && existingCase.supplier_contact_person !== 'Rajesh Sharma') 
          ? existingCase.supplier_contact_person 
          : (existingCase.supplier_company ? `${existingCase.supplier_company} Representative` : 'Supplier Partner'),
        company_name: existingCase.company_name,
        missing_data: justification,
        product_name: existingCase.product_name,
        reporting_period: existingCase.reporting_period || 'Q1 2026',
        upload_link: uploadLink,
        case_number: existingCase.case_number,
        message: justification
      }
    };

    const eResp = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'origin': 'http://localhost:3000',
        'referer': 'http://localhost:3000/'
      },
      body: JSON.stringify(emailjsPayload)
    });

    const statusText = await eResp.text();
    const isSuccess = eResp.ok;

    // Update case supplier request record
    const updatedRequest = {
      id: existingCase.supplier_request?.id || `req-${uuidv4().substring(0, 6)}`,
      case_id: id,
      token: token,
      supplier_name: existingCase.supplier_contact_person || 'Supplier Partner',
      supplier_email: recipient,
      email_subject: `Action Required: Upload Raw Material Emissions Document for ${existingCase.product_name} (Ref: ${existingCase.case_number})`,
      email_body: justification,
      upload_link: uploadLink,
      missing_items: existingCase.missing_data_items || [],
      status: 'sent' as const,
      sent_at: new Date().toISOString(),
      delivery_verified: isSuccess,
      delivery_status: isSuccess ? 'Delivered via EmailJS (HTTP 200 OK)' : `Failed: ${statusText}`,
      delivery_timestamp: new Date().toISOString()
    };

    dataStore.updateCase(id, {
      supplier_request: updatedRequest,
      status: 'waiting_for_supplier',
      current_agent: 'waiting_for_supplier'
    });

    dataStore.addLog({
      case_id: id,
      agent_name: 'Outreach Agent',
      action: isSuccess ? 'SUPPLIER_EMAIL_DISPATCHED' : 'SUPPLIER_EMAIL_FAILED',
      description: isSuccess 
        ? `Statutory EU CBAM notice with exact justification delivered to ${recipient} via EmailJS.`
        : `Email delivery attempt to ${recipient} failed: ${statusText}`
    });

    return NextResponse.json({
      success: isSuccess,
      status: eResp.status,
      recipient: recipient,
      message: isSuccess 
        ? `Statutory notification email successfully delivered to ${recipient} via EmailJS!`
        : `EmailJS error (${eResp.status}): ${statusText}`,
      justification: justification,
      upload_link: uploadLink,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

