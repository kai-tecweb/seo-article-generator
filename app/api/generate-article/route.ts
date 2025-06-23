import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json()

    if (!topic) {
      return NextResponse.json({ error: "トピックが提供されていません。" }, { status: 400 })
    }

    // AIによる記事生成
    const { text: generatedArticle } = await generateText({
      model: openai("gpt-4o"), // または 'gpt-4' を使用できます
      system: `あなたはプロのSEO記事ライターです。ユーザーが指定したトピックとキーワードに基づいて、包括的で構造化されたSEOに強い記事を日本語で作成してください。記事は以下の要素を含めるようにしてください。
    - 魅力的なタイトル（記事の最初の行にH1として含めてください。例: # 記事のタイトル）
    - 導入（記事の目的と概要）
    - 複数の見出し（H2, H3など）と段落
    - 関連キーワードの自然な組み込み
    - 結論（まとめと次のステップ）
    - 読者にとって価値のある情報提供
    マークダウン形式で出力し、読みやすいように適切な改行を入れてください。`,
      prompt: `以下のトピックとキーワードでSEO記事を作成してください: ${topic}`,
    })

    // 記事の最初の行からタイトルを抽出（H1タグを想定）
    const lines = generatedArticle.split("\n")
    let title = "Untitled Article"
    const content = generatedArticle // タイトル抽出後も元の記事全体をcontentとして保持

    if (lines.length > 0 && lines[0].startsWith("# ")) {
      title = lines[0].substring(2).trim() // '# ' を取り除く
      // contentは元のgeneratedArticle全体を保持する
    } else {
      // H1がない場合、トピックをタイトルとして使用するなどのフォールバック
      title = topic.length > 50 ? topic.substring(0, 50) + "..." : topic
    }

    // WordPressへの投稿ロジックは削除し、生成された記事とタイトルのみを返す
    return NextResponse.json({ article: generatedArticle, title: title })
  } catch (error: any) {
    console.error("記事生成エラー:", error)
    return NextResponse.json({ error: error.message || "記事の生成中にエラーが発生しました。" }, { status: 500 })
  }
}
