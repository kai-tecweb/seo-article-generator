# テスト戦略・品質保証

## 全体的なテスト戦略

### テストピラミッド構成
- **ユニットテスト**: 70% - 個別関数・メソッドの動作確認
- **統合テスト**: 20% - API・データベース・外部サービス連携
- **E2Eテスト**: 10% - ユーザーシナリオの全体的な動作確認

### テスト環境
- **開発環境**: ローカル開発でのテスト実行
- **CI/CD環境**: GitHub Actions等での自動テスト実行  
- **ステージング環境**: 本番環境に近い環境でのテスト

## バックエンド（Laravel）テスト

### PHPUnit設定

```php
// phpunit.xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="./vendor/phpunit/phpunit/phpunit.xsd"
         bootstrap="vendor/autoload.php"
         colors="true">
    <testsuites>
        <testsuite name="Unit">
            <directory suffix="Test.php">./tests/Unit</directory>
        </testsuite>
        <testsuite name="Feature">
            <directory suffix="Test.php">./tests/Feature</directory>
        </testsuite>
    </testsuites>
    <coverage>
        <include>
            <directory suffix=".php">./app</directory>
        </include>
    </coverage>
    <php>
        <server name="APP_ENV" value="testing"/>
        <server name="BCRYPT_ROUNDS" value="4"/>
        <server name="CACHE_DRIVER" value="array"/>
        <server name="DB_CONNECTION" value="sqlite"/>
        <server name="DB_DATABASE" value=":memory:"/>
        <server name="MAIL_MAILER" value="array"/>
        <server name="QUEUE_CONNECTION" value="sync"/>
        <server name="SESSION_DRIVER" value="array"/>
        <server name="TELESCOPE_ENABLED" value="false"/>
    </php>
</phpunit>
```

### ユニットテスト例

```php
// tests/Unit/Services/ArticleGeneratorServiceTest.php
<?php

namespace Tests\Unit\Services;

use App\Services\ArticleGeneratorService;
use App\Services\OpenAIService;
use Tests\TestCase;
use Mockery;

class ArticleGeneratorServiceTest extends TestCase
{
    private ArticleGeneratorService $service;
    private OpenAIService $openAIService;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->openAIService = Mockery::mock(OpenAIService::class);
        $this->service = new ArticleGeneratorService($this->openAIService);
    }

    public function test_generate_article_with_valid_prompt()
    {
        // Arrange
        $prompt = 'Next.jsについて詳しく説明してください';
        $expectedContent = 'Next.jsは React ベースのフルスタックフレームワークです...';
        
        $this->openAIService
            ->shouldReceive('generateText')
            ->with($prompt)
            ->once()
            ->andReturn($expectedContent);

        // Act
        $result = $this->service->generateArticle($prompt);

        // Assert
        $this->assertIsString($result);
        $this->assertStringContainsString('Next.js', $result);
        $this->assertGreaterThan(100, strlen($result));
    }

    public function test_generate_article_with_empty_prompt_throws_exception()
    {
        // Arrange
        $prompt = '';

        // Act & Assert
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('プロンプトが空です');
        
        $this->service->generateArticle($prompt);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }
}
```

### フィーチャーテスト例

