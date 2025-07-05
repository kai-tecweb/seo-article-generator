import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { articleContent } = await req.json()

    if (!articleContent) {
      return NextResponse.json({ error: "記事本文が提供されていません。" }, { status: 400 })
    }

    // AIによる要約・ハイライト・SNS投稿例の生成
    const { text: generatedOutput } = await generateText({
      model: openai("gpt-4o"),
      system: `あなたはプロのコンテンツエディターです。提供された記事本文から、以下の形式で要約、ハイライト、SNS投稿例を生成してください。
      
出力は必ずJSON形式で行い、以下のプロパティを含めてください:
- "summary": 記事の要約（150文字以内、簡潔に）
- "highlights": 記事の主要なポイントを3つ以内の箇条書き配列で（各ポイントは簡潔に）
- "snsPost": SNS（X/Twitterを想定）投稿例テキスト（ハッシュタグを含め、140文字程度で魅力的に）

例:
{
  "summary": "この記事では、AIを活用したコンテンツマーケティングの最新トレンドと、その導入メリットについて解説しています。",
  "highlights": ["AIによるコンテンツ自動生成", "パーソナライズされたコンテンツ配信", "SEO効果の最大化"],
  "snsPost": "AIでコンテンツマーケティングを加速！🚀 最新トレンドと導入メリットを徹底解説。あなたのビジネスもAIで進化させよう！ #AI #コンテンツマーケティング #SEO"
}
`,
      prompt: `以下の記事本文から要約、ハイライト、SNS投稿例を生成してください:\n\n${articleContent}`,
    })

    // 生成されたJSON文字列をパース
    let parsedOutput: { summary: string; highlights: string[]; snsPost: string }
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
    if (!parsedOutput.summary || !Array.isArray(parsedOutput.highlights) || !parsedOutput.snsPost) {
      return NextResponse.json(
        {
          error: "AIからの出力に必要な情報が不足しています。再試行してください。",
          parsedOutput: parsedOutput, // デバッグ用にパース済み出力を返す
        },
        { status: 500 },
      )
    }

    return NextResponse.json(parsedOutput)
  } catch (error: any) {
    console.error("要約生成APIエラー:", error)
    return NextResponse.json({ error: error.message || "要約の生成中にエラーが発生しました。" }, { status: 500 })
  }
}
