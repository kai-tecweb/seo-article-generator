import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// リクエストスキーマの定義
const GenerateFromHtmlSchema = z.object({
  htmlContent: z.string().min(1, 'HTML content is required'),
  targetTopic: z.string().optional(),
  seoKeywords: z.array(z.string()).optional(),
  generateAds: z.boolean().default(false),
  optimizeImages: z.boolean().default(true),
  optimizeLinks: z.boolean().default(true),
});

// レスポンス型定義
interface HtmlAnalysisResult {
  success: boolean;
  data?: {
    originalAnalysis: {
      title: string;
      description: string;
      headings: string[];
      images: Array<{ src: string; alt: string; hasAlt: boolean }>;
      links: Array<{ href: string; text: string; isInternal: boolean }>;
      structuredData: any;
    };
    optimizedHtml: string;
    improvements: {
      metadataUpdated: boolean;
      imagesOptimized: number;
      linksOptimized: number;
      structuredDataAdded: boolean;
      adsInserted: number;
    };
    seoReport: {
      score: number;
      issues: string[];
      recommendations: string[];
    };
  };
  error?: string;
}

// HTMLからメタデータを抽出する関数
function extractMetadata(html: string) {
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)/i);
  
  return {
    title: titleMatch ? titleMatch[1].trim() : '',
    description: descMatch ? descMatch[1].trim() : '',
  };
}

// 見出し構造を抽出する関数
function extractHeadings(html: string) {
  const headingMatches = html.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi) || [];
  return headingMatches.map(heading => {
    const textMatch = heading.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/i);
    return textMatch ? textMatch[1].replace(/<[^>]*>/g, '').trim() : '';
  });
}

