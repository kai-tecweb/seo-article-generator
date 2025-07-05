# 🚀 クイックスタートガイド

## 作業再開時の3分チェックリスト

### 1. 環境起動（30秒）
```bash
cd /home/iwasaki/work/make-seo
# Laravel起動
cd backend && ./vendor/bin/sail up -d
# Next.js起動
cd ../frontend && npm run dev
```

### 2. 動作確認（30秒）
```bash
# Laravel API確認
curl http://localhost:80/api/v1/health

# Next.js確認  
curl http://localhost:3000
```

### 3. 作業状況確認（30秒）
```bash
# Git状況確認
git status
git log --oneline -5

# 前回の作業内容確認
cat WORK_LOG.md
```

### 4. 作業開始（30秒）
```bash
# 作業ブランチ作成
git checkout -b feature/next-task

# 作業開始ログ
echo "$(date): 作業開始 - [作業内容]" >> WORK_LOG.md
```

---

## 作業終了時の3分チェックリスト

### 1. 変更保存（1分）
```bash
# 変更確認
git status

# ステージング
git add .

# コミット（複数行形式）
git commit -m "feat: [作業内容]" \
           -m "- 変更内容1" \
           -m "- 変更内容2"
```

### 2. プッシュ（30秒）
```bash
git push origin feature/your-branch
```

### 3. 環境停止（30秒）
```bash
# Laravel停止
cd backend && ./vendor/bin/sail down

# Next.js停止（Ctrl+C）
```

### 4. 作業ログ更新（1分）
```bash
# 作業完了ログ
echo "$(date): 作業完了 - [作業内容]" >> WORK_LOG.md

# 進捗更新
# docs/PROJECT_STATUS.md を更新
```

---

## 🔧 よく使うコマンド

### Laravel
```bash
# マイグレーション
./vendor/bin/sail artisan migrate

# モデル作成
./vendor/bin/sail artisan make:model Article -m

# コントローラー作成
./vendor/bin/sail artisan make:controller Api/ArticleController --api
```

### Next.js
```bash
# コンポーネント追加
npx shadcn@latest add button

# ビルド
npm run build

# 型チェック
npm run type-check
```

### Git
```bash
# ブランチ作成
git checkout -b feature/new-feature

# 状況確認
git status

# ログ確認
git log --oneline -5
```

---

## 📱 アクセス先

| サービス | URL |
|---------|-----|
| Laravel API | http://localhost:80 |
| Next.js | http://localhost:3000 |
| Telescope | http://localhost:80/telescope |
| API Docs | http://localhost:80/api/documentation |

---

## 🚨 トラブルシューティング

### Docker起動できない
```bash
# コンテナ状況確認
docker ps -a

# 強制再起動
cd backend && ./vendor/bin/sail down && ./vendor/bin/sail up -d
```

### 依存関係エラー
```bash
# Laravel
cd backend && composer install

# Next.js
cd frontend && npm install
```

### データベース接続エラー
```bash
# マイグレーション確認
./vendor/bin/sail artisan migrate:status

# 権限確認
./vendor/bin/sail exec mysql mysql -u root -ppassword -e "SHOW GRANTS FOR 'sail'@'%';"
```

---

**最終更新**: 2025年7月5日
