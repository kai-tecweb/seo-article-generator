import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { articleContent } = await req.json()

    if (!articleContent) {
      return NextResponse.json({ error: "記事本文が提供されていません。" }, { status: 400 })
    }

    // 1. 見出し数 (headingCount)
    const headingRegex = /^(#|##|###|####|#####|######)\s/gm
    const headingMatches = articleContent.match(headingRegex)
    const headingCount = headingMatches ? headingMatches.length : 0

    // 2. キーワード出現数・密度 (keywordDensity)
    const defaultKeyword = "SEO" // デフォルトのキーワード
    const words = articleContent.split(/\s+/) // スペースで単語に分割
    const totalWords = words.length
    const keywordOccurrences = words.filter((word: string) => word.toLowerCase().includes(defaultKeyword.toLowerCase())).length
    const keywordDensity = totalWords > 0 ? ((keywordOccurrences / totalWords) * 100).toFixed(2) + "%" : "0.00%"

    // 3. メタディスクリプション有無 (hasMetaDescription)
    // Markdown本文からは直接判断できないため、デモンストレーション用の値を返す
    // 実際のアプリケーションでは、HTML変換後のメタタグをチェックする必要があります
    const hasMetaDescription = true // 仮に常にtrueとする

    // 4. 内部リンクの有無 (hasInternalLinks)
    // Markdownのリンク形式をチェックし、内部リンクと外部リンクを区別するのは複雑なため、簡易的なチェック
    // ここでは、特定のドメインへのリンクがあるかどうかでシミュレート
    const internalLinkRegex = /\[.*?\]$$(https?:\/\/(?:your-domain\.com|localhost:3000)\/.*?)$$/g
    const hasInternalLinks = internalLinkRegex.test(articleContent)

    // 5. 外部リンクの有無 (hasExternalLinks)
    // Markdownのリンク形式をチェックし、http/httpsで始まるリンクがあるか確認
    const externalLinkRegex = /\[.*?\]$$(https?:\/\/(?!your-domain\.com|localhost:3000).*?)$$/g
    const hasExternalLinks = externalLinkRegex.test(articleContent)

    return NextResponse.json({
      headingCount,
      keywordDensity: {
        keyword: defaultKeyword,
        count: keywordOccurrences,
        density: keywordDensity,
      },
      hasMetaDescription,
      hasInternalLinks,
      hasExternalLinks,
    })
  } catch (error: any) {
    console.error("SEOチェックAPIエラー:", error)
    return NextResponse.json({ error: error.message || "SEOチェック中にエラーが発生しました。" }, { status: 500 })
  }
}
