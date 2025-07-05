# 静的HTML生成システム実装例

## 基本構成

### レイアウトコンポーネント

```typescript
// src/components/layout/StaticSiteLayout.tsx
import { ReactNode } from 'react'

interface StaticSiteLayoutProps {
  children: ReactNode
  title: string
  description: string
  keywords: string[]
  canonicalUrl: string
}

export function StaticSiteLayout({ 
  children, 
  title, 
  description, 
  keywords,
  canonicalUrl 
}: StaticSiteLayoutProps) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords.join(', ')} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* 構造化データ */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title,
            "description": description,
          })}
        </script>
        
        {/* CSS */}
        <link rel="stylesheet" href="/assets/css/main.css" />
      </head>
      <body className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <main className="lg:col-span-3">
              {children}
            </main>
            <aside className="lg:col-span-1">
              <Sidebar />
            </aside>
          </div>
        </div>
        <Footer />
        
        {/* JavaScript */}
        <script src="/assets/js/main.js"></script>
      </body>
    </html>
  )
}
```

### 記事カードコンポーネント

```typescript
// src/components/blog/ArticleCard.tsx
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, Eye } from 'lucide-react'

interface ArticleCardProps {
  title: string
  excerpt: string
  date: string
  author: string
  category: string
  image: string
  href: string
  readTime: string
  views: string
}

export default function ArticleCard({
  title,
  excerpt,
  date,
  author,
  category,
  image,
  href,
  readTime,
  views,
}: ArticleCardProps) {
  return (
    <article className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl/30 transition-all duration-300 hover:scale-105 overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          <Link href={href}>{title}</Link>
        </h2>
        
        <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar size={16} />
              <span>{date}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock size={16} />
              <span>{readTime}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye size={16} />
              <span>{views}</span>
            </div>
          </div>
          <span className="text-blue-600 font-medium">{author}</span>
        </div>
      </div>
    </article>
  )
}
```

## Laravel HTML生成サービス

### HTML生成サービス

