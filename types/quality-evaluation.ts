/**
 * 記事品質評価機能の型定義
 */

// 品質評価の総合結果
export interface QualityEvaluationResult {
  /** 総合スコア (0-100) */
  overallScore: number;
  /** 品質カテゴリ */
  category: 'poor' | 'fair' | 'good' | 'excellent';
  /** 各項目の評価結果 */
  evaluations: {
    seo: SeoEvaluation;
    readability: ReadabilityEvaluation;
    content: ContentEvaluation;
    technical: TechnicalEvaluation;
  };
  /** 改善提案 */
  recommendations: QualityRecommendation[];
  /** 評価サマリー */
  summary: {
    strengths: string[];
    weaknesses: string[];
    priorityImprovements: string[];
  };
}

// SEO評価
export interface SeoEvaluation {
  /** SEOスコア (0-100) */
  score: number;
  /** メタデータ評価 */
  metadata: {
    title: MetadataEvaluation;
    description: MetadataEvaluation;
    keywords: MetadataEvaluation;
  };
  /** コンテンツSEO */
  content: {
    headingStructure: HeadingEvaluation;
    keywordOptimization: KeywordEvaluation;
    internalLinks: LinkEvaluation;
    imageOptimization: ImageEvaluation;
  };
  /** 技術的SEO */
  technical: {
    structuredData: boolean;
    canonicalUrl: boolean;
    metaViewport: boolean;
    ogTags: boolean;
    twitterCards: boolean;
  };
}

// 読みやすさ評価
export interface ReadabilityEvaluation {
  /** 読みやすさスコア (0-100) */
  score: number;
  /** 文章の統計 */
  statistics: {
    wordCount: number;
    sentenceCount: number;
    paragraphCount: number;
    averageWordsPerSentence: number;
    averageSentencesPerParagraph: number;
  };
  /** 文章の複雑さ */
  complexity: {
    difficultWords: number;
    longSentences: number;
    passiveVoice: number;
  };
  /** 読み手への配慮 */
  userFriendliness: {
    hasIntroduction: boolean;
    hasConclusion: boolean;
    hasBulletPoints: boolean;
    hasNumberedLists: boolean;
  };
}

// コンテンツ評価
export interface ContentEvaluation {
  /** コンテンツスコア (0-100) */
  score: number;
  /** 内容の深さ */
  depth: {
    topicCoverage: number; // トピックカバレッジ (0-100)
    detailLevel: number;   // 詳細度 (0-100)
    expertise: number;     // 専門性 (0-100)
  };
  /** 構造の質 */
  structure: {
    logicalFlow: number;   // 論理的な流れ (0-100)
    introduction: number;  // 導入の質 (0-100)
    conclusion: number;    // 結論の質 (0-100)
  };
  /** 独自性 */
  uniqueness: {
    originalityScore: number; // 独自性スコア (0-100)
    duplicateContent: boolean; // 重複コンテンツの可能性
  };
}

// 技術的評価
export interface TechnicalEvaluation {
  /** 技術スコア (0-100) */
  score: number;
  /** HTML品質 */
  htmlQuality: {
    validMarkup: boolean;
    semanticStructure: boolean;
    accessibilityCompliance: boolean;
  };
  /** パフォーマンス */
  performance: {
    imageOptimization: boolean;
    loadingOptimization: boolean;
    cacheability: boolean;
  };
  /** モバイル対応 */
  mobileOptimization: {
    responsive: boolean;
    touchFriendly: boolean;
    fastLoading: boolean;
  };
}

// 個別項目の評価
export interface MetadataEvaluation {
  value: string | null;
  score: number;
  length: number;
  isOptimal: boolean;
  issues: string[];
  suggestions: string[];
}

export interface HeadingEvaluation {
  structure: Array<{
    level: number;
    text: string;
    hasKeyword: boolean;
    length: number;
  }>;
  score: number;
  hasH1: boolean;
  hasLogicalHierarchy: boolean;
  keywordOptimization: number;
}

export interface KeywordEvaluation {
  primaryKeyword: {
    keyword: string;
    density: number;
    placement: {
      inTitle: boolean;
      inDescription: boolean;
      inH1: boolean;
      inFirstParagraph: boolean;
    };
  };
  secondaryKeywords: Array<{
    keyword: string;
    density: number;
    naturalIntegration: boolean;
  }>;
  overallOptimization: number;
  keywordStuffing: boolean;
}

export interface LinkEvaluation {
  internal: {
    count: number;
    score: number;
    naturalPlacement: boolean;
    relevantAnchors: boolean;
  };
  external: {
    count: number;
    authority: number;
    relevance: number;
  };
}

export interface ImageEvaluation {
  count: number;
  withAlt: number;
  optimizedAlt: number;
  fileSize: number;
  format: string[];
  lazyLoading: boolean;
  score: number;
}

