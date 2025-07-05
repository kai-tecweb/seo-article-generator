# AI記事生成機能実装例

## AI記事生成サービス

### OpenAI API連携サービス

```php
// app/Services/OpenAIService.php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OpenAIService
{
    protected string $apiKey;
    protected string $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.openai.api_key');
        $this->baseUrl = 'https://api.openai.com/v1';
    }

    /**
     * テキスト生成
     */
    public function generateText(string $prompt, array $options = []): string
    {
        $defaultOptions = [
            'model' => 'gpt-4-turbo-preview',
            'max_tokens' => 2000,
            'temperature' => 0.7,
            'top_p' => 1,
            'frequency_penalty' => 0,
            'presence_penalty' => 0,
        ];

        $options = array_merge($defaultOptions, $options);

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/chat/completions', [
                'model' => $options['model'],
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'あなたは優秀なライターです。SEOに強く、読みやすく、価値のある記事を作成してください。'
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ],
                'max_tokens' => $options['max_tokens'],
                'temperature' => $options['temperature'],
                'top_p' => $options['top_p'],
                'frequency_penalty' => $options['frequency_penalty'],
                'presence_penalty' => $options['presence_penalty'],
            ]);

            if ($response->successful()) {
                $data = $response->json();
                
                Log::info('OpenAI API 呼び出し成功', [
                    'prompt_length' => strlen($prompt),
                    'response_length' => strlen($data['choices'][0]['message']['content']),
                    'model' => $options['model'],
                ]);
                
                return $data['choices'][0]['message']['content'];
            }

            throw new \Exception('OpenAI API呼び出しに失敗しました: ' . $response->status());

        } catch (\Exception $e) {
            Log::error('OpenAI API エラー', [
                'error' => $e->getMessage(),
                'prompt' => $prompt,
            ]);
            
            throw new \Exception('AI記事生成中にエラーが発生しました: ' . $e->getMessage());
        }
    }

    /**
     * ストリーミング生成
     */
    public function generateTextStream(string $prompt, array $options = []): \Generator
    {
        $defaultOptions = [
            'model' => 'gpt-4-turbo-preview',
            'max_tokens' => 2000,
            'temperature' => 0.7,
            'stream' => true,
        ];

        $options = array_merge($defaultOptions, $options);

        try {
            $ch = curl_init();
            
            curl_setopt($ch, CURLOPT_URL, $this->baseUrl . '/chat/completions');
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, false);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
                'model' => $options['model'],
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'あなたは優秀なライターです。SEOに強く、読みやすく、価値のある記事を作成してください。'
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ],
                'max_tokens' => $options['max_tokens'],
                'temperature' => $options['temperature'],
                'stream' => true,
            ]));
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Authorization: Bearer ' . $this->apiKey,
                'Content-Type: application/json',
            ]);
            
            curl_setopt($ch, CURLOPT_WRITEFUNCTION, function($ch, $data) {
                $lines = explode("\n", $data);
                
                foreach ($lines as $line) {
                    if (strpos($line, 'data: ') === 0) {
                        $json = substr($line, 6);
                        
                        if ($json === '[DONE]') {
                            return strlen($data);
                        }
                        
                        $decoded = json_decode($json, true);
                        
                        if (isset($decoded['choices'][0]['delta']['content'])) {
                            yield $decoded['choices'][0]['delta']['content'];
                        }
                    }
                }
                
                return strlen($data);
            });
            
            curl_exec($ch);
            curl_close($ch);
            
        } catch (\Exception $e) {
            Log::error('OpenAI Streaming API エラー', [
                'error' => $e->getMessage(),
                'prompt' => $prompt,
            ]);
            
            throw new \Exception('ストリーミング生成中にエラーが発生しました: ' . $e->getMessage());
        }
    }

    /**
     * 画像生成
     */
    public function generateImage(string $prompt, array $options = []): string
    {
        $defaultOptions = [
            'model' => 'dall-e-3',
            'size' => '1024x1024',
            'quality' => 'standard',
            'n' => 1,
        ];

        $options = array_merge($defaultOptions, $options);

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/images/generations', [
                'model' => $options['model'],
                'prompt' => $prompt,
                'size' => $options['size'],
                'quality' => $options['quality'],
                'n' => $options['n'],
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return $data['data'][0]['url'];
            }

            throw new \Exception('OpenAI Image API呼び出しに失敗しました: ' . $response->status());

        } catch (\Exception $e) {
            Log::error('OpenAI Image API エラー', [
                'error' => $e->getMessage(),
                'prompt' => $prompt,
            ]);
            
            throw new \Exception('画像生成中にエラーが発生しました: ' . $e->getMessage());
        }
    }
}
```

