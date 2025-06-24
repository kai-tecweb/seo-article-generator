import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Globe, 
  Send, 
  Settings, 
  Calendar,
  Tag,
  User,
  Image,
  CheckCircle,
  AlertCircle,
  Info,
  Clock,
  Eye,
  ExternalLink
} from 'lucide-react';

interface WordPressPublishControlProps {
  /** 記事内容 */
  articleContent: string;
  /** 記事タイトル */
  articleTitle: string;
  /** 記事の要約/抜粋 */
  articleExcerpt?: string;
  /** アイキャッチ画像URL */
  featuredImageUrl?: string;
  /** 投稿完了時のコールバック */
  onPublished?: (postData: WordPressPostData) => void;
  /** 設定変更コールバック */
  onSettingsChange?: (settings: WordPressPublishSettings) => void;
}

interface WordPressPublishSettings {
  /** 自動投稿を有効にするか */
  autoPublish: boolean;
  /** 投稿ステータス */
  postStatus: 'draft' | 'publish' | 'private' | 'pending';
  /** カテゴリー */
  categories: string[];
  /** タグ */
  tags: string[];
  /** 投稿者ID */
  authorId?: string;
  /** 投稿日時 */
  publishDate?: string;
  /** 抜粋 */
  excerpt?: string;
  /** SEO設定 */
  seoSettings: {
    metaDescription?: string;
    focusKeyword?: string;
    enableSEO: boolean;
  };
  /** アイキャッチ画像 */
  featuredImage: {
    useGenerated: boolean;
    customUrl?: string;
    altText?: string;
  };
}

interface WordPressPostData {
  id: number;
  url: string;
  status: string;
  publishDate: string;
}

interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
}

interface WordPressAuthor {
  id: number;
  name: string;
  slug: string;
}