// 改善提案
export interface QualityRecommendation {
  /** 改善項目のカテゴリ */
  category: 'seo' | 'readability' | 'content' | 'technical';
  /** 優先度 */
  priority: 'high' | 'medium' | 'low';
  /** 改善項目名 */
  title: string;
  /** 現在の状況 */
  currentState: string;
  /** 推奨される改善内容 */
  recommendation: string;
  /** 期待される効果 */
  expectedImpact: string;
  /** 実装の難易度 */
  difficulty: 'easy' | 'medium' | 'hard';
  /** 推定改善時間 */
  estimatedTime: string;
}

// 品質評価設定
export interface QualityEvaluationConfig {
  /** 重み設定 */
  weights: {
    seo: number;
    readability: number;
    content: number;
    technical: number;
  };
  /** 閾値設定 */
  thresholds: {
    excellent: number; // 85+
    good: number;      // 70+
    fair: number;      // 50+
    poor: number;      // 50未満
  };
  /** キーワード設定 */
  keywords: {
    primary: string[];
    secondary: string[];
  };
  /** ターゲット設定 */
  targets: {
    minWordCount: number;
    maxWordCount: number;
    idealSentenceLength: number;
    targetKeywordDensity: number;
  };
}

// 競合分析結果（将来の拡張用）
export interface CompetitorAnalysis {
  /** 競合記事の情報 */
  competitors: Array<{
    url: string;
    title: string;
    wordCount: number;
    headingCount: number;
    keywordDensity: number;
    score: number;
  }>;
  /** 自記事の相対的位置 */
  relativePosition: {
    rank: number;
    strengths: string[];
    gaps: string[];
  };
}

// 品質追跡履歴（将来の拡張用）
export interface QualityHistory {
  /** 評価日時 */
  evaluatedAt: string;
  /** その時点のスコア */
  score: number;
  /** 改善された項目 */
  improvements: string[];
  /** 新たに発見された問題 */
  newIssues: string[];
}

// リクエスト・レスポンス型
export interface QualityEvaluationRequest {
  /** 評価対象の記事コンテンツ（HTML） */
  htmlContent: string;
  /** ターゲットキーワード */
  targetKeywords?: string[];
  /** 評価設定 */
  config?: Partial<QualityEvaluationConfig>;
  /** 競合分析を行うか */
  includeCompetitorAnalysis?: boolean;
}

export interface QualityEvaluationResponse {
  success: boolean;
  data?: QualityEvaluationResult;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    evaluationTime: number; // ms
    version: string;
    timestamp: string;
  };
}

// Google品質ガイドライン評価
export interface GoogleQualityGuidelineEvaluation {
  /** 総合評価結果 */
  overallAssessment: 'OK' | 'NEEDS_IMPROVEMENT' | 'NG';
  /** 総合スコア (0-100) */
  overallScore: number;
  /** 各チェック項目の評価 */
  checkItems: {
    originality: GoogleQualityCheckItem;
    userBenefit: GoogleQualityCheckItem;
    plagiarism: GoogleQualityCheckItem;
    keywordStuffing: GoogleQualityCheckItem;
    credibility: GoogleQualityCheckItem;
    eeat: GoogleQualityCheckItem;
    contentDepth: GoogleQualityCheckItem;
    autoPostingPattern: GoogleQualityCheckItem;
  };
  /** 重要な警告 */
  criticalWarnings: string[];
  /** 改善提案の優先順位 */
  improvementPriorities: GoogleQualityImprovement[];
  /** 評価サマリー */
  summary: {
    okCount: number;
    improvementCount: number;
    ngCount: number;
    mainIssues: string[];
    quickWins: string[];
  };
}

