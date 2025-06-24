// HTML解析記事生成API関連の型定義

export interface HtmlAnalysisRequest {
  htmlContent: string;
  targetTopic?: string;
  seoKeywords?: string[];
  generateAds?: boolean;
  optimizeImages?: boolean;
  optimizeLinks?: boolean;
}

export interface ImageInfo {
  src: string;
  alt: string;
  hasAlt: boolean;
}

export interface LinkInfo {
  href: string;
  text: string;
  isInternal: boolean;
}

export interface OriginalAnalysis {
  title: string;
  description: string;
  headings: string[];
  images: ImageInfo[];
  links: LinkInfo[];
  structuredData: any;
}

export interface OptimizationImprovements {
  metadataUpdated: boolean;
  imagesOptimized: number;
  linksOptimized: number;
  structuredDataAdded: boolean;
  adsInserted: number;
}

export interface SeoReport {
  score: number;
  issues: string[];
  recommendations: string[];
}

export interface HtmlAnalysisResponse {
  success: boolean;
  data?: {
    originalAnalysis: OriginalAnalysis;
    optimizedHtml: string;
    improvements: OptimizationImprovements;
    seoReport: SeoReport;
  };
  error?: string;
}

// 構造化データスキーマ
export interface StructuredData {
  "@context": string;
  "@type": string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  author: {
    "@type": string;
    name: string;
  };
  publisher: {
    "@type": string;
    name: string;
  };
  mainEntityOfPage?: string;
  image?: string[];
}

// HTML最適化オプション
export interface HtmlOptimizationOptions {
  optimizeImages: boolean;
  optimizeLinks: boolean;
  generateAds: boolean;
  addStructuredData: boolean;
  improveMeta: boolean;
}

// SEO評価項目
export interface SeoEvaluationCriteria {
  titleLength: { min: number; max: number; weight: number };
  descriptionLength: { min: number; max: number; weight: number };
  headingCount: { min: number; weight: number };
  imageAltRequired: { weight: number };
  internalLinksOptimization: { weight: number };
}

// 広告挿入設定
export interface AdInsertionConfig {
  insertBeforeH2: boolean;
  insertInParagraphs: boolean;
  insertAfterContent: boolean;
  maxAdsPerPage: number;
  adTemplate: string;
}

// HTML解析結果の詳細情報
export interface DetailedHtmlAnalysis extends OriginalAnalysis {
  wordCount: number;
  readabilityScore: number;
  keywordDensity: Record<string, number>;
  metaTags: Record<string, string>;
  socialMediaTags: Record<string, string>;
  technicalSeo: {
    hasLangAttribute: boolean;
    hasMetaViewport: boolean;
    hasCanonicalUrl: boolean;
    hasRobotsMeta: boolean;
  };
}

// エラー応答型
export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: any;
  timestamp?: string;
}