### 記事生成サービス

```php
// app/Services/ArticleGeneratorService.php
<?php

namespace App\Services;

use App\Models\Article;
use App\Models\Category;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ArticleGeneratorService
{
    public function __construct(
        protected OpenAIService $openAIService,
        protected SEOOptimizerService $seoOptimizer
    ) {}

    /**
     * 記事生成
     */
    public function generateArticle(array $data): Article
    {
        DB::beginTransaction();
        
        try {
            // 記事内容生成
            $content = $this->generateContent($data);
            
            // SEO最適化
            $seoData = $this->seoOptimizer->optimizeContent($content, $data['keywords'] ?? []);
            
            // 記事作成
            $article = Article::create([
                'title' => $seoData['title'] ?? $data['title'],
                'slug' => Str::slug($seoData['title'] ?? $data['title']),
                'content' => $content,
                'content_html' => $this->convertToHtml($content),
                'excerpt' => $seoData['excerpt'] ?? $this->generateExcerpt($content),
                'meta_description' => $seoData['meta_description'] ?? $this->generateMetaDescription($content),
                'keywords' => $seoData['keywords'] ?? $data['keywords'] ?? [],
                'author_id' => $data['author_id'] ?? User::first()->id,
                'category_id' => $data['category_id'] ?? Category::first()->id,
                'status' => 'draft',
                'ai_generated' => true,
                'generation_prompt' => $data['prompt'],
                'generation_settings' => $data['settings'] ?? [],
            ]);

            // タグ付け
            if (!empty($data['tags'])) {
                $this->attachTags($article, $data['tags']);
            }

            // アイキャッチ画像生成（オプション）
            if ($data['generate_featured_image'] ?? false) {
                $this->generateFeaturedImage($article);
            }

            DB::commit();
            
            Log::info('記事生成完了', [
                'article_id' => $article->id,
                'title' => $article->title,
                'word_count' => str_word_count($content),
            ]);

            return $article;

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('記事生成エラー', [
                'error' => $e->getMessage(),
                'data' => $data,
            ]);

            throw new \Exception('記事生成中にエラーが発生しました: ' . $e->getMessage());
        }
    }

    /**
     * 記事コンテンツ生成
     */
    protected function generateContent(array $data): string
    {
        $prompt = $this->buildPrompt($data);
        
        return $this->openAIService->generateText($prompt, $data['settings'] ?? []);
    }

    /**
     * プロンプト構築
     */
    protected function buildPrompt(array $data): string
    {
        $prompt = $data['prompt'];
        
        // 記事タイプに応じたプロンプト拡張
        if (isset($data['article_type'])) {
            switch ($data['article_type']) {
                case 'tutorial':
                    $prompt .= "\n\n以下の点を含めて、初心者にもわかりやすいチュートリアル記事を作成してください：\n";
                    $prompt .= "- 手順を段階的に説明\n";
                    $prompt .= "- 具体的なコード例\n";
                    $prompt .= "- 注意点やトラブルシューティング\n";
                    break;
                    
                case 'comparison':
                    $prompt .= "\n\n以下の点を含めて、客観的な比較記事を作成してください：\n";
                    $prompt .= "- 比較表の作成\n";
                    $prompt .= "- それぞれの特徴と利点\n";
                    $prompt .= "- 使用場面の提案\n";
                    break;
                    
                case 'news':
                    $prompt .= "\n\n以下の点を含めて、最新ニュース記事を作成してください：\n";
                    $prompt .= "- 事実に基づく情報\n";
                    $prompt .= "- 業界への影響\n";
                    $prompt .= "- 今後の展望\n";
                    break;
                    
                default:
                    $prompt .= "\n\n読者に価値のある、詳細で実践的な記事を作成してください。";
                    break;
            }
        }

        // 文字数指定
        if (isset($data['word_count'])) {
            $prompt .= "\n\n文字数: 約{$data['word_count']}文字";
        }

        // キーワード指定
        if (!empty($data['keywords'])) {
            $keywords = implode(', ', $data['keywords']);
            $prompt .= "\n\n重要キーワード: {$keywords}";
            $prompt .= "\nこれらのキーワードを自然に文章に組み込んでください。";
        }

        // 対象読者指定
        if (isset($data['target_audience'])) {
            $prompt .= "\n\n対象読者: {$data['target_audience']}";
        }

        return $prompt;
    }

    /**
     * Markdown → HTML変換
     */
    protected function convertToHtml(string $markdown): string
    {
        // Markdown パーサーライブラリを使用
        $parser = new \ParsedownExtra();
        return $parser->text($markdown);
    }

    /**
     * 記事の抜粋生成
     */
    protected function generateExcerpt(string $content): string
    {
        $plainText = strip_tags($content);
        $excerpt = Str::limit($plainText, 200);
        
        return $excerpt;
    }

    /**
     * メタディスクリプション生成
     */
    protected function generateMetaDescription(string $content): string
    {
        $plainText = strip_tags($content);
        $metaDescription = Str::limit($plainText, 160);
        
        return $metaDescription;
    }

    /**
     * タグ付け
     */
    protected function attachTags(Article $article, array $tags): void
    {
        $tagIds = [];
        
        foreach ($tags as $tagName) {
            $tag = Tag::firstOrCreate([
                'name' => $tagName,
                'slug' => Str::slug($tagName),
            ]);
            
            $tagIds[] = $tag->id;
        }
        
        $article->tags()->attach($tagIds);
    }

    /**
     * アイキャッチ画像生成
     */
    protected function generateFeaturedImage(Article $article): void
    {
        try {
            $imagePrompt = "Create a professional blog featured image for an article titled: {$article->title}";
            $imageUrl = $this->openAIService->generateImage($imagePrompt);
            
            // 画像をダウンロードして保存
            $imageData = file_get_contents($imageUrl);
            $imageName = 'featured-' . $article->id . '-' . time() . '.jpg';
            $imagePath = 'images/featured/' . $imageName;
            
            Storage::disk('public')->put($imagePath, $imageData);
            
            $article->update([
                'featured_image' => '/storage/' . $imagePath,
            ]);
            
        } catch (\Exception $e) {
            Log::error('アイキャッチ画像生成エラー', [
                'article_id' => $article->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * 一括記事生成
     */
    public function generateBulkArticles(array $prompts, array $settings = []): array
    {
        $results = [];
        
        foreach ($prompts as $prompt) {
            try {
                $articleData = array_merge($settings, ['prompt' => $prompt]);
                $article = $this->generateArticle($articleData);
                
                $results[] = [
                    'success' => true,
                    'article' => $article,
                    'prompt' => $prompt,
                ];
                
            } catch (\Exception $e) {
                $results[] = [
                    'success' => false,
                    'error' => $e->getMessage(),
                    'prompt' => $prompt,
                ];
            }
        }
        
        return $results;
    }
}
```

