# コンポーネント設計・実装例

## 基本原則

### コンポーネント分類
- **Atomic Components**: 最小単位のコンポーネント（Button, Input, Icon等）
- **Molecule Components**: 複数のAtomicを組み合わせたコンポーネント（SearchBox, Card等）
- **Organism Components**: 完全な機能を持つコンポーネント（Header, ArticleList等）
- **Template Components**: レイアウトテンプレート
- **Page Components**: ページ固有のコンポーネント

### 命名規則
- PascalCase（例: `ArticleCard`, `SearchInput`）
- 責務を明確にする名前（例: `ArticleEditForm`, `CategorySelector`）
- プレフィックスで分類（例: `Form*`, `Modal*`, `List*`）

## Atomic Components

### Button
```tsx
// components/atoms/Button.tsx
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    isLoading, 
    leftIcon, 
    rightIcon,
    className,
    disabled,
    ...props 
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
    
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
      outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
    }
    
    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base'
    }
    
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {leftIcon && !isLoading && leftIcon}
        {children}
        {rightIcon && !isLoading && rightIcon}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
```

### Input
```tsx
// components/atoms/Input.tsx
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helper?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    helper, 
    leftIcon, 
    rightIcon, 
    className,
    ...props 
  }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        {helper && !error && (
          <p className="text-sm text-gray-500">{helper}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
```

### Badge
```tsx
// components/atoms/Badge.tsx
import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className,
  ...props 
}: BadgeProps) => {
  const baseStyles = 'inline-flex items-center rounded-full font-medium'
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800'
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  }
  
  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge
```

## Molecule Components

### SearchBox
```tsx
// components/molecules/SearchBox.tsx
import { useState } from 'react'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface SearchBoxProps {
  placeholder?: string
  onSearch: (query: string) => void
  isLoading?: boolean
  defaultValue?: string
}

const SearchBox = ({ 
  placeholder = "検索...", 
  onSearch, 
  isLoading,
  defaultValue = ""
}: SearchBoxProps) => {
  const [query, setQuery] = useState(defaultValue)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex-1">
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          leftIcon={<MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />}
        />
      </div>
      <Button
        type="submit"
        isLoading={isLoading}
        disabled={!query.trim()}
      >
        検索
      </Button>
    </form>
  )
}

export default SearchBox
```

### ArticleCard
```tsx
// components/molecules/ArticleCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import Badge from '@/components/atoms/Badge'
import { Article } from '@/types/article'
import { formatDate } from '@/lib/utils'

interface ArticleCardProps {
  article: Article
  showExcerpt?: boolean
  showAuthor?: boolean
  showReadTime?: boolean
}

const ArticleCard = ({ 
  article, 
  showExcerpt = true, 
  showAuthor = true,
  showReadTime = true 
}: ArticleCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {article.featured_image && (
        <div className="aspect-video relative">
          <Image
            src={article.featured_image}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="primary" size="sm">
            {article.category.name}
          </Badge>
          {article.ai_generated && (
            <Badge variant="secondary" size="sm">
              AI生成
            </Badge>
          )}
        </div>
        
        <h3 className="text-xl font-semibold mb-2">
          <Link 
            href={`/articles/${article.slug}`}
            className="hover:text-blue-600 transition-colors"
          >
            {article.title}
          </Link>
        </h3>
        
        {showExcerpt && (
          <p className="text-gray-600 mb-4 line-clamp-2">
            {article.excerpt}
          </p>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            {showAuthor && (
              <span>by {article.author.name}</span>
            )}
            <span>{formatDate(article.published_at)}</span>
          </div>
          
          {showReadTime && (
            <span>{article.read_time}分で読める</span>
          )}
        </div>
        
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-4">
            {article.tags.map(tag => (
              <Badge key={tag.id} variant="secondary" size="sm">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ArticleCard
```

