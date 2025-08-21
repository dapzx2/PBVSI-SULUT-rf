import { NextResponse } from 'next/server';
import { getArticles } from '@/lib/articles';

export async function GET() {
  console.log('API route /api/articles hit!'); // Add this line
  try {
    const { articles, error } = await getArticles();

    if (error) {
      console.error('Error fetching articles in API route:', error);
      return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
    }

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Unexpected error in API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
