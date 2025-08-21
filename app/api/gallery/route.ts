import { NextResponse } from 'next/server';
import { getGalleryItems } from '@/lib/gallery';

export async function GET() {
  try {
    const { galleryItems, error } = await getGalleryItems();

    if (error) {
      console.error('Error fetching gallery items in API route:', error);
      return NextResponse.json({ error: 'Failed to fetch gallery items' }, { status: 500 });
    }

    return NextResponse.json(galleryItems);
  } catch (error) {
    console.error('Unexpected error in API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}