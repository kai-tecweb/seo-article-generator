import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// リクエストスキーマの定義
const OptimizeSeoSchema = z.object({
  htmlContent: z.string().min(1, 'HTML content is required'),
  targetKeywords: z.array(z.string()).optional(),
  optimizeImages: z.boolean().default(true),
  optimizeLinks: z.boolean().default(true),
  optimizeHeadings: z.boolean().default(true),
  addStructuredData: z.boolean().default(true),
  improveMetadata: z.boolean().default(true),
  mode: z.enum(['basic', 'advanced', 'comprehensive']).default('basic'),
});

// レスポンス型定義
interface SeoOptimizationResult {
  success: boolean;
  data?: {
    originalSeoScore: number;
    optimizedSeoScore: number;
    optimization: {
      htmlContent: string;
      improvements: {
        metadata: {
          titleOptimized: boolean;
          descriptionImproved: boolean;
          keywordsAdded: boolean;
          ogTagsAdded: boolean;
          twitterCardsAdded: boolean;
          canonicalAdded: boolean;
        };
        content: {
          headingsOptimized: number;
          imagesOptimized: number;
          linksOptimized: number;
          keywordDensityImproved: boolean;
          readabilityImproved: boolean;
        };
        technical: {
          structuredDataAdded: boolean;
          sitemapReady: boolean;
          mobileFriendly: boolean;
          pageSpeedOptimized: boolean;
        };
      };
    };
    seoReport: {
      score: number;
      category: 'poor' | 'fair' | 'good' | 'excellent';
      issues: Array<{
        type: 'critical' | 'warning' | 'info';
        message: string;
        recommendation: string;
      }>;
      improvements: Array<{
        category: string;
        before: string;
        after: string;
        impact: 'low' | 'medium' | 'high';
      }>;
    };
    analytics: {
      keywordDensity: Record<string, number>;
      readabilityScore: number;
      contentLength: number;
      headingStructure: Array<{
        level: number;
        text: string;
        optimized: boolean;
      }>;
    };
  };
  error?: string;
}