```php
// app/Services/StaticHtmlGeneratorService.php
<?php

namespace App\Services;

use App\Models\Article;
use App\Models\Category;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\File;

class StaticHtmlGeneratorService
{
    protected string $outputPath;

    public function __construct()
    {
        $this->outputPath = base_path('output');
    }

    /**
     * 単一記事のHTML生成
     */
    public function generateArticleHtml(Article $article): string
    {
        $data = [
            'article' => $article,
            'title' => $article->title . ' | TechVibe',
            'description' => $article->meta_description,
            'keywords' => $article->keywords,
            'canonicalUrl' => "https://techvibe.com/articles/{$article->slug}.html",
            'relatedArticles' => $this->getRelatedArticles($article),
        ];

        $html = View::make('templates.article', $data)->render();
        
        $filePath = $this->outputPath . "/articles/{$article->slug}.html";
        $this->ensureDirectoryExists(dirname($filePath));
        File::put($filePath, $html);

        return $filePath;
    }

    /**
     * 全サイトHTML生成
     */
    public function generateFullSite(): array
    {
        $generatedFiles = [];
        
        // インデックスページ生成
        $generatedFiles[] = $this->generateIndexPage();
        
        // 記事ページ生成
        Article::published()->chunk(50, function ($articles) use (&$generatedFiles) {
            foreach ($articles as $article) {
                $generatedFiles[] = $this->generateArticleHtml($article);
            }
        });
        
        // カテゴリページ生成
        Category::all()->each(function ($category) use (&$generatedFiles) {
            $generatedFiles[] = $this->generateCategoryPage($category);
        });
        
        // サイトマップ生成
        $generatedFiles[] = $this->generateSitemap();
        
        return $generatedFiles;
    }

    /**
     * インデックスページ生成
     */
    protected function generateIndexPage(): string
    {
        $data = [
            'articles' => Article::published()->latest()->take(10)->get(),
            'featuredArticles' => Article::featured()->take(3)->get(),
            'categories' => Category::withCount('articles')->get(),
            'title' => 'TechVibe - 未来を創るテクノロジーメディア',
            'description' => '最新のテクノロジー、プログラミング、ガジェット情報を美しいデザインでお届けする次世代テックメディア',
            'keywords' => ['テクノロジー', 'プログラミング', 'ガジェット', 'AI', 'Web開発'],
        ];

        $html = View::make('templates.index', $data)->render();
        
        $filePath = $this->outputPath . '/index.html';
        File::put($filePath, $html);

        return $filePath;
    }

    /**
     * カテゴリページ生成
     */
    protected function generateCategoryPage(Category $category): string
    {
        $data = [
            'category' => $category,
            'articles' => $category->articles()->published()->latest()->get(),
            'title' => "{$category->name} | TechVibe",
            'description' => "{$category->name}に関する最新記事をお届けします",
            'keywords' => [$category->name, 'テクノロジー', 'プログラミング'],
        ];

        $html = View::make('templates.category', $data)->render();
        
        $filePath = $this->outputPath . "/categories/{$category->slug}.html";
        $this->ensureDirectoryExists(dirname($filePath));
        File::put($filePath, $html);

        return $filePath;
    }

    /**
     * サイトマップ生成
     */
    protected function generateSitemap(): string
    {
        $urls = collect();
        
        // トップページ
        $urls->push([
            'url' => 'https://techvibe.com/',
            'lastmod' => now()->toDateString(),
            'priority' => '1.0',
        ]);
        
        // 記事ページ
        Article::published()->get()->each(function ($article) use ($urls) {
            $urls->push([
                'url' => "https://techvibe.com/articles/{$article->slug}.html",
                'lastmod' => $article->updated_at->toDateString(),
                'priority' => '0.8',
            ]);
        });
        
        // カテゴリページ
        Category::all()->each(function ($category) use ($urls) {
            $urls->push([
                'url' => "https://techvibe.com/categories/{$category->slug}.html",
                'lastmod' => now()->toDateString(),
                'priority' => '0.6',
            ]);
        });

        $xml = View::make('templates.sitemap', compact('urls'))->render();
        
        $filePath = $this->outputPath . '/sitemap.xml';
        File::put($filePath, $xml);

        return $filePath;
    }

    /**
     * 関連記事取得
     */
    protected function getRelatedArticles(Article $article): \Illuminate\Database\Eloquent\Collection
    {
        return Article::published()
            ->where('id', '!=', $article->id)
            ->where('category_id', $article->category_id)
            ->latest()
            ->take(4)
            ->get();
    }

    /**
     * ディレクトリ存在確認・作成
     */
    protected function ensureDirectoryExists(string $directory): void
    {
        if (!File::exists($directory)) {
            File::makeDirectory($directory, 0755, true);
        }
    }
}
```

### HTML生成コントローラー

