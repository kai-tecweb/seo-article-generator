import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { title, content, photoUrl } = await req.json()

    if (!title || !content) {
      return NextResponse.json({ error: "タイトルと内容が提供されていません。" }, { status: 400 })
    }

    // ネットワーク遅延をシミュレート
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // 実際のGoogleビジネスプロフィールAPI連携ロジックをここに記述
    // 例: Google My Business API (OAuth認証が必要)
    // const gbpResponse = await fetch("https://mybusiness.googleapis.com/v4/accounts/...", { ... });

    // モックの投稿URLを生成
    const postId = Date.now()
    const gbpPostUrl = `https://business.google.com/posts/l/${postId}`

    console.log(`Googleビジネスプロフィールに投稿しました: ${title} (画像: ${photoUrl || "なし"})`)
    return NextResponse.json({ message: "Googleビジネスプロフィールへの投稿が完了しました", url: gbpPostUrl })
  } catch (error: any) {
    console.error("Googleビジネスプロフィール投稿APIエラー:", error)
    return NextResponse.json(
      { error: error.message || "Googleビジネスプロフィールへの投稿中にエラーが発生しました。" },
      { status: 500 },
    )
  }
}
