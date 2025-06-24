/**
 * Google広告・フレーズ広告管理機能の型定義
 */

// 広告の種類
export type AdType = 'display' | 'text' | 'responsive' | 'video' | 'shopping';

// 広告の配置位置
export type AdPlacement = 
  | 'header' 
  | 'sidebar' 
  | 'footer' 
  | 'in-content' 
  | 'between-paragraphs' 
  | 'before-conclusion'
  | 'after-title'
  | 'floating';

// 広告サイズの標準定義
export interface AdSize {
  width: number;
  height: number;
  name: string;
  description: string;
  category: 'mobile' | 'desktop' | 'responsive';
  isRecommended: boolean;
}

// 標準的な広告サイズ
export const STANDARD_AD_SIZES: AdSize[] = [
  // モバイル向け
  { width: 320, height: 50, name: 'Mobile Banner', description: 'モバイルバナー', category: 'mobile', isRecommended: true },
  { width: 320, height: 100, name: 'Large Mobile Banner', description: 'ラージモバイルバナー', category: 'mobile', isRecommended: true },
  { width: 300, height: 250, name: 'Medium Rectangle (Mobile)', description: 'ミディアムレクタングル（モバイル）', category: 'mobile', isRecommended: true },
  
  // デスクトップ向け
  { width: 728, height: 90, name: 'Leaderboard', description: 'リーダーボード', category: 'desktop', isRecommended: true },
  { width: 300, height: 250, name: 'Medium Rectangle', description: 'ミディアムレクタングル', category: 'desktop', isRecommended: true },
  { width: 336, height: 280, name: 'Large Rectangle', description: 'ラージレクタングル', category: 'desktop', isRecommended: true },
  { width: 160, height: 600, name: 'Wide Skyscraper', description: 'ワイドスカイスクレイパー', category: 'desktop', isRecommended: true },
  { width: 300, height: 600, name: 'Half Page', description: 'ハーフページ', category: 'desktop', isRecommended: false },
  
  // レスポンシブ
  { width: 0, height: 0, name: 'Responsive', description: 'レスポンシブ広告', category: 'responsive', isRecommended: true }
];

// 個別広告の設定
export interface AdConfig {
  /** 広告ID */
  id: string;
  /** 広告名 */
  name: string;
  /** 広告タイプ */
  type: AdType;
  /** 広告コード（AdSenseのコードなど） */
  adCode: string;
  /** 広告サイズ */
  size: AdSize;
  /** 配置位置 */
  placement: AdPlacement;
  /** 表示条件 */
  displayConditions: {
    /** 最小文字数（この文字数未満の記事では表示しない） */
    minWordCount?: number;
    /** デバイス制限 */
    deviceRestriction?: 'mobile' | 'desktop' | 'all';
    /** カテゴリ制限 */
    categoryRestriction?: string[];
    /** 除外キーワード */
    excludeKeywords?: string[];
  };
  /** スタイル設定 */
  style: {
    /** マージン */
    margin?: string;
    /** 中央寄せするか */
    centerAlign?: boolean;
    /** ラベル表示 */
    showLabel?: boolean;
    /** ラベルテキスト */
    labelText?: string;
  };
  /** アクティブ状態 */
  isActive: boolean;
  /** 作成日時 */
  createdAt: string;
  /** 更新日時 */
  updatedAt: string;
}

// 広告テンプレート（よく使う設定のプリセット）
export interface AdTemplate {
  /** テンプレートID */
  id: string;
  /** テンプレート名 */
  name: string;
  /** 説明 */
  description: string;
  /** 推奨用途 */
  recommendedFor: string[];
  /** 広告設定のベース */
  baseConfig: Partial<AdConfig>;
  /** プレビューURL */
  previewUrl?: string;
}

