import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const wordpressUrl = process.env.WORDPRESS_API_URL
    const wordpressUsername = process.env.WORDPRESS_USERNAME
    const wordpressApplicationPassword = process.env.WORDPRESS_APPLICATION_PASSWORD

    if (!wordpressUrl || !wordpressUsername || !wordpressApplicationPassword) {
      console.error("WordPressの環境変数が設定されていません。")
      return NextResponse.json(
        { error: "WordPressの接続情報が設定されていません。管理者に連絡してください。" },
        { status: 500 },
      )
    }

    const auth = Buffer.from(`${wordpressUsername}:${wordpressApplicationPassword}`).toString("base64")
    const headers = {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    }

    // カテゴリの取得
    const categoriesResponse = await fetch(`${wordpressUrl}/wp-json/wp/v2/categories?per_page=100`, { headers })
    if (!categoriesResponse.ok) {
      const errorData = await categoriesResponse.json()
      console.error("WordPressカテゴリ取得エラー:", errorData)
      throw new Error(`カテゴリの取得に失敗しました: ${errorData.message || categoriesResponse.statusText}`)
    }
    const categoriesData = await categoriesResponse.json()
    const categories = categoriesData.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
    }))

    // タグの取得
    const tagsResponse = await fetch(`${wordpressUrl}/wp-json/wp/v2/tags?per_page=100`, { headers })
    if (!tagsResponse.ok) {
      const errorData = await tagsResponse.json()
      console.error("WordPressタグ取得エラー:", errorData)
      throw new Error(`タグの取得に失敗しました: ${errorData.message || tagsResponse.statusText}`)
    }
    const tagsData = await tagsResponse.json()
    const tags = tagsData.map((tag: any) => ({
      id: tag.id,
      name: tag.name,
    }))

    return NextResponse.json({ categories, tags })
  } catch (error: any) {
    console.error("WordPressターム取得APIエラー:", error)
    return NextResponse.json(
      { error: error.message || "WordPressのカテゴリとタグの取得中にエラーが発生しました。" },
      { status: 500 },
    )
  }
}
