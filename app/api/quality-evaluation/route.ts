import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { 
  QualityEvaluationResult, 
  QualityEvaluationRequest, 
  QualityEvaluationResponse,
  SeoEvaluation,
  ReadabilityEvaluation,
  ContentEvaluation,
  TechnicalEvaluation,
  QualityRecommendation,
  MetadataEvaluation,
  HeadingEvaluation,
  KeywordEvaluation,
  LinkEvaluation,
  ImageEvaluation
} from '@/types/quality-evaluation';

// リクエストスキーマの定義
const QualityEvaluationSchema = z.object({
  htmlContent: z.string().min(1, 'HTML content is required'),
  targetKeywords: z.array(z.string()).optional().default([]),
  config: z.object({
    weights: z.object({
      seo: z.number().min(0).max(1).optional().default(0.4),
      readability: z.number().min(0).max(1).optional().default(0.3),
      content: z.number().min(0).max(1).optional().default(0.2),
      technical: z.number().min(0).max(1).optional().default(0.1),
    }).optional(),
    thresholds: z.object({
      excellent: z.number().optional().default(85),
      good: z.number().optional().default(70),
      fair: z.number().optional().default(50),
      poor: z.number().optional().default(0),
    }).optional(),
    targets: z.object({
      minWordCount: z.number().optional().default(300),
      maxWordCount: z.number().optional().default(3000),
      idealSentenceLength: z.number().optional().default(20),
      targetKeywordDensity: z.number().optional().default(2.5),
    }).optional(),
  }).optional(),
  includeCompetitorAnalysis: z.boolean().optional().default(false),
});

/**
 * HTMLからメタデータを抽出・評価する
 */
function evaluateMetadata(html: string): { title: MetadataEvaluation; description: MetadataEvaluation; keywords: MetadataEvaluation } {
  // タイトル評価
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  const title: MetadataEvaluation = {
    value: titleMatch ? titleMatch[1].trim() : null,
    score: 0,
    length: 0,
    isOptimal: false,
    issues: [],
    suggestions: []
  };

  if (title.value) {
    title.length = title.value.length;
    if (title.length >= 20 && title.length <= 60) {
      title.score = 100;
      title.isOptimal = true;
    } else if (title.length < 20) {
      title.score = Math.max(0, (title.length / 20) * 80);
      title.issues.push('タイトルが短すぎます（20-60文字推奨）');
      title.suggestions.push('より詳細で魅力的なタイトルに変更してください');
    } else {
      title.score = Math.max(50, 100 - ((title.length - 60) * 2));
      title.issues.push('タイトルが長すぎます（20-60文字推奨）');
      title.suggestions.push('タイトルを簡潔にまとめてください');
    }
  } else {
    title.issues.push('タイトルタグがありません');
    title.suggestions.push('魅力的で具体的なタイトルを設定してください');
  }

  // メタディスクリプション評価
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)/i);
  const description: MetadataEvaluation = {
    value: descMatch ? descMatch[1].trim() : null,
    score: 0,
    length: 0,
    isOptimal: false,
    issues: [],
    suggestions: []
  };

  if (description.value) {
    description.length = description.value.length;
    if (description.length >= 120 && description.length <= 160) {
      description.score = 100;
      description.isOptimal = true;
    } else if (description.length < 120) {
      description.score = Math.max(0, (description.length / 120) * 80);
      description.issues.push('メタディスクリプションが短すぎます（120-160文字推奨）');
      description.suggestions.push('より詳細で魅力的な説明文を作成してください');
    } else {
      description.score = Math.max(60, 100 - ((description.length - 160) * 1.5));
      description.issues.push('メタディスクリプションが長すぎます（120-160文字推奨）');
      description.suggestions.push('説明文を簡潔にまとめてください');
    }
  } else {
    description.issues.push('メタディスクリプションがありません');
    description.suggestions.push('検索結果で表示される魅力的な要約を作成してください');
  }

  // キーワード評価
  const keywordsMatch = html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']*)/i);
  const keywordsValue = keywordsMatch ? keywordsMatch[1].trim() : null;
  const keywords: MetadataEvaluation = {
    value: keywordsValue,
    score: keywordsValue ? 100 : 50, // キーワードは必須ではないが、あれば評価
    length: keywordsMatch ? keywordsMatch[1].length : 0,
    isOptimal: !!keywordsMatch,
    issues: [],
    suggestions: []
  };

  if (!keywords.value) {
    keywords.suggestions.push('関連キーワードをメタタグに追加することを検討してください');
  }

  return { title, description, keywords };
}

