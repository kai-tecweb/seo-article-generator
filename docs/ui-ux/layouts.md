# レイアウト設計・実装例

## 基本原則

### レスポンシブデザイン
- **Mobile First**: スマートフォンを基準にデザインし、大画面に拡張
- **Breakpoints**: 
  - `sm`: 640px以上（タブレット）
  - `md`: 768px以上（小さなデスクトップ）
  - `lg`: 1024px以上（デスクトップ）
  - `xl`: 1280px以上（大きなデスクトップ）
  - `2xl`: 1536px以上（超大画面）

### グリッドシステム
- **12カラムグリッド**: 柔軟なレイアウト構成
- **Gap**: 一貫した間隔設定（4px, 8px, 16px, 24px, 32px）
- **Container**: 最大幅とセンタリング

### 余白・間隔
- **Padding**: 内側の余白
- **Margin**: 外側の余白
- **Space**: 要素間の間隔

## 基本レイアウト

### AppLayout
```tsx
// components/layouts/AppLayout.tsx
import { ReactNode } from 'react'
import Header from '@/components/organisms/Header'
import Footer from '@/components/organisms/Footer'
import Sidebar from '@/components/organisms/Sidebar'

interface AppLayoutProps {
  children: ReactNode
  showSidebar?: boolean
  sidebarContent?: ReactNode
}

const AppLayout = ({ children, showSidebar = false, sidebarContent }: AppLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-1 flex">
        {showSidebar && (
          <aside className="w-64 bg-white shadow-sm border-r hidden lg:block">
            <div className="sticky top-0 h-screen overflow-y-auto">
              {sidebarContent || <Sidebar />}
            </div>
          </aside>
        )}
        
        <main className="flex-1 overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  )
}

export default AppLayout
```

### AuthLayout
```tsx
// components/layouts/AuthLayout.tsx
import { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
  showBackLink?: boolean
}

const AuthLayout = ({ children, title, subtitle, showBackLink = true }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <Link href="/" className="flex items-center">
              <span className="text-3xl font-bold text-blue-600">
                記事メーカー
              </span>
            </Link>
          </div>
          
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {title}
          </h2>
          
          {subtitle && (
            <p className="mt-2 text-center text-sm text-gray-600">
              {subtitle}
            </p>
          )}
          
          {showBackLink && (
            <div className="mt-4 text-center">
              <Link 
                href="/" 
                className="text-blue-600 hover:text-blue-500 text-sm font-medium"
              >
                ← ホームに戻る
              </Link>
            </div>
          )}
        </div>
        
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
```

### DashboardLayout
```tsx
// components/layouts/DashboardLayout.tsx
import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { cn } from '@/lib/utils'
import {
  HomeIcon,
  DocumentTextIcon,
  FolderIcon,
  TagIcon,
  CogIcon,
  ChartBarIcon,
  PlusIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface DashboardLayoutProps {
  children: ReactNode
  title?: string
}

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()
  
  const navigation = [
    { name: 'ダッシュボード', href: '/dashboard', icon: HomeIcon },
    { name: '記事管理', href: '/dashboard/articles', icon: DocumentTextIcon },
    { name: 'カテゴリ管理', href: '/dashboard/categories', icon: FolderIcon },
    { name: 'タグ管理', href: '/dashboard/tags', icon: TagIcon },
    { name: '統計', href: '/dashboard/analytics', icon: ChartBarIcon },
    { name: '設定', href: '/dashboard/settings', icon: CogIcon }
  ]
  
  const isActive = (href: string) => router.pathname === href
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden",
        isSidebarOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-full max-w-xs">
          <div className="flex flex-col flex-1 bg-white">
            <div className="flex items-center justify-between h-16 px-4 border-b">
              <span className="text-xl font-bold text-blue-600">管理画面</span>
              <button onClick={() => setIsSidebarOpen(false)}>
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    isActive(item.href)
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 bg-white border-r">
          <div className="flex items-center h-16 px-4 border-b">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">管理画面</span>
            </Link>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                  isActive(item.href)
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Main content */}
      <div className="lg:ml-64">
        <div className="sticky top-0 z-10 bg-white border-b">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                className="lg:hidden"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              {title && (
                <h1 className="ml-4 lg:ml-0 text-xl font-semibold text-gray-900">
                  {title}
                </h1>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard/articles/new"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                新規記事
              </Link>
            </div>
          </div>
        </div>
        
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
```

## 特殊レイアウト

