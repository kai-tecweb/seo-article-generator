import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { title, content, categoryId, tagIds, status } = await req.json() // statusを受け取る

    if (!title || !content) {
      return NextResponse.json({ error: "タイトルとコンテンツが提供されていません。" }, { status: 400 })
    }

    const wordpressUrl = process.env.WORDPRESS_API_URL
    const wordpressUsername = process.env.WORDPRESS_USERNAME
    const wordpressApplicationPassword = process.env.WORDPRESS_APP_PASSWORD

    if (!wordpressUrl || !wordpressUsername || !wordpressApplicationPassword) {
      console.error("WordPressの環境変数が設定されていません。")
      return NextResponse.json(
        { error: "WordPressの接続情報が設定されていません。管理者に連絡してください。" },
        { status: 500 },
      )
    }

    const auth = Buffer.from(`${wordpressUsername}:${wordpressApplicationPassword}`).toString("base64")

    const postData: {
      title: string
      content: string
      status: string
      categories?: number[]
      tags?: number[]
    } = {
      title: title,
      content: content,
      status: status || "publish", // statusが提供されない場合は"publish"をデフォルトとする
    }

    // categoryIdが有効な数値であれば追加
    if (typeof categoryId === "number" && !isNaN(categoryId)) {
      postData.categories = [categoryId]
    }

    // tagIdsが有効な数値の配列であれば追加
    if (Array.isArray(tagIds) && tagIds.length > 0) {
      postData.tags = tagIds
    }

    const wordpressResponse = await fetch(`${wordpressUrl}/wp-json/wp/v2/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(postData), // postDataを使用
    })

    if (!wordpressResponse.ok) {
      const errorData = await wordpressResponse.json()
      console.error("WordPress投稿エラー:", errorData)
      throw new Error(`WordPressへの投稿に失敗しました: ${errorData.message || wordpressResponse.statusText}`)
    }

    const wordpressPostData = await wordpressResponse.json()
    const wordpressPostUrl = wordpressPostData.link

    return NextResponse.json({ wordpressPostUrl: wordpressPostUrl })
  } catch (error: any) {
    console.error("WordPress投稿エラー:", error)
    return NextResponse.json({ error: error.message || "WordPressへの投稿中にエラーが発生しました。" }, { status: 500 })
  }
}
