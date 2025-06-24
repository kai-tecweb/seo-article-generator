import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    console.log("=== 記事生成→画像生成 統合ワークフロー開始 ===")

    const { 
      topic,
      keywords = [],
      length = "medium",
      imageStyle = "professional",
      imageSize = "landscape",
      generateImage = true,
      summaryType = "comprehensive",
      includeWordPress = false,
      includeNotion = false,
      includeGBP = false
    } = await req.json()

    if (!topic) {
      return NextResponse.json({ 
        error: "記事のトピックが提供されていません。" 
      }, { status: 400 })
    }

    const results: {
      steps: string[]
      data: {
        article?: any
        image?: any
        summary?: any
        wordpress?: any
        notion?: any
        gbp?: any
      }
      errors: string[]
      timestamp: string
    } = {
      steps: [],
      data: {},
      errors: [],
      timestamp: new Date().toISOString()
    }

    // ステップ1: AI記事生成
    console.log("🤖 ステップ1: AI記事生成...")
    results.steps.push("AI記事生成開始")
    
    try {
      const articleResponse = await fetch('http://localhost:3001/api/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, keywords, length })
      })

      if (!articleResponse.ok) {
        throw new Error(`記事生成エラー: ${articleResponse.status}`)
      }

      const articleData = await articleResponse.json()
      results.data.article = articleData
      results.steps.push("AI記事生成完了")
      console.log("✅ AI記事生成完了 - 文字数:", articleData.content?.length || 0)

    } catch (error: any) {
      results.errors.push(`記事生成エラー: ${error.message}`)
      console.error("記事生成エラー:", error)
    }

    // ステップ2: AI画像生成（オプション）
    if (generateImage && results.data.article) {
      console.log("🎨 ステップ2: AI画像生成...")
      results.steps.push("AI画像生成開始")
      
      try {
        const imageResponse = await fetch('http://localhost:3001/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: results.data.article.title || topic,
            style: imageStyle,
            size: imageSize,
            imageType: "article",
            keywords: keywords
          })
        })

        if (!imageResponse.ok) {
          throw new Error(`画像生成エラー: ${imageResponse.status}`)
        }

        const imageData = await imageResponse.json()
        results.data.image = imageData
        results.steps.push("AI画像生成完了")
        console.log("✅ AI画像生成完了 - URL:", imageData.imageUrl)

      } catch (error: any) {
        results.errors.push(`画像生成エラー: ${error.message}`)
        console.error("画像生成エラー:", error)
      }
    }

    // ステップ3: 記事要約生成
    if (results.data.article) {
      console.log("📝 ステップ3: 記事要約生成...")
      results.steps.push("記事要約開始")
      
      try {
        const summaryResponse = await fetch('http://localhost:3001/api/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            articleContent: results.data.article.content,
            summaryType,
            targetLength: 200,
            includeKeyPoints: true,
            includeSnsPost: true
          })
        })

        if (!summaryResponse.ok) {
          throw new Error(`要約生成エラー: ${summaryResponse.status}`)
        }

        const summaryData = await summaryResponse.json()
        results.data.summary = summaryData
        results.steps.push("記事要約完了")
        console.log("✅ 記事要約完了 - 圧縮率:", summaryData.analysis?.compressionRatio + "%")

      } catch (error: any) {
        results.errors.push(`要約生成エラー: ${error.message}`)
        console.error("要約生成エラー:", error)
      }
    }

    // ステップ4: WordPress投稿（オプション）
    if (includeWordPress && results.data.article) {
      console.log("📝 ステップ4: WordPress投稿...")
      results.steps.push("WordPress投稿開始")
      
      try {
        const wpResponse = await fetch('http://localhost:3001/api/post-to-wordpress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: results.data.article.title,
            content: results.data.article.content,
            status: "publish",
            categories: keywords,
            featured_media_url: results.data.image?.imageUrl
          })
        })

        if (!wpResponse.ok) {
          throw new Error(`WordPress投稿エラー: ${wpResponse.status}`)
        }

        const wpData = await wpResponse.json()
        results.data.wordpress = wpData
        results.steps.push("WordPress投稿完了")
        console.log("✅ WordPress投稿完了")

      } catch (error: any) {
        results.errors.push(`WordPress投稿エラー: ${error.message}`)
        console.error("WordPress投稿エラー:", error)
      }
    }

    // ステップ5: Notion保存（オプション）
    if (includeNotion && results.data.article) {
      console.log("📚 ステップ5: Notion保存...")
      results.steps.push("Notion保存開始")
      
      try {
        const notionResponse = await fetch('http://localhost:3001/api/create-notion-page', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: results.data.article.title,
            content: results.data.summary?.summary || results.data.article.content.substring(0, 500),
            tags: keywords,
            imageUrl: results.data.image?.imageUrl
          })
        })

        if (!notionResponse.ok) {
          throw new Error(`Notion保存エラー: ${notionResponse.status}`)
        }

        const notionData = await notionResponse.json()
        results.data.notion = notionData
        results.steps.push("Notion保存完了")
        console.log("✅ Notion保存完了")

      } catch (error: any) {
        results.errors.push(`Notion保存エラー: ${error.message}`)
        console.error("Notion保存エラー:", error)
      }
    }

    // ステップ6: Google Business Profile投稿（オプション）
    if (includeGBP && results.data.summary) {
      console.log("🏢 ステップ6: Google Business Profile投稿...")
      results.steps.push("GBP投稿開始")
      
      try {
        const gbpResponse = await fetch('http://localhost:3001/api/post-to-gbp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: results.data.summary.snsPost || "新しい記事を公開しました！",
            title: results.data.article.title,
            callToAction: "LEARN_MORE",
            callToActionUrl: results.data.wordpress?.wordpressPostUrl || "https://kai-techweb.com/",
            imageUrl: results.data.image?.imageUrl
          })
        })

        if (!gbpResponse.ok) {
          throw new Error(`GBP投稿エラー: ${gbpResponse.status}`)
        }

        const gbpData = await gbpResponse.json()
        results.data.gbp = gbpData
        results.steps.push("GBP投稿完了")
        console.log("✅ GBP投稿完了")

      } catch (error: any) {
        results.errors.push(`GBP投稿エラー: ${error.message}`)
        console.error("GBP投稿エラー:", error)
      }
    }

    console.log("🎉 記事生成→画像生成統合ワークフロー完了!")
    console.log("- 実行ステップ数:", results.steps.length)
    console.log("- エラー数:", results.errors.length)

    return NextResponse.json({
      success: results.errors.length === 0,
      message: `記事生成→画像生成統合ワークフローが完了しました（${results.errors.length > 0 ? '部分的成功' : '完全成功'}）`,
      workflow: {
        completed: results.steps,
        errors: results.errors,
        totalSteps: results.steps.length,
        errorCount: results.errors.length
      },
      data: results.data,
      contentPreview: {
        articleTitle: results.data.article?.title,
        articleLength: results.data.article?.content?.length,
        imageUrl: results.data.image?.imageUrl,
        imageStyle: results.data.image?.metadata?.style,
        summaryLength: results.data.summary?.summary?.length,
        compressionRatio: results.data.summary?.analysis?.compressionRatio,
        wordpressUrl: results.data.wordpress?.wordpressPostUrl,
        notionUrl: results.data.notion?.data?.pageUrl,
        gbpUrl: results.data.gbp?.data?.postUrl
      },
      metadata: {
        topic,
        keywords,
        length,
        imageStyle,
        imageSize,
        generateImage,
        summaryType,
        integrations: {
          wordpress: includeWordPress,
          notion: includeNotion,
          gbp: includeGBP
        },
        executedAt: results.timestamp
      }
    })

  } catch (error: any) {
    console.error("=== 記事生成→画像生成統合ワークフローエラー ===")
    console.error("エラー詳細:", error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || "記事生成→画像生成統合ワークフロー中にエラーが発生しました。",
        guidance: `統合ワークフローに失敗しました。

考えられる原因:
- 各APIサーバーのエラー
- ネットワーク接続の問題
- APIキーの設定問題

推奨解決方法:
1. 各APIエンドポイントを個別にテスト
2. サーバーの起動状況を確認
3. APIキーの設定を再確認
4. 画像生成機能の動作確認`
      },
      { status: 500 }
    )
  }
}
