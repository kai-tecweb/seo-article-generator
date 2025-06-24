import { NextRequest, NextResponse } from 'next/server';
import { 
  TemplateBasedGenerationRequest,
  TemplateBasedGenerationResponse,
  ArticleTemplate,
  TemplateApiResponse 
} from '@/types/template';

/**
 * テンプレートベース記事生成API
 * POST /api/templates/generate
 */
export async function POST(request: NextRequest): Promise<NextResponse<TemplateApiResponse<TemplateBasedGenerationResponse>>> {
  try {
    const body: TemplateBasedGenerationRequest = await request.json();

    // バリデーション
    if (!body.templateId) {
      return NextResponse.json({
        success: false,
        error: 'テンプレートIDは必須です'
      }, { status: 400 });
    }

    if (!body.variableValues) {
      return NextResponse.json({
        success: false,
        error: 'テンプレート変数の値は必須です'
      }, { status: 400 });
    }

    // OpenAI APIキーの確認
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return NextResponse.json({
        success: false,
        error: 'OpenAI APIキーが設定されていません'
      }, { status: 500 });
    }

    // デモテンプレートデータ（実際の実装では localStorage やデータベースから取得）
    const demoTemplate: ArticleTemplate = {
      id: body.templateId,
      name: 'ブログ記事テンプレート',
      description: 'SEO最適化されたブログ記事テンプレート',
      type: 'blog-article',
      category: 'general',
      structure: {
        headingPatterns: ['{{topic}}とは？', '{{topic}}のメリット', '{{topic}}の使い方', 'まとめ'],
        adPositions: ['after-intro', 'before-h2'],
        imagePositions: ['header', 'middle']
      },
      seoSettings: {
        titleLength: { min: 25, max: 35 },
        metaDescriptionLength: { min: 120, max: 160 },
        contentLength: { min: 1500, max: 3000 },
        keywordDensity: { min: 1, max: 3 },
        headingCount: { h2: 4, h3: 8 },
        requiredElements: ['title', 'meta-description', 'h1', 'h2', 'alt-tags']
      },
      variables: [
        {
          name: 'topic',
          description: '記事のメイントピック',
          type: 'text',
          required: true
        },
        {
          name: 'targetKeywords',
          description: 'ターゲットキーワード',
          type: 'keyword-list',
          required: true
        }
      ],
      content: `# {{topic}}について詳しく解説

{{topic}}について詳しく解説します。このガイドでは、{{topic}}の基本的な概念から実践的な活用方法まで、分かりやすく説明していきます。

## {{topic}}とは？

{{topic}}は...

## {{topic}}のメリット

{{topic}}を利用することで、以下のようなメリットがあります：

1. メリット1
2. メリット2  
3. メリット3

## {{topic}}の使い方

実際に{{topic}}を使用する方法を説明します。

### 基本的な使い方

手順1...

### 応用的な使い方

手順2...

## まとめ

{{topic}}について解説しました。このガイドを参考に、ぜひ{{topic}}を活用してみてください。`,
      promptTemplate: `以下のテンプレートを使用して、「{{topic}}」についてのSEO最適化された記事を生成してください。

ターゲットキーワード: {{targetKeywords}}

要件：
- 文字数: 1500-3000文字
- SEOフレンドリーな構造
- 読みやすい文章
- 実用的な情報
- 自然なキーワード配置

{{#if customInstructions}}
追加の指示: {{customInstructions}}
{{/if}}

テンプレート構造:
{{content}}`,
      createdAt: '2024-01-15T09:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z',
      usageCount: 25,
      isActive: true,
      tags: []
    };

    // テンプレート変数の置換
    let processedPrompt = demoTemplate.promptTemplate;
    let processedContent = demoTemplate.content;

    // 変数値での置換処理
    Object.entries(body.variableValues).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      const valueStr = Array.isArray(value) ? value.join(', ') : String(value);
      
      processedPrompt = processedPrompt.replace(new RegExp(placeholder, 'g'), valueStr);
      processedContent = processedContent.replace(new RegExp(placeholder, 'g'), valueStr);
    });

    // カスタム指示の処理
    if (body.customInstructions) {
      processedPrompt = processedPrompt.replace('{{customInstructions}}', body.customInstructions);
      processedPrompt = processedPrompt.replace('{{#if customInstructions}}', '');
      processedPrompt = processedPrompt.replace('{{/if}}', '');
    } else {
      // カスタム指示がない場合は該当部分を削除
      processedPrompt = processedPrompt.replace(/{{#if customInstructions}}.*?{{\/if}}/s, '');
    }

    console.log('テンプレートベース記事生成開始:', {
      templateId: body.templateId,
      variables: Object.keys(body.variableValues),
      promptLength: processedPrompt.length
    });

    // OpenAI API呼び出し
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'あなたは経験豊富なSEOライターです。検索エンジンに最適化された、読みやすく価値のある記事を作成してください。HTMLタグを使用して適切に構造化し、自然で魅力的な文章を心がけてください。'
          },
          {
            role: 'user',
            content: processedPrompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.7
      })
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json().catch(() => ({}));
      throw new Error(`OpenAI API Error: ${openaiResponse.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const openaiData = await openaiResponse.json();
    const generatedContent = openaiData.choices[0]?.message?.content || '';

    if (!generatedContent) {
      throw new Error('OpenAI APIからコンテンツが生成されませんでした');
    }

    // タイトルとメタデスクリプションの抽出
    const titleMatch = generatedContent.match(/<h1[^>]*>(.*?)<\/h1>/i) || 
                      generatedContent.match(/^#\s+(.*?)$/m);
    const title = titleMatch ? titleMatch[1].replace(/(<([^>]+)>)/gi, '').trim() : 
                  `${body.variableValues.topic || 'テンプレート記事'}について`;

    // メタデスクリプションの生成
    const firstParagraph = generatedContent
      .replace(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi, '')
      .replace(/<[^>]*>/g, '')
      .trim()
      .split('\n')[0];
    
    const metaDescription = firstParagraph.length > 160 
      ? firstParagraph.substring(0, 157) + '...'
      : firstParagraph;

    // 簡易SEOスコア計算
    const wordCount = generatedContent.replace(/<[^>]*>/g, '').length;
    const hasH1 = /<h1[^>]*>/i.test(generatedContent);
    const hasH2 = /<h2[^>]*>/i.test(generatedContent);
    const h2Count = (generatedContent.match(/<h2[^>]*>/gi) || []).length;
    
    let seoScore = 50;
    if (hasH1) seoScore += 10;
    if (hasH2) seoScore += 10;
    if (h2Count >= 3) seoScore += 10;
    if (wordCount >= 1500) seoScore += 10;
    if (title.length >= 25 && title.length <= 35) seoScore += 10;

    // キーワード抽出
    const keywords = Array.isArray(body.variableValues.targetKeywords) 
      ? body.variableValues.targetKeywords 
      : typeof body.variableValues.targetKeywords === 'string'
        ? body.variableValues.targetKeywords.split(',').map(k => k.trim())
        : [String(body.variableValues.topic || '')];

    // 読了時間計算（1分間に200文字として計算）
    const estimatedReadTime = Math.ceil(wordCount / 200);

    // 画像生成処理
    let imageUrl: string | undefined;
    if (body.generateImage) {
      try {
        const imagePrompt = `${title} - ${body.variableValues.topic} ブログ記事のアイキャッチ画像`;
        const imageResponse = await fetch(`${request.nextUrl.origin}/api/generate-image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: imagePrompt,
            style: 'realistic',
            aspectRatio: '16:9'
          })
        });

        if (imageResponse.ok) {
          const imageResult = await imageResponse.json();
          imageUrl = imageResult.imageUrl;
        }
      } catch (imageError) {
        console.warn('画像生成に失敗:', imageError);
      }
    }

    // 広告挿入処理
    let finalContent = generatedContent;
    if (body.includeAds) {
      // H2タグの前に広告を挿入
      finalContent = finalContent.replace(
        /<h2([^>]*)>/gi,
        '<div class="ad-container" style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; text-align: center; border-radius: 8px;">' +
        '[広告エリア - AdSense コードをここに配置]' +
        '</div>\n<h2$1>'
      );
    }

    // SEO改善提案の生成
    const suggestions: string[] = [];
    if (seoScore < 80) {
      if (!hasH1) suggestions.push('H1タグを追加してください');
      if (h2Count < 3) suggestions.push('H2タグを3つ以上使用することを推奨します');
      if (wordCount < 1500) suggestions.push('記事の文字数を1500文字以上にすることを推奨します');
      if (title.length < 25) suggestions.push('タイトルをもう少し長くしてください（25-35文字推奨）');
      if (title.length > 35) suggestions.push('タイトルをもう少し短くしてください（25-35文字推奨）');
    }

    const response: TemplateBasedGenerationResponse = {
      success: true,
      templateId: body.templateId,
      templateName: demoTemplate.name,
      title,
      content: finalContent,
      metaDescription,
      seoScore,
      wordCount,
      estimatedReadTime,
      imageUrl,
      keywords,
      suggestions
    };

    console.log('テンプレートベース記事生成完了:', {
      templateId: body.templateId,
      title: response.title,
      wordCount: response.wordCount,
      seoScore: response.seoScore
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('テンプレートベース記事生成エラー:', error);
    
    return NextResponse.json({
      success: false,
      templateId: '',
      templateName: '',
      title: '',
      content: '',
      metaDescription: '',
      seoScore: 0,
      wordCount: 0,
      estimatedReadTime: 0,
      keywords: [],
      suggestions: [],
      error: error instanceof Error ? error.message : 'テンプレートベース記事生成中にエラーが発生しました'
    }, { status: 500 });
  }
}
