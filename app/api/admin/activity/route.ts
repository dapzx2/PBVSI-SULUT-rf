import { NextResponse, NextRequest } from 'next/server';
import { getAdminActivityLogs } from '@/lib/admin';
import { verifyAuth } from '@/lib/auth'; // Assuming auth utility

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Authenticate the request
    const authResult = await verifyAuth(request);
    if (authResult.status !== 200) {
      return NextResponse.json({ message: authResult.error }, { status: authResult.status });
    }

    const logs = await getAdminActivityLogs(); // Fetch logs from database

    return NextResponse.json({ data: logs }, { status: 200 });
  } catch (error) {
    console.error('Error fetching admin activity logs:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