### ArticleLayout
```tsx
// components/layouts/ArticleLayout.tsx
import { ReactNode } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import AppLayout from './AppLayout'
import Badge from '@/components/atoms/Badge'
import { Article } from '@/types/article'
import { formatDate } from '@/lib/utils'

interface ArticleLayoutProps {
  article: Article
  children: ReactNode
}

const ArticleLayout = ({ article, children }: ArticleLayoutProps) => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.meta_description,
    image: article.featured_image,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    author: {
      '@type': 'Person',
      name: article.author.name
    },
    publisher: {
      '@type': 'Organization',
      name: 'SEO記事メーカー'
    }
  }
  
  return (
    <>
      <Head>
        <title>{article.title} | SEO記事メーカー</title>
        <meta name="description" content={article.meta_description} />
        <meta name="keywords" content={article.keywords.join(', ')} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.meta_description} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={article.featured_image} />
        <meta property="article:published_time" content={article.published_at} />
        <meta property="article:modified_time" content={article.updated_at} />
        <meta property="article:author" content={article.author.name} />
        <meta property="article:section" content={article.category.name} />
        {article.tags.map(tag => (
          <meta key={tag.id} property="article:tag" content={tag.name} />
        ))}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      
      <AppLayout>
        <div className="max-w-4xl mx-auto">
          {/* パンくずリスト */}
          <nav className="flex text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">ホーム</Link>
            <span className="mx-2">/</span>
            <Link href="/articles" className="hover:text-blue-600">記事一覧</Link>
            <span className="mx-2">/</span>
            <Link 
              href={`/categories/${article.category.slug}`} 
              className="hover:text-blue-600"
            >
              {article.category.name}
            </Link>
            <span className="mx-2">/</span>
            <span className="truncate">{article.title}</span>
          </nav>
          
          {/* 記事ヘッダー */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="primary">
                {article.category.name}
              </Badge>
              {article.ai_generated && (
                <Badge variant="secondary">
                  AI生成
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                {article.author.avatar && (
                  <Image
                    src={article.author.avatar}
                    alt={article.author.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
                <span>by {article.author.name}</span>
              </div>
              <span>公開日: {formatDate(article.published_at)}</span>
              <span>更新日: {formatDate(article.updated_at)}</span>
              <span>{article.read_time}分で読める</span>
              <span>{article.views.toLocaleString()}回閲覧</span>
            </div>
            
            {article.featured_image && (
              <div className="aspect-video relative mb-6">
                <Image
                  src={article.featured_image}
                  alt={article.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}
            
            <div className="text-lg text-gray-700 mb-8">
              {article.excerpt}
            </div>
          </header>
          
          {/* 記事本文 */}
          <article className="prose prose-lg max-w-none mb-12">
            {children}
          </article>
          
          {/* タグ */}
          {article.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">関連タグ</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map(tag => (
                  <Link
                    key={tag.id}
                    href={`/tags/${tag.slug}`}
                    className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* 共有ボタン */}
          <div className="border-t pt-8">
            <h3 className="text-lg font-semibold mb-4">この記事をシェア</h3>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Twitter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 transition-colors">
                Facebook
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors">
                リンクをコピー
              </button>
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  )
}

export default ArticleLayout
```

### ErrorLayout
```tsx
// components/layouts/ErrorLayout.tsx
import { ReactNode } from 'react'
import Link from 'next/link'
import Button from '@/components/atoms/Button'

interface ErrorLayoutProps {
  children: ReactNode
  statusCode?: number
  title?: string
  description?: string
  showHomeLink?: boolean
}

const ErrorLayout = ({ 
  children, 
  statusCode, 
  title, 
  description,
  showHomeLink = true 
}: ErrorLayoutProps) => {
  const defaultTitle = statusCode === 404 ? 'ページが見つかりません' : 'エラーが発生しました'
  const defaultDescription = statusCode === 404 
    ? 'お探しのページは存在しないか、移動した可能性があります。'
    : 'しばらく時間をおいてから再度お試しください。'
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center space-y-8">
        {statusCode && (
          <div className="text-6xl font-bold text-gray-300">
            {statusCode}
          </div>
        )}
        
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {title || defaultTitle}
          </h1>
          
          <p className="text-gray-600">
            {description || defaultDescription}
          </p>
        </div>
        
        {children}
        
        {showHomeLink && (
          <div className="space-y-4">
            <Link href="/">
              <Button>
                ホームに戻る
              </Button>
            </Link>
            
            <div className="text-sm text-gray-500">
              または
              <button 
                onClick={() => window.history.back()}
                className="ml-1 text-blue-600 hover:text-blue-500"
              >
                前のページに戻る
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ErrorLayout
```

## グリッドシステム

### Container
```tsx
// components/layouts/Container.tsx
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ContainerProps {
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  className?: string
}

const Container = ({ children, size = 'lg', className }: ContainerProps) => {
  const sizes = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-none'
  }
  
  return (
    <div className={cn(
      'mx-auto px-4 sm:px-6 lg:px-8',
      sizes[size],
      className
    )}>
      {children}
    </div>
  )
}

export default Container
```