### CategorySelector
```tsx
// components/molecules/CategorySelector.tsx
import { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { Category } from '@/types/article'

interface CategorySelectorProps {
  categories: Category[]
  selectedCategory?: Category
  onSelect: (category: Category | null) => void
  placeholder?: string
}

const CategorySelector = ({ 
  categories, 
  selectedCategory, 
  onSelect,
  placeholder = "カテゴリを選択"
}: CategorySelectorProps) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <span className="text-sm">
          {selectedCategory ? selectedCategory.name : placeholder}
        </span>
        <ChevronDownIcon className="h-4 w-4 text-gray-400" />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="py-1">
            <button
              onClick={() => {
                onSelect(null)
                setIsOpen(false)
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
            >
              すべて
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => {
                  onSelect(category)
                  setIsOpen(false)
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CategorySelector
```

## Organism Components

### Header
```tsx
// components/organisms/Header.tsx
import Link from 'next/link'
import { useState } from 'react'
import Button from '@/components/atoms/Button'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const navigation = [
    { name: 'ホーム', href: '/' },
    { name: '記事一覧', href: '/articles' },
    { name: 'カテゴリ', href: '/categories' },
    { name: 'タグ', href: '/tags' },
    { name: 'お問い合わせ', href: '/contact' }
  ]
  
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">
                記事メーカー
              </span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {navigation.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm">
              ログイン
            </Button>
            <Button size="sm">
              記事作成
            </Button>
          </div>
          
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {navigation.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  ログイン
                </Button>
                <Button size="sm" className="w-full">
                  記事作成
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
```

### ArticleList
```tsx
// components/organisms/ArticleList.tsx
import { useState } from 'react'
import ArticleCard from '@/components/molecules/ArticleCard'
import SearchBox from '@/components/molecules/SearchBox'
import CategorySelector from '@/components/molecules/CategorySelector'
import Button from '@/components/atoms/Button'
import { Article, Category } from '@/types/article'

interface ArticleListProps {
  articles: Article[]
  categories: Category[]
  isLoading?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  onSearch?: (query: string) => void
  onCategoryFilter?: (category: Category | null) => void
}

const ArticleList = ({
  articles,
  categories,
  isLoading,
  hasMore,
  onLoadMore,
  onSearch,
  onCategoryFilter
}: ArticleListProps) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  
  const handleCategorySelect = (category: Category | null) => {
    setSelectedCategory(category)
    onCategoryFilter?.(category)
  }
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          {onSearch && (
            <SearchBox
              placeholder="記事を検索..."
              onSearch={onSearch}
              isLoading={isLoading}
            />
          )}
        </div>
        <div className="w-full sm:w-48">
          <CategorySelector
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={handleCategorySelect}
          />
        </div>
      </div>
      
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
            <ArticleCard
              key={article.id}
              article={article}
              showExcerpt={true}
              showAuthor={true}
              showReadTime={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">記事が見つかりませんでした。</p>
        </div>
      )}
      
      {hasMore && (
        <div className="text-center">
          <Button
            onClick={onLoadMore}
            isLoading={isLoading}
            variant="outline"
          >
            さらに読み込む
          </Button>
        </div>
      )}
    </div>
  )
}

export default ArticleList
```

## フォームコンポーネント

