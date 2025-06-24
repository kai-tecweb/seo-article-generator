#!/bin/bash

# SEO記事生成システム ヘルスチェックスクリプト
# プロジェクトの全体的な健全性を確認します

# 色付きログ関数
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# ヘルスチェック結果の集計
total_checks=0
passed_checks=0
failed_checks=0
warning_checks=0

# チェック関数
check_result() {
    total_checks=$((total_checks + 1))
    if [ $1 -eq 0 ]; then
        passed_checks=$((passed_checks + 1))
        log_success "$2"
    else
        failed_checks=$((failed_checks + 1))
        log_error "$2"
    fi
}

check_warning() {
    total_checks=$((total_checks + 1))
    warning_checks=$((warning_checks + 1))
    log_warning "$1"
}

# プロジェクトディレクトリ確認
PROJECT_DIR="/home/iwasaki/work/seo-article-generator-nextjs-backup"
cd "$PROJECT_DIR" || {
    log_error "プロジェクトディレクトリが見つかりません: $PROJECT_DIR"
    exit 1
}

echo "🔍 SEO記事生成システム ヘルスチェック開始"
echo "📅 実行日時: $(date '+%Y-%m-%d %H:%M:%S')"
echo "📂 プロジェクトディレクトリ: $PROJECT_DIR"
echo "----------------------------------------"

# 1. Git状態チェック
echo "🔧 Git状態チェック"
git status --porcelain > /dev/null 2>&1
check_result $? "Gitリポジトリが正常に認識されています"

# 未コミットの変更確認
uncommitted_files=$(git status --porcelain | wc -l)
if [ "$uncommitted_files" -gt 0 ]; then
    check_warning "未コミットの変更が $uncommitted_files ファイルあります"
    git status --porcelain | head -5
else
    log_success "すべての変更がコミット済みです"
fi

# リモートとの同期状況
git fetch origin > /dev/null 2>&1
behind=$(git rev-list HEAD..origin/develop --count 2>/dev/null)
ahead=$(git rev-list origin/develop..HEAD --count 2>/dev/null)

if [ "$behind" -gt 0 ]; then
    check_warning "リモートより $behind コミット遅れています"
elif [ "$ahead" -gt 0 ]; then
    log_info "リモートより $ahead コミット進んでいます"
else
    log_success "リモートと同期しています"
fi

echo ""

# 2. Node.js環境チェック
echo "🟢 Node.js環境チェック"
node --version > /dev/null 2>&1
check_result $? "Node.js がインストールされています ($(node --version))"

pnpm --version > /dev/null 2>&1
check_result $? "pnpm がインストールされています ($(pnpm --version))"

# package.jsonの存在確認
[ -f "package.json" ]
check_result $? "package.json が存在します"

# node_modulesの確認
[ -d "node_modules" ]
check_result $? "node_modules ディレクトリが存在します"

# package-lock.jsonとpnpm-lock.yamlの一致確認
if [ -f "pnpm-lock.yaml" ]; then
    log_success "pnpm-lock.yaml が存在します"
else
    check_warning "pnpm-lock.yaml が見つかりません（pnpm install を実行してください）"
fi

echo ""

# 3. TypeScript型チェック
echo "🔷 TypeScript型チェック"
npx tsc --noEmit > /dev/null 2>&1
check_result $? "TypeScriptの型エラーがありません"

echo ""

# 4. ESLintチェック
echo "🔍 ESLintチェック"
pnpm lint > /dev/null 2>&1
check_result $? "ESLintエラーがありません"

echo ""

# 5. 環境変数チェック
echo "🌍 環境変数チェック"
[ -f ".env.local" ]
check_result $? ".env.local ファイルが存在します"

# 重要な環境変数の確認
source .env.local 2>/dev/null
if [ -n "$OPENAI_API_KEY" ]; then
    log_success "OPENAI_API_KEY が設定されています"
else
    check_warning "OPENAI_API_KEY が設定されていません"
fi

if [ -n "$NOTION_API_KEY" ]; then
    log_success "NOTION_API_KEY が設定されています"
else
    check_warning "NOTION_API_KEY が設定されていません"
fi

echo ""

# 6. 重要ファイルの存在チェック
echo "📄 重要ファイルチェック"
important_files=(
    "next.config.mjs"
    "tailwind.config.ts" 
    "tsconfig.json"
    ".eslintrc.json"
    "jest.config.js"
    "playwright.config.ts"
    "components.json"
)

