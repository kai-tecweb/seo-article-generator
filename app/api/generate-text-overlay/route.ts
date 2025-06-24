import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// リクエストスキーマの定義
const GenerateTextOverlaySchema = z.object({
  imageUrl: z.string().url('有効な画像URLが必要です'),
  text: z.string().min(1, 'テキストが必要です'),
  textPosition: z.enum(['top', 'center', 'bottom', 'top-left', 'top-right', 'bottom-left', 'bottom-right']).default('center'),
  fontSize: z.number().min(12).max(72).default(24),
  fontFamily: z.enum(['Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana', 'Noto Sans JP', 'Yu Gothic']).default('Noto Sans JP'),
  fontWeight: z.enum(['normal', 'bold', 'lighter', 'bolder']).default('bold'),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#FFFFFF'),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  backgroundOpacity: z.number().min(0).max(1).default(0.7),
  padding: z.number().min(0).max(50).default(20),
  borderRadius: z.number().min(0).max(50).default(8),
  shadow: z.boolean().default(true),
  shadowColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#000000'),
  shadowBlur: z.number().min(0).max(20).default(4),
  maxWidth: z.number().min(100).max(1920).default(800),
  quality: z.enum(['low', 'medium', 'high']).default('high'),
  outputFormat: z.enum(['jpeg', 'png', 'webp']).default('png'),
});

// レスポンス型定義
interface TextOverlayResult {
  success: boolean;
  data?: {
    originalImageUrl: string;
    processedImageUrl: string;
    textOverlay: {
      text: string;
      position: string;
      styling: {
        fontSize: number;
        fontFamily: string;
        fontWeight: string;
        textColor: string;
        backgroundColor?: string;
        backgroundOpacity: number;
        padding: number;
        borderRadius: number;
        shadow: boolean;
        shadowColor?: string;
        shadowBlur?: number;
      };
    };
    imageInfo: {
      originalWidth: number;
      originalHeight: number;
      processedWidth: number;
      processedHeight: number;
      fileSize: number;
      format: string;
    };
    processing: {
      processingTime: number;
      quality: string;
      optimizations: string[];
    };
  };
  error?: string;
}

// テキスト位置を座標に変換する関数
function getTextCoordinates(position: string, imageWidth: number, imageHeight: number, textWidth: number, textHeight: number) {
  const margin = 40; // 画像端からのマージン
  
  switch (position) {
    case 'top':
      return { x: imageWidth / 2 - textWidth / 2, y: margin };
    case 'center':
      return { x: imageWidth / 2 - textWidth / 2, y: imageHeight / 2 - textHeight / 2 };
    case 'bottom':
      return { x: imageWidth / 2 - textWidth / 2, y: imageHeight - textHeight - margin };
    case 'top-left':
      return { x: margin, y: margin };
    case 'top-right':
      return { x: imageWidth - textWidth - margin, y: margin };
    case 'bottom-left':
      return { x: margin, y: imageHeight - textHeight - margin };
    case 'bottom-right':
      return { x: imageWidth - textWidth - margin, y: imageHeight - textHeight - margin };
    default:
      return { x: imageWidth / 2 - textWidth / 2, y: imageHeight / 2 - textHeight / 2 };
  }
}

// Canvas APIを使用した画像処理（サーバーサイド実装のモック）
async function processImageWithText(params: z.infer<typeof GenerateTextOverlaySchema>) {
  const startTime = Date.now();
  
  // 実際の実装では、node-canvas や sharp などのライブラリを使用
  // ここではモック実装として処理の流れを示す
  
  const {
    imageUrl,
    text,
    textPosition,
    fontSize,
    fontFamily,
    fontWeight,
    textColor,
    backgroundColor,
    backgroundOpacity,
    padding,
    borderRadius,
    shadow,
    shadowColor,
    shadowBlur,
    maxWidth,
    quality,
    outputFormat
  } = params;
  
  // 画像情報の取得（モック）
  const originalImageInfo = {
    width: 1200,
    height: 800,
    format: 'jpeg'
  };
  
  // リサイズ計算
  const scale = Math.min(maxWidth / originalImageInfo.width, 1);
  const processedWidth = Math.round(originalImageInfo.width * scale);
  const processedHeight = Math.round(originalImageInfo.height * scale);
  
  // テキストサイズの計算（簡易版）
  const scaledFontSize = Math.round(fontSize * scale);
  const estimatedTextWidth = text.length * scaledFontSize * 0.6; // 概算
  const estimatedTextHeight = scaledFontSize * 1.2;
  
  // テキスト位置の計算
  const coordinates = getTextCoordinates(
    textPosition,
    processedWidth,
    processedHeight,
    estimatedTextWidth,
    estimatedTextHeight
  );
  
  // 処理時間の計算
  const processingTime = Date.now() - startTime;
  
  // 最適化の実施項目
  const optimizations = [
    '画像リサイズ最適化',
    'テキスト配置最適化',
    'フォント レンダリング最適化'
  ];
  
  if (quality === 'high') {
    optimizations.push('高品質出力最適化');
  }
  
  if (shadow) {
    optimizations.push('テキストシャドウ効果');
  }
  
  if (backgroundColor) {
    optimizations.push('背景色オーバーレイ');
  }
  
  // 実際の実装では、ここで画像処理を行い、
  // 処理済み画像をファイルシステムやクラウドストレージに保存
  const processedImageUrl = `/api/generated-images/text-overlay-${Date.now()}.${outputFormat}`;
  
  return {
    originalImageUrl: imageUrl,
    processedImageUrl,
    textOverlay: {
      text,
      position: textPosition,
      styling: {
        fontSize: scaledFontSize,
        fontFamily,
        fontWeight,
        textColor,
        backgroundColor,
        backgroundOpacity,
        padding,
        borderRadius,
        shadow,
        shadowColor: shadow ? shadowColor : undefined,
        shadowBlur: shadow ? shadowBlur : undefined,
      },
    },
    imageInfo: {
      originalWidth: originalImageInfo.width,
      originalHeight: originalImageInfo.height,
      processedWidth,
      processedHeight,
      fileSize: Math.round((processedWidth * processedHeight * 3) / (quality === 'low' ? 3 : quality === 'medium' ? 2 : 1)), // 概算
      format: outputFormat,
    },
    processing: {
      processingTime,
      quality,
      optimizations,
    },
  };
}

