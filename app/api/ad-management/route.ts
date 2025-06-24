import { NextRequest, NextResponse } from 'next/server';
import {
  AdConfigRequest,
  AdConfigResponse,
  AdConfig,
  AdTemplate,
  STANDARD_AD_SIZES
} from '@/types/ad-management';

// 広告テンプレートのプリセット
const AD_TEMPLATES: AdTemplate[] = [
  {
    id: 'blog-standard',
    name: 'ブログ標準セット',
    description: 'ブログ記事に最適な広告配置',
    recommendedFor: ['ブログ記事', '情報記事', 'ハウツー記事'],
    baseConfig: {
      type: 'responsive',
      placement: 'in-content',
      style: {
        centerAlign: true,
        showLabel: true,
        labelText: '広告',
        margin: '20px 0'
      },
      displayConditions: {
        minWordCount: 500,
        deviceRestriction: 'all'
      }
    }
  },
  {
    id: 'mobile-optimized',
    name: 'モバイル最適化',
    description: 'モバイルユーザー向けの最適化された広告',
    recommendedFor: ['モバイル向け記事', 'スマホアプリ記事'],
    baseConfig: {
      type: 'display',
      placement: 'between-paragraphs',
      style: {
        centerAlign: true,
        showLabel: true,
        labelText: 'スポンサーリンク',
        margin: '15px 0'
      },
      displayConditions: {
        minWordCount: 300,
        deviceRestriction: 'mobile'
      }
    }
  },
  {
    id: 'high-revenue',
    name: '高収益重視',
    description: '収益最大化を目指した広告配置',
    recommendedFor: ['人気記事', 'トレンド記事', 'レビュー記事'],
    baseConfig: {
      type: 'display',
      placement: 'header',
      style: {
        centerAlign: true,
        showLabel: true,
        labelText: '広告',
        margin: '10px 0'
      },
      displayConditions: {
        minWordCount: 800,
        deviceRestriction: 'all'
      }
    }
  },
  {
    id: 'user-friendly',
    name: 'ユーザビリティ重視',
    description: 'ユーザー体験を重視した控えめな広告',
    recommendedFor: ['技術記事', '専門記事', '教育コンテンツ'],
    baseConfig: {
      type: 'text',
      placement: 'sidebar',
      style: {
        centerAlign: false,
        showLabel: true,
        labelText: '関連リンク',
        margin: '10px 0'
      },
      displayConditions: {
        minWordCount: 1000,
        deviceRestriction: 'desktop'
      }
    }
  }
];

