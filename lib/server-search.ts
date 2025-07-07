import { getPosts } from "./posts"
import type { BlogPost } from "./posts"

export interface SearchResult {
  slug: string
  title: string
  excerpt: string
  tags: string[]
  type: "post" | "tag"
}

/**
 * 서버 컴포넌트에서 사용할 검색 함수
 */
export function searchPosts(query: string): SearchResult[] {
  const posts = getPosts()
  const results: SearchResult[] = []
  const searchTerm = query.toLowerCase().trim()

  if (!searchTerm) return results

  // 포스트 검색
  posts.forEach((post) => {
    const titleMatch = post.title.toLowerCase().includes(searchTerm)
    const excerptMatch = post.excerpt.toLowerCase().includes(searchTerm)
    const contentMatch = post.content.toLowerCase().includes(searchTerm)
    const tagMatch = post.tags.some((tag) => tag.toLowerCase().includes(searchTerm))

    if (titleMatch || excerptMatch || contentMatch || tagMatch) {
      results.push({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        tags: post.tags,
        type: "post",
      })
    }
  })

  // 태그 검색
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)))
  const matchingTags = allTags.filter((tag) => tag.toLowerCase().includes(searchTerm))

  matchingTags.forEach((tag) => {
    const postsWithTag = posts.filter((post) => post.tags.includes(tag))
    if (postsWithTag.length > 0) {
      results.push({
        slug: tag,
        title: tag,
        excerpt: `${postsWithTag.length}개의 글`,
        tags: [tag],
        type: "tag",
      })
    }
  })

  return results.slice(0, 8) // 최대 8개 결과만 반환
}

/**
 * 서버 컴포넌트에서 사용할 인기 태그 함수
 */
export function getPopularTags(): string[] {
  const posts = getPosts()
  const tagCount: { [key: string]: number } = {}

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCount[tag] = (tagCount[tag] || 0) + 1
    })
  })

  return Object.entries(tagCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([tag]) => tag)
}

/**
 * 태그로 포스트 필터링
 */
export function filterPostsByTag(tag: string): BlogPost[] {
  const posts = getPosts()
  return posts.filter((post) => post.tags.some((postTag) => postTag.toLowerCase() === tag.toLowerCase()))
}

/**
 * 쿼리로 포스트 필터링
 */
export function filterPostsByQuery(query: string): BlogPost[] {
  const posts = getPosts()
  const searchTerm = query.toLowerCase().trim()

  if (!searchTerm) return posts

  return posts.filter((post) => {
    const titleMatch = post.title.toLowerCase().includes(searchTerm)
    const excerptMatch = post.excerpt.toLowerCase().includes(searchTerm)
    const contentMatch = post.content.toLowerCase().includes(searchTerm)
    const tagMatch = post.tags.some((tag) => tag.toLowerCase().includes(searchTerm))

    return titleMatch || excerptMatch || contentMatch || tagMatch
  })
} 