### Grid
```tsx
// components/layouts/Grid.tsx
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GridProps {
  children: ReactNode
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const Grid = ({ children, cols = 1, gap = 'md', className }: GridProps) => {
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
    12: 'grid-cols-12'
  }
  
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  }
  
  return (
    <div className={cn(
      'grid',
      colsClasses[cols],
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  )
}

export default Grid
```

## セクションレイアウト

### Hero Section
```tsx
// components/sections/HeroSection.tsx
import { ReactNode } from 'react'
import Container from '@/components/layouts/Container'
import Button from '@/components/atoms/Button'

interface HeroSectionProps {
  title: string
  subtitle?: string
  description?: string
  actions?: ReactNode
  backgroundImage?: string
  overlay?: boolean
}

const HeroSection = ({ 
  title, 
  subtitle, 
  description, 
  actions,
  backgroundImage,
  overlay = false 
}: HeroSectionProps) => {
  return (
    <section className={cn(
      'relative py-20 lg:py-32',
      backgroundImage ? 'bg-cover bg-center' : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    )} style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}>
      {overlay && backgroundImage && (
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      )}
      
      <Container className="relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {subtitle && (
            <p className={cn(
              'text-sm font-semibold uppercase tracking-wide mb-4',
              backgroundImage && overlay ? 'text-blue-200' : 'text-blue-600'
            )}>
              {subtitle}
            </p>
          )}
          
          <h1 className={cn(
            'text-4xl lg:text-6xl font-bold mb-6',
            backgroundImage && overlay ? 'text-white' : 'text-gray-900'
          )}>
            {title}
          </h1>
          
          {description && (
            <p className={cn(
              'text-lg lg:text-xl mb-8',
              backgroundImage && overlay ? 'text-gray-200' : 'text-gray-600'
            )}>
              {description}
            </p>
          )}
          
          {actions && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {actions}
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}

export default HeroSection
```

### Content Section
```tsx
// components/sections/ContentSection.tsx
import { ReactNode } from 'react'
import Container from '@/components/layouts/Container'
import { cn } from '@/lib/utils'

interface ContentSectionProps {
  children: ReactNode
  title?: string
  subtitle?: string
  centered?: boolean
  background?: 'white' | 'gray' | 'blue'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const ContentSection = ({ 
  children, 
  title, 
  subtitle, 
  centered = false,
  background = 'white',
  size = 'lg',
  className 
}: ContentSectionProps) => {
  const backgrounds = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    blue: 'bg-blue-50'
  }
  
  return (
    <section className={cn(
      'py-16 lg:py-24',
      backgrounds[background],
      className
    )}>
      <Container size={size}>
        {(title || subtitle) && (
          <div className={cn(
            'mb-16',
            centered && 'text-center max-w-3xl mx-auto'
          )}>
            {subtitle && (
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 mb-4">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                {title}
              </h2>
            )}
          </div>
        )}
        
        {children}
      </Container>
    </section>
  )
}

export default ContentSection
```

## 使用例

### ページレイアウトの組み合わせ
```tsx
// pages/index.tsx
import AppLayout from '@/components/layouts/AppLayout'
import HeroSection from '@/components/sections/HeroSection'
import ContentSection from '@/components/sections/ContentSection'
import Grid from '@/components/layouts/Grid'
import ArticleCard from '@/components/molecules/ArticleCard'
import Button from '@/components/atoms/Button'

const HomePage = ({ articles, categories }) => {
  return (
    <AppLayout>
      <HeroSection
        title="SEO最適化された記事を自動生成"
        subtitle="AI powered"
        description="AI技術を活用して、SEOに最適化された高品質な記事を効率的に生成します。"
        actions={
          <>
            <Button size="lg">
              記事を作成する
            </Button>
            <Button variant="outline" size="lg">
              機能を見る
            </Button>
          </>
        }
      />
      
      <ContentSection
        title="最新の記事"
        subtitle="Latest Articles"
        centered
      >
        <Grid cols={3} gap="lg">
          {articles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </Grid>
      </ContentSection>
      
      <ContentSection
        title="カテゴリ別記事"
        background="gray"
      >
        {/* カテゴリ別コンテンツ */}
      </ContentSection>
    </AppLayout>
  )
}

export default HomePage
```

### 管理画面レイアウト
```tsx
// pages/dashboard/articles.tsx
import DashboardLayout from '@/components/layouts/DashboardLayout'
import ContentSection from '@/components/sections/ContentSection'
import ArticleList from '@/components/organisms/ArticleList'

const ArticlesPage = ({ articles, categories }) => {
  return (
    <DashboardLayout title="記事管理">
      <ContentSection>
        <ArticleList
          articles={articles}
          categories={categories}
          onLoadMore={() => {}}
          onSearch={() => {}}
          onCategoryFilter={() => {}}
        />
      </ContentSection>
    </DashboardLayout>
  )
}

export default ArticlesPage
```

これらのレイアウトコンポーネントを使用することで、一貫性のあるデザインと効率的な開発が実現できます。
