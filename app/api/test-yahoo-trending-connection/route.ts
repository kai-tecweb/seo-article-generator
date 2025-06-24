import { NextRequest, NextResponse } from 'next/server';

/**
 * Yahoo!急上昇ワード接続テストAPI
 * 
 * @route GET /api/test-yahoo-trending-connection
 * @description Yahoo!急上昇ワード統合機能の接続テスト
 * @returns テスト結果
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    console.log('🧪 Yahoo!急上昇ワード接続テスト開始');

    const results = {
      timestamp: new Date().toISOString(),
      tests: [] as Array<{
        name: string;
        status: 'success' | 'error';
        message: string;
        details?: any;
        duration?: number;
      }>
    };

    // 1. リアルタイムトレンド取得API テスト
    try {
      const startTime = Date.now();
      const trendingResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/yahoo-trending/realtime`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const trendingData = await trendingResponse.json();
      const duration = Date.now() - startTime;

      if (trendingResponse.ok && trendingData.success) {
        results.tests.push({
          name: 'リアルタイムトレンド取得API',
          status: 'success',
          message: `${trendingData.totalCount}件の急上昇ワードを取得成功`,
          details: {
            totalCount: trendingData.totalCount,
            sampleKeywords: trendingData.data?.slice(0, 3).map((item: any) => item.keyword) || []
          },
          duration
        });
      } else {
        throw new Error(trendingData.error || 'API応答エラー');
      }
    } catch (error) {
      results.tests.push({
        name: 'リアルタイムトレンド取得API',
        status: 'error',
        message: `エラー: ${error instanceof Error ? error.message : '不明なエラー'}`
      });
    }

    // 2. トレンド分析API テスト
    try {
      const startTime = Date.now();
      const analysisResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/yahoo-trending/analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ keyword: 'ChatGPT 活用法' })
      });

      const analysisData = await analysisResponse.json();
      const duration = Date.now() - startTime;

      if (analysisResponse.ok && analysisData.success) {
        results.tests.push({
          name: 'トレンド分析API',
          status: 'success',
          message: `分析スコア: ${analysisData.data?.analysisScore}点`,
          details: {
            keyword: analysisData.data?.keyword,
            analysisScore: analysisData.data?.analysisScore,
            recommendedTitle: analysisData.data?.recommendedTitle,
            seoKeywordsCount: analysisData.data?.seoKeywords?.length
          },
          duration
        });
      } else {
        throw new Error(analysisData.error || 'API応答エラー');
      }
    } catch (error) {
      results.tests.push({
        name: 'トレンド分析API',
        status: 'error',
        message: `エラー: ${error instanceof Error ? error.message : '不明なエラー'}`
      });
    }

    // 3. カテゴリフィルタテスト
    try {
      const startTime = Date.now();
      const categoryResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/yahoo-trending/realtime?category=IT・科学&limit=5`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const categoryData = await categoryResponse.json();
      const duration = Date.now() - startTime;

      if (categoryResponse.ok && categoryData.success) {
        results.tests.push({
          name: 'カテゴリフィルタ機能',
          status: 'success',
          message: `IT・科学カテゴリで${categoryData.totalCount}件取得`,
          details: {
            category: 'IT・科学',
            totalCount: categoryData.totalCount,
            filteredKeywords: categoryData.data?.map((item: any) => ({
              keyword: item.keyword,
              category: item.category
            })) || []
          },
          duration
        });
      } else {
        throw new Error(categoryData.error || 'カテゴリフィルタエラー');
      }
    } catch (error) {
      results.tests.push({
        name: 'カテゴリフィルタ機能',
        status: 'error',
        message: `エラー: ${error instanceof Error ? error.message : '不明なエラー'}`
      });
    }

    // 4. レスポンス時間テスト
    try {
      const responses = [];
      for (let i = 0; i < 3; i++) {
        const startTime = Date.now();
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/yahoo-trending/realtime?limit=10`);
        const duration = Date.now() - startTime;
        responses.push(duration);
      }

      const avgResponseTime = responses.reduce((a, b) => a + b, 0) / responses.length;

      results.tests.push({
        name: 'レスポンス時間測定',
        status: avgResponseTime < 5000 ? 'success' : 'error',
        message: `平均レスポンス時間: ${avgResponseTime.toFixed(0)}ms`,
        details: {
          averageMs: Math.round(avgResponseTime),
          samples: responses,
          threshold: '5000ms'
        }
      });
    } catch (error) {
      results.tests.push({
        name: 'レスポンス時間測定',
        status: 'error',
        message: `エラー: ${error instanceof Error ? error.message : '不明なエラー'}`
      });
    }

    // テスト結果の集計
    const successCount = results.tests.filter(test => test.status === 'success').length;
    const totalTests = results.tests.length;
    const allPassed = successCount === totalTests;

    console.log(`✅ Yahoo!急上昇ワード接続テスト完了: ${successCount}/${totalTests} 成功`);

    return NextResponse.json({
      success: allPassed,
      summary: {
        total: totalTests,
        passed: successCount,
        failed: totalTests - successCount,
        passRate: `${Math.round((successCount / totalTests) * 100)}%`
      },
      results,
      message: allPassed 
        ? 'Yahoo!急上昇ワード統合機能は正常に動作しています' 
        : `${totalTests - successCount}件のテストが失敗しました`,
      recommendations: allPassed ? [
        'Yahoo!急上昇ワード機能の統合が完了しています',
        '記事生成画面でトレンドキーワードを活用できます',
        'リアルタイムデータでSEO効果の高い記事作成が可能です'
      ] : [
        'API接続エラーを確認してください',
        'サーバーの起動状態を確認してください',
        'ネットワーク接続を確認してください'
      ]
    }, {
      status: allPassed ? 200 : 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });

  } catch (error) {
    console.error('❌ Yahoo!急上昇ワード接続テストエラー:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'テスト実行中にエラーが発生しました',
      message: 'Yahoo!急上昇ワード統合機能のテストに失敗しました',
      timestamp: new Date().toISOString()
    }, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  }
}
