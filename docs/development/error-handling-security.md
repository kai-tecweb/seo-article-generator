# エラーハンドリング・セキュリティ

## 共通原則

- エラー処理とエッジケースを優先します。
- エラー条件にはアーリーリターンを使用し、ガード句を実装して前提条件や無効な状態を早期に処理します。
- 具体的なエラーメッセージを提供し、ユーザーフレンドリーなエラー表示を実装します。

## バックエンド（Laravel）

### エラーハンドリング

- Laravelのログファサードを使用して適切なエラーログを記録します。
- 例外処理にはtry-catch文を適切に使用し、カスタム例外クラスを必要に応じて作成します。
- 統一されたAPIエラーレスポンス形式を使用します。
- 適切なHTTPステータスコードを返します。

#### 統一エラーレスポンス形式

```php
// app/Http/Responses/ErrorResponse.php
class ErrorResponse
{
    public static function create(
        string $message, 
        int $status = 500, 
        array $errors = [], 
        string $code = null
    ): JsonResponse {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
            'code' => $code,
            'timestamp' => now()->toISOString(),
        ], $status);
    }
}
```

#### カスタム例外クラス

```php
// app/Exceptions/ArticleGenerationException.php
class ArticleGenerationException extends Exception
{
    public function __construct(string $message, int $code = 500, Exception $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }

    public function render(): JsonResponse
    {
        return ErrorResponse::create(
            $this->getMessage(),
            $this->getCode(),
            [],
            'ARTICLE_GENERATION_ERROR'
        );
    }
}
```

### セキュリティ対策

- **XSS攻撃防止**: 適切なデータサニタイゼーションを実装します。
- **SQLインジェクション防止**: Eloquent ORMやクエリビルダーのパラメータバインディングを使用します。
- **認証・認可**: Laravel Sanctumによる認証・認可を適切に実装します。
- **レート制限**: APIの不正使用を防止するレート制限を実装します。

#### セキュリティミドルウェア

```php
// app/Http/Middleware/SecurityHeadersMiddleware.php
class SecurityHeadersMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);
        
        return $response
            ->header('X-Content-Type-Options', 'nosniff')
            ->header('X-Frame-Options', 'DENY')
            ->header('X-XSS-Protection', '1; mode=block')
            ->header('Referrer-Policy', 'strict-origin-when-cross-origin')
            ->header('Content-Security-Policy', "default-src 'self'");
    }
}
```

#### レート制限設定

```php
// app/Http/Kernel.php
protected $middlewareGroups = [
    'api' => [
        'throttle:api',
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ],
];

protected $routeMiddleware = [
    'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
];
```

```php
// routes/api.php
Route::middleware(['throttle:60,1'])->group(function () {
    Route::post('/generation/generate', [GenerationController::class, 'generate']);
});

Route::middleware(['throttle:10,1'])->group(function () {
    Route::post('/html-generator/generate-site', [HtmlGeneratorController::class, 'generateSite']);
});
```

## フロントエンド（Next.js）

### エラーハンドリング

#### Error Boundary実装

```typescript
// components/ErrorBoundary.tsx
import React from 'react'
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'
import { AlertCircle } from 'lucide-react'

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="flex items-center space-x-3 text-red-600">
          <AlertCircle size={24} />
          <h2 className="text-xl font-semibold">エラーが発生しました</h2>
        </div>
        <p className="mt-4 text-gray-600">
          申し訳ございません。予期しないエラーが発生しました。
        </p>
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-gray-500">
            詳細を表示
          </summary>
          <pre className="mt-2 text-xs text-gray-400">
            {error.message}
          </pre>
        </details>
        <button
          onClick={resetErrorBoundary}
          className="mt-6 w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          再試行
        </button>
      </div>
    </div>
  )
}

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error) => {
        console.error('Error Boundary caught an error:', error)
      }}
    >
      {children}
    </ReactErrorBoundary>
  )
}
```

#### API呼び出しエラーハンドリング

