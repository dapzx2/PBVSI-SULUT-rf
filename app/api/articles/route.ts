import { NextResponse } from "next/server"
import { NextResponse } from "next/server"
import { getArticles, getArticleBySlug } from "@/lib/articles";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get("slug")
  const limit = searchParams.get("limit")

  try {
    if (slug) {
      const { article, error } = await getArticleBySlug(slug)
      if (error) {
        return NextResponse.json({ error: "Article not found" }, { status: 404 })
      }
      return NextResponse.json(article)
    } else {
      const { articles, error } = await getArticles()
      if (error) {
        throw new Error(error);
      }
      // Apply limit if provided
      const limitedArticles = limit ? articles?.slice(0, Number.parseInt(limit)) : articles;
      return NextResponse.json(limitedArticles)
    }
  } catch (error: any) {
    console.error("API Error (GET articles):", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
