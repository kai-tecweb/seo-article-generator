'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Settings, Plus } from "lucide-react";
import TemplateManager from "@/components/forms/template-manager";
import TemplateCreateForm from "@/components/forms/template-create-form";
import TemplateBasedGenerationForm from "@/components/forms/template-based-generation-form";
import { ArticleTemplate, TemplateBasedGenerationResponse } from "@/types/template";

export default function TemplatesPage() {
  const [activeTab, setActiveTab] = useState('generate');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ArticleTemplate | null>(null);

  // テンプレート作成完了時の処理
  const handleTemplateCreated = (template: ArticleTemplate) => {
    setShowCreateForm(false);
    setEditingTemplate(null);
    setActiveTab('manage');
    // 一覧を更新（将来的にはrefreshを実装）
  };

  // テンプレート作成フォーム表示
  const handleShowCreateForm = () => {
    setEditingTemplate(null);
    setShowCreateForm(true);
    setActiveTab('create');
  };

  // 記事生成完了時の処理
  const handleGenerated = (result: TemplateBasedGenerationResponse) => {
    console.log('記事生成完了:', result);
    // 必要に応じて他の画面への遷移などを実装
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">テンプレート機能</h1>
          <p className="mt-2 text-gray-600">
            記事生成テンプレートの作成・管理・使用ができます
          </p>
        </div>

        {/* 機能概要カード */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" 
                onClick={() => setActiveTab('generate')}>
            <CardHeader className="text-center">
              <FileText className="w-12 h-12 mx-auto text-blue-500 mb-2" />
              <CardTitle>記事生成</CardTitle>
              <CardDescription>
                テンプレートを使用してSEO最適化された記事を生成
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setActiveTab('manage')}>
            <CardHeader className="text-center">
              <Settings className="w-12 h-12 mx-auto text-green-500 mb-2" />
              <CardTitle>テンプレート管理</CardTitle>
              <CardDescription>
                作成済みテンプレートの一覧・編集・削除
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={handleShowCreateForm}>
            <CardHeader className="text-center">
              <Plus className="w-12 h-12 mx-auto text-purple-500 mb-2" />
              <CardTitle>新規作成</CardTitle>
              <CardDescription>
                新しい記事テンプレートを作成
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* メインコンテンツ */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              記事生成
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              テンプレート管理
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              新規作成
            </TabsTrigger>
          </TabsList>

          {/* 記事生成タブ */}
          <TabsContent value="generate">
            <Card>
              <CardHeader>
                <CardTitle>テンプレートベース記事生成</CardTitle>
                <CardDescription>
                  作成済みのテンプレートを使用して記事を生成します
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TemplateBasedGenerationForm onGenerated={handleGenerated} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* テンプレート管理タブ */}
          <TabsContent value="manage">
            <Card>
              <CardHeader>
                <CardTitle>テンプレート管理</CardTitle>
                <CardDescription>
                  作成済みテンプレートの一覧・検索・編集・削除ができます
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TemplateManager 
                  mode="manage"
                  onTemplateCreate={handleShowCreateForm}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* 新規作成タブ */}
          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingTemplate ? 'テンプレート編集' : '新しいテンプレート作成'}
                </CardTitle>
                <CardDescription>
                  記事生成用のテンプレートを作成・編集します
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TemplateCreateForm
                  onTemplateCreated={handleTemplateCreated}
                  onCancel={() => {
                    setShowCreateForm(false);
                    setEditingTemplate(null);
                    setActiveTab('manage');
                  }}
                  editingTemplate={editingTemplate}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 使い方ガイド */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>テンプレート機能の使い方</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-600">1. テンプレート作成</h4>
                <p className="text-sm text-gray-600">
                  記事の構造やSEO設定、使用する変数を定義してテンプレートを作成します。
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-green-600">2. 変数設定</h4>
                <p className="text-sm text-gray-600">
                  テンプレートで使用する変数（トピック、キーワードなど）を設定します。
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-600">3. 記事生成</h4>
                <p className="text-sm text-gray-600">
                  テンプレートを選択し、変数を入力することで高品質な記事を自動生成できます。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
