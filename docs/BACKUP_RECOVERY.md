# バックアップ・復旧手順書

## 🔄 作業の中断・再開手順

### 作業終了時（バックアップ手順）

#### 1. 変更内容の保存
```bash
# 現在の変更状況を確認
git status

# 変更ファイルをステージング
git add .

# 作業内容をコミット
git commit -m "feat: [作業内容の簡潔な説明]"

# リモートリポジトリにプッシュ
git push origin [ブランチ名]
```

#### 2. 開発サーバーの停止
```bash
# Laravel Sail停止
cd backend
./vendor/bin/sail down

# Next.js開発サーバー停止（Ctrl+C）
# または別ターミナルで実行中の場合は該当プロセスを終了
```

#### 3. 作業状況の記録
```bash
# 進捗状況を更新
# docs/PROJECT_STATUS.md を編集し、完了した作業にチェック
# 次回作業予定を記録
```

#### 4. 環境情報の保存
```bash
# 現在の環境情報を記録
echo "=== 作業終了時の環境情報 ===" > .work_session.log
echo "日時: $(date)" >> .work_session.log
echo "ブランチ: $(git branch --show-current)" >> .work_session.log
echo "最新コミット: $(git log -1 --oneline)" >> .work_session.log
echo "Docker状態: $(docker ps -a --format 'table {{.Names}}\t{{.Status}}')" >> .work_session.log
```

---

### 作業開始時（復旧手順）

#### 1. 環境の準備
```bash
# プロジェクトディレクトリに移動
cd /home/iwasaki/work/make-seo

# 最新の変更を取得
git pull origin main

# 作業ブランチを確認・切り替え
git branch -a
git checkout [作業ブランチ名]
```

#### 2. 前回の作業状況確認
```bash
# 前回の作業ログを確認
cat .work_session.log

# 進捗状況を確認
cat docs/PROJECT_STATUS.md | grep -A 10 "現在の状況"
```

#### 3. 開発環境の起動
```bash
# Laravel Sail起動
cd backend
./vendor/bin/sail up -d

# 起動確認
./vendor/bin/sail ps

# データベース接続確認
./vendor/bin/sail artisan migrate:status
```

#### 4. フロントエンド起動
```bash
# Next.js開発サーバー起動
cd ../frontend
npm run dev
```

#### 5. 環境確認
```bash
# 各サービスの動作確認
curl -s http://localhost:80/api/user | jq .  # Laravel API
curl -s http://localhost:3000 | grep -o '<title>.*</title>'  # Next.js
```

---

## 🔧 緊急時の復旧手順

### 環境が壊れた場合

#### 1. 完全なリセット
```bash
# すべてのDockerコンテナ・イメージを削除
cd backend
./vendor/bin/sail down --volumes --remove-orphans
docker system prune -a

# 依存関係を再インストール
composer install
npm install

# 環境を再構築
./vendor/bin/sail up -d
./vendor/bin/sail artisan migrate:fresh
```

#### 2. データベースの復旧
```bash
# マイグレーション実行
./vendor/bin/sail artisan migrate

# シードデータ投入
./vendor/bin/sail artisan db:seed

# 動作確認
./vendor/bin/sail artisan tinker
```

### Git履歴から復旧

#### 1. 特定の時点に戻る
```bash
# コミット履歴を確認
git log --oneline -10

# 特定のコミットに戻る
git reset --hard [コミットハッシュ]

# 強制プッシュ（注意：チーム開発時は避ける）
git push --force-with-lease
```

#### 2. 作業ブランチの復旧
```bash
# 削除されたブランチを復旧
git reflog
git checkout -b [ブランチ名] [コミットハッシュ]
```

---

## 📱 クイックスタート手順

### 10秒で開発環境を起動
```bash
# ワンライナーで環境起動
cd /home/iwasaki/work/make-seo && git pull && cd backend && ./vendor/bin/sail up -d && cd ../frontend && npm run dev &
```

### VS Codeタスクで起動
1. VS Codeを開く
2. `Ctrl+Shift+P` → `Tasks: Run Task`
3. `Laravel: Start Sail` を選択
4. `Next.js: Start Dev Server` を選択

---

## 🔍 トラブルシューティング

### よくある問題と解決法

#### 1. ポートが使用中
```bash
# ポートを使用しているプロセスを確認
sudo lsof -i :80
sudo lsof -i :3000
sudo lsof -i :3306

# プロセスを終了
sudo kill -9 [PID]
```

#### 2. Docker容量不足
```bash
# Docker領域の確認
docker system df

# 不要なイメージ・コンテナを削除
docker system prune -a
```

#### 3. 依存関係の問題
```bash
# Composer依存関係の修復
cd backend
./vendor/bin/sail composer install --no-dev --optimize-autoloader

# npm依存関係の修復
cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### 4. 権限の問題
```bash
# Laravel権限修復
cd backend
./vendor/bin/sail exec laravel.test chown -R www-data:www-data /var/www/html/storage
./vendor/bin/sail exec laravel.test chown -R www-data:www-data /var/www/html/bootstrap/cache
```

---

## 📊 作業効率化のTips

### 1. エイリアスの設定
```bash
# ~/.bashrc または ~/.zshrc に追加
alias sail='./vendor/bin/sail'
alias art='./vendor/bin/sail artisan'
alias seo-start='cd /home/iwasaki/work/make-seo && cd backend && ./vendor/bin/sail up -d'
alias seo-stop='cd /home/iwasaki/work/make-seo && cd backend && ./vendor/bin/sail down'
```

### 2. 定期的なバックアップ
```bash
# 1日1回のバックアップをcronで設定
0 18 * * * cd /home/iwasaki/work/make-seo && git add . && git commit -m "daily backup: $(date)" && git push
```

### 3. 作業ログの自動化
```bash
# 作業開始時に自動でログを記録
function work_start() {
    echo "=== 作業開始: $(date) ===" >> .work_session.log
    echo "ブランチ: $(git branch --show-current)" >> .work_session.log
    seo-start
}
```

---

## 🎯 次回作業の準備

### 事前準備チェックリスト
- [ ] Git最新状態の確認
- [ ] 環境変数の確認
- [ ] 必要なAPIキーの準備
- [ ] 作業ブランチの準備
- [ ] 関連ドキュメントの確認

### 作業開始時のルーチン
1. 進捗状況の確認（`docs/PROJECT_STATUS.md`）
2. 環境の起動確認
3. 前回の作業内容の把握
4. 今回の作業目標の設定
5. 作業ブランチの作成

---

**最終更新**: 2025年7月5日
**重要**: このドキュメントは作業開始時に必ず確認してください
