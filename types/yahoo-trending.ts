/**
 * Yahoo!急上昇ワード関連の型定義
 * SEO記事生成システム - Yahoo!トレンド統合機能
 */

/**
 * Yahoo!急上昇ワード基本情報
 */
export interface YahooTrendingItem {
  /** ランキング順位 (1-20) */
  rank: number;
  /** 急上昇キーワード */
  keyword: string;
  /** 推定検索ボリューム */
  searchVolume: number;
  /** 急上昇率（%） */
  risePercentage: number;
  /** カテゴリ分類 */
  category: 'エンタメ' | 'スポーツ' | 'ニュース' | 'IT・科学' | 'ライフスタイル' | 'その他';
  /** 関連キーワード */
  relatedKeywords: string[];
  /** 急上昇開始時刻 */
  trendStartTime: string;
  /** 推定持続時間 */
  estimatedDuration: string;
  /** トレンドの説明 */
  description: string;
}

/**
 * Yahoo!急上昇ワード取得レスポンス
 */
export interface YahooTrendingResponse {
  /** API実行成功フラグ */
  success: boolean;
  /** 急上昇ワード一覧 */
  data?: YahooTrendingItem[];
  /** レスポンス生成時刻 */
  timestamp: string;
  /** 取得件数 */
  totalCount: number;
  /** 成功メッセージ */
  message?: string;
  /** エラーメッセージ */
  error?: string;
}

/**
 * Yahoo!トレンド分析結果
 */
export interface TrendAnalysisResult {
  /** 分析対象キーワード */
  keyword: string;
  /** 分析スコア (0-100点) */
  analysisScore: number;
  /** 急上昇理由の詳細分析 */
  trendReason: string;
  /** 推奨記事タイトル */
  recommendedTitle: string;
  /** SEO最適化キーワード */
  seoKeywords: string[];
  /** キーワード密度推奨値 */
  keywordDensity: {
    /** メインキーワード密度 (2-3%) */
    primary: number;
    /** 関連キーワード密度 (1-2%) */
    secondary: number;
    /** ロングテールキーワード密度 (0.5-1%) */
    longtail: number;
  };
  /** 競合分析・差別化ポイント */
  competitorInsights: {
    /** 競合記事のギャップ */
    gap: string;
    /** 記事作成機会 */
    opportunity: string;
    /** 差別化ポイント */
    differentiationPoints: string[];
  };
  /** コンテンツ作成提案 */
  contentSuggestions: {
    /** 推奨見出し一覧 */
    headlines: string[];
    /** 記事構成案 */
    outline: string[];
    /** 行動喚起案 */
    callToAction: string[];
  };
  /** 推定トラフィックポテンシャル */
  estimatedTrafficPotential: number;
  /** 競合難易度スコア (1-10) */
  difficultyScore: number;
  /** 関連ニュース */
  relatedNews: Array<{
    /** ニュースタイトル */
    title: string;
    /** ニュースURL */
    url: string;
    /** 公開日時 */
    publishedAt: string;
    /** 情報源 */
    source: string;
  }>;
}

/**
 * Yahoo!トレンド分析レスポンス
 */
export interface TrendAnalysisResponse {
  /** API実行成功フラグ */
  success: boolean;
  /** 分析結果 */
  data?: TrendAnalysisResult;
  /** レスポンス生成時刻 */
  timestamp: string;
  /** 成功メッセージ */
  message?: string;
  /** エラーメッセージ */
  error?: string;
}

/**
 * Yahoo!トレンド統合フォーム状態
 */
export interface YahooTrendingFormState {
  /** 選択されたトレンドキーワード */
  selectedKeyword: string;
  /** トレンド一覧表示フラグ */
  showTrendingList: boolean;
  /** ローディング状態 */
  isLoading: boolean;
  /** エラーメッセージ */
  error: string | null;
  /** 最終更新時刻 */
  lastUpdated: string | null;
}

/**
 * Yahoo!トレンドセレクター Props
 */
export interface YahooTrendingSelectorProps {
  /** 現在の検索キーワード */
  currentKeyword: string;
  /** キーワード変更時のコールバック */
  onKeywordChange: (keyword: string) => void;
  /** カスタムCSSクラス */
  className?: string;
  /** 無効化フラグ */
  disabled?: boolean;
}

/**
 * Yahoo!トレンド分析パネル Props
 */
export interface TrendAnalysisPanelProps {
  /** 分析対象キーワード */
  keyword: string;
  /** 分析結果 */
  analysisData?: TrendAnalysisResult;
  /** ローディング状態 */
  isLoading: boolean;
  /** エラーメッセージ */
  error?: string;
  /** 分析実行コールバック */
  onAnalyze: (keyword: string) => void;
  /** カスタムCSSクラス */
  className?: string;
}

/**
 * Yahoo!トレンド設定オプション
 */
export interface YahooTrendingOptions {
  /** 取得件数制限 (1-20) */
  limit?: number;
  /** カテゴリフィルタ */
  category?: YahooTrendingItem['category'] | null;
  /** キャッシュ有効期間（秒） */
  cacheTimeSeconds?: number;
  /** 自動更新間隔（分） */
  autoRefreshMinutes?: number;
}

/**
 * Yahoo!トレンド統合ステータス
 */
export interface YahooTrendingStatus {
  /** API接続状態 */
  connected: boolean;
  /** 最終取得成功時刻 */
  lastSuccessTime: string | null;
  /** 最終エラー時刻 */
  lastErrorTime: string | null;
  /** エラーメッセージ */
  lastErrorMessage: string | null;
  /** 取得成功回数 */
  successCount: number;
  /** エラー回数 */
  errorCount: number;
}

/**
 * Yahoo!トレンドAPI設定
 */
export interface YahooTrendingConfig {
  /** API基底URL */
  baseUrl: string;
  /** APIキー（必要に応じて） */
  apiKey?: string;
  /** タイムアウト時間（ミリ秒） */
  timeoutMs: number;
  /** リトライ回数 */
  retryCount: number;
  /** User-Agent文字列 */
  userAgent: string;
}
