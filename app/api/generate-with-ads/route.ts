import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// リクエストスキーマの定義
const GenerateWithAdsSchema = z.object({
  topic: z.string().min(1, 'Topic is required'),
  keywords: z.array(z.string()).optional(),
  contentLength: z.enum(['short', 'medium', 'long']).default('medium'),
  adDensity: z.enum(['low', 'medium', 'high']).default('medium'),
  adPositions: z.object({
    beforeFirstH2: z.boolean().default(true),
    betweenH2Sections: z.boolean().default(true),
    afterContent: z.boolean().default(true),
    inParagraphs: z.boolean().default(false),
  }).default({}),
  customAdTemplate: z.string().optional(),
  includeStructuredData: z.boolean().default(true),
  seoOptimization: z.boolean().default(true),
});

// レスポンス型定義
interface AdInsertionResult {
  success: boolean;
  data?: {
    generatedContent: string;
    htmlWithAds: string;
    adStatistics: {
      totalAdsInserted: number;
      adPositions: Array<{
        position: string;
        location: string;
        adType: string;
      }>;
      adDensityScore: number;
    };
    seoMetrics: {
      titleOptimized: boolean;
      metaDescriptionGenerated: boolean;
      structuredDataAdded: boolean;
      imageAltsGenerated: number;
    };
    contentAnalysis: {
      wordCount: number;
      readabilityScore: number;
      keywordDensity: Record<string, number>;
      headingStructure: string[];
    };
  };
  error?: string;
}

// 広告テンプレートの定義
const AD_TEMPLATES = {
  default: `
    <div class="ad-container" style="margin: 20px 0; text-align: center; padding: 20px; background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px;">
      <div style="font-size: 12px; color: #6c757d; margin-bottom: 10px;">スポンサーリンク</div>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-format="auto"
           data-full-width-responsive="true"
           data-ad-client="ca-pub-YOUR-CLIENT-ID"
           data-ad-slot="YOUR-AD-SLOT"></ins>
      <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
    </div>`,
  
  rectangle: `
    <div class="ad-container ad-rectangle" style="margin: 20px auto; text-align: center; max-width: 336px;">
      <div style="font-size: 12px; color: #6c757d; margin-bottom: 10px;">広告</div>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
      <ins class="adsbygoogle"
           style="display:inline-block;width:336px;height:280px"
           data-ad-format="rectangle"
           data-ad-client="ca-pub-YOUR-CLIENT-ID"
           data-ad-slot="YOUR-RECTANGLE-SLOT"></ins>
      <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
    </div>`,
    
  banner: `
    <div class="ad-container ad-banner" style="margin: 20px 0; text-align: center;">
      <div style="font-size: 12px; color: #6c757d; margin-bottom: 10px;">スポンサーリンク</div>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
      <ins class="adsbygoogle"
           style="display:block;width:728px;height:90px"
           data-ad-format="banner"
           data-ad-client="ca-pub-YOUR-CLIENT-ID"
           data-ad-slot="YOUR-BANNER-SLOT"></ins>
      <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
    </div>`,
};

