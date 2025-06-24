import { NextRequest, NextResponse } from 'next/server';
import { 
  ArticleTemplate,
  TemplateApiResponse 
} from '@/types/template';

/**
 * テンプレート詳細取得API
 * GET /api/templates/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<TemplateApiResponse<ArticleTemplate>>> {
  try {
    const templateId = params.id;

    if (!templateId) {
      return NextResponse.json({
        success: false,
        error: 'テンプレートIDが指定されていません'
      }, { status: 400 });
    }

    // デモテンプレートデータ（実際の実装では localStorage やデータベースから取得）
    const demoTemplates: Record<string, ArticleTemplate> = {
      'template_blog_001': {
        id: 'template_blog_001',
        name: 'ブログ記事テンプレート',
        description: '一般的なブログ記事用のSEO最適化テンプレート。幅広いトピックに対応可能な汎用性の高いテンプレートです。',
        type: 'blog-article',
        category: 'general',
        structure: {
          introduction: '{{topic}}について詳しく解説します。この記事では、{{topic}}の基本的な概念から実践的な活用方法まで、分かりやすく説明していきます。',
          headingPatterns: [
            '{{topic}}とは？基本的な概念を理解しよう',
            '{{topic}}のメリット・デメリット',
            '{{topic}}の具体的な使い方・手順',
            '{{topic}}を成功させるためのコツ',
            'まとめ：{{topic}}を効果的に活用しよう'
          ],
          conclusion: '{{topic}}について詳しく解説しました。このガイドを参考に、ぜひ{{topic}}を効果的に活用してみてください。',
          ctaTemplate: '{{topic}}についてもっと詳しく知りたい方は、関連記事もぜひチェックしてみてください。',
          adPositions: ['after-intro', 'before-h2', 'before-conclusion'],
          imagePositions: ['header', 'middle', 'before-conclusion']
        },
        seoSettings: {
          titleLength: { min: 25, max: 35 },
          metaDescriptionLength: { min: 120, max: 160 },
          contentLength: { min: 1500, max: 3000 },
          keywordDensity: { min: 1, max: 3 },
          headingCount: { h2: 4, h3: 8 },
          requiredElements: ['title', 'meta-description', 'h1', 'h2', 'alt-tags', 'internal-links']
        },
        variables: [
          {
            name: 'topic',
            description: '記事のメイントピック',
            type: 'text',
            required: true,
            validation: {
              minLength: 2,
              maxLength: 50
            }
          },
          {
            name: 'targetKeywords',
            description: 'ターゲットキーワード（カンマ区切り）',
            type: 'keyword-list',
            required: true,
            validation: {
              minLength: 1
            }
          },
          {
            name: 'targetAudience',
            description: 'ターゲット読者層',
            type: 'select',
            required: false,
            options: ['初心者', '中級者', '上級者', '専門家', '一般読者'],
            defaultValue: '一般読者'
          },
          {
            name: 'articleTone',
            description: '記事のトーン',
            type: 'select',
            required: false,
            options: ['丁寧', 'カジュアル', '専門的', '親しみやすい'],
            defaultValue: '丁寧'
          }
        ],
        content: `# {{topic}}について詳しく解説

{{#introduction}}

## {{topic}}とは？基本的な概念を理解しよう

{{topic}}は...（詳細な説明をここに記載）

### {{topic}}の定義

{{topic}}を正しく理解するために、まずは基本的な定義から説明します。

### {{topic}}が注目される理由

近年、{{topic}}が注目される理由は以下の通りです：

## {{topic}}のメリット・デメリット

{{topic}}を活用することで得られるメリットと、注意すべきデメリットについて詳しく見ていきましょう。

### {{topic}}のメリット

1. **メリット1**: 効率性の向上
2. **メリット2**: コスト削減
3. **メリット3**: 品質向上

### {{topic}}のデメリット

一方で、以下のようなデメリットも存在します：

1. **デメリット1**: 初期コスト
2. **デメリット2**: 学習コスト
3. **デメリット3**: リスク要因

## {{topic}}の具体的な使い方・手順

実際に{{topic}}を使用する際の具体的な手順について説明します。

### 基本的な使い方

#### ステップ1: 準備

まずは必要な準備を行います。

#### ステップ2: 実行

準備が整ったら、実際に実行していきます。

#### ステップ3: 評価・改善

結果を評価し、必要に応じて改善を行います。

### 応用的な活用方法

基本的な使い方をマスターしたら、より応用的な活用方法にチャレンジしてみましょう。

## {{topic}}を成功させるためのコツ

{{topic}}を効果的に活用するためのコツやベストプラクティスをご紹介します。

### コツ1: 計画性を持つ

事前にしっかりと計画を立てることが重要です。

### コツ2: 継続的な学習

常に最新の情報をキャッチアップし、スキルを向上させましょう。

### コツ3: 実践と改善

理論だけでなく、実際に実践し、改善を繰り返すことが大切です。

## まとめ：{{topic}}を効果的に活用しよう

{{#conclusion}}

{{#ctaTemplate}}`,
        promptTemplate: `以下のテンプレートを使用して、「{{topic}}」についてのSEO最適化された記事を生成してください。

# 記事生成指示

## 基本情報
- メイントピック: {{topic}}
- ターゲットキーワード: {{targetKeywords}}
{{#if targetAudience}}
- ターゲット読者: {{targetAudience}}
{{/if}}
{{#if articleTone}}
- 記事のトーン: {{articleTone}}
{{/if}}

## SEO要件
- 文字数: 1500-3000文字
- H1タグ: 1つ（記事タイトル）
- H2タグ: 4-6つ
- H3タグ: 8-12つ
- キーワード密度: 1-3%
- メタデスクリプション: 120-160文字

## 記事構成
以下の構成に従って記事を作成してください：

{{content}}

## 追加指示
- 自然で読みやすい文章を心がけてください
- SEOキーワードを自然に配置してください
- 具体例や実用的な情報を含めてください
- 読者にとって価値のある内容にしてください

{{#if customInstructions}}
## カスタム指示
{{customInstructions}}
{{/if}}

HTMLタグを使用して適切に構造化し、見出しやリストなどを適切に配置してください。`,
        createdAt: '2024-01-15T09:00:00Z',
        updatedAt: '2024-01-20T14:30:00Z',
        usageCount: 25,
        isActive: true,
        tags: ['ブログ', 'SEO', '汎用', '記事作成']
      },
      'template_tutorial_001': {
        id: 'template_tutorial_001',
        name: 'チュートリアル記事テンプレート',
        description: 'ステップバイステップのチュートリアル記事用テンプレート。初心者にも分かりやすい構成になっています。',
        type: 'tutorial',
        category: 'education',
        structure: {
          introduction: '今回は{{topic}}について、初心者の方にも分かりやすく解説していきます。',
          headingPatterns: [
            '{{topic}}とは？',
            '必要な準備・事前知識',
            'ステップ1: {{step1}}',
            'ステップ2: {{step2}}',
            'ステップ3: {{step3}}',
            'よくある質問・トラブルシューティング',
            'まとめ・次のステップ'
          ],
          conclusion: '{{topic}}の基本的な手順について解説しました。',
          adPositions: ['after-intro', 'after-h2'],
          imagePositions: ['header', 'after-each-step']
        },
        seoSettings: {
          titleLength: { min: 25, max: 40 },
          metaDescriptionLength: { min: 120, max: 160 },
          contentLength: { min: 2000, max: 4000 },
          keywordDensity: { min: 1.5, max: 3 },
          headingCount: { h2: 6, h3: 12 },
          requiredElements: ['title', 'meta-description', 'h1', 'h2', 'h3', 'alt-tags']
        },
        variables: [
          {
            name: 'topic',
            description: 'チュートリアルのトピック',
            type: 'text',
            required: true
          },
          {
            name: 'targetKeywords',
            description: 'ターゲットキーワード',
            type: 'keyword-list',
            required: true
          },
          {
            name: 'step1',
            description: 'ステップ1の内容',
            type: 'text',
            required: true
          },
          {
            name: 'step2',
            description: 'ステップ2の内容',
            type: 'text',
            required: true
          },
          {
            name: 'step3',
            description: 'ステップ3の内容',
            type: 'text',
            required: true
          }
        ],
        content: `# {{topic}}の完全ガイド

{{topic}}について、初心者の方にも分かりやすく解説していきます。

## {{topic}}とは？

## 必要な準備・事前知識

## ステップ1: {{step1}}

## ステップ2: {{step2}}

## ステップ3: {{step3}}

## よくある質問・トラブルシューティング

## まとめ・次のステップ`,
        promptTemplate: `「{{topic}}」のチュートリアル記事を作成してください。

ターゲットキーワード: {{targetKeywords}}
ステップ1: {{step1}}
ステップ2: {{step2}}  
ステップ3: {{step3}}`,
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-18T16:45:00Z',
        usageCount: 18,
        isActive: true,
        tags: ['チュートリアル', '教育', 'ハウツー', 'ステップバイステップ']
      }
    };

    const template = demoTemplates[templateId];

    if (!template) {
      return NextResponse.json({
        success: false,
        error: 'テンプレートが見つかりません'
      }, { status: 404 });
    }

    console.log('テンプレート詳細取得:', {
      templateId,
      name: template.name,
      type: template.type
    });

    return NextResponse.json({
      success: true,
      ...template
    });

  } catch (error) {
    console.error('テンプレート詳細取得エラー:', error);
    
    return NextResponse.json({
      success: false,
      error: 'テンプレート詳細の取得中にエラーが発生しました',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