### ArticleForm
```tsx
// components/organisms/ArticleForm.tsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import { Article, Category, Tag } from '@/types/article'

const articleSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').max(200, 'タイトルは200文字以内で入力してください'),
  slug: z.string().min(1, 'スラッグは必須です').regex(/^[a-z0-9-]+$/, 'スラッグは英数字とハイフンのみ使用可能です'),
  excerpt: z.string().min(1, '概要は必須です').max(300, '概要は300文字以内で入力してください'),
  content: z.string().min(1, '本文は必須です'),
  meta_description: z.string().max(160, 'メタディスクリプションは160文字以内で入力してください'),
  keywords: z.array(z.string()).min(1, 'キーワードは1つ以上設定してください'),
  category_id: z.number().min(1, 'カテゴリを選択してください'),
  tag_ids: z.array(z.number()).optional(),
  featured_image: z.string().url().optional().or(z.literal('')),
  status: z.enum(['draft', 'published', 'archived'])
})

type ArticleFormData = z.infer<typeof articleSchema>

interface ArticleFormProps {
  article?: Article
  categories: Category[]
  tags: Tag[]
  onSubmit: (data: ArticleFormData) => void
  isLoading?: boolean
}

const ArticleForm = ({ article, categories, tags, onSubmit, isLoading }: ArticleFormProps) => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>(article?.tags || [])
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: article ? {
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      meta_description: article.meta_description,
      keywords: article.keywords,
      category_id: article.category.id,
      tag_ids: article.tags.map(tag => tag.id),
      featured_image: article.featured_image || '',
      status: article.status
    } : {
      status: 'draft'
    }
  })
  
  const handleTagToggle = (tag: Tag) => {
    const isSelected = selectedTags.some(t => t.id === tag.id)
    const newTags = isSelected 
      ? selectedTags.filter(t => t.id !== tag.id)
      : [...selectedTags, tag]
    
    setSelectedTags(newTags)
    setValue('tag_ids', newTags.map(t => t.id))
  }
  
  const handleFormSubmit = (data: ArticleFormData) => {
    onSubmit({
      ...data,
      tag_ids: selectedTags.map(tag => tag.id)
    })
  }
  
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Input
          label="タイトル"
          error={errors.title?.message}
          {...register('title')}
        />
        
        <Input
          label="スラッグ"
          helper="URLに使用されます（英数字とハイフンのみ）"
          error={errors.slug?.message}
          {...register('slug')}
        />
      </div>
      
      <Input
        label="概要"
        error={errors.excerpt?.message}
        {...register('excerpt')}
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          本文
        </label>
        <textarea
          rows={10}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          {...register('content')}
        />
        {errors.content && (
          <p className="mt-2 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            カテゴリ
          </label>
          <select
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            {...register('category_id', { valueAsNumber: true })}
          >
            <option value="">カテゴリを選択</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category_id && (
            <p className="mt-2 text-sm text-red-600">{errors.category_id.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ステータス
          </label>
          <select
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            {...register('status')}
          >
            <option value="draft">下書き</option>
            <option value="published">公開</option>
            <option value="archived">アーカイブ</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          タグ
        </label>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => {
            const isSelected = selectedTags.some(t => t.id === tag.id)
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  isSelected 
                    ? 'bg-blue-100 border-blue-300 text-blue-800' 
                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag.name}
              </button>
            )
          })}
        </div>
      </div>
      
      <Input
        label="アイキャッチ画像URL"
        error={errors.featured_image?.message}
        {...register('featured_image')}
      />
      
      <Input
        label="メタディスクリプション"
        helper="SEO用の説明文（160文字以内）"
        error={errors.meta_description?.message}
        {...register('meta_description')}
      />
      
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          キャンセル
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
        >
          {article ? '更新' : '作成'}
        </Button>
      </div>
    </form>
  )
}

export default ArticleForm
```

## 使用方法・ベストプラクティス

### プロップスの型定義
```typescript
// 必須プロップスと任意プロップスを明確に分離
interface ComponentProps {
  // 必須プロップス
  title: string
  onSubmit: (data: FormData) => void
  
  // 任意プロップス
  description?: string
  isLoading?: boolean
  className?: string
  
  // 子要素
  children?: React.ReactNode
}
```

### コンポーネントの再利用性
```typescript
// 汎用的なプロップスを提供
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  keyExtractor: (item: T) => string | number
  emptyMessage?: string
}

const List = <T,>({ items, renderItem, keyExtractor, emptyMessage }: ListProps<T>) => {
  if (items.length === 0) {
    return <div className="text-center py-8 text-gray-500">{emptyMessage}</div>
  }
  
  return (
    <div className="space-y-4">
      {items.map(item => (
        <div key={keyExtractor(item)}>
          {renderItem(item)}
        </div>
      ))}
    </div>
  )
}
```

### エラーハンドリング
```typescript
// エラーバウンダリーコンポーネント
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true }
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Component Error:', error, errorInfo)
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            エラーが発生しました
          </h2>
          <p className="text-gray-600">
            ページを再読み込みしてください
          </p>
        </div>
      )
    }
    
    return this.props.children
  }
}
```

### アクセシビリティ
```typescript
// WAI-ARIA属性を適切に設定
const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <h2 id="modal-title" className="text-xl font-semibold mb-4">
            {title}
          </h2>
          {children}
        </div>
      </div>
    </div>
  )
}
```

これらのコンポーネントを参考に、一貫性のあるUIを構築し、保守性・再利用性を高めてください。
