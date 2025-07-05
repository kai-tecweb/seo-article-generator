<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Article;
use App\Models\Author;
use App\Models\Category;
use App\Models\Tag;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some authors, categories, and tags
        $authors = Author::all();
        $categories = Category::all();
        $tags = Tag::all();

        // Create sample articles
        $articles = [
            [
                'title' => 'Laravel 12の新機能とベストプラクティス',
                'slug' => 'laravel-12-new-features-best-practices',
                'content' => 'Laravel 12がリリースされ、多くの新機能が追加されました。この記事では、主要な新機能とそれらを実際のプロジェクトで活用する方法について詳しく解説します。',
                'content_html' => '<p>Laravel 12がリリースされ、多くの新機能が追加されました。この記事では、主要な新機能とそれらを実際のプロジェクトで活用する方法について詳しく解説します。</p>',
                'excerpt' => 'Laravel 12の新機能とベストプラクティスについて詳しく解説します。',
                'meta_title' => 'Laravel 12新機能完全ガイド | 最新のPHPフレームワーク',
                'meta_description' => 'Laravel 12の新機能を詳しく解説。開発者向けの実践的なガイドです。',
                'keywords' => ['Laravel 12', 'PHP', 'フレームワーク', '新機能'],
                'status' => 'published',
            ],
            [
                'title' => 'Next.js 15でのReact Server Components活用法',
                'slug' => 'nextjs-15-react-server-components',
                'content' => 'Next.js 15では、React Server Componentsが大幅に改善されました。この記事では、サーバーサイドレンダリングを効率的に行う方法と、パフォーマンスを最大化するテクニックを紹介します。',
                'content_html' => '<p>Next.js 15では、React Server Componentsが大幅に改善されました。この記事では、サーバーサイドレンダリングを効率的に行う方法と、パフォーマンスを最大化するテクニックを紹介します。</p>',
                'excerpt' => 'Next.js 15でのReact Server Components活用法について解説します。',
                'meta_title' => 'Next.js 15 React Server Components完全ガイド',
                'meta_description' => 'Next.js 15のReact Server Components機能を詳しく解説。',
                'keywords' => ['Next.js 15', 'React', 'Server Components', 'SSR'],
                'status' => 'published',
            ],
            [
                'title' => 'TypeScriptの型安全性を最大化する高度なテクニック',
                'slug' => 'typescript-type-safety-advanced-techniques',
                'content' => 'TypeScriptの型システムを深く理解し、より安全で保守性の高いコードを書くための高度なテクニックを解説します。',
                'content_html' => '<p>TypeScriptの型システムを深く理解し、より安全で保守性の高いコードを書くための高度なテクニックを解説します。</p>',
                'excerpt' => 'TypeScriptの型安全性を最大化する高度なテクニックを学びます。',
                'meta_title' => 'TypeScript型安全性完全ガイド | 高度なテクニック',
                'meta_description' => 'TypeScriptの型安全性を最大化する高度なテクニックを詳しく解説。',
                'keywords' => ['TypeScript', '型安全性', 'プログラミング', 'JavaScript'],
                'status' => 'published',
            ],
            [
                'title' => 'SEO対策の基本から応用まで完全解説',
                'slug' => 'seo-optimization-complete-guide',
                'content' => 'SEO対策の基本から応用まで、実践的な手法を詳しく解説します。検索エンジンで上位表示を目指すための包括的なガイドです。',
                'content_html' => '<p>SEO対策の基本から応用まで、実践的な手法を詳しく解説します。検索エンジンで上位表示を目指すための包括的なガイドです。</p>',
                'excerpt' => 'SEO対策の基本から応用まで完全解説します。',
                'meta_title' => 'SEO対策完全ガイド | 検索エンジン最適化',
                'meta_description' => 'SEO対策の基本から応用まで、実践的な手法を詳しく解説します。',
                'keywords' => ['SEO', '検索エンジン最適化', 'ウェブマーケティング'],
                'status' => 'published',
            ],
            [
                'title' => 'Docker活用による開発環境の効率化',
                'slug' => 'docker-development-environment-optimization',
                'content' => 'Dockerを活用して開発環境を効率化する方法について詳しく解説します。コンテナ化によるメリットと実装のポイントを紹介します。',
                'content_html' => '<p>Dockerを活用して開発環境を効率化する方法について詳しく解説します。コンテナ化によるメリットと実装のポイントを紹介します。</p>',
                'excerpt' => 'Docker活用による開発環境の効率化について解説します。',
                'meta_title' => 'Docker開発環境効率化ガイド | コンテナ化のメリット',
                'meta_description' => 'Dockerを活用した開発環境の効率化について詳しく解説。',
                'keywords' => ['Docker', 'コンテナ', '開発環境', 'DevOps'],
                'status' => 'draft',
            ],
        ];

        foreach ($articles as $articleData) {
            $article = Article::create([
                'title' => $articleData['title'],
                'slug' => $articleData['slug'],
                'content' => $articleData['content'],
                'content_html' => $articleData['content_html'],
                'excerpt' => $articleData['excerpt'],
                'meta_title' => $articleData['meta_title'],
                'meta_description' => $articleData['meta_description'],
                'keywords' => $articleData['keywords'],
                'status' => $articleData['status'],
                'author_id' => $authors->random()->id,
                'category_id' => $categories->random()->id,
                'published_at' => $articleData['status'] === 'published' ? now() : null,
            ]);

            // Attach random tags
            $randomTags = $tags->random(2);
            $article->tags()->attach($randomTags->pluck('id'));
        }
    }
}
