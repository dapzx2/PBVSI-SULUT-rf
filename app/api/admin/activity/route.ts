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

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const { logs, total, error } = await getAdminActivityLogs(page, limit);

    if (error) {
      return NextResponse.json({ message: error }, { status: 500 });
    }

    return NextResponse.json({
      data: {
        logs,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching admin activity logs:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
