#!/bin/bash

# SEO記事生成システム 自動バックアップスクリプト
# 作業中の変更を定期的にGitHubにバックアップします

# 設定
PROJECT_DIR="/home/iwasaki/work/seo-article-generator-nextjs-backup"
BACKUP_BRANCH="auto-backup-$(date +%Y%m%d)"
MAIN_BRANCH="develop"

# ログファイル
LOG_FILE="$PROJECT_DIR/backup.log"

# 関数: ログ出力
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# 関数: エラーハンドリング
handle_error() {
    log "ERROR: $1"
    exit 1
}

log "=== 自動バックアップ開始 ==="

# プロジェクトディレクトリに移動
cd "$PROJECT_DIR" || handle_error "プロジェクトディレクトリに移動できません"

# Git状態確認
if ! git status &>/dev/null; then
    handle_error "Gitリポジトリが見つかりません"
fi

# 変更があるかチェック
if git diff --quiet && git diff --cached --quiet && [ -z "$(git ls-files --others --exclude-standard)" ]; then
    log "変更がないため、バックアップをスキップします"
    exit 0
fi

log "変更を検出しました。バックアップを開始します..."

# 現在のブランチ名を取得
CURRENT_BRANCH=$(git branch --show-current)
log "現在のブランチ: $CURRENT_BRANCH"

# すべての変更をステージング
git add . || handle_error "git add に失敗しました"

# WIP（Work In Progress）コミットを作成
COMMIT_MESSAGE="🔄 WIP: 自動バックアップ $(date '+%Y-%m-%d %H:%M:%S')"
git commit -m "$COMMIT_MESSAGE" || handle_error "コミットに失敗しました"

# メインブランチにプッシュ
git push origin "$CURRENT_BRANCH" || handle_error "プッシュに失敗しました"

# バックアップブランチを作成（日付ベース）
git checkout -b "$BACKUP_BRANCH" || log "WARNING: バックアップブランチの作成に失敗しました"
git push origin "$BACKUP_BRANCH" || log "WARNING: バックアップブランチのプッシュに失敗しました"

# 元のブランチに戻る
git checkout "$CURRENT_BRANCH" || handle_error "元のブランチに戻れませんでした"

log "バックアップが完了しました: $BACKUP_BRANCH"
log "=== 自動バックアップ終了 ==="

# 古いバックアップブランチを削除（7日以上前）
log "古いバックアップブランチのクリーンアップを開始..."
SEVEN_DAYS_AGO=$(date -d '7 days ago' +%Y%m%d)

# リモートブランチ一覧を取得して古いものを削除
git ls-remote --heads origin | grep "auto-backup-" | while read sha branch; do
    branch_name=$(basename "$branch")
    branch_date=$(echo "$branch_name" | sed 's/auto-backup-//')
    
    if [[ "$branch_date" =~ ^[0-9]{8}$ ]] && [ "$branch_date" -lt "$SEVEN_DAYS_AGO" ]; then
        log "古いバックアップブランチを削除: $branch_name"
        git push origin --delete "$branch_name" 2>/dev/null || log "WARNING: ブランチ削除に失敗: $branch_name"
    fi
done

log "クリーンアップ完了"
