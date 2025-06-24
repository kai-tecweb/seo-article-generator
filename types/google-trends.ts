/**
 * Googleトレンド CSV取り込み機能の型定義
 * SEO記事生成システム - Googleトレンド統合機能
 */

/**
 * GoogleトレンドCSVデータ項目
 */
export interface GoogleTrendItem {
  /** 週単位の日付 (例: "2025-06-15") */
  week: string;
  /** Googleトレンドスコア (0-100) */
  gTrends: number;
  /** 部分的なデータかどうか */
  isPartial: boolean;
  /** データ取得時刻 */
  timestamp?: string;
}

/**
 * GoogleトレンドCSV解析結果
 */
export interface GoogleTrendAnalysisResult {
  /** 解析対象キーワード */
  keyword: string;
  /** 解析期間 */
  period: {
    /** 開始日 */
    startDate: string;
    /** 終了日 */
    endDate: string;
  };
  /** トレンドデータ一覧 */
  trendData: GoogleTrendItem[];
  /** 統計情報 */
  statistics: {
    /** 最大スコア */
    maxScore: number;
    /** 最小スコア */
    minScore: number;
    /** 平均スコア */
    averageScore: number;
    /** 標準偏差 */
    standardDeviation: number;
    /** トレンド方向 ('up' | 'down' | 'stable') */
    trendDirection: 'up' | 'down' | 'stable';
    /** 変動率 (%) */
    volatility: number;
  };
  /** SEO推奨事項 */
  seoRecommendations: {
    /** 記事作成推奨度 (1-10) */
    contentCreationScore: number;
    /** 最適な投稿タイミング */
    optimalPostingTime: string[];
    /** 推奨記事タイプ */
    recommendedContentTypes: string[];
    /** 競合分析 */
    competitorAnalysis: string;
  };
}

/**
 * CSV取り込みレスポンス
 */
export interface GoogleTrendsCsvUploadResponse {
  /** 実行成功フラグ */
  success: boolean;
  /** 解析結果 */
  data?: GoogleTrendAnalysisResult;
  /** 処理済み行数 */
  processedRows: number;
  /** エラー行数 */
  errorRows: number;
  /** レスポンス生成時刻 */
  timestamp: string;
  /** 成功メッセージ */
  message?: string;
  /** エラーメッセージ */
  error?: string;
  /** 詳細エラー情報 */
  validationErrors?: Array<{
    /** 行番号 */
    row: number;
    /** エラーメッセージ */
    message: string;
    /** 該当データ */
    data: string;
  }>;
}

/**
 * CSV取り込みフォーム状態
 */
export interface GoogleTrendsCsvFormState {
  /** アップロードファイル */
  file: File | null;
  /** キーワード名 */
  keyword: string;
  /** 解析結果 */
  analysisResult: GoogleTrendAnalysisResult | null;
  /** ローディング状態 */
  isLoading: boolean;
  /** エラーメッセージ */
  error: string | null;
  /** 成功メッセージ */
  successMessage: string | null;
  /** アップロード進行状況 (0-100) */
  uploadProgress: number;
}

/**
 * CSVファイルバリデーション結果
 */
export interface CsvValidationResult {
  /** バリデーション成功フラグ */
  isValid: boolean;
  /** 総行数 */
  totalRows: number;
  /** 有効行数 */
  validRows: number;
  /** ヘッダー情報 */
  headers: string[];
  /** バリデーションエラー一覧 */
  errors: Array<{
    /** 行番号 */
    row: number;
    /** 列名 */
    column: string;
    /** エラーメッセージ */
    message: string;
    /** 実際の値 */
    actualValue: string;
  }>;
  /** 警告一覧 */
  warnings: Array<{
    /** 行番号 */
    row: number;
    /** 警告メッセージ */
    message: string;
  }>;
}

/**
 * Googleトレンド CSV アップローダー Props
 */
export interface GoogleTrendsCsvUploaderProps {
  /** アップロード完了時のコールバック */
  onUploadComplete: (result: GoogleTrendAnalysisResult) => void;
  /** エラー発生時のコールバック */
  onError: (error: string) => void;
  /** カスタムCSSクラス */
  className?: string;
  /** 無効化フラグ */
  disabled?: boolean;
  /** 最大ファイルサイズ (bytes) */
  maxFileSize?: number;
}

/**
 * トレンドチャート Props
 */
export interface TrendChartProps {
  /** トレンドデータ */
  data: GoogleTrendItem[];
  /** キーワード名 */
  keyword: string;
  /** チャートの高さ */
  height?: number;
  /** カスタムCSSクラス */
  className?: string;
  /** 期間表示フラグ */
  showDateRange?: boolean;
}

/**
 * CSV設定オプション
 */
export interface CsvParsingOptions {
  /** 区切り文字 */
  delimiter?: string;
  /** エンコーディング */
  encoding?: string;
  /** ヘッダー行をスキップするか */
  skipHeader?: boolean;
  /** 最大処理行数 */
  maxRows?: number;
  /** 日付フォーマット */
  dateFormat?: string;
}

/**
 * 保存されたトレンドデータ
 */
export interface SavedTrendData {
  /** データID */
  id: string;
  /** キーワード */
  keyword: string;
  /** 解析結果 */
  analysisResult: GoogleTrendAnalysisResult;
  /** 作成日時 */
  createdAt: string;
  /** 更新日時 */
  updatedAt: string;
  /** メモ */
  notes?: string;
  /** タグ */
  tags: string[];
}

/**
 * トレンドデータ管理レスポンス
 */
export interface TrendDataManagementResponse {
  /** 実行成功フラグ */
  success: boolean;
  /** データ一覧 */
  data?: SavedTrendData[];
  /** 総件数 */
  totalCount: number;
  /** ページネーション情報 */
  pagination?: {
    /** 現在のページ */
    currentPage: number;
    /** 総ページ数 */
    totalPages: number;
    /** 1ページあたりの件数 */
    perPage: number;
  };
  /** レスポンス生成時刻 */
  timestamp: string;
  /** エラーメッセージ */
  error?: string;
}
