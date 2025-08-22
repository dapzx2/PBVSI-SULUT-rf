import { NextResponse } from 'next/server';
import { getArticleBySlug } from '@/lib/articles';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    const { article, error } = await getArticleBySlug(slug);

    if (error) {
      console.error(`Error fetching article by slug ${slug} in API route:`, error);
      return NextResponse.json({ error: error }, { status: 500 });
    }

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error: any) {
    console.error(`Unexpected error fetching article by slug ${slug} in API route:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
