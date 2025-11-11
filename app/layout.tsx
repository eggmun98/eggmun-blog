import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  // 🔹 메인 타이틀
  title: "개발자 문성진",
  description: "프론트엔드 개발자 문성진의 개발, 일상, 그리고 생각들을 기록하는 미니멀한 개인 블로그입니다.",

  // 🔹 도메인 기준 URL (OG / Twitter에서 중요)
  metadataBase: new URL("https://eggmun.com"),

  // 🔹 저자 정보
  authors: [{ name: "문성진", url: "https://eggmun.com" }],
  creator: "문성진",
  generator: "v0.dev",

  // 🔹 기본 아이콘들 (루트 기준 절대 경로로 맞추는 걸 추천)
  icons: {
    icon: "/images/logos/eggmun-250x250.png",
    shortcut: "/images/logos/eggmun-250x250.png",
    apple: "/images/logos/eggmun-250x250.png",
  },

  // 🔹 canonical URL
  alternates: {
    canonical: "https://eggmun.com",
  },

  // 🔹 검색 키워드
  keywords: [
    "문성진",
    "개발자 문성진",
    "프론트엔드 개발자",
    "프론트엔드 개발 블로그",
    "React",
    "React Native",
    "JavaScript",
    "TypeScript",
  ],

  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://eggmun.com",
    title: "개발자 문성진",
    description: "프론트엔드 개발자 문성진의 개발, 일상, 그리고 생각들을 기록하는 미니멀한 개인 블로그입니다.",
    siteName: "개발자 문성진",
    images: [
      {
        url: "/images/logos/eggmun-500x500.png",
        width: 500,
        height: 500,
        alt: "개발자 문성진",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "개발자 문성진",
    description: "프론트엔드 개발자 문성진의 개발, 일상, 그리고 생각들을 기록하는 미니멀한 개인 블로그입니다.",
    images: ["/images/logos/eggmun-500x500.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}
