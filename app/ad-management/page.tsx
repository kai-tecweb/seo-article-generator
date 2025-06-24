import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Settings, 
  Eye, 
  Edit, 
  Trash2, 
  Copy, 
  BarChart3, 
  Smartphone, 
  Monitor, 
  Target,
  Code,
  Palette,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import { AdConfig, AdTemplate, STANDARD_AD_SIZES, AdPlacement, AdType } from '@/types/ad-management';

interface AdManagementPageProps {}

export default function AdManagementPage({}: AdManagementPageProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [ads, setAds] = useState<AdConfig[]>([]);
  const [templates, setTemplates] = useState<AdTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAd, setSelectedAd] = useState<AdConfig | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // 新規広告作成フォームの状態
  const [newAd, setNewAd] = useState<Partial<AdConfig>>({
    name: '',
    type: 'display',
    adCode: '',
    placement: 'in-content',
    size: STANDARD_AD_SIZES[4], // Medium Rectangle
    displayConditions: {
      deviceRestriction: 'all',
      minWordCount: 500
    },
    style: {
      centerAlign: true,
      showLabel: true,
      labelText: '広告'
    },
    isActive: true
  });

  // 広告データの読み込み
  useEffect(() => {
    loadAds();
    loadTemplates();
  }, []);

  const loadAds = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ad-management');
      if (response.ok) {
        const data = await response.json();
        setAds(data.ads || []);
      }
    } catch (error) {
      console.error('広告データの読み込みに失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/ad-management/templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.error('テンプレートの読み込みに失敗しました:', error);
    }
  };

  const handleCreateAd = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ad-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAd)
      });

      if (response.ok) {
        const data = await response.json();
        setAds([...ads, data.ad]);
        setShowCreateForm(false);
        setNewAd({
          name: '',
          type: 'display',
          adCode: '',
          placement: 'in-content',
          size: STANDARD_AD_SIZES[4],
          displayConditions: {
            deviceRestriction: 'all',
            minWordCount: 500
          },
          style: {
            centerAlign: true,
            showLabel: true,
            labelText: '広告'
          },
          isActive: true
        });
      }
    } catch (error) {
      console.error('広告の作成に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAd = async (adId: string, isActive: boolean) => {
    try {
      const response = await fetch('/api/ad-management', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: adId, isActive })
      });

      if (response.ok) {
        setAds(ads.map(ad => 
          ad.id === adId ? { ...ad, isActive } : ad
        ));
      }
    } catch (error) {
      console.error('広告の状態更新に失敗しました:', error);
    }
  };

  const handleDeleteAd = async (adId: string) => {
    if (confirm('この広告を削除してもよろしいですか？')) {
      try {
        const response = await fetch('/api/ad-management', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: adId })
        });

        if (response.ok) {
          setAds(ads.filter(ad => ad.id !== adId));
        }
      } catch (error) {
        console.error('広告の削除に失敗しました:', error);
      }
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

  const getTypeLabel = (type: AdType): string => {
    const labels: Record<AdType, string> = {
      'display': 'ディスプレイ',
      'text': 'テキスト',
      'responsive': 'レスポンシブ',
      'video': 'ビデオ',
      'shopping': 'ショッピング'
    };
    return labels[type] || type;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Google広告管理</h1>
          <p className="text-gray-600 mt-2">記事内広告の設定・管理・パフォーマンス分析</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          新規広告作成
        </Button>
      </div>

      {/* メインタブ */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            概要
          </TabsTrigger>
          <TabsTrigger value="ads" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            広告管理
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            テンプレート
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            設定
          </TabsTrigger>
        </TabsList>

        {/* 概要タブ */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">アクティブ広告</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ads.filter(ad => ad.isActive).length}</div>
                <p className="text-xs text-muted-foreground">全{ads.length}広告中</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">配置箇所</CardTitle>
                <Palette className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(ads.map(ad => ad.placement)).size}
                </div>
                <p className="text-xs text-muted-foreground">種類の配置を使用中</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">広告形式</CardTitle>
                <Monitor className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(ads.map(ad => ad.type)).size}
                </div>
                <p className="text-xs text-muted-foreground">種類の形式を使用中</p>
              </CardContent>
            </Card>
          </div>

          {/* クイック操作ガイド */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                クイックスタートガイド
              </CardTitle>
              <CardDescription>
                効果的な広告配置のための推奨設定
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>記事内広告</strong>: ミディアムレクタングル（300x250）を段落間に配置することを推奨します。
                  </AlertDescription>
                </Alert>
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>モバイル最適化</strong>: モバイルバナー（320x50）をヘッダーまたはフッターに配置してください。
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 広告管理タブ */}
        <TabsContent value="ads" className="space-y-6">
          {/* 広告一覧 */}
          <div className="grid grid-cols-1 gap-4">
            {ads.map((ad) => (
              <Card key={ad.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{ad.name}</h3>
                      <Badge variant={ad.isActive ? 'default' : 'secondary'}>
                        {ad.isActive ? 'アクティブ' : '無効'}
                      </Badge>
                      <Badge variant="outline">{getTypeLabel(ad.type)}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>配置: {getPlacementLabel(ad.placement)}</span>
                      <span>サイズ: {ad.size.name} ({ad.size.width}x{ad.size.height})</span>
                      <span>デバイス: {ad.displayConditions.deviceRestriction || 'すべて'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedAd(ad)}>
                      <Eye className="h-4 w-4 mr-1" />
                      プレビュー
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      編集
                    </Button>
                    <Switch 
                      checked={ad.isActive}
                      onCheckedChange={(checked) => handleToggleAd(ad.id, checked)}
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteAd(ad.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {ads.length === 0 && (
              <Card className="p-12 text-center">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">広告がまだ設定されていません</h3>
                <p className="text-gray-500 mb-4">最初の広告を作成して収益化を始めましょう</p>
                <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  新規広告作成
                </Button>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* テンプレートタブ */}
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>広告テンプレート</CardTitle>
              <CardDescription>
                よく使う広告設定をテンプレートとして保存・再利用できます
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">テンプレート機能は近日公開予定です</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 設定タブ */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>広告設定</CardTitle>
              <CardDescription>
                Google AdSenseの設定と広告表示の全般設定
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">詳細設定機能は近日公開予定です</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 新規広告作成モーダル */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>新規広告作成</CardTitle>
              <CardDescription>
                記事に表示する広告の設定を行います
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 基本情報 */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="adName">広告名</Label>
                  <Input
                    id="adName"
                    value={newAd.name}
                    onChange={(e) => setNewAd({...newAd, name: e.target.value})}
                    placeholder="例: メインコンテンツ広告"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="adType">広告タイプ</Label>
                    <Select value={newAd.type} onValueChange={(value: AdType) => setNewAd({...newAd, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="display">ディスプレイ</SelectItem>
                        <SelectItem value="text">テキスト</SelectItem>
                        <SelectItem value="responsive">レスポンシブ</SelectItem>
                        <SelectItem value="video">ビデオ</SelectItem>
                        <SelectItem value="shopping">ショッピング</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="placement">配置位置</Label>
                    <Select value={newAd.placement} onValueChange={(value: AdPlacement) => setNewAd({...newAd, placement: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="header">ヘッダー</SelectItem>
                        <SelectItem value="sidebar">サイドバー</SelectItem>
                        <SelectItem value="footer">フッター</SelectItem>
                        <SelectItem value="in-content">コンテンツ内</SelectItem>
                        <SelectItem value="between-paragraphs">段落間</SelectItem>
                        <SelectItem value="before-conclusion">結論前</SelectItem>
                        <SelectItem value="after-title">タイトル後</SelectItem>
                        <SelectItem value="floating">フローティング</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="adSize">広告サイズ</Label>
                  <Select 
                    value={newAd.size?.name} 
                    onValueChange={(value) => {
                      const size = STANDARD_AD_SIZES.find(s => s.name === value);
                      if (size) setNewAd({...newAd, size});
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STANDARD_AD_SIZES.map((size) => (
                        <SelectItem key={size.name} value={size.name}>
                          {size.description} ({size.width}x{size.height})
                          {size.isRecommended && <Badge className="ml-2" variant="outline">推奨</Badge>}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="adCode">広告コード</Label>
                  <Textarea
                    id="adCode"
                    value={newAd.adCode}
                    onChange={(e) => setNewAd({...newAd, adCode: e.target.value})}
                    placeholder="Google AdSenseの広告コードを貼り付けてください"
                    rows={4}
                  />
                </div>
              </div>

              <Separator />

              {/* 表示条件 */}
              <div className="space-y-4">
                <h4 className="font-semibold">表示条件</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minWordCount">最小文字数</Label>
                    <Input
                      id="minWordCount"
                      type="number"
                      value={newAd.displayConditions?.minWordCount || ''}
                      onChange={(e) => setNewAd({
                        ...newAd, 
                        displayConditions: {
                          ...newAd.displayConditions,
                          minWordCount: parseInt(e.target.value) || undefined
                        }
                      })}
                      placeholder="500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="deviceRestriction">デバイス制限</Label>
                    <Select 
                      value={newAd.displayConditions?.deviceRestriction || 'all'} 
                      onValueChange={(value) => setNewAd({
                        ...newAd,
                        displayConditions: {
                          ...newAd.displayConditions,
                          deviceRestriction: value as 'mobile' | 'desktop' | 'all'
                        }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">すべてのデバイス</SelectItem>
                        <SelectItem value="mobile">モバイルのみ</SelectItem>
                        <SelectItem value="desktop">デスクトップのみ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* スタイル設定 */}
              <div className="space-y-4">
                <h4 className="font-semibold">スタイル設定</h4>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="centerAlign"
                    checked={newAd.style?.centerAlign || false}
                    onCheckedChange={(checked) => setNewAd({
                      ...newAd,
                      style: {
                        ...newAd.style,
                        centerAlign: checked
                      }
                    })}
                  />
                  <Label htmlFor="centerAlign">中央寄せ</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="showLabel"
                    checked={newAd.style?.showLabel || false}
                    onCheckedChange={(checked) => setNewAd({
                      ...newAd,
                      style: {
                        ...newAd.style,
                        showLabel: checked
                      }
                    })}
                  />
                  <Label htmlFor="showLabel">広告ラベル表示</Label>
                </div>

                {newAd.style?.showLabel && (
                  <div>
                    <Label htmlFor="labelText">ラベルテキスト</Label>
                    <Input
                      id="labelText"
                      value={newAd.style?.labelText || ''}
                      onChange={(e) => setNewAd({
                        ...newAd,
                        style: {
                          ...newAd.style,
                          labelText: e.target.value
                        }
                      })}
                      placeholder="広告"
                    />
                  </div>
                )}
              </div>

              {/* アクション */}
              <div className="flex justify-end space-x-2 pt-6">
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  キャンセル
                </Button>
                <Button onClick={handleCreateAd} disabled={loading || !newAd.name || !newAd.adCode}>
                  {loading ? '作成中...' : '広告を作成'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
