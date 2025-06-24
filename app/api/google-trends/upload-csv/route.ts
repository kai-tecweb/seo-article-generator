/**
 * GoogleトレンドCSV取り込みAPI
 * POST /api/google-trends/upload-csv
 */

import { NextRequest, NextResponse } from 'next/server';
import type { GoogleTrendsCsvUploadResponse } from '@/types/google-trends';
import { parseGoogleTrendsCsv, validateGoogleTrendsCsv } from '@/utils/google-trends-csv';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 GoogleトレンドCSV取り込みAPI開始');

    // FormDataを取得
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const keyword = formData.get('keyword') as string;

    // 入力値の検証
    if (!file) {
      console.error('❌ ファイルが提供されていません');
      return NextResponse.json<GoogleTrendsCsvUploadResponse>({
        success: false,
        error: 'CSVファイルが提供されていません',
        processedRows: 0,
        errorRows: 0,
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    if (!keyword || keyword.trim().length === 0) {
      console.error('❌ キーワードが提供されていません');
      return NextResponse.json<GoogleTrendsCsvUploadResponse>({
        success: false,
        error: 'キーワードが提供されていません',
        processedRows: 0,
        errorRows: 0,
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    // ファイルタイプの検証
    if (!file.name.toLowerCase().endsWith('.csv')) {
      console.error('❌ 無効なファイル形式:', file.name);
      return NextResponse.json<GoogleTrendsCsvUploadResponse>({
        success: false,
        error: 'CSVファイルのみアップロード可能です',
        processedRows: 0,
        errorRows: 0,
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    // ファイルサイズの検証 (5MB制限)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.error('❌ ファイルサイズが大きすぎます:', file.size);
      return NextResponse.json<GoogleTrendsCsvUploadResponse>({
        success: false,
        error: 'ファイルサイズは5MB以下にしてください',
        processedRows: 0,
        errorRows: 0,
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    console.log('📁 ファイル情報:', {
      name: file.name,
      size: file.size,
      type: file.type,
      keyword: keyword.trim()
    });

    // ファイル内容を読み込み
    const csvContent = await file.text();
    console.log('📄 CSV内容サイズ:', csvContent.length);

    // CSVをバリデーション
    console.log('🔍 CSV バリデーション開始');
    const validationResult = validateGoogleTrendsCsv(csvContent);
    
    if (!validationResult.isValid) {
      console.error('❌ CSV バリデーションエラー:', validationResult.errors);
      return NextResponse.json<GoogleTrendsCsvUploadResponse>({
        success: false,
        error: 'CSVファイルの形式が正しくありません',
        processedRows: 0,
        errorRows: validationResult.totalRows - validationResult.validRows,
        timestamp: new Date().toISOString(),
        validationErrors: validationResult.errors.map(err => ({
          row: err.row,
          message: err.message,
          data: err.actualValue
        }))
      }, { status: 400 });
    }

    console.log('✅ CSV バリデーション成功:', {
      totalRows: validationResult.totalRows,
      validRows: validationResult.validRows,
      warnings: validationResult.warnings.length
    });

    // CSVを解析
    console.log('🔄 CSV 解析開始');
    const analysisResult = await parseGoogleTrendsCsv(csvContent, keyword.trim());
    
    console.log('✅ CSV 解析完了:', {
      keyword: analysisResult.keyword,
      dataPoints: analysisResult.trendData.length,
      period: analysisResult.period,
      averageScore: analysisResult.statistics.averageScore,
      trendDirection: analysisResult.statistics.trendDirection
    });

    // 成功レスポンス
    const response: GoogleTrendsCsvUploadResponse = {
      success: true,
      data: analysisResult,
      processedRows: validationResult.validRows,
      errorRows: validationResult.totalRows - validationResult.validRows,
      timestamp: new Date().toISOString(),
      message: `CSVファイルの取り込みが完了しました。${validationResult.validRows}行のデータを処理しました。`
    };

    console.log('🎉 GoogleトレンドCSV取り込み完了');
    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('💥 GoogleトレンドCSV取り込みエラー:', error);
    
    const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました';
    
    return NextResponse.json<GoogleTrendsCsvUploadResponse>({
      success: false,
      error: `CSV取り込み処理中にエラーが発生しました: ${errorMessage}`,
      processedRows: 0,
      errorRows: 0,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// GETメソッドで使用方法の説明を返す
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/google-trends/upload-csv',
    method: 'POST',
    description: 'GoogleトレンドCSVファイルを取り込んで解析します',
    parameters: {
      file: 'CSVファイル (必須)',
      keyword: 'キーワード名 (必須)'
    },
    csvFormat: {
      headers: ['Week', 'gTrends', 'isPartial'],
      example: [
        'Week,gTrends,isPartial',
        '2025-06-15,85,false',
        '2025-06-08,92,false',
        '2025-06-01,78,true'
      ]
    },
    limitations: {
      maxFileSize: '5MB',
      supportedFormats: ['.csv'],
      maxRows: 1000
    }
  });
}
