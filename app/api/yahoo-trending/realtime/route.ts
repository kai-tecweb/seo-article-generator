import { NextRequest, NextResponse } from 'next/server';

/**
 * Yahoo!急上昇ワード型定義
 */
interface YahooTrendingItem {
  rank: number;
  keyword: string;
  searchVolume: number;
  risePercentage: number;
  category: 'エンタメ' | 'スポーツ' | 'ニュース' | 'IT・科学' | 'ライフスタイル' | 'その他';
  relatedKeywords: string[];
  trendStartTime: string;
  estimatedDuration: string;
  description: string;
}

interface YahooTrendingResponse {
  success: boolean;
  data?: YahooTrendingItem[];
  timestamp: string;
  totalCount: number;
  message?: string;
  error?: string;
}

/**
 * Yahoo!急上昇ワード データ（実際のAPIが利用できない場合のモックデータ）
 * 実運用時は Yahoo! Search API や Yahoo! JAPAN Web API を使用
 */
const generateMockTrendingData = (): YahooTrendingItem[] => {
  const currentTime = new Date().toISOString();
  
  const trendingKeywords = [
    { keyword: 'ChatGPT 活用法', category: 'IT・科学' as const, description: 'AI技術の最新活用方法が話題', volume: 50000 },
    { keyword: '冬のボーナス 2024', category: 'ライフスタイル' as const, description: '年末ボーナスの支給時期が注目', volume: 45000 },
    { keyword: 'ワールドカップ 日本代表', category: 'スポーツ' as const, description: '日本代表の快進撃に注目が集まる', volume: 40000 },
    { keyword: '仮想通貨 税金対策', category: 'ライフスタイル' as const, description: '年末調整での暗号資産申告方法', volume: 38000 },
    { keyword: 'Netflix 新作アニメ', category: 'エンタメ' as const, description: '話題の新作アニメシリーズが配信開始', volume: 35000 },
    { keyword: 'iPhone 15 Pro レビュー', category: 'IT・科学' as const, description: '最新iPhoneの詳細レビューが話題', volume: 32000 },
    { keyword: '節約 家計術', category: 'ライフスタイル' as const, description: '物価高騰対策の家計管理方法', volume: 30000 },
    { keyword: '大谷翔平 年俸', category: 'スポーツ' as const, description: 'メジャーリーグでの契約金額が注目', volume: 28000 },
    { keyword: 'クリスマスプレゼント 2024', category: 'ライフスタイル' as const, description: '今年のクリスマスギフトトレンド', volume: 25000 },
    { keyword: '副業 在宅ワーク', category: 'ライフスタイル' as const, description: 'テレワーク環境での副業方法', volume: 22000 },
    { keyword: 'Python 機械学習', category: 'IT・科学' as const, description: 'プログラミング学習の需要急増', volume: 20000 },
    { keyword: 'ふるさと納税 締切', category: 'ライフスタイル' as const, description: '年末のふるさと納税申込期限', volume: 18000 },
    { keyword: '健康管理アプリ', category: 'ライフスタイル' as const, description: '健康意識の高まりでアプリ利用増', volume: 16000 },
    { keyword: 'PS5 新作ゲーム', category: 'エンタメ' as const, description: '年末商戦の注目ゲームタイトル', volume: 15000 },
    { keyword: '確定申告 準備', category: 'ライフスタイル' as const, description: '来年の確定申告に向けた準備', volume: 14000 },
    { keyword: '投資信託 おすすめ', category: 'ライフスタイル' as const, description: '資産運用への関心高まる', volume: 13000 },
    { keyword: 'サステナブル ファッション', category: 'ライフスタイル' as const, description: '環境配慮型ファッションの注目', volume: 12000 },
    { keyword: 'リモートワーク 効率化', category: 'IT・科学' as const, description: '在宅勤務の生産性向上方法', volume: 11000 },
    { keyword: 'AI 画像生成', category: 'IT・科学' as const, description: '生成AIツールの活用方法が話題', volume: 10000 },
    { keyword: '年末年始 旅行', category: 'ライフスタイル' as const, description: '年末年始の国内旅行需要増加', volume: 9500 }
  ];

  return trendingKeywords.map((item, index) => ({
    rank: index + 1,
    keyword: item.keyword,
    searchVolume: item.volume,
    risePercentage: Math.floor(Math.random() * 500) + 100, // 100-600%の急上昇率
    category: item.category,
    relatedKeywords: generateRelatedKeywords(item.keyword),
    trendStartTime: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    estimatedDuration: '2-4時間',
    description: item.description
  }));
};

