import { NextRequest, NextResponse } from 'next/server';
import {
  ArticleAdInsertionRequest,
  ArticleAdInsertionResponse,
  AdConfig,
  AdPlacement,
  AdType,
  STANDARD_AD_SIZES
} from '@/types/ad-management';

// 広告挿入のヘルパー関数
class AdInserter {
  private adConfigs: AdConfig[] = [];
  private articleContent: string = '';
  private articleMeta: any = {};

  constructor(adConfigs: AdConfig[], articleContent: string, articleMeta: any) {
    this.adConfigs = adConfigs;
    this.articleContent = articleContent;
    this.articleMeta = articleMeta;
  }

  // 記事に広告を挿入
  insertAds(previewMode = false): {
    enhancedContent: string;
    insertedAds: any[];
    summary: any;
  } {
    let content = this.articleContent;
    const insertedAds: any[] = [];
    let totalEstimatedRevenue = 0;

    // 各広告設定について処理
    for (const adConfig of this.adConfigs) {
      if (!this.shouldDisplayAd(adConfig)) {
        continue;
      }

      const insertResult = this.insertAdByPlacement(content, adConfig, previewMode);
      if (insertResult.success) {
        content = insertResult.content;
        insertedAds.push({
          adId: adConfig.id,
          placement: adConfig.placement,
          position: insertResult.position,
          estimatedRevenue: this.estimateRevenue(adConfig)
        });
        totalEstimatedRevenue += this.estimateRevenue(adConfig);
      }
    }

    const summary = {
      totalAdsInserted: insertedAds.length,
      estimatedTotalRevenue: totalEstimatedRevenue,
      adDensity: this.calculateAdDensity(insertedAds.length)
    };

    return {
      enhancedContent: content,
      insertedAds,
      summary
    };
  }

  // 広告を表示すべきかチェック
  private shouldDisplayAd(adConfig: AdConfig): boolean {
    if (!adConfig.isActive) {
      return false;
    }

    // 文字数チェック
    if (adConfig.displayConditions.minWordCount && 
        this.articleMeta.wordCount < adConfig.displayConditions.minWordCount) {
      return false;
    }

    // カテゴリ制限チェック
    if (adConfig.displayConditions.categoryRestriction && 
        this.articleMeta.category &&
        !adConfig.displayConditions.categoryRestriction.includes(this.articleMeta.category)) {
      return false;
    }

    // 除外キーワードチェック
    if (adConfig.displayConditions.excludeKeywords && this.articleMeta.keywords) {
      const hasExcludedKeyword = adConfig.displayConditions.excludeKeywords.some(
        keyword => this.articleMeta.keywords.includes(keyword)
      );
      if (hasExcludedKeyword) {
        return false;
      }
    }

    return true;
  }

