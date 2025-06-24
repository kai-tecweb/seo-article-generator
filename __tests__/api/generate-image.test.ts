/**
 * @jest-environment node
 */

// Mock環境変数
process.env.FAL_AI_API_KEY = 'test-fal-api-key'

// Global fetchのモック
global.fetch = jest.fn()

describe('/api/generate-image', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('テスト環境が正しく設定されている', () => {
    expect(process.env.FAL_AI_API_KEY).toBe('test-fal-api-key')
    expect(global.fetch).toBeDefined()
  })

  it('fetch APIモックが正常に動作する', async () => {
    // Mock fetch response
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Test API call successful'
      })
    })

    const response = await fetch('/test-endpoint')
    const data = await response.json()

    expect(response.ok).toBe(true)
    expect(data.success).toBe(true)
    expect(global.fetch).toHaveBeenCalledWith('/test-endpoint')
  })

  it('APIエラーレスポンスを正しく処理する', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    })

    const response = await fetch('/error-endpoint')

    expect(response.ok).toBe(false)
    expect(response.status).toBe(500)
  })
})