/**
 * 見出し構造を評価する
 */
function evaluateHeadings(html: string, targetKeywords: string[]): HeadingEvaluation {
  const headingMatches = html.matchAll(/<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi);
  const structure = [];
  let hasH1 = false;
  let keywordOptimizationScore = 0;

  for (const match of headingMatches) {
    const level = parseInt(match[1]);
    const text = match[2].replace(/<[^>]*>/g, '').trim();
    const hasKeyword = targetKeywords.some(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );

    if (hasKeyword) keywordOptimizationScore += 10;
    if (level === 1) hasH1 = true;

    structure.push({
      level,
      text,
      hasKeyword,
      length: text.length
    });
  }

  // 論理的階層構造のチェック
  let hasLogicalHierarchy = true;
  for (let i = 1; i < structure.length; i++) {
    if (structure[i].level > structure[i-1].level + 1) {
      hasLogicalHierarchy = false;
      break;
    }
  }

  let score = 0;
  if (hasH1) score += 30;
  if (structure.length >= 3) score += 30;
  if (hasLogicalHierarchy) score += 20;
  score += Math.min(20, keywordOptimizationScore);

  return {
    structure,
    score,
    hasH1,
    hasLogicalHierarchy,
    keywordOptimization: Math.min(100, keywordOptimizationScore)
  };
}

/**
 * キーワード最適化を評価する
 */
function evaluateKeywords(html: string, targetKeywords: string[]): KeywordEvaluation {
  if (targetKeywords.length === 0) {
    return {
      primaryKeyword: {
        keyword: '',
        density: 0,
        placement: {
          inTitle: false,
          inDescription: false,
          inH1: false,
          inFirstParagraph: false
        }
      },
      secondaryKeywords: [],
      overallOptimization: 0,
      keywordStuffing: false
    };
  }

  const primaryKeyword = targetKeywords[0];
  const textContent = html.replace(/<[^>]*>/g, '').toLowerCase();
  const words = textContent.split(/\s+/).filter(w => w.length > 0);
  const totalWords = words.length;

  // 主要キーワードの密度計算
  const keywordCount = (textContent.match(new RegExp(primaryKeyword.toLowerCase(), 'g')) || []).length;
  const density = totalWords > 0 ? (keywordCount / totalWords) * 100 : 0;

  // 主要キーワードの配置チェック
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)/i);
  const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
  const firstParagraphMatch = html.match(/<p[^>]*>(.*?)<\/p>/i);

  const placement = {
    inTitle: titleMatch ? titleMatch[1].toLowerCase().includes(primaryKeyword.toLowerCase()) : false,
    inDescription: descMatch ? descMatch[1].toLowerCase().includes(primaryKeyword.toLowerCase()) : false,
    inH1: h1Match ? h1Match[1].toLowerCase().includes(primaryKeyword.toLowerCase()) : false,
    inFirstParagraph: firstParagraphMatch ? firstParagraphMatch[1].toLowerCase().includes(primaryKeyword.toLowerCase()) : false
  };

  // 副キーワードの評価
  const secondaryKeywords = targetKeywords.slice(1).map(keyword => {
    const count = (textContent.match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
    const keywordDensity = totalWords > 0 ? (count / totalWords) * 100 : 0;
    return {
      keyword,
      density: keywordDensity,
      naturalIntegration: keywordDensity > 0 && keywordDensity < 3 // 自然な統合かどうか
    };
  });

  // 全体最適化スコア
  let optimizationScore = 0;
  if (placement.inTitle) optimizationScore += 25;
  if (placement.inDescription) optimizationScore += 20;
  if (placement.inH1) optimizationScore += 20;
  if (placement.inFirstParagraph) optimizationScore += 15;
  if (density >= 1 && density <= 3) optimizationScore += 20;

  // キーワードスタッフィングの検出
  const keywordStuffing = density > 5 || keywordCount > totalWords * 0.05;

  return {
    primaryKeyword: {
      keyword: primaryKeyword,
      density,
      placement
    },
    secondaryKeywords,
    overallOptimization: optimizationScore,
    keywordStuffing
  };
}

