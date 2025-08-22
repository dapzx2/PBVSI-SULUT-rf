import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = path.extname(file.name);
    const uniqueFileName = `${uuidv4()}${fileExtension}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadDir, uniqueFileName);

    // Ensure the uploads directory exists
    // This is a simplified check; in production, you might want a more robust solution
    // For now, we assume 'public/uploads' exists or can be created by the system.
    // If it doesn't exist, writeFile will throw an error.

    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${uniqueFileName}`;
    return NextResponse.json({ url: fileUrl }, { status: 200 });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file.', details: error.message }, { status: 500 });
  }
}
