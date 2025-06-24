'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, TrendingUp, RefreshCw, ArrowUp, Clock, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * Yahoo!急上昇ワード型定義
 */
interface YahooTrendingItem {
  rank: number;
  keyword: string;
  searchVolume: number;
  risePercentage: number;
  category: 'エンタメ' | 'スポーツ' | 'ニュース' | 'IT・科学' | 'ライフスタイル' | 'その他';
  relatedKeywords: string[];
  trendStartTime: string;
  estimatedDuration: string;
  description: string;
}

interface YahooTrendingResponse {
  success: boolean;
  data?: YahooTrendingItem[];
  timestamp: string;
  totalCount: number;
  message?: string;
  error?: string;
}

interface YahooTrendingSelectorProps {
  /** 選択したキーワードのコールバック */
  onKeywordSelect?: (keyword: string, trendData: YahooTrendingItem) => void;
  /** 選択可能な最大件数 */
  maxSelection?: number;
  /** 表示する件数 */
  displayLimit?: number;
}

/**
 * Yahoo!急上昇ワードセレクターコンポーネント
 * 
 * 記事生成フォームでトレンドキーワードを選択・適用する機能を提供
 */
export default function YahooTrendingSelector({
  onKeywordSelect,
  maxSelection = 1,
  displayLimit = 10
}: YahooTrendingSelectorProps) {
  const [trendingData, setTrendingData] = useState<YahooTrendingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // カテゴリオプション
  const categories = [
    { value: 'all', label: 'すべて' },
    { value: 'エンタメ', label: 'エンタメ' },
    { value: 'スポーツ', label: 'スポーツ' },
    { value: 'ニュース', label: 'ニュース' },
    { value: 'IT・科学', label: 'IT・科学' },
    { value: 'ライフスタイル', label: 'ライフスタイル' },
    { value: 'その他', label: 'その他' }
  ];

  /**
   * Yahoo!急上昇ワードを取得
   */
  const fetchTrendingData = async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const params = new URLSearchParams({
        limit: '20'
      });

      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }

      const response = await fetch(`/api/yahoo-trending/realtime?${params}`);
      const data: YahooTrendingResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'データの取得に失敗しました');
      }

      if (data.success && data.data) {
        setTrendingData(data.data);
        setLastUpdated(new Date().toLocaleTimeString('ja-JP'));
        console.log('✅ Yahoo!急上昇ワード取得成功:', data.data.length, '件');
      } else {
        throw new Error(data.error || 'データの取得に失敗しました');
      }

    } catch (err) {
      console.error('❌ Yahoo!急上昇ワード取得エラー:', err);
      setError(err instanceof Error ? err.message : 'データの取得に失敗しました');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  /**
   * キーワード選択処理
   */
  const handleKeywordSelect = (keyword: string, trendData: YahooTrendingItem) => {
    if (selectedKeywords.includes(keyword)) {
      // 既に選択済みの場合は選択解除
      setSelectedKeywords(prev => prev.filter(k => k !== keyword));
      return;
    }

    if (selectedKeywords.length >= maxSelection) {
      // 最大選択数に達している場合は最初の要素を削除
      setSelectedKeywords(prev => [...prev.slice(1), keyword]);
    } else {
      // 新しいキーワードを追加
      setSelectedKeywords(prev => [...prev, keyword]);
    }

    // 親コンポーネントに通知
    onKeywordSelect?.(keyword, trendData);
  };

  /**
   * 全選択解除
   */
  const handleClearSelection = () => {
    setSelectedKeywords([]);
  };

  /**
   * 初回データ取得
   */
  useEffect(() => {
    fetchTrendingData();
  }, [selectedCategory]);

  /**
   * 表示用データのフィルタリング
   */
  const displayData = trendingData.slice(0, displayLimit);

  /**
   * 急上昇率の色分け
   */
  const getRisePercentageColor = (percentage: number) => {
    if (percentage >= 400) return 'text-red-600 bg-red-50';
    if (percentage >= 200) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  /**
   * カテゴリーの色分け
   */
  const getCategoryColor = (category: string) => {
    const colors = {
      'エンタメ': 'bg-purple-100 text-purple-700',
      'スポーツ': 'bg-blue-100 text-blue-700',
      'ニュース': 'bg-red-100 text-red-700',
      'IT・科学': 'bg-green-100 text-green-700',
      'ライフスタイル': 'bg-yellow-100 text-yellow-700',
      'その他': 'bg-gray-100 text-gray-700'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            Yahoo!急上昇ワード
          </CardTitle>
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                最終更新: {lastUpdated}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchTrendingData(true)}
              disabled={isRefreshing || isLoading}
            >
              {isRefreshing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              更新
            </Button>
          </div>
        </div>

        {/* カテゴリ選択 */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">カテゴリ:</span>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 選択状況表示 */}
        {selectedKeywords.length > 0 && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium text-blue-800">
              選択中: {selectedKeywords.length}件
            </span>
            <div className="flex flex-wrap gap-1">
              {selectedKeywords.map(keyword => (
                <Badge key={keyword} variant="secondary" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSelection}
              className="ml-auto text-blue-600 hover:text-blue-800"
            >
              全解除
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {/* エラー表示 */}
        {error && (
          <Alert className="mb-4" variant="destructive">
            <Info className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* ローディング表示 */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span className="text-gray-600">急上昇ワードを取得中...</span>
          </div>
        )}

        {/* トレンドリスト */}
        {!isLoading && displayData.length > 0 && (
          <div className="space-y-3">
            {displayData.map((item) => {
              const isSelected = selectedKeywords.includes(item.keyword);
              
              return (
                <div
                  key={item.rank}
                  className={`p-4 border rounded-lg transition-all duration-200 cursor-pointer hover:shadow-md ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleKeywordSelect(item.keyword, item)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold text-gray-400">#{item.rank}</span>
                        <h3 className="font-semibold text-gray-900">{item.keyword}</h3>
                        <Badge className={getRisePercentageColor(item.risePercentage)}>
                          <ArrowUp className="w-3 h-3 mr-1" />
                          +{item.risePercentage}%
                        </Badge>
                        <Badge className={getCategoryColor(item.category)}>
                          {item.category}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>検索数: {item.searchVolume.toLocaleString()}</span>
                        <span>継続予想: {item.estimatedDuration}</span>
                      </div>
                      
                      {item.relatedKeywords.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          <span className="text-xs text-gray-500">関連:</span>
                          {item.relatedKeywords.slice(0, 3).map(related => (
                            <Badge key={related} variant="outline" className="text-xs">
                              {related}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <Button
                      size="sm"
                      variant={isSelected ? "default" : "outline"}
                      className="ml-4"
                    >
                      {isSelected ? '選択中' : '選択'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* データなし表示 */}
        {!isLoading && displayData.length === 0 && !error && (
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>現在表示できる急上昇ワードがありません</p>
            <p className="text-sm">カテゴリを変更するか、しばらく後に再試行してください</p>
          </div>
        )}

        {/* 使用方法ヒント */}
        {!isLoading && displayData.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 flex items-center gap-1">
              <Info className="w-3 h-3" />
              💡 ヒント: キーワードをクリックして選択し、記事生成のトピックに活用しましょう。
              急上昇中のキーワードを使うことで、SEO効果とアクセス数の向上が期待できます。
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
