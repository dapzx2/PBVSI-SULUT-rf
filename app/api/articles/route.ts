import { NextResponse } from 'next/server';
import { getArticles, createArticle, updateArticle, deleteArticle } from '@/lib/articles';

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

export async function POST(request: Request) {
  try {
    const articleData = await request.json();
    const { article, error } = await createArticle(articleData);

    if (error) {
      console.error('Error creating article in API route:', error);
      return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
    }

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...articleData } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Article ID is required for update' }, { status: 400 });
    }
    const { article, error } = await updateArticle(id, articleData);

    if (error) {
      console.error('Error updating article in API route:', error);
      return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('Unexpected error in API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Article ID is required for deletion' }, { status: 400 });
    }
    const { success, error } = await deleteArticle(id);

    if (error) {
      console.error('Error deleting article in API route:', error);
      return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
    }

    return NextResponse.json({ success });
  } catch (error) {
    console.error('Unexpected error in API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
