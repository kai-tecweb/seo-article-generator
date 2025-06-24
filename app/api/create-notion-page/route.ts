import { type NextRequest, NextResponse } from "next/server"
import { Client } from "@notionhq/client"

export async function POST(req: NextRequest) {
  try {
    console.log("=== Notionページ作成テスト開始 ===")

    const { title, content } = await req.json()
    
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

    // Notionクライアントを初期化
    const notion = new Client({ auth: apiKey })

    console.log("Notionクライアント初期化完了")

    // ワークスペースの情報を取得してテスト
    console.log("ワークスペース情報を取得中...")
    const users = await notion.users.list({})
    console.log("ワークスペースアクセス成功:", users.results.length, "ユーザー")

    // 新しいページを作成（既存ページを親として使用）
    console.log("新しいページを作成中...")
    const parentPageId = process.env.NOTION_DATABASE_ID // 一時的に親ページIDとして使用
    
    const newPage = await notion.pages.create({
      parent: {
        type: "page_id",
        page_id: parentPageId || "" // 親ページIDを指定
      },
      properties: {
        title: {
          title: [
            {
              text: {
                content: title || "SEO記事生成システムテスト"
              }
            }
          ]
        }
      },
      children: [
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: content || "これはSEO記事生成システムからのテスト投稿です。"
                }
              }
            ]
          }
        }
      ]
    })

    console.log("ページ作成成功:", newPage.id)

    return NextResponse.json({
      success: true,
      message: "Notionページの作成に成功しました",
      data: {
        pageId: newPage.id,
        pageUrl: `https://notion.so/${newPage.id.replace(/-/g, "")}`,
        title: title || "SEO記事生成システムテスト"
      }
    })

  } catch (error: any) {
    console.error("=== Notionページ作成エラー ===")
    console.error("エラータイプ:", error.constructor.name)
    console.error("エラーメッセージ:", error.message)
    console.error("エラー詳細:", error)

    // Notion APIエラーの詳細情報を取得
    const errorDetails = {
      errorType: error.constructor.name,
      errorMessage: error.message,
      errorCode: error.code || "unknown",
      statusCode: error.status || error.statusCode || 500
    }

    return NextResponse.json(
      {
        success: false,
        error: "Notionページの作成に失敗しました",
        details: errorDetails,
        guidance: `エラー詳細: ${error.message}

解決方法:
1. APIキーが正しく設定されているか確認
2. Notionワークスペースへのアクセス権限を確認
3. インテグレーションが適切に設定されているか確認`
      },
      { status: errorDetails.statusCode }
    )
  }
}