/**
 * 関連キーワード生成（実際のAPIでは検索APIから取得）
 */
const generateRelatedKeywords = (keyword: string): string[] => {
  const baseKeywords = keyword.split(' ');
  return [
    `${keyword} とは`,
    `${keyword} 方法`,
    `${keyword} おすすめ`,
    `${baseKeywords[0]} 比較`,
    `${keyword} 2024`
  ].slice(0, 3);
};

/**
 * Yahoo!急上昇ワード リアルタイム取得API
 * 
 * @route GET /api/yahoo-trending/realtime
 * @description Yahoo!急上昇ワード1〜20位をリアルタイムで取得
 * @returns {YahooTrendingResponse} 急上昇ワード一覧
 */
export async function GET(request: NextRequest): Promise<NextResponse<YahooTrendingResponse>> {
  try {
    console.log('📊 Yahoo!急上昇ワード取得API - 実行開始');

    // URLパラメータを取得
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const category = searchParams.get('category') || null;

    // 実際の実装では Yahoo! Search API または スクレイピング技術を使用
    // ここではモックデータを使用
    const trendingData = generateMockTrendingData();

    // カテゴリフィルタリング
    let filteredData = trendingData;
    if (category) {
      filteredData = trendingData.filter(item => item.category === category);
    }

    // 件数制限
    const limitedData = filteredData.slice(0, limit);

    const response: YahooTrendingResponse = {
      success: true,
      data: limitedData,
      timestamp: new Date().toISOString(),
      totalCount: limitedData.length,
      message: `Yahoo!急上昇ワード ${limitedData.length}件を取得しました`
    };

    console.log(`✅ Yahoo!急上昇ワード取得成功: ${limitedData.length}件`);

    // 5分間のキャッシュヘッダーを設定
    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
        'Content-Type': 'application/json; charset=utf-8'
      }
    });

  } catch (error) {
    console.error('❌ Yahoo!急上昇ワード取得エラー:', error);

    const errorResponse: YahooTrendingResponse = {
      success: false,
      data: [],
      timestamp: new Date().toISOString(),
      totalCount: 0,
      error: error instanceof Error ? error.message : 'Yahoo!急上昇ワードの取得に失敗しました',
      message: 'API実行中にエラーが発生しました'
    };

    return NextResponse.json(errorResponse, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  }
}

/**
 * API使用例とレスポンス形式
 * 
 * GET /api/yahoo-trending/realtime
 * GET /api/yahoo-trending/realtime?limit=10
 * GET /api/yahoo-trending/realtime?category=IT・科学
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "rank": 1,
 *       "keyword": "ChatGPT 活用法",
 *       "searchVolume": 50000,
 *       "risePercentage": 350,
 *       "category": "IT・科学",
 *       "relatedKeywords": ["ChatGPT 活用法 とは", "ChatGPT 活用法 方法", "ChatGPT 活用法 おすすめ"],
 *       "trendStartTime": "2024-01-15T10:30:00.000Z",
 *       "estimatedDuration": "2-4時間",
 *       "description": "AI技術の最新活用方法が話題"
 *     }
 *   ],
 *   "timestamp": "2024-01-15T12:00:00.000Z",
 *   "totalCount": 20,
 *   "message": "Yahoo!急上昇ワード 20件を取得しました"
 * }
 */