### 記事生成コントローラー

```php
// app/Http/Controllers/Api/GenerationController.php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\GenerateArticleRequest;
use App\Services\ArticleGeneratorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GenerationController extends Controller
{
    public function __construct(
        protected ArticleGeneratorService $articleGenerator
    ) {}

    /**
     * 記事生成
     */
    public function generate(GenerateArticleRequest $request): JsonResponse
    {
        try {
            $article = $this->articleGenerator->generateArticle($request->validated());
            
            return response()->json([
                'success' => true,
                'message' => '記事が生成されました',
                'data' => [
                    'id' => $article->id,
                    'title' => $article->title,
                    'slug' => $article->slug,
                    'excerpt' => $article->excerpt,
                    'content' => $article->content,
                    'meta_description' => $article->meta_description,
                    'keywords' => $article->keywords,
                    'featured_image' => $article->featured_image,
                    'created_at' => $article->created_at,
                ],
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => '記事生成中にエラーが発生しました',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ストリーミング生成
     */
    public function generateStream(GenerateArticleRequest $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        return response()->stream(function () use ($request) {
            try {
                $data = $request->validated();
                
                // 生成開始通知
                echo "data: " . json_encode([
                    'type' => 'start',
                    'message' => '記事生成を開始しました',
                ]) . "\n\n";
                ob_flush();
                flush();
                
                // OpenAI ストリーミング生成
                $content = '';
                $prompt = $this->buildPrompt($data);
                
                foreach ($this->openAIService->generateTextStream($prompt) as $chunk) {
                    $content .= $chunk;
                    
                    echo "data: " . json_encode([
                        'type' => 'content',
                        'chunk' => $chunk,
                        'content' => $content,
                    ]) . "\n\n";
                    ob_flush();
                    flush();
                }
                
                // 記事保存
                $article = $this->saveGeneratedArticle($data, $content);
                
                // 完了通知
                echo "data: " . json_encode([
                    'type' => 'complete',
                    'message' => '記事生成が完了しました',
                    'article' => [
                        'id' => $article->id,
                        'title' => $article->title,
                        'slug' => $article->slug,
                    ],
                ]) . "\n\n";
                ob_flush();
                flush();
                
            } catch (\Exception $e) {
                echo "data: " . json_encode([
                    'type' => 'error',
                    'message' => '記事生成中にエラーが発生しました',
                    'error' => $e->getMessage(),
                ]) . "\n\n";
                ob_flush();
                flush();
            }
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'Connection' => 'keep-alive',
        ]);
    }

    /**
     * 一括生成
     */
    public function generateBulk(Request $request): JsonResponse
    {
        $request->validate([
            'prompts' => 'required|array|min:1|max:10',
            'prompts.*' => 'required|string|max:2000',
            'settings' => 'array',
        ]);

        try {
            $results = $this->articleGenerator->generateBulkArticles(
                $request->prompts,
                $request->settings ?? []
            );
            
            $successCount = count(array_filter($results, fn($r) => $r['success']));
            $errorCount = count($results) - $successCount;
            
            return response()->json([
                'success' => true,
                'message' => "{$successCount}件の記事が生成されました",
                'data' => [
                    'total' => count($results),
                    'success' => $successCount,
                    'errors' => $errorCount,
                    'results' => $results,
                ],
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => '一括生成中にエラーが発生しました',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * 生成テンプレート一覧
     */
    public function getTemplates(): JsonResponse
    {
        $templates = [
            [
                'id' => 'tutorial',
                'name' => 'チュートリアル記事',
                'description' => '初心者向けの手順説明記事',
                'prompt_template' => '{topic}について、初心者にもわかりやすいチュートリアル記事を作成してください。',
                'settings' => [
                    'article_type' => 'tutorial',
                    'word_count' => 2000,
                    'target_audience' => '初心者',
                ],
            ],
            [
                'id' => 'comparison',
                'name' => '比較記事',
                'description' => '複数の選択肢を比較する記事',
                'prompt_template' => '{topic}について、詳細な比較記事を作成してください。',
                'settings' => [
                    'article_type' => 'comparison',
                    'word_count' => 1500,
                    'target_audience' => '中級者',
                ],
            ],
            [
                'id' => 'news',
                'name' => 'ニュース記事',
                'description' => '最新情報を伝える記事',
                'prompt_template' => '{topic}について、最新の情報をまとめたニュース記事を作成してください。',
                'settings' => [
                    'article_type' => 'news',
                    'word_count' => 1000,
                    'target_audience' => '一般読者',
                ],
            ],
        ];
        
        return response()->json([
            'success' => true,
            'data' => $templates,
        ]);
    }

    /**
     * プロンプト構築
     */
    private function buildPrompt(array $data): string
    {
        // ArticleGeneratorServiceのbuildPromptメソッドを呼び出し
        $reflection = new \ReflectionClass($this->articleGenerator);
        $method = $reflection->getMethod('buildPrompt');
        $method->setAccessible(true);
        
        return $method->invoke($this->articleGenerator, $data);
    }

    /**
     * 生成記事保存
     */
    private function saveGeneratedArticle(array $data, string $content): Article
    {
        $data['content'] = $content;
        return $this->articleGenerator->generateArticle($data);
    }
}
```