// Canvas実装の詳細（実際のサーバーサイド画像処理）
async function generateImageWithTextOverlay(params: z.infer<typeof GenerateTextOverlaySchema>) {
  // 実際の実装例（node-canvas使用時）
  /*
  const { createCanvas, loadImage, registerFont } = require('canvas');
  
  try {
    // 日本語フォントの登録（必要に応じて）
    if (params.fontFamily === 'Noto Sans JP') {
      registerFont('./fonts/NotoSansJP-Regular.ttf', { family: 'Noto Sans JP' });
    }
    
    // 元画像の読み込み
    const image = await loadImage(params.imageUrl);
    const scale = Math.min(params.maxWidth / image.width, 1);
    const canvasWidth = Math.round(image.width * scale);
    const canvasHeight = Math.round(image.height * scale);
    
    // Canvasの作成
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');
    
    // 画像の描画
    ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
    
    // テキストスタイルの設定
    const fontSize = Math.round(params.fontSize * scale);
    ctx.font = `${params.fontWeight} ${fontSize}px ${params.fontFamily}`;
    ctx.fillStyle = params.textColor;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    
    // テキストサイズの測定
    const textMetrics = ctx.measureText(params.text);
    const textWidth = textMetrics.width;
    const textHeight = fontSize;
    
    // テキスト位置の計算
    const coordinates = getTextCoordinates(
      params.textPosition,
      canvasWidth,
      canvasHeight,
      textWidth,
      textHeight
    );
    
    // 背景の描画（指定されている場合）
    if (params.backgroundColor) {
      ctx.globalAlpha = params.backgroundOpacity;
      ctx.fillStyle = params.backgroundColor;
      ctx.roundRect(
        coordinates.x - params.padding,
        coordinates.y - params.padding,
        textWidth + params.padding * 2,
        textHeight + params.padding * 2,
        params.borderRadius
      );
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    
    // テキストシャドウの設定（指定されている場合）
    if (params.shadow) {
      ctx.shadowColor = params.shadowColor;
      ctx.shadowBlur = params.shadowBlur;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
    }
    
    // テキストの描画
    ctx.fillStyle = params.textColor;
    ctx.fillText(params.text, coordinates.x, coordinates.y);
    
    // 画像の出力
    let buffer;
    switch (params.outputFormat) {
      case 'jpeg':
        buffer = canvas.toBuffer('image/jpeg', { quality: params.quality === 'high' ? 0.9 : params.quality === 'medium' ? 0.7 : 0.5 });
        break;
      case 'png':
        buffer = canvas.toBuffer('image/png');
        break;
      case 'webp':
        buffer = canvas.toBuffer('image/webp', { quality: params.quality === 'high' ? 90 : params.quality === 'medium' ? 70 : 50 });
        break;
      default:
        buffer = canvas.toBuffer('image/png');
    }
    
    return buffer;
    
  } catch (error) {
    throw new Error(`画像処理エラー: ${error.message}`);
  }
  */
  
  // モック実装として処理結果を返す
  return await processImageWithText(params);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = GenerateTextOverlaySchema.parse(body);
    
    // 画像処理の実行
    const processedData = await generateImageWithTextOverlay(validatedData);
    
    const result: TextOverlayResult = {
      success: true,
      data: processedData
    };
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Text overlay generation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: `入力データが無効です: ${error.errors.map(e => e.message).join(', ')}`
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'テキストオーバーレイ生成中にエラーが発生しました'
    }, { status: 500 });
  }
}

// 生成済み画像を取得するためのGETエンドポイント（オプション）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    
    if (!filename) {
      return NextResponse.json({
        success: false,
        error: 'ファイル名が指定されていません'
      }, { status: 400 });
    }
    
    // 実際の実装では、ファイルシステムやクラウドストレージから画像を取得
    // ここではモック応答
    return NextResponse.json({
      success: true,
      data: {
        filename,
        url: `/api/generated-images/${filename}`,
        available: true,
        createdAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Image retrieval error:', error);
    return NextResponse.json({
      success: false,
      error: '画像取得中にエラーが発生しました'
    }, { status: 500 });
  }
}
