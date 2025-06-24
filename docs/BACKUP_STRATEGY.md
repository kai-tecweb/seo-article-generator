# バックアップ戦略ガイド

SEO記事生成システムの開発において、作業の安全性を確保するための包括的なバックアップ戦略を提供します。

## 🚨 緊急バックアップ（現在の状況を即座に保存）

VS Codeがクラッシュしそうな場合や、重要な変更を保存したい場合：

```bash
# プロジェクトディレクトリで実行
cd /home/iwasaki/work/seo-article-generator-nextjs-backup

# 即座にバックアップ
git add .
git commit -m "🆘 緊急バックアップ: $(date '+%Y-%m-%d %H:%M:%S')"
git push origin develop
```

## 🔄 自動バックアップシステム

### 1. 定期自動バックアップの設定

```bash
# 自動バックアップ設定スクリプトを実行
./scripts/setup-backup-cron.sh
```

**推奨設定:**
- **開発中**: 15分ごと
- **安定期**: 1時間ごと
- **保守期**: 2時間ごと

### 2. 手動バックアップの実行

```bash
# 手動でバックアップを実行
./scripts/auto-backup.sh
```

## 📁 バックアップ方法の比較

| 方法 | 頻度 | 自動化 | 容量効率 | 復旧の容易さ | 推奨度 |
|------|------|--------|----------|--------------|--------|
| Git自動コミット | 15分〜 | ✅ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 🥇 |
| VS Code自動保存 | 1秒 | ✅ | ⭐⭐⭐ | ⭐⭐⭐ | 🥈 |
| システムバックアップ | 1日 | ✅ | ⭐⭐ | ⭐⭐ | 🥉 |
| 手動ZIP保存 | 手動 | ❌ | ⭐ | ⭐ | ❌ |

## 🛠️ 設定済みツール

### A. 自動コミット・プッシュスクリプト
- **場所**: `scripts/auto-backup.sh`
- **機能**: 変更検出、自動コミット、プッシュ、古いブランチ削除
- **ログ**: `backup.log`

### B. Cron設定スクリプト
- **場所**: `scripts/setup-backup-cron.sh`
- **機能**: 定期実行の設定、設定削除、カスタム頻度設定

### C. VS Code拡張機能
- **Git Lens**: Git履歴の可視化
- **Auto Git**: 自動保存とコミット
- **GitHub Pull Requests**: GitHub連携

## 🔧 高度なバックアップ設定

### 1. 複数リモートリポジトリ設定

```bash
# BitBucketやGitLabを追加バックアップ先として設定
git remote add backup-gitlab https://gitlab.com/username/seo-article-generator.git
git remote add backup-bitbucket https://bitbucket.org/username/seo-article-generator.git

# 全リモートにプッシュ
git push --all origin
git push --all backup-gitlab
git push --all backup-bitbucket
```

### 2. Google Drive同期（追加保護）

```bash
# Google Drive同期フォルダにプロジェクトのミラーを作成
rsync -av --delete /home/iwasaki/work/seo-article-generator-nextjs-backup/ ~/GoogleDrive/Backup/seo-article-generator/
```

### 3. システムレベルバックアップ

```bash
# Cronで日次バックアップ
# crontab -e で以下を追加:
# 0 2 * * * tar -czf ~/backups/seo-project-$(date +\%Y\%m\%d).tar.gz /home/iwasaki/work/seo-article-generator-nextjs-backup/
```

## 📊 バックアップ監視

### バックアップ状況の確認

```bash
# 最新のバックアップ確認
git log --oneline -10

# リモートとの同期状況確認
git status

# バックアップブランチ一覧
git branch -r | grep auto-backup
```

### ログの確認

```bash
# バックアップログの確認
tail -n 50 backup.log

# リアルタイムログ監視
tail -f backup.log
```

## 🚑 緊急復旧手順

### 1. 最新バックアップからの復旧

```bash
# 最新のdevelopブランチから復旧
git checkout develop
git pull origin develop
git reset --hard origin/develop
```

### 2. 特定の日付からの復旧

```bash
# 特定日のバックアップブランチから復旧
git checkout auto-backup-20250624
git checkout -b recovery-20250624
git push origin recovery-20250624
```

### 3. 完全なクローンによる復旧

```bash
# 新しい場所に完全なクローンを作成
cd ~/work/
git clone https://github.com/username/seo-article-generator-nextjs-backup.git seo-recovery
cd seo-recovery
npm install
```

## ⚠️ 注意事項

### やってはいけないこと
- ❌ `.env`ファイルをコミットしない
- ❌ `node_modules`をコミットしない  
- ❌ 個人的なAPIキーをコミットしない
- ❌ 大容量ファイル（画像、動画）をコミットしない

### 推奨事項
- ✅ 毎日の開発前にバックアップ状況を確認
- ✅ 大きな変更前に手動バックアップを実行
- ✅ 定期的に古いバックアップブランチを整理
- ✅ 重要なマイルストーンではタグを作成

## 📞 緊急連絡先

バックアップやリカバリで問題が発生した場合：

1. **GitHub Issues**: プロジェクトのIssueページで報告
2. **ログ確認**: `backup.log`でエラー詳細を確認
3. **手動復旧**: 上記の緊急復旧手順を実行

---

💡 **重要**: このバックアップ戦略により、VS Codeクラッシュや システム障害から作業を確実に保護できます。開発中は15分間隔の自動バックアップを強く推奨します。
