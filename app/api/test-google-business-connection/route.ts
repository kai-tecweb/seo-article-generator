import { NextResponse } from "next/server"

export async function POST() {
  try {
    console.log("=== Google Business Profile API接続テスト開始 ===")

    const apiKey = process.env.GOOGLE_BUSINESS_API_KEY
    const locationId = process.env.GOOGLE_BUSINESS_LOCATION_ID

    console.log("環境変数チェック:")
    console.log("- GOOGLE_BUSINESS_API_KEY存在:", !!apiKey)
    console.log("- GOOGLE_BUSINESS_API_KEY長さ:", apiKey?.length || 0)
    console.log("- GOOGLE_BUSINESS_API_KEY開始文字:", apiKey?.substring(0, 10) || "なし")
    console.log("- GOOGLE_BUSINESS_LOCATION_ID存在:", !!locationId)

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Google Business Profile APIキーが設定されていません",
          details: {
            hasApiKey: false,
            hasLocationId: !!locationId
          },
          guidance: `APIキーを設定してください:

設定手順:
1. Google Cloud Console (https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成
3. "My Business Business Information API" を有効化
4. 認証情報 → APIキー を作成
5. .env.local に GOOGLE_BUSINESS_API_KEY として設定

現在の設定:
- GOOGLE_BUSINESS_API_KEY: 未設定
- GOOGLE_BUSINESS_LOCATION_ID: ${locationId ? '設定済み' : '未設定'}`
        },
        { status: 400 }
      )
    }

    // デモ用の場合は模擬成功レスポンス
    if (apiKey.includes("demo")) {
      console.log("デモモードでの接続テスト")
      
      return NextResponse.json({
        success: true,
        message: "Google Business Profile API接続テスト（デモモード）",
        data: {
          mode: "demo",
          apiKeyValid: true,
          location: {
            id: locationId || "demo-location-123",
            name: "テスト店舗",
            address: "東京都渋谷区"
          },
          capabilities: [
            "投稿作成",
            "画像アップロード", 
            "顧客レビュー閲覧"
          ]
        },
        guidance: "実際のAPIキーを設定すると本番環境と連携できます"
      })
    }

    // 実際のGoogle Business Profile APIテスト
    console.log("Google Business Profile APIに接続中...")

    // My Business Account Information API でアカウント情報を取得
    const accountsResponse = await fetch(
      `https://mybusinessaccountmanagement.googleapis.com/v1/accounts?key=${apiKey}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      }
    )

    console.log("アカウント情報取得レスポンス:", accountsResponse.status)

    if (!accountsResponse.ok) {
      const errorData = await accountsResponse.text()
      console.error("API接続エラー:", errorData)
      
      throw new Error(`Google Business Profile API エラー: ${accountsResponse.status} - ${errorData}`)
    }

    const accountsData = await accountsResponse.json()
    console.log("アカウント取得成功:", accountsData)

    return NextResponse.json({
      success: true,
      message: "Google Business Profile API接続に成功しました",
      data: {
        apiKeyValid: true,
        accountsCount: accountsData.accounts?.length || 0,
        accounts: accountsData.accounts?.slice(0, 3).map((account: any) => ({
          name: account.name,
          accountName: account.accountName,
          type: account.type
        })) || []
      }
    })

  } catch (error: any) {
    console.error("=== Google Business Profile API接続エラー ===")
    console.error("エラータイプ:", error.constructor.name)
    console.error("エラーメッセージ:", error.message)

    const errorDetails = {
      errorType: error.constructor.name,
      errorMessage: error.message,
      statusCode: error.status || 500
    }

    return NextResponse.json(
      {
        success: false,
        error: "Google Business Profile APIの接続に失敗しました",
        details: errorDetails,
        guidance: `接続エラーが発生しました: ${error.message}

解決方法:
1. Google Cloud Console でAPIが有効化されているか確認
2. APIキーが正しく設定されているか確認
3. APIキーの制限設定を確認
4. 請求情報が設定されているか確認（一部APIは課金が必要）

よくあるエラー:
- 403 Forbidden: APIが有効化されていない、または権限不足
- 400 Bad Request: リクエストの形式が間違っている
- 401 Unauthorized: APIキーが無効`
      },
      { status: errorDetails.statusCode }
    )
  }
}
