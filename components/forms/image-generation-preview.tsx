'use client';

import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Image, Download, RefreshCw, Eye, Copy, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  ImageGenerationRequest, 
  ImageGenerationResponse, 
  ImageVariation 
} from "@/types/image-generation";

interface ImageGenerationPreviewProps {
  initialPrompt?: string;
  onImageSelected?: (imageUrl: string) => void;
}

export default function ImageGenerationPreview({ 
  initialPrompt = '', 
  onImageSelected 
}: ImageGenerationPreviewProps) {
  const [formData, setFormData] = useState<ImageGenerationRequest>({
    prompt: initialPrompt,
    style: 'realistic',
    aspectRatio: '16:9',
    includeText: false,
    textContent: '',
    fontSize: 'medium',
    textPosition: 'center',
    color: '#FFFFFF',
    quality: 'standard'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedImages, setGeneratedImages] = useState<ImageVariation[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'grid' | 'single'>('grid');

  const handleInputChange = (field: keyof ImageGenerationRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateImage = async () => {
    if (!formData.prompt.trim()) {
      setError('画像生成のプロンプトを入力してください');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGenerationProgress(0);

    try {
      // 進捗を段階的に更新
      setGenerationProgress(20);

      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      setGenerationProgress(60);

      if (!response.ok) {
        throw new Error(`画像生成に失敗しました: ${response.status}`);
      }

      const result: ImageGenerationResponse = await response.json();
      setGenerationProgress(90);

      if (result.success && result.imageUrl) {
        const newImage: ImageVariation = {
          id: result.imageId || Date.now().toString(),
          url: result.imageUrl,
          prompt: formData.prompt,
          style: formData.style,
          aspectRatio: formData.aspectRatio,
          createdAt: new Date().toISOString()
        };

        setGeneratedImages(prev => [newImage, ...prev]);
        setSelectedImage(result.imageUrl);
        
        // コールバック実行
        if (onImageSelected) {
          onImageSelected(result.imageUrl);
        }
      } else {
        throw new Error(result.error || '画像生成に失敗しました');
      }

      setGenerationProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : '画像生成中にエラーが発生しました');
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationProgress(0), 1000);
    }
  };

  const generateVariations = async () => {
    if (!formData.prompt.trim()) {
      setError('プロンプトが設定されていません');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // 複数のスタイルで画像を生成
      const styles: ('realistic' | 'illustration' | 'minimal' | 'abstract')[] = 
        ['realistic', 'illustration', 'minimal', 'abstract'];
      
      for (const style of styles) {
        const response = await fetch('/api/generate-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            style
          }),
        });

        if (response.ok) {
          const result: ImageGenerationResponse = await response.json();
          
          if (result.success && result.imageUrl) {
            const newImage: ImageVariation = {
              id: `${Date.now()}-${style}`,
              url: result.imageUrl,
              prompt: formData.prompt,
              style: style,
              aspectRatio: formData.aspectRatio,
              createdAt: new Date().toISOString()
            };

            setGeneratedImages(prev => [...prev, newImage]);
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'バリエーション生成中にエラーが発生しました');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    if (onImageSelected) {
      onImageSelected(imageUrl);
    }
  };

  const handleImageDownload = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `generated-image-${prompt.slice(0, 20)}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('画像のダウンロードに失敗しました');
    }
  };

  const copyImageUrl = useCallback((imageUrl: string) => {
    navigator.clipboard.writeText(imageUrl);
    // TODO: Toast通知を表示
  }, []);

  const removeImage = (imageId: string) => {
    setGeneratedImages(prev => prev.filter(img => img.id !== imageId));
    if (selectedImage && generatedImages.find(img => img.id === imageId)?.url === selectedImage) {
      setSelectedImage(null);
    }
  };

  const getStyleLabel = (style: string) => {
    const styleLabels: Record<string, string> = {
      realistic: 'リアル',
      illustration: 'イラスト',
      minimal: 'ミニマル',
      abstract: '抽象的',
      anime: 'アニメ',
      photographic: '写真'
    };
    return styleLabels[style] || style;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* 画像生成設定 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="w-5 h-5" />
            AI画像生成
          </CardTitle>
          <CardDescription>
            Fal AIを使用してアイキャッチ画像を生成・プレビューします
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* プロンプト入力 */}
          <div className="space-y-2">
            <Label htmlFor="prompt">画像生成プロンプト *</Label>
            <Textarea
              id="prompt"
              placeholder="例：美しい山の風景、夕日、自然、風景写真、高品質"
              value={formData.prompt}
              onChange={(e) => handleInputChange('prompt', e.target.value)}
              rows={3}
            />
          </div>

          {/* 画像設定 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>スタイル</Label>
              <Select 
                value={formData.style} 
                onValueChange={(value) => handleInputChange('style', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realistic">リアル</SelectItem>
                  <SelectItem value="illustration">イラスト</SelectItem>
                  <SelectItem value="minimal">ミニマル</SelectItem>
                  <SelectItem value="abstract">抽象的</SelectItem>
                  <SelectItem value="anime">アニメ</SelectItem>
                  <SelectItem value="photographic">写真</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>アスペクト比</Label>
              <Select 
                value={formData.aspectRatio} 
                onValueChange={(value) => handleInputChange('aspectRatio', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="16:9">16:9 (横長)</SelectItem>
                  <SelectItem value="1:1">1:1 (正方形)</SelectItem>
                  <SelectItem value="4:3">4:3 (標準)</SelectItem>
                  <SelectItem value="9:16">9:16 (縦長)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>品質</Label>
              <Select 
                value={formData.quality} 
                onValueChange={(value) => handleInputChange('quality', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">標準</SelectItem>
                  <SelectItem value="high">高品質</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* テキスト合成オプション */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="includeText"
                checked={formData.includeText}
                onCheckedChange={(checked) => handleInputChange('includeText', checked)}
              />
              <Label htmlFor="includeText">画像にテキストを追加</Label>
            </div>

            {formData.includeText && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                <div className="space-y-2">
                  <Label htmlFor="textContent">テキスト内容</Label>
                  <Input
                    id="textContent"
                    placeholder="画像に表示するテキスト"
                    value={formData.textContent}
                    onChange={(e) => handleInputChange('textContent', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>テキスト位置</Label>
                  <Select 
                    value={formData.textPosition} 
                    onValueChange={(value) => handleInputChange('textPosition', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">上部</SelectItem>
                      <SelectItem value="center">中央</SelectItem>
                      <SelectItem value="bottom">下部</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
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
                <span>画像を生成中...</span>
                <span>{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} className="w-full" />
            </div>
          )}

          {/* 生成ボタン */}
          <div className="flex gap-3">
            <Button
              onClick={generateImage}
              disabled={isGenerating || !formData.prompt.trim()}
              className="flex-1"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Image className="w-4 h-4 mr-2" />
                  画像を生成
                </>
              )}
            </Button>

            <Button
              onClick={generateVariations}
              disabled={isGenerating || !formData.prompt.trim()}
              variant="outline"
              size="lg"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              バリエーション生成
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 画像プレビュー・一覧 */}
      {generatedImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                生成画像プレビュー
              </span>
              <div className="flex gap-2">
                <Button
                  variant={previewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('grid')}
                >
                  グリッド
                </Button>
                <Button
                  variant={previewMode === 'single' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('single')}
                >
                  単体
                </Button>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent>
            {previewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {generatedImages.map((image) => (
                  <div 
                    key={image.id} 
                    className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                      selectedImage === image.url 
                        ? 'ring-2 ring-blue-500 border-blue-500' 
                        : 'hover:border-gray-300'
                    }`}
                    onClick={() => handleImageSelect(image.url)}
                  >
                    <div className="aspect-video relative">
                      <img
                        src={image.url}
                        alt={image.prompt}
                        className="w-full h-full object-cover"
                      />
                      {selectedImage === image.url && (
                        <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                          <Badge className="bg-blue-500 text-white">選択中</Badge>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline">{getStyleLabel(image.style)}</Badge>
                        <Badge variant="outline">{image.aspectRatio}</Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {image.prompt}
                      </p>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageDownload(image.url, image.prompt);
                          }}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyImageUrl(image.url);
                          }}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(image.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              selectedImage && (
                <div className="text-center">
                  <div className="max-w-2xl mx-auto">
                    <img
                      src={selectedImage}
                      alt="選択された画像"
                      className="w-full rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              )
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
