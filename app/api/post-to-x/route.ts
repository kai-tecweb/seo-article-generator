import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { tweet, imageUrl } = await req.json()

    if (!tweet) {
      return NextResponse.json({ error: "投稿文が提供されていません。" }, { status: 400 })
    }

    if (tweet.length > 140) {
      return NextResponse.json({ error: "投稿文は140文字以内にしてください。" }, { status: 400 })
    }

    // ネットワーク遅延をシミュレート
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // 実際のX API連携ロジックをここに記述
    // 例: const xResponse = await fetch("https://api.twitter.com/2/tweets", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${process.env.X_BEARER_TOKEN}`, // 環境変数からトークンを取得
    //   },
    //   body: JSON.stringify({ text: tweet, media: imageUrl ? { media_ids: ["media_id_from_upload"] } : undefined }),
    // });

    // モックの投稿URLを生成
    const postId = Date.now()
    const xPostUrl = `https://twitter.com/user/status/${postId}`

    console.log(`Xに投稿しました: ${tweet} (画像: ${imageUrl || "なし"})`)
    return NextResponse.json({ message: "Xへの投稿が完了しました", url: xPostUrl })
  } catch (error: any) {
    console.error("X投稿APIエラー:", error)
    return NextResponse.json({ error: error.message || "Xへの投稿中にエラーが発生しました。" }, { status: 500 })
  }
}