```php
// tests/Feature/Api/ArticlesApiTest.php
<?php

namespace Tests\Feature\Api;

use App\Models\Article;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ArticlesApiTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        Sanctum::actingAs($this->user);
    }

    public function test_can_get_articles_list()
    {
        // Arrange
        Article::factory()->count(3)->create();

        // Act
        $response = $this->getJson('/api/v1/articles');

        // Assert
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         '*' => [
                             'id',
                             'title',
                             'slug',
                             'excerpt',
                             'published_at',
                             'author' => [
                                 'id',
                                 'name',
                             ],
                         ],
                     ],
                     'meta' => [
                         'current_page',
                         'total',
                         'per_page',
                     ],
                 ]);
    }

    public function test_can_create_article()
    {
        // Arrange
        $articleData = [
            'title' => 'Laravel テストの書き方',
            'content' => 'Laravel でのテストの書き方について説明します...',
            'meta_description' => 'Laravel テストの基本的な書き方を解説',
            'keywords' => ['Laravel', 'テスト', 'PHPUnit'],
            'category_id' => 1,
        ];

        // Act
        $response = $this->postJson('/api/v1/articles', $articleData);

        // Assert
        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'data' => [
                         'id',
                         'title',
                         'slug',
                         'content',
                         'meta_description',
                         'keywords',
                         'created_at',
                         'updated_at',
                     ],
                 ]);

        $this->assertDatabaseHas('articles', [
            'title' => $articleData['title'],
            'author_id' => $this->user->id,
        ]);
    }

    public function test_cannot_create_article_without_authentication()
    {
        // Arrange
        Sanctum::actingAs(null);
        
        $articleData = [
            'title' => 'Test Article',
            'content' => 'Test content',
        ];

        // Act
        $response = $this->postJson('/api/v1/articles', $articleData);

        // Assert
        $response->assertStatus(401);
    }

    public function test_validates_required_fields_when_creating_article()
    {
        // Arrange
        $articleData = [
            'title' => '', // 必須フィールドを空にする
            'content' => '',
        ];

        // Act
        $response = $this->postJson('/api/v1/articles', $articleData);

        // Assert
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['title', 'content']);
    }
}
```

### データベーステスト

```php
// tests/Feature/Database/ArticleDatabaseTest.php
<?php

namespace Tests\Feature\Database;

use App\Models\Article;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ArticleDatabaseTest extends TestCase
{
    use RefreshDatabase;

    public function test_article_belongs_to_user()
    {
        // Arrange
        $user = User::factory()->create();
        $article = Article::factory()->create(['author_id' => $user->id]);

        // Act & Assert
        $this->assertEquals($user->id, $article->author->id);
        $this->assertEquals($user->name, $article->author->name);
    }

    public function test_article_belongs_to_category()
    {
        // Arrange
        $category = Category::factory()->create();
        $article = Article::factory()->create(['category_id' => $category->id]);

        // Act & Assert
        $this->assertEquals($category->id, $article->category->id);
        $this->assertEquals($category->name, $article->category->name);
    }

    public function test_article_slug_is_unique()
    {
        // Arrange
        Article::factory()->create(['slug' => 'test-article']);

        // Act & Assert
        $this->expectException(\Illuminate\Database\UniqueConstraintViolationException::class);
        
        Article::factory()->create(['slug' => 'test-article']);
    }
}
```

