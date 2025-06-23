// app/api/save-to-notion/route.ts

import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { title, topic, url, tags, categoryId, status } = await req.json()

  const notionApiKey = process.env.NOTION_API_KEY
  const databaseId = process.env.NOTION_DATABASE_ID

  if (!notionApiKey || !databaseId) {
    return NextResponse.json({ error: "Missing Notion API key or Database ID" }, { status: 500 })
  }

  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${notionApiKey}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties: {
        タイトル: {
          title: [{ text: { content: title } }],
        },
        トピック: {
          rich_text: [{ text: { content: topic } }],
        },
        URL: {
          url: url,
        },
        タグ: {
          multi_select: tags.map((t: string) => ({ name: t })),
        },
        カテゴリID: {
          number: categoryId,
        },
        ステータス: {
          status: { name: status },
        },
      },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error("Notion保存APIエラー:", error)
    return NextResponse.json({ error }, { status: 500 })
  }

  const data = await response.json()
  // NotionページのURLを構築して返す
  const notionPageUrl = `https://www.notion.so/${data.id.replace(/-/g, "")}`
  return NextResponse.json({ message: "Notionに保存しました", pageId: data.id, pageUrl: notionPageUrl })
}
