"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { SearchBar } from "@/components/search-bar"
import { Home, User, BookOpen, Github, Mail, Linkedin } from "lucide-react"
import Image from "next/image"

const navigation = [
  { name: "홈", href: "/", icon: Home },
  { name: "소개", href: "/about", icon: User },
  { name: "블로그", href: "/blog", icon: BookOpen },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src="/images/munSeongJin.jpeg" 
                  alt="문성진 프로필" 
                  width={32} 
                  height={32}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-foreground">개발자 문성진</h1>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center space-x-6">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || (item.href === "/blog" && pathname.startsWith("/blog"))

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* 검색바 */}
          <div className="flex-1 max-w-md mx-4">
            <SearchBar />
          </div>

          <div className="flex items-center space-x-4 flex-shrink-0">
            <div className="hidden sm:flex items-center space-x-2">
              <Link
                href="https://www.linkedin.com/in/eggmun"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="https://github.com/eggmun98"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="w-4 h-4" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="mailto:eggmun98@gmail.com"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="sr-only">Email</span>
              </Link>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="lg:hidden mt-4 flex items-center space-x-4">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href === "/blog" && pathname.startsWith("/blog"))

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