for file in "${important_files[@]}"; do
    [ -f "$file" ]
    check_result $? "$file が存在します"
done

echo ""

# 7. バックアップシステムチェック
echo "💾 バックアップシステムチェック"

# 自動バックアップスクリプトの確認
[ -f "scripts/auto-backup.sh" ] && [ -x "scripts/auto-backup.sh" ]
check_result $? "自動バックアップスクリプトが実行可能です"

# Cron設定の確認
crontab -l 2>/dev/null | grep -q "auto-backup.sh"
check_result $? "Cron自動バックアップが設定されています"

# バックアップログの確認
if [ -f "backup.log" ]; then
    last_backup=$(tail -1 backup.log | grep -o '\[.*\]' | tr -d '[]')
    if [ -n "$last_backup" ]; then
        log_success "最新バックアップ: $last_backup"
    else
        check_warning "バックアップログの形式が異常です"
    fi
else
    check_warning "backup.log が見つかりません"
fi

echo ""

# 8. テストの実行
echo "🧪 テスト実行チェック"

# API テストの実行
pnpm test:api > /dev/null 2>&1
check_result $? "APIテストが通過しています"

# 型チェックの再実行（より詳細）
pnpm type-check > /dev/null 2>&1
check_result $? "型チェックが通過しています"

echo ""

# 9. ディスク使用量チェック
echo "💿 ディスク使用量チェック"
project_size=$(du -sh . 2>/dev/null | cut -f1)
log_info "プロジェクトサイズ: $project_size"

node_modules_size=$(du -sh node_modules 2>/dev/null | cut -f1)
log_info "node_modules サイズ: $node_modules_size"

# .nextディレクトリのサイズ
if [ -d ".next" ]; then
    next_size=$(du -sh .next 2>/dev/null | cut -f1)
    log_info ".next サイズ: $next_size"
fi

echo ""

# 10. セキュリティチェック
echo "🔒 セキュリティチェック"

# .env.localがGitignoreされているかチェック
git check-ignore .env.local > /dev/null 2>&1
check_result $? ".env.local が適切にGitignoreされています"

# node_modulesがGitignoreされているかチェック
git check-ignore node_modules > /dev/null 2>&1
check_result $? "node_modules が適切にGitignoreされています"

echo ""

# 11. 依存関係チェック
echo "📦 依存関係チェック"

# outdated パッケージのチェック
outdated_count=$(pnpm outdated 2>/dev/null | grep -c "│" || echo "0")
if [ "$outdated_count" -gt 1 ]; then # ヘッダー行を除く
    check_warning "$((outdated_count - 1)) 個のパッケージが更新可能です"
else
    log_success "すべてのパッケージが最新です"
fi

echo ""

# 12. 最終結果サマリー
echo "========================================="
echo "📊 ヘルスチェック結果サマリー"
echo "========================================="

# 成功率の計算
if [ "$total_checks" -gt 0 ]; then
    success_rate=$((passed_checks * 100 / total_checks))
    echo "✅ 成功: $passed_checks/$total_checks ($success_rate%)"
else
    success_rate=0
    echo "✅ 成功: 0/0 (0%)"
fi

if [ "$failed_checks" -gt 0 ]; then
    echo "❌ 失敗: $failed_checks/$total_checks"
fi

if [ "$warning_checks" -gt 0 ]; then
    echo "⚠️  警告: $warning_checks/$total_checks"
fi

echo ""

# 総合判定
if [ "$failed_checks" -eq 0 ] && [ "$warning_checks" -eq 0 ]; then
    log_success "🎉 すべてのヘルスチェックが正常です！開発を安全に続行できます。"
    exit 0
elif [ "$failed_checks" -eq 0 ]; then
    log_warning "⚠️  警告がありますが、開発続行可能です。改善を推奨します。"
    exit 1
else
    log_error "💥 重要な問題が検出されました。修正してから開発を続行してください。"
    echo ""
    echo "🔧 推奨修正コマンド:"
    echo "   pnpm install          # 依存関係の再インストール"
    echo "   pnpm lint --fix       # ESLintエラーの自動修正"
    echo "   git add . && git commit -m \"🔧 ヘルスチェック修正\"  # 変更の保存"
    exit 2
fi
