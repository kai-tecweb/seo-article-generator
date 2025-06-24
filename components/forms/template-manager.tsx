'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Loader2, 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  Tag,
  Calendar,
  Users,
  TrendingUp,
  MoreHorizontal
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  TemplateListItem,
  TemplateSearchParams,
  TemplateType,
  TemplateCategory,
  TemplateSearchResponse 
} from "@/types/template";

interface TemplateManagerProps {
  onTemplateSelect?: (templateId: string) => void;
  onTemplateCreate?: () => void;
  mode?: 'manage' | 'select';
}

export default function TemplateManager({ 
  onTemplateSelect, 
  onTemplateCreate,
  mode = 'manage' 
}: TemplateManagerProps) {
  const [templates, setTemplates] = useState<TemplateListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplates, setSelectedTemplates] = useState<Set<string>>(new Set());
  
  // 検索・フィルタ状態
  const [searchParams, setSearchParams] = useState<TemplateSearchParams>({
    query: '',
    type: undefined,
    category: undefined,
    tags: [],
    isActive: true,
    sortBy: 'updatedAt',
    sortOrder: 'desc',
    page: 1,
    limit: 20
  });

  // ページネーション状態
  const [pagination, setPagination] = useState({
    total: 0,
    hasNext: false,
    hasPrev: false
  });

  // テンプレート一覧取得
  const fetchTemplates = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      
      if (searchParams.query) queryParams.set('query', searchParams.query);
      if (searchParams.type) queryParams.set('type', searchParams.type);
      if (searchParams.category) queryParams.set('category', searchParams.category);
      if (searchParams.tags && searchParams.tags.length > 0) {
        queryParams.set('tags', searchParams.tags.join(','));
      }
      if (searchParams.isActive !== undefined) {
        queryParams.set('isActive', searchParams.isActive.toString());
      }
      if (searchParams.sortBy) queryParams.set('sortBy', searchParams.sortBy);
      if (searchParams.sortOrder) queryParams.set('sortOrder', searchParams.sortOrder);
      queryParams.set('page', searchParams.page?.toString() || '1');
      queryParams.set('limit', searchParams.limit?.toString() || '20');

      const response = await fetch(`/api/templates/list?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`テンプレート一覧取得エラー: ${response.status}`);
      }

      const data: TemplateSearchResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'テンプレート一覧の取得に失敗しました');
      }

      setTemplates(data.templates);
      setPagination({
        total: data.total,
        hasNext: data.hasNext,
        hasPrev: data.hasPrev
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'テンプレート一覧取得中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [searchParams]);

  // 検索パラメータ更新
  const updateSearchParams = (updates: Partial<TemplateSearchParams>) => {
    setSearchParams(prev => ({
      ...prev,
      ...updates,
      page: updates.page || 1  // ページ以外の変更時は1ページ目にリセット
    }));
  };

  // テンプレート選択処理
  const handleTemplateSelect = (templateId: string) => {
    if (mode === 'select' && onTemplateSelect) {
      onTemplateSelect(templateId);
    } else {
      // 詳細表示モード（将来実装）
      console.log('テンプレート詳細表示:', templateId);
    }
  };

  // 複数選択処理
  const handleTemplateCheck = (templateId: string, checked: boolean) => {
    const newSelected = new Set(selectedTemplates);
    if (checked) {
      newSelected.add(templateId);
    } else {
      newSelected.delete(templateId);
    }
    setSelectedTemplates(newSelected);
  };

  // 全選択/全解除
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTemplates(new Set(templates.map(t => t.id)));
    } else {
      setSelectedTemplates(new Set());
    }
  };

  // テンプレートタイプの表示名
  const getTypeDisplayName = (type: TemplateType): string => {
    const typeNames: Record<TemplateType, string> = {
      'blog-article': 'ブログ記事',
      'tutorial': 'チュートリアル',
      'review': 'レビュー',
      'how-to': 'ハウツー',
      'listicle': 'リスト記事',
      'news': 'ニュース',
      'case-study': 'ケーススタディ',
      'comparison': '比較記事',
      'product-description': '商品説明',
      'custom': 'カスタム'
    };
    return typeNames[type] || type;
  };

  // カテゴリの表示名
  const getCategoryDisplayName = (category: TemplateCategory): string => {
    const categoryNames: Record<TemplateCategory, string> = {
      'marketing': 'マーケティング',
      'technology': 'テクノロジー',
      'lifestyle': 'ライフスタイル',
      'business': 'ビジネス',
      'education': '教育',
      'entertainment': 'エンターテイメント',
      'health': '健康',
      'finance': '金融',
      'travel': '旅行',
      'food': '食品',
      'general': '一般'
    };
    return categoryNames[category] || category;
  };

  // 日付フォーマット
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">テンプレート管理</h1>
          <p className="text-gray-600 mt-1">
            記事生成テンプレートの作成・管理・使用ができます
          </p>
        </div>
        
        {mode === 'manage' && (
          <Button onClick={onTemplateCreate} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            新しいテンプレート
          </Button>
        )}
      </div>

      {/* 検索・フィルタ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            検索・フィルタ
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* 検索バー */}
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="テンプレート名、説明、タグで検索..."
                value={searchParams.query || ''}
                onChange={(e) => updateSearchParams({ query: e.target.value })}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => fetchTemplates()}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* フィルタ */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>テンプレートタイプ</Label>
              <Select 
                value={searchParams.type || ''} 
                onValueChange={(value: TemplateType) => 
                  updateSearchParams({ type: value || undefined })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="すべて" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">すべて</SelectItem>
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

            <div>
              <Label>カテゴリ</Label>
              <Select 
                value={searchParams.category || ''} 
                onValueChange={(value: TemplateCategory) => 
                  updateSearchParams({ category: value || undefined })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="すべて" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">すべて</SelectItem>
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

            <div>
              <Label>ソート順</Label>
              <Select 
                value={`${searchParams.sortBy}-${searchParams.sortOrder}`} 
                onValueChange={(value) => {
                  const [sortBy, sortOrder] = value.split('-') as [any, 'asc' | 'desc'];
                  updateSearchParams({ sortBy, sortOrder });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updatedAt-desc">最終更新日（新→古）</SelectItem>
                  <SelectItem value="updatedAt-asc">最終更新日（古→新）</SelectItem>
                  <SelectItem value="createdAt-desc">作成日（新→古）</SelectItem>
                  <SelectItem value="createdAt-asc">作成日（古→新）</SelectItem>
                  <SelectItem value="name-asc">名前（A→Z）</SelectItem>
                  <SelectItem value="name-desc">名前（Z→A）</SelectItem>
                  <SelectItem value="usageCount-desc">使用回数（多→少）</SelectItem>
                  <SelectItem value="usageCount-asc">使用回数（少→多）</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>状態</Label>
              <Select 
                value={searchParams.isActive === undefined ? '' : searchParams.isActive.toString()} 
                onValueChange={(value) => 
                  updateSearchParams({ 
                    isActive: value === '' ? undefined : value === 'true' 
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="すべて" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">すべて</SelectItem>
                  <SelectItem value="true">アクティブ</SelectItem>
                  <SelectItem value="false">非アクティブ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* エラー表示 */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* テンプレート一覧 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              テンプレート一覧 ({pagination.total}件)
            </CardTitle>
            
            {mode === 'manage' && templates.length > 0 && (
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedTemplates.size === templates.length}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm text-gray-600">
                  {selectedTemplates.size}件選択中
                </span>
                {selectedTemplates.size > 0 && (
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4 mr-1" />
                    削除
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">テンプレートを読み込み中...</span>
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                テンプレートが見つかりません
              </h3>
              <p className="text-gray-500">
                条件を変更して再検索するか、新しいテンプレートを作成してください。
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`p-4 border rounded-lg transition-colors ${
                    mode === 'select' 
                      ? 'hover:bg-blue-50 cursor-pointer' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => mode === 'select' && handleTemplateSelect(template.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {mode === 'manage' && (
                        <Checkbox
                          checked={selectedTemplates.has(template.id)}
                          onCheckedChange={(checked) => 
                            handleTemplateCheck(template.id, checked as boolean)
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{template.name}</h3>
                          <Badge variant="outline">
                            {getTypeDisplayName(template.type)}
                          </Badge>
                          <Badge variant="secondary">
                            {getCategoryDisplayName(template.category)}
                          </Badge>
                          {!template.isActive && (
                            <Badge variant="destructive">非アクティブ</Badge>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-3">{template.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {template.usageCount}回使用
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            更新: {formatDate(template.updatedAt)}
                          </div>
                        </div>
                        
                        {template.tags.length > 0 && (
                          <div className="flex items-center gap-2 mt-2">
                            <Tag className="w-4 h-4 text-gray-400" />
                            <div className="flex flex-wrap gap-1">
                              {template.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleTemplateSelect(template.id)}>
                          <Eye className="w-4 h-4 mr-2" />
                          {mode === 'select' ? 'テンプレートを使用' : '詳細表示'}
                        </DropdownMenuItem>
                        {mode === 'manage' && (
                          <>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              編集
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              削除
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ページネーション */}
          {!isLoading && templates.length > 0 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="text-sm text-gray-600">
                {pagination.total}件中 {((searchParams.page || 1) - 1) * (searchParams.limit || 20) + 1}-
                {Math.min((searchParams.page || 1) * (searchParams.limit || 20), pagination.total)}件を表示
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPrev}
                  onClick={() => updateSearchParams({ page: (searchParams.page || 1) - 1 })}
                >
                  前へ
                </Button>
                <span className="text-sm text-gray-600">
                  {searchParams.page || 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNext}
                  onClick={() => updateSearchParams({ page: (searchParams.page || 1) + 1 })}
                >
                  次へ
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