// 画像情報を抽出する関数
function extractImages(html: string) {
  const imgMatches = html.match(/<img[^>]*>/gi) || [];
  return imgMatches.map(img => {
    const srcMatch = img.match(/src=["']([^"']*)/i);
    const altMatch = img.match(/alt=["']([^"']*)/i);
    
    return {
      src: srcMatch ? srcMatch[1] : '',
      alt: altMatch ? altMatch[1] : '',
      hasAlt: !!altMatch && altMatch[1].trim() !== '',
    };
  });
}

// リンク情報を抽出する関数
function extractLinks(html: string) {
  const linkMatches = html.match(/<a[^>]*href[^>]*>(.*?)<\/a>/gi) || [];
  return linkMatches.map(link => {
    const hrefMatch = link.match(/href=["']([^"']*)/i);
    const textMatch = link.match(/<a[^>]*>(.*?)<\/a>/i);
    
    const href = hrefMatch ? hrefMatch[1] : '';
    const text = textMatch ? textMatch[1].replace(/<[^>]*>/g, '').trim() : '';
    
    return {
      href,
      text,
      isInternal: href.startsWith('/') || href.includes(process.env.NEXT_PUBLIC_APP_URL || ''),
    };
  });
}

// 画像のalt属性を最適化する関数
function optimizeImageAlts(html: string, topic: string = ''): { html: string; optimized: number } {
  let optimized = 0;
  
  const optimizedHtml = html.replace(/<img([^>]*?)alt=["']([^"']*?)["']([^>]*?)>/gi, (match, before, altText, after) => {
    if (!altText.trim()) {
      optimized++;
      // 簡単なalt属性生成（実際の実装ではより高度な画像解析を行う）
      const newAlt = topic ? `${topic}に関連する画像` : '関連画像';
      return `<img${before}alt="${newAlt}"${after}>`;
    }
    return match;
  });
  
  return { html: optimizedHtml, optimized };
}

// 内部リンクを最適化する関数
function optimizeInternalLinks(html: string): { html: string; optimized: number } {
  let optimized = 0;
  
  // 「こちら」「詳細」などの曖昧なアンカーテキストを改善
  const vague = ['こちら', '詳細', 'ここ', 'クリック', 'リンク'];
  
  const optimizedHtml = html.replace(/<a([^>]*?)>(.*?)<\/a>/gi, (match, attributes, text) => {
    if (vague.some(v => text.trim().toLowerCase().includes(v))) {
      optimized++;
      // より具体的なアンカーテキストに改善（実際の実装では文脈を考慮）
      return `<a${attributes}>${text}の詳細情報</a>`;
    }
    return match;
  });
  
  return { html: optimizedHtml, optimized };
}

// 広告を挿入する関数
function insertAds(html: string): { html: string; inserted: number } {
  let inserted = 0;
  
  // H2タグの前に広告を挿入
  const withH2Ads = html.replace(/<h2/gi, () => {
    inserted++;
    return `<div class="ad-container" style="margin: 20px 0; text-align: center;">
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
      <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
    </div>
    <h2`;
  });
  
  return { html: withH2Ads, inserted };
}

// 構造化データを生成する関数
function generateStructuredData(title: string, description: string) {
  return {
    "@context": "http://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "datePublished": new Date().toISOString(),
    "dateModified": new Date().toISOString(),
    "author": {
      "@type": "Person",
      "name": "AI記事生成システム"
    },
    "publisher": {
      "@type": "Organization",
      "name": process.env.NEXT_PUBLIC_APP_NAME || "SEO記事生成システム"
    }
  };
}

// SEOスコアを計算する関数
function calculateSeoScore(analysis: any, improvements: any): { score: number; issues: string[]; recommendations: string[] } {
  let score = 100;
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  // タイトルチェック
  if (!analysis.title || analysis.title.length < 20) {
    score -= 15;
    issues.push('タイトルが短すぎます（20文字以上推奨）');
    recommendations.push('魅力的で具体的なタイトルを設定してください');
  }
  
  // ディスクリプションチェック
  if (!analysis.description || analysis.description.length < 120) {
    score -= 15;
    issues.push('メタディスクリプションが短すぎます（120-160文字推奨）');
    recommendations.push('検索結果で表示される魅力的な要約を作成してください');
  }
  
  // 画像alt属性チェック
  const imagesWithoutAlt = analysis.images.filter((img: any) => !img.hasAlt);
  if (imagesWithoutAlt.length > 0) {
    score -= 10 * Math.min(imagesWithoutAlt.length, 3);
    issues.push(`${imagesWithoutAlt.length}個の画像にalt属性がありません`);
    recommendations.push('すべての画像に適切なalt属性を設定してください');
  }
  
  // 見出し構造チェック
  if (analysis.headings.length < 3) {
    score -= 10;
    issues.push('見出しが少なすぎます（3個以上推奨）');
    recommendations.push('論理的な見出し構造を作成してください');
  }
  
  return { score: Math.max(0, score), issues, recommendations };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = GenerateFromHtmlSchema.parse(body);
    
    const { htmlContent, targetTopic, generateAds, optimizeImages, optimizeLinks } = validatedData;
    
    // HTMLを解析
    const metadata = extractMetadata(htmlContent);
    const headings = extractHeadings(htmlContent);
    const images = extractImages(htmlContent);
    const links = extractLinks(htmlContent);
    
    const originalAnalysis = {
      title: metadata.title,
      description: metadata.description,
      headings,
      images,
      links,
      structuredData: null,
    };
    
    // HTML最適化処理
    let optimizedHtml = htmlContent;
    let improvements = {
      metadataUpdated: false,
      imagesOptimized: 0,
      linksOptimized: 0,
      structuredDataAdded: false,
      adsInserted: 0,
    };
    
    // 画像最適化
    if (optimizeImages) {
      const imageResult = optimizeImageAlts(optimizedHtml, targetTopic || metadata.title);
      optimizedHtml = imageResult.html;
      improvements.imagesOptimized = imageResult.optimized;
    }
    
    // リンク最適化
    if (optimizeLinks) {
      const linkResult = optimizeInternalLinks(optimizedHtml);
      optimizedHtml = linkResult.html;
      improvements.linksOptimized = linkResult.optimized;
    }
    
    // 広告挿入
    if (generateAds) {
      const adResult = insertAds(optimizedHtml);
      optimizedHtml = adResult.html;
      improvements.adsInserted = adResult.inserted;
    }
    
    // 構造化データ追加
    const structuredData = generateStructuredData(metadata.title, metadata.description);
    const structuredDataScript = `<script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>`;
    
    if (optimizedHtml.includes('</head>')) {
      optimizedHtml = optimizedHtml.replace('</head>', `${structuredDataScript}\n</head>`);
      improvements.structuredDataAdded = true;
    }
    
    // SEOスコア計算
    const seoReport = calculateSeoScore(originalAnalysis, improvements);
    
    const result: HtmlAnalysisResult = {
      success: true,
      data: {
        originalAnalysis,
        optimizedHtml,
        improvements,
        seoReport,
      },
    };
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('HTML解析エラー:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: `バリデーションエラー: ${error.errors.map(e => e.message).join(', ')}` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'HTML解析処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

// GETメソッドで使用方法の情報を返す
export async function GET() {
  const usage = {
    endpoint: '/api/generate-from-html',
    method: 'POST',
    description: 'HTMLを解析してSEO最適化された記事を生成します',
    parameters: {
      htmlContent: {
        type: 'string',
        required: true,
        description: '解析するHTMLコンテンツ'
      },
      targetTopic: {
        type: 'string',
        required: false,
        description: '対象トピック（画像alt属性生成に使用）'
      },
      seoKeywords: {
        type: 'array',
        required: false,
        description: 'SEOキーワード配列'
      },
      generateAds: {
        type: 'boolean',
        default: false,
        description: '広告を自動挿入するかどうか'
      },
      optimizeImages: {
        type: 'boolean',
        default: true,
        description: '画像を最適化するかどうか'
      },
      optimizeLinks: {
        type: 'boolean',
        default: true,
        description: 'リンクを最適化するかどうか'
      }
    },
    example: {
      htmlContent: '<html><head><title>サンプルタイトル</title></head><body><h1>メインタイトル</h1><img src="image.jpg" alt=""></body></html>',
      targetTopic: '電話番号詐欺対策',
      generateAds: true,
      optimizeImages: true,
      optimizeLinks: true
    }
  };
  
  return NextResponse.json(usage);
}