/**
 * リンク評価を行う
 */
function evaluateLinks(html: string): LinkEvaluation {
  const linkMatches = html.matchAll(/<a[^>]*href=["']([^"']*)"[^>]*>(.*?)<\/a>/gi);
  let internalCount = 0;
  let externalCount = 0;
  let naturalPlacement = true;
  let relevantAnchors = true;

  for (const match of linkMatches) {
    const href = match[1];
    const anchorText = match[2].replace(/<[^>]*>/g, '').trim();
    
    if (href.startsWith('http') && !href.includes(process.env.NEXT_PUBLIC_APP_URL || 'localhost')) {
      externalCount++;
    } else if (!href.startsWith('mailto:') && !href.startsWith('tel:')) {
      internalCount++;
    }

    // アンカーテキストの質をチェック
    const vagueTerms = ['こちら', '詳細', 'ここ', 'クリック', 'リンク', 'もっと見る'];
    if (vagueTerms.some(term => anchorText.toLowerCase().includes(term))) {
      relevantAnchors = false;
    }
  }

  const internalScore = Math.min(100, internalCount * 20); // 内部リンク1つにつき20点、最大100点
  const externalScore = externalCount > 0 ? 80 : 60; // 外部リンクがあれば高評価

  return {
    internal: {
      count: internalCount,
      score: internalScore,
      naturalPlacement,
      relevantAnchors
    },
    external: {
      count: externalCount,
      authority: 70, // 仮の権威性スコア
      relevance: 80  // 仮の関連性スコア
    }
  };
}

/**
 * 画像評価を行う
 */
function evaluateImages(html: string): ImageEvaluation {
  const imageMatches = html.matchAll(/<img[^>]*src=["']([^"']*)"[^>]*>/gi);
  let count = 0;
  let withAlt = 0;
  let optimizedAlt = 0;
  let lazyLoading = false;
  const formats: string[] = [];

  for (const match of imageMatches) {
    count++;
    const altMatch = match[0].match(/alt=["']([^"']*)/i);
    const srcMatch = match[1];
    
    if (altMatch && altMatch[1].length > 0) {
      withAlt++;
      // alt属性が具体的で説明的かチェック
      if (altMatch[1].length > 10 && !altMatch[1].toLowerCase().includes('image')) {
        optimizedAlt++;
      }
    }

    // ファイル形式の抽出
    const extension = srcMatch.split('.').pop()?.toLowerCase();
    if (extension && ['jpg', 'jpeg', 'png', 'webp', 'avif'].includes(extension)) {
      if (!formats.includes(extension)) {
        formats.push(extension);
      }
    }

    // lazy loading の検出
    if (match[0].includes('loading="lazy"')) {
      lazyLoading = true;
    }
  }

  let score = 0;
  if (count > 0) {
    score += (withAlt / count) * 50; // alt属性の割合
    score += (optimizedAlt / count) * 30; // 最適化されたalt属性の割合
    if (lazyLoading) score += 20; // lazy loading
  } else {
    score = 50; // 画像がない場合は中程度の評価
  }

  return {
    count,
    withAlt,
    optimizedAlt,
    fileSize: 0, // ファイルサイズは取得困難なため0
    format: formats,
    lazyLoading,
    score: Math.round(score)
  };
}

/**
 * SEO評価を実行する
 */
function evaluateSeo(html: string, targetKeywords: string[]): SeoEvaluation {
  const metadata = evaluateMetadata(html);
  const headingStructure = evaluateHeadings(html, targetKeywords);
  const keywordOptimization = evaluateKeywords(html, targetKeywords);
  const internalLinks = evaluateLinks(html);
  const imageOptimization = evaluateImages(html);

  // 技術的SEO要素のチェック
  const technical = {
    structuredData: html.includes('application/ld+json'),
    canonicalUrl: html.includes('rel="canonical"'),
    metaViewport: html.includes('name="viewport"'),
    ogTags: html.includes('property="og:'),
    twitterCards: html.includes('name="twitter:')
  };

  // SEO総合スコアの計算
  const metadataScore = (metadata.title.score + metadata.description.score + metadata.keywords.score) / 3;
  const contentScore = (headingStructure.score + keywordOptimization.overallOptimization + internalLinks.internal.score + imageOptimization.score) / 4;
  const technicalScore = Object.values(technical).filter(Boolean).length * 20; // 各項目20点

  const seoScore = Math.round((metadataScore * 0.4 + contentScore * 0.4 + technicalScore * 0.2));

  return {
    score: seoScore,
    metadata,
    content: {
      headingStructure,
      keywordOptimization,
      internalLinks,
      imageOptimization
    },
    technical
  };
}

/**
 * 読みやすさ評価を実行する
 */
function evaluateReadability(html: string): ReadabilityEvaluation {
  const textContent = html.replace(/<[^>]*>/g, '');
  const sentences = textContent.split(/[。！？.!?]+/).filter(s => s.trim().length > 0);
  const paragraphs = html.match(/<p[^>]*>.*?<\/p>/gi) || [];
  const words = textContent.split(/\s+/).filter(w => w.length > 0);

  const statistics = {
    wordCount: textContent.length, // 日本語では文字数
    sentenceCount: sentences.length,
    paragraphCount: paragraphs.length,
    averageWordsPerSentence: sentences.length > 0 ? textContent.length / sentences.length : 0,
    averageSentencesPerParagraph: paragraphs.length > 0 ? sentences.length / paragraphs.length : 0
  };

  // 複雑さの評価
  const longSentences = sentences.filter(s => s.length > 100).length;
  const complexity = {
    difficultWords: 0, // 日本語では漢字の割合などで判定可能だが簡略化
    longSentences,
    passiveVoice: 0 // 受動態の検出は複雑なため簡略化
  };

  // ユーザーフレンドリーさの評価
  const userFriendliness = {
    hasIntroduction: html.includes('<h1') || html.includes('<h2'), // 導入部分があるか
    hasConclusion: html.toLowerCase().includes('まとめ') || html.toLowerCase().includes('結論'),
    hasBulletPoints: html.includes('<ul>') || html.includes('<li>'),
    hasNumberedLists: html.includes('<ol>')
  };

  // 読みやすさスコアの計算
  let score = 100;
  
  // 文の長さペナルティ
  if (statistics.averageWordsPerSentence > 80) score -= 20;
  else if (statistics.averageWordsPerSentence > 60) score -= 10;

  // 段落あたりの文数
  if (statistics.averageSentencesPerParagraph > 8) score -= 15;
  else if (statistics.averageSentencesPerParagraph > 5) score -= 5;

  // ユーザーフレンドリーさのボーナス
  if (userFriendliness.hasIntroduction) score += 5;
  if (userFriendliness.hasConclusion) score += 5;
  if (userFriendliness.hasBulletPoints) score += 5;
  if (userFriendliness.hasNumberedLists) score += 5;

  // 長い文のペナルティ
  score -= longSentences * 2;

  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    statistics,
    complexity,
    userFriendliness
  };
}

/**
 * コンテンツ評価を実行する
 */
function evaluateContent(html: string, targetKeywords: string[]): ContentEvaluation {
  const textContent = html.replace(/<[^>]*>/g, '');
  const wordCount = textContent.length;

  // 内容の深さ評価
  const depth = {
    topicCoverage: Math.min(100, (wordCount / 1000) * 60 + 40), // 文字数ベースの簡易評価
    detailLevel: Math.min(100, (html.match(/<h[2-6]/gi) || []).length * 15), // 見出しの詳細度
    expertise: targetKeywords.length > 0 ? 70 : 50 // キーワードがあれば専門性があると仮定
  };

  // 構造の質評価
  const hasIntro = html.match(/<h[1-2][^>]*>.*?(はじめに|導入|概要)/i);
  const hasConclusion = html.match(/<h[1-2][^>]*>.*?(まとめ|結論|おわりに)/i);
  
  const structure = {
    logicalFlow: hasIntro && hasConclusion ? 90 : 70,
    introduction: hasIntro ? 90 : 50,
    conclusion: hasConclusion ? 90 : 50
  };

  // 独自性評価（簡易版）
  const uniqueness = {
    originalityScore: 75, // 実際の重複チェックは複雑なため固定値
    duplicateContent: false
  };

  const contentScore = Math.round(
    (depth.topicCoverage + depth.detailLevel + depth.expertise +
     structure.logicalFlow + structure.introduction + structure.conclusion +
     uniqueness.originalityScore) / 7
  );

  return {
    score: contentScore,
    depth,
    structure,
    uniqueness
  };
}

/**
 * 技術的評価を実行する
 */
function evaluateTechnical(html: string): TechnicalEvaluation {
  // HTML品質の評価
  const htmlQuality = {
    validMarkup: !html.includes('<>') && !html.includes('</>'), // 簡易的な検証
    semanticStructure: html.includes('<article>') || html.includes('<section>') || html.includes('<header>'),
    accessibilityCompliance: html.includes('alt=') && html.includes('lang=')
  };

  // パフォーマンスの評価
  const performance = {
    imageOptimization: html.includes('loading="lazy"') || html.includes('webp'),
    loadingOptimization: html.includes('async') || html.includes('defer'),
    cacheability: html.includes('Cache-Control') // 実際のHTTPヘッダーではないが参考
  };

  // モバイル最適化の評価
  const mobileOptimization = {
    responsive: html.includes('viewport') && html.includes('width=device-width'),
    touchFriendly: true, // 簡易的にtrueとする
    fastLoading: performance.imageOptimization && performance.loadingOptimization
  };

  // 技術スコアの計算
  const qualityScore = Object.values(htmlQuality).filter(Boolean).length * 25;
  const performanceScore = Object.values(performance).filter(Boolean).length * 20;
  const mobileScore = Object.values(mobileOptimization).filter(Boolean).length * 15;

  const technicalScore = Math.round((qualityScore + performanceScore + mobileScore) / 3);

  return {
    score: technicalScore,
    htmlQuality,
    performance,
    mobileOptimization
  };
}

/**
 * 改善提案を生成する
 */
function generateRecommendations(
  seo: SeoEvaluation, 
  readability: ReadabilityEvaluation, 
  content: ContentEvaluation, 
  technical: TechnicalEvaluation
): QualityRecommendation[] {
  const recommendations: QualityRecommendation[] = [];

  // SEO改善提案
  if (seo.metadata.title.score < 80) {
    recommendations.push({
      category: 'seo',
      priority: 'high',
      title: 'タイトルの最適化',
      currentState: `現在のタイトル長: ${seo.metadata.title.length}文字`,
      recommendation: 'タイトルを20-60文字の範囲で、魅力的で具体的な内容に変更してください',
      expectedImpact: '検索結果でのクリック率向上、SEOランキング改善',
      difficulty: 'easy',
      estimatedTime: '5-10分'
    });
  }

  if (seo.metadata.description.score < 80) {
    recommendations.push({
      category: 'seo',
      priority: 'high',
      title: 'メタディスクリプションの最適化',
      currentState: `現在の説明文長: ${seo.metadata.description.length}文字`,
      recommendation: '120-160文字の範囲で、記事内容を魅力的に要約した説明文を作成してください',
      expectedImpact: '検索結果でのクリック率向上',
      difficulty: 'easy',
      estimatedTime: '10-15分'
    });
  }

  if (!seo.content.headingStructure.hasH1) {
    recommendations.push({
      category: 'seo',
      priority: 'high',
      title: 'H1タグの設定',
      currentState: 'H1タグが設定されていません',
      recommendation: '記事の主題を表すH1タグを1つ設定してください',
      expectedImpact: '検索エンジンによる記事テーマの理解向上',
      difficulty: 'easy',
      estimatedTime: '5分'
    });
  }

  if (seo.content.imageOptimization.withAlt < seo.content.imageOptimization.count) {
    recommendations.push({
      category: 'seo',
      priority: 'medium',
      title: '画像alt属性の設定',
      currentState: `${seo.content.imageOptimization.count - seo.content.imageOptimization.withAlt}個の画像にalt属性がありません`,
      recommendation: 'すべての画像に具体的で説明的なalt属性を設定してください',
      expectedImpact: '画像SEO改善、アクセシビリティ向上',
      difficulty: 'easy',
      estimatedTime: '1画像あたり2-3分'
    });
  }

  // 読みやすさ改善提案
  if (readability.statistics.averageWordsPerSentence > 80) {
    recommendations.push({
      category: 'readability',
      priority: 'medium',
      title: '文章の長さを調整',
      currentState: `平均文字数/文: ${Math.round(readability.statistics.averageWordsPerSentence)}文字`,
      recommendation: '長い文を短く分割し、読みやすい文章にしてください（目安: 60文字以下/文）',
      expectedImpact: 'ユーザーの読解負担軽減、滞在時間向上',
      difficulty: 'medium',
      estimatedTime: '30-60分'
    });
  }

  if (!readability.userFriendliness.hasBulletPoints) {
    recommendations.push({
      category: 'readability',
      priority: 'low',
      title: '箇条書きの追加',
      currentState: '箇条書きが使用されていません',
      recommendation: 'ポイントをまとめる際に箇条書きを活用してください',
      expectedImpact: '情報の整理、読みやすさ向上',
      difficulty: 'easy',
      estimatedTime: '10-20分'
    });
  }

  // コンテンツ改善提案
  if (content.structure.introduction < 70) {
    recommendations.push({
      category: 'content',
      priority: 'medium',
      title: '導入部分の強化',
      currentState: '導入部分が不十分です',
      recommendation: '記事の目的と読者にとってのメリットを明確にした導入文を追加してください',
      expectedImpact: 'ユーザーエンゲージメント向上、離脱率改善',
      difficulty: 'medium',
      estimatedTime: '15-30分'
    });
  }

  if (content.structure.conclusion < 70) {
    recommendations.push({
      category: 'content',
      priority: 'medium',
      title: 'まとめ部分の追加',
      currentState: 'まとめ部分が不十分です',
      recommendation: '記事の要点をまとめ、読者の次のアクションを示すまとめ部分を追加してください',
      expectedImpact: 'ユーザーの理解促進、コンバージョン向上',
      difficulty: 'medium',
      estimatedTime: '15-30分'
    });
  }

  // 技術的改善提案
  if (!technical.performance.imageOptimization) {
    recommendations.push({
      category: 'technical',
      priority: 'low',
      title: '画像最適化の実装',
      currentState: '画像の遅延読み込みが設定されていません',
      recommendation: '画像にloading="lazy"属性を追加してページ読み込み速度を改善してください',
      expectedImpact: 'ページ読み込み速度向上、ユーザー体験改善',
      difficulty: 'easy',
      estimatedTime: '10分'
    });
  }

  if (!technical.htmlQuality.semanticStructure) {
    recommendations.push({
      category: 'technical',
      priority: 'low',
      title: 'セマンティックHTMLの使用',
      currentState: 'セマンティックHTMLタグが使用されていません',
      recommendation: 'article、section、headerなどのセマンティックタグを使用してください',
      expectedImpact: 'SEO改善、アクセシビリティ向上',
      difficulty: 'medium',
      estimatedTime: '20-40分'
    });
  }

  // 優先度順にソート
  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

/**
 * 記事品質評価のメイン処理
 */
export async function POST(request: NextRequest): Promise<NextResponse<QualityEvaluationResponse>> {
  const startTime = Date.now();

  try {
    // リクエストの検証
    const body = await request.json();
    const validatedData = QualityEvaluationSchema.parse(body);
    
    const { htmlContent, targetKeywords, config } = validatedData;

    // デフォルト設定の適用
    const defaultConfig = {
      weights: { seo: 0.4, readability: 0.3, content: 0.2, technical: 0.1 },
      thresholds: { excellent: 85, good: 70, fair: 50, poor: 0 },
      targets: { minWordCount: 300, maxWordCount: 3000, idealSentenceLength: 20, targetKeywordDensity: 2.5 }
    };
    const evaluationConfig = { ...defaultConfig, ...config };

    // 各項目の評価実行
    const seo = evaluateSeo(htmlContent, targetKeywords);
    const readability = evaluateReadability(htmlContent);
    const content = evaluateContent(htmlContent, targetKeywords);
    const technical = evaluateTechnical(htmlContent);

    // 総合スコアの計算
    const overallScore = Math.round(
      seo.score * evaluationConfig.weights.seo +
      readability.score * evaluationConfig.weights.readability +
      content.score * evaluationConfig.weights.content +
      technical.score * evaluationConfig.weights.technical
    );

    // カテゴリの決定
    let category: 'poor' | 'fair' | 'good' | 'excellent';
    if (overallScore >= evaluationConfig.thresholds.excellent) category = 'excellent';
    else if (overallScore >= evaluationConfig.thresholds.good) category = 'good';
    else if (overallScore >= evaluationConfig.thresholds.fair) category = 'fair';
    else category = 'poor';

    // 改善提案の生成
    const recommendations = generateRecommendations(seo, readability, content, technical);

    // サマリーの生成
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const priorityImprovements: string[] = [];

    if (seo.score >= 80) strengths.push('SEO最適化が適切に行われています');
    else weaknesses.push('SEO要素に改善の余地があります');

    if (readability.score >= 80) strengths.push('読みやすい文章構成になっています');
    else weaknesses.push('文章の読みやすさを改善できます');

    if (content.score >= 80) strengths.push('コンテンツの質が高いです');
    else weaknesses.push('コンテンツの深さや構造を改善できます');

    if (technical.score >= 80) strengths.push('技術的な実装が適切です');
    else weaknesses.push('技術的な最適化を改善できます');

    // 高優先度の改善項目を抽出
    priorityImprovements.push(...recommendations
      .filter(r => r.priority === 'high')
      .slice(0, 3)
      .map(r => r.title)
    );

    const result: QualityEvaluationResult = {
      overallScore,
      category,
      evaluations: { seo, readability, content, technical },
      recommendations,
      summary: { strengths, weaknesses, priorityImprovements }
    };

    const evaluationTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      data: result,
      metadata: {
        evaluationTime,
        version: '1.0.0',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Quality evaluation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'リクエストデータが無効です',
          details: error.errors
        }
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'サーバー内部エラーが発生しました'
      }
    }, { status: 500 });
  }
}
