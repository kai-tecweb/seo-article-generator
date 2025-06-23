import { NextResponse } from "next/server"
import { fetchNotionHistory } from "@/utils/notion"

export async function POST() {
  try {
    console.log("GET /api/get-notion-history called")

    // 環境変数の存在確認
    const hasApiKey = !!process.env.NOTION_API_KEY
    const hasDbId = !!process.env.NOTION_DATABASE_ID

    console.log("Environment check in API route:")
    console.log("Has NOTION_API_KEY:", hasApiKey)
    console.log("Has NOTION_DATABASE_ID:", hasDbId)

    if (!hasApiKey || !hasDbId) {
      const errorMsg = `環境変数が設定されていません。API Key: ${hasApiKey}, Database ID: ${hasDbId}`
      console.error(errorMsg)
      return NextResponse.json(
        {
          error: errorMsg,
          debug: {
            hasApiKey,
            hasDbId,
            nodeEnv: process.env.NODE_ENV,
          },
        },
        { status: 500 },
      )
    }

    const entries = await fetchNotionHistory()
    console.log("Successfully fetched entries:", entries.length)

    return NextResponse.json({ entries })
  } catch (error: any) {
    console.error("APIルートでのNotion履歴取得エラー:", error)
    return NextResponse.json(
      {
        error: error.message || "Notion履歴の取得中にエラーが発生しました。",
        debug: {
          hasApiKey: !!process.env.NOTION_API_KEY,
          hasDbId: !!process.env.NOTION_DATABASE_ID,
          errorType: error.constructor.name,
          stack: error.stack,
        },
      },
      { status: 500 },
    )
  }
}
