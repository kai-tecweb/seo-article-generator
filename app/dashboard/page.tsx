import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Settings, Calendar, Image, TrendingUp, Globe } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
              SEO記事生成システム ダッシュボード
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              AI技術を活用したSEO最適化記事の自動生成・投稿システム
            </p>
          </div>
          
          {/* 主要機能カード */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* 記事生成 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                  記事生成
                </CardTitle>
                <CardDescription>
                  OpenAI APIを使用したSEO最適化記事の自動生成
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/article-generator">
                  <Button className="w-full" size="lg">
                    新しい記事を生成
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* 投稿管理 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-green-600" />
                  投稿管理
                </CardTitle>
                <CardDescription>
                  WordPress、SNS、Google Business Profileへの投稿管理
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/post-schedule">
                  <Button className="w-full" variant="outline" size="lg">
                    投稿スケジュール
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* 画像生成 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="w-6 h-6 text-purple-600" />
                  画像生成
                </CardTitle>
                <CardDescription>
                  Fal AI技術を活用したアイキャッチ画像の自動生成
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline" size="lg">
                  画像を生成
                </Button>
              </CardContent>
            </Card>

            {/* SEO分析 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                  SEO分析
                </CardTitle>
                <CardDescription>
                  記事のSEO最適化状況の分析とスコア評価
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline" size="lg">
                  SEOチェック
                </Button>
              </CardContent>
            </Card>

            {/* 外部連携 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-6 h-6 text-indigo-600" />
                  外部連携
                </CardTitle>
                <CardDescription>
                  Notion、WordPress、SNS等との連携設定
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline" size="lg">
                  連携設定
                </Button>
              </CardContent>
            </Card>

            {/* システム設定 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-6 h-6 text-gray-600" />
                  システム設定
                </CardTitle>
                <CardDescription>
                  API設定、基本設定、詳細オプション
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline" size="lg">
                  設定画面
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 現在の実装状況 */}
          <Card>
            <CardHeader>
              <CardTitle>🚀 現在の実装状況</CardTitle>
              <CardDescription>
                システムの機能実装進捗
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-green-600">✅ 実装完了</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• AI記事生成API</li>
                    <li>• 広告付き記事生成API</li>
                    <li>• 投稿スケジューリングAPI</li>
                    <li>• AIT画像テキスト合成API</li>
                    <li>• SEO最適化API</li>
                    <li>• 記事生成フォーム</li>
                    <li>• メインダッシュボード</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-blue-600">🔄 実装予定</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• 投稿時間設定UI</li>
                    <li>• 画像生成プレビュー</li>
                    <li>• 記事管理画面</li>
                    <li>• 投稿スケジュール管理画面</li>
                    <li>• 設定画面</li>
                    <li>• 履歴・ログ表示</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