// メモリ内のデータストア（本来はデータベースを使用）
let adConfigs: AdConfig[] = [
  {
    id: 'ad-1',
    name: 'ヘッダー広告',
    type: 'display',
    adCode: '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-xxxxxxxxxx" data-ad-slot="xxxxxxxxx" data-ad-format="auto"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script>',
    size: STANDARD_AD_SIZES.find(s => s.name === 'Leaderboard')!,
    placement: 'header',
    displayConditions: {
      minWordCount: 500,
      deviceRestriction: 'all'
    },
    style: {
      centerAlign: true,
      showLabel: true,
      labelText: '広告',
      margin: '20px 0'
    },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action') || 'list';
    const adId = url.searchParams.get('adId');

    switch (action) {
      case 'list':
        return NextResponse.json({
          success: true,
          data: {
            adConfigs: adConfigs,
            templates: AD_TEMPLATES
          }
        } as AdConfigResponse);

      case 'get':
        if (!adId) {
          return NextResponse.json({
            success: false,
            error: {
              code: 'MISSING_AD_ID',
              message: '広告IDが指定されていません'
            }
          } as AdConfigResponse, { status: 400 });
        }

        const adConfig = adConfigs.find(ad => ad.id === adId);
        if (!adConfig) {
          return NextResponse.json({
            success: false,
            error: {
              code: 'AD_NOT_FOUND',
              message: '指定された広告が見つかりません'
            }
          } as AdConfigResponse, { status: 404 });
        }

        return NextResponse.json({
          success: true,
          data: { adConfig }
        } as AdConfigResponse);

      case 'templates':
        return NextResponse.json({
          success: true,
          data: { templates: AD_TEMPLATES }
        } as AdConfigResponse);

      case 'sizes':
        return NextResponse.json({
          success: true,
          data: { sizes: STANDARD_AD_SIZES }
        } as AdConfigResponse);

      default:
        return NextResponse.json({
          success: false,
          error: {
            code: 'INVALID_ACTION',
            message: '無効なアクションです'
          }
        } as AdConfigResponse, { status: 400 });
    }
  } catch (error) {
    console.error('広告設定取得エラー:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '内部エラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    } as AdConfigResponse, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: AdConfigRequest = await request.json();

    switch (body.action) {
      case 'create':
        if (!body.adConfig) {
          return NextResponse.json({
            success: false,
            error: {
              code: 'MISSING_AD_CONFIG',
              message: '広告設定が指定されていません'
            }
          } as AdConfigResponse, { status: 400 });
        }

        const newAdConfig: AdConfig = {
          ...body.adConfig,
          id: `ad-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        adConfigs.push(newAdConfig);

        return NextResponse.json({
          success: true,
          data: { adConfig: newAdConfig }
        } as AdConfigResponse);

      case 'update':
        if (!body.adId || !body.adConfig) {
          return NextResponse.json({
            success: false,
            error: {
              code: 'MISSING_PARAMETERS',
              message: '広告IDまたは設定が指定されていません'
            }
          } as AdConfigResponse, { status: 400 });
        }

        const existingAdIndex = adConfigs.findIndex(ad => ad.id === body.adId);
        if (existingAdIndex === -1) {
          return NextResponse.json({
            success: false,
            error: {
              code: 'AD_NOT_FOUND',
              message: '指定された広告が見つかりません'
            }
          } as AdConfigResponse, { status: 404 });
        }

        const updatedAdConfig: AdConfig = {
          ...adConfigs[existingAdIndex],
          ...body.adConfig,
          id: body.adId,
          updatedAt: new Date().toISOString()
        };

        adConfigs[existingAdIndex] = updatedAdConfig;

        return NextResponse.json({
          success: true,
          data: { adConfig: updatedAdConfig }
        } as AdConfigResponse);

      case 'delete':
        if (!body.adId) {
          return NextResponse.json({
            success: false,
            error: {
              code: 'MISSING_AD_ID',
              message: '広告IDが指定されていません'
            }
          } as AdConfigResponse, { status: 400 });
        }

        const deleteIndex = adConfigs.findIndex(ad => ad.id === body.adId);
        if (deleteIndex === -1) {
          return NextResponse.json({
            success: false,
            error: {
              code: 'AD_NOT_FOUND',
              message: '指定された広告が見つかりません'
            }
          } as AdConfigResponse, { status: 404 });
        }

        adConfigs.splice(deleteIndex, 1);

        return NextResponse.json({
          success: true,
          data: {}
        } as AdConfigResponse);

      default:
        return NextResponse.json({
          success: false,
          error: {
            code: 'INVALID_ACTION',
            message: '無効なアクションです'
          }
        } as AdConfigResponse, { status: 400 });
    }
  } catch (error) {
    console.error('広告設定操作エラー:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '内部エラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    } as AdConfigResponse, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  // PUTはPOSTのupdateアクションと同様の処理
  const body = await request.json();
  return POST(new NextRequest(request.url, {
    method: 'POST',
    body: JSON.stringify({ ...body, action: 'update' }),
    headers: request.headers
  }));
}

export async function DELETE(request: NextRequest) {
  const url = new URL(request.url);
  const adId = url.searchParams.get('adId');
  
  return POST(new NextRequest(request.url, {
    method: 'POST',
    body: JSON.stringify({ action: 'delete', adId }),
    headers: request.headers
  }));
}
