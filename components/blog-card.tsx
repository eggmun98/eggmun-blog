import Link from "next/link"
import { Calendar, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  image: string
  tags: string[]
}

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <Card className="card-hover overflow-hidden border border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 bg-card hover:bg-card/90 backdrop-blur-sm h-[420px] flex flex-col">
        <div className="h-48 overflow-hidden">
          <img
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-6 bg-card/95 flex-1 flex flex-col">
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{post.readTime}</span>
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
            {post.title}
          </h2>

          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4 flex-1">{post.excerpt}</p>

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
