# 状態管理・データフェッチ実装例

## 状態管理（Zustand）

### 記事管理ストア

```typescript
// stores/articleStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Article {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string
  meta_description: string
  keywords: string[]
  featured_image?: string
  published_at: string
  updated_at: string
  status: 'draft' | 'published' | 'archived'
  category: Category
  author: Author
  tags: Tag[]
  ai_generated: boolean
  read_time: number
  views: number
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
}

export interface Author {
  id: number
  name: string
  email: string
  avatar?: string
}

export interface Tag {
  id: number
  name: string
  slug: string
}

interface ArticleState {
  articles: Article[]
  selectedArticle: Article | null
  loading: boolean
  error: string | null
  pagination: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
  filters: {
    status?: string
    category?: string
    author?: string
    search?: string
  }
  
  // Actions
  fetchArticles: (params?: any) => Promise<void>
  fetchArticleById: (id: number) => Promise<void>
  createArticle: (data: Partial<Article>) => Promise<void>
  updateArticle: (id: number, data: Partial<Article>) => Promise<void>
  deleteArticle: (id: number) => Promise<void>
  publishArticle: (id: number) => Promise<void>
  unpublishArticle: (id: number) => Promise<void>
  setFilters: (filters: any) => void
  setSelectedArticle: (article: Article | null) => void
  clearError: () => void
  reset: () => void
}

export const useArticleStore = create<ArticleState>()(
  persist(
    (set, get) => ({
      articles: [],
      selectedArticle: null,
      loading: false,
      error: null,
      pagination: {
        page: 1,
        per_page: 10,
        total: 0,
        total_pages: 0,
      },
      filters: {},

      fetchArticles: async (params = {}) => {
        set({ loading: true, error: null })
        
        try {
          const queryParams = new URLSearchParams({
            ...get().filters,
            ...params,
            page: params.page || get().pagination.page,
            per_page: params.per_page || get().pagination.per_page,
          }).toString()

          const response = await fetch(`/api/v1/articles?${queryParams}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            },
          })

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }

          const data = await response.json()
          
          set({
            articles: data.data,
            pagination: {
              page: data.meta.current_page,
              per_page: data.meta.per_page,
              total: data.meta.total,
              total_pages: data.meta.last_page,
            },
            loading: false,
          })
        } catch (error) {
          set({
            error: error.message,
            loading: false,
          })
        }
      },

      fetchArticleById: async (id: number) => {
        set({ loading: true, error: null })
        
        try {
          const response = await fetch(`/api/v1/articles/${id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            },
          })

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }

          const data = await response.json()
          set({
            selectedArticle: data.data,
            loading: false,
          })
        } catch (error) {
          set({
            error: error.message,
            loading: false,
          })
        }
      },

      createArticle: async (articleData: Partial<Article>) => {
        set({ loading: true, error: null })
        
        try {
          const response = await fetch('/api/v1/articles', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            },
            body: JSON.stringify(articleData),
          })

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }

          const data = await response.json()
          
          set(state => ({
            articles: [data.data, ...state.articles],
            selectedArticle: data.data,
            loading: false,
          }))
        } catch (error) {
          set({
            error: error.message,
            loading: false,
          })
        }
      },

      updateArticle: async (id: number, articleData: Partial<Article>) => {
        set({ loading: true, error: null })
        
        try {
          const response = await fetch(`/api/v1/articles/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            },
            body: JSON.stringify(articleData),
          })

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }

          const data = await response.json()
          
          set(state => ({
            articles: state.articles.map(article => 
              article.id === id ? data.data : article
            ),
            selectedArticle: state.selectedArticle?.id === id ? data.data : state.selectedArticle,
            loading: false,
          }))
        } catch (error) {
          set({
            error: error.message,
            loading: false,
          })
        }
      },

      deleteArticle: async (id: number) => {
        set({ loading: true, error: null })
        
        try {
          const response = await fetch(`/api/v1/articles/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            },
          })

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }

          set(state => ({
            articles: state.articles.filter(article => article.id !== id),
            selectedArticle: state.selectedArticle?.id === id ? null : state.selectedArticle,
            loading: false,
          }))
        } catch (error) {
          set({
            error: error.message,
            loading: false,
          })
        }
      },

      publishArticle: async (id: number) => {
        await get().updateArticle(id, { status: 'published' })
      },

      unpublishArticle: async (id: number) => {
        await get().updateArticle(id, { status: 'draft' })
      },

      setFilters: (filters: any) => {
        set({ filters })
      },

      setSelectedArticle: (article: Article | null) => {
        set({ selectedArticle: article })
      },

      clearError: () => {
        set({ error: null })
      },

      reset: () => {
        set({
          articles: [],
          selectedArticle: null,
          loading: false,
          error: null,
          pagination: {
            page: 1,
            per_page: 10,
            total: 0,
            total_pages: 0,
          },
          filters: {},
        })
      },
    }),
    {
      name: 'article-store',
      partialize: (state) => ({
        filters: state.filters,
        pagination: state.pagination,
      }),
    }
  )
)
```

### HTML生成管理ストア

```typescript
// stores/htmlGeneratorStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface GeneratedFile {
  path: string
  size: number
  modified: string
  type: 'article' | 'category' | 'index' | 'sitemap'
}

export interface GenerationProgress {
  current: number
  total: number
  message: string
  progress: number
}

interface HtmlGeneratorState {
  isGenerating: boolean
  progress: GenerationProgress
  generatedFiles: GeneratedFile[]
  error: string | null
  lastGeneration: string | null
  
  // Actions
  generateSingleArticle: (articleId: number) => Promise<void>
  generateFullSite: () => Promise<void>
  getGenerationStatus: () => Promise<void>
  clearGeneratedFiles: () => Promise<void>
  resetGeneration: () => void
}

export const useHtmlGeneratorStore = create<HtmlGeneratorState>()(
  persist(
    (set, get) => ({
      isGenerating: false,
      progress: {
        current: 0,
        total: 0,
        message: '',
        progress: 0,
      },
      generatedFiles: [],
      error: null,
      lastGeneration: null,
      
      generateSingleArticle: async (articleId: number) => {
        set({ isGenerating: true, error: null })
        
        try {
          const response = await fetch('/api/v1/html-generator/generate-html', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            },
            body: JSON.stringify({ article_id: articleId }),
          })

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }

          const result = await response.json()
          
          set(state => ({
            generatedFiles: [...state.generatedFiles, {
              path: result.file_path,
              size: 0,
              modified: new Date().toISOString(),
              type: 'article',
            }],
            isGenerating: false,
            lastGeneration: new Date().toISOString(),
          }))
        } catch (error) {
          set({
            error: error.message,
            isGenerating: false,
          })
        }
      },

      generateFullSite: async () => {
        set({ 
          isGenerating: true, 
          error: null, 
          generatedFiles: [],
          progress: { current: 0, total: 0, message: '', progress: 0 }
        })
        
        try {
          const response = await fetch('/api/v1/html-generator/generate-site', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            },
          })

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }

          const reader = response.body?.getReader()
          const decoder = new TextDecoder()

          while (true) {
            const { done, value } = await reader?.read() || {}
            if (done) break

            const chunk = decoder.decode(value)
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6))
                  
                  if (data.type === 'progress') {
                    set({
                      progress: {
                        current: data.current,
                        total: data.total,
                        message: data.message,
                        progress: data.progress,
                      },
                    })
                  } else if (data.type === 'file_generated') {
                    set(state => ({
                      generatedFiles: [...state.generatedFiles, {
                        path: data.file_path,
                        size: 0,
                        modified: new Date().toISOString(),
                        type: data.file_path.includes('/articles/') ? 'article' : 
                              data.file_path.includes('/categories/') ? 'category' :
                              data.file_path.includes('sitemap') ? 'sitemap' : 'index',
                      }],
                    }))
                  }
                } catch (e) {
                  console.error('JSON parse error:', e)
                }
              }
            }
          }
          
          set({ 
            isGenerating: false,
            lastGeneration: new Date().toISOString(),
          })
        } catch (error) {
          set({
            error: error.message,
            isGenerating: false,
          })
        }
      },

      getGenerationStatus: async () => {
        try {
          const response = await fetch('/api/v1/html-generator/output-status', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            },
          })

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }

          const result = await response.json()
          
          set({
            generatedFiles: result.files || [],
            lastGeneration: result.last_generated,
          })
        } catch (error) {
          set({ error: error.message })
        }
      },

      clearGeneratedFiles: async () => {
        try {
          const response = await fetch('/api/v1/html-generator/clear-files', {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            },
          })

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }

          set({ generatedFiles: [] })
        } catch (error) {
          set({ error: error.message })
        }
      },

      resetGeneration: () => {
        set({
          isGenerating: false,
          progress: { current: 0, total: 0, message: '', progress: 0 },
          error: null,
        })
      },
    }),
    {
      name: 'html-generator-store',
      partialize: (state) => ({
        generatedFiles: state.generatedFiles,
        lastGeneration: state.lastGeneration,
      }),
    }
  )
)
```

### 認証ストア

```typescript
// stores/authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'editor' | 'author'
  avatar?: string
  created_at: string
  updated_at: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  
  // Actions
  login: (credentials: { email: string; password: string }) => Promise<void>
  logout: () => void
  register: (data: { name: string; email: string; password: string }) => Promise<void>
  fetchUser: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (credentials) => {
        set({ loading: true, error: null })
        
        try {
          const response = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'ログインに失敗しました')
          }

          const data = await response.json()
          
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            loading: false,
          })
          
          // トークンをローカルストレージに保存
          localStorage.setItem('auth_token', data.token)
        } catch (error) {
          set({
            error: error.message,
            loading: false,
          })
        }
      },

      logout: () => {
        // サーバーにログアウト要求
        fetch('/api/v1/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${get().token}`,
          },
        }).catch(() => {
          // ログアウト失敗時もローカル状態はクリア
        })
        
        localStorage.removeItem('auth_token')
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },

      register: async (userData) => {
        set({ loading: true, error: null })
        
        try {
          const response = await fetch('/api/v1/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || '登録に失敗しました')
          }

          const data = await response.json()
          
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            loading: false,
          })
          
          localStorage.setItem('auth_token', data.token)
        } catch (error) {
          set({
            error: error.message,
            loading: false,
          })
        }
      },

      fetchUser: async () => {
        const token = get().token || localStorage.getItem('auth_token')
        if (!token) return
        
        set({ loading: true, error: null })
        
        try {
          const response = await fetch('/api/v1/auth/user', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })

          if (!response.ok) {
            if (response.status === 401) {
              // トークンが無効な場合はログアウト
              get().logout()
              return
            }
            throw new Error('ユーザー情報の取得に失敗しました')
          }

          const data = await response.json()
          
          set({
            user: data.user,
            token: token,
            isAuthenticated: true,
            loading: false,
          })
        } catch (error) {
          set({
            error: error.message,
            loading: false,
          })
        }
      },

      updateProfile: async (userData) => {
        set({ loading: true, error: null })
        
        try {
          const response = await fetch('/api/v1/auth/user', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${get().token}`,
            },
            body: JSON.stringify(userData),
          })

          if (!response.ok) {
            throw new Error('プロフィールの更新に失敗しました')
          }

          const data = await response.json()
          
          set({
            user: data.user,
            loading: false,
          })
        } catch (error) {
          set({
            error: error.message,
            loading: false,
          })
        }
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
```

## データフェッチ（SWR）

### SWR設定

```typescript
// lib/swr/config.ts
import { SWRConfig } from 'swr'
import { ReactNode } from 'react'

const fetcher = async (url: string) => {
  const token = localStorage.getItem('auth_token')
  
  const response = await fetch(url, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    },
  })

  if (!response.ok) {
    const error = new Error('データの取得に失敗しました')
    error.status = response.status
    error.info = await response.json()
    throw error
  }

  return response.json()
}

const swrConfig = {
  fetcher,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  refreshInterval: 0,
  dedupingInterval: 2000,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  onError: (error) => {
    console.error('SWR Error:', error)
    
    // 認証エラーの場合はログアウト
    if (error.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
  },
}

export function SWRProvider({ children }: { children: ReactNode }) {
  return <SWRConfig value={swrConfig}>{children}</SWRConfig>
}
```

### カスタムフック

```typescript
// hooks/useArticles.ts
import useSWR from 'swr'
import { Article } from '@/stores/articleStore'

export interface ArticlesResponse {
  data: Article[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface ArticlesParams {
  page?: number
  per_page?: number
  status?: string
  category?: string
  author?: string
  search?: string
}

export function useArticles(params: ArticlesParams = {}) {
  const queryString = new URLSearchParams(params as any).toString()
  const url = `/api/v1/articles${queryString ? `?${queryString}` : ''}`
  
  const { data, error, isLoading, mutate } = useSWR<ArticlesResponse>(url)
  
  return {
    articles: data?.data || [],
    pagination: data?.meta || { current_page: 1, last_page: 1, per_page: 10, total: 0 },
    isLoading,
    error,
    mutate,
  }
}

export function useArticle(id: number) {
  const { data, error, isLoading, mutate } = useSWR<{ data: Article }>(
    id ? `/api/v1/articles/${id}` : null
  )
  
  return {
    article: data?.data || null,
    isLoading,
    error,
    mutate,
  }
}
```

```typescript
// hooks/useCategories.ts
import useSWR from 'swr'
import { Category } from '@/stores/articleStore'

export function useCategories() {
  const { data, error, isLoading, mutate } = useSWR<{ data: Category[] }>('/api/v1/categories')
  
  return {
    categories: data?.data || [],
    isLoading,
    error,
    mutate,
  }
}

export function useCategory(id: number) {
  const { data, error, isLoading, mutate } = useSWR<{ data: Category }>(
    id ? `/api/v1/categories/${id}` : null
  )
  
  return {
    category: data?.data || null,
    isLoading,
    error,
    mutate,
  }
}
```

```typescript
// hooks/useDashboard.ts
import useSWR from 'swr'

export interface DashboardStats {
  total_articles: number
  published_articles: number
  draft_articles: number
  total_categories: number
  total_views: number
  recent_articles: Article[]
  popular_articles: Article[]
}

export function useDashboard() {
  const { data, error, isLoading, mutate } = useSWR<{ data: DashboardStats }>('/api/v1/dashboard/stats')
  
  return {
    stats: data?.data || null,
    isLoading,
    error,
    mutate,
  }
}
```

## フォーム状態管理

### React Hook Form統合

```typescript
// hooks/useArticleForm.ts
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Article } from '@/stores/articleStore'

const articleSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').max(200, 'タイトルは200文字以内で入力してください'),
  content: z.string().min(100, 'コンテンツは100文字以上で入力してください'),
  excerpt: z.string().max(300, '抜粋は300文字以内で入力してください'),
  meta_description: z.string().max(160, 'メタディスクリプションは160文字以内で入力してください'),
  keywords: z.array(z.string()).max(10, 'キーワードは10個以内で入力してください'),
  category_id: z.number().min(1, 'カテゴリを選択してください'),
  status: z.enum(['draft', 'published', 'archived']),
  featured_image: z.string().optional(),
})

export type ArticleFormData = z.infer<typeof articleSchema>

export function useArticleForm(article?: Article) {
  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: article ? {
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      meta_description: article.meta_description,
      keywords: article.keywords,
      category_id: article.category.id,
      status: article.status,
      featured_image: article.featured_image,
    } : {
      title: '',
      content: '',
      excerpt: '',
      meta_description: '',
      keywords: [],
      category_id: 0,
      status: 'draft',
      featured_image: '',
    },
  })

  return form
}
```

### フォームコンポーネント

```typescript
// components/forms/ArticleForm.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useArticleForm } from '@/hooks/useArticleForm'
import { useArticleStore } from '@/stores/articleStore'
import { useCategories } from '@/hooks/useCategories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Save, Eye, FileText } from 'lucide-react'
import { Article } from '@/stores/articleStore'

interface ArticleFormProps {
  article?: Article
  onSubmit?: (data: any) => void
}

export default function ArticleForm({ article, onSubmit }: ArticleFormProps) {
  const router = useRouter()
  const form = useArticleForm(article)
  const { createArticle, updateArticle, loading, error } = useArticleStore()
  const { categories } = useCategories()

  const handleSubmit = async (data: any) => {
    try {
      if (article) {
        await updateArticle(article.id, data)
      } else {
        await createArticle(data)
      }
      
      if (onSubmit) {
        onSubmit(data)
      } else {
        router.push('/admin/articles')
      }
    } catch (error) {
      console.error('記事の保存に失敗しました:', error)
    }
  }

  const handlePreview = () => {
    const data = form.getValues()
    // プレビュー画面を開く
    window.open(`/admin/articles/preview?data=${encodeURIComponent(JSON.stringify(data))}`, '_blank')
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {article ? '記事編集' : '記事作成'}
          </CardTitle>
          <CardDescription>
            {article ? '記事の内容を編集します' : '新しい記事を作成します'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* タイトル */}
            <div className="space-y-2">
              <Label htmlFor="title">タイトル *</Label>
              <Input
                id="title"
                placeholder="記事のタイトルを入力"
                {...form.register('title')}
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
              )}
            </div>

            {/* コンテンツ */}
            <div className="space-y-2">
              <Label htmlFor="content">コンテンツ *</Label>
              <Textarea
                id="content"
                placeholder="記事の内容を入力"
                className="min-h-96"
                {...form.register('content')}
              />
              {form.formState.errors.content && (
                <p className="text-sm text-red-500">{form.formState.errors.content.message}</p>
              )}
            </div>

            <Separator />

            {/* 基本情報 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category_id">カテゴリ *</Label>
                <Select
                  value={form.watch('category_id')?.toString()}
                  onValueChange={(value) => form.setValue('category_id', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="カテゴリを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.category_id && (
                  <p className="text-sm text-red-500">{form.formState.errors.category_id.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">ステータス</Label>
                <Select
                  value={form.watch('status')}
                  onValueChange={(value) => form.setValue('status', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="ステータスを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">下書き</SelectItem>
                    <SelectItem value="published">公開</SelectItem>
                    <SelectItem value="archived">アーカイブ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 抜粋 */}
            <div className="space-y-2">
              <Label htmlFor="excerpt">抜粋</Label>
              <Textarea
                id="excerpt"
                placeholder="記事の抜粋を入力"
                className="min-h-24"
                {...form.register('excerpt')}
              />
              {form.formState.errors.excerpt && (
                <p className="text-sm text-red-500">{form.formState.errors.excerpt.message}</p>
              )}
            </div>

            <Separator />

            {/* SEO設定 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">SEO設定</h3>
              
              <div className="space-y-2">
                <Label htmlFor="meta_description">メタディスクリプション</Label>
                <Textarea
                  id="meta_description"
                  placeholder="検索結果に表示される説明文"
                  className="min-h-20"
                  {...form.register('meta_description')}
                />
                {form.formState.errors.meta_description && (
                  <p className="text-sm text-red-500">{form.formState.errors.meta_description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>キーワード</Label>
                <div className="flex flex-wrap gap-2">
                  {form.watch('keywords')?.map((keyword, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => {
                        const keywords = form.getValues('keywords')
                        form.setValue('keywords', keywords.filter((_, i) => i !== index))
                      }}
                    >
                      {keyword} ×
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="キーワードを入力"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        const value = e.target.value.trim()
                        if (value) {
                          const keywords = form.getValues('keywords') || []
                          if (!keywords.includes(value)) {
                            form.setValue('keywords', [...keywords, value])
                          }
                          e.target.value = ''
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* エラー表示 */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* ボタン */}
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {loading ? '保存中...' : '保存'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handlePreview}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                プレビュー
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                キャンセル
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
```

## 実装のポイント

1. **状態管理の分離**: 機能別にストアを分離して管理
2. **型安全性**: TypeScriptで厳密な型定義
3. **データ同期**: SWRによる効率的なデータフェッチ
4. **エラーハンドリング**: 統一されたエラー処理
5. **パフォーマンス**: 適切なキャッシュ戦略
6. **ユーザー体験**: ローディング状態とエラー表示の最適化
