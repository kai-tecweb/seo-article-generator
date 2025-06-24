/**
 * GoogleトレンドCSV解析ユーティリティ
 * SEO記事生成システム - CSV取り込み機能
 */

import type {
  GoogleTrendItem,
  GoogleTrendAnalysisResult,
  CsvValidationResult,
  CsvParsingOptions
} from '@/types/google-trends';

/**
 * CSVファイルの内容を解析
 * @param csvContent CSV文字列
 * @param keyword キーワード名
 * @param options 解析オプション
 * @returns 解析結果
 */
export async function parseGoogleTrendsCsv(
  csvContent: string,
  keyword: string,
  options: CsvParsingOptions = {}
): Promise<GoogleTrendAnalysisResult> {
  const {
    delimiter = ',',
    skipHeader = true,
    maxRows = 1000,
    dateFormat = 'YYYY-MM-DD'
  } = options;

  try {
    // CSV行を分割
    const lines = csvContent.trim().split('\n');
    const dataLines = skipHeader ? lines.slice(1) : lines;

    // データ行を制限
    const limitedLines = dataLines.slice(0, maxRows);

    // データを解析
    const trendData: GoogleTrendItem[] = [];

    for (let i = 0; i < limitedLines.length; i++) {
      const line = limitedLines[i].trim();
      if (!line) continue;

      const columns = line.split(delimiter).map(col => col.trim());

      // 必要な列数をチェック
      if (columns.length < 3) {
        console.warn(`行 ${i + 1}: 列数が不足しています (${columns.length}/3)`);
        continue;
      }

      try {
        const week = columns[0].replace(/"/g, ''); // クォートを除去
        const gTrends = parseFloat(columns[1]) || 0;
        const isPartial = columns[2].toLowerCase() === 'true';

        // 日付の妥当性をチェック
        if (!isValidDate(week)) {
          console.warn(`行 ${i + 1}: 無効な日付形式 - ${week}`);
          continue;
        }

        // スコアの範囲をチェック
        if (gTrends < 0 || gTrends > 100) {
          console.warn(`行 ${i + 1}: 無効なスコア - ${gTrends}`);
          continue;
        }

        trendData.push({
          week,
          gTrends,
          isPartial,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error(`行 ${i + 1} の解析エラー:`, error);
        continue;
      }
    }

    if (trendData.length === 0) {
      throw new Error('有効なデータが見つかりませんでした');
    }

    // 統計情報を計算
    const statistics = calculateStatistics(trendData);

    // 期間を計算
    const sortedData = [...trendData].sort((a, b) => a.week.localeCompare(b.week));
    const period = {
      startDate: sortedData[0].week,
      endDate: sortedData[sortedData.length - 1].week
    };

    // SEO推奨事項を生成
    const seoRecommendations = generateSeoRecommendations(statistics, trendData);

    return {
      keyword,
      period,
      trendData: sortedData,
      statistics,
      seoRecommendations
    };
  } catch (error) {
    console.error('CSV解析エラー:', error);
    throw new Error(`CSV解析に失敗しました: ${error instanceof Error ? error.message : 'unknown error'}`);
  }
}

/**
 * CSVファイルのバリデーション
 * @param csvContent CSV文字列
 * @returns バリデーション結果
 */
export function validateGoogleTrendsCsv(csvContent: string): CsvValidationResult {
  const lines = csvContent.trim().split('\n');
  const result: CsvValidationResult = {
    isValid: true,
    totalRows: lines.length,
    validRows: 0,
    headers: [],
    errors: [],
    warnings: []
  };

  try {
    // ヘッダーをチェック
    if (lines.length > 0) {
      const headerLine = lines[0];
      result.headers = headerLine.split(',').map(h => h.trim().replace(/"/g, ''));

      // 必要な列があるかチェック
      const requiredColumns = ['Week', 'gTrends', 'isPartial'];
      const missingColumns = requiredColumns.filter(col =>
        !result.headers.some(header =>
          header.toLowerCase().includes(col.toLowerCase())
        )
      );

      if (missingColumns.length > 0) {
        result.errors.push({
          row: 1,
          column: 'header',
          message: `必要な列が見つかりません: ${missingColumns.join(', ')}`,
          actualValue: result.headers.join(', ')
        });
        result.isValid = false;
      }
    }

    // データ行をチェック
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const columns = line.split(',').map(col => col.trim().replace(/"/g, ''));

      // 列数チェック
      if (columns.length < 3) {
        result.errors.push({
          row: i + 1,
          column: 'all',
          message: `列数が不足しています (${columns.length}/3)`,
          actualValue: line
        });
        continue;
      }

      const [week, gTrendsStr, isPartialStr] = columns;

      // 日付チェック
      if (!isValidDate(week)) {
        result.errors.push({
          row: i + 1,
          column: 'Week',
          message: '無効な日付形式です',
          actualValue: week
        });
      }

      // スコアチェック
      const gTrends = parseFloat(gTrendsStr);
      if (isNaN(gTrends) || gTrends < 0 || gTrends > 100) {
        result.errors.push({
          row: i + 1,
          column: 'gTrends',
          message: '無効なスコア (0-100の範囲で入力してください)',
          actualValue: gTrendsStr
        });
      }

      // ブール値チェック
      if (!['true', 'false'].includes(isPartialStr.toLowerCase())) {
        result.errors.push({
          row: i + 1,
          column: 'isPartial',
          message: '無効なブール値 (true または false を入力してください)',
          actualValue: isPartialStr
        });
      }

      // 部分データの警告
      if (isPartialStr.toLowerCase() === 'true') {
        result.warnings.push({
          row: i + 1,
          message: 'このデータは部分的です。最新のデータが反映されていない可能性があります。'
        });
      }

      if (result.errors.filter(e => e.row === i + 1).length === 0) {
        result.validRows++;
      }
    }

    // 全体的なバリデーション結果
    result.isValid = result.errors.length === 0 && result.validRows > 0;

    return result;
  } catch (error) {
    result.errors.push({
      row: 0,
      column: 'file',
      message: `ファイル解析エラー: ${error instanceof Error ? error.message : 'unknown error'}`,
      actualValue: 'CSV file'
    });
    result.isValid = false;
    return result;
  }
}

/**
 * 統計情報を計算
 * @param data トレンドデータ
 * @returns 統計情報
 */
function calculateStatistics(data: GoogleTrendItem[]) {
  const scores = data.map(item => item.gTrends);
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);
  const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

  // 標準偏差を計算
  const variance = scores.reduce((sum, score) => sum + Math.pow(score - averageScore, 2), 0) / scores.length;
  const standardDeviation = Math.sqrt(variance);

  // トレンド方向を判定
  const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
  const secondHalf = scores.slice(Math.floor(scores.length / 2));
  const firstAvg = firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length;

  let trendDirection: 'up' | 'down' | 'stable';
  const difference = secondAvg - firstAvg;
  if (Math.abs(difference) < averageScore * 0.1) {
    trendDirection = 'stable';
  } else if (difference > 0) {
    trendDirection = 'up';
  } else {
    trendDirection = 'down';
  }

  // 変動率を計算 (標準偏差 / 平均 × 100)
  const volatility = (standardDeviation / averageScore) * 100;

  return {
    maxScore,
    minScore,
    averageScore: Math.round(averageScore * 100) / 100,
    standardDeviation: Math.round(standardDeviation * 100) / 100,
    trendDirection,
    volatility: Math.round(volatility * 100) / 100
  };
}

/**
 * SEO推奨事項を生成
 * @param statistics 統計情報
 * @param data トレンドデータ
 * @returns SEO推奨事項
 */
function generateSeoRecommendations(
  statistics: ReturnType<typeof calculateStatistics>,
  data: GoogleTrendItem[]
) {
  // コンテンツ作成推奨度を計算 (1-10)
  let contentCreationScore = 5; // ベーススコア

  // 平均スコアに基づく調整
  if (statistics.averageScore > 80) contentCreationScore += 3;
  else if (statistics.averageScore > 60) contentCreationScore += 2;
  else if (statistics.averageScore > 40) contentCreationScore += 1;
  else if (statistics.averageScore < 20) contentCreationScore -= 2;

  // トレンド方向に基づく調整
  if (statistics.trendDirection === 'up') contentCreationScore += 2;
  else if (statistics.trendDirection === 'down') contentCreationScore -= 1;

  // 変動率に基づく調整
  if (statistics.volatility > 50) contentCreationScore += 1; // 高い変動は注目度が高い
  else if (statistics.volatility < 10) contentCreationScore -= 1; // 低い変動は安定している

  contentCreationScore = Math.max(1, Math.min(10, contentCreationScore));

  // 最適な投稿タイミング
  const optimalPostingTime = [];
  if (statistics.trendDirection === 'up') {
    optimalPostingTime.push('即座に投稿', 'トレンド上昇中に投稿');
  } else if (statistics.trendDirection === 'stable') {
    optimalPostingTime.push('週末に投稿', '定期的な投稿スケジュール');
  } else {
    optimalPostingTime.push('関連ニュースのタイミングで投稿', '復活の兆候を待つ');
  }

  // 推奨記事タイプ
  const recommendedContentTypes = [];
  if (contentCreationScore >= 8) {
    recommendedContentTypes.push('速報記事', 'ニュース解説', 'トレンド分析');
  } else if (contentCreationScore >= 6) {
    recommendedContentTypes.push('詳細解説記事', 'ハウツー記事', '関連情報まとめ');
  } else {
    recommendedContentTypes.push('関連記事', '基礎情報記事', '長期的なコンテンツ');
  }

  // 競合分析
  let competitorAnalysis = '';
  if (statistics.averageScore > 70) {
    competitorAnalysis = '高い注目度のため競合が多い。独自の視点や詳細な分析で差別化が必要。';
  } else if (statistics.averageScore > 40) {
    competitorAnalysis = '中程度の注目度。質の高いコンテンツで上位表示の機会あり。';
  } else {
    competitorAnalysis = '低い競合度。基礎的な情報でも上位表示の可能性が高い。';
  }

  return {
    contentCreationScore,
    optimalPostingTime,
    recommendedContentTypes,
    competitorAnalysis
  };
}

/**
 * 日付の妥当性をチェック
 * @param dateString 日付文字列
 * @returns 有効な日付かどうか
 */
function isValidDate(dateString: string): boolean {
  // YYYY-MM-DD 形式をチェック
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return false;
  }

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime()) && dateString === date.toISOString().split('T')[0];
}

/**
 * CSVファイルをテキストとして読み込み
 * @param file ファイルオブジェクト
 * @returns CSV文字列
 */
export function readCsvFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('ファイルの読み込みに失敗しました'));
      }
    };

    reader.onerror = () => {
      reject(new Error('ファイルの読み込み中にエラーが発生しました'));
    };

    reader.readAsText(file, 'UTF-8');
  });
}

/**
 * 日付範囲を人間が読みやすい形式でフォーマット
 * @param startDate 開始日
 * @param endDate 終了日
 * @returns フォーマット済み文字列
 */
export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startFormatted = start.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const endFormatted = end.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `${startFormatted} 〜 ${endFormatted}`;
}

/**
 * トレンド方向を日本語で表示
 * @param direction トレンド方向
 * @returns 日本語表示
 */
export function formatTrendDirection(direction: 'up' | 'down' | 'stable'): string {
  switch (direction) {
    case 'up':
      return '上昇傾向';
    case 'down':
      return '下降傾向';
    case 'stable':
      return '安定';
    default:
      return '不明';
  }
}
