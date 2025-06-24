/**
 * Yahoo!トレンド分析パネル コンポーネント
 * 選択されたトレンドキーワードの詳細分析結果を表示
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Users, 
  Globe, 
  Lightbulb,
  Copy,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  TrendAnalysisResult, 
  TrendAnalysisResponse,
  TrendAnalysisPanelProps 
} from '@/types/yahoo-trending';

/**
 * Yahoo!トレンド分析パネル コンポーネント
 */
export const TrendAnalysisPanel: React.FC<TrendAnalysisPanelProps> = ({
  keyword,
  analysisData,
  isLoading,
  error,
  onAnalyze,
  className
}) => {
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  /**
   * テキストをクリップボードにコピー
   */
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(label);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (error) {
      console.error('コピーに失敗:', error);
    }
  };

  /**
   * 分析スコアによる色分け
   */
  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  /**
   * 難易度スコアによる表示
   */
  const getDifficultyLabel = (score: number): { label: string; color: string } => {
    if (score <= 3) return { label: '易しい', color: 'text-green-600' };
    if (score <= 6) return { label: '普通', color: 'text-yellow-600' };
    return { label: '難しい', color: 'text-red-600' };
  };

  if (!keyword) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            トレンド詳細分析
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              キーワードを選択して分析を開始してください
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            トレンド詳細分析
          </CardTitle>
          <Button
            onClick={() => onAnalyze(keyword)}
            disabled={isLoading}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Zap className="h-4 w-4 mr-1" />
            分析実行
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          対象キーワード: <span className="font-medium text-blue-600">{keyword}</span>
        </div>
      </CardHeader>

      <CardContent>
        {/* ローディング表示 */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-sm text-muted-foreground">AI分析中...</span>
          </div>
        )}

        {/* エラー表示 */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* 分析結果表示 */}
        {analysisData && !isLoading && (
          <div className="space-y-6">
            {/* 分析スコア */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <div className={cn("text-2xl font-bold", getScoreColor(analysisData.analysisScore))}>
                  {analysisData.analysisScore}点
                </div>
                <div className="text-sm text-muted-foreground">分析スコア</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {analysisData.estimatedTrafficPotential.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">推定PV/月</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                <div className={cn("text-2xl font-bold", getDifficultyLabel(analysisData.difficultyScore).color)}>
                  {getDifficultyLabel(analysisData.difficultyScore).label}
                </div>
                <div className="text-sm text-muted-foreground">競合難易度</div>
              </div>
            </div>

            <Separator />

            {/* 急上昇理由 */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                急上昇理由
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {analysisData.trendReason}
              </p>
            </div>

            <Separator />

            {/* 推奨タイトル */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  推奨記事タイトル
                </h3>
                <Button
                  onClick={() => copyToClipboard(analysisData.recommendedTitle, 'タイトル')}
                  size="sm"
                  variant="outline"
                  className="text-xs"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  {copySuccess === 'タイトル' ? 'コピー済み' : 'コピー'}
                </Button>
              </div>
              <div className="p-3 bg-blue-50 rounded-md">
                <p className="text-sm font-medium text-blue-800">
                  {analysisData.recommendedTitle}
                </p>
              </div>
            </div>

            <Separator />

            {/* SEOキーワード */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-600" />
                SEOキーワード
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysisData.seoKeywords.map((seoKeyword, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {seoKeyword}
                  </Badge>
                ))}
              </div>
              
              {/* キーワード密度 */}
              <div className="grid grid-cols-3 gap-3 mt-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>メイン</span>
                    <span>{analysisData.keywordDensity.primary}%</span>
                  </div>
                  <Progress value={analysisData.keywordDensity.primary * 20} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>関連</span>
                    <span>{analysisData.keywordDensity.secondary}%</span>
                  </div>
                  <Progress value={analysisData.keywordDensity.secondary * 25} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>ロングテール</span>
                    <span>{analysisData.keywordDensity.longtail}%</span>
                  </div>
                  <Progress value={analysisData.keywordDensity.longtail * 50} className="h-2" />
                </div>
              </div>
            </div>

            <Separator />

            {/* 競合分析 */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                競合分析・差別化ポイント
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 rounded-md">
                  <h4 className="text-sm font-medium text-yellow-800 mb-1">競合記事のギャップ</h4>
                  <p className="text-sm text-yellow-700">{analysisData.competitorInsights.gap}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-md">
                  <h4 className="text-sm font-medium text-green-800 mb-1">記事作成機会</h4>
                  <p className="text-sm text-green-700">{analysisData.competitorInsights.opportunity}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">差別化ポイント</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisData.competitorInsights.differentiationPoints.map((point, index) => (
                      <Badge key={index} className="bg-purple-100 text-purple-800 text-xs">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {point}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* コンテンツ提案 */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-blue-600" />
                コンテンツ作成提案
              </h3>
              
              {/* 記事構成案 */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">記事構成案</h4>
                <ScrollArea className="h-32 border rounded-md p-3">
                  <ol className="space-y-1">
                    {analysisData.contentSuggestions.outline.map((item, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-blue-600 font-medium">{index + 1}.</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                </ScrollArea>
              </div>

              {/* 推奨見出し */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">推奨見出し（H2）</h4>
                <div className="space-y-1">
                  {analysisData.contentSuggestions.headlines.slice(0, 3).map((headline, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                      <span>{headline}</span>
                      <Button
                        onClick={() => copyToClipboard(headline, `見出し${index + 1}`)}
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            {/* 関連ニュース */}
            {analysisData.relatedNews.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-blue-600" />
                  関連ニュース
                </h3>
                <div className="space-y-2">
                  {analysisData.relatedNews.map((news, index) => (
                    <div key={index} className="p-3 border rounded-md hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium line-clamp-2">{news.title}</h4>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span>{news.source}</span>
                            <span>•</span>
                            <span>{new Date(news.publishedAt).toLocaleDateString('ja-JP')}</span>
                          </div>
                        </div>
                        <Button
                          asChild
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2"
                        >
                          <a href={news.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrendAnalysisPanel;
