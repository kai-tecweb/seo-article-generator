import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    console.log("=== 記事要約機能テスト開始 ===")

    const { 
      summaryType = "comprehensive",
      sampleArticle = false 
    } = await req.json()

    // サンプル記事の使用
    const sampleContent = sampleArticle ? 
      `# AI技術を活用したコンテンツマーケティングの未来

## 導入

デジタル時代において、コンテンツマーケティングは企業の成功に欠かせない要素となっています。特に、AI技術の進化により、コンテンツマーケティングの手法は劇的に変化しています。本記事では、AI技術を活用したコンテンツマーケティングの未来について探り、どのようにして企業がこの技術を活用して競争力を高めることができるのかを考察します。

## AI技術がコンテンツマーケティングに与える影響

### AIによるデータ分析の強化

AI技術は、大量のデータを迅速かつ正確に分析する能力を持っています。これにより、マーケティング担当者は消費者の行動やトレンドをより深く理解することが可能になります。AIを活用することで、ターゲットオーディエンスのニーズを的確に把握し、より効果的なコンテンツを作成することができます。

### パーソナライズされたコンテンツの提供

AIは、個々のユーザーの嗜好や行動を学習し、パーソナライズされたコンテンツを提供することができます。これにより、ユーザーエンゲージメントが向上し、コンバージョン率の増加が期待できます。AIを活用したパーソナライズは、顧客体験を向上させ、ブランドロイヤルティを強化する重要な手段となります。

## AI技術を活用したコンテンツ作成の自動化

### 自動コンテンツ生成ツールの活用

AI技術は、記事やブログ、ソーシャルメディア投稿などのコンテンツを自動で生成するツールを提供しています。これにより、コンテンツ作成の時間とコストを大幅に削減することが可能です。自動生成されたコンテンツは、SEO対策にも対応しており、検索エンジンでの可視性を高めることができます。

### クリエイティブなコンテンツの生成

AIは、単なる情報提供にとどまらず、クリエイティブなコンテンツの生成にも役立ちます。例えば、AIを活用したビジュアルコンテンツの作成や、インタラクティブなコンテンツの開発が可能です。これにより、ユーザーの興味を引きつけ、ブランドの魅力を高めることができます。

## 結論

AI技術を活用したコンテンツマーケティングは、今後ますます重要性を増していくでしょう。AIによるデータ分析やパーソナライズ、コンテンツ作成の自動化は、企業にとって大きな利点をもたらします。これらの技術を効果的に活用することで、企業は競争力を高め、持続可能な成長を遂げることができるでしょう。` :
      `# サンプル記事

短いテスト記事です。AI技術の進歩により、コンテンツマーケティングが変化しています。`

    console.log("要約対象記事:")
    console.log("- 文字数:", sampleContent.length)
    console.log("- 要約タイプ:", summaryType)

    // 記事要約APIを呼び出し
    const summaryResponse = await fetch('http://localhost:3001/api/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        articleContent: sampleContent,
        summaryType: summaryType,
        targetLength: summaryType === "short" ? 100 : 200,
        includeKeyPoints: true,
        includeSnsPost: true
      })
    })

    if (!summaryResponse.ok) {
      throw new Error(`要約API呼び出しエラー: ${summaryResponse.status}`)
    }

    const summaryData = await summaryResponse.json()

    console.log("要約結果:")
    console.log("- 要約文字数:", summaryData.summary?.length)
    console.log("- 圧縮率:", summaryData.analysis?.compressionRatio + "%")

    return NextResponse.json({
      success: true,
      message: "記事要約テストが完了しました",
      data: {
        originalArticle: {
          length: sampleContent.length,
          preview: sampleContent.substring(0, 200) + "..."
        },
        summary: summaryData,
        testConfig: {
          summaryType,
          sampleArticle
        }
      }
    })

  } catch (error: any) {
    console.error("=== 記事要約テストエラー ===")
    console.error("エラー詳細:", error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || "記事要約テスト中にエラーが発生しました。",
        guidance: `要約テストに失敗しました。

考えられる原因:
- 要約APIサーバーのエラー
- OpenAI APIキーの問題
- ネットワーク接続の問題

推奨解決方法:
1. サーバーが起動しているか確認
2. OpenAI APIキーが正しく設定されているか確認
3. ネットワーク接続を確認`
      },
      { status: 500 }
    )
  }
}
