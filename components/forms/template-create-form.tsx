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
import { Loader2, FileText, Save, Eye, Plus, X, Settings, Code } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  CreateTemplateRequest,
  TemplateType,
  TemplateCategory,
  TemplateVariable,
  TemplateStructure,
  TemplateSeoSettings,
  ArticleTemplate
} from "@/types/template";

interface TemplateCreateFormProps {
  onTemplateCreated?: (template: ArticleTemplate) => void;
  onCancel?: () => void;
  editingTemplate?: ArticleTemplate | null;
}

export default function TemplateCreateForm({ 
  onTemplateCreated, 
  onCancel,
  editingTemplate 
}: TemplateCreateFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [newTag, setNewTag] = useState('');
  const [newVariable, setNewVariable] = useState<Partial<TemplateVariable>>({});

  // フォームデータ
  const [formData, setFormData] = useState<CreateTemplateRequest>({
    name: editingTemplate?.name || '',
    description: editingTemplate?.description || '',
    type: editingTemplate?.type || 'blog-article',
    category: editingTemplate?.category || 'general',
    structure: editingTemplate?.structure || {
      introduction: '',
      headingPatterns: [''],
      conclusion: '',
      ctaTemplate: '',
      adPositions: ['after-intro'],
      imagePositions: ['header']
    },
    seoSettings: editingTemplate?.seoSettings || {
      titleLength: { min: 25, max: 35 },
      metaDescriptionLength: { min: 120, max: 160 },
      contentLength: { min: 1500, max: 3000 },
      keywordDensity: { min: 1, max: 3 },
      headingCount: { h2: 4, h3: 8 },
      requiredElements: ['title', 'meta-description', 'h1', 'h2']
    },
    variables: editingTemplate?.variables || [],
    content: editingTemplate?.content || '',
    promptTemplate: editingTemplate?.promptTemplate || '',
    tags: editingTemplate?.tags || [],
    isActive: editingTemplate?.isActive !== false
  });

  // フィールド更新
  const updateField = (field: keyof CreateTemplateRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 構造要素更新
  const updateStructure = (field: keyof TemplateStructure, value: any) => {
    setFormData(prev => ({
      ...prev,
      structure: {
        ...prev.structure,
        [field]: value
      }
    }));
  };

  // SEO設定更新
  const updateSeoSettings = (field: keyof TemplateSeoSettings, value: any) => {
    setFormData(prev => ({
      ...prev,
      seoSettings: {
        ...prev.seoSettings,
        [field]: value
      }
    }));
  };

  // 見出しパターン追加
  const addHeadingPattern = () => {
    updateStructure('headingPatterns', [...formData.structure.headingPatterns, '']);
  };

  // 見出しパターン削除
  const removeHeadingPattern = (index: number) => {
    const patterns = formData.structure.headingPatterns.filter((_, i) => i !== index);
    updateStructure('headingPatterns', patterns);
  };

  // 見出しパターン更新
  const updateHeadingPattern = (index: number, value: string) => {
    const patterns = [...formData.structure.headingPatterns];
    patterns[index] = value;
    updateStructure('headingPatterns', patterns);
  };

  // タグ追加
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      updateField('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  // タグ削除
  const removeTag = (tag: string) => {
    updateField('tags', formData.tags.filter(t => t !== tag));
  };

  // 変数追加
  const addVariable = () => {
    if (newVariable.name && newVariable.type) {
      const variable: TemplateVariable = {
        name: newVariable.name,
        description: newVariable.description || '',
        type: newVariable.type,
        required: newVariable.required || false,
        defaultValue: newVariable.defaultValue,
        options: newVariable.options,
        validation: newVariable.validation
      };
      
      updateField('variables', [...formData.variables, variable]);
      setNewVariable({});
    }
  };

  // 変数削除
  const removeVariable = (index: number) => {
    updateField('variables', formData.variables.filter((_, i) => i !== index));
  };

  // プレビュー生成
  const generatePreview = () => {
    // サンプル変数値で置換
    let preview = formData.content;
    
    // 基本的な変数を仮の値で置換
    const sampleValues: Record<string, string> = {
      topic: 'サンプルトピック',
      targetKeywords: 'キーワード1, キーワード2',
      targetAudience: '一般読者',
      step1: 'ステップ1の内容',
      step2: 'ステップ2の内容', 
      step3: 'ステップ3の内容'
    };

    Object.entries(sampleValues).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      preview = preview.replace(regex, value);
    });

    setPreviewContent(preview);
  };

  // フォーム送信
  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // バリデーション
      if (!formData.name.trim()) {
        throw new Error('テンプレート名は必須です');
      }
      if (!formData.content.trim()) {
        throw new Error('テンプレート内容は必須です');
      }
      if (!formData.promptTemplate.trim()) {
        throw new Error('プロンプトテンプレートは必須です');
      }

      const url = editingTemplate 
        ? `/api/templates/${editingTemplate.id}`
        : '/api/templates/create';
      
      const method = editingTemplate ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`テンプレート保存エラー: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'テンプレートの保存に失敗しました');
      }

      // 成功時の処理
      if (onTemplateCreated) {
        onTemplateCreated(result);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'テンプレート保存中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {editingTemplate ? 'テンプレート編集' : '新しいテンプレート作成'}
          </h1>
          <p className="text-gray-600 mt-1">
            記事生成用のテンプレートを作成・編集します
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            キャンセル
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {editingTemplate ? '更新' : '作成'}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* エラー表示 */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">基本情報</TabsTrigger>
          <TabsTrigger value="structure">構造設定</TabsTrigger>
          <TabsTrigger value="variables">変数設定</TabsTrigger>
          <TabsTrigger value="content">コンテンツ</TabsTrigger>
          <TabsTrigger value="preview">プレビュー</TabsTrigger>
        </TabsList>

        {/* 基本情報タブ */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>基本情報</CardTitle>
              <CardDescription>
                テンプレートの基本的な情報を設定します
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* テンプレート名 */}
              <div className="space-y-2">
                <Label htmlFor="name">テンプレート名 *</Label>
                <Input
                  id="name"
                  placeholder="例：ブログ記事テンプレート"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                />
              </div>

              {/* 説明 */}
              <div className="space-y-2">
                <Label htmlFor="description">説明</Label>
                <Textarea
                  id="description"
                  placeholder="このテンプレートの用途や特徴を説明してください"
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={3}
                />
              </div>

              {/* タイプとカテゴリ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>テンプレートタイプ</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: TemplateType) => updateField('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blog-article">ブログ記事</SelectItem>
                      <SelectItem value="tutorial">チュートリアル</SelectItem>
                      <SelectItem value="review">レビュー</SelectItem>
                      <SelectItem value="how-to">ハウツー</SelectItem>
                      <SelectItem value="listicle">リスト記事</SelectItem>
                      <SelectItem value="news">ニュース</SelectItem>
                      <SelectItem value="case-study">ケーススタディ</SelectItem>
                      <SelectItem value="comparison">比較記事</SelectItem>
                      <SelectItem value="product-description">商品説明</SelectItem>
                      <SelectItem value="custom">カスタム</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>カテゴリ</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: TemplateCategory) => updateField('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="marketing">マーケティング</SelectItem>
                      <SelectItem value="technology">テクノロジー</SelectItem>
                      <SelectItem value="business">ビジネス</SelectItem>
                      <SelectItem value="education">教育</SelectItem>
                      <SelectItem value="lifestyle">ライフスタイル</SelectItem>
                      <SelectItem value="health">健康</SelectItem>
                      <SelectItem value="finance">金融</SelectItem>
                      <SelectItem value="travel">旅行</SelectItem>
                      <SelectItem value="food">食品</SelectItem>
                      <SelectItem value="entertainment">エンターテイメント</SelectItem>
                      <SelectItem value="general">一般</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* タグ */}
              <div className="space-y-2">
                <Label>タグ</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="タグを入力してEnterで追加"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    追加
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>

              {/* アクティブ設定 */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => updateField('isActive', checked)}
                />
                <Label htmlFor="isActive">アクティブ</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 構造設定タブ */}
        <TabsContent value="structure">
          <div className="space-y-6">
            {/* 記事構造 */}
            <Card>
              <CardHeader>
                <CardTitle>記事構造</CardTitle>
                <CardDescription>
                  記事の構造を定義します
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* 導入文 */}
                <div className="space-y-2">
                  <Label htmlFor="introduction">導入文テンプレート</Label>
                  <Textarea
                    id="introduction"
                    placeholder="記事の導入部分のテンプレートを入力してください（変数使用可能）"
                    value={formData.structure.introduction || ''}
                    onChange={(e) => updateStructure('introduction', e.target.value)}
                    rows={3}
                  />
                </div>

                {/* 見出しパターン */}
                <div className="space-y-2">
                  <Label>見出しパターン（H2レベル）</Label>
                  <div className="space-y-2">
                    {formData.structure.headingPatterns.map((pattern, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="見出しテンプレートを入力（変数使用可能）"
                          value={pattern}
                          onChange={(e) => updateHeadingPattern(index, e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeHeadingPattern(index)}
                          disabled={formData.structure.headingPatterns.length <= 1}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" onClick={addHeadingPattern} variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      見出しを追加
                    </Button>
                  </div>
                </div>

                {/* 結論部分 */}
                <div className="space-y-2">
                  <Label htmlFor="conclusion">結論部分テンプレート</Label>
                  <Textarea
                    id="conclusion"
                    placeholder="記事の結論部分のテンプレートを入力してください"
                    value={formData.structure.conclusion || ''}
                    onChange={(e) => updateStructure('conclusion', e.target.value)}
                    rows={3}
                  />
                </div>

                {/* CTA */}
                <div className="space-y-2">
                  <Label htmlFor="ctaTemplate">CTA（Call To Action）テンプレート</Label>
                  <Textarea
                    id="ctaTemplate"
                    placeholder="記事末尾のCTAテンプレートを入力してください"
                    value={formData.structure.ctaTemplate || ''}
                    onChange={(e) => updateStructure('ctaTemplate', e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* SEO設定 */}
            <Card>
              <CardHeader>
                <CardTitle>SEO設定</CardTitle>
                <CardDescription>
                  SEO最適化のための設定を行います
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* 文字数・見出し数設定 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">推奨文字数</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>タイトル最小</Label>
                        <Input
                          type="number"
                          value={formData.seoSettings.titleLength.min}
                          onChange={(e) => updateSeoSettings('titleLength', {
                            ...formData.seoSettings.titleLength,
                            min: parseInt(e.target.value) || 0
                          })}
                        />
                      </div>
                      <div>
                        <Label>タイトル最大</Label>
                        <Input
                          type="number"
                          value={formData.seoSettings.titleLength.max}
                          onChange={(e) => updateSeoSettings('titleLength', {
                            ...formData.seoSettings.titleLength,
                            max: parseInt(e.target.value) || 0
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">推奨見出し数</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>H2タグ</Label>
                        <Input
                          type="number"
                          value={formData.seoSettings.headingCount.h2}
                          onChange={(e) => updateSeoSettings('headingCount', {
                            ...formData.seoSettings.headingCount,
                            h2: parseInt(e.target.value) || 0
                          })}
                        />
                      </div>
                      <div>
                        <Label>H3タグ</Label>
                        <Input
                          type="number"
                          value={formData.seoSettings.headingCount.h3}
                          onChange={(e) => updateSeoSettings('headingCount', {
                            ...formData.seoSettings.headingCount,
                            h3: parseInt(e.target.value) || 0
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 変数設定タブ */}
        <TabsContent value="variables">
          <Card>
            <CardHeader>
              <CardTitle>変数設定</CardTitle>
              <CardDescription>
                テンプレートで使用する変数を定義します
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* 既存変数一覧 */}
              {formData.variables.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium">設定済み変数</h4>
                  {formData.variables.map((variable, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <code className="px-2 py-1 bg-gray-100 rounded text-sm">
                              {`{{${variable.name}}}`}
                            </code>
                            <Badge variant={variable.required ? "default" : "secondary"}>
                              {variable.required ? '必須' : '任意'}
                            </Badge>
                            <Badge variant="outline">
                              {variable.type}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm">{variable.description}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeVariable(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 新しい変数追加 */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-medium">新しい変数を追加</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>変数名</Label>
                    <Input
                      placeholder="例：topic"
                      value={newVariable.name || ''}
                      onChange={(e) => setNewVariable(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label>変数タイプ</Label>
                    <Select
                      value={newVariable.type || ''}
                      onValueChange={(value: any) => setNewVariable(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="タイプを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">テキスト</SelectItem>
                        <SelectItem value="number">数値</SelectItem>
                        <SelectItem value="boolean">真偽値</SelectItem>
                        <SelectItem value="select">選択肢</SelectItem>
                        <SelectItem value="multi-select">複数選択</SelectItem>
                        <SelectItem value="keyword-list">キーワードリスト</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>説明</Label>
                  <Input
                    placeholder="変数の説明を入力してください"
                    value={newVariable.description || ''}
                    onChange={(e) => setNewVariable(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="required"
                    checked={newVariable.required || false}
                    onCheckedChange={(checked) => setNewVariable(prev => ({ ...prev, required: checked as boolean }))}
                  />
                  <Label htmlFor="required">必須項目</Label>
                </div>

                <Button onClick={addVariable} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  変数を追加
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* コンテンツタブ */}
        <TabsContent value="content">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>テンプレート内容</CardTitle>
                <CardDescription>
                  記事のテンプレート内容を作成します。変数は {`{{変数名}}`} の形式で使用してください。
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="content">記事テンプレート *</Label>
                  <Textarea
                    id="content"
                    placeholder="記事のテンプレート内容を入力してください"
                    value={formData.content}
                    onChange={(e) => updateField('content', e.target.value)}
                    rows={15}
                    className="font-mono"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>プロンプトテンプレート</CardTitle>
                <CardDescription>
                  AI生成時に使用するプロンプトテンプレートを作成します
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="promptTemplate">プロンプトテンプレート *</Label>
                  <Textarea
                    id="promptTemplate"
                    placeholder="AIに送信するプロンプトテンプレートを入力してください"
                    value={formData.promptTemplate}
                    onChange={(e) => updateField('promptTemplate', e.target.value)}
                    rows={10}
                    className="font-mono"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* プレビュータブ */}
        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>プレビュー</span>
                <Button onClick={generatePreview} variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  プレビュー生成
                </Button>
              </CardTitle>
              <CardDescription>
                サンプルデータでテンプレートのプレビューを確認できます
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {previewContent ? (
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: previewContent.replace(/\n/g, '<br>') }} />
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  「プレビュー生成」ボタンをクリックして、テンプレートの表示を確認してください
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
