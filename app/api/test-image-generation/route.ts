import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    console.log("=== AI画像生成機能テスト開始 ===")

    const { 
      testType = "basic",
      topic = "AI技術とコンテンツマーケティング"
    } = await req.json()

    console.log("テストパラメータ:")
    console.log("- テストタイプ:", testType)
    console.log("- トピック:", topic)

    // 各種スタイルのテストケース
    const testCases = [
      {
        name: "プロフェッショナル記事用画像",
        params: {
          topic,
          style: "professional",
          size: "landscape",
          imageType: "article",
          keywords: ["AI", "テクノロジー", "ビジネス"]
        }
      },
      {
        name: "SNS投稿用画像",
        params: {
          topic,
          style: "creative",
          size: "square",
          imageType: "social",
          keywords: ["SNS", "マーケティング"]
        }
      },
      {
        name: "バナー用画像",
        params: {
          topic,
          style: "tech",
          size: "wide",
          imageType: "banner",
          keywords: ["デジタル", "未来"]
        }
      }
    ]

    const results = []

    if (testType === "all") {
      // 全スタイルテスト
      for (const testCase of testCases) {
        console.log(`${testCase.name}をテスト中...`)

        try {
          const imageResponse = await fetch('http://localhost:3001/api/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testCase.params)
          })

          if (!imageResponse.ok) {
            throw new Error(`画像生成API呼び出しエラー: ${imageResponse.status}`)
          }

          const imageData = await imageResponse.json()
          results.push({
            testCase: testCase.name,
            success: imageData.success,
            imageUrl: imageData.imageUrl,
            metadata: imageData.metadata
          })

          console.log(`✅ ${testCase.name}完了`)

        } catch (error: any) {
          results.push({
            testCase: testCase.name,
            success: false,
            error: error.message
          })
          console.error(`❌ ${testCase.name}エラー:`, error)
        }
      }
    } else {
      // 基本テスト
      const basicTest = testCases[0]
      console.log(`${basicTest.name}をテスト中...`)

      try {
        const imageResponse = await fetch('http://localhost:3001/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(basicTest.params)
        })

        if (!imageResponse.ok) {
          throw new Error(`画像生成API呼び出しエラー: ${imageResponse.status}`)
        }

        const imageData = await imageResponse.json()
        results.push({
          testCase: basicTest.name,
          success: imageData.success,
          imageUrl: imageData.imageUrl,
          metadata: imageData.metadata,
          promptUsed: imageData.metadata?.promptUsed
        })

        console.log(`✅ ${basicTest.name}完了`)

      } catch (error: any) {
        results.push({
          testCase: basicTest.name,
          success: false,
          error: error.message
        })
        console.error(`❌ ${basicTest.name}エラー:`, error)
      }
    }

    const successCount = results.filter(r => r.success).length
    const totalCount = results.length

    console.log("テスト完了:")
    console.log(`- 成功: ${successCount}/${totalCount}`)
    console.log(`- 成功率: ${Math.round((successCount / totalCount) * 100)}%`)

    return NextResponse.json({
      success: successCount > 0,
      message: `AI画像生成テストが完了しました（${successCount}/${totalCount}成功）`,
      results,
      summary: {
        totalTests: totalCount,
        successfulTests: successCount,
        successRate: Math.round((successCount / totalCount) * 100),
        testType
      },
      availableStyles: ["professional", "creative", "minimal", "tech", "business", "casual"],
      availableSizes: ["square", "landscape", "portrait", "wide", "tall"],
      availableImageTypes: ["article", "social", "banner", "icon"]
    })

  } catch (error: any) {
    console.error("=== AI画像生成テストエラー ===")
    console.error("エラー詳細:", error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || "AI画像生成テスト中にエラーが発生しました。",
        guidance: `画像生成テストに失敗しました。

考えられる原因:
- 画像生成APIサーバーのエラー
- Fal AI APIキーの問題
- ネットワーク接続の問題

推奨解決方法:
1. サーバーが起動しているか確認
2. Fal AI APIキーが正しく設定されているか確認
3. ネットワーク接続を確認`
      },
      { status: 500 }
    )
  }
}
