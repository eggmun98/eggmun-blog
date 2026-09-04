"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { Components } from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useTheme } from "next-themes"
import { createHeadingId } from "@/lib/markdown-headings"
import type { ReactNode } from "react"

interface MarkdownContentProps {
  content: string
}

function normalizeMarkdownForCjkEmphasis(content: string) {
  // Some markdown parsers fail to close emphasis cleanly when a Korean particle
  // immediately follows the closing marker, e.g. **강조**를.
  return content
    .replace(/\*\*([^*\n]+)\*\*([가-힣])/g, "**$1**\u200B$2")
    .replace(/\*([^*\n]+)\*([가-힣])/g, "*$1*\u200B$2")
}

function getNodeText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node)
  }

  if (Array.isArray(node)) {
    return node.map(getNodeText).join("")
  }

  if (node && typeof node === "object" && "props" in node) {
    const props = node.props as { children?: ReactNode }
    return getNodeText(props.children)
  }

  return ""
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const { resolvedTheme } = useTheme()
  const normalizedContent = normalizeMarkdownForCjkEmphasis(content)
  const usedHeadingIds = new Map<string, number>()
  const getHeadingId = (children: ReactNode) => createHeadingId(getNodeText(children), usedHeadingIds)

  const components: Components = {
    code({ node, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "")

      return match ? (
        <SyntaxHighlighter
          style={resolvedTheme === "dark" ? oneDark : undefined}
          language={match[1]}
          PreTag="div"
          className="rounded-md"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      )
    },
    h1: ({ children }) => (
      <h1
        id={getHeadingId(children)}
        className="scroll-mt-24 text-3xl font-bold mt-8 mb-4 text-foreground border-b border-border pb-2"
      >
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 id={getHeadingId(children)} className="scroll-mt-24 text-2xl font-semibold mt-14 mb-4 text-foreground">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 id={getHeadingId(children)} className="scroll-mt-24 text-xl font-medium mt-10 mb-3 text-foreground">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 id={getHeadingId(children)} className="scroll-mt-24 text-lg font-medium mt-4 mb-2 text-foreground">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 py-2 my-4 bg-muted/50 rounded-r-md italic">
        {children}
      </blockquote>
    ),
    ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-4">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-4">{children}</ol>,
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    table: ({ children }) => (
      <div className="my-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-muted/60">{children}</thead>,
    th: ({ children }) => (
      <th className="border-b border-border px-4 py-3 text-left font-semibold text-foreground">{children}</th>
    ),
    td: ({ children }) => <td className="border-t border-border px-4 py-3 align-top">{children}</td>,
    p: ({ children }) => <p className="leading-relaxed my-4">{children}</p>,
    strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    hr: () => <hr className="my-8 border-border" />,
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    ),
  }

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none prose-lg">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {normalizedContent}
      </ReactMarkdown>
    </div>
  )
}