## フロントエンド実装

### AI記事生成ストア

```typescript
// stores/generationStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface GenerationState {
  isGenerating: boolean
  progress: number
  generatedContent: string
  error: string | null
  templates: GenerationTemplate[]
  selectedTemplate: GenerationTemplate | null
  generateArticle: (data: GenerationRequest) => Promise<void>
  generateArticleStream: (data: GenerationRequest) => Promise<void>
  generateBulkArticles: (prompts: string[], settings?: any) => Promise<void>
  loadTemplates: () => Promise<void>
  selectTemplate: (template: GenerationTemplate) => void
  resetGeneration: () => void
}

interface GenerationTemplate {
  id: string
  name: string
  description: string
  prompt_template: string
  settings: any
}

interface GenerationRequest {
  prompt: string
  article_type?: string
  word_count?: number
  keywords?: string[]
  target_audience?: string
  settings?: any
}

export const useGenerationStore = create<GenerationState>()(
  persist(
    (set, get) => ({
      isGenerating: false,
      progress: 0,
      generatedContent: '',
      error: null,
      templates: [],
      selectedTemplate: null,
      
      generateArticle: async (data: GenerationRequest) => {
        set({ isGenerating: true, error: null, progress: 0 })
        
        try {
          const response = await fetch('/api/v1/generation/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${getAuthToken()}`,
            },
            body: JSON.stringify(data),
          })

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }

          const result = await response.json()
          
          set({
            generatedContent: result.data.content,
            progress: 100,
            isGenerating: false,
          })
          
        } catch (error) {
          set({
            error: error.message,
            isGenerating: false,
            progress: 0,
          })
        }
      },

      generateArticleStream: async (data: GenerationRequest) => {
        set({ isGenerating: true, error: null, progress: 0, generatedContent: '' })
        
        try {
          const response = await fetch('/api/v1/generation/generate-stream', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${getAuthToken()}`,
            },
            body: JSON.stringify(data),
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
                  
                  switch (data.type) {
                    case 'start':
                      set({ progress: 10 })
                      break
                      
                    case 'content':
                      set(state => ({
                        generatedContent: data.content,
                        progress: Math.min(90, state.progress + 5),
                      }))
                      break
                      
                    case 'complete':
                      set({ progress: 100, isGenerating: false })
                      break
                      
                    case 'error':
                      set({
                        error: data.message,
                        isGenerating: false,
                        progress: 0,
                      })
                      break
                  }
                } catch (e) {
                  console.error('JSON parse error:', e)
                }
              }
            }
          }
          
        } catch (error) {
          set({
            error: error.message,
            isGenerating: false,
            progress: 0,
          })
        }
      },

      generateBulkArticles: async (prompts: string[], settings = {}) => {
        set({ isGenerating: true, error: null, progress: 0 })
        
        try {
          const response = await fetch('/api/v1/generation/generate-bulk', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${getAuthToken()}`,
            },
            body: JSON.stringify({ prompts, settings }),
          })

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }

          const result = await response.json()
          
          set({
            progress: 100,
            isGenerating: false,
            generatedContent: `${result.data.success}件の記事が生成されました`,
          })
          
        } catch (error) {
          set({
            error: error.message,
            isGenerating: false,
            progress: 0,
          })
        }
      },

      loadTemplates: async () => {
        try {
          const response = await fetch('/api/v1/generation/templates', {
            headers: {
              'Authorization': `Bearer ${getAuthToken()}`,
            },
          })

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }

          const result = await response.json()
          set({ templates: result.data })
          
        } catch (error) {
          console.error('テンプレート読み込みエラー:', error)
        }
      },

      selectTemplate: (template: GenerationTemplate) => {
        set({ selectedTemplate: template })
      },

      resetGeneration: () => {
        set({
          isGenerating: false,
          progress: 0,
          generatedContent: '',
          error: null,
        })
      },
    }),
    { name: 'generation-storage' }
  )
)