```php
// app/Http/Controllers/Api/HtmlGeneratorController.php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\StaticHtmlGeneratorService;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class HtmlGeneratorController extends Controller
{
    public function __construct(
        protected StaticHtmlGeneratorService $htmlGenerator
    ) {}

    /**
     * 単一記事のHTML生成
     */
    public function generateArticleHtml(Request $request): JsonResponse
    {
        $request->validate([
            'article_id' => 'required|exists:articles,id',
        ]);

        $article = Article::findOrFail($request->article_id);
        
        try {
            $filePath = $this->htmlGenerator->generateArticleHtml($article);
            
            return response()->json([
                'success' => true,
                'message' => 'HTML生成が完了しました',
                'file_path' => $filePath,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'HTML生成中にエラーが発生しました',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * 全サイトHTML生成（Server-Sent Events）
     */
    public function generateFullSite(): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        return response()->stream(function () {
            $totalArticles = Article::published()->count();
            $totalCategories = Category::count();
            $totalSteps = $totalArticles + $totalCategories + 2; // +2 for index and sitemap
            
            $currentStep = 0;
            
            // インデックスページ生成
            $this->sendProgress($currentStep++, $totalSteps, 'インデックスページを生成中...');
            $indexPath = $this->htmlGenerator->generateIndexPage();
            $this->sendFileGenerated($indexPath);
            
            // 記事ページ生成
            Article::published()->chunk(10, function ($articles) use (&$currentStep, $totalSteps) {
                foreach ($articles as $article) {
                    $this->sendProgress($currentStep++, $totalSteps, "記事「{$article->title}」を生成中...");
                    $filePath = $this->htmlGenerator->generateArticleHtml($article);
                    $this->sendFileGenerated($filePath);
                }
            });
            
            // カテゴリページ生成
            Category::all()->each(function ($category) use (&$currentStep, $totalSteps) {
                $this->sendProgress($currentStep++, $totalSteps, "カテゴリ「{$category->name}」を生成中...");
                $filePath = $this->htmlGenerator->generateCategoryPage($category);
                $this->sendFileGenerated($filePath);
            });
            
            // サイトマップ生成
            $this->sendProgress($currentStep++, $totalSteps, 'サイトマップを生成中...');
            $sitemapPath = $this->htmlGenerator->generateSitemap();
            $this->sendFileGenerated($sitemapPath);
            
            // 完了通知
            $this->sendProgress($totalSteps, $totalSteps, '全サイトの生成が完了しました！');
            
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'Connection' => 'keep-alive',
        ]);
    }

    /**
     * 進捗状況を送信
     */
    protected function sendProgress(int $current, int $total, string $message): void
    {
        $progress = round(($current / $total) * 100);
        
        echo "data: " . json_encode([
            'type' => 'progress',
            'progress' => $progress,
            'message' => $message,
            'current' => $current,
            'total' => $total,
        ]) . "\n\n";
        
        ob_flush();
        flush();
    }

    /**
     * ファイル生成完了を送信
     */
    protected function sendFileGenerated(string $filePath): void
    {
        echo "data: " . json_encode([
            'type' => 'file_generated',
            'file_path' => $filePath,
        ]) . "\n\n";
        
        ob_flush();
        flush();
    }

    /**
     * 生成状況確認
     */
    public function getStatus(): JsonResponse
    {
        $outputPath = base_path('output');
        
        if (!file_exists($outputPath)) {
            return response()->json([
                'status' => 'not_generated',
                'message' => 'まだHTMLファイルが生成されていません',
            ]);
        }
        
        $files = $this->getGeneratedFiles($outputPath);
        
        return response()->json([
            'status' => 'generated',
            'total_files' => count($files),
            'files' => $files,
            'last_generated' => date('Y-m-d H:i:s', filemtime($outputPath)),
        ]);
    }

    /**
     * 生成ファイル一覧取得
     */
    protected function getGeneratedFiles(string $directory): array
    {
        $files = [];
        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($directory)
        );
        
        foreach ($iterator as $file) {
            if ($file->isFile() && $file->getExtension() === 'html') {
                $files[] = [
                    'path' => $file->getPathname(),
                    'size' => $file->getSize(),
                    'modified' => date('Y-m-d H:i:s', $file->getMTime()),
                ];
            }
        }
        
        return $files;
    }
}
```

## Bladeテンプレート実装例

### 記事テンプレート

