import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { platform, title, content } = await req.json()

    if (!platform || !title || !content) {
      return NextResponse.json(
        { error: "プラットフォーム、タイトル、コンテンツが提供されていません。" },
        { status: 400 },
      )
    }

    // ネットワーク遅延をシミュレート
    await new Promise((resolve) => setTimeout(resolve, 1500))

    let postUrl: string
    switch (platform) {
      case "note":
        // 実際のnote API連携ロジックをここに記述
        // 例: const noteResponse = await fetch("https://note.com/api/v2/posts", { ... });
        postUrl = `https://note.com/mock-post-id-${Date.now()}`
        break
      case "in": // InstaNoteを想定
        // 実際のInstaNote API連携ロジックをここに記述
        // 例: const instaNoteResponse = await fetch("https://instanote.com/api/posts", { ... });
        postUrl = `https://instanote.com/mock-post-id-${Date.now()}`
        break
      default:
        return NextResponse.json({ error: "無効なプラットフォームです。" }, { status: 400 })
    }

    console.log(`記事を${platform}に投稿しました: ${title}`)
    return NextResponse.json({ message: "投稿が完了しました", url: postUrl })
  } catch (error: any) {
    console.error("外部サービス投稿APIエラー:", error)
    return NextResponse.json(
      { error: error.message || "外部サービスへの投稿中にエラーが発生しました。" },
      { status: 500 },
    )
  }
}
