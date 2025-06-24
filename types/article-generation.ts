// 記事生成関連の型定義

export interface ArticleGenerationRequest {
  topic: string;
  targetKeywords: string[];
  contentLength: 'short' | 'medium' | 'long';
  tone: 'professional' | 'casual' | 'educational';
  includeAds: boolean;
  generateImage: boolean;
  optimizeForSeo: boolean;
  targetAudience?: string;
  customInstructions?: string;
}

export interface ArticleGenerationResponse {
  success: boolean;
  title: string;
  content: string;
  metaDescription: string;
  seoScore: number;
  keywords: string[];
  estimatedReadTime: number;
  wordCount: number;
  imageUrl?: string;
  suggestions: string[];
  structuredData?: any;
  error?: string;
}

export interface ScheduledPost {
  id: string;
  title: string;
  content: string;
  scheduledDate: string;
  status: 'pending' | 'published' | 'failed';
  platforms: string[];
  createdAt: string;
}

export interface ImageGenerationOptions {
  style: 'realistic' | 'illustration' | 'minimal' | 'abstract';
  aspectRatio: '16:9' | '1:1' | '4:3';
  includeText: boolean;
  textContent?: string;
}

export interface SEOAnalysis {
  score: number;
  titleScore: number;
  metaDescriptionScore: number;
  keywordDensity: number;
  readabilityScore: number;
  improvements: string[];
}

export interface NotionSaveRequest {
  title: string;
  content: string;
  metaDescription: string;
  seoScore: number;
  keywords: string[];
  scheduledDate?: string;
}

export interface WordPresPostRequest {
  title: string;
  content: string;
  excerpt: string;
  scheduledDate: string;
  categories?: string[];
  tags?: string[];
  featuredImageUrl?: string;
}
