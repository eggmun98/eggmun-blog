import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "개발자 문성진 - 기술의 본질을 탐구하며, 개발 자체를 좋아하는 개발자",
  description: "개발, 일상, 그리고 생각들을 기록하는 미니멀한 개인 블로그입니다.",
  generator: 'v0.dev',
  icons: {
    icon: 'images/logos/eggmun-250x250.png',
    shortcut: 'images/logos/eggmun-250x250.png',
    apple: 'images/logos/eggmun-250x250.png',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://eggmun.com',
    title: '개발자 문성진',
    description: '개발, 일상, 그리고 생각들을 기록하는 미니멀한 개인 블로그입니다.',
    siteName: '개발자 문성진',
    images: [
      {
        url: 'images/logos/eggmun-500x500.png',
        width: 500,
        height: 500,
        alt: '개발자 문성진',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '개발자 문성진',
    description: '개발, 일상, 그리고 생각들을 기록하는 미니멀한 개인 블로그입니다.',
    images: ['images/logos/eggmun-500x500.png'],
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          {children}
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}