// OpenAI APIを使用して記事コンテンツを生成する関数
async function generateArticleContent(topic: string, keywords: string[] = [], contentLength: string = 'medium'): Promise<string> {
  const lengthGuide = {
    short: '1000-1500文字程度',
    medium: '2000-3000文字程度', 
    long: '3000-5000文字程度'
  };

  const keywordText = keywords.length > 0 ? `主要キーワード: ${keywords.join(', ')}` : '';
  
  const prompt = `
以下の条件でSEO最適化されたブログ記事を生成してください：

トピック: ${topic}
${keywordText}
文字数: ${lengthGuide[contentLength as keyof typeof lengthGuide]}

記事の構造:
1. 魅力的なタイトル（H1）
2. 導入文（読者の関心を引く）
3. 3-5個の見出し（H2）で構成
4. 各セクションに適切な内容
5. まとめ

要件:
- 読みやすい日本語
- SEOキーワードを自然に配置
- 読者に価値を提供する内容
- 適切な見出し階層
- HTMLマークアップで出力

出力形式: HTML（body内のコンテンツのみ）
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'あなたはSEO専門のライターです。読者に価値を提供する高品質な記事を生成してください。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 3000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API エラー: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('記事生成エラー:', error);
    // フォールバック: 基本的な記事構造を生成
    return generateFallbackContent(topic, keywords, contentLength);
  }
}

// フォールバック記事生成関数
function generateFallbackContent(topic: string, keywords: string[] = [], contentLength: string = 'medium'): string {
  const keywordText = keywords.length > 0 ? keywords.join('、') : topic;
  
  return `
    <h1>${topic}について徹底解説</h1>
    
    <p>${topic}に関する情報をお探しの方に向けて、詳しく解説していきます。${keywordText}について気になる方は、ぜひ最後まで読んでみてください。</p>
    
    <h2>${topic}とは？基本的な知識</h2>
    <p>${topic}は、多くの人が関心を持つ重要なテーマです。まずは基本的な知識から確認していきましょう。</p>
    <p>この分野における${keywordText}の重要性は、年々高まっています。正しい理解を持つことで、より良い判断ができるようになります。</p>
    
    <h2>${topic}のメリットとデメリット</h2>
    <p>どんなことにもメリットとデメリットがあります。${topic}についても例外ではありません。</p>
    <p>メリットとしては、${keywordText}に関する知識が深まることが挙げられます。一方で、注意すべき点もいくつかあります。</p>
    
    <h2>具体的な活用方法</h2>
    <p>実際に${topic}を活用する際の具体的な方法について説明します。</p>
    <p>${keywordText}を効果的に使うためには、いくつかのポイントを押さえる必要があります。</p>
    
    <h2>よくある質問と回答</h2>
    <p>${topic}について、よく寄せられる質問とその回答をまとめました。</p>
    <p>特に${keywordText}に関する疑問は多いため、詳しく解説していきます。</p>
    
    <h2>まとめ</h2>
    <p>${topic}について詳しく解説してきました。${keywordText}に関する理解が深まったのではないでしょうか。</p>
    <p>今回の情報を参考に、ぜひ実践してみてください。</p>
  `;
}

// 広告挿入ロジック
function insertAdsIntoContent(content: string, adPositions: any, adDensity: string, customTemplate?: string): { html: string; adStats: any } {
  const template = customTemplate || AD_TEMPLATES.default;
  let adCount = 0;
  const adPositionDetails: Array<{ position: string; location: string; adType: string }> = [];
  
  // 広告密度による最大広告数の設定
  const maxAds = {
    low: 2,
    medium: 4,
    high: 6
  };
  
  let processedContent = content;
  
  // H2タグの前に広告を挿入
  if (adPositions.beforeFirstH2 || adPositions.betweenH2Sections) {
    processedContent = processedContent.replace(/<h2/gi, () => {
      if (adCount < maxAds[adDensity as keyof typeof maxAds]) {
        adCount++;
        adPositionDetails.push({
          position: `H2-${adCount}`,
          location: 'before-heading',
          adType: 'auto'
        });
        return `${template}<h2`;
      }
      return '<h2';
    });
  }
  
  // 段落間に広告を挿入（高密度の場合のみ）
  if (adPositions.inParagraphs && adDensity === 'high') {
    const paragraphs = processedContent.split('</p>');
    if (paragraphs.length > 4) {
      const insertIndex = Math.floor(paragraphs.length / 2);
      if (adCount < maxAds[adDensity as keyof typeof maxAds]) {
        paragraphs[insertIndex] += `</p>${template}`;
        adCount++;
        adPositionDetails.push({
          position: `paragraph-${insertIndex}`,
          location: 'between-paragraphs',
          adType: 'auto'
        });
        processedContent = paragraphs.join('</p>');
      }
    }
  }
  
  // コンテンツ末尾に広告を挿入
  if (adPositions.afterContent && adCount < maxAds[adDensity as keyof typeof maxAds]) {
    processedContent += template;
    adCount++;
    adPositionDetails.push({
      position: 'end',
      location: 'after-content',
      adType: 'auto'
    });
  }
  
  // 広告密度スコアの計算（広告数/コンテンツの文字数 * 1000）
  const textLength = content.replace(/<[^>]*>/g, '').length;
  const adDensityScore = textLength > 0 ? (adCount / textLength) * 1000 : 0;
  
  return {
    html: processedContent,
    adStats: {
      totalAdsInserted: adCount,
      adPositions: adPositionDetails,
      adDensityScore: Math.round(adDensityScore * 100) / 100
    }
  };
}

// SEOメタデータの生成
function generateSeoMetadata(content: string, topic: string, keywords: string[] = []) {
  // タイトル生成
  const title = `${topic} | 完全ガイド`;
  
  // メタディスクリプション生成
  const textContent = content.replace(/<[^>]*>/g, '').substring(0, 300);
  const description = `${topic}について詳しく解説します。${keywords.slice(0, 2).join('、')}など、重要なポイントを分かりやすく説明しています。${textContent.substring(0, 120)}...`;
  
  // 構造化データ生成
  const structuredData = {
    "@context": "http://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description.substring(0, 160),
    "datePublished": new Date().toISOString(),
    "dateModified": new Date().toISOString(),
    "author": {
      "@type": "Person",
      "name": process.env.NEXT_PUBLIC_AUTHOR_NAME || "AI記事生成システム"
    },
    "publisher": {
      "@type": "Organization",
      "name": process.env.NEXT_PUBLIC_APP_NAME || "SEO記事生成システム"
    },
    "keywords": keywords.join(', ')
  };
  
  return { title, description, structuredData };
}

// コンテンツ分析
function analyzeContent(content: string, keywords: string[] = []) {
  const textContent = content.replace(/<[^>]*>/g, '');
  const wordCount = textContent.length;
  
  // 見出し構造の抽出
  const headings = (content.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi) || [])
    .map(h => h.replace(/<[^>]*>/g, ''));
  
  // キーワード密度の計算
  const keywordDensity: Record<string, number> = {};
  keywords.forEach(keyword => {
    const regex = new RegExp(keyword, 'gi');
    const matches = (textContent.match(regex) || []).length;
    keywordDensity[keyword] = wordCount > 0 ? (matches / wordCount) * 100 : 0;
  });
  
  // 読みやすさスコア（簡易版）
  const sentences = textContent.split(/[。！？]/).length;
  const avgSentenceLength = sentences > 0 ? wordCount / sentences : 0;
  const readabilityScore = Math.max(0, 100 - (avgSentenceLength / 50) * 10);
  
  return {
    wordCount,
    readabilityScore: Math.round(readabilityScore),
    keywordDensity,
    headingStructure: headings
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = GenerateWithAdsSchema.parse(body);
    
    const {
      topic,
      keywords = [],
      contentLength,
      adDensity,
      adPositions,
      customAdTemplate,
      includeStructuredData,
      seoOptimization
    } = validatedData;
    
    // 1. 記事コンテンツの生成
    const generatedContent = await generateArticleContent(topic, keywords, contentLength);
    
    // 2. 広告の挿入
    const { html: htmlWithAds, adStats } = insertAdsIntoContent(
      generatedContent,
      adPositions,
      adDensity,
      customAdTemplate
    );
    
    // 3. SEOメタデータの生成
    const seoMetadata = generateSeoMetadata(generatedContent, topic, keywords);
    
    // 4. コンテンツ分析
    const contentAnalysis = analyzeContent(generatedContent, keywords);
    
    // 5. 完全なHTMLの構築
    let fullHtml = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${seoMetadata.title}</title>
  <meta name="description" content="${seoMetadata.description}">
  <meta name="keywords" content="${keywords.join(', ')}">
  <link rel="canonical" href="${process.env.NEXT_PUBLIC_APP_URL || 'https://example.com'}">
  <meta property="og:title" content="${seoMetadata.title}">
  <meta property="og:description" content="${seoMetadata.description}">
  <meta property="og:type" content="article">
  <meta name="twitter:card" content="summary_large_image">
  ${includeStructuredData ? `<script type="application/ld+json">${JSON.stringify(seoMetadata.structuredData, null, 2)}</script>` : ''}
</head>
<body>
  ${htmlWithAds}
</body>
</html>`;
    
    const result: AdInsertionResult = {
      success: true,
      data: {
        generatedContent,
        htmlWithAds: fullHtml,
        adStatistics: adStats,
        seoMetrics: {
          titleOptimized: true,
          metaDescriptionGenerated: true,
          structuredDataAdded: includeStructuredData,
          imageAltsGenerated: 0 // 画像が生成されていないため0
        },
        contentAnalysis
      }
    };
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('広告付き記事生成エラー:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: `バリデーションエラー: ${error.errors.map(e => e.message).join(', ')}` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: '広告付き記事生成中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const usage = {
    endpoint: '/api/generate-with-ads',
    method: 'POST',
    description: '広告を自動挿入したSEO最適化記事を生成します',
    parameters: {
      topic: {
        type: 'string',
        required: true,
        description: '記事のトピック'
      },
      keywords: {
        type: 'array',
        required: false,
        description: 'SEOキーワード配列'
      },
      contentLength: {
        type: 'enum',
        options: ['short', 'medium', 'long'],
        default: 'medium',
        description: '記事の長さ'
      },
      adDensity: {
        type: 'enum',
        options: ['low', 'medium', 'high'],
        default: 'medium',
        description: '広告の密度'
      },
      adPositions: {
        type: 'object',
        description: '広告挿入位置の設定'
      },
      customAdTemplate: {
        type: 'string',
        required: false,
        description: 'カスタム広告テンプレート'
      }
    },
    example: {
      topic: '迷惑電話対策の基本',
      keywords: ['迷惑電話', '対策', 'ブロック'],
      contentLength: 'medium',
      adDensity: 'medium',
      adPositions: {
        beforeFirstH2: true,
        betweenH2Sections: true,
        afterContent: true
      }
    }
  };
  
  return NextResponse.json(usage);
}