// フレーズ広告の設定
export interface PhraseAdConfig {
  /** フレーズ広告ID */
  id: string;
  /** 対象フレーズ・キーワード */
  targetPhrases: string[];
  /** 広告テキスト */
  adText: string;
  /** リンク先URL */
  destinationUrl: string;
  /** 表示頻度（同じフレーズに対して何回まで表示するか） */
  displayFrequency: number;
  /** スタイル設定 */
  style: {
    /** テキスト色 */
    textColor?: string;
    /** 背景色 */
    backgroundColor?: string;
    /** ボーダー */
    border?: string;
    /** フォントサイズ */
    fontSize?: string;
    /** パディング */
    padding?: string;
  };
  /** 表示位置 */
  position: 'inline' | 'tooltip' | 'sidebar' | 'popup';
  /** アクティブ状態 */
  isActive: boolean;
}

// 広告パフォーマンス
export interface AdPerformance {
  /** 広告ID */
  adId: string;
  /** 期間 */
  period: {
    startDate: string;
    endDate: string;
  };
  /** 表示回数 */
  impressions: number;
  /** クリック数 */
  clicks: number;
  /** CTR（クリック率） */
  ctr: number;
  /** 収益 */
  revenue: number;
  /** eCPM */
  ecpm: number;
  /** デバイス別データ */
  deviceBreakdown: {
    mobile: { impressions: number; clicks: number; revenue: number };
    desktop: { impressions: number; clicks: number; revenue: number };
    tablet: { impressions: number; clicks: number; revenue: number };
  };
}

// 広告自動配置の設定
export interface AutoAdPlacementConfig {
  /** 自動配置を有効にするか */
  enabled: boolean;
  /** 記事の文字数による配置ルール */
  wordCountRules: {
    /** 最小文字数 */
    minWords: number;
    /** 最大文字数 */
    maxWords: number;
    /** この範囲での推奨広告数 */
    recommendedAdCount: number;
    /** 推奨広告タイプ */
    recommendedAdTypes: AdType[];
  }[];
  /** 段落間挿入の設定 */
  paragraphInsertion: {
    /** 有効化 */
    enabled: boolean;
    /** 何段落ごとに挿入するか */
    interval: number;
    /** 最大挿入数 */
    maxInsertions: number;
    /** 除外する段落（見出しの直後など） */
    excludeAfter: string[];
  };
  /** 見出し近辺の配置制御 */
  headingPlacement: {
    /** 見出し前に配置するか */
    beforeHeadings: boolean;
    /** 見出し後に配置するか */
    afterHeadings: boolean;
    /** 対象とする見出しレベル */
    targetHeadingLevels: number[];
  };
}

// 広告コンプライアンス設定
export interface AdComplianceConfig {
  /** 広告とコンテンツの明確な区別 */
  clearLabeling: boolean;
  /** 広告ラベルのテキスト */
  adLabelText: string;
  /** 過度な広告密度の回避 */
  maxAdDensity: number; // 文字数に対する広告の比率
  /** 記事の価値を損なわない配置 */
  preserveContentValue: boolean;
  /** ファーストビューの広告制限 */
  firstViewAdLimit: number;
  /** モバイル向け最適化 */
  mobileOptimization: boolean;
}

// 広告管理の統合設定
export interface AdManagementConfig {
  /** Google AdSense設定 */
  adSense?: {
    publisherId: string;
    autoAds: boolean;
    adBlockRecovery: boolean;
  };
  /** Google Ad Manager設定 */
  adManager?: {
    networkCode: string;
    enableLazyLoading: boolean;
    enableSRA: boolean; // Single Request Architecture
  };
  /** アフィリエイト設定 */
  affiliate?: {
    platforms: string[];
    disclosureText: string;
    trackingEnabled: boolean;
  };
  /** パフォーマンス最適化 */
  performance: {
    lazyLoadAds: boolean;
    preloadAds: boolean;
    adRefresh: {
      enabled: boolean;
      interval: number; // 秒
    };
  };
}

