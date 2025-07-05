<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

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
      'model' => 'gpt-4o-mini',
      'max_tokens' => 2000,
      'temperature' => 0.7,
      'top_p' => 1,
      'frequency_penalty' => 0,
      'presence_penalty' => 0,
    ];

    $options = array_merge($defaultOptions, $options);
    try {
      $response = Http::timeout(60)
        ->retry(2, 1000)
        ->withHeaders([
          'Authorization' => 'Bearer ' . $this->apiKey,
          'Content-Type' => 'application/json',
        ])->post($this->baseUrl . '/chat/completions', [
          'model' => $options['model'],
          'messages' => [
            [
              'role' => 'system',
              'content' => 'あなたは優秀なSEOライターです。与えられたトピックについて、検索エンジンで上位表示されるような高品質な記事を作成してください。'
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
        return $data['choices'][0]['message']['content'] ?? '';
      }

      Log::error('OpenAI API Error', [
        'status' => $response->status(),
        'response' => $response->json()
      ]);

      throw new Exception('OpenAI API request failed');
    } catch (Exception $e) {
      Log::error('OpenAI Service Error', [
        'message' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
      ]);

      throw $e;
    }
  }

  /**
   * SEO記事生成
   */
  public function generateSEOArticle(array $params): array
  {
    $keyword = $params['keyword'] ?? '';
    $tone = $params['tone'] ?? 'professional';
    $length = $params['length'] ?? 'medium';
    $targetAudience = $params['target_audience'] ?? 'general';

    $lengthMapping = [
      'short' => 800,
      'medium' => 1500,
      'long' => 2500,
    ];

    $toneMapping = [
      'professional' => 'プロフェッショナルで信頼性の高い',
      'friendly' => '親しみやすく読みやすい',
      'authoritative' => '権威的で専門的な',
      'casual' => 'カジュアルで気軽な',
    ];

    $targetWords = $lengthMapping[$length] ?? 1500;
    $toneDescription = $toneMapping[$tone] ?? 'プロフェッショナルで信頼性の高い';

    $prompt = "
キーワード: {$keyword}
トーン: {$toneDescription}
対象読者: {$targetAudience}
文字数: {$targetWords}文字程度

以下の条件で記事を作成してください：
1. SEOに最適化されたタイトル（H1）
2. 見出し構造（H2、H3）を明確に
3. 読みやすい段落分け
4. 関連キーワードを自然に含める
5. 読者の検索意図を満たす内容

記事の構成:
- 導入部: 読者の関心を引く
- 本文: 複数の章に分けて詳しく説明
- まとめ: 要点を整理して行動を促す

マークダウン形式で出力してください。
";

    try {
      $content = $this->generateText($prompt, [
        'max_tokens' => 3000,
        'temperature' => 0.8,
      ]);

      // タイトル抽出
      $lines = explode("\n", $content);
      $title = '';
      foreach ($lines as $line) {
        if (strpos($line, '# ') === 0) {
          $title = trim(str_replace('# ', '', $line));
          break;
        }
      }

      // メタディスクリプション生成
      $metaPrompt = "
以下の記事内容から、SEOに最適化されたメタディスクリプションを150文字以内で作成してください：

{$content}

条件：
- 記事の要点を簡潔に要約
- 検索キーワードを含める
- 読者の興味を引く表現
- 150文字以内
";

      $metaDescription = $this->generateText($metaPrompt, [
        'max_tokens' => 200,
        'temperature' => 0.6,
      ]);

      return [
        'title' => $title ?: 'AI生成記事',
        'content' => $content,
        'meta_description' => trim($metaDescription),
        'keyword' => $keyword,
        'tone' => $tone,
        'length' => $length,
        'target_audience' => $targetAudience,
      ];
    } catch (Exception $e) {
      Log::error('SEO Article Generation Error', [
        'params' => $params,
        'error' => $e->getMessage()
      ]);

      throw $e;
    }
  }

  /**
   * 記事の改善提案
   */
  public function improveSEOArticle(string $content, string $keyword): array
  {
    $prompt = "
以下の記事を分析して、SEOの観点から改善提案を行ってください：

キーワード: {$keyword}
記事内容:
{$content}

以下の観点で分析してください：
1. キーワード密度と配置
2. 見出し構造
3. 読みやすさ
4. 内容の充実度
5. 検索意図との合致度

改善提案を具体的に、優先度付きで提示してください。
";

    try {
      $suggestions = $this->generateText($prompt, [
        'max_tokens' => 1500,
        'temperature' => 0.5,
      ]);

      return [
        'suggestions' => $suggestions,
        'analyzed_content' => $content,
        'keyword' => $keyword,
      ];
    } catch (Exception $e) {
      Log::error('SEO Improvement Error', [
        'content_length' => strlen($content),
        'keyword' => $keyword,
        'error' => $e->getMessage()
      ]);

      throw $e;
    }
  }
}
