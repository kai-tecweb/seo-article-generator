'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, FileText, Settings, Eye, Save, Send } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArticleTemplate,
  TemplateBasedGenerationRequest,
  TemplateBasedGenerationResponse,
  TemplateVariable
} from "@/types/template";
import TemplateManager from "./template-manager";

interface TemplateBasedGenerationFormProps {
  onGenerated?: (result: TemplateBasedGenerationResponse) => void;
}

export default function TemplateBasedGenerationForm({ onGenerated }: TemplateBasedGenerationFormProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<ArticleTemplate | null>(null);
  const [variableValues, setVariableValues] = useState<Record<string, any>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<TemplateBasedGenerationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  
  // 生成オプション
  const [options, setOptions] = useState({
    generateImage: true,
    includeAds: true,
    optimizeForSeo: true,
    customInstructions: ''
  });

  // テンプレート選択時の処理
  const handleTemplateSelect = async (templateId: string) => {
    try {
      const response = await fetch(`/api/templates/${templateId}`);
      if (!response.ok) throw new Error('テンプレート取得エラー');
      
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      
      setSelectedTemplate(data);
      setShowTemplateSelector(false);
      
      // 変数のデフォルト値を設定
      const defaultValues: Record<string, any> = {};
      data.variables.forEach((variable: TemplateVariable) => {
        if (variable.defaultValue !== undefined) {
          defaultValues[variable.name] = variable.defaultValue;
        } else {
          // タイプに応じたデフォルト値
          switch (variable.type) {
            case 'text':
              defaultValues[variable.name] = '';
              break;
            case 'number':
              defaultValues[variable.name] = 0;
              break;
            case 'boolean':
              defaultValues[variable.name] = false;
              break;
            case 'keyword-list':
              defaultValues[variable.name] = [];
              break;
            case 'select':
            case 'multi-select':
              defaultValues[variable.name] = variable.options?.[0] || '';
              break;
            default:
              defaultValues[variable.name] = '';
          }
        }
      });
      setVariableValues(defaultValues);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'テンプレート取得中にエラーが発生しました');
    }
  };

  // 変数値更新
  const updateVariableValue = (variableName: string, value: any) => {
    setVariableValues(prev => ({
      ...prev,
      [variableName]: value
    }));
  };

  // キーワードリスト処理
  const handleKeywordListUpdate = (variableName: string, keywords: string) => {
    const keywordArray = keywords.split(',').map(k => k.trim()).filter(Boolean);
    updateVariableValue(variableName, keywordArray);
  };

  // 記事生成
  const handleGenerate = async () => {
    if (!selectedTemplate) {
      setError('テンプレートを選択してください');
      return;
    }

    // 必須変数のチェック
    const missingRequired = selectedTemplate.variables
      .filter(v => v.required)
      .filter(v => !variableValues[v.name] || 
        (Array.isArray(variableValues[v.name]) && variableValues[v.name].length === 0) ||
        (typeof variableValues[v.name] === 'string' && !variableValues[v.name].trim())
      );

    if (missingRequired.length > 0) {
      setError(`必須項目が入力されていません: ${missingRequired.map(v => v.name).join(', ')}`);
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGenerationProgress(0);

    try {
      setGenerationProgress(10);

      const request: TemplateBasedGenerationRequest = {
        templateId: selectedTemplate.id,
        variableValues,
        customInstructions: options.customInstructions || undefined,
        generateImage: options.generateImage,
        includeAds: options.includeAds,
        optimizeForSeo: options.optimizeForSeo
      };

      setGenerationProgress(30);

      const response = await fetch('/api/templates/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      setGenerationProgress(70);

      if (!response.ok) {
        throw new Error(`記事生成エラー: ${response.status}`);
      }

      const result: TemplateBasedGenerationResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || '記事生成に失敗しました');
      }

      setGenerationProgress(100);
      setGeneratedContent(result);
      
      if (onGenerated) {
        onGenerated(result);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : '記事生成中にエラーが発生しました');
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationProgress(0), 1000);
    }
  };

  // 変数入力コンポーネント
  const renderVariableInput = (variable: TemplateVariable) => {
    const value = variableValues[variable.name];

    switch (variable.type) {
      case 'text':
        return (
          <Input
            value={value || ''}
            onChange={(e) => updateVariableValue(variable.name, e.target.value)}
            placeholder={variable.description}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value || 0}
            onChange={(e) => updateVariableValue(variable.name, parseInt(e.target.value) || 0)}
            placeholder={variable.description}
          />
        );

      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={value || false}
              onCheckedChange={(checked) => updateVariableValue(variable.name, checked)}
            />
            <span className="text-sm text-gray-600">{variable.description}</span>
          </div>
        );

      case 'select':
        return (
          <Select
            value={value || ''}
            onValueChange={(newValue) => updateVariableValue(variable.name, newValue)}
          >
            <SelectTrigger>
              <SelectValue placeholder={variable.description} />
            </SelectTrigger>
            <SelectContent>
              {variable.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multi-select':
        return (
          <div className="space-y-2">
            {variable.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  checked={Array.isArray(value) && value.includes(option)}
                  onCheckedChange={(checked) => {
                    const currentArray = Array.isArray(value) ? value : [];
                    if (checked) {
                      updateVariableValue(variable.name, [...currentArray, option]);
                    } else {
                      updateVariableValue(variable.name, currentArray.filter(v => v !== option));
                    }
                  }}
                />
                <Label>{option}</Label>
              </div>
            ))}
          </div>
        );

      case 'keyword-list':
        return (
          <div className="space-y-2">
            <Input
              placeholder="キーワードをカンマ区切りで入力"
              value={Array.isArray(value) ? value.join(', ') : ''}
              onChange={(e) => handleKeywordListUpdate(variable.name, e.target.value)}
            />
            {Array.isArray(value) && value.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {value.map((keyword, index) => (
                  <Badge key={index} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => updateVariableValue(variable.name, e.target.value)}
            placeholder={variable.description}
            rows={3}
          />
        );
    }
  };

  // SEOスコア色
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
            テンプレートベース記事生成
          </CardTitle>
          <CardDescription>
            テンプレートを使用してSEO最適化された記事を生成します
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* テンプレート選択 */}
          {!selectedTemplate ? (
            <div className="space-y-4">
              <div className="text-center py-8">
                <Settings className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">テンプレートを選択してください</h3>
                <p className="text-gray-600 mb-4">
                  記事生成に使用するテンプレートを選択してください
                </p>
                <Button onClick={() => setShowTemplateSelector(true)}>
                  テンプレートを選択
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 選択されたテンプレート情報 */}
              <div className="p-4 border rounded-lg bg-blue-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedTemplate.name}</h3>
                    <p className="text-gray-600">{selectedTemplate.description}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{selectedTemplate.type}</Badge>
                      <Badge variant="secondary">{selectedTemplate.category}</Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowTemplateSelector(true)}
                  >
                    テンプレート変更
                  </Button>
                </div>
              </div>

              {/* 変数入力フォーム */}
              {selectedTemplate.variables.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>テンプレート変数</CardTitle>
                    <CardDescription>
                      テンプレートで使用する変数の値を入力してください
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {selectedTemplate.variables.map((variable) => (
                      <div key={variable.name} className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <code className="px-2 py-1 bg-gray-100 rounded text-sm">
                            {`{{${variable.name}}}`}
                          </code>
                          {variable.required && (
                            <Badge variant="destructive" className="text-xs">必須</Badge>
                          )}
                        </Label>
                        <p className="text-sm text-gray-600">{variable.description}</p>
                        {renderVariableInput(variable)}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* 生成オプション */}
              <Card>
                <CardHeader>
                  <CardTitle>生成オプション</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={options.generateImage}
                        onCheckedChange={(checked) => 
                          setOptions(prev => ({ ...prev, generateImage: checked }))
                        }
                      />
                      <Label>画像を生成</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={options.includeAds}
                        onCheckedChange={(checked) => 
                          setOptions(prev => ({ ...prev, includeAds: checked }))
                        }
                      />
                      <Label>広告を挿入</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={options.optimizeForSeo}
                        onCheckedChange={(checked) => 
                          setOptions(prev => ({ ...prev, optimizeForSeo: checked }))
                        }
                      />
                      <Label>SEO最適化</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customInstructions">カスタム指示（任意）</Label>
                    <Textarea
                      id="customInstructions"
                      placeholder="追加の指示や要求があれば記入してください"
                      value={options.customInstructions}
                      onChange={(e) => 
                        setOptions(prev => ({ ...prev, customInstructions: e.target.value }))
                      }
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

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
                disabled={isGenerating}
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
            </div>
          )}
        </CardContent>
      </Card>

      {/* テンプレート選択モーダル */}
      {showTemplateSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">テンプレートを選択</h2>
                <Button
                  variant="outline"
                  onClick={() => setShowTemplateSelector(false)}
                >
                  閉じる
                </Button>
              </div>
              
              <TemplateManager
                mode="select"
                onTemplateSelect={handleTemplateSelect}
              />
            </div>
          </div>
        </div>
      )}

      {/* 生成結果表示 */}
      {generatedContent && generatedContent.success && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                生成結果 ({generatedContent.templateName})
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
            <Tabs defaultValue="preview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="preview">プレビュー</TabsTrigger>
                <TabsTrigger value="html">HTMLソース</TabsTrigger>
                <TabsTrigger value="seo">SEO分析</TabsTrigger>
                <TabsTrigger value="keywords">キーワード</TabsTrigger>
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
            </Tabs>

            {/* アクションボタン */}
            <div className="flex gap-3 mt-6 pt-4 border-t">
              <Button variant="outline">
                <Save className="w-4 h-4 mr-2" />
                Notionに保存
              </Button>
              
              <Button variant="outline">
                <Send className="w-4 h-4 mr-2" />
                予約投稿
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
