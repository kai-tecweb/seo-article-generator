import { ImageInfo, LinkInfo, StructuredData, SeoReport, DetailedHtmlAnalysis } from '../types/html-analysis';

/**
 * HTMLからメタデータを抽出する
 */
export function extractMetadata(html: string) {
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)/i);
  const keywordsMatch = html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']*)/i);
  const robotsMatch = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)/i);
  const viewportMatch = html.match(/<meta[^>]*name=["']viewport["'][^>]*content=["']([^"']*)/i);
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)/i);
  
  return {
    title: titleMatch ? titleMatch[1].trim() : '',
    description: descMatch ? descMatch[1].trim() : '',
    keywords: keywordsMatch ? keywordsMatch[1].trim() : '',
    robots: robotsMatch ? robotsMatch[1].trim() : '',
    viewport: viewportMatch ? viewportMatch[1].trim() : '',
    canonical: canonicalMatch ? canonicalMatch[1].trim() : '',
  };
}

/**
 * 見出し構造を抽出する
 */
export function extractHeadings(html: string): string[] {
  const headingMatches = html.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi) || [];
  return headingMatches.map(heading => {
    const textMatch = heading.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/i);
    return textMatch ? textMatch[1].replace(/<[^>]*>/g, '').trim() : '';
  });
}

/**
 * 画像情報を抽出する
 */
