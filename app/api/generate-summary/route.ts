import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { text: articleBody } = await req.json() // Renamed from articleContent to text

    if (!articleBody) {
      return NextResponse.json({ error: "記事本文が提供されていません。" }, { status: 400 })
    }

    // AIによる要約・ハイライト・SNS投稿例の生成
    const { text: generatedOutput } = await generateText({
      model: openai("gpt-4o"),
      system: `あなたはプロのコンテンツエディターです。提供された日本語記事本文から、以下の形式で要約とSNS投稿向けのハイライトを生成してください。
      
出力は必ずJSON形式で行い、以下のプロパティを含めてください:
- "summary": 記事全体の要点（300文字以内、簡潔に）
- "snsHighlights": SNS投稿向けのキャッチーな短文の配列（最大3つ、各100文字以内）

例:
{
  "summary": "この記事では、AIを活用したコンテンツマーケティングの最新トレンドと、その導入メリットについて解説しています。AIによるコンテンツ自動生成、パーソナライズされたコンテンツ配信、SEO効果の最大化が主なポイントです。",
  "snsHighlights": [
    "AIでコンテンツマーケティングを加速！🚀 最新トレンドと導入メリットを徹底解説。",
    "あなたのビジネスもAIで進化させよう！ #AI #コンテンツマーケティング",
    "SEO効果も最大化！AI活用で記事作成が劇的に変わる。"
  ]
}
`,
      prompt: `以下の記事本文から要約とSNSハイライトを生成してください:\n\n${articleBody}`,
    })

    // 生成されたJSON文字列をパース
    let parsedOutput: { summary: string; snsHighlights: string[] }
    try {
      parsedOutput = JSON.parse(generatedOutput)
    } catch (parseError) {
      console.error("AI生成出力のJSONパースエラー:", parseError)
      // JSONパースに失敗した場合のフォールバック処理
      return NextResponse.json(
        {
          error: "AIからの出力形式が不正です。再試行してください。",
          rawOutput: generatedOutput, // デバッグ用に生の出力を返す
        },
        { status: 500 },
      )
    }

    // 必要なプロパティが揃っているか確認
    if (!parsedOutput.summary || !Array.isArray(parsedOutput.snsHighlights)) {
      return NextResponse.json(
        {
          error: "AIからの出力に必要な情報が不足しています。再試行してください。",
          parsedOutput: parsedOutput, // デバッグ用にパース済み出力を返す
        },
        { status: 500 },
      )
    }

    // 文字数制限の適用 (AIが守らない場合のためにクライアント側でも調整)
    parsedOutput.summary = parsedOutput.summary.substring(0, 300)
    parsedOutput.snsHighlights = parsedOutput.snsHighlights.slice(0, 3).map((h) => h.substring(0, 100))

    return NextResponse.json(parsedOutput)
  } catch (error: any) {
    console.error("要約生成APIエラー:", error)
    return NextResponse.json({ error: error.message || "要約の生成中にエラーが発生しました。" }, { status: 500 })
  }
}
