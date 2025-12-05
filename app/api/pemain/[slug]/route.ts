import { NextResponse } from 'next/server';
import { getPlayerBySlug } from '@/lib/players';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        const player = await getPlayerBySlug(slug);

        if (!player) {
            return NextResponse.json(
                { error: 'Pemain tidak ditemukan' },
                { status: 404 }
            );
        }

        return NextResponse.json(player);
    } catch (error: any) {
        console.error('Error fetching player by slug:', error);
        return NextResponse.json(
            { error: 'Gagal memuat data pemain' },
            { status: 500 }
        );
    }
}
