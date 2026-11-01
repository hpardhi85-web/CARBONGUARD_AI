import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';

export async function GET() {
  const logs = dataStore.getLogs();
  return NextResponse.json({ logs });
}

