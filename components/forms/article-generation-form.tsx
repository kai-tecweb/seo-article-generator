'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, FileText, Globe, Image, TrendingUp, Clock, Save, Send, Target, Zap } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  ArticleGenerationRequest, 
  ArticleGenerationResponse, 
  ImageGenerationOptions 
} from "@/types/article-generation";
import { TrendAnalysisResult } from "@/types/yahoo-trending";
import AdInsertionControl from '@/components/forms/ad-insertion-control';
import WordPressPublishControl from '@/components/forms/wordpress-publish-control';
import YahooTrendingSelector from '@/components/forms/yahoo-trending-selector';
import TrendAnalysisPanel from '@/components/forms/trend-analysis-panel';

export default function ArticleGenerationForm() {
  const [formData, setFormData] = useState<ArticleGenerationRequest>({
    topic: '',
    targetKeywords: [],
    contentLength: 'medium',
    tone: 'professional',
    includeAds: true,
    generateImage: true,
    optimizeForSeo: true,
    targetAudience: '',
    customInstructions: ''
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<ArticleGenerationResponse | null>(null);
  const [contentWithAds, setContentWithAds] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('generation');

  // 広告挿入の設定
  const [adInsertionSettings, setAdInsertionSettings] = useState<any>(null);
  
  // WordPress投稿の設定
  const [wordPressPublishSettings, setWordPressPublishSettings] = useState<any>(null);
  
  // Yahoo!トレンド機能の状態
  const [selectedTrendKeyword, setSelectedTrendKeyword] = useState<string>('');
  const [trendAnalysisData, setTrendAnalysisData] = useState<TrendAnalysisResult | null>(null);
  const [isAnalyzingTrend, setIsAnalyzingTrend] = useState(false);
  const [trendAnalysisError, setTrendAnalysisError] = useState<string | null>(null);
  
  // 現在のステップ（生成プロセスの管理）
  const [currentStep, setCurrentStep] = useState<'form' | 'generated' | 'with-ads' | 'published'>('form');

  const handleInputChange = (field: keyof ArticleGenerationRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleKeywordAdd = () => {
    if (keywordInput.trim() && !formData.targetKeywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        targetKeywords: [...prev.targetKeywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const handleKeywordRemove = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      targetKeywords: prev.targetKeywords.filter(k => k !== keyword)
    }));
  };

  const handleGenerate = async () => {
    if (!formData.topic.trim()) {
      setError('記事のトピックを入力してください');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGenerationProgress(0);

    try {
      // 進捗を段階的に更新
      setGenerationProgress(10);
      
      // 記事生成API呼び出し
      const response = await fetch('/api/generate-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      setGenerationProgress(50);

      if (!response.ok) {
        throw new Error(`記事生成に失敗しました: ${response.status}`);
      }

      const result = await response.json();
      setGenerationProgress(80);

      // 画像生成が有効な場合
      if (formData.generateImage && result.success) {
        try {
          const imageResponse = await fetch('/api/generate-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prompt: `${result.title} - ブログ記事のアイキャッチ画像`,
              style: 'realistic',
              aspectRatio: '16:9'
            }),
          });

          if (imageResponse.ok) {
            const imageResult = await imageResponse.json();
            result.imageUrl = imageResult.imageUrl;
          }
        } catch (err) {
          console.warn('画像生成に失敗しました:', err);
        }
      }

      setGenerationProgress(100);
      setGeneratedContent(result);
      setContentWithAds(result.content); // 初期状態では広告なしのコンテンツ
      setCurrentStep('generated');
      setActiveTab('ads'); // 記事生成後は広告設定タブに自動移動
    } catch (err) {
      setError(err instanceof Error ? err.message : '記事生成中にエラーが発生しました');
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationProgress(0), 1000);
    }
  };

  // 広告挿入完了時の処理
  const handleAdInsertionComplete = (contentWithAds: string) => {
    setContentWithAds(contentWithAds);
    setCurrentStep('with-ads');
    setActiveTab('wordpress'); // 広告挿入後はWordPress投稿タブに移動
  };

  // WordPress投稿完了時の処理
  const handleWordPressPublished = (postData: any) => {
    setCurrentStep('published');
    alert(`WordPressに投稿が完了しました！\n投稿URL: ${postData.url}`);
  };

  const handleSaveToNotion = async () => {
    if (!generatedContent) return;

    try {
      const response = await fetch('/api/save-to-notion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: generatedContent.title,
          content: generatedContent.content,
          metaDescription: generatedContent.metaDescription,
          seoScore: generatedContent.seoScore,
          keywords: generatedContent.keywords
        }),
      });

      if (!response.ok) {
        throw new Error('Notionへの保存に失敗しました');
      }

      alert('Notionに正常に保存されました！');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Notion保存中にエラーが発生しました');
    }
  };

  const handleSchedulePost = () => {
    // 投稿スケジューリング画面への遷移
    if (generatedContent) {
      // 生成された記事データを保存してから遷移
      const articleData = {
        title: generatedContent.title,
        content: generatedContent.content,
        metaDescription: generatedContent.metaDescription,
        imageUrl: generatedContent.imageUrl
      };
      
      // ローカルストレージに一時保存
      localStorage.setItem('pendingSchedulePost', JSON.stringify(articleData));
      
      // 投稿スケジュール画面に遷移
      window.location.href = '/post-schedule';
    } else {
      console.log('投稿スケジューリング画面に遷移');
    }
  };

  // Yahoo!トレンド関連の関数
  const handleTrendKeywordChange = (keyword: string, trendData?: any) => {
    setSelectedTrendKeyword(keyword);
    
    // トレンドキーワードを記事トピックに適用
    if (keyword && trendData) {
      const enhancedTopic = `${keyword}について詳しく解説した記事を作成してください。最新のトレンドと実用的な情報を含めて、読者に価値を提供する内容にしてください。`;
      
      setFormData(prev => ({
        ...prev,
        topic: enhancedTopic,
        targetKeywords: [...new Set([...prev.targetKeywords, keyword])] // 重複を避けて追加
      }));
      
      // トレンド分析を自動実行
      handleTrendAnalyze(keyword);
    }
  };

  const handleTrendAnalyze = async (keyword: string) => {
    if (!keyword.trim()) return;
    
    setIsAnalyzingTrend(true);
    setTrendAnalysisError(null);
    
    try {
      const response = await fetch('/api/yahoo-trending/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword }),
      });

      if (!response.ok) {
        throw new Error('トレンド分析に失敗しました');
      }

      const result = await response.json();
      if (result.success) {
        setTrendAnalysisData(result.data);
        
        // 分析結果を記事生成設定に反映
        if (result.data) {
          setFormData(prev => ({
            ...prev,
            topic: result.data.recommendedTitle || prev.topic,
            targetKeywords: [...new Set([...prev.targetKeywords, ...result.data.seoKeywords])]
          }));
        }
      } else {
        throw new Error(result.error || 'トレンド分析に失敗しました');
      }
    } catch (err) {
      console.error('トレンド分析エラー:', err);
      setTrendAnalysisError(err instanceof Error ? err.message : 'トレンド分析中にエラーが発生しました');
    } finally {
      setIsAnalyzingTrend(false);
    }
  };

  const getSeoScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getContentLengthDescription = (length: string) => {
    switch (length) {
      case 'short': return '800-1200文字';
      case 'medium': return '1500-2500文字';
      case 'long': return '3000-5000文字';
      default: return '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            AI記事生成
          </CardTitle>
          <CardDescription>
            OpenAI APIを使用してSEO最適化された記事を自動生成します
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Yahoo!急上昇ワード セレクター */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <YahooTrendingSelector
                currentKeyword={selectedTrendKeyword}
                onKeywordChange={handleTrendKeywordChange}
                disabled={isGenerating}
                displayLimit={5}
              />
              <TrendAnalysisPanel
                keyword={selectedTrendKeyword}
                analysisData={trendAnalysisData || undefined}
                isLoading={isAnalyzingTrend}
                error={trendAnalysisError || undefined}
                onAnalyze={handleTrendAnalyze}
              />
            </div>
          </div>

          {/* 記事トピック */}
          <div className="space-y-2">
            <Label htmlFor="topic">記事のトピック *</Label>
            <Textarea
              id="topic"
              placeholder="例：ChatGPTを使った効率的な記事作成方法について詳しく解説してください"
              value={formData.topic}
              onChange={(e) => handleInputChange('topic', e.target.value)}
              rows={3}
            />
          </div>

          {/* ターゲットキーワード */}
          <div className="space-y-2">
            <Label htmlFor="keywords">ターゲットキーワード</Label>
            <div className="flex gap-2">
              <Input
                id="keywords"
                placeholder="キーワードを入力してEnterで追加"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleKeywordAdd())}
              />
              <Button type="button" onClick={handleKeywordAdd} variant="outline">
                追加
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.targetKeywords.map((keyword, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="cursor-pointer"
                  onClick={() => handleKeywordRemove(keyword)}
                >
                  {keyword} ×
                </Badge>
              ))}
            </div>
          </div>

          {/* 記事設定 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 記事の長さ */}
            <div className="space-y-2">
              <Label>記事の長さ</Label>
              <Select 
                value={formData.contentLength} 
                onValueChange={(value: 'short' | 'medium' | 'long') => handleInputChange('contentLength', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">ショート ({getContentLengthDescription('short')})</SelectItem>
                  <SelectItem value="medium">ミディアム ({getContentLengthDescription('medium')})</SelectItem>
                  <SelectItem value="long">ロング ({getContentLengthDescription('long')})</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 記事のトーン */}
            <div className="space-y-2">
              <Label>記事のトーン</Label>
              <Select 
                value={formData.tone} 
                onValueChange={(value: 'professional' | 'casual' | 'educational') => handleInputChange('tone', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">プロフェッショナル</SelectItem>
                  <SelectItem value="casual">カジュアル</SelectItem>
                  <SelectItem value="educational">教育的</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ターゲット読者 */}
          <div className="space-y-2">
            <Label htmlFor="audience">ターゲット読者（任意）</Label>
            <Input
              id="audience"
              placeholder="例：IT初心者、マーケティング担当者、経営者"
              value={formData.targetAudience}
              onChange={(e) => handleInputChange('targetAudience', e.target.value)}
            />
          </div>

          {/* オプション設定 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="includeAds"
                checked={formData.includeAds}
                onCheckedChange={(checked) => handleInputChange('includeAds', checked)}
              />
              <Label htmlFor="includeAds">広告を挿入</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="generateImage"
                checked={formData.generateImage}
                onCheckedChange={(checked) => handleInputChange('generateImage', checked)}
              />
              <Label htmlFor="generateImage">画像を生成</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="optimizeForSeo"
                checked={formData.optimizeForSeo}
                onCheckedChange={(checked) => handleInputChange('optimizeForSeo', checked)}
              />
              <Label htmlFor="optimizeForSeo">SEO最適化</Label>
            </div>
          </div>

          {/* カスタム指示 */}
          <div className="space-y-2">
            <Label htmlFor="instructions">カスタム指示（任意）</Label>
            <Textarea
              id="instructions"
              placeholder="特別な要求や注意事項があれば記入してください"
              value={formData.customInstructions}
              onChange={(e) => handleInputChange('customInstructions', e.target.value)}
              rows={2}
            />
          </div>

          {/* エラー表示 */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* 進捗バー */}
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>記事を生成中...</span>
                <span>{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} className="w-full" />
            </div>
          )}

          {/* 生成ボタン */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !formData.topic.trim()}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                記事を生成中...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                記事を生成
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* 生成結果表示 */}
      {generatedContent && generatedContent.success && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                生成結果
              </span>
              <div className="flex gap-2">
                <Badge className={`${getSeoScoreColor(generatedContent.seoScore)} text-white`}>
                  SEOスコア: {generatedContent.seoScore}
                </Badge>
                <Badge variant="outline">
                  {generatedContent.wordCount} 文字
                </Badge>
                <Badge variant="outline">
                  読了時間: {generatedContent.estimatedReadTime} 分
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="preview">プレビュー</TabsTrigger>
                <TabsTrigger value="html">HTMLソース</TabsTrigger>
                <TabsTrigger value="seo">SEO分析</TabsTrigger>
                <TabsTrigger value="keywords">キーワード</TabsTrigger>
                <TabsTrigger value="ads" disabled={!generatedContent}>
                  <Target className="w-4 h-4 mr-2" />
                  広告設定
                </TabsTrigger>
                <TabsTrigger value="wordpress" disabled={!generatedContent}>
                  <Globe className="w-4 h-4 mr-2" />
                  WordPress投稿
                </TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold mb-4">{generatedContent.title}</h1>
                  <p className="text-gray-600 mb-6 italic">{generatedContent.metaDescription}</p>
                  
                  {generatedContent.imageUrl && (
                    <div className="mb-6">
                      <img
                        src={generatedContent.imageUrl}
                        alt={generatedContent.title}
                        className="w-full max-w-2xl mx-auto rounded-lg shadow-md"
                      />
                    </div>
                  )}
                  
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: currentStep === 'with-ads' ? contentWithAds : generatedContent.content }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="html">
                <Textarea
                  value={currentStep === 'with-ads' ? contentWithAds : generatedContent.content}
                  readOnly
                  rows={20}
                  className="font-mono text-sm"
                />
              </TabsContent>

              <TabsContent value="seo" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">SEO改善提案</h4>
                  <ul className="space-y-2">
                    {generatedContent.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {generatedContent.structuredData && (
                  <div>
                    <h4 className="font-semibold mb-3">構造化データ</h4>
                    <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                      {JSON.stringify(generatedContent.structuredData, null, 2)}
                    </pre>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="keywords">
                <div className="space-y-4">
                  <h4 className="font-semibold">使用されたキーワード</h4>
                  <div className="flex flex-wrap gap-2">
                    {generatedContent.keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* 広告設定タブ */}
              <TabsContent value="ads">
                <AdInsertionControl
                  articleContent={generatedContent.content}
                  articleMeta={{
                    wordCount: generatedContent.wordCount,
                    keywords: generatedContent.keywords
                  }}
                  onAdInserted={handleAdInsertionComplete}
                  onSettingsChange={setAdInsertionSettings}
                />
              </TabsContent>

              {/* WordPress投稿タブ */}
              <TabsContent value="wordpress">
                <WordPressPublishControl
                  articleContent={currentStep === 'with-ads' ? contentWithAds : generatedContent.content}
                  articleTitle={generatedContent.title}
                  articleExcerpt={generatedContent.metaDescription}
                  featuredImageUrl={generatedContent.imageUrl}
                  onPublished={handleWordPressPublished}
                  onSettingsChange={setWordPressPublishSettings}
                />
              </TabsContent>
            </Tabs>

            {/* ステップ進行の表示 */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  進行状況: 
                  <span className="ml-2 font-medium">
                    {currentStep === 'generated' && '記事生成完了'}
                    {currentStep === 'with-ads' && '広告挿入完了'}
                    {currentStep === 'published' && 'WordPress投稿完了'}
                  </span>
                </div>
                <div className="flex gap-2">
                  {currentStep === 'generated' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setActiveTab('ads')}
                    >
                      <Target className="w-4 h-4 mr-2" />
                      広告を設定
                    </Button>
                  )}
                  {currentStep === 'with-ads' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setActiveTab('wordpress')}
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      WordPressに投稿
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="flex gap-3 mt-6 pt-4 border-t">
              <Button onClick={handleSaveToNotion} variant="outline">
                <Save className="w-4 h-4 mr-2" />
                Notionに保存
              </Button>
              
              <Button onClick={handleSchedulePost} variant="outline">
                <Clock className="w-4 h-4 mr-2" />
                予約投稿
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
