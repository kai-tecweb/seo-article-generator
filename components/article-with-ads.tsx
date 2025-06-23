"use client"

import type React from "react"

interface ArticleWithAdsProps {
  htmlContent: string // Markdownを変換したHTML文字列
}

const ArticleWithAds: React.FC<ArticleWithAdsProps> = ({ htmlContent }) => {
  // HTML文字列をDOMオブジェクトに変換
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlContent, "text/html")

  // 広告を挿入する処理
  const body = doc.body

  // 1. 記事の冒頭に「<!-- ad-top -->」を挿入
  const adTopComment = doc.createComment(" ad-top ")
  if (body.firstChild) {
    body.insertBefore(adTopComment, body.firstChild)
  } else {
    body.appendChild(adTopComment)
  }

  // 2. `<h2>` タグが2つ出るごとに「<!-- ad-mid -->」を挿入
  const h2Elements = doc.querySelectorAll("h2")
  let h2Count = 0
  h2Elements.forEach((h2) => {
    h2Count++
    if (h2Count % 2 === 0) {
      // 2つ目、4つ目、6つ目...
      const adMidComment = doc.createComment(" ad-mid ")
      // h2の直後に挿入
      h2.parentNode?.insertBefore(adMidComment, h2.nextSibling)
    }
  })

  // 3. 記事の末尾に「<!-- ad-bottom -->」を挿入
  const adBottomComment = doc.createComment(" ad-bottom ")
  body.appendChild(adBottomComment)

  // 加工済みHTMLを文字列として取得
  const processedHtml = body.innerHTML

  // 注意: dangerouslySetInnerHTML を使用する際は、XSS攻撃のリスクを避けるため、
  // 信頼できるソースからのHTMLのみを使用してください。
  // 今回はMarkdownから変換されたHTMLを想定していますが、常に注意が必要です。
  return <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
}

export default ArticleWithAds
