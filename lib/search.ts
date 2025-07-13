"use client"

import { BlogPost } from "./posts"

// 클라이언트 컴포넌트에서 사용할 목 데이터
const mockPosts: BlogPost[] = [
  {
    slug: "pattern-react-review",
    title: "패턴으로 익히고 설계로 완성하는 리액트를 읽고 나서",
    excerpt: "프로젝트가 커질수록 느끼는 복잡성, 안티패턴의 한계, 리팩토링의 필요성. 이 책을 통해 실무에서 바로 써먹을 수 있는 설계 원칙과 성장할 수 있는 계기도 얻었습니다",
    content: "",
    date: "2025-07-13",
    image: "/images/first-post.jpg",
    tags: ["리액트", "개발 서평", "리뷰", "후기", "독서", "클린 코드", "리팩토링"]
  },
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