export default function WordPressPublishControl({ 
  articleContent,
  articleTitle,
  articleExcerpt,
  featuredImageUrl,
  onPublished,
  onSettingsChange 
}: WordPressPublishControlProps) {
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [connected, setConnected] = useState(false);
  const [categories, setCategories] = useState<WordPressCategory[]>([]);
  const [authors, setAuthors] = useState<WordPressAuthor[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error' | 'unconfigured'>('checking');

  // 投稿設定のデフォルト値
  const [settings, setSettings] = useState<WordPressPublishSettings>({
    autoPublish: false,
    postStatus: 'draft',
    categories: [],
    tags: [],
    authorId: undefined,
    publishDate: undefined,
    excerpt: articleExcerpt || '',
    seoSettings: {
      enableSEO: true,
      metaDescription: '',
      focusKeyword: ''
    },
    featuredImage: {
      useGenerated: true,
      customUrl: featuredImageUrl || '',
      altText: ''
    }
  });

  // WordPress接続状態の確認
  useEffect(() => {
    checkWordPressConnection();
  }, []);

  // 記事情報の更新時に設定を同期
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      excerpt: articleExcerpt || '',
      featuredImage: {
        ...prev.featuredImage,
        customUrl: featuredImageUrl || ''
      }
    }));
  }, [articleExcerpt, featuredImageUrl]);

  // 設定変更の通知
  useEffect(() => {
    onSettingsChange?.(settings);
  }, [settings, onSettingsChange]);

  const checkWordPressConnection = async () => {
    try {
      setConnectionStatus('checking');
      const response = await fetch('/api/post-to-wordpress/test');
      const data = await response.json();

      if (response.ok && data.connected) {
        setConnected(true);
        setConnectionStatus('connected');
        await loadWordPressData();
      } else {
        setConnected(false);
        setConnectionStatus(data.configured === false ? 'unconfigured' : 'error');
      }
    } catch (error) {
      console.error('WordPress接続確認に失敗しました:', error);
      setConnected(false);
      setConnectionStatus('error');
    }
  };

  const loadWordPressData = async () => {
    try {
      setLoading(true);
      
      // カテゴリーとタグの取得
      const [categoriesResponse, authorsResponse] = await Promise.all([
        fetch('/api/get-wordpress-terms?type=categories'),
        fetch('/api/get-wordpress-terms?type=authors')
      ]);

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.terms || []);
      }

      if (authorsResponse.ok) {
        const authorsData = await authorsResponse.json();
        setAuthors(authorsData.terms || []);
      }
    } catch (error) {
      console.error('WordPressデータの読み込みに失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!connected) {
      alert('WordPressに接続されていません。設定を確認してください。');
      return;
    }

    try {
      setPublishing(true);

      const postData = {
        title: articleTitle,
        content: articleContent,
        excerpt: settings.excerpt,
        status: settings.postStatus,
        categories: settings.categories,
        tags: settings.tags,
        authorId: settings.authorId,
        publishDate: settings.publishDate,
        featuredImage: settings.featuredImage.useGenerated ? featuredImageUrl : settings.featuredImage.customUrl,
        featuredImageAlt: settings.featuredImage.altText,
        seoSettings: settings.seoSettings.enableSEO ? settings.seoSettings : undefined
      };

      const response = await fetch('/api/post-to-wordpress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });

      if (response.ok) {
        const result = await response.json();
        onPublished?.(result.post);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'WordPressへの投稿に失敗しました');
      }
    } catch (error) {
      console.error('投稿エラー:', error);
      alert(`投稿に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
    } finally {
      setPublishing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      'draft': { variant: 'secondary', label: '下書き' },
      'publish': { variant: 'default', label: '公開' },
      'private': { variant: 'outline', label: 'プライベート' },
      'pending': { variant: 'destructive', label: '承認待ち' }
    };
    
    const config = variants[status] || variants.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (connectionStatus === 'checking') {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">WordPress接続を確認中...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 接続状態の表示 */}
      {connectionStatus === 'unconfigured' && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            WordPressの設定が完了していません。
            <a href="/settings/wordpress" className="text-blue-600 hover:underline ml-1">
              設定ページ
            </a>
            でWordPressサイトの情報を入力してください。
          </AlertDescription>
        </Alert>
      )}

      {connectionStatus === 'error' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            WordPressへの接続に失敗しました。設定を確認してください。
            <Button 
              variant="outline" 
              size="sm" 
              onClick={checkWordPressConnection}
              className="ml-2"
            >
              再試行
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {connectionStatus === 'connected' && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            WordPressに正常に接続されています。記事の投稿が可能です。
          </AlertDescription>
        </Alert>
      )}

      {/* メイン設定カード */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            WordPress投稿設定
          </CardTitle>
          <CardDescription>
            生成した記事をWordPressサイトへ自動投稿する設定を行います
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 自動投稿の有効/無効 */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">WordPress自動投稿を有効にする</Label>
              <div className="text-sm text-gray-600">
                記事生成と同時にWordPressサイトへ投稿します
              </div>
            </div>
            <Switch
              checked={settings.autoPublish}
              onCheckedChange={(checked) => setSettings(prev => ({...prev, autoPublish: checked}))}
              disabled={!connected}
            />
          </div>

          {settings.autoPublish && connected && (
            <>
              {/* 基本設定 */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="postStatus">投稿ステータス</Label>
                    <Select 
                      value={settings.postStatus} 
                      onValueChange={(value: any) => setSettings(prev => ({...prev, postStatus: value}))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">下書き</SelectItem>
                        <SelectItem value="publish">即座に公開</SelectItem>
                        <SelectItem value="private">プライベート</SelectItem>
                        <SelectItem value="pending">承認待ち</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="author">投稿者</Label>
                    <Select 
                      value={settings.authorId || ''} 
                      onValueChange={(value) => setSettings(prev => ({...prev, authorId: value || undefined}))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="デフォルト" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">デフォルト</SelectItem>
                        {authors.map((author) => (
                          <SelectItem key={author.id} value={author.id.toString()}>
                            {author.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="excerpt">記事の抜粋</Label>
                  <Textarea
                    id="excerpt"
                    value={settings.excerpt}
                    onChange={(e) => setSettings(prev => ({...prev, excerpt: e.target.value}))}
                    placeholder="記事の簡潔な要約を入力..."
                    rows={3}
                  />
                </div>
              </div>

              <Separator />

              {/* カテゴリー・タグ設定 */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="categories">カテゴリー</Label>
                  <Select 
                    value={settings.categories[0] || ''} 
                    onValueChange={(value) => setSettings(prev => ({
                      ...prev, 
                      categories: value ? [value] : []
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="カテゴリーを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">未分類</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tags">タグ (カンマ区切りで入力)</Label>
                  <Input
                    id="tags"
                    value={settings.tags.join(', ')}
                    onChange={(e) => setSettings(prev => ({
                      ...prev, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                    }))}
                    placeholder="例: SEO, マーケティング, AI"
                  />
                </div>
              </div>

              <Separator />

              {/* アイキャッチ画像設定 */}
              <div className="space-y-4">
                <Label className="text-base">アイキャッチ画像</Label>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="useGenerated"
                    checked={settings.featuredImage.useGenerated}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      featuredImage: {
                        ...prev.featuredImage,
                        useGenerated: checked
                      }
                    }))}
                  />
                  <Label htmlFor="useGenerated">生成された画像を使用</Label>
                </div>

                {!settings.featuredImage.useGenerated && (
                  <div>
                    <Label htmlFor="customImageUrl">カスタム画像URL</Label>
                    <Input
                      id="customImageUrl"
                      value={settings.featuredImage.customUrl || ''}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        featuredImage: {
                          ...prev.featuredImage,
                          customUrl: e.target.value
                        }
                      }))}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="imageAlt">画像のALTテキスト</Label>
                  <Input
                    id="imageAlt"
                    value={settings.featuredImage.altText || ''}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      featuredImage: {
                        ...prev.featuredImage,
                        altText: e.target.value
                      }
                    }))}
                    placeholder="画像の説明文"
                  />
                </div>
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
                    {/* 投稿日時設定 */}
                    <div>
                      <Label htmlFor="publishDate">投稿日時 (空白の場合は即座に投稿)</Label>
                      <Input
                        id="publishDate"
                        type="datetime-local"
                        value={settings.publishDate || ''}
                        onChange={(e) => setSettings(prev => ({...prev, publishDate: e.target.value || undefined}))}
                      />
                    </div>

                    {/* SEO設定 */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="enableSEO"
                          checked={settings.seoSettings.enableSEO}
                          onCheckedChange={(checked) => setSettings(prev => ({
                            ...prev,
                            seoSettings: {
                              ...prev.seoSettings,
                              enableSEO: checked
                            }
                          }))}
                        />
                        <Label htmlFor="enableSEO">SEO設定を有効にする</Label>
                      </div>

                      {settings.seoSettings.enableSEO && (
                        <div className="space-y-3 pl-6">
                          <div>
                            <Label htmlFor="metaDescription">メタディスクリプション</Label>
                            <Textarea
                              id="metaDescription"
                              value={settings.seoSettings.metaDescription || ''}
                              onChange={(e) => setSettings(prev => ({
                                ...prev,
                                seoSettings: {
                                  ...prev.seoSettings,
                                  metaDescription: e.target.value
                                }
                              }))}
                              placeholder="検索結果に表示される説明文 (160文字以下推奨)"
                              rows={2}
                            />
                          </div>

                          <div>
                            <Label htmlFor="focusKeyword">フォーカスキーワード</Label>
                            <Input
                              id="focusKeyword"
                              value={settings.seoSettings.focusKeyword || ''}
                              onChange={(e) => setSettings(prev => ({
                                ...prev,
                                seoSettings: {
                                  ...prev.seoSettings,
                                  focusKeyword: e.target.value
                                }
                              }))}
                              placeholder="SEO対策したいメインキーワード"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* 投稿プレビュー情報 */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <h4 className="font-medium">投稿プレビュー</h4>
                <div className="text-sm space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">ステータス:</span>
                    {getStatusBadge(settings.postStatus)}
                  </div>
                  {settings.publishDate && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>投稿予定: {formatDate(settings.publishDate)}</span>
                    </div>
                  )}
                  {settings.categories.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      <span>カテゴリー: {settings.categories.join(', ')}</span>
                    </div>
                  )}
                  {settings.tags.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      <span>タグ: {settings.tags.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 投稿ボタン */}
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handlePublish}
                  disabled={publishing || !articleTitle || !articleContent}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {publishing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      投稿中...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      WordPressに投稿
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => window.open(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-admin/post-new.php`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  WordPress管理画面
                </Button>
              </div>
            </>
          )}

          {/* 接続されていない場合の表示 */}
          {settings.autoPublish && !connected && (
            <div className="text-center py-8">
              <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">WordPressに接続されていません</p>
              <Button onClick={checkWordPressConnection} variant="outline">
                <CheckCircle className="h-4 w-4 mr-2" />
                接続を再確認
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
