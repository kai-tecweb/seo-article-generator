import '@testing-library/jest-dom'

// グローバルなテスト設定
global.console = {
  ...console,
  // テスト中のconsole.logを抑制（必要に応じて）
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}

// Next.js router のモック
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    }
  },
}))

// Fetch API のモック
global.fetch = jest.fn()

// IntersectionObserver のモック
global.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}))

// matchMedia のモック（jsdom環境でのみ）
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
}

// テスト前後の処理
beforeEach(() => {
  // 各テスト前にfetchをリセット
  jest.clearAllMocks()
})

afterEach(() => {
  // 各テスト後のクリーンアップ
  jest.resetAllMocks()
})
