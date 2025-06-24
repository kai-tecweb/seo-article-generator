import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Target, 
  Settings, 
  Eye, 
  Zap,
  CheckCircle,
  AlertCircle,
  Info,
  Smartphone,
  Monitor
} from 'lucide-react';
import { AdConfig, AdPlacement } from '@/types/ad-management';

interface AdInsertionControlProps {
  /** 記事内容 */
  articleContent: string;
  /** 記事のメタデータ */
  articleMeta?: {
    wordCount?: number;
    category?: string;
    keywords?: string[];
  };
  /** 広告挿入完了時のコールバック */
  onAdInserted?: (contentWithAds: string) => void;
  /** 挿入設定の変更コールバック */
  onSettingsChange?: (settings: AdInsertionSettings) => void;
}

interface AdInsertionSettings {
  /** 自動挿入を有効にするか */
  autoInsert: boolean;
  /** 使用する広告のID配列 */
  selectedAdIds: string[];
  /** 挿入位置の設定 */
  insertionRules: {
    /** 段落間挿入の間隔（何段落おきに挿入するか） */
    paragraphInterval?: number;
    /** 最初の広告を挿入する段落位置 */
    firstAdPosition?: number;
    /** 最大広告数 */
    maxAds?: number;
  };
  /** デバイス固有の設定 */
  deviceSettings: {
    mobile: boolean;
    desktop: boolean;
  };
}

