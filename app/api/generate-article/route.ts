import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  console.log("=== 記事生成API開始 ===")
  
  try {
    const { topic } = await req.json()
    console.log("受信したトピック:", topic)

    if (!topic) {
      console.log("エラー: トピックが提供されていません")
      return NextResponse.json({ error: "トピックが提供されていません。" }, { status: 400 })
    }

    // OpenAI APIキーの確認
    const openaiApiKey = process.env.OPENAI_API_KEY
    console.log("OpenAI APIキー存在:", !!openaiApiKey)
    console.log("OpenAI APIキー形式:", openaiApiKey ? `${openaiApiKey.substring(0, 10)}...` : "なし")

    if (!openaiApiKey || !openaiApiKey.startsWith('sk-')) {
      console.log("OpenAI APIキーが無効または設定されていないため、サンプル記事を生成します")
      // APIキーが設定されていない場合はサンプル記事を返す
      const sampleArticle = `# ${topic}について

## はじめに

${topic}について詳しく説明いたします。この記事では、${topic}の基本的な概念から応用まで、幅広くカバーしています。

## ${topic}とは何か

${topic}は現代において重要な概念の一つです。以下の特徴があります：

- 実用性が高い
- 学習価値がある  
- 将来性がある

## ${topic}のメリット

### 主要なメリット

1. **効率性の向上**
   ${topic}を活用することで、作業効率が大幅に改善されます。

2. **コスト削減**
   適切な${topic}の活用により、コストを削減できます。

3. **品質向上**
   ${topic}により、より高品質な結果を得ることができます。

## ${topic}の活用方法

### 基本的な活用方法

${topic}を効果的に活用するための基本的な方法をご紹介します：

- まず基本を理解する
- 実際に試してみる
- 継続的に改善する

### 応用的な活用方法

より高度な${topic}の活用方法もあります：

- 他の手法と組み合わせる
- カスタマイズして使用する
- チーム全体で共有する

## まとめ

${topic}は現代において非常に重要な要素です。この記事で紹介した内容を参考に、ぜひ${topic}を活用してみてください。

継続的な学習と実践により、${topic}をより効果的に活用できるようになるでしょう。

---

*注意: この記事はOpenAI APIキーが設定されていないため、サンプル記事を表示しています。実際のAI生成記事を利用するには、OPENAI_API_KEYを設定してください。*`

      console.log("サンプル記事生成完了")
      return NextResponse.json({ 
        title: `${topic}について`,
        article: sampleArticle, // articleキーに統一
        content: sampleArticle, // 後方互換性のためcontentも含める
        isDemo: true,
        message: "OpenAI APIキーが設定されていないため、サンプル記事を返しています。"
      })
    }

    console.log("OpenAI APIを使用して記事を生成中...")
    
    let generatedArticle: string
    
    try {
      // AIによる記事生成
      const result = await generateText({
        model: openai("gpt-4o"),
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
      generatedArticle = result.text
    } catch (apiError: any) {
      console.error("OpenAI API呼び出しエラー:", apiError)
      
      // APIエラーの場合はサンプル記事を生成
      console.log("OpenAI APIエラーのため、サンプル記事を生成します")
      generatedArticle = `# ${topic}について

## はじめに

${topic}について詳しく説明いたします。この記事では、${topic}の基本的な概念から応用まで、幅広くカバーしています。

## ${topic}とは何か

${topic}は現代において重要な概念の一つです。以下の特徴があります：

- 実用性が高い
- 学習価値がある  
- 将来性がある

## ${topic}のメリット

### 主要なメリット

1. **効率性の向上**
   ${topic}を活用することで、作業効率が大幅に改善されます。

2. **コスト削減**
   適切な${topic}の活用により、コストを削減できます。

3. **品質向上**
   ${topic}により、より高品質な結果を得ることができます。

## まとめ

${topic}は現代において非常に重要な要素です。この記事で紹介した内容を参考に、ぜひ${topic}を活用してみてください。

継続的な学習と実践により、${topic}をより効果的に活用できるようになるでしょう。

---

*注意: OpenAI APIエラーのため、サンプル記事を表示しています。エラー: ${apiError.message || 'API接続エラー'}*`
    }

    // 記事の最初の行からタイトルを抽出（H1タグを想定）
    console.log("OpenAI APIから記事生成完了")
    console.log("生成された記事の長さ:", generatedArticle.length, "文字")
    
    const lines = generatedArticle.split("\n")
    let title = "Untitled Article"
    const content = generatedArticle // タイトル抽出後も元の記事全体をcontentとして保持

    if (lines.length > 0 && lines[0].startsWith("# ")) {
      title = lines[0].substring(2).trim() // '# ' を取り除く
      console.log("抽出されたタイトル:", title)
      // contentは元のgeneratedArticle全体を保持する
    } else {
      // H1がない場合、トピックをタイトルとして使用するなどのフォールバック
      title = topic.length > 50 ? topic.substring(0, 50) + "..." : topic
      console.log("フォールバックタイトル:", title)
    }

    console.log("=== 記事生成API完了 ===")
    // 一貫したレスポンス形式で返す
    return NextResponse.json({ 
      title: title,
      article: generatedArticle, // articleキーに統一
      content: generatedArticle, // 後方互換性のためcontentも含める
      isDemo: false
    })
  } catch (error: any) {
    console.error("=== 記事生成API失敗 ===")
    console.error("記事生成エラー:", error)
    return NextResponse.json({ error: error.message || "記事の生成中にエラーが発生しました。" }, { status: 500 })
  }
}
