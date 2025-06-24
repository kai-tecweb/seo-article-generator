/**
 * テスト用のヘルパー関数
 */

import { render, RenderOptions } from '@testing-library/react'
import { ReactElement, ReactNode } from 'react'

// テストプロバイダーのラッパー
const AllTheProviders = ({ children }: { children: ReactNode }) => {
  return (
    <div data-testid="test-wrapper">
      {children}
    </div>
  )
}

// カスタムレンダー関数
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// APIレスポンスの待機ヘルパー
export const waitForApiResponse = async (
  mockFetch: jest.Mock,
  expectedUrl: string,
  timeout: number = 5000
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`API call to ${expectedUrl} not made within ${timeout}ms`))
    }, timeout)

    const checkCall = () => {
      const calls = mockFetch.mock.calls
      const found = calls.some(call => call[0].includes(expectedUrl))
      if (found) {
        clearTimeout(timer)
        resolve()
      } else {
        setTimeout(checkCall, 100)
      }
    }
    
    checkCall()
  })
}

// フォーム入力のヘルパー
export const fillFormData = async (
  screen: any,
  formData: Record<string, string>
) => {
  for (const [field, value] of Object.entries(formData)) {
    const input = screen.getByLabelText(new RegExp(field, 'i'))
    if (input.tagName === 'SELECT') {
      await input.selectOption(value)
    } else {
      await input.fill(value)
    }
  }
}

// ローカルストレージのモック
export const mockLocalStorage = () => {
  const store: Record<string, string> = {}
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    })
  }
}

// fetch APIのモックヘルパー
export const createMockFetch = (responses: Array<{
  url: string,
  response: any,
  status?: number
}>) => {
  return jest.fn((url: string) => {
    const matchedResponse = responses.find(r => url.includes(r.url))
    
    if (matchedResponse) {
      return Promise.resolve({
        ok: matchedResponse.status ? matchedResponse.status < 400 : true,
        status: matchedResponse.status || 200,
        json: () => Promise.resolve(matchedResponse.response)
      })
    }
    
    return Promise.reject(new Error(`No mock response found for ${url}`))
  })
}

// テスト環境変数の設定
export const setupTestEnv = () => {
  process.env.OPENAI_API_KEY = 'test-openai-key'
  process.env.FAL_AI_API_KEY = 'test-fal-key'
  process.env.NOTION_API_KEY = 'test-notion-key'
  process.env.WORDPRESS_SITE_URL = 'https://test-wordpress.com'
  process.env.WORDPRESS_USERNAME = 'test-user'
  process.env.WORDPRESS_APP_PASSWORD = 'test-password'
}

// テスト実行前のクリーンアップ
export const cleanupTests = () => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
  
  // LocalStorageのクリア
  if (typeof window !== 'undefined') {
    window.localStorage.clear()
    window.sessionStorage.clear()
  }
}

// 非同期コンポーネントのテストヘルパー
export const waitForAsyncComponent = async (
  screen: any,
  expectedElement: string,
  timeout: number = 10000
) => {
  return screen.findByText(expectedElement, {}, { timeout })
}

// エラーバウンダリのテストヘルパー
export const triggerErrorBoundary = (component: ReactElement) => {
  const ThrowError = () => {
    throw new Error('Test error')
  }
  
  return render(
    <AllTheProviders>
      {component}
      <ThrowError />
    </AllTheProviders>
  )
}

// APIエラーのシミュレーション
export const simulateApiError = (
  mockFetch: jest.Mock,
  errorType: 'network' | 'server' | 'timeout' = 'server'
) => {
  switch (errorType) {
    case 'network':
      mockFetch.mockRejectedValue(new Error('Network Error'))
      break
    case 'server':
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({
          success: false,
          error: 'Internal Server Error'
        })
      })
      break
    case 'timeout':
      mockFetch.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 30000))
      )
      break
  }
}

// テストデータの生成
export const generateTestData = {
  article: (overrides: Partial<any> = {}) => ({
    title: 'テスト記事タイトル',
    content: '<h1>テスト記事</h1><p>テスト内容</p>',
    meta_description: 'テスト記事の説明',
    keywords: ['テスト', 'AI'],
    category: 'テクノロジー',
    ...overrides
  }),
  
  user: (overrides: Partial<any> = {}) => ({
    id: 'test-user-id',
    name: 'テストユーザー',
    email: 'test@example.com',
    plan: 'basic',
    ...overrides
  })
}

// 再エクスポート
export * from '@testing-library/react'
export { customRender as render }