// HTML要素を抽出・分析する関数
function analyzeSeoElements(html: string) {
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)/i);
  const keywordsMatch = html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']*)/i);
  
  // 見出しを抽出
  const headings = [];
  const headingMatches = html.matchAll(/<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi);
  for (const match of headingMatches) {
    headings.push({
      level: parseInt(match[1]),
      text: match[2].replace(/<[^>]*>/g, '').trim(),
      optimized: false
    });
  }
  
  // 画像を抽出
  const images = [];
  const imageMatches = html.matchAll(/<img[^>]*src=["']([^"']*)"[^>]*>/gi);
  for (const match of imageMatches) {
    const altMatch = match[0].match(/alt=["']([^"']*)/i);
    images.push({
      src: match[1],
      alt: altMatch ? altMatch[1] : '',
      hasAlt: !!altMatch && altMatch[1].length > 0
    });
  }
  
  // リンクを抽出
  const links = [];
  const linkMatches = html.matchAll(/<a[^>]*href=["']([^"']*)"[^>]*>(.*?)<\/a>/gi);
  for (const match of linkMatches) {
    links.push({
      href: match[1],
      text: match[2].replace(/<[^>]*>/g, '').trim(),
      isInternal: !match[1].startsWith('http') || match[1].includes(process.env.NEXT_PUBLIC_APP_URL || 'localhost')
    });
  }
  
  return {
    title: titleMatch ? titleMatch[1].trim() : '',
    description: descMatch ? descMatch[1].trim() : '',
    keywords: keywordsMatch ? keywordsMatch[1].trim() : '',
    headings,
    images,
    links,
    hasOgTags: html.includes('property="og:'),
    hasTwitterCards: html.includes('name="twitter:'),
    hasCanonical: html.includes('rel="canonical"'),
    hasStructuredData: html.includes('application/ld+json')
  };
}

// SEOスコアを計算する関数
function calculateSeoScore(analysis: any, content: string): number {
  let score = 0;
  const maxScore = 100;
  
  // タイトル (20点)
  if (analysis.title) {
    score += 10;
    if (analysis.title.length >= 20 && analysis.title.length <= 60) {
      score += 10;
    }
  }
  
  // メタディスクリプション (15点)
  if (analysis.description) {
    score += 8;
    if (analysis.description.length >= 120 && analysis.description.length <= 160) {
      score += 7;
    }
  }
  
  // 見出し構造 (15点)
  if (analysis.headings.length > 0) {
    score += 8;
    const hasH1 = analysis.headings.some(h => h.level === 1);
    const hasH2 = analysis.headings.some(h => h.level === 2);
    if (hasH1 && hasH2) score += 7;
  }
  
  // 画像最適化 (15点)
  if (analysis.images.length > 0) {
    const optimizedImages = analysis.images.filter(img => img.hasAlt).length;
    score += Math.min(15, (optimizedImages / analysis.images.length) * 15);
  } else {
    score += 15; // 画像がない場合は満点
  }
  
  // コンテンツ長 (10点)
  const wordCount = content.replace(/<[^>]*>/g, '').length;
  if (wordCount >= 300) {
    score += Math.min(10, (wordCount / 1000) * 10);
  }
  
  // OGタグ (10点)
  if (analysis.hasOgTags) score += 10;
  
  // Twitter Cards (5点)
  if (analysis.hasTwitterCards) score += 5;
  
  // Canonical URL (5点)
  if (analysis.hasCanonical) score += 5;
  
  // 構造化データ (5点)
  if (analysis.hasStructuredData) score += 5;
  
  return Math.min(maxScore, Math.round(score));
}

// HTMLを最適化する関数
function optimizeHtml(html: string, analysis: any, targetKeywords: string[] = [], mode: string = 'basic') {
  let optimizedHtml = html;
  const improvements = {
    metadata: {
      titleOptimized: false,
      descriptionImproved: false,
      keywordsAdded: false,
      ogTagsAdded: false,
      twitterCardsAdded: false,
      canonicalAdded: false,
    },
    content: {
      headingsOptimized: 0,
      imagesOptimized: 0,
      linksOptimized: 0,
      keywordDensityImproved: false,
      readabilityImproved: false,
    },
    technical: {
      structuredDataAdded: false,
      sitemapReady: false,
      mobileFriendly: false,
      pageSpeedOptimized: false,
    },
  };
  
  // タイトルの最適化
  if (!analysis.title || analysis.title.length < 20) {
    const optimizedTitle = targetKeywords.length > 0 
      ? `${targetKeywords[0]}についての詳細ガイド | ${analysis.title || 'SEO記事'}` 
      : analysis.title || 'SEO最適化された記事タイトル';
    optimizedHtml = optimizedHtml.replace(
      /<title[^>]*>.*?<\/title>/i,
      `<title>${optimizedTitle}</title>`
    );
    improvements.metadata.titleOptimized = true;
  }
  
  // メタディスクリプションの最適化
  if (!analysis.description || analysis.description.length < 120) {
    const optimizedDescription = targetKeywords.length > 0
      ? `${targetKeywords.join('、')}について詳しく解説します。実用的な情報とSEOに最適化されたコンテンツをお届けします。`
      : '詳細で実用的な情報を提供する、SEOに最適化された記事です。';
    
    if (analysis.description) {
      optimizedHtml = optimizedHtml.replace(
        /<meta[^>]*name=["']description["'][^>]*content=["'][^"']*["'][^>]*>/i,
        `<meta name="description" content="${optimizedDescription}">`
      );
    } else {
      optimizedHtml = optimizedHtml.replace(
        /<\/head>/i,
        `<meta name="description" content="${optimizedDescription}">\n</head>`
      );
    }
    improvements.metadata.descriptionImproved = true;
  }
  
  // OGタグの追加
  if (!analysis.hasOgTags) {
    const ogTags = `
    <meta property="og:title" content="${analysis.title || 'SEO最適化記事'}">
    <meta property="og:description" content="${analysis.description || 'SEO最適化された詳細記事'}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${process.env.NEXT_PUBLIC_APP_URL || 'https://example.com'}">`;
    
    optimizedHtml = optimizedHtml.replace(
      /<\/head>/i,
      `${ogTags}\n</head>`
    );
    improvements.metadata.ogTagsAdded = true;
  }
  
  // Twitter Cardsの追加
  if (!analysis.hasTwitterCards) {
    const twitterTags = `
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${analysis.title || 'SEO最適化記事'}">
    <meta name="twitter:description" content="${analysis.description || 'SEO最適化された詳細記事'}">`;
    
    optimizedHtml = optimizedHtml.replace(
      /<\/head>/i,
      `${twitterTags}\n</head>`
    );
    improvements.metadata.twitterCardsAdded = true;
  }
  
  // Canonical URLの追加
  if (!analysis.hasCanonical) {
    optimizedHtml = optimizedHtml.replace(
      /<\/head>/i,
      `<link rel="canonical" href="${process.env.NEXT_PUBLIC_APP_URL || 'https://example.com'}">\n</head>`
    );
    improvements.metadata.canonicalAdded = true;
  }
  
  // 画像のalt属性最適化
  analysis.images.forEach((image, index) => {
    if (!image.hasAlt) {
      const keyword = targetKeywords[index % targetKeywords.length] || 'SEO';
      const optimizedAlt = `${keyword}に関連する画像`;
      optimizedHtml = optimizedHtml.replace(
        new RegExp(`<img([^>]*src=["']${image.src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*)>`, 'gi'),
        `<img$1 alt="${optimizedAlt}">`
      );
      improvements.content.imagesOptimized++;
    }
  });
  
  // 構造化データの追加
  if (!analysis.hasStructuredData && mode !== 'basic') {
    const structuredData = {
      "@context": "http://schema.org",
      "@type": "Article",
      "headline": analysis.title || "SEO最適化記事",
      "description": analysis.description || "SEO最適化された詳細記事",
      "datePublished": new Date().toISOString(),
      "dateModified": new Date().toISOString(),
      "author": {
        "@type": "Person",
        "name": "AI記事生成システム"
      },
      "publisher": {
        "@type": "Organization",
        "name": "SEO記事生成システム"
      },
      "keywords": targetKeywords.join(', ')
    };
    
    optimizedHtml = optimizedHtml.replace(
      /<\/head>/i,
      `<script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>\n</head>`
    );
    improvements.technical.structuredDataAdded = true;
  }
  
  // 見出しの最適化 (advanced/comprehensive モードのみ)
  if (mode === 'advanced' || mode === 'comprehensive') {
    analysis.headings.forEach((heading, index) => {
      if (targetKeywords.length > 0 && !heading.text.toLowerCase().includes(targetKeywords[0].toLowerCase())) {
        const keyword = targetKeywords[index % targetKeywords.length];
        const optimizedHeading = `${heading.text} - ${keyword}の詳細`;
        optimizedHtml = optimizedHtml.replace(
          new RegExp(`<h${heading.level}[^>]*>${heading.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</h${heading.level}>`, 'gi'),
          `<h${heading.level}>${optimizedHeading}</h${heading.level}>`
        );
        improvements.content.headingsOptimized++;
      }
    });
  }
  
  return { optimizedHtml, improvements };
}

// キーワード密度を計算する関数
function calculateKeywordDensity(content: string, keywords: string[]) {
  const textContent = content.replace(/<[^>]*>/g, '').toLowerCase();
  const words = textContent.split(/\s+/).filter(word => word.length > 0);
  const totalWords = words.length;
  
  const density: Record<string, number> = {};
  
  keywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase();
    const count = textContent.split(keywordLower).length - 1;
    density[keyword] = totalWords > 0 ? (count / totalWords) * 100 : 0;
  });
  
  return density;
}

// 読みやすさスコアを計算する関数 (Flesch Reading Ease に近似)
function calculateReadabilityScore(content: string): number {
  const textContent = content.replace(/<[^>]*>/g, '');
  const sentences = textContent.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = textContent.split(/\s+/).filter(w => w.length > 0);
  const syllables = words.reduce((total, word) => total + Math.max(1, word.length / 2), 0);
  
  if (sentences.length === 0 || words.length === 0) return 0;
  
  const avgWordsPerSentence = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;
  
  // 簡易的な読みやすさスコア (0-100)
  const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
  return Math.max(0, Math.min(100, Math.round(score)));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = OptimizeSeoSchema.parse(body);
    
    const {
      htmlContent,
      targetKeywords = [],
      optimizeImages,
      optimizeLinks,
      optimizeHeadings,
      addStructuredData,
      improveMetadata,
      mode
    } = validatedData;
    
    // 元のHTMLを分析
    const originalAnalysis = analyzeSeoElements(htmlContent);
    const originalSeoScore = calculateSeoScore(originalAnalysis, htmlContent);
    
    // HTMLを最適化
    const { optimizedHtml, improvements } = optimizeHtml(htmlContent, originalAnalysis, targetKeywords, mode);
    
    // 最適化後の分析
    const optimizedAnalysis = analyzeSeoElements(optimizedHtml);
    const optimizedSeoScore = calculateSeoScore(optimizedAnalysis, optimizedHtml);
    
    // SEOレポートの生成
    const issues = [];
    if (!originalAnalysis.title || originalAnalysis.title.length < 20) {
      issues.push({
        type: 'critical' as const,
        message: 'タイトルが短すぎるか存在しません',
        recommendation: '20-60文字の魅力的なタイトルを設定してください'
      });
    }
    
    if (!originalAnalysis.description || originalAnalysis.description.length < 120) {
      issues.push({
        type: 'warning' as const,
        message: 'メタディスクリプションが短すぎるか存在しません',
        recommendation: '120-160文字の魅力的な要約を作成してください'
      });
    }
    
    const imagesWithoutAlt = originalAnalysis.images.filter(img => !img.hasAlt).length;
    if (imagesWithoutAlt > 0) {
      issues.push({
        type: 'warning' as const,
        message: `${imagesWithoutAlt}個の画像にalt属性がありません`,
        recommendation: 'すべての画像に適切なalt属性を設定してください'
      });
    }
    
    if (!originalAnalysis.hasOgTags) {
      issues.push({
        type: 'info' as const,
        message: 'OGタグが設定されていません',
        recommendation: 'SNSでのシェア最適化のためOGタグを追加してください'
      });
    }
    
    // 改善内容の詳細
    const improvementDetails = [];
    if (improvements.metadata.titleOptimized) {
      improvementDetails.push({
        category: 'メタデータ',
        before: originalAnalysis.title || '(なし)',
        after: '最適化されたタイトル',
        impact: 'high' as const
      });
    }
    
    if (improvements.metadata.descriptionImproved) {
      improvementDetails.push({
        category: 'メタデータ',
        before: originalAnalysis.description || '(なし)',
        after: '最適化されたディスクリプション',
        impact: 'high' as const
      });
    }
    
    if (improvements.content.imagesOptimized > 0) {
      improvementDetails.push({
        category: '画像最適化',
        before: `${imagesWithoutAlt}個の画像にalt属性なし`,
        after: `${improvements.content.imagesOptimized}個の画像にalt属性を追加`,
        impact: 'medium' as const
      });
    }
    
    if (improvements.technical.structuredDataAdded) {
      improvementDetails.push({
        category: '構造化データ',
        before: '構造化データなし',
        after: 'JSON-LD構造化データを追加',
        impact: 'medium' as const
      });
    }
    
    // キーワード密度とその他の分析
    const keywordDensity = calculateKeywordDensity(htmlContent, targetKeywords);
    const readabilityScore = calculateReadabilityScore(htmlContent);
    const contentLength = htmlContent.replace(/<[^>]*>/g, '').length;
    
    // スコアカテゴリーの決定
    let category: 'poor' | 'fair' | 'good' | 'excellent';
    if (optimizedSeoScore >= 85) category = 'excellent';
    else if (optimizedSeoScore >= 70) category = 'good';
    else if (optimizedSeoScore >= 50) category = 'fair';
    else category = 'poor';
    
    const result: SeoOptimizationResult = {
      success: true,
      data: {
        originalSeoScore,
        optimizedSeoScore,
        optimization: {
          htmlContent: optimizedHtml,
          improvements
        },
        seoReport: {
          score: optimizedSeoScore,
          category,
          issues,
          improvements: improvementDetails
        },
        analytics: {
          keywordDensity,
          readabilityScore,
          contentLength,
          headingStructure: originalAnalysis.headings
        }
      }
    };
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('SEO optimization error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: `入力データが無効です: ${error.errors.map(e => e.message).join(', ')}`
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'SEO最適化処理中にエラーが発生しました'
    }, { status: 500 });
  }
}
