import { getPosts } from "@/lib/posts"
import { BlogCard } from "@/components/blog-card"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export default async function HomePage() {
  const posts = await getPosts()
  const featuredPosts = posts.slice(0, 6) // 최신 6개 포스트만 표시

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>개발자의 일상과 기록</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
            생각을 기록하고
            <br />
            <span className="text-primary">경험을 공유합니다</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            개발하면서 배운 것들, 일상에서 느낀 점들, 그리고 관심 있는 주제들에 대한 생각을 정리하고 공유하는
            공간입니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/blog">
                모든 글 보기
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/about">소개 보기</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">최근 글</h2>
            <p className="text-muted-foreground">새로 작성된 글들을 확인해보세요</p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/blog">
              전체 보기
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Blog</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                개발자의 일상과 기록을 담은 개인 블로그입니다. 새로운 것을 배우고 경험을 공유합니다.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">링크</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    소개
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                    블로그
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    GitHub
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">연락</h3>
              <p className="text-muted-foreground text-sm">
                궁금한 점이나 피드백이 있으시면
                <br />
                언제든 연락해주세요!
              </p>
            </div>
          </div>
          <div className="border-t border-border/40 mt-8 pt-8 text-center text-muted-foreground text-sm">
            <p>© 2025 Eggmun Blog. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
