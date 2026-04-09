import { NextResponse } from 'next/server';
import { healthCheck } from '@/lib/api/bigquery';

export async function GET() {
  const bigqueryHealthy = await healthCheck();
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      bigquery: bigqueryHealthy ? 'up' : 'down',
    },
  });
}
