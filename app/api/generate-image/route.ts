import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    console.log("=== AI画像生成機能開始 ===")

    const { 
      topic,
      prompt,
      style = "professional",
      size = "square",
      imageType = "article",
      keywords = [],
      language = "japanese"
    } = await req.json()

    if (!topic && !prompt) {
      return NextResponse.json({ 
        error: "トピックまたはプロンプトが提供されていません。" 
      }, { status: 400 })
    }

    const falApiKey = process.env.FAL_AI_API_KEY

    console.log("画像生成パラメータ:")
    console.log("- トピック:", topic)
    console.log("- カスタムプロンプト:", prompt ? "あり" : "なし")
    console.log("- スタイル:", style)
    console.log("- サイズ:", size)
    console.log("- 画像タイプ:", imageType)
    console.log("- キーワード:", keywords)
    console.log("- APIキー存在:", !!falApiKey)

    // デモモードの場合（APIキーが未設定またはデモ用）
    if (!falApiKey || falApiKey.includes("demo") || (!falApiKey.includes("-") && !falApiKey.includes(":"))) {
      console.log("デモモードでの画像生成シミュレーション")
      console.log("APIキー状態:", falApiKey ? `設定済み(${falApiKey.length}文字)` : "未設定")
      
      // ネットワーク遅延をシミュレート
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const demoImageId = `demo_${Date.now()}`
      const demoImageUrl = `/placeholder.jpg`

      console.log("デモ画像生成完了:", {
        topic: topic || "カスタムプロンプト",
        style,
        size,
        imageUrl: demoImageUrl
      })

      return NextResponse.json({
        success: true,
        imageUrl: demoImageUrl,
        imageId: demoImageId,
        message: "AI画像生成が完了しました（デモモード）",
        metadata: {
          mode: "demo",
          topic: topic || "カスタムプロンプト",
          style,
          size,
          imageType,
          generatedAt: new Date().toISOString(),
          promptUsed: generateImagePrompt(topic, prompt, style, imageType, keywords, language)
        }
      })
    }

    // 実際のFal AI API実装
    console.log("Fal AI APIで画像生成中...")

    // プロンプトの生成
    const finalPrompt = generateImagePrompt(topic, prompt, style, imageType, keywords, language)
    console.log("生成プロンプト:", finalPrompt)

    // サイズ設定の変換
    const dimensions = getSizeDimensions(size)

    try {
      // Fal AI APIへのリクエスト
      const falResponse = await fetch("https://fal.run/fal-ai/flux/schnell", {
        method: "POST",
        headers: {
          "Authorization": `Key ${falApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          image_size: dimensions,
          num_inference_steps: 4,
          num_images: 1,
          enable_safety_checker: true
        })
      })

      if (!falResponse.ok) {
        const errorData = await falResponse.text()
        console.error("Fal AI APIエラー:", errorData)
        throw new Error(`Fal AI API エラー: ${falResponse.status} - ${errorData}`)
      }

      const falData = await falResponse.json()
      console.log("Fal AI API成功:", falData)

      const imageUrl = falData.images?.[0]?.url
      if (!imageUrl) {
        throw new Error("画像URLが取得できませんでした")
      }

      return NextResponse.json({
        success: true,
        imageUrl: imageUrl,
        imageId: falData.request_id,
        message: "AI画像生成が完了しました",
        metadata: {
          mode: "production",
          model: "flux-schnell",
          topic: topic || "カスタムプロンプト",
          style,
          size,
          dimensions,
          imageType,
          promptUsed: finalPrompt,
          generatedAt: new Date().toISOString(),
          processingTime: "約3-8秒"
        }
      })

    } catch (falError: any) {
      console.error("Fal AI APIエラー:", falError)
      
      // フォールバック: デモモードで返す
      const fallbackImageUrl = `/placeholder.jpg`
      
      return NextResponse.json({
        success: true,
        imageUrl: fallbackImageUrl,
        imageId: `fallback_${Date.now()}`,
        message: "AI画像生成でエラーが発生したため、プレースホルダー画像を返しています",
        metadata: {
          mode: "fallback",
          error: falError.message,
          promptUsed: finalPrompt,
          generatedAt: new Date().toISOString()
        }
      })
    }

  } catch (error: any) {
    console.error("=== AI画像生成エラー ===")
    console.error("エラー詳細:", error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || "AI画像生成中にエラーが発生しました。",
        guidance: `画像生成に失敗しました。

よくあるエラー:
- APIキーエラー: Fal AI APIキーの設定を確認してください
- プロンプトエラー: 画像生成プロンプトの内容を確認してください
- ネットワークエラー: インターネット接続を確認してください
- 使用量制限: Fal AI APIの使用量制限を確認してください

推奨解決方法:
1. APIキーの設定を再確認
2. プロンプトの内容を簡潔にする
3. しばらく待ってから再試行`
      },
      { status: 500 }
    )
  }
}

// 画像生成プロンプトを生成する関数
function generateImagePrompt(
  topic: string, 
  customPrompt: string, 
  style: string, 
  imageType: string, 
  keywords: string[], 
  language: string
): string {
  if (customPrompt) {
    return customPrompt
  }

  let basePrompt = ""
  
  // 画像タイプに応じたベースプロンプト
  switch (imageType) {
    case "article":
      basePrompt = `A professional article header image about ${topic}`
      break
    case "social":
      basePrompt = `A social media post image about ${topic}`
      break
    case "banner":
      basePrompt = `A website banner image about ${topic}`
      break
    case "icon":
      basePrompt = `A simple icon representing ${topic}`
      break
    default:
      basePrompt = `An image representing ${topic}`
  }

  // スタイルの追加
  const styleDescriptions = {
    professional: "professional, clean, modern, high-quality",
    creative: "creative, artistic, colorful, imaginative",
    minimal: "minimal, simple, clean, elegant",
    tech: "technology, digital, futuristic, sleek",
    business: "business, corporate, professional, sophisticated",
    casual: "casual, friendly, approachable, relaxed"
  }

  const styleDesc = styleDescriptions[style as keyof typeof styleDescriptions] || "professional"

  // キーワードの追加
  const keywordStr = keywords.length > 0 ? `, featuring ${keywords.join(", ")}` : ""

  // 最終プロンプト
  const finalPrompt = `${basePrompt}, ${styleDesc}${keywordStr}. High resolution, detailed, visually appealing.`

  return finalPrompt
}

// サイズ設定を変換する関数
function getSizeDimensions(size: string): string {
  const sizeMap = {
    square: "square_hd",        // 1024x1024
    landscape: "landscape_4_3", // 1024x768
    portrait: "portrait_4_3",   // 768x1024
    wide: "landscape_16_9",     // 1344x768
    tall: "portrait_16_9"       // 768x1344
  }

  return sizeMap[size as keyof typeof sizeMap] || "square_hd"
}
