import { NextResponse } from "next/server"
import { getPopularTags, searchPosts } from "@/lib/server-search"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") ?? ""

  return NextResponse.json({
    results: query.trim() ? searchPosts(query) : [],
    popularTags: getPopularTags(),
  })
}
