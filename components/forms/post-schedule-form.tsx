'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Clock, Calendar, Save, Eye, Trash2, Edit } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  SchedulePostRequest, 
  ScheduledPostItem, 
  TimeSlot 
} from "@/types/schedule";

interface PostScheduleFormProps {
  initialTitle?: string;
  initialContent?: string;
  initialImageUrl?: string;
  onScheduled?: (scheduledPost: ScheduledPostItem) => void;
}

export default function PostScheduleForm({ 
  initialTitle = '', 
  initialContent = '', 
  initialImageUrl = '',
  onScheduled 
}: PostScheduleFormProps) {
  const [formData, setFormData] = useState<SchedulePostRequest>({
    title: initialTitle,
    content: initialContent,
    scheduledDate: '',
    scheduledTime: '09:00',
    platforms: ['wordpress'],
    status: 'pending',
    metaDescription: '',
    tags: [],
    categories: [],
    imageUrl: initialImageUrl
  });

  const [tagInput, setTagInput] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPostItem[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 時間スロットの生成
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of [0, 30]) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({
          hour,
          minute,
          label: timeString
        });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // 明日の日付をデフォルトとして設定 & ローカルストレージからの読み込み
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];
    
    // ローカルストレージから記事データを取得
    const pendingPost = localStorage.getItem('pendingSchedulePost');
    if (pendingPost) {
      try {
        const postData = JSON.parse(pendingPost);
        setFormData(prev => ({
          ...prev,
          scheduledDate: tomorrowString,
          title: postData.title || initialTitle,
          content: postData.content || initialContent,
          metaDescription: postData.metaDescription || '',
          imageUrl: postData.imageUrl || initialImageUrl
        }));
        
        // 使用後はクリア
        localStorage.removeItem('pendingSchedulePost');
      } catch (err) {
        console.error('記事データの読み込みに失敗:', err);
        setFormData(prev => ({ ...prev, scheduledDate: tomorrowString }));
      }
    } else {
      setFormData(prev => ({ ...prev, scheduledDate: tomorrowString }));
    }
  }, []);

  // 初期データの設定
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      title: initialTitle,
      content: initialContent,
      imageUrl: initialImageUrl
    }));
  }, [initialTitle, initialContent, initialImageUrl]);

  // 予約投稿一覧を取得
  useEffect(() => {
    loadScheduledPosts();
  }, []);

  const loadScheduledPosts = async () => {
    setIsLoadingPosts(true);
    try {
      const response = await fetch('/api/schedule-post');
      if (response.ok) {
        const posts = await response.json();
        setScheduledPosts(posts);
      }
    } catch (err) {
      console.error('予約投稿の取得に失敗:', err);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const handleInputChange = (field: keyof SchedulePostRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePlatformChange = (platform: 'wordpress' | 'x' | 'gbp', checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      platforms: checked 
        ? [...prev.platforms, platform]
        : prev.platforms.filter(p => p !== platform)
    }));
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleTagRemove = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || []
    }));
  };

  const handleSchedule = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('タイトルと記事内容は必須です');
      return;
    }

    if (!formData.scheduledDate || !formData.scheduledTime) {
      setError('投稿日時を設定してください');
      return;
    }

    if (formData.platforms.length === 0) {
      setError('少なくとも1つの投稿プラットフォームを選択してください');
      return;
    }

    setIsScheduling(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/schedule-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          scheduledDateTime: `${formData.scheduledDate}T${formData.scheduledTime}:00.000Z`
        }),
      });

      if (!response.ok) {
        throw new Error(`予約投稿の設定に失敗しました: ${response.status}`);
      }

      const result = await response.json();
      setSuccess('予約投稿を正常に設定しました！');
      
      // 予約投稿一覧を再読み込み
      await loadScheduledPosts();
      
      // コールバック実行
      if (onScheduled) {
        onScheduled(result);
      }

      // フォームリセット（オプション）
      // setFormData({ ...formData, title: '', content: '', metaDescription: '' });

    } catch (err) {
      setError(err instanceof Error ? err.message : '予約投稿の設定中にエラーが発生しました');
    } finally {
      setIsScheduling(false);
    }
  };

  const handleDeleteScheduledPost = async (postId: string) => {
    try {
      const response = await fetch(`/api/schedule-post/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('予約投稿を削除しました');
        await loadScheduledPosts();
      } else {
        throw new Error('削除に失敗しました');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '削除中にエラーが発生しました');
    }
  };

  const getPlatformBadgeColor = (platform: string) => {
    switch (platform) {
      case 'wordpress': return 'bg-blue-500';
      case 'x': return 'bg-black';
      case 'gbp': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'scheduled': return 'bg-blue-500';
      case 'published': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* 投稿スケジュール設定フォーム */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            投稿スケジュール設定
          </CardTitle>
          <CardDescription>
            記事の予約投稿を設定します。複数のプラットフォームに同時投稿可能です。
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 記事タイトル */}
          <div className="space-y-2">
            <Label htmlFor="title">記事タイトル *</Label>
            <Input
              id="title"
              placeholder="記事のタイトルを入力してください"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
          </div>

          {/* メタディスクリプション */}
          <div className="space-y-2">
            <Label htmlFor="metaDescription">メタディスクリプション</Label>
            <Textarea
              id="metaDescription"
              placeholder="検索結果に表示される説明文（160文字以内推奨）"
              value={formData.metaDescription}
              onChange={(e) => handleInputChange('metaDescription', e.target.value)}
              rows={2}
            />
          </div>

          {/* 投稿日時設定 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="date">投稿日 *</Label>
              <Input
                id="date"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">投稿時刻 *</Label>
              <Select 
                value={formData.scheduledTime} 
                onValueChange={(value) => handleInputChange('scheduledTime', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot.label} value={slot.label}>
                      {slot.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* プラットフォーム選択 */}
          <div className="space-y-2">
            <Label>投稿プラットフォーム *</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="wordpress"
                  checked={formData.platforms.includes('wordpress')}
                  onCheckedChange={(checked) => handlePlatformChange('wordpress', checked as boolean)}
                />
                <Label htmlFor="wordpress">WordPress</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="x"
                  checked={formData.platforms.includes('x')}
                  onCheckedChange={(checked) => handlePlatformChange('x', checked as boolean)}
                />
                <Label htmlFor="x">X (Twitter)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="gbp"
                  checked={formData.platforms.includes('gbp')}
                  onCheckedChange={(checked) => handlePlatformChange('gbp', checked as boolean)}
                />
                <Label htmlFor="gbp">Google Business Profile</Label>
              </div>
            </div>
          </div>

          {/* タグ設定 */}
          <div className="space-y-2">
            <Label htmlFor="tags">タグ</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="タグを入力してEnterで追加"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
              />
              <Button type="button" onClick={handleTagAdd} variant="outline">
                追加
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags?.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="cursor-pointer"
                  onClick={() => handleTagRemove(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
            </div>
          </div>

          {/* 記事内容プレビュー */}
          {formData.content && (
            <div className="space-y-2">
              <Label>記事内容プレビュー</Label>
              <div className="border rounded-lg p-4 bg-gray-50 max-h-40 overflow-y-auto">
                <div className="text-sm text-gray-700">
                  {formData.content.slice(0, 200)}...
                </div>
              </div>
            </div>
          )}

          {/* エラー・成功メッセージ */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription className="text-green-600">{success}</AlertDescription>
            </Alert>
          )}

          {/* 予約投稿ボタン */}
          <Button
            onClick={handleSchedule}
            disabled={isScheduling || !formData.title.trim() || !formData.content.trim()}
            className="w-full"
            size="lg"
          >
            {isScheduling ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                予約投稿を設定中...
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4 mr-2" />
                予約投稿を設定
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* 予約投稿一覧 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            予約投稿一覧
          </CardTitle>
          <CardDescription>
            設定済みの予約投稿を確認・管理できます
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLoadingPosts ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : scheduledPosts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              予約投稿がありません
            </div>
          ) : (
            <div className="space-y-4">
              {scheduledPosts.map((post) => (
                <div key={post.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{post.title}</h3>
                      <p className="text-sm text-gray-600">
                        投稿予定: {new Date(post.scheduledDateTime).toLocaleString('ja-JP')}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Badge className={`${getStatusBadgeColor(post.status)} text-white`}>
                        {post.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {post.platforms.map((platform) => (
                      <Badge 
                        key={platform} 
                        className={`${getPlatformBadgeColor(platform)} text-white`}
                      >
                        {platform}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      プレビュー
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      編集
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeleteScheduledPost(post.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      削除
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
