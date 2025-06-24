import { NextResponse } from "next/server"
import { Client } from "@notionhq/client"

export async function POST() {
  try {
    console.log("=== Notionワークスペース情報取得テスト ===")

    const apiKey = process.env.NOTION_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { 
          success: false, 
          error: "NOTION_API_KEYが設定されていません" 
        },
        { status: 400 }
      )
    }

    console.log("APIキー存在確認: OK")
    console.log("APIキー開始文字:", apiKey.substring(0, 15))

    // Notionクライアントを初期化
    const notion = new Client({ auth: apiKey })

    console.log("Notionクライアント初期化完了")

    // ワークスペースの情報を取得
    console.log("ワークスペースユーザー情報を取得中...")
    const users = await notion.users.list({})
    
    console.log("ユーザー取得成功:", users.results.length, "ユーザー")

    // 自分自身の情報を取得（引数なしでは取得できないため、リストから取得）
    console.log("ボット情報を取得中...")
    const botInfo = users.results.find((user: any) => user.type === "bot") || users.results[0]
    
    console.log("ボット情報取得成功:", botInfo?.name || botInfo?.id)

    // アクセス可能なページを検索
    console.log("アクセス可能なページを検索中...")
    const searchResult = await notion.search({
      query: "",
      page_size: 10,
      filter: {
        property: "object",
        value: "page"
      }
    })

    console.log("検索結果:", searchResult.results.length, "ページ")

    return NextResponse.json({
      success: true,
      message: "Notionワークスペースへのアクセスに成功しました",
      data: {
        integration: {
          name: botInfo?.name || "SEO記事生成システム",
          id: botInfo?.id || "unknown",
          type: botInfo?.type || "bot"
        },
        workspace: {
          userCount: users.results.length,
          accessiblePages: searchResult.results.length
        },
        pages: searchResult.results.slice(0, 3).map((page: any) => ({
          id: page.id,
          title: page.properties?.title?.title?.[0]?.plain_text || "無題",
          url: `https://notion.so/${page.id.replace(/-/g, "")}`
        }))
      }
    })

  } catch (error: any) {
    console.error("=== Notionワークスペーステストエラー ===")
    console.error("エラータイプ:", error.constructor.name)
    console.error("エラーメッセージ:", error.message)

    const errorDetails = {
      errorType: error.constructor.name,
      errorMessage: error.message,
      errorCode: error.code || "unknown"
    }

    return NextResponse.json(
      {
        success: false,
        error: "Notionワークスペースへのアクセスに失敗しました",
        details: errorDetails,
        guidance: `Notion APIキーは有効ですが、アクセスに問題があります。

解決方法:
1. インテグレーションが正しく作成されているか確認
2. インテグレーションにワークスペースへのアクセス権があるか確認
3. APIキーが最新のものか確認`
      },
      { status: 500 }
    )
  }
}