// 記事生成時の広告統合設定
export interface ArticleAdIntegrationConfig {
  /** 記事生成時に広告を自動挿入するか */
  autoInsertAds: boolean;
  /** 使用する広告テンプレート */
  selectedTemplates: string[];
  /** キーワードベースの広告選択 */
  keywordBasedSelection: boolean;
  /** 記事カテゴリ別の広告設定 */
  categorySpecificAds: {
    [category: string]: string[]; // カテゴリ名: 広告IDの配列
  };
  /** フレーズ広告の自動適用 */
  autoPhraseAds: boolean;
  /** A/Bテスト設定 */
  abTesting?: {
    enabled: boolean;
    variants: {
      name: string;
      adConfigs: string[]; // 広告設定IDの配列
      trafficSplit: number; // 0-100の割合
    }[];
  };
}

// リクエスト・レスポンス型

// 広告設定のリクエスト
export interface AdConfigRequest {
  /** 操作タイプ */
  action: 'create' | 'update' | 'delete' | 'list';
  /** 広告設定 */
  adConfig?: AdConfig;
  /** 広告ID（更新・削除時） */
  adId?: string;
  /** フィルター条件（一覧取得時） */
  filters?: {
    type?: AdType;
    placement?: AdPlacement;
    isActive?: boolean;
  };
}

export interface AdConfigResponse {
  success: boolean;
  data?: {
    /** 単一の広告設定 */
    adConfig?: AdConfig;
    /** 広告設定のリスト */
    adConfigs?: AdConfig[];
    /** テンプレートのリスト */
    templates?: AdTemplate[];
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// 広告パフォーマンス取得のリクエスト
export interface AdPerformanceRequest {
  /** 広告ID（指定しない場合は全広告） */
  adIds?: string[];
  /** 期間 */
  dateRange: {
    startDate: string;
    endDate: string;
  };
  /** 集計単位 */
  groupBy?: 'day' | 'week' | 'month';
  /** メトリクス */
  metrics?: string[];
}

export interface AdPerformanceResponse {
  success: boolean;
  data?: {
    /** パフォーマンスデータ */
    performance: AdPerformance[];
    /** サマリー */
    summary: {
      totalImpressions: number;
      totalClicks: number;
      totalRevenue: number;
      averageCTR: number;
      averageECPM: number;
    };
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// 記事への広告挿入リクエスト
export interface ArticleAdInsertionRequest {
  /** 記事コンテンツ */
  articleContent: string;
  /** 記事メタデータ */
  articleMeta: {
    title: string;
    category?: string;
    keywords?: string[];
    wordCount: number;
  };
  /** 使用する広告設定 */
  adConfigIds?: string[];
  /** 自動配置設定 */
  autoPlacement?: AutoAdPlacementConfig;
  /** プレビューモード（実際の広告コードではなくプレースホルダーを挿入） */
  previewMode?: boolean;
}

export interface ArticleAdInsertionResponse {
  success: boolean;
  data?: {
    /** 広告が挿入された記事コンテンツ */
    enhancedContent: string;
    /** 挿入された広告の情報 */
    insertedAds: {
      adId: string;
      placement: AdPlacement;
      position: number; // 文字位置
      estimatedRevenue?: number;
    }[];
    /** 挿入サマリー */
    summary: {
      totalAdsInserted: number;
      estimatedTotalRevenue: number;
      adDensity: number; // 文字数に対する広告の比率
    };
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// A/Bテスト結果
export interface AdABTestResult {
  /** テストID */
  testId: string;
  /** テスト期間 */
  testPeriod: {
    startDate: string;
    endDate: string;
  };
  /** バリアント結果 */
  variants: {
    name: string;
    impressions: number;
    clicks: number;
    revenue: number;
    ctr: number;
    conversionRate: number;
    significance: number; // 統計的有意性
  }[];
  /** 勝者 */
  winner?: string;
  /** 推奨アクション */
  recommendation: string;
}
