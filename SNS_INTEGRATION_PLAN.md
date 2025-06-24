# SNS統合拡張計画 - SEO記事生成システム

## 🎯 SNS統合の目標

### 現在の実装状況
- ✅ X（Twitter）投稿文生成機能（手動投稿）
- ✅ Google Business Profile自動投稿
- ❌ Instagram投稿機能
- ❌ YouTube投稿機能  
- ❌ LinkedIn投稿機能
- ❌ Facebook投稿機能

### 統合目標
各SNSプラットフォームに対応した自動投稿・投稿文生成機能を実装し、記事のリーチを最大化する。

## 📱 SNSプラットフォーム別実装計画

### 1. Instagram統合

#### 機能仕様
- **投稿タイプ**: フィード投稿、ストーリーズ、リール
- **コンテンツ**: アイキャッチ画像 + キャプション
- **自動化**: 記事公開と同時投稿
- **ハッシュタグ**: 自動生成（関連性重視）

#### 実装ファイル構成
```typescript
// types/instagram.ts
export interface InstagramPostData {
  imageUrl: string;
  caption: string;
  hashtags: string[];
  location?: {
    id: string;
    name: string;
  };
  accessToken: string;
}

export interface InstagramConfig {
  accessToken: string;
  userId: string;
  businessAccountId?: string;
}
```

