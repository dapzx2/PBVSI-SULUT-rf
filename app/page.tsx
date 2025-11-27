import { getArticles } from "@/lib/articles"
import { HomeContent } from "@/components/home/home-content"

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const { articles } = await getArticles()
  const latestArticles = articles?.slice(0, 3) || []

  return <HomeContent articles={latestArticles} />
}