function getAuthToken(): string {
  return localStorage.getItem('auth_token') || ''
}
```

### AI記事生成フォーム

```typescript
// components/generation/ArticleGenerationForm.tsx
'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Bot, Sparkles, FileText, Settings } from 'lucide-react'
import { useGenerationStore } from '@/stores/generationStore'

const generationSchema = z.object({
  prompt: z.string().min(10, 'プロンプトは10文字以上で入力してください').max(2000, 'プロンプトは2000文字以内で入力してください'),
  article_type: z.enum(['tutorial', 'comparison', 'news', 'review', 'guide']).optional(),
  word_count: z.number().min(500).max(5000).optional(),
  keywords: z.string().optional(),
  target_audience: z.enum(['初心者', '中級者', '上級者', '一般読者']).optional(),
  generate_featured_image: z.boolean().default(false),
  stream_mode: z.boolean().default(true),
})

type GenerationForm = z.infer<typeof generationSchema>

export default function ArticleGenerationForm() {
  const {
    isGenerating,
    progress,
    generatedContent,
    error,
    templates,
    selectedTemplate,
    generateArticleStream,
    generateArticle,
    loadTemplates,
    selectTemplate,
    resetGeneration,
  } = useGenerationStore()

  const [keywordInput, setKeywordInput] = useState('')
  const [keywords, setKeywords] = useState<string[]>([])

  const form = useForm<GenerationForm>({
    resolver: zodResolver(generationSchema),
    defaultValues: {
      prompt: '',
      word_count: 1500,
      target_audience: '中級者',
      generate_featured_image: false,
      stream_mode: true,
    },
  })

  useEffect(() => {
    loadTemplates()
  }, [loadTemplates])

  useEffect(() => {
    if (selectedTemplate) {
      form.setValue('article_type', selectedTemplate.id as any)
      form.setValue('word_count', selectedTemplate.settings.word_count)
      form.setValue('target_audience', selectedTemplate.settings.target_audience)
      form.setValue('prompt', selectedTemplate.prompt_template.replace('{topic}', ''))
    }
  }, [selectedTemplate, form])

  const onSubmit = async (data: GenerationForm) => {
    const requestData = {
      ...data,
      keywords: keywords.length > 0 ? keywords : undefined,
    }

    if (data.stream_mode) {
      await generateArticleStream(requestData)
    } else {
      await generateArticle(requestData)
    }
  }

  const handleKeywordAdd = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()])
      setKeywordInput('')
    }
  }

  const handleKeywordRemove = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword))
  }

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      selectTemplate(template)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI記事生成
          </CardTitle>
          <CardDescription>
            AIを使用して高品質な記事を自動生成します
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* テンプレート選択 */}
            <div className="space-y-2">
              <Label>記事テンプレート</Label>
              <Select onValueChange={handleTemplateSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="テンプレートを選択（任意）" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{template.name}</span>
                        <span className="text-sm text-gray-500">{template.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* プロンプト入力 */}
            <div className="space-y-2">
              <Label htmlFor="prompt">記事生成プロンプト *</Label>
              <Textarea
                id="prompt"
                placeholder="例：Next.js 13のApp Routerについて、初心者にもわかりやすく解説してください"
                className="min-h-32"
                {...form.register('prompt')}
              />
              {form.formState.errors.prompt && (
                <p className="text-sm text-red-500">{form.formState.errors.prompt.message}</p>
              )}
            </div>

            {/* 詳細設定 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="article_type">記事タイプ</Label>
                <Select onValueChange={(value) => form.setValue('article_type', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="記事タイプを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tutorial">チュートリアル</SelectItem>
                    <SelectItem value="comparison">比較記事</SelectItem>
                    <SelectItem value="news">ニュース記事</SelectItem>
                    <SelectItem value="review">レビュー記事</SelectItem>
                    <SelectItem value="guide">ガイド記事</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="word_count">文字数</Label>
                <Input
                  id="word_count"
                  type="number"
                  min={500}
                  max={5000}
                  step={100}
                  {...form.register('word_count', { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target_audience">対象読者</Label>
                <Select onValueChange={(value) => form.setValue('target_audience', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="対象読者を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="初心者">初心者</SelectItem>
                    <SelectItem value="中級者">中級者</SelectItem>
                    <SelectItem value="上級者">上級者</SelectItem>
                    <SelectItem value="一般読者">一般読者</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* キーワード設定 */}
            <div className="space-y-2">
              <Label>SEOキーワード</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="キーワードを入力"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleKeywordAdd())}
                />
                <Button type="button" variant="outline" onClick={handleKeywordAdd}>
                  追加
                </Button>
              </div>
              {keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {keywords.map((keyword) => (
                    <Badge
                      key={keyword}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleKeywordRemove(keyword)}
                    >
                      {keyword} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* 生成ボタン */}
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isGenerating}
                className="flex items-center gap-2"
              >
                {isGenerating ? (
                  <Settings className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {isGenerating ? '生成中...' : '記事を生成'}
              </Button>
              
              {(generatedContent || error) && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetGeneration}
                >
                  リセット
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 生成進捗 */}
      {isGenerating && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>生成進捗</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* エラー表示 */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 生成結果 */}
      {generatedContent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              生成された記事
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm">{generatedContent}</pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
```

## 設定・環境変数

### Laravel設定

```php
// config/services.php
return [
    'openai' => [
        'api_key' => env('OPENAI_API_KEY'),
        'organization' => env('OPENAI_ORGANIZATION'),
    ],
    
    'claude' => [
        'api_key' => env('CLAUDE_API_KEY'),
    ],
];
```

### 環境変数

```env
# AI APIs
OPENAI_API_KEY=sk-your-openai-key
OPENAI_ORGANIZATION=your-organization-id
CLAUDE_API_KEY=your-claude-key

# 記事生成設定
AI_DEFAULT_MODEL=gpt-4-turbo-preview
AI_DEFAULT_MAX_TOKENS=2000
AI_DEFAULT_TEMPERATURE=0.7
```

## 実装のポイント

1. **AI API統合**: OpenAI APIとの効率的な連携
2. **ストリーミング生成**: リアルタイムでの記事生成表示
3. **テンプレート管理**: 記事タイプ別のテンプレート
4. **SEO最適化**: キーワード最適化と構造化
5. **エラーハンドリング**: 適切なエラー処理とユーザーフィードバック
6. **一括生成**: 複数記事の効率的な生成
