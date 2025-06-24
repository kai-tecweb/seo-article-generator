import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    console.log("=== Fal AI API 接続テスト開始 ===")

    const falApiKey = process.env.FAL_AI_API_KEY

    console.log("環境変数確認:")
    console.log("- FAL_AI_API_KEY存在:", !!falApiKey)
    console.log("- FAL_AI_API_KEY値:", falApiKey)  // デバッグ用（本番では削除）
    console.log("- FAL_AI_API_KEY長さ:", falApiKey?.length || 0)
    console.log("- FAL_AI_API_KEY開始:", falApiKey?.substring(0, 15) + "..." || "なし")

    if (!falApiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Fal AI APIキーが設定されていません",
          guidance: `APIキーを設定してください:

設定手順:
1. https://fal.ai/ にアクセス
2. アカウント作成・ログイン
3. ダッシュボード → API Keys
4. 新しいAPIキーを生成
5. .env.local に FAL_AI_API_KEY として設定

現在の設定:
- FAL_AI_API_KEY: 未設定`
        },
        { status: 400 }
      )
    }

    // APIキー形式の確認（Fal AI形式: xxxx-xxxx-xxxx-xxxx:xxxxxxxx）
    const isValidFalKey = falApiKey.includes("-") && falApiKey.includes(":") && falApiKey.length > 50
    
    if (falApiKey.includes("demo") || !isValidFalKey) {
      return NextResponse.json({
        success: true,
        mode: "demo",
        message: "デモモードで動作中",
        apiKey: "demo_key_configured", 
        keyFormat: falApiKey.substring(0, 10) + "...",
        keyLength: falApiKey.length,
        hasHyphen: falApiKey.includes("-"),
        hasColon: falApiKey.includes(":"),
        guidance: "実際のFal AI APIキーを設定すると本番モードで動作します"
      })
    }

    console.log("Fal AI APIに接続テスト中...")

    // 簡単な画像生成リクエストでAPIの有効性をテスト
    const testResponse = await fetch("https://fal.run/fal-ai/flux/schnell", {
      method: "POST",
      headers: {
        "Authorization": `Key ${falApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: "A simple test image of a blue circle",
        image_size: "square_hd",
        num_inference_steps: 4,
        num_images: 1,
        enable_safety_checker: true
      })
    })

    console.log("Fal AI レスポンス status:", testResponse.status)

    if (!testResponse.ok) {
      const errorData = await testResponse.text()
      console.error("Fal AI APIエラー:", errorData)
      
      let errorMessage = "API接続エラー"
      let guidance = "APIキーまたはリクエストに問題があります"

      if (testResponse.status === 401) {
        errorMessage = "認証エラー: APIキーが無効です"
        guidance = "Fal AI APIキーが正しいか確認してください"
      } else if (testResponse.status === 403) {
        errorMessage = "権限エラー: APIアクセス権限がありません"
        guidance = "Fal AIアカウントの権限設定を確認してください"
      } else if (testResponse.status === 429) {
        errorMessage = "使用量制限エラー: API使用量上限に達しています"
        guidance = "Fal AIアカウントの使用量制限を確認してください"
      }

      return NextResponse.json({
        success: false,
        error: errorMessage,
        details: {
          status: testResponse.status,
          response: errorData.substring(0, 500)
        },
        guidance: `${guidance}

解決方法:
1. https://fal.ai/dashboard でAPIキーを確認
2. アカウントの課金状況を確認
3. API使用量制限を確認
4. 新しいAPIキーを生成してみる`
      }, { status: testResponse.status })
    }

    const testData = await testResponse.json()
    console.log("Fal AI API接続成功:", testData)

    return NextResponse.json({
      success: true,
      message: "Fal AI API 接続テスト成功",
      data: {
        apiKeyStatus: "valid",
        testImageGenerated: !!testData.images?.[0]?.url,
        testImageUrl: testData.images?.[0]?.url,
        requestId: testData.request_id,
        processingTime: "約3-8秒"
      },
      metadata: {
        model: "flux-schnell",
        imageSize: "square_hd",
        testedAt: new Date().toISOString()
      }
    })

  } catch (error: any) {
    console.error("=== Fal AI 接続テストエラー ===")
    console.error("エラー詳細:", error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Fal AI API 接続テスト中にエラーが発生しました。",
        guidance: `接続テストに失敗しました。

よくあるエラー:
- Network error: インターネット接続を確認
- API key error: APIキーの形式や有効性を確認
- Quota exceeded: API使用量制限を確認
- Server error: Fal AIサーバーの一時的な問題

推奨手順:
1. インターネット接続を確認
2. https://fal.ai/dashboard でAPIキーを確認
3. アカウントの課金・使用量状況を確認
4. しばらく待ってから再試行`
      },
      { status: 500 }
    )
  }
}
