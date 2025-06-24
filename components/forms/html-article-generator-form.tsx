'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, Globe, Image, TrendingUp } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FormData {
  htmlContent: string;
  targetKeywords: string;
  includeAds: boolean;
  generateImage: boolean;
  optimizeForSeo: boolean;
  tone: 'professional' | 'casual' | 'educational';
}

interface GeneratedContent {
  title: string;
  content: string;
  metaDescription: string;
  seoScore: number;
  imageUrl?: string;
  suggestions: string[];
}

export default function HtmlArticleGeneratorForm() {
  const [formData, setFormData] = useState<FormData>({
    htmlContent: '',
    targetKeywords: '',
    includeAds: true,
    generateImage: true,
    optimizeForSeo: true,
    tone: 'professional'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerate = async () => {
    if (!formData.htmlContent.trim()) {
      setError('HTMLコンテンツを入力してください');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-from-html', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          htmlContent: formData.htmlContent,
          targetKeywords: formData.targetKeywords.split(',').map(k => k.trim()).filter(Boolean),
          includeAds: formData.includeAds,
          generateImage: formData.generateImage,
          optimizeForSeo: formData.optimizeForSeo,
          tone: formData.tone
        }),
      });

      if (!response.ok) {
        throw new Error(`生成に失敗しました: ${response.status}`);
      }

      const result = await response.json();
      setGeneratedContent(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '記事生成中にエラーが発生しました');
    } finally {
      setIsGenerating(false);
    }
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
          seoScore: generatedContent.seoScore
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

  const getSeoScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            HTMLから記事を生成
          </CardTitle>
          <CardDescription>
            HTMLコンテンツを解析して、SEO最適化された記事を自動生成します
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* HTMLコンテンツ入力 */}
          <div className="space-y-2">
            <Label htmlFor="htmlContent">HTMLコンテンツ *</Label>
            <Textarea
              id="htmlContent"
              placeholder="解析したいHTMLコンテンツを貼り付けてください..."
              value={formData.htmlContent}
              onChange={(e) => handleInputChange('htmlContent', e.target.value)}
              rows={8}
              className="min-h-[200px]"
            />
          </div>

          {/* ターゲットキーワード */}
          <div className="space-y-2">
            <Label htmlFor="keywords">ターゲットキーワード</Label>
            <Input
              id="keywords"
              placeholder="SEO対策, 記事生成, AI (カンマ区切り)"
              value={formData.targetKeywords}
              onChange={(e) => handleInputChange('targetKeywords', e.target.value)}
            />
          </div>

          {/* オプション設定 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

          {/* トーン設定 */}
          <div className="space-y-2">
            <Label>記事のトーン</Label>
            <div className="flex gap-2">
              {[
                { value: 'professional', label: 'プロフェッショナル' },
                { value: 'casual', label: 'カジュアル' },
                { value: 'educational', label: '教育的' }
              ].map((tone) => (
                <Button
                  key={tone.value}
                  variant={formData.tone === tone.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleInputChange('tone', tone.value)}
                >
                  {tone.label}
                </Button>
              ))}
            </div>
          </div>

          {/* エラー表示 */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* 生成ボタン */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !formData.htmlContent.trim()}
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
      {generatedContent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                生成結果
              </span>
              <Badge className={`${getSeoScoreColor(generatedContent.seoScore)} text-white`}>
                SEOスコア: {generatedContent.seoScore}
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="preview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="preview">プレビュー</TabsTrigger>
                <TabsTrigger value="html">HTMLソース</TabsTrigger>
                <TabsTrigger value="suggestions">改善提案</TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold mb-4">{generatedContent.title}</h3>
                  <p className="text-gray-600 mb-6">{generatedContent.metaDescription}</p>
                  
                  {generatedContent.imageUrl && (
                    <div className="mb-6">
                      <img
                        src={generatedContent.imageUrl}
                        alt={generatedContent.title}
                        className="w-full max-w-md mx-auto rounded-lg shadow-md"
                      />
                    </div>
                  )}
                  
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: generatedContent.content }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="html">
                <Textarea
                  value={generatedContent.content}
                  readOnly
                  rows={20}
                  className="font-mono text-sm"
                />
              </TabsContent>

              <TabsContent value="suggestions">
                <div className="space-y-3">
                  <h4 className="font-semibold">SEO改善提案</h4>
                  <ul className="space-y-2">
                    {generatedContent.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            </Tabs>

            {/* アクションボタン */}
            <div className="flex gap-3 mt-6 pt-4 border-t">
              <Button onClick={handleSaveToNotion} variant="outline">
                <Globe className="w-4 h-4 mr-2" />
                Notionに保存
              </Button>
              
              <Button variant="outline">
                <Globe className="w-4 h-4 mr-2" />
                WordPressに投稿
              </Button>
              
              <Button variant="outline">
                <Image className="w-4 h-4 mr-2" />
                SNSに投稿
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
