import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    console.log("=== Google Business Profile 投稿開始 ===")

    const { content, title, callToAction, callToActionUrl, imageUrl } = await req.json()

    if (!content) {
      return NextResponse.json({ error: "投稿内容が提供されていません。" }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_BUSINESS_API_KEY
    const locationId = process.env.GOOGLE_BUSINESS_LOCATION_ID

    console.log("環境変数確認:")
    console.log("- APIキー存在:", !!apiKey)
    console.log("- ロケーションID存在:", !!locationId)
    console.log("- 投稿内容長:", content.length)

    if (!apiKey) {
      return NextResponse.json(
        { error: "Google Business Profile APIキーが設定されていません。" },
        { status: 500 }
      )
    }

    // デモモードの場合
    if (apiKey.includes("demo")) {
      console.log("デモモードでの投稿シミュレーション")
      
      // ネットワーク遅延をシミュレート
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const postId = `demo_${Date.now()}`
      const gbpPostUrl = `https://business.google.com/posts/demo/${postId}`

      console.log("デモ投稿完了:", {
        title: title || "タイトルなし",
        content: content.substring(0, 50) + "...",
        callToAction,
        url: gbpPostUrl
      })

      return NextResponse.json({
        success: true,
        message: "Google Business Profile への投稿が完了しました（デモモード）",
        data: {
          postId,
          postUrl: gbpPostUrl,
          mode: "demo",
          previewContent: content.substring(0, 100) + (content.length > 100 ? "..." : "")
        }
      })
    }

    // 実際のGoogle Business Profile API投稿
    if (!locationId) {
      return NextResponse.json(
        { error: "Google Business Profile ロケーションIDが設定されていません。" },
        { status: 500 }
      )
    }

    console.log("Google Business Profile APIに投稿中...")

    // 投稿データを準備
    const postData: any = {
      summary: title || content.substring(0, 100),
      callToAction: {
        actionType: callToAction || "LEARN_MORE",
        url: callToActionUrl || "https://kai-techweb.com/"
      },
      media: []
    }

    // テキストコンテンツを追加
    if (content) {
      postData.media.push({
        mediaFormat: "TEXT",
        sourceUrl: "",
        content: content
      })
    }

    // 画像がある場合は追加
    if (imageUrl) {
      postData.media.push({
        mediaFormat: "PHOTO",
        sourceUrl: imageUrl
      })
    }

    // Google My Business Posts API で投稿
    const response = await fetch(
      `https://mybusinessbusinessinformation.googleapis.com/v1/locations/${locationId}/localPosts?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(postData)
      }
    )

    console.log("API投稿レスポンス:", response.status)

    if (!response.ok) {
      const errorData = await response.text()
      console.error("投稿APIエラー:", errorData)
      throw new Error(`Google Business Profile 投稿エラー: ${response.status} - ${errorData}`)
    }

    const postResult = await response.json()
    console.log("投稿成功:", postResult)

    return NextResponse.json({
      success: true,
      message: "Google Business Profile への投稿が完了しました",
      data: {
        postId: postResult.name,
        postUrl: `https://business.google.com/posts/l/${locationId}`,
        content: content.substring(0, 100) + (content.length > 100 ? "..." : "")
      }
    })

  } catch (error: any) {
    console.error("=== Google Business Profile 投稿エラー ===")
    console.error("エラー詳細:", error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Google Business Profile への投稿中にエラーが発生しました。",
        guidance: `投稿に失敗しました。

よくあるエラー:
- 認証エラー: APIキーまたはOAuth設定を確認
- 権限エラー: ビジネスプロフィールの管理者権限を確認
- 制限エラー: 投稿頻度制限を確認（1日5投稿まで推奨）
- フォーマットエラー: 投稿内容の形式を確認`
      },
      { status: 500 }
    )
  }
}
