# テスト戦略 - SEO記事生成システム

## 📋 テストカバレッジ目標

### 現在の状況
- 統合テストスクリプト（test-integration.sh）実装済み
- 個別APIテスト（utils/test-google-quality.ts）実装済み
- E2Eテスト・ユニットテストが不足

### 目標テストカバレッジ
- **APIテスト**: 95%以上
- **コンポーネントテスト**: 90%以上
- **E2Eテスト**: 主要ワークフロー100%カバー

## 🧪 テスト種別と実装計画

### 1. APIテスト（Jest + Supertest）
```bash
# テスト対象API
/api/generate-article/          # 記事生成
/api/quality-evaluation/        # 品質評価
/api/ad-management/             # 広告管理
/api/post-to-wordpress/         # WordPress投稿
/api/generate-image/            # 画像生成
```

### 2. コンポーネントテスト（Jest + React Testing Library）
```bash
# テスト対象コンポーネント
components/forms/article-generation-form.tsx
components/forms/google-quality-evaluation-form.tsx
components/forms/ad-insertion-control.tsx
components/forms/wordpress-publish-control.tsx
```

### 3. E2Eテスト（Playwright）
```bash
# 主要ワークフロー
1. 記事生成 → 品質評価 → 広告挿入 → WordPress投稿
2. Notion連携 → 記事管理 → 履歴確認
3. 画像生成 → 記事統合 → プレビュー
```

## 🔧 テスト環境セットアップ

### 必要パッケージのインストール
```bash
# テストフレームワーク
pnpm add -D jest @types/jest ts-jest
pnpm add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
pnpm add -D supertest @types/supertest
pnpm add -D @playwright/test

# モック用
pnpm add -D msw
```

### Jest設定
```javascript
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'app/api/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
```

### Playwright設定
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## 📝 テストケース例

### APIテスト例
```typescript
// __tests__/api/generate-article.test.ts
import { createMocks } from 'node-mocks-http';
import handler from '@/app/api/generate-article/route';

describe('/api/generate-article', () => {
  it('should generate article with valid input', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        topic: 'Next.js開発tips',
        keywords: ['Next.js', 'React', 'TypeScript'],
        style: 'professional',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.article).toBeDefined();
    expect(data.title).toBeDefined();
    expect(data.seoScore).toBeGreaterThan(70);
  });
});
```

### コンポーネントテスト例
```typescript
// __tests__/components/article-generation-form.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ArticleGenerationForm from '@/components/forms/article-generation-form';

describe('ArticleGenerationForm', () => {
  it('should submit form with valid data', async () => {
    const mockOnSubmit = jest.fn();
    
    render(<ArticleGenerationForm onSubmit={mockOnSubmit} />);
    
    fireEvent.change(screen.getByLabelText('記事テーマ'), {
      target: { value: 'Next.js入門' }
    });
    
    fireEvent.click(screen.getByText('記事を生成'));
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        topic: 'Next.js入門',
        // ... other expected values
      });
    });
  });
});
```

### E2Eテスト例
```typescript
// e2e/article-workflow.spec.ts
import { test, expect } from '@playwright/test';

test('complete article generation workflow', async ({ page }) => {
  await page.goto('/');
  
  // 記事生成
  await page.fill('[data-testid="topic-input"]', 'Next.js開発ガイド');
  await page.click('[data-testid="generate-button"]');
  
  // 生成完了を待機
  await expect(page.locator('[data-testid="generated-article"]')).toBeVisible();
  
  // 品質評価
  await page.click('[data-testid="quality-evaluation-tab"]');
  await page.click('[data-testid="evaluate-button"]');
  
  // 評価結果確認
  await expect(page.locator('[data-testid="quality-score"]')).toBeVisible();
  
  // WordPress投稿
  await page.click('[data-testid="wordpress-publish-tab"]');
  await page.fill('[data-testid="publish-time"]', '09:00');
  await page.click('[data-testid="publish-button"]');
  
  // 投稿完了確認
  await expect(page.locator('[data-testid="publish-success"]')).toBeVisible();
});
```

## 🎯 実装フェーズ

### フェーズ1: 基盤テスト環境構築（1-2日）
1. Jest + React Testing Library セットアップ
2. 基本的なユニットテスト実装
3. APIテスト環境構築

### フェーズ2: コンポーネントテスト実装（2-3日）
1. フォームコンポーネントのテスト
2. UIコンポーネントのテスト
3. フック（Hooks）のテスト

### フェーズ3: APIテスト実装（2-3日）
1. 記事生成APIテスト
2. 品質評価APIテスト
3. 広告管理APIテスト
4. WordPress連携APIテスト

### フェーズ4: E2Eテスト実装（3-4日）
1. Playwright セットアップ
2. 主要ワークフローテスト
3. エラーハンドリングテスト
4. パフォーマンステスト

### フェーズ5: CI/CD統合（1-2日）
1. GitHub Actions設定
2. 自動テスト実行
3. カバレッジレポート
4. テスト結果通知

## 📊 テスト実行とモニタリング

### テストコマンド
```bash
# 全テスト実行
pnpm test

# カバレッジ付きテスト
pnpm test:coverage

# E2Eテスト
pnpm test:e2e

# 監視モード
pnpm test:watch
```

### 継続的品質管理
- **毎日**: ユニットテスト + APIテスト
- **毎週**: E2Eテスト + パフォーマンステスト
- **リリース前**: 全テスト + 手動テスト

## 🔍 モニタリング指標

### 品質指標
- テストカバレッジ率
- テスト実行時間
- テスト失敗率
- バグ検出率

### パフォーマンス指標
- API応答時間
- ページ読み込み時間
- メモリ使用量
- エラー発生率