  // 配置位置に応じて広告を挿入
  private insertAdByPlacement(content: string, adConfig: AdConfig, previewMode: boolean) {
    const adHtml = this.generateAdHtml(adConfig, previewMode);

    switch (adConfig.placement) {
      case 'header':
        return {
          success: true,
          content: adHtml + '\n\n' + content,
          position: 0
        };

      case 'footer':
        return {
          success: true,
          content: content + '\n\n' + adHtml,
          position: content.length
        };

      case 'after-title':
        const titleMatch = content.match(/^#\s+(.+)$/m);
        if (titleMatch) {
          const insertPos = titleMatch.index! + titleMatch[0].length;
          return {
            success: true,
            content: content.slice(0, insertPos) + '\n\n' + adHtml + '\n\n' + content.slice(insertPos),
            position: insertPos
          };
        }
        break;

      case 'before-conclusion':
        const conclusionPatterns = [
          /##?\s*(まとめ|結論|さいごに|終わりに|最後に)/i,
          /##?\s*(conclusion|summary)/i
        ];
        
        for (const pattern of conclusionPatterns) {
          const match = content.match(pattern);
          if (match) {
            const insertPos = match.index!;
            return {
              success: true,
              content: content.slice(0, insertPos) + adHtml + '\n\n' + content.slice(insertPos),
              position: insertPos
            };
          }
        }
        break;

      case 'between-paragraphs':
        return this.insertBetweenParagraphs(content, adHtml);

      case 'in-content':
        return this.insertInContent(content, adHtml);

      case 'sidebar':
        // サイドバー広告は特別な処理が必要
        return {
          success: true,
          content: content + `\n\n<!-- SIDEBAR_AD:${adConfig.id} -->\n${adHtml}\n<!-- /SIDEBAR_AD -->`,
          position: content.length
        };

      default:
        return { success: false, content, position: -1 };
    }

    return { success: false, content, position: -1 };
  }

  // 段落間に広告を挿入
  private insertBetweenParagraphs(content: string, adHtml: string) {
    const paragraphs = content.split('\n\n');
    if (paragraphs.length < 3) {
      return { success: false, content, position: -1 };
    }

    // 中央付近の段落を狙う
    const targetIndex = Math.floor(paragraphs.length / 2);
    paragraphs.splice(targetIndex, 0, adHtml);
    
    const newContent = paragraphs.join('\n\n');
    const position = paragraphs.slice(0, targetIndex).join('\n\n').length;

    return {
      success: true,
      content: newContent,
      position
    };
  }

  // コンテンツ内の適切な位置に広告を挿入
  private insertInContent(content: string, adHtml: string) {
    const lines = content.split('\n');
    const contentLines = lines.filter(line => 
      line.trim() && 
      !line.startsWith('#') && 
      !line.startsWith('![') &&
      line.length > 50
    );

    if (contentLines.length < 2) {
      return { success: false, content, position: -1 };
    }

    // コンテンツの1/3地点付近に挿入
    const targetLine = contentLines[Math.floor(contentLines.length / 3)];
    const targetIndex = lines.indexOf(targetLine);
    
    lines.splice(targetIndex + 1, 0, '', adHtml, '');
    
    const newContent = lines.join('\n');
    const position = lines.slice(0, targetIndex + 1).join('\n').length;

    return {
      success: true,
      content: newContent,
      position
    };
  }

  // 広告HTMLを生成
  private generateAdHtml(adConfig: AdConfig, previewMode: boolean): string {
    if (previewMode) {
      return this.generatePreviewHtml(adConfig);
    }

    let html = '';

    // ラベル
    if (adConfig.style.showLabel) {
      html += `<div class="ad-label" style="text-align: center; font-size: 12px; color: #666; margin-bottom: 5px;">${adConfig.style.labelText || '広告'}</div>\n`;
    }

    // 広告コンテナ
    const containerStyle = this.buildContainerStyle(adConfig);
    html += `<div class="ad-container" style="${containerStyle}">\n`;
    html += adConfig.adCode;
    html += '\n</div>';

    return html;
  }

  // プレビュー用のHTMLを生成
  private generatePreviewHtml(adConfig: AdConfig): string {
    const { width, height } = adConfig.size;
    const sizeText = width === 0 ? 'レスポンシブ' : `${width}x${height}`;
    
    let html = '';
    
    if (adConfig.style.showLabel) {
      html += `<div style="text-align: center; font-size: 12px; color: #666; margin-bottom: 5px;">${adConfig.style.labelText || '広告'}</div>\n`;
    }

    const containerStyle = this.buildContainerStyle(adConfig);
    const previewStyle = width === 0 
      ? 'width: 100%; height: 250px;' 
      : `width: ${width}px; height: ${height}px;`;

    html += `<div class="ad-preview" style="${containerStyle}">\n`;
    html += `  <div style="${previewStyle} background: #f0f0f0; border: 2px dashed #ccc; display: flex; align-items: center; justify-content: center; color: #666; font-family: sans-serif;">\n`;
    html += `    <div style="text-align: center;">\n`;
    html += `      <div style="font-weight: bold; margin-bottom: 5px;">${adConfig.name}</div>\n`;
    html += `      <div style="font-size: 12px;">${sizeText}</div>\n`;
    html += `      <div style="font-size: 10px; margin-top: 5px;">配置: ${adConfig.placement}</div>\n`;
    html += `    </div>\n`;
    html += `  </div>\n`;
    html += '</div>';

    return html;
  }

  // コンテナスタイルを構築
  private buildContainerStyle(adConfig: AdConfig): string {
    const styles: string[] = [];

    if (adConfig.style.margin) {
      styles.push(`margin: ${adConfig.style.margin}`);
    }

    if (adConfig.style.centerAlign) {
      styles.push('text-align: center');
    }

    return styles.join('; ');
  }

  // 収益を推定
  private estimateRevenue(adConfig: AdConfig): number {
    // 簡単な推定ロジック（実際は複雑なアルゴリズムを使用）
    const baseRevenue = {
      'header': 0.50,
      'footer': 0.20,
      'in-content': 0.80,
      'between-paragraphs': 0.60,
      'sidebar': 0.30,
      'after-title': 0.40,
      'before-conclusion': 0.35,
      'floating': 0.70
    };

    return baseRevenue[adConfig.placement as keyof typeof baseRevenue] || 0.25;
  }

  // 広告密度を計算
  private calculateAdDensity(adCount: number): number {
    if (this.articleMeta.wordCount === 0) return 0;
    return (adCount / this.articleMeta.wordCount) * 1000; // 1000文字あたりの広告数
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ArticleAdInsertionRequest = await request.json();

    if (!body.articleContent || !body.articleMeta) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'MISSING_PARAMETERS',
          message: '記事コンテンツまたはメタデータが指定されていません'
        }
      } as ArticleAdInsertionResponse, { status: 400 });
    }

    // 使用する広告設定を取得（実際はデータベースから取得）
    const mockAdConfigs = await getMockAdConfigs(body.adConfigIds);

    // 自動配置が有効な場合は、推奨広告を追加
    if (body.autoPlacement?.enabled) {
      const autoAds = generateAutoAds(body.articleMeta, body.autoPlacement);
      mockAdConfigs.push(...(autoAds as any[]));
    }

    // 広告挿入を実行
    const inserter = new AdInserter(mockAdConfigs, body.articleContent, body.articleMeta);
    const result = inserter.insertAds(body.previewMode);

    return NextResponse.json({
      success: true,
      data: result
    } as ArticleAdInsertionResponse);

  } catch (error) {
    console.error('広告挿入エラー:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '内部エラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    } as ArticleAdInsertionResponse, { status: 500 });
  }
}

