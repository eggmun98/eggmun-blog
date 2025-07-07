"use client"

import { BlogPost } from "./posts"

// 클라이언트 컴포넌트에서 사용할 목 데이터
const mockPosts: BlogPost[] = [
  {
    slug: "first-post",
    title: "첫 번째 블로그 포스트",
    excerpt: "블로그를 시작하며 작성한 첫 번째 글입니다.",
    content: "",
    date: "2024-01-01",
    readTime: "2분",
    image: "/images/first-post.jpg",
    tags: ["블로그", "소개"]
  },
  {
    slug: "react-tips",
    title: "React 개발 팁 모음",
    excerpt: "React 개발을 더 효율적으로 할 수 있는 팁들을 소개합니다.",
    content: "",
    date: "2024-02-15",
    readTime: "5분",
    image: "/images/react-tips.jpg",
    tags: ["React", "개발", "팁"]
  },
  {
    slug: "minimalism",
    title: "미니멀리즘과 개발자의 삶",
    excerpt: "미니멀리즘을 개발자의 삶에 적용하는 방법에 대해 이야기합니다.",
    content: "",
    date: "2024-03-20",
    readTime: "4분",
    image: "/images/minimalism.jpg",
    tags: ["미니멀리즘", "생산성", "라이프스타일"]
  }
]

export interface SearchResult {
  slug: string
  title: string
  excerpt: string
  tags: string[]
  type: "post" | "tag"
}

// 클라이언트 컴포넌트에서 사용할 검색 함수
export function searchPosts(query: string): SearchResult[] {
  const results: SearchResult[] = []
  const searchTerm = query.toLowerCase().trim()

  if (!searchTerm) return results

  // 포스트 검색
  mockPosts.forEach((post) => {
    const titleMatch = post.title.toLowerCase().includes(searchTerm)
    const excerptMatch = post.excerpt.toLowerCase().includes(searchTerm)
    const tagMatch = post.tags.some((tag) => tag.toLowerCase().includes(searchTerm))

    if (titleMatch || excerptMatch || tagMatch) {
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
  const allTags = Array.from(new Set(mockPosts.flatMap((post) => post.tags)))
  const matchingTags = allTags.filter((tag) => tag.toLowerCase().includes(searchTerm))

  matchingTags.forEach((tag) => {
    const postsWithTag = mockPosts.filter((post) => post.tags.includes(tag))
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

// 클라이언트 컴포넌트에서 사용할 인기 태그 함수
export function getPopularTags(): string[] {
  const tagCount: { [key: string]: number } = {}

  mockPosts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCount[tag] = (tagCount[tag] || 0) + 1
    })
  })

  return Object.entries(tagCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([tag]) => tag)
}

// 서버 컴포넌트에서 사용할 함수들은 별도 파일로 분리
export function filterPostsByTag(tag: string) {
  return mockPosts.filter((post) => post.tags.some((postTag) => postTag.toLowerCase() === tag.toLowerCase()))
}

export function filterPostsByQuery(query: string) {
  const searchTerm = query.toLowerCase().trim()

  if (!searchTerm) return mockPosts

  return mockPosts.filter((post) => {
    const titleMatch = post.title.toLowerCase().includes(searchTerm)
    const excerptMatch = post.excerpt.toLowerCase().includes(searchTerm)
    const tagMatch = post.tags.some((tag) => tag.toLowerCase().includes(searchTerm))

    return titleMatch || excerptMatch || tagMatch
  })
}
