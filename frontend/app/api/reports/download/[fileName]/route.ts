import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ fileName: string }> }
) {
  try {
    const { fileName } = await params;
    const safeName = path.basename(fileName);
    const filePath = path.join(process.cwd(), 'public', 'reports', safeName);

    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${safeName}"`
        }
      });
    }

    // Direct fallback from Supabase Storage bucket 'carbongaurd-reports'
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://osugressdalwirfqknco.supabase.co';
    const supabaseReportUrl = `${supabaseUrl}/storage/v1/object/public/carbongaurd-reports/${safeName}`;

    try {
      const sResp = await fetch(supabaseReportUrl);
      if (sResp.ok) {
        const arrayBuf = await sResp.arrayBuffer();
        return new NextResponse(Buffer.from(arrayBuf), {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${safeName}"`,
            'Cache-Control': 'public, max-age=3600'
          }
        });
      }
    } catch {
      // Fall through to 404
    }

    return NextResponse.json({ error: 'Report file not found' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