```typescript
// app/api/post-to-instagram/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { InstagramPostData } from '@/types/instagram';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, caption, hashtags, accessToken } = await request.json() as InstagramPostData;
    
    // Instagram Basic Display API または Graph API使用
    const mediaResponse = await fetch(`https://graph.facebook.com/v18.0/${userId}/media`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: imageUrl,
        caption: `${caption}\n\n${hashtags.map(tag => `#${tag}`).join(' ')}`,
        access_token: accessToken,
      }),
    });
    
    const mediaData = await mediaResponse.json();
    
    // 投稿を公開
    const publishResponse = await fetch(`https://graph.facebook.com/v18.0/${userId}/media_publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        creation_id: mediaData.id,
        access_token: accessToken,
      }),
    });
    
    const publishData = await publishResponse.json();
    
    return NextResponse.json({
      success: true,
      postId: publishData.id,
      postUrl: `https://www.instagram.com/p/${publishData.id}/`,
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
```

### 2. YouTube統合

#### 機能仕様
- **投稿タイプ**: ショート動画、通常動画
- **コンテンツ**: 記事要約動画、スライドショー
- **自動化**: 記事 → 動画変換 → YouTube投稿
- **AI活用**: 音声合成、画像スライドショー

#### 実装ファイル構成
```typescript
// types/youtube.ts
export interface YouTubeVideoData {
  title: string;
  description: string;
  tags: string[];
  categoryId: string;
  privacyStatus: 'private' | 'public' | 'unlisted';
  thumbnailUrl?: string;
  videoFile?: File;
}

export interface YouTubeConfig {
  apiKey: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}
```

```typescript
// app/api/post-to-youtube/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: NextRequest) {
  try {
    const { title, description, tags, videoFile } = await request.json();
    
    const oauth2Client = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      process.env.YOUTUBE_REDIRECT_URI
    );
    
    oauth2Client.setCredentials({
      refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
    });
    
    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
    
    const response = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title,
          description,
          tags,
          categoryId: '22', // People & Blogs
        },
        status: {
          privacyStatus: 'public',
        },
      },
      media: {
        body: videoFile,
      },
    });
    
    return NextResponse.json({
      success: true,
      videoId: response.data.id,
      videoUrl: `https://www.youtube.com/watch?v=${response.data.id}`,
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
```

### 3. LinkedIn統合

#### 機能仕様
- **投稿タイプ**: テキスト投稿、画像投稿、記事投稿
- **コンテンツ**: 記事要約 + リンク
- **対象**: 個人プロフィール + 企業ページ
- **自動化**: 記事公開と同時投稿

#### 実装ファイル構成
```typescript
// types/linkedin.ts
export interface LinkedInPostData {
  text: string;
  imageUrl?: string;
  articleUrl?: string;
  visibility: 'PUBLIC' | 'CONNECTIONS';
  accessToken: string;
}

export interface LinkedInConfig {
  accessToken: string;
  personId: string;
  companyId?: string;
}
```

### 4. Facebook統合

#### 機能仕様
- **投稿タイプ**: テキスト、画像、リンク
- **コンテンツ**: 記事のプレビュー + リンク
- **対象**: 個人ページ + Facebookページ
- **自動化**: 記事公開と同時投稿

## 🔧 統合UIコンポーネント

### SNS投稿管理フォーム
```typescript
// components/forms/sns-post-control.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface SNSPostControlProps {
  articleTitle: string;
  articleSummary: string;
  articleUrl: string;
  imageUrl?: string;
  onPost: (platform: string, postData: any) => Promise<void>;
}

export default function SNSPostControl({
  articleTitle,
  articleSummary,
  articleUrl,
  imageUrl,
  onPost
}: SNSPostControlProps) {
  const [platforms, setPlatforms] = useState({
    twitter: { enabled: true, posted: false },
    instagram: { enabled: true, posted: false },
    linkedin: { enabled: false, posted: false },
    facebook: { enabled: false, posted: false },
    youtube: { enabled: false, posted: false },
  });

  const [customPosts, setCustomPosts] = useState({
    twitter: '',
    instagram: '',
    linkedin: '',
    facebook: '',
    youtube: '',
  });

  const handlePost = async (platform: string) => {
    try {
      const postData = generatePostData(platform);
      await onPost(platform, postData);
      
      setPlatforms(prev => ({
        ...prev,
        [platform]: { ...prev[platform], posted: true }
      }));
    } catch (error) {
      console.error(`${platform}投稿エラー:`, error);
    }
  };

  const generatePostData = (platform: string) => {
    const baseData = {
      title: articleTitle,
      summary: articleSummary,
      url: articleUrl,
      image: imageUrl,
    };

    switch (platform) {
      case 'twitter':
        return {
          ...baseData,
          text: customPosts.twitter || `${articleTitle}\n\n${articleSummary}\n\n${articleUrl}`,
          hashtags: generateHashtags(articleTitle),
        };
      case 'instagram':
        return {
          ...baseData,
          caption: customPosts.instagram || articleSummary,
          hashtags: generateHashtags(articleTitle),
          imageUrl,
        };
      case 'linkedin':
        return {
          ...baseData,
          text: customPosts.linkedin || `${articleTitle}\n\n${articleSummary}`,
          articleUrl,
        };
      default:
        return baseData;
    }
  };

  const generateHashtags = (title: string): string[] => {
    // AI生成またはキーワード抽出ロジック
    return ['SEO', 'ブログ', 'マーケティング'];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>SNS同時投稿</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="settings">投稿設定</TabsTrigger>
            <TabsTrigger value="preview">プレビュー</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="space-y-4">
            {Object.entries(platforms).map(([platform, config]) => (
              <div key={platform} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={config.enabled}
                    onCheckedChange={(checked) =>
                      setPlatforms(prev => ({
                        ...prev,
                        [platform]: { ...prev[platform], enabled: checked }
                      }))
                    }
                  />
                  <span className="font-medium capitalize">{platform}</span>
                  {config.posted && <Badge variant="secondary">投稿済み</Badge>}
                </div>
                
                {config.enabled && (
                  <Button
                    onClick={() => handlePost(platform)}
                    disabled={config.posted}
                    size="sm"
                  >
                    {config.posted ? '投稿済み' : '投稿'}
                  </Button>
                )}
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="preview" className="space-y-4">
            {Object.entries(platforms)
              .filter(([, config]) => config.enabled)
              .map(([platform]) => (
                <div key={platform} className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2 capitalize">{platform} プレビュー</h4>
                  <Textarea
                    value={customPosts[platform]}
                    onChange={(e) =>
                      setCustomPosts(prev => ({ ...prev, [platform]: e.target.value }))
                    }
                    placeholder={`${platform}用の投稿文をカスタマイズ...`}
                    className="min-h-[100px]"
                  />
                </div>
              ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
```

## 🔄 ワークフロー統合

### 記事生成 → SNS自動投稿フロー
```typescript
// app/api/publish-workflow/route.ts
export async function POST(request: NextRequest) {
  try {
    const { article, publishConfig } = await request.json();
    
    const results = {
      wordpress: null,
      sns: {},
      notifications: [],
    };
    
    // 1. WordPress投稿
    if (publishConfig.wordpress.enabled) {
      results.wordpress = await publishToWordPress(article, publishConfig.wordpress);
    }
    
    // 2. SNS投稿（並列実行）
    const snsPromises = Object.entries(publishConfig.sns)
      .filter(([, config]) => config.enabled)
      .map(async ([platform, config]) => {
        try {
          const result = await publishToSNS(platform, article, config);
          results.sns[platform] = result;
        } catch (error) {
          results.sns[platform] = { success: false, error: error.message };
        }
      });
    
    await Promise.all(snsPromises);
    
    // 3. Notion保存
    await saveToNotion({
      article,
      publishResults: results,
      publishedAt: new Date(),
    });
    
    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
```

## 📊 実装タイムライン

### フェーズ1: Instagram統合（3-4日）
1. Instagram Graph API設定
2. 投稿機能実装
3. UIコンポーネント作成
4. テスト実装

### フェーズ2: LinkedIn統合（2-3日）
1. LinkedIn API設定
2. 投稿機能実装
3. 企業ページ対応

### フェーズ3: YouTube統合（4-5日）
1. YouTube Data API設定
2. 動画投稿機能実装
3. 音声合成・動画生成機能
4. ショート動画対応

### フェーズ4: Facebook統合（2-3日）
1. Facebook Graph API設定
2. 投稿機能実装
3. Facebookページ対応

### フェーズ5: 統合UI・ワークフロー（3-4日）
1. SNS投稿管理UI実装
2. 一括投稿ワークフロー
3. 投稿スケジューリング
4. 統合テスト

## 🔐 認証・セキュリティ

### OAuth2.0フロー実装
- Instagram: Facebook Business Platform
- YouTube: Google OAuth 2.0
- LinkedIn: LinkedIn OAuth 2.0
- Facebook: Facebook Login

### API制限・レート制限対応
- リクエスト制限の監視
- 自動リトライ機能
- エラーハンドリング
