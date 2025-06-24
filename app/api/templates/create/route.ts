import { NextRequest, NextResponse } from 'next/server';
import { 
  ArticleTemplate, 
  CreateTemplateRequest,
  TemplateError,
  TemplateApiResponse 
} from '@/types/template';

/**
 * テンプレート作成API
 * POST /api/templates/create
 */
export async function POST(request: NextRequest): Promise<NextResponse<TemplateApiResponse<ArticleTemplate>>> {
  try {
    const body: CreateTemplateRequest = await request.json();

    // バリデーション
    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'テンプレート名は必須です'
      }, { status: 400 });
    }

    if (!body.content || body.content.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'テンプレート内容は必須です'
      }, { status: 400 });
    }

    if (!body.promptTemplate || body.promptTemplate.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'プロンプトテンプレートは必須です'
      }, { status: 400 });
    }

    // テンプレートIDの生成
    const templateId = `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    // テンプレートデータの作成
    const template: ArticleTemplate = {
      id: templateId,
      name: body.name.trim(),
      description: body.description || '',
      type: body.type,
      category: body.category,
      structure: body.structure,
      seoSettings: body.seoSettings,
      variables: body.variables || [],
      content: body.content.trim(),
      promptTemplate: body.promptTemplate.trim(),
      createdAt: now,
      updatedAt: now,
      usageCount: 0,
      isActive: body.isActive !== false, // デフォルトはtrue
      tags: body.tags || []
    };

    // ローカルストレージ保存用のキー
    const storageKey = `template_${templateId}`;
    
    // 実際の保存処理はフロントエンドのlocalStorageで行う
    // ここではレスポンスデータを返すのみ
    console.log('新しいテンプレートを作成:', {
      id: template.id,
      name: template.name,
      type: template.type,
      storageKey
    });

    return NextResponse.json({
      success: true,
      ...template
    });

  } catch (error) {
    console.error('テンプレート作成エラー:', error);
    
    return NextResponse.json({
      success: false,
      error: 'テンプレートの作成中にエラーが発生しました',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
