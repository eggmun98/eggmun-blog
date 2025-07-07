"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

export function GitHubComments() {
  const ref = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return

    const scriptElem = document.createElement("script")
    scriptElem.src = "https://giscus.app/client.js"
    scriptElem.async = true
    scriptElem.crossOrigin = "anonymous"

    scriptElem.setAttribute("data-repo", "eggmun98/blog-comments")
    scriptElem.setAttribute("data-repo-id", "R_kgDOPIa7mQ")
    scriptElem.setAttribute("data-category", "General")
    scriptElem.setAttribute("data-category-id", "DIC_kwDOPIa7mc4CsmNs")
    scriptElem.setAttribute("data-mapping", "pathname")
    scriptElem.setAttribute("data-strict", "0")
    scriptElem.setAttribute("data-reactions-enabled", "1")
    scriptElem.setAttribute("data-emit-metadata", "0")
    scriptElem.setAttribute("data-input-position", "top")
    scriptElem.setAttribute("data-theme", resolvedTheme === "dark" ? "dark" : "light")
    scriptElem.setAttribute("data-lang", "ko")

    ref.current.appendChild(scriptElem)
  }, [resolvedTheme])

  // 테마 변경 시 giscus 다시 로드
  useEffect(() => {
    const iframe = document.querySelector<HTMLIFrameElement>("iframe.giscus-frame")
    if (iframe) {
      iframe.contentWindow?.postMessage(
        { giscus: { setConfig: { theme: resolvedTheme === "dark" ? "dark" : "light" } } },
        "https://giscus.app",
      )
    }
  }, [resolvedTheme])

  return (
    <section className="mt-12">
      <h3 className="text-xl font-semibold mb-6">댓글</h3>
      <div ref={ref} />
    </section>
  )
}