export default function AdInsertionControl({ 
  articleContent, 
  articleMeta,
  onAdInserted,
  onSettingsChange 
}: AdInsertionControlProps) {
  const [ads, setAds] = useState<AdConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [inserting, setInserting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [previewContent, setPreviewContent] = useState('');

  // 挿入設定のデフォルト値
  const [settings, setSettings] = useState<AdInsertionSettings>({
    autoInsert: true,
    selectedAdIds: [],
    insertionRules: {
      paragraphInterval: 3,
      firstAdPosition: 2,
      maxAds: 3
    },
    deviceSettings: {
      mobile: true,
      desktop: true
    }
  });

  // 利用可能な広告の読み込み
  useEffect(() => {
    loadAvailableAds();
  }, []);

  // 記事メタデータに基づく推奨設定の更新
  useEffect(() => {
    if (articleMeta) {
      updateRecommendedSettings();
    }
  }, [articleMeta]);

  // 設定変更の通知
  useEffect(() => {
    onSettingsChange?.(settings);
  }, [settings, onSettingsChange]);

  const loadAvailableAds = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ad-management');
      if (response.ok) {
        const data = await response.json();
        const activeAds = (data.ads || []).filter((ad: AdConfig) => ad.isActive);
        setAds(activeAds);
        
        // デフォルトで適用可能な広告を選択
        const applicableAds = activeAds.filter((ad: AdConfig) => 
          isAdApplicable(ad, articleMeta)
        );
        setSettings(prev => ({
          ...prev,
          selectedAdIds: applicableAds.slice(0, 3).map((ad: AdConfig) => ad.id)
        }));
      }
    } catch (error) {
      console.error('広告データの読み込みに失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRecommendedSettings = () => {
    if (!articleMeta) return;

    const { wordCount } = articleMeta;
    
    // 記事の長さに基づく推奨設定
    if (wordCount) {
      if (wordCount < 1000) {
        setSettings(prev => ({
          ...prev,
          insertionRules: {
            ...prev.insertionRules,
            maxAds: 1,
            paragraphInterval: 5
          }
        }));
      } else if (wordCount < 2000) {
        setSettings(prev => ({
          ...prev,
          insertionRules: {
            ...prev.insertionRules,
            maxAds: 2,
            paragraphInterval: 4
          }
        }));
      } else {
        setSettings(prev => ({
          ...prev,
          insertionRules: {
            ...prev.insertionRules,
            maxAds: 3,
            paragraphInterval: 3
          }
        }));
      }
    }
  };

  const isAdApplicable = (ad: AdConfig, meta?: typeof articleMeta): boolean => {
    if (!meta) return true;

    const { displayConditions } = ad;
    
    // 最小文字数チェック
    if (displayConditions.minWordCount && meta.wordCount && meta.wordCount < displayConditions.minWordCount) {
      return false;
    }

    // カテゴリ制限チェック
    if (displayConditions.categoryRestriction && displayConditions.categoryRestriction.length > 0) {
      if (!meta.category || !displayConditions.categoryRestriction.includes(meta.category)) {
        return false;
      }
    }

    // 除外キーワードチェック
    if (displayConditions.excludeKeywords && displayConditions.excludeKeywords.length > 0 && meta.keywords) {
      const hasExcludedKeyword = displayConditions.excludeKeywords.some(excluded =>
        meta.keywords?.some(keyword => keyword.toLowerCase().includes(excluded.toLowerCase()))
      );
      if (hasExcludedKeyword) {
        return false;
      }
    }

    return true;
  };

  const handleInsertAds = async () => {
    if (!settings.autoInsert || settings.selectedAdIds.length === 0) {
      onAdInserted?.(articleContent);
      return;
    }

    try {
      setInserting(true);
      
      const selectedAds = ads.filter(ad => settings.selectedAdIds.includes(ad.id));
      
      const response = await fetch('/api/ad-management/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: articleContent,
          ads: selectedAds,
          insertionRules: settings.insertionRules,
          articleMeta
        })
      });

      if (response.ok) {
        const data = await response.json();
        onAdInserted?.(data.contentWithAds);
      }
    } catch (error) {
      console.error('広告挿入に失敗しました:', error);
    } finally {
      setInserting(false);
    }
  };

  const handlePreview = async () => {
    if (!settings.autoInsert || settings.selectedAdIds.length === 0) {
      setPreviewContent(articleContent);
      setPreviewMode(true);
      return;
    }

    try {
      const selectedAds = ads.filter(ad => settings.selectedAdIds.includes(ad.id));
      
      const response = await fetch('/api/ad-management/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: articleContent,
          ads: selectedAds,
          insertionRules: settings.insertionRules,
          articleMeta,
          preview: true
        })
      });

      if (response.ok) {
        const data = await response.json();
        setPreviewContent(data.contentWithAds);
        setPreviewMode(true);
      }
    } catch (error) {
      console.error('プレビュー生成に失敗しました:', error);
    }
  };

  const getPlacementLabel = (placement: AdPlacement): string => {
    const labels: Record<AdPlacement, string> = {
      'header': 'ヘッダー',
      'sidebar': 'サイドバー',
      'footer': 'フッター',
      'in-content': 'コンテンツ内',
      'between-paragraphs': '段落間',
      'before-conclusion': '結論前',
      'after-title': 'タイトル後',
      'floating': 'フローティング'
    };
    return labels[placement] || placement;
  };

  const getDeviceIcon = (category: string) => {
    switch (category) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'desktop':
        return <Monitor className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">広告設定を読み込み中...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* メイン設定カード */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            広告自動挿入
          </CardTitle>
          <CardDescription>
            記事内に広告を自動挿入する設定を行います
            {articleMeta?.wordCount && (
              <span className="ml-2 text-blue-600">
                (記事文字数: {articleMeta.wordCount.toLocaleString()}文字)
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 自動挿入の有効/無効 */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">広告自動挿入を有効にする</Label>
              <div className="text-sm text-gray-600">
                記事に適切な広告を自動配置します
              </div>
            </div>
            <Switch
              checked={settings.autoInsert}
              onCheckedChange={(checked) => setSettings(prev => ({...prev, autoInsert: checked}))}
            />
          </div>

          {settings.autoInsert && (
            <>
              {/* 広告選択 */}
              <div className="space-y-4">
                <Label className="text-base">使用する広告を選択</Label>
                <div className="grid grid-cols-1 gap-3">
                  {ads.map((ad) => {
                    const isApplicable = isAdApplicable(ad, articleMeta);
                    const isSelected = settings.selectedAdIds.includes(ad.id);
                    
                    return (
                      <div 
                        key={ad.id} 
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50' 
                            : isApplicable 
                              ? 'border-gray-200 hover:border-gray-300' 
                              : 'border-gray-100 bg-gray-50 opacity-60'
                        }`}
                        onClick={() => {
                          if (!isApplicable) return;
                          
                          if (isSelected) {
                            setSettings(prev => ({
                              ...prev,
                              selectedAdIds: prev.selectedAdIds.filter(id => id !== ad.id)
                            }));
                          } else {
                            setSettings(prev => ({
                              ...prev,
                              selectedAdIds: [...prev.selectedAdIds, ad.id]
                            }));
                          }
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{ad.name}</span>
                              <Badge variant="outline">{getPlacementLabel(ad.placement)}</Badge>
                              {getDeviceIcon(ad.size.category)}
                              {!isApplicable && (
                                <Badge variant="secondary">条件不適合</Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              {ad.size.description} ({ad.size.width}x{ad.size.height})
                            </div>
                          </div>
                          <div className="flex items-center">
                            {isSelected && <CheckCircle className="h-5 w-5 text-blue-600" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {ads.length === 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      利用可能な広告がありません。まず<a href="/ad-management" className="text-blue-600 hover:underline">広告管理ページ</a>で広告を作成してください。
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* 詳細設定 */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="advanced">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      詳細設定
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    {/* 挿入ルール */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="paragraphInterval">段落間隔</Label>
                        <Select 
                          value={settings.insertionRules.paragraphInterval?.toString() || '3'}
                          onValueChange={(value) => setSettings(prev => ({
                            ...prev,
                            insertionRules: {
                              ...prev.insertionRules,
                              paragraphInterval: parseInt(value)
                            }
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2">2段落おき</SelectItem>
                            <SelectItem value="3">3段落おき</SelectItem>
                            <SelectItem value="4">4段落おき</SelectItem>
                            <SelectItem value="5">5段落おき</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="firstAdPosition">最初の広告位置</Label>
                        <Select 
                          value={settings.insertionRules.firstAdPosition?.toString() || '2'}
                          onValueChange={(value) => setSettings(prev => ({
                            ...prev,
                            insertionRules: {
                              ...prev.insertionRules,
                              firstAdPosition: parseInt(value)
                            }
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1段落目</SelectItem>
                            <SelectItem value="2">2段落目</SelectItem>
                            <SelectItem value="3">3段落目</SelectItem>
                            <SelectItem value="4">4段落目</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="maxAds">最大広告数</Label>
                        <Select 
                          value={settings.insertionRules.maxAds?.toString() || '3'}
                          onValueChange={(value) => setSettings(prev => ({
                            ...prev,
                            insertionRules: {
                              ...prev.insertionRules,
                              maxAds: parseInt(value)
                            }
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1個</SelectItem>
                            <SelectItem value="2">2個</SelectItem>
                            <SelectItem value="3">3個</SelectItem>
                            <SelectItem value="4">4個</SelectItem>
                            <SelectItem value="5">5個</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* デバイス設定 */}
                    <div className="space-y-3">
                      <Label className="text-base">対象デバイス</Label>
                      <div className="flex gap-6">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="mobile"
                            checked={settings.deviceSettings.mobile}
                            onCheckedChange={(checked) => setSettings(prev => ({
                              ...prev,
                              deviceSettings: {
                                ...prev.deviceSettings,
                                mobile: checked
                              }
                            }))}
                          />
                          <Label htmlFor="mobile" className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4" />
                            モバイル
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="desktop"
                            checked={settings.deviceSettings.desktop}
                            onCheckedChange={(checked) => setSettings(prev => ({
                              ...prev,
                              deviceSettings: {
                                ...prev.deviceSettings,
                                desktop: checked
                              }
                            }))}
                          />
                          <Label htmlFor="desktop" className="flex items-center gap-2">
                            <Monitor className="h-4 w-4" />
                            デスクトップ
                          </Label>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* 推奨設定情報 */}
              {articleMeta?.wordCount && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>推奨設定:</strong> 
                    {articleMeta.wordCount < 1000 && ' 短い記事のため、広告は1個に制限することを推奨します。'}
                    {articleMeta.wordCount >= 1000 && articleMeta.wordCount < 2000 && ' 中程度の記事のため、広告は2個以下に制限することを推奨します。'}
                    {articleMeta.wordCount >= 2000 && ' 長文記事のため、最大3個の広告配置が効果的です。'}
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}

          {/* アクションボタン */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handlePreview} 
              variant="outline"
              disabled={!settings.autoInsert || settings.selectedAdIds.length === 0}
            >
              <Eye className="h-4 w-4 mr-2" />
              プレビュー
            </Button>
            <Button 
              onClick={handleInsertAds}
              disabled={inserting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {inserting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  挿入中...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  広告を挿入
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* プレビューモーダル */}
      {previewMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>広告挿入プレビュー</CardTitle>
              <CardDescription>
                記事に広告が挿入された状態のプレビューです
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="prose prose-gray max-w-none"
                dangerouslySetInnerHTML={{ __html: previewContent }}
              />
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setPreviewMode(false)}>
                  閉じる
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
