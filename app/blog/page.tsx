import { getPosts } from "@/lib/posts"
import { BlogCard } from "@/components/blog-card"
import { Header } from "@/components/header"

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-4">모든 글</h1>
          <p className="text-muted-foreground">개발, 일상, 그리고 다양한 생각들을 기록한 글들입니다.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </main>
    </div>
  )
}
