/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'

// Mock環境変数
process.env.OPENAI_API_KEY = 'test-api-key'

// テスト実行時のコンソールログを抑制
const originalConsole = console
beforeAll(() => {
  console.log = jest.fn()
  console.error = jest.fn()
})

afterAll(() => {
  console.log = originalConsole.log
  console.error = originalConsole.error
})

describe('/api/generate-article', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // 基本的な設定テスト
  it('テスト環境が正しく設定されている', () => {
    expect(process.env.OPENAI_API_KEY).toBe('test-api-key')
    expect(NextRequest).toBeDefined()
  })

  // 将来的なAPI実装のためのプレースホルダー
  it('APIエンドポイントの基本構造をテスト', async () => {
    // APIファイルが存在するかチェック
    expect(() => {
      require('@/app/api/generate-article/route')
    }).not.toThrow()
  })
})
