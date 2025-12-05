import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

// Mapping MIME types untuk berbagai jenis file
const mimeTypes: Record<string, string> = {
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.txt': 'text/plain',
};

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ filename: string }> }
) {
    try {
        const { filename } = await params;

        // Validasi filename untuk mencegah path traversal
        if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
            return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
        }

        const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
        const fileExtension = path.extname(filename).toLowerCase();
        const contentType = mimeTypes[fileExtension] || 'application/octet-stream';

        // Baca file
        const fileBuffer = await readFile(filePath);

        // Buat response dengan header yang tepat
        const response = new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                // Content-Disposition: inline agar browser menampilkan file, bukan download
                'Content-Disposition': `inline; filename="${filename}"`,
                'Content-Length': fileBuffer.length.toString(),
                // Cache untuk performa
                'Cache-Control': 'public, max-age=3600',
            },
        });

        return response;
    } catch (error: any) {
        console.error('Error serving file:', error);

        if (error.code === 'ENOENT') {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        return NextResponse.json({ error: 'Failed to serve file' }, { status: 500 });
    }
}