// モック広告設定を取得
async function getMockAdConfigs(adConfigIds?: string[]) {
  // 実際はデータベースから取得
  const allAds = [
    {
      id: 'header-ad',
      name: 'ヘッダー広告',
      type: 'display' as const,
      adCode: '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-xxxxxxxxxx" data-ad-slot="xxxxxxxxx" data-ad-format="auto"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script>',
      size: STANDARD_AD_SIZES.find(s => s.name === 'Leaderboard')!,
      placement: 'header' as AdPlacement,
      displayConditions: {
        minWordCount: 500,
        deviceRestriction: 'all' as const
      },
      style: {
        centerAlign: true,
        showLabel: true,
        labelText: '広告',
        margin: '20px 0'
      },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'content-ad',
      name: 'コンテンツ内広告',
      type: 'responsive' as const,
      adCode: '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-xxxxxxxxxx" data-ad-slot="yyyyyyyyy" data-ad-format="auto"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script>',
      size: STANDARD_AD_SIZES.find(s => s.name === 'Responsive')!,
      placement: 'in-content' as AdPlacement,
      displayConditions: {
        minWordCount: 800,
        deviceRestriction: 'all' as const
      },
      style: {
        centerAlign: true,
        showLabel: true,
        labelText: 'スポンサーリンク',
        margin: '30px 0'
      },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  if (adConfigIds && adConfigIds.length > 0) {
    return allAds.filter(ad => adConfigIds.includes(ad.id));
  }

  return allAds;
}

// 自動配置のための広告を生成
function generateAutoAds(articleMeta: any, autoPlacement: any): AdConfig[] {
  const autoAds: AdConfig[] = [];
  
  // 文字数に基づく推奨広告
  for (const rule of autoPlacement.wordCountRules || []) {
    if (articleMeta.wordCount >= rule.minWords && articleMeta.wordCount <= rule.maxWords) {
      for (let i = 0; i < rule.recommendedAdCount; i++) {
        autoAds.push({
          id: `auto-ad-${i}`,
          name: `自動配置広告 ${i + 1}`,
          type: (rule.recommendedAdTypes[0] || 'display') as AdType,
          adCode: '<div>自動生成広告プレースホルダー</div>',
          size: STANDARD_AD_SIZES.find(s => s.name === 'Responsive')!,
          placement: (i === 0 ? 'in-content' : 'between-paragraphs') as AdPlacement,
          displayConditions: {
            minWordCount: rule.minWords,
            deviceRestriction: 'all' as const
          },
          style: {
            centerAlign: true,
            showLabel: true,
            labelText: 'スポンサーリンク',
            margin: '25px 0'
          },
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      break;
    }
  }

  return autoAds;
}
