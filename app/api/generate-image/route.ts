import { type NextRequest, NextResponse } from "next/server"
import Fal from "@fal-ai/serverless"

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json()

    if (!topic) {
      return NextResponse.json({ error: "トピックが提供されていません。" }, { status: 400 })
    }

    const fal = new Fal({
      credentials: process.env.FAL_AI_KEY,
    })

    // 画像生成のプロンプトを調整
    const imagePrompt = `${topic}に関するSEO記事の導入画像。抽象的で目を引くデザイン。ウェブサイトのヘッダーに合うような横長の構図。`

    const result = await fal.subscribe("fal-ai/stable-diffusion-xl", {
      input: {
        prompt: imagePrompt,
        width: 1024, // 幅を調整
        height: 768, // 高さを調整
        num_inference_steps: 20,
        guidance_scale: 7.5,
      },
      logs: true,
      onResult: (r: any) => {
        if (r.images && r.images.length > 0) {
          // 最初の画像を返す
          return r.images[0].url
        }
      },
    })

    if (!result || !result.images || result.images.length === 0) {
      throw new Error("Fal AIからの画像生成に失敗しました。")
    }

    const imageUrl = result.images[0].url

    return NextResponse.json({ imageUrl: imageUrl })
  } catch (error: any) {
    console.error("画像生成APIエラー:", error)
    return NextResponse.json({ error: error.message || "画像の生成中にエラーが発生しました。" }, { status: 500 })
  }
}
