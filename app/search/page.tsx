import { filterPostsByQuery, filterPostsByTag } from "@/lib/server-search"
import type { BlogPost } from "@/lib/posts"
import { BlogCard } from "@/components/blog-card"
import { Header } from "@/components/header"
import { Search } from "lucide-react"

interface SearchPageProps {
  searchParams: Promise<{ q?: string; tag?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q
  const tag = params.tag

  let posts: BlogPost[] = []
  let title = ""
  let description = ""

  if (query) {
    posts = filterPostsByQuery(query)
    title = `"${query}" 검색 결과`
    description = `"${query}"에 대한 검색 결과 ${posts.length}개를 찾았습니다.`
  } else if (tag) {
    posts = filterPostsByTag(tag)
    title = `"${tag}" 태그`
    description = `"${tag}" 태그가 포함된 글 ${posts.length}개입니다.`
  } else {
    title = "검색"
    description = "검색어를 입력해주세요."
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Search className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold">{title}</h1>
          </div>
          <p className="text-muted-foreground">{description}</p>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">검색 결과가 없습니다</h2>
            <p className="text-muted-foreground">다른 검색어로 시도해보시거나 모든 글을 둘러보세요.</p>
          </div>
        )}
      </main>
    </div>
  )
}
