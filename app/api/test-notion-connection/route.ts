import { NextResponse } from "next/server"
import { Client } from "@notionhq/client"

export async function POST() {
  try {
    console.log("=== Notion API接続テスト開始 ===")

    // 環境変数の詳細チェック
    const apiKey = process.env.NOTION_API_KEY
    const dbId = process.env.NOTION_DATABASE_ID

    console.log("環境変数チェック:")
    console.log("- NOTION_API_KEY存在:", !!apiKey)
    console.log("- NOTION_API_KEY長さ:", apiKey?.length || 0)
    console.log("- NOTION_API_KEY開始文字:", apiKey?.substring(0, 15) || "なし")
    console.log("- NOTION_DATABASE_ID存在:", !!dbId)
    console.log("- NOTION_DATABASE_ID長さ:", dbId?.length || 0)

    if (!apiKey || !dbId) {
      return NextResponse.json(
        {
          success: false,
          error: "環境変数が設定されていません",
          details: {
            hasApiKey: !!apiKey,
            hasDbId: !!dbId,
            apiKeyLength: apiKey?.length || 0,
            dbIdLength: dbId?.length || 0,
          },
          guidance: "NOTION_API_KEY と NOTION_DATABASE_ID を設定してください",
        },
        { status: 400 },
      )
    }

    // トークン形式の検証（secret_ または ntn_ を受け入れ）
    const isValidToken = apiKey.startsWith("secret_") || apiKey.startsWith("ntn_")

    if (!isValidToken) {
      return NextResponse.json(
        {
          success: false,
          error: "無効なトークン形式",
          details: {
            tokenPrefix: apiKey.substring(0, 15),
            expectedPrefixes: ["secret_", "ntn_"],
            tokenLength: apiKey.length,
          },
          guidance: `現在のトークン（${apiKey.substring(0, 15)}...）は無効です。
          
正しいトークンの取得方法:
1. https://www.notion.so/my-integrations にアクセス
2. 「New integration」をクリック
3. 統合名を入力してワークスペースを選択
4. 「Submit」をクリック
5. 「Internal Integration Token」をコピー（secret_ または ntn_ で始まる）

有効なトークン形式: secret_... または ntn_...`,
        },
        { status: 400 },
      )
    }

    console.log("トークン形式チェック: OK")

    // Notionクライアントを初期化
    const notion = new Client({ auth: apiKey })

    // まずデータベース情報を取得
    console.log("データベース情報を取得中...")
    let databaseInfo
    try {
      databaseInfo = await notion.databases.retrieve({ database_id: dbId })
      console.log("データベース取得成功:", databaseInfo)
    } catch (dbError: any) {
      console.error("データベース取得エラー:", dbError)
      return NextResponse.json(
        {
          success: false,
          error: "データベースにアクセスできません",
          details: {
            errorCode: dbError.code,
            errorMessage: dbError.message,
            databaseId: dbId,
            tokenPrefix: apiKey.substring(0, 15),
          },
          guidance: `データベースアクセスエラー: ${dbError.code}

解決方法:
1. データベースIDが正しいか確認: ${dbId}
2. データベースページで「Share」をクリック
3. 作成した統合を選択してアクセス権を付与
4. データベースが削除されていないか確認
5. トークンが有効か確認: ${apiKey.substring(0, 15)}...`,
        },
        { status: 500 },
      )
    }

    // データベースクエリを実行
    console.log("データベースクエリを実行中...")
    const response = await notion.databases.query({
      database_id: dbId,
      sorts: [{ property: "投稿日", direction: "descending" }],
      page_size: 5, // テスト用に少なめに設定
    })

    console.log("=== Notion API接続テスト成功 ===")
    console.log("取得したエントリ数:", response.results.length)

    const entries = response.results.map((page: any) => {
      const properties = page.properties
      return {
        title: properties["タイトル"]?.title?.[0]?.plain_text || "(無題)",
        topic: properties["トピック"]?.rich_text?.[0]?.plain_text || "",
        url: properties["URL"]?.url || "",
        date: properties["投稿日"]?.date?.start || new Date().toISOString(),
      }
    })

    return NextResponse.json({
      success: true,
      message: "Notion API接続に成功しました",
      data: {
        entriesCount: response.results.length,
        sampleEntries: entries,
        databaseInfo: {
          title: "データベース",
          id: dbId,
          properties: Object.keys(('properties' in databaseInfo ? databaseInfo.properties : {}) || {}),
        },
        tokenInfo: {
          prefix: apiKey.substring(0, 15),
          length: apiKey.length,
          isValid: true,
          type: apiKey.startsWith("secret_") ? "secret" : "ntn",
        },
      },
    })
  } catch (error: any) {
    console.error("=== Notion API接続テスト失敗 ===")
    console.error("エラー詳細:", error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || "不明なエラーが発生しました",
        details: {
          errorType: error.constructor.name,
          errorCode: error.code,
          stack: error.stack?.split("\n").slice(0, 5),
        },
        guidance: "上記のエラー情報を確認して、適切な対処を行ってください。",
      },
      { status: 500 },
    )
  }
}
