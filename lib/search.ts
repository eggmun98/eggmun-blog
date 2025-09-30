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
  {
    slug: "core-javascript-review",
    title: "코어 자바스크립트 책을 읽으며",
    excerpt: "이 책은 자바스크립트의 핵심 개념들을 압축적으로 정리한 입문서이자 복습서다. 단순히 한 번 읽었다고 해서 자바스크립트 공부가 끝난 것은 아니다. 오히려 이 책을 통해 자바스크립트라는 언어의 깊이와 복잡함을 다시 한번 실감했다. 파고 또 파도 끝이 보이지 않는 것이 바로 프로그래밍, 그것이 프로그래밍의 세계라는 생각이 든다. 결국 이 언어를 깊이 이해하다 보면, 그 밑바탕에 있는 자바스크립트 엔진, 나아가 그것을 구현한 C++까지 공부하게 될지도 모른다.",
    content: "",
    date: "2025-07-23",
    image: "/images/blog-start.jpg",
    tags: ["자바스크립트", "개발 서평", "리뷰", "후기", "독서", "코어 자바스크립트", "javascript"]
  },
  {
    slug: "react-native-architecture",
    title: "리액트 네이티브: 구 아키텍처 이해부터 신 아키텍처 핵심까지",
    excerpt: "React Native 0.76부터 기본값으로 활성화된 New Architecture는 Bridge 기반의 한계를 극복하기 위해 JSI, TurboModules, Fabric Renderer, Codegen을 도입했다. 이 글에서는 구 아키텍처의 구조와 한계, 그리고 신 아키텍처가 제공하는 변화와 실무적인 의미를 비교 정리한다.",
    content: "",
    date: "2025-09-29",
    image: "/images/react-tips-summary.jpg",
    tags: ["리액트 네이티브", "React Native", "아키텍처", "JSI", "TurboModules", "Fabric", "Codegen", "React18", "기술 분석"]
  },
  {
    slug: "javascript-type",
    title: "자바스크립트 타입에 대하여",
    excerpt: "자바스크립트의 타입 시스템은 단순히 값의 분류가 아니다. 원시와 참조 타입의 차이, 암묵적 변환과 비교 연산의 함정, 그리고 래퍼 객체와 null의 역사적 유산까지 — 이 글에서는 타입 시스템을 핵심 개념부터 실무에서 자주 마주치는 함정까지 정리한다.",
    content: "",
    date: "2025-09-30",
    image: "/images/component-structure.png",
    tags: ["자바스크립트", "타입", "javascript", "프론트엔드", "개발 기본기", "JS 타입"]
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
