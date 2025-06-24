// 記事テンプレート機能の型定義

/**
 * テンプレートの種類
 */
export type TemplateType = 
  | 'blog-article'          // ブログ記事
  | 'tutorial'              // チュートリアル記事
  | 'review'                // レビュー記事
  | 'how-to'                // ハウツー記事
  | 'listicle'              // リスト形式記事
  | 'news'                  // ニュース記事
  | 'case-study'            // ケーススタディ
  | 'comparison'            // 比較記事
  | 'product-description'   // 商品説明
  | 'custom';               // カスタムテンプレート

/**
 * テンプレートのカテゴリ
 */
export type TemplateCategory = 
  | 'marketing'             // マーケティング
  | 'technology'            // テクノロジー
  | 'lifestyle'             // ライフスタイル
  | 'business'              // ビジネス
  | 'education'             // 教育
  | 'entertainment'         // エンターテイメント
  | 'health'                // 健康
  | 'finance'               // 金融
  | 'travel'                // 旅行
  | 'food'                  // 食品
  | 'general';              // 一般

/**
 * テンプレートの構造要素
 */
export interface TemplateStructure {
  /** 導入文テンプレート */
  introduction?: string;
  /** 見出しパターン（H2レベル） */
  headingPatterns: string[];
  /** 結論部分テンプレート */
  conclusion?: string;
  /** CTA（Call To Action）テンプレート */
  ctaTemplate?: string;
  /** 広告挿入位置 */
  adPositions: ('after-intro' | 'before-h2' | 'after-h2' | 'before-conclusion' | 'after-conclusion')[];
  /** 推奨画像配置 */
  imagePositions: ('header' | 'after-intro' | 'middle' | 'before-conclusion')[];
}

/**
 * テンプレートのSEO設定
 */
export interface TemplateSeoSettings {
  /** 推奨タイトル長 */
  titleLength: { min: number; max: number };
  /** 推奨メタデスクリプション長 */
  metaDescriptionLength: { min: number; max: number };
  /** 推奨記事長 */
  contentLength: { min: number; max: number };
  /** 推奨キーワード密度（%） */
  keywordDensity: { min: number; max: number };
  /** 推奨見出し数 */
  headingCount: { h2: number; h3: number };
  /** 必須SEO要素 */
  requiredElements: ('title' | 'meta-description' | 'h1' | 'h2' | 'alt-tags' | 'internal-links')[];
}

/**
 * テンプレートの変数設定
 */
export interface TemplateVariable {
  /** 変数名 */
  name: string;
  /** 変数の説明 */
  description: string;
  /** 変数の型 */
  type: 'text' | 'number' | 'boolean' | 'select' | 'multi-select' | 'keyword-list';
  /** デフォルト値 */
  defaultValue?: any;
  /** 必須フラグ */
  required: boolean;
  /** 選択肢（select/multi-select用） */
  options?: string[];
  /** バリデーションルール */
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

/**
 * テンプレートのメインデータ構造
 */
export interface ArticleTemplate {
  /** テンプレートID */
  id: string;
  /** テンプレート名 */
  name: string;
  /** テンプレートの説明 */
  description: string;
  /** テンプレートの種類 */
  type: TemplateType;
  /** テンプレートのカテゴリ */
  category: TemplateCategory;
  /** テンプレートの構造 */
  structure: TemplateStructure;
  /** SEO設定 */
  seoSettings: TemplateSeoSettings;
  /** テンプレート変数 */
  variables: TemplateVariable[];
  /** テンプレート本文（プレースホルダー付き） */
  content: string;
  /** プロンプトテンプレート */
  promptTemplate: string;
  /** 作成日時 */
  createdAt: string;
  /** 更新日時 */
  updatedAt: string;
  /** 作成者 */
  author?: string;
  /** 使用回数 */
  usageCount: number;
  /** アクティブフラグ */
  isActive: boolean;
  /** タグ */
  tags: string[];
}

/**
 * テンプレートリストアイテム（一覧表示用）
 */
export interface TemplateListItem {
  id: string;
  name: string;
  description: string;
  type: TemplateType;
  category: TemplateCategory;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  tags: string[];
}

/**
 * テンプレート作成・編集リクエスト
 */
export interface CreateTemplateRequest {
  name: string;
  description: string;
  type: TemplateType;
  category: TemplateCategory;
  structure: TemplateStructure;
  seoSettings: TemplateSeoSettings;
  variables: TemplateVariable[];
  content: string;
  promptTemplate: string;
  tags: string[];
  isActive: boolean;
}

/**
 * テンプレート更新リクエスト
 */
export interface UpdateTemplateRequest extends Partial<CreateTemplateRequest> {
  id: string;
}

/**
 * テンプレートベース記事生成リクエスト
 */
export interface TemplateBasedGenerationRequest {
  /** 使用するテンプレートID */
  templateId: string;
  /** テンプレート変数の値 */
  variableValues: Record<string, any>;
  /** 追加のカスタム指示 */
  customInstructions?: string;
  /** 画像生成フラグ */
  generateImage?: boolean;
  /** 広告挿入フラグ */
  includeAds?: boolean;
  /** SEO最適化フラグ */
  optimizeForSeo?: boolean;
}

/**
 * テンプレートベース記事生成レスポンス
 */
export interface TemplateBasedGenerationResponse {
  success: boolean;
  templateId: string;
  templateName: string;
  title: string;
  content: string;
  metaDescription: string;
  seoScore: number;
  wordCount: number;
  estimatedReadTime: number;
  imageUrl?: string;
  keywords: string[];
  suggestions: string[];
  structuredData?: any;
  error?: string;
}

/**
 * テンプレート検索・フィルタリング
 */
export interface TemplateSearchParams {
  /** 検索キーワード */
  query?: string;
  /** テンプレートタイプでフィルタ */
  type?: TemplateType;
  /** カテゴリでフィルタ */
  category?: TemplateCategory;
  /** タグでフィルタ */
  tags?: string[];
  /** アクティブ状態でフィルタ */
  isActive?: boolean;
  /** ソート順 */
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'usageCount';
  /** ソート方向 */
  sortOrder?: 'asc' | 'desc';
  /** ページネーション */
  page?: number;
  /** 1ページあたりの件数 */
  limit?: number;
}

/**
 * テンプレート検索レスポンス
 */
export interface TemplateSearchResponse {
  templates: TemplateListItem[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * テンプレートプレビュー
 */
export interface TemplatePreview {
  templateId: string;
  previewContent: string;
  estimatedLength: number;
  seoScore: number;
  suggestions: string[];
}

/**
 * テンプレート統計情報
 */
export interface TemplateStats {
  totalTemplates: number;
  activeTemplates: number;
  templatesByType: Record<TemplateType, number>;
  templatesByCategory: Record<TemplateCategory, number>;
  mostUsedTemplates: TemplateListItem[];
  recentlyCreated: TemplateListItem[];
}

/**
 * エラーレスポンス
 */
export interface TemplateError {
  success: false;
  error: string;
  details?: any;
}

/**
 * API レスポンスの基本型
 */
export type TemplateApiResponse<T> = 
  | (T & { success: true })
  | TemplateError;
