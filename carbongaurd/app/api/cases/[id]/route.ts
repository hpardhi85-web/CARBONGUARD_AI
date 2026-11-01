import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const c = dataStore.getCaseById(id);
  if (!c) {
    return NextResponse.json({ error: 'Case not found' }, { status: 404 });
  }
  return NextResponse.json({ case: c });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = dataStore.updateCase(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, case: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

