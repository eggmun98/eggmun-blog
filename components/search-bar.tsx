"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, X, Clock, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { searchPosts, getPopularTags } from "@/lib/search"
import { useRouter } from "next/navigation"

interface SearchResult {
  slug: string
  title: string
  excerpt: string
  tags: string[]
  type: "post" | "tag"
}

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // 최근 검색어 로드
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // 검색 결과 업데이트
  useEffect(() => {
    if (query.trim()) {
      const searchResults = searchPosts(query)
      setResults(searchResults)
      setSelectedIndex(-1)
    } else {
      setResults([])
      setSelectedIndex(-1)
    }
  }, [query])

  // 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // 키보드 네비게이션
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelectResult(results[selectedIndex])
        } else if (query.trim()) {
          handleSearch()
        }
        break
      case "Escape":
        setIsOpen(false)
        inputRef.current?.blur()
        break
    }
  }

  const handleSearch = () => {
    if (query.trim()) {
      // 최근 검색어에 추가
      const newRecentSearches = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5)
      setRecentSearches(newRecentSearches)
      localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches))

      // 검색 페이지로 이동
      router.push(`/search?q=${encodeURIComponent(query)}`)
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  const handleSelectResult = (result: SearchResult) => {
    if (result.type === "post") {
      router.push(`/blog/${result.slug}`)
    } else {
      router.push(`/search?tag=${encodeURIComponent(result.title)}`)
    }
    setIsOpen(false)
    setQuery("")
  }

  const handleRecentSearch = (search: string) => {
    setQuery(search)
    router.push(`/search?q=${encodeURIComponent(search)}`)
    setIsOpen(false)
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem("recentSearches")
  }

  const popularTags = getPopularTags()

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="검색어를 입력하세요..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 w-8 h-8"
            onClick={() => {
              setQuery("")
              setResults([])
              inputRef.current?.focus()
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
          {query.trim() ? (
            // 검색 결과
            <div className="p-2">
              {results.length > 0 ? (
                <>
                  <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b">검색 결과</div>
                  {results.map((result, index) => (
                    <button
                      key={`${result.type}-${result.slug}`}
                      className={`w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors ${
                        index === selectedIndex ? "bg-accent" : ""
                      }`}
                      onClick={() => handleSelectResult(result)}
                    >
                      <div className="font-medium text-sm line-clamp-1">{result.title}</div>
                      {result.type === "post" && (
                        <div className="text-xs text-muted-foreground line-clamp-1 mt-1">{result.excerpt}</div>
                      )}
                      <div className="flex gap-1 mt-1">
                        {result.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs bg-secondary text-secondary-foreground px-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </>
              ) : (
                <div className="px-3 py-4 text-center text-muted-foreground text-sm">검색 결과가 없습니다</div>
              )}
            </div>
          ) : (
            // 최근 검색어 및 인기 태그
            <div className="p-2">
              {recentSearches.length > 0 && (
                <>
                  <div className="flex items-center justify-between px-3 py-2 border-b">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs font-medium text-muted-foreground">최근 검색어</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={clearRecentSearches} className="h-6 px-2 text-xs">
                      전체삭제
                    </Button>
                  </div>
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors text-sm"
                      onClick={() => handleRecentSearch(search)}
                    >
                      {search}
                    </button>
                  ))}
                </>
              )}

              {popularTags.length > 0 && (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 border-b mt-2">
                    <TrendingUp className="w-3 h-3" />
                    <span className="text-xs font-medium text-muted-foreground">인기 태그</span>
                  </div>
                  <div className="px-3 py-2">
                    <div className="flex flex-wrap gap-2">
                      {popularTags.map((tag) => (
                        <button
                          key={tag}
                          className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full hover:bg-secondary/80 transition-colors"
                          onClick={() => {
                            router.push(`/search?tag=${encodeURIComponent(tag)}`)
                            setIsOpen(false)
                          }}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