```typescript
// lib/api/error-handler.ts
import { toast } from 'sonner'

export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
  code?: string
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof Response) {
    return handleResponseError(error)
  }
  
  if (error instanceof Error) {
    return {
      message: error.message,
      status: 500,
    }
  }
  
  return {
    message: '予期しないエラーが発生しました',
    status: 500,
  }
}

async function handleResponseError(response: Response): Promise<ApiError> {
  try {
    const data = await response.json()
    
    const apiError: ApiError = {
      message: data.message || 'APIエラーが発生しました',
      status: response.status,
      errors: data.errors,
      code: data.code,
    }
    
    // エラーをトーストで表示
    toast.error(apiError.message)
    
    return apiError
  } catch {
    return {
      message: 'サーバーエラーが発生しました',
      status: response.status,
    }
  }
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'status' in error
  )
}
```

#### 統一APIクライアント

```typescript
// lib/api/client.ts
import { handleApiError } from './error-handler'

class ApiClient {
  private baseUrl: string
  private headers: HeadersInit

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers,
        },
      })

      if (!response.ok) {
        throw response
      }

      return await response.json()
    } catch (error) {
      const apiError = await handleApiError(error)
      throw apiError
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL || '')
```

### セキュリティ対策

#### 入力検証

```typescript
// lib/validations/security.ts
import { z } from 'zod'
import DOMPurify from 'isomorphic-dompurify'

// XSS対策
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: ['href', 'title', 'alt', 'src'],
  })
}

// 入力値検証
export const secureTextSchema = z.string()
  .min(1, '必須項目です')
  .max(1000, '1000文字以内で入力してください')
  .refine((value) => !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(value), {
    message: 'スクリプトタグは使用できません',
  })

export const secureEmailSchema = z.string()
  .email('有効なメールアドレスを入力してください')
  .max(254, 'メールアドレスが長すぎます')
```

#### Content Security Policy

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  }
]

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}
```

#### 認証トークン管理

```typescript
// lib/auth/token-manager.ts
class TokenManager {
  private static readonly TOKEN_KEY = 'auth_token'
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token'

  static setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token)
    }
  }

  static getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(this.TOKEN_KEY)
  }

  static removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY)
      localStorage.removeItem(this.REFRESH_TOKEN_KEY)
    }
  }

  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return Date.now() >= payload.exp * 1000
    } catch {
      return true
    }
  }
}

export { TokenManager }
```

## ベストプラクティス

### エラーログ記録

```php
// Laravel - 構造化ログ
Log::channel('ai_generation')->error('AI記事生成エラー', [
    'user_id' => auth()->id(),
    'prompt' => $prompt,
    'error' => $exception->getMessage(),
    'trace' => $exception->getTraceAsString(),
    'timestamp' => now(),
]);
```

```typescript
// Next.js - 構造化ログ
import { logger } from '@/lib/logger'

logger.error('API呼び出しエラー', {
  endpoint: '/api/articles',
  method: 'POST',
  status: response.status,
  message: error.message,
  timestamp: new Date().toISOString(),
})
```

### 監視とアラート

```php
// Laravel - 重要エラーの通知
if ($exception instanceof CriticalException) {
    // Slack、メール等での通知
    Notification::route('slack', config('slack.webhook_url'))
        ->notify(new CriticalErrorNotification($exception));
}
```

### プライバシー保護

```typescript
// 個人情報のログ記録を避ける
function sanitizeLogData(data: any): any {
  const sensitiveFields = ['password', 'token', 'email', 'phone']
  const sanitized = { ...data }
  
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '***'
    }
  })
  
  return sanitized
}
```

## 運用監視

### ヘルスチェック

```php
// Laravel - ヘルスチェックエンドポイント
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now(),
        'services' => [
            'database' => DB::connection()->getPdo() ? 'healthy' : 'unhealthy',
            'redis' => Cache::store('redis')->connection()->ping() ? 'healthy' : 'unhealthy',
        ],
    ]);
});
```

### メトリクス収集

```typescript
// Next.js - パフォーマンスメトリクス
export function reportWebVitals(metric: any) {
  if (process.env.NODE_ENV === 'production') {
    // Google Analytics等にメトリクスを送信
    gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.value),
      non_interaction: true,
    })
  }
}
```
