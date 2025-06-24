import { test, expect } from '@playwright/test'

test.describe('記事生成フロー', () => {
  test.beforeEach(async ({ page }) => {
    // 開発サーバーにアクセス
    await page.goto('/')
  })

  test('ホームページから記事生成までの基本フロー', async ({ page }) => {
    // ホームページが正常に表示される
    await expect(page).toHaveTitle(/SEO記事生成システム/i)
    
    // メインダッシュボードの要素を確認
    await expect(page.getByRole('heading', { name: /AI記事生成/i })).toBeVisible()
    
    // 記事生成フォームに移動（該当するリンクやボタンがあると仮定）
    const generateButton = page.getByRole('button', { name: /記事を生成/i }).first()
    if (await generateButton.isVisible()) {
      await generateButton.click()
    }

    // フォームが表示されることを確認
    await expect(page.getByLabel(/キーワード/i)).toBeVisible()
    await expect(page.getByLabel(/トーン/i)).toBeVisible()
    
    // テスト用のキーワードを入力
    await page.getByLabel(/キーワード/i).fill('AI記事生成テスト')
    
    // トーンを選択
    await page.getByLabel(/トーン/i).selectOption('professional')
    
    // 記事生成ボタンをクリック
    await page.getByRole('button', { name: /記事を生成/i }).click()
    
    // ローディング状態を確認
    await expect(page.getByText(/生成中|処理中/i)).toBeVisible()
    
    // 記事生成完了を待機（タイムアウト30秒）
    await expect(page.getByText(/記事が生成されました|生成完了/i)).toBeVisible({ timeout: 30000 })
    
    // 生成された記事の要素を確認
    await expect(page.getByRole('heading')).toBeVisible()
  })

  test('画像生成機能のテスト', async ({ page }) => {
    // 画像生成フォームに移動
    const imageGenerateButton = page.getByRole('button', { name: /画像生成|アイキャッチ生成/i }).first()
    
    if (await imageGenerateButton.isVisible()) {
      await imageGenerateButton.click()
      
      // プロンプト入力
      await page.getByLabel(/プロンプト|画像の説明/i).fill('美しい自然風景')
      
      // 画像生成実行
      await page.getByRole('button', { name: /画像を生成|生成開始/i }).click()
      
      // 生成完了まで待機
      await expect(page.getByText(/画像が生成されました|生成完了/i)).toBeVisible({ timeout: 60000 })
      
      // 生成された画像を確認
      await expect(page.getByRole('img')).toBeVisible()
    }
  })

  test('SEOチェック機能のテスト', async ({ page }) => {
    // SEOチェックページに移動
    const seoCheckButton = page.getByRole('link', { name: /SEOチェック|SEO分析/i }).first()
    
    if (await seoCheckButton.isVisible()) {
      await seoCheckButton.click()
      
      // URLまたはテキストを入力
      const urlInput = page.getByLabel(/URL|チェックするURL/i)
      if (await urlInput.isVisible()) {
        await urlInput.fill('https://example.com')
      }
      
      // SEOチェック実行
      await page.getByRole('button', { name: /チェック開始|分析開始/i }).click()
      
      // 分析結果を待機
      await expect(page.getByText(/分析完了|チェック完了/i)).toBeVisible({ timeout: 30000 })
      
      // SEOスコアが表示されることを確認
      await expect(page.getByText(/スコア|点数/i)).toBeVisible()
    }
  })

  test('エラーハンドリングのテスト', async ({ page }) => {
    // 記事生成フォームで無効なデータをテスト
    await page.getByLabel(/キーワード/i).fill('')  // 空のキーワード
    await page.getByRole('button', { name: /記事を生成/i }).click()
    
    // バリデーションエラーが表示されることを確認
    await expect(page.getByText(/キーワードは必須|入力してください/i)).toBeVisible()
  })

  test('レスポンシブデザインのテスト', async ({ page }) => {
    // モバイルサイズに変更
    await page.setViewportSize({ width: 375, height: 667 })
    
    // ページが正常に表示されることを確認
    await expect(page.getByRole('heading')).toBeVisible()
    
    // ナビゲーションメニューが適切に機能することを確認
    const menuButton = page.getByRole('button', { name: /メニュー|☰/i })
    if (await menuButton.isVisible()) {
      await menuButton.click()
      await expect(page.getByRole('navigation')).toBeVisible()
    }
  })
})
