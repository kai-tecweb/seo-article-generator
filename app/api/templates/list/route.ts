import { NextRequest, NextResponse } from 'next/server';
import { 
  TemplateSearchParams,
  TemplateSearchResponse,
  TemplateListItem,
  TemplateApiResponse 
} from '@/types/template';

/**
 * テンプレート一覧取得API
 * GET /api/templates/list
 */
export async function GET(request: NextRequest): Promise<NextResponse<TemplateApiResponse<TemplateSearchResponse>>> {
  try {
    const { searchParams } = new URL(request.url);
    
    // クエリパラメータの取得
    const params: TemplateSearchParams = {
      query: searchParams.get('query') || undefined,
      type: searchParams.get('type') as any,
      category: searchParams.get('category') as any,
      tags: searchParams.get('tags')?.split(',').filter(Boolean),
      isActive: searchParams.get('isActive') === 'true' ? true : 
                searchParams.get('isActive') === 'false' ? false : undefined,
      sortBy: (searchParams.get('sortBy') as any) || 'updatedAt',
      sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20')
    };

    // デモデータ（実際の実装では localStorage やデータベースから取得）
    const demoTemplates: TemplateListItem[] = [
      {
        id: 'template_blog_001',
        name: 'ブログ記事テンプレート',
        description: '一般的なブログ記事用のSEO最適化テンプレート',
        type: 'blog-article',
        category: 'general',
        usageCount: 25,
        createdAt: '2024-01-15T09:00:00Z',
        updatedAt: '2024-01-20T14:30:00Z',
        isActive: true,
        tags: ['ブログ', 'SEO', '汎用']
      },
      {
        id: 'template_tutorial_001',
        name: 'チュートリアル記事テンプレート',
        description: 'ステップバイステップのチュートリアル記事用',
        type: 'tutorial',
        category: 'education',
        usageCount: 18,
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-18T16:45:00Z',
        isActive: true,
        tags: ['チュートリアル', '教育', 'ハウツー']
      },
      {
        id: 'template_review_001',
        name: 'レビュー記事テンプレート',
        description: '商品・サービスレビュー記事用',
        type: 'review',
        category: 'business',
        usageCount: 12,
        createdAt: '2024-01-12T11:30:00Z',
        updatedAt: '2024-01-22T13:20:00Z',
        isActive: true,
        tags: ['レビュー', '商品', '評価']
      },
      {
        id: 'template_howto_001',
        name: 'ハウツー記事テンプレート',
        description: '問題解決型のハウツー記事用',
        type: 'how-to',
        category: 'general',
        usageCount: 30,
        createdAt: '2024-01-08T08:15:00Z',
        updatedAt: '2024-01-25T10:00:00Z',
        isActive: true,
        tags: ['ハウツー', '解決', 'FAQ']
      },
      {
        id: 'template_list_001',
        name: 'リスト記事テンプレート',
        description: '「〇選」形式のリスト記事用',
        type: 'listicle',
        category: 'general',
        usageCount: 22,
        createdAt: '2024-01-14T12:00:00Z',
        updatedAt: '2024-01-24T15:30:00Z',
        isActive: true,
        tags: ['リスト', 'ランキング', 'まとめ']
      }
    ];

    // フィルタリング処理
    let filteredTemplates = demoTemplates.filter(template => {
      // クエリ検索
      if (params.query) {
        const query = params.query.toLowerCase();
        const matchesQuery = 
          template.name.toLowerCase().includes(query) ||
          template.description.toLowerCase().includes(query) ||
          template.tags.some(tag => tag.toLowerCase().includes(query));
        if (!matchesQuery) return false;
      }

      // タイプフィルタ
      if (params.type && template.type !== params.type) {
        return false;
      }

      // カテゴリフィルタ
      if (params.category && template.category !== params.category) {
        return false;
      }

      // アクティブ状態フィルタ
      if (params.isActive !== undefined && template.isActive !== params.isActive) {
        return false;
      }

      // タグフィルタ
      if (params.tags && params.tags.length > 0) {
        const hasMatchingTag = params.tags.some(tag => 
          template.tags.some(templateTag => 
            templateTag.toLowerCase().includes(tag.toLowerCase())
          )
        );
        if (!hasMatchingTag) return false;
      }

      return true;
    });

    // ソート処理
    filteredTemplates.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (params.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
          break;
        case 'usageCount':
          aValue = a.usageCount;
          bValue = b.usageCount;
          break;
        default:
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
      }

      if (params.sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    // ページネーション
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 20));
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedTemplates = filteredTemplates.slice(startIndex, endIndex);
    const total = filteredTemplates.length;

    const response: TemplateSearchResponse = {
      templates: paginatedTemplates,
      total,
      page,
      limit,
      hasNext: endIndex < total,
      hasPrev: page > 1
    };

    console.log('テンプレート一覧取得:', {
      query: params.query,
      total: response.total,
      page: response.page,
      returned: paginatedTemplates.length
    });

    return NextResponse.json({
      success: true,
      ...response
    });

  } catch (error) {
    console.error('テンプレート一覧取得エラー:', error);
    
    return NextResponse.json({
      success: false,
      error: 'テンプレート一覧の取得中にエラーが発生しました',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