```blade
{{-- resources/views/templates/article.blade.php --}}
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title }}</title>
    <meta name="description" content="{{ $description }}">
    <meta name="keywords" content="{{ implode(', ', $keywords) }}">
    <link rel="canonical" href="{{ $canonicalUrl }}">
    
    {{-- Open Graph --}}
    <meta property="og:title" content="{{ $title }}">
    <meta property="og:description" content="{{ $description }}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="{{ $canonicalUrl }}">
    @if($article->featured_image)
        <meta property="og:image" content="{{ $article->featured_image }}">
    @endif
    
    {{-- 構造化データ --}}
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "{{ $article->title }}",
        "description": "{{ $description }}",
        "author": {
            "@type": "Person",
            "name": "{{ $article->author->name }}"
        },
        "datePublished": "{{ $article->published_at->toISOString() }}",
        "dateModified": "{{ $article->updated_at->toISOString() }}",
        "publisher": {
            "@type": "Organization",
            "name": "TechVibe",
            "logo": {
                "@type": "ImageObject",
                "url": "https://techvibe.com/assets/images/logo.png"
            }
        }
    }
    </script>
    
    {{-- CSS --}}
    <link rel="stylesheet" href="/assets/css/main.css">
    <link rel="stylesheet" href="/assets/css/article.css">
</head>
<body class="bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
    {{-- ヘッダー --}}
    @include('templates.partials.header')
    
    <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <main class="lg:col-span-3">
                <article class="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-8">
                    {{-- パンくずリスト --}}
                    <nav class="text-sm text-gray-600 mb-6">
                        <a href="/" class="hover:text-blue-600">ホーム</a>
                        <span class="mx-2">/</span>
                        <a href="/categories/{{ $article->category->slug }}.html" class="hover:text-blue-600">
                            {{ $article->category->name }}
                        </a>
                        <span class="mx-2">/</span>
                        <span class="text-gray-800">{{ $article->title }}</span>
                    </nav>
                    
                    {{-- 記事ヘッダー --}}
                    <header class="mb-8">
                        <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ $article->title }}</h1>
                        
                        <div class="flex items-center text-sm text-gray-600 space-x-4">
                            <span>{{ $article->author->name }}</span>
                            <span>{{ $article->published_at->format('Y年m月d日') }}</span>
                            <span>読了時間: {{ $article->read_time }}分</span>
                        </div>
                        
                        @if($article->featured_image)
                            <img src="{{ $article->featured_image }}" 
                                 alt="{{ $article->title }}" 
                                 class="w-full h-64 object-cover rounded-lg mt-6">
                        @endif
                    </header>
                    
                    {{-- 記事本文 --}}
                    <div class="prose prose-lg max-w-none">
                        {!! $article->content_html !!}
                    </div>
                    
                    {{-- タグ --}}
                    @if($article->tags->count() > 0)
                        <div class="mt-8 pt-6 border-t border-gray-200">
                            <h3 class="text-sm font-medium text-gray-700 mb-2">タグ:</h3>
                            <div class="flex flex-wrap gap-2">
                                @foreach($article->tags as $tag)
                                    <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                        {{ $tag->name }}
                                    </span>
                                @endforeach
                            </div>
                        </div>
                    @endif
                </article>
                
                {{-- 関連記事 --}}
                @if($relatedArticles->count() > 0)
                    <section class="mt-12">
                        <h2 class="text-2xl font-bold text-gray-900 mb-6">関連記事</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            @foreach($relatedArticles as $related)
                                @include('templates.partials.article-card', ['article' => $related])
                            @endforeach
                        </div>
                    </section>
                @endif
            </main>
            
            {{-- サイドバー --}}
            <aside class="lg:col-span-1">
                @include('templates.partials.sidebar')
            </aside>
        </div>
    </div>
    
    {{-- フッター --}}
    @include('templates.partials.footer')
    
    {{-- JavaScript --}}
    <script src="/assets/js/main.js"></script>
</body>
</html>
```

### インデックステンプレート