// 個別チェック項目の評価
export interface GoogleQualityCheckItem {
  /** 評価結果 */
  status: 'OK' | 'NEEDS_IMPROVEMENT' | 'NG';
  /** スコア (0-100) */
  score: number;
  /** 評価理由 */
  reasons: string[];
  /** 具体的な問題点 */
  issues: string[];
  /** 改善提案 */
  suggestions: string[];
  /** 検出された問題のサンプル */
  examples?: string[];
  /** 重要度 */
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// E-E-A-T評価の詳細
export interface EeatEvaluation {
  /** Experience (経験) */
  experience: {
    score: number;
    hasPersonalExperience: boolean;
    experienceIndicators: string[];
    lackingAreas: string[];
  };
  /** Expertise (専門性) */
  expertise: {
    score: number;
    technicalAccuracy: number;
    domainKnowledge: number;
    expertiseSignals: string[];
    expertiseGaps: string[];
  };
  /** Authoritativeness (権威性) */
  authoritativeness: {
    score: number;
    authorCredentials: boolean;
    sourceQuality: number;
    industryRecognition: string[];
    authorityIssues: string[];
  };
  /** Trustworthiness (信頼性) */
  trustworthiness: {
    score: number;
    factualAccuracy: number;
    sourceAttribution: number;
    transparencyScore: number;
    trustSignals: string[];
    trustIssues: string[];
  };
}

// オリジナリティ分析
export interface OriginalityAnalysis {
  /** 独自性スコア */
  originalityScore: number;
  /** テンプレート的要素の検出 */
  templatePatterns: {
    detected: boolean;
    patterns: string[];
    severity: 'low' | 'medium' | 'high';
  };
  /** 重複コンテンツの可能性 */
  duplicationRisk: {
    level: 'low' | 'medium' | 'high';
    suspiciousPatterns: string[];
    recommendations: string[];
  };
  /** ユニークな要素 */
  uniqueElements: {
    personalInsights: string[];
    originalAnalysis: string[];
    uniquePerspectives: string[];
  };
}

// ユーザー価値分析
export interface UserValueAnalysis {
  /** 検索意図適合度 */
  searchIntentAlignment: {
    score: number;
    intentType: 'informational' | 'navigational' | 'transactional' | 'commercial';
    alignmentLevel: 'high' | 'medium' | 'low';
    misalignments: string[];
  };
  /** 実用性評価 */
  practicalValue: {
    score: number;
    actionableAdvice: number;
    comprehensiveness: number;
    timelyRelevance: number;
    practicalIssues: string[];
  };
  /** ユーザー体験 */
  userExperience: {
    score: number;
    readability: number;
    accessibility: number;
    navigation: number;
    uxIssues: string[];
  };
}

// 信頼性分析
export interface CredibilityAnalysis {
  /** 情報の正確性 */
  factualAccuracy: {
    score: number;
    verifiableFacts: number;
    outdatedInformation: string[];
    factualErrors: string[];
  };
  /** 出典の質 */
  sourceQuality: {
    score: number;
    sourceCount: number;
    authorityLevel: 'high' | 'medium' | 'low';
    sourceTypes: string[];
    sourceIssues: string[];
  };
  /** 透明性 */
  transparency: {
    score: number;
    authorInformation: boolean;
    publicationDate: boolean;
    updateHistory: boolean;
    conflictOfInterest: boolean;
    transparencyIssues: string[];
  };
}

// 自動投稿パターン分析
export interface AutoPostingPatternAnalysis {
  /** 自動生成の兆候 */
  automationSignals: {
    score: number; // 高いほど人間らしい
    roboticPatterns: string[];
    naturalLanguageScore: number;
    personalTouchScore: number;
  };
  /** 大量生産の兆候 */
  massProductionSigns: {
    templateStructure: boolean;
    genericContent: number;
    lackOfPersonality: boolean;
    repetitiveElements: string[];
  };
  /** 人間らしさの指標 */
  humanLikeQualities: {
    personalOpinions: string[];
    casualExpressions: string[];
    errorTypos: string[]; // 意図的でない小さなミス
    naturalFlowScore: number;
  };
}

// 改善提案
export interface GoogleQualityImprovement {
  /** 改善項目 */
  category: keyof GoogleQualityGuidelineEvaluation['checkItems'];
  /** 優先度 */
  priority: 'critical' | 'high' | 'medium' | 'low';
  /** 改善タイトル */
  title: string;
  /** 現在の問題 */
  currentIssue: string;
  /** 具体的な改善策 */
  actionItems: string[];
  /** 期待される効果 */
  expectedImpact: string;
  /** 実装難易度 */
  difficulty: 'easy' | 'medium' | 'hard';
  /** 推定作業時間 */
  estimatedEffort: string;
  /** 参考資料 */
  references?: string[];
}

// Google品質ガイドライン評価設定
export interface GoogleQualityEvaluationConfig {
  /** 厳格度設定 */
  strictness: 'lenient' | 'standard' | 'strict';
  /** 重点評価項目 */
  focusAreas: Array<keyof GoogleQualityGuidelineEvaluation['checkItems']>;
  /** 業界・ジャンル特有の考慮事項 */
  industryContext?: {
    type: 'health' | 'finance' | 'legal' | 'news' | 'ecommerce' | 'general';
    additionalStandards: string[];
  };
  /** カスタム閾値 */
  customThresholds?: {
    okThreshold: number;      // この値以上でOK (デフォルト: 80)
    improvementThreshold: number; // この値以上で要改善 (デフォルト: 60)
    // この値未満でNG
  };
}

// Google品質ガイドライン評価のリクエスト・レスポンス
export interface GoogleQualityEvaluationRequest {
  /** 評価対象の記事コンテンツ */
  content: {
    title: string;
    body: string;
    metaDescription?: string;
    targetKeywords?: string[];
  };
  /** 評価設定 */
  config?: GoogleQualityEvaluationConfig;
  /** 競合記事との比較を行うか */
  includeCompetitorComparison?: boolean;
  /** 詳細分析を含むか */
  includeDetailedAnalysis?: boolean;
}

export interface GoogleQualityEvaluationResponse {
  success: boolean;
  data?: GoogleQualityGuidelineEvaluation;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    evaluationTime: number;
    version: string;
    timestamp: string;
    configUsed: GoogleQualityEvaluationConfig;
  };
}

// 既存の品質評価結果にGoogle評価を統合
export interface EnhancedQualityEvaluationResult extends QualityEvaluationResult {
  /** Google品質ガイドライン評価 */
  googleQuality: GoogleQualityGuidelineEvaluation;
  /** 統合スコア (従来スコア + Google評価) */
  enhancedScore: number;
  /** 統合された改善提案 */
  enhancedRecommendations: Array<QualityRecommendation | GoogleQualityImprovement>;
}