export function extractImages(html: string): ImageInfo[] {
  const imgMatches = html.match(/<img[^>]*>/gi) || [];
  return imgMatches.map(img => {
    const srcMatch = img.match(/src=["']([^"']*)/i);
    const altMatch = img.match(/alt=["']([^"']*)/i);
    
    return {
      src: srcMatch ? srcMatch[1] : '',
      alt: altMatch ? altMatch[1] : '',
      hasAlt: !!altMatch && altMatch[1].trim() !== '',
    };
  });
}

/**
 * リンク情報を抽出する
 */
export function extractLinks(html: string, baseUrl: string = ''): LinkInfo[] {
  const linkMatches = html.match(/<a[^>]*href[^>]*>(.*?)<\/a>/gi) || [];
  return linkMatches.map(link => {
    const hrefMatch = link.match(/href=["']([^"']*)/i);
    const textMatch = link.match(/<a[^>]*>(.*?)<\/a>/i);
    
    const href = hrefMatch ? hrefMatch[1] : '';
    const text = textMatch ? textMatch[1].replace(/<[^>]*>/g, '').trim() : '';
    
    return {
      href,
      text,
      isInternal: href.startsWith('/') || href.includes(baseUrl),
    };
  });
}

/**
 * 文字数をカウントする
 */
export function countWords(html: string): number {
  const textContent = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  return textContent.length;
}

/**
 * キーワード密度を計算する
 */
export function calculateKeywordDensity(html: string, keywords: string[]): Record<string, number> {
  const textContent = html.replace(/<[^>]*>/g, '').toLowerCase();
  const totalWords = textContent.split(/\s+/).length;
  
  const density: Record<string, number> = {};
  
  keywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase();
    const matches = (textContent.match(new RegExp(keywordLower, 'g')) || []).length;
    density[keyword] = totalWords > 0 ? (matches / totalWords) * 100 : 0;
  });
  
  return density;
}

/**
 * 画像のalt属性を最適化する
 */
export function optimizeImageAlts(html: string, topic: string = '', keywords: string[] = []): { html: string; optimized: number } {
  let optimized = 0;
  
  const optimizedHtml = html.replace(/<img([^>]*?)alt=["']([^"']*?)["']([^>]*?)>/gi, (match, before, altText, after) => {
    if (!altText.trim()) {
      optimized++;
      // キーワードやトピックを活用してalt属性を生成
      let newAlt = '関連画像';
      if (topic) {
        newAlt = `${topic}に関連する画像`;
      }
      if (keywords.length > 0) {
        newAlt = `${keywords[0]}に関する画像`;
      }
      return `<img${before}alt="${newAlt}"${after}>`;
    }
    return match;
  });
  
  // alt属性がない画像も検出・修正
  const finalHtml = optimizedHtml.replace(/<img((?![^>]*alt=)[^>]*?)>/gi, (match, attributes) => {
    optimized++;
    let newAlt = '関連画像';
    if (topic) {
      newAlt = `${topic}に関連する画像`;
    }
    return `<img${attributes} alt="${newAlt}">`;
  });
  
  return { html: finalHtml, optimized };
}

/**
 * 内部リンクを最適化する
 */
export function optimizeInternalLinks(html: string): { html: string; optimized: number } {
  let optimized = 0;
  
  // 曖昧なアンカーテキストのリスト
  const vagueTerms = ['こちら', '詳細', 'ここ', 'クリック', 'リンク', 'もっと見る', '続きを読む'];
  
  const optimizedHtml = html.replace(/<a([^>]*?)>(.*?)<\/a>/gi, (match, attributes, text) => {
    const cleanText = text.replace(/<[^>]*>/g, '').trim();
    
    if (vagueTerms.some(term => cleanText.toLowerCase().includes(term.toLowerCase()))) {
      optimized++;
      // より具体的なアンカーテキストに改善
      const hrefMatch = attributes.match(/href=["']([^"']*)/i);
      if (hrefMatch) {
        const href = hrefMatch[1];
        // URLから適切なアンカーテキストを生成
        const urlParts = href.split('/').filter((part: string) => part);
        const lastPart = urlParts[urlParts.length - 1];
        const improvedText = lastPart ? `${lastPart.replace(/-/g, ' ')}の詳細` : `${cleanText}の詳細情報`;
        return `<a${attributes}>${improvedText}</a>`;
      }
    }
    return match;
  });
  
  return { html: optimizedHtml, optimized };
}

/**
 * 広告を挿入する
 */
export function insertAds(html: string, maxAds: number = 5): { html: string; inserted: number } {
  let inserted = 0;
  
  // H2タグの前に広告を挿入
  const adTemplate = `
    <div class="ad-container" style="margin: 20px 0; text-align: center; padding: 20px; background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 5px;">
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
      <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
    </div>`;
  
  const withH2Ads = html.replace(/<h2/gi, () => {
    if (inserted < maxAds) {
      inserted++;
      return `${adTemplate}<h2`;
    }
    return '<h2';
  });
  
  // 記事の終わりに広告を挿入
  if (inserted < maxAds && withH2Ads.includes('</body>')) {
    const finalHtml = withH2Ads.replace('</body>', `${adTemplate}\n</body>`);
    inserted++;
    return { html: finalHtml, inserted };
  }
  
  return { html: withH2Ads, inserted };
}

/**
 * 構造化データを生成する
 */
export function generateStructuredData(title: string, description: string, imageUrl?: string): StructuredData {
  const now = new Date().toISOString();
  
  return {
    "@context": "http://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "datePublished": now,
    "dateModified": now,
    "author": {
      "@type": "Person",
      "name": process.env.NEXT_PUBLIC_AUTHOR_NAME || "AI記事生成システム"
    },
    "publisher": {
      "@type": "Organization",
      "name": process.env.NEXT_PUBLIC_APP_NAME || "SEO記事生成システム"
    },
    ...(imageUrl && { image: [imageUrl] })
  };
}

/**
 * SEOスコアを計算する
 */
export function calculateSeoScore(
  metadata: any,
  headings: string[],
  images: ImageInfo[],
  links: LinkInfo[],
  improvements: any
): SeoReport {
  let score = 100;
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  // タイトルチェック
  if (!metadata.title) {
    score -= 20;
    issues.push('タイトルタグがありません');
    recommendations.push('魅力的で具体的なタイトルを設定してください');
  } else if (metadata.title.length < 20) {
    score -= 15;
    issues.push('タイトルが短すぎます（20文字以上推奨）');
    recommendations.push('より詳細で魅力的なタイトルに変更してください');
  } else if (metadata.title.length > 60) {
    score -= 10;
    issues.push('タイトルが長すぎます（60文字以下推奨）');
    recommendations.push('タイトルを簡潔にまとめてください');
  }
  
  // ディスクリプションチェック
  if (!metadata.description) {
    score -= 20;
    issues.push('メタディスクリプションがありません');
    recommendations.push('検索結果で表示される魅力的な要約を作成してください');
  } else if (metadata.description.length < 120) {
    score -= 15;
    issues.push('メタディスクリプションが短すぎます（120-160文字推奨）');
    recommendations.push('より詳細で魅力的な説明文を作成してください');
  } else if (metadata.description.length > 160) {
    score -= 10;
    issues.push('メタディスクリプションが長すぎます（160文字以下推奨）');
    recommendations.push('説明文を簡潔にまとめてください');
  }
  
  // 見出し構造チェック
  if (headings.length < 3) {
    score -= 15;
    issues.push('見出しが少なすぎます（3個以上推奨）');
    recommendations.push('論理的な見出し構造を作成してください');
  }
  
  // 画像alt属性チェック
  const imagesWithoutAlt = images.filter(img => !img.hasAlt);
  if (imagesWithoutAlt.length > 0) {
    score -= Math.min(imagesWithoutAlt.length * 5, 20);
    issues.push(`${imagesWithoutAlt.length}個の画像にalt属性がありません`);
    recommendations.push('すべての画像に適切なalt属性を設定してください');
  }
  
  // 内部リンクチェック
  const internalLinks = links.filter(link => link.isInternal);
  if (internalLinks.length < 2) {
    score -= 10;
    issues.push('内部リンクが不足しています（2個以上推奨）');
    recommendations.push('関連記事への内部リンクを追加してください');
  }
  
  // canonicalURLチェック
  if (!metadata.canonical) {
    score -= 5;
    issues.push('canonical URLが設定されていません');
    recommendations.push('重複コンテンツ対策としてcanonical URLを設定してください');
  }
  
  // viewportチェック
  if (!metadata.viewport) {
    score -= 5;
    issues.push('viewport設定がありません');
    recommendations.push('モバイル対応のためviewport設定を追加してください');
  }
  
  return { 
    score: Math.max(0, Math.round(score)), 
    issues, 
    recommendations 
  };
}

/**
 * 詳細なHTML解析を実行する
 */
export function performDetailedHtmlAnalysis(html: string, baseUrl: string = ''): DetailedHtmlAnalysis {
  const metadata = extractMetadata(html);
  const headings = extractHeadings(html);
  const images = extractImages(html);
  const links = extractLinks(html, baseUrl);
  const wordCount = countWords(html);
  
  // OGPタグの抽出
  const socialMediaTags: Record<string, string> = {};
  const ogMatches = html.match(/<meta[^>]*property=["']og:[^"']*["'][^>]*>/gi) || [];
  ogMatches.forEach(tag => {
    const propertyMatch = tag.match(/property=["']og:([^"']*)["']/i);
    const contentMatch = tag.match(/content=["']([^"']*)["']/i);
    if (propertyMatch && contentMatch) {
      socialMediaTags[`og:${propertyMatch[1]}`] = contentMatch[1];
    }
  });
  
  // 技術的SEO要素のチェック
  const technicalSeo = {
    hasLangAttribute: /<html[^>]*lang=/i.test(html),
    hasMetaViewport: !!metadata.viewport,
    hasCanonicalUrl: !!metadata.canonical,
    hasRobotsMeta: !!metadata.robots,
  };
  
  return {
    title: metadata.title,
    description: metadata.description,
    headings,
    images,
    links,
    structuredData: null, // 構造化データの解析は別途実装
    wordCount,
    readabilityScore: 0, // 読みやすさスコアは別途実装
    keywordDensity: {}, // キーワード密度は呼び出し元で設定
    metaTags: metadata,
    socialMediaTags,
    technicalSeo,
  };
}
