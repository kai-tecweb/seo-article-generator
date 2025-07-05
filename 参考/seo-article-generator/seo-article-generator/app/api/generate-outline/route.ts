import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json()

    if (!topic) {
      return NextResponse.json({ error: "トピックが提供されていません。" }, { status: 400 })
    }

    const { text: generatedOutline } = await generateText({
      model: openai("gpt-4o"), // gpt-4o モデルを使用
      system: `あなたはプロのSEO記事プランナーです。以下のトピックに基づいて、SEOに強く、読者の興味を引く記事の見出し構成（アウトライン）をMarkdown形式で提案してください。

- H2見出しを3〜5個含めてください。
- 各H2見出しの下に、必要に応じてH3見出しを1〜3個含めてください。
- 見出しのみをリスト形式で出力し、本文は含めないでください。
- 例:
  ## H2見出し1
  ### H3見出し1-1
  ### H3見出し1-2
  ## H2見出し2
  ### H3見出し2-1
  ## H2見出し3
  ### H3見出し3-1
  ### H3見出し3-2
  ### H3見出し3-3
  `,
      prompt: `記事のトピック: ${topic}`,
    })

    return NextResponse.json({ outline: generatedOutline })
  } catch (error: any) {
    console.error("アウトライン生成エラー:", error)
    return NextResponse.json(
      { error: error.message || "アウトラインの生成中にエラーが発生しました。" },
      { status: 500 },
    )
  }
}