## フロントエンド（Next.js）テスト

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
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/pages/api/**',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
}

module.exports = createJestConfig(customJestConfig)
```

```javascript
// jest.setup.js
import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}
```

### コンポーネントテスト例

```typescript
// __tests__/components/ArticleCard.test.tsx
import { render, screen } from '@testing-library/react'
import { ArticleCard } from '@/components/blog/ArticleCard'

describe('ArticleCard', () => {
  const mockArticle = {
    id: 1,
    title: 'Test Article',
    excerpt: 'This is a test article excerpt',
    date: '2024-01-01',
    author: 'Test Author',
    category: 'Technology',
    image: '/test-image.jpg',
    href: '/articles/test-article',
    readTime: '5分',
    views: '1,234',
  }

  it('renders article information correctly', () => {
    render(<ArticleCard {...mockArticle} />)

    expect(screen.getByText('Test Article')).toBeInTheDocument()
    expect(screen.getByText('This is a test article excerpt')).toBeInTheDocument()
    expect(screen.getByText('Test Author')).toBeInTheDocument()
    expect(screen.getByText('Technology')).toBeInTheDocument()
    expect(screen.getByText('5分')).toBeInTheDocument()
    expect(screen.getByText('1,234')).toBeInTheDocument()
  })

  it('renders article image with correct alt text', () => {
    render(<ArticleCard {...mockArticle} />)

    const image = screen.getByAltText('Test Article')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/test-image.jpg')
  })

  it('renders article link with correct href', () => {
    render(<ArticleCard {...mockArticle} />)

    const link = screen.getByRole('link', { name: 'Test Article' })
    expect(link).toHaveAttribute('href', '/articles/test-article')
  })
})
```

### カスタムフックテスト

```typescript
// __tests__/hooks/useArticleGeneration.test.tsx
import { renderHook, act } from '@testing-library/react'
import { useArticleGeneration } from '@/hooks/useArticleGeneration'

// APIクライアントをモック
jest.mock('@/lib/api/client', () => ({
  apiClient: {
    post: jest.fn(),
  },
}))

describe('useArticleGeneration', () => {
  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useArticleGeneration())

    expect(result.current.isGenerating).toBe(false)
    expect(result.current.progress).toBe(0)
    expect(result.current.generatedArticle).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('should handle article generation successfully', async () => {
    const mockResponse = {
      content: 'Generated article content',
      title: 'Generated Title',
    }

    const { apiClient } = require('@/lib/api/client')
    apiClient.post.mockResolvedValueOnce(mockResponse)

    const { result } = renderHook(() => useArticleGeneration())

    await act(async () => {
      await result.current.generateArticle('Test prompt')
    })

    expect(result.current.isGenerating).toBe(false)
    expect(result.current.generatedArticle).toBe(mockResponse.content)
    expect(result.current.error).toBeNull()
  })

  it('should handle API errors', async () => {
    const mockError = new Error('API Error')
    
    const { apiClient } = require('@/lib/api/client')
    apiClient.post.mockRejectedValueOnce(mockError)

    const { result } = renderHook(() => useArticleGeneration())

    await act(async () => {
      await result.current.generateArticle('Test prompt')
    })

    expect(result.current.isGenerating).toBe(false)
    expect(result.current.error).toBe('API Error')
    expect(result.current.generatedArticle).toBeNull()
  })
})
```

### MSWによるAPIモック

```typescript
// __tests__/mocks/handlers.ts
import { rest } from 'msw'

export const handlers = [
  // 記事一覧取得
  rest.get('/api/v1/articles', (req, res, ctx) => {
    return res(
      ctx.json({
        data: [
          {
            id: 1,
            title: 'Test Article 1',
            slug: 'test-article-1',
            excerpt: 'Test excerpt 1',
            published_at: '2024-01-01T00:00:00Z',
            author: {
              id: 1,
              name: 'Test Author',
            },
          },
          {
            id: 2,
            title: 'Test Article 2',
            slug: 'test-article-2',
            excerpt: 'Test excerpt 2',
            published_at: '2024-01-02T00:00:00Z',
            author: {
              id: 1,
              name: 'Test Author',
            },
          },
        ],
        meta: {
          current_page: 1,
          total: 2,
          per_page: 10,
        },
      })
    )
  }),

  // 記事作成
  rest.post('/api/v1/articles', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        data: {
          id: 3,
          title: 'New Article',
          slug: 'new-article',
          content: 'New article content',
          created_at: '2024-01-03T00:00:00Z',
          updated_at: '2024-01-03T00:00:00Z',
        },
      })
    )
  }),

  // AI記事生成
  rest.post('/api/v1/generation/generate', (req, res, ctx) => {
    return res(
      ctx.json({
        content: 'Generated article content from AI',
        title: 'AI Generated Title',
        meta_description: 'AI generated meta description',
        keywords: ['AI', 'Generation', 'Test'],
      })
    )
  }),
]
```

## E2Eテスト（Playwright）

### Playwright設定

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

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
    screenshot: 'only-on-failure',
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
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### E2Eテスト例

```typescript
// e2e/article-generation.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Article Generation Flow', () => {
  test('should generate article successfully', async ({ page }) => {
    // 管理画面にアクセス
    await page.goto('/admin/generation')

    // ログイン（必要な場合）
    await page.fill('[data-testid="email-input"]', 'admin@example.com')
    await page.fill('[data-testid="password-input"]', 'password')
    await page.click('[data-testid="login-button"]')

    // 記事生成画面に移動
    await page.click('[data-testid="generate-article-button"]')

    // プロンプトを入力
    await page.fill('[data-testid="prompt-input"]', 'Next.jsの最新機能について解説記事を書いてください')

    // 生成設定を選択
    await page.selectOption('[data-testid="ai-model-select"]', 'gpt-4')
    await page.fill('[data-testid="word-count-input"]', '2000')

    // 生成開始
    await page.click('[data-testid="generate-button"]')

    // 生成中の表示を確認
    await expect(page.locator('[data-testid="generating-indicator"]')).toBeVisible()
    await expect(page.locator('[data-testid="progress-bar"]')).toBeVisible()

    // 生成完了を待つ（最大30秒）
    await page.waitForSelector('[data-testid="generated-content"]', { timeout: 30000 })

    // 生成された記事を確認
    const generatedContent = await page.locator('[data-testid="generated-content"]').textContent()
    expect(generatedContent).toContain('Next.js')
    expect(generatedContent!.length).toBeGreaterThan(1000)

    // 記事を保存
    await page.click('[data-testid="save-article-button"]')

    // 成功メッセージを確認
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
  })

  test('should handle generation errors gracefully', async ({ page }) => {
    // APIエラーをシミュレート
    await page.route('/api/v1/generation/generate', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'AI service error' }),
      })
    })

    await page.goto('/admin/generation')

    // プロンプトを入力して生成を実行
    await page.fill('[data-testid="prompt-input"]', 'Test prompt')
    await page.click('[data-testid="generate-button"]')

    // エラーメッセージを確認
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible()
    await expect(page.locator('[data-testid="error-message"]')).toContainText('AI service error')
  })
})
```

## CI/CDでのテスト自動化

### GitHub Actions設定

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: password
          MYSQL_DATABASE: testing
        ports:
          - 3306:3306
        options: --health-cmd="mysqladmin ping" --health-interval=10s --health-timeout=5s --health-retries=3
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.3'
          extensions: mbstring, dom, fileinfo, mysql
          
      - name: Copy .env
        run: php -r "file_exists('.env') || copy('.env.example', '.env');"
        
      - name: Install Dependencies
        run: composer install -q --no-ansi --no-interaction --no-scripts --no-progress --prefer-dist
        
      - name: Generate key
        run: php artisan key:generate
        
      - name: Run migrations
        run: php artisan migrate --env=testing
        
      - name: Run tests
        run: php artisan test --coverage

  frontend-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run type check
        run: npm run type-check
        
      - name: Run unit tests
        run: npm run test:ci
        
      - name: Run E2E tests
        run: npx playwright test
```

## 品質管理

### テストカバレッジ目標
- **バックエンド**: 80%以上
- **フロントエンド**: 75%以上
- **重要な機能**: 95%以上（AI生成、HTML生成、認証など）

### 継続的品質改善
- コードレビューでのテストコード確認
- 週次でのテストカバレッジ確認
- 失敗テストの即座の修正
- 定期的なテストコードのリファクタリング

### テストデータ管理
```php
// Laravel - Factory定義
class ArticleFactory extends Factory
{
    protected $model = Article::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence,
            'slug' => $this->faker->slug,
            'content' => $this->faker->paragraphs(5, true),
            'excerpt' => $this->faker->paragraph,
            'meta_description' => $this->faker->sentence,
            'keywords' => $this->faker->words(5),
            'published_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'author_id' => User::factory(),
            'category_id' => Category::factory(),
        ];
    }
}
```

## パフォーマンステスト

### 負荷テスト
```typescript
// AI生成API負荷テスト例
test('AI generation API should handle concurrent requests', async ({ page }) => {
  const promises = Array.from({ length: 5 }, async (_, i) => {
    const response = await page.request.post('/api/v1/generation/generate', {
      data: { prompt: `Test prompt ${i}` }
    })
    return response.status()
  })

  const results = await Promise.all(promises)
  expect(results.every(status => status === 200)).toBe(true)
})
```
