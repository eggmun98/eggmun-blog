import { getPost, getPosts } from "@/lib/posts"
import { Header } from "@/components/header"
import { GitHubComments } from "@/components/github-comments"
import { MarkdownContent } from "@/components/markdown-content"
import { Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import type { Metadata } from "next"

type BlogPostPageProps = {
  params: Promise<{ slug: string }>
}

const SITE_URL = "https://eggmun.com"

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)

  if (!post) {
    return {}
  }

  const postUrl = `${SITE_URL}/blog/${post.slug}`
  const imageUrl = post.image ? new URL(post.image, SITE_URL).toString() : `${SITE_URL}/images/logos/eggmun-500x500.png`

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      type: "article",
      url: postUrl,
      title: post.title,
      description: post.excerpt,
      siteName: "문성진 | 개발자",
      locale: "ko_KR",
      publishedTime: post.date,
      authors: ["문성진"],
      tags: post.tags,
      images: [
        {
          url: imageUrl,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    },
  }
}

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPost({
  params,
}: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              블로그로 돌아가기
            </Link>
          </Button>
        </div>

        <article>
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
            <div className="flex items-center justify-center gap-6 text-muted-foreground text-sm mb-8">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.date}>{post.date}</time>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div className="mb-8">
            <img
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>

          <MarkdownContent content={post.content} />
        </article>

        <div className="mt-16">
          <GitHubComments />
        </div>
      </main>
    </div>
  )
}