```blade
{{-- resources/views/templates/index.blade.php --}}
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title }}</title>
    <meta name="description" content="{{ $description }}">
    <meta name="keywords" content="{{ implode(', ', $keywords) }}">
    <link rel="canonical" href="https://techvibe.com/">
    
    {{-- Open Graph --}}
    <meta property="og:title" content="{{ $title }}">
    <meta property="og:description" content="{{ $description }}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://techvibe.com/">
    
    {{-- 構造化データ --}}
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "TechVibe",
        "description": "{{ $description }}",
        "url": "https://techvibe.com/",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://techvibe.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    }
    </script>
    
    {{-- CSS --}}
    <link rel="stylesheet" href="/assets/css/main.css">
</head>
<body class="bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
    {{-- ヘッダー --}}
    @include('templates.partials.header')
    
    <div class="container mx-auto px-4 py-8">
        {{-- ヒーローセクション --}}
        <section class="text-center mb-12">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">
                未来を創るテクノロジーメディア
            </h1>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto">
                最新のテクノロジー、プログラミング、ガジェット情報を美しいデザインでお届けします
            </p>
        </section>
        
        {{-- 注目記事 --}}
        @if($featuredArticles->count() > 0)
            <section class="mb-12">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">注目記事</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    @foreach($featuredArticles as $article)
                        @include('templates.partials.featured-article-card', ['article' => $article])
                    @endforeach
                </div>
            </section>
        @endif
        
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <main class="lg:col-span-3">
                {{-- 最新記事 --}}
                <section>
                    <h2 class="text-2xl font-bold text-gray-900 mb-6">最新記事</h2>
                    <div class="space-y-8">
                        @foreach($articles as $article)
                            @include('templates.partials.article-card', ['article' => $article])
                        @endforeach
                    </div>
                </section>
                
                {{-- もっと見るボタン --}}
                <div class="text-center mt-12">
                    <a href="/articles/" 
                       class="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300">
                        すべての記事を見る
                    </a>
                </div>
            </main>
            
            {{-- サイドバー --}}
            <aside class="lg:col-span-1">
                @include('templates.partials.sidebar')
            </aside>
        </div>
    </div>
    
    {{-- フッター --}}
    @include('templates.partials.footer')
    
    {{-- JavaScript --}}
    <script src="/assets/js/main.js"></script>
</body>
</html>
```

### サイトマップテンプレート

```blade
{{-- resources/views/templates/sitemap.blade.php --}}
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    @foreach($urls as $url)
        <url>
            <loc>{{ $url['url'] }}</loc>
            <lastmod>{{ $url['lastmod'] }}</lastmod>
            <priority>{{ $url['priority'] }}</priority>
        </url>
    @endforeach
</urlset>
```

## Next.js SSG設定

### Next.js設定ファイル

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  
  async generateBuildId() {
    return 'seo-blog-' + Date.now()
  },
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

### 静的生成実装

```typescript
// app/page.tsx - インデックスページ
import { ArticleCard } from '@/components/blog/ArticleCard'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Sidebar } from '@/components/layout/Sidebar'

export default async function HomePage() {
  // APIから記事データを取得
  const articles = await fetchArticles()
  const featuredArticles = await fetchFeaturedArticles()
  
  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* ヒーローセクション */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            未来を創るテクノロジーメディア
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            最新のテクノロジー、プログラミング、ガジェット情報を美しいデザインでお届けします
          </p>
        </section>
        
        {/* 注目記事 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">注目記事</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </div>
        </section>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <main className="lg:col-span-3">
            {/* 最新記事 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">最新記事</h2>
              <div className="space-y-8">
                {articles.map((article) => (
                  <ArticleCard key={article.id} {...article} />
                ))}
              </div>
            </section>
          </main>
          
          <aside className="lg:col-span-1">
            <Sidebar />
          </aside>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

// データ取得関数
async function fetchArticles() {
  // Laravel APIから記事データを取得
  const response = await fetch('http://localhost:80/api/v1/articles')
  const data = await response.json()
  return data.data
}

async function fetchFeaturedArticles() {
  // Laravel APIから注目記事データを取得
  const response = await fetch('http://localhost:80/api/v1/articles?featured=true')
  const data = await response.json()
  return data.data
}
```

## 実装のポイント

1. **完全な静的HTML**: 外部依存のない独立したHTMLファイルを生成
2. **SEO最適化**: すべてのメタデータを静的に埋め込み
3. **ファイル管理**: 生成されたHTMLファイルの適切な管理
4. **テンプレート設計**: 柔軟で再利用可能なテンプレート構造
5. **パフォーマンス**: 軽量で高速なHTMLファイルの生成
6. **アクセシビリティ**: WCAG準拠の静的HTML生成
