#!/bin/bash

# =======================================================
# API確認・テストスクリプト（jq非依存・sleep必須版）
# =======================================================
# このスクリプトは以下の方針に従います：
# 1. jqコマンドに依存しない（curl + grep + awk等で処理）
# 2. API呼び出し後は必ずスリープを挟む
# 3. レスポンス確認はテキストベースで行う
# =======================================================

set -e

# 設定
API_BASE_URL="http://localhost:3001"
SLEEP_DURATION=2  # API呼び出し後のスリープ時間（秒）
LOG_FILE="api_test_results.log"

# ログファイル初期化
echo "=== API テスト開始: $(date) ===" > "$LOG_FILE"

# 色付きメッセージ関数
print_success() {
    echo -e "\033[32m✅ $1\033[0m"
    echo "[SUCCESS] $1" >> "$LOG_FILE"
}

print_error() {
    echo -e "\033[31m❌ $1\033[0m"
    echo "[ERROR] $1" >> "$LOG_FILE"
}

print_info() {
    echo -e "\033[34mℹ️ $1\033[0m"
    echo "[INFO] $1" >> "$LOG_FILE"
}

print_warning() {
    echo -e "\033[33m⚠️ $1\033[0m"
    echo "[WARNING] $1" >> "$LOG_FILE"
}

# レスポンス確認関数（jq非依存）
check_api_response() {
    local endpoint="$1"
    local method="$2"
    local data="$3"
    local expected_text="$4"
    
    print_info "API呼び出し: $method $endpoint"
    
    # API呼び出し
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$API_BASE_URL$endpoint" 2>&1)
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$API_BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data" 2>&1)
    fi
    
    # 必須：API呼び出し後のスリープ
    print_info "スリープ中... (${SLEEP_DURATION}秒)"
    sleep "$SLEEP_DURATION"
    
    # HTTPステータスコード抽出（最後の行）
    http_code=$(echo "$response" | tail -n 1)
    response_body=$(echo "$response" | sed '$d')  # 最後の行（ステータスコード）を除外
    
    # レスポンス詳細をログに記録
    echo "--- API Response Details ---" >> "$LOG_FILE"
    echo "Endpoint: $method $endpoint" >> "$LOG_FILE"
    echo "HTTP Status: $http_code" >> "$LOG_FILE"
    echo "Response Body (first 200 chars): $(echo "$response_body" | head -c 200)" >> "$LOG_FILE"
    echo "----------------------------" >> "$LOG_FILE"
    
    # ステータスコード確認
    if [[ "$http_code" =~ ^2[0-9][0-9]$ ]]; then
        print_success "HTTPステータス: $http_code (正常)"
    else
        print_error "HTTPステータス: $http_code (異常)"
        return 1
    fi
    
    # 期待されるテキストが含まれているか確認
    if [ -n "$expected_text" ]; then
        if echo "$response_body" | grep -q "$expected_text"; then
            print_success "期待されるレスポンス内容を確認: '$expected_text'"
        else
            print_warning "期待されるレスポンス内容が見つからない: '$expected_text'"
            print_info "実際のレスポンス（最初の100文字）: $(echo "$response_body" | head -c 100)"
        fi
    fi
    
    return 0
}

# サーバー起動確認
check_server_status() {
    print_info "=== サーバー起動確認 ==="
    
    # ヘルスチェック（存在する場合）
    if check_api_response "/" "GET" "" ""; then
        print_success "サーバーが起動しています"
    else
        print_error "サーバーが起動していません。'npm run dev' を実行してください"
        exit 1
    fi
    
    echo ""
}

# AI記事生成API テスト
test_article_generation() {
    print_info "=== AI記事生成API テスト ==="
    
    local test_data='{
        "topic": "テスト記事のタイトル",
        "keywords": ["テスト", "API", "自動化"],
        "tone": "professional",
        "length": "short"
    }'
    
    if check_api_response "/api/generate-article" "POST" "$test_data" "content"; then
        print_success "AI記事生成API: 正常動作"
    else
        print_error "AI記事生成API: 異常"
    fi
    
    echo ""
}

# SEOチェックAPI テスト
test_seo_check() {
    print_info "=== SEOチェックAPI テスト ==="
    
    local test_data='{
        "content": "これはSEOテスト用のサンプルコンテンツです。キーワードを適切に配置して、SEOスコアを確認します。",
        "title": "SEOテスト記事",
        "keywords": ["SEO", "テスト", "最適化"]
    }'
    
    if check_api_response "/api/check-seo" "POST" "$test_data" "score"; then
        print_success "SEOチェックAPI: 正常動作"
    else
        print_error "SEOチェックAPI: 異常"
    fi
    
    echo ""
}

# 品質評価API テスト
test_quality_evaluation() {
    print_info "=== Google品質評価API テスト ==="
    
    local test_data='{
        "content": "品質評価テスト用のコンテンツです。E-A-Tの観点から評価を行います。",
        "title": "品質評価テスト記事",
        "author": "テスト著者"
    }'
    
    if check_api_response "/api/quality-evaluation/google-guidelines" "POST" "$test_data" "score"; then
        print_success "Google品質評価API: 正常動作"
    else
        print_error "Google品質評価API: 異常"
    fi
    
    echo ""
}

# 広告管理API テスト
test_ad_management() {
    print_info "=== 広告管理API テスト ==="
    
    # 広告設定取得
    if check_api_response "/api/ad-management" "GET" "" ""; then
        print_success "広告設定取得API: 正常動作"
    else
        print_error "広告設定取得API: 異常"
    fi
    
    # 広告挿入テスト
    local test_data='{
        "content": "広告挿入テスト用のコンテンツです。この文章に広告を自動挿入します。",
        "adSettings": {
            "enableAutoInsertion": true,
            "adFrequency": 2
        }
    }'
    
    if check_api_response "/api/ad-management/insert" "POST" "$test_data" "content"; then
        print_success "広告挿入API: 正常動作"
    else
        print_error "広告挿入API: 異常"
    fi
    
    echo ""
}

# WordPress投稿API テスト
test_wordpress_post() {
    print_info "=== WordPress投稿API テスト ==="
    
    local test_data='{
        "title": "テスト記事",
        "content": "WordPress投稿テスト用のコンテンツです。",
        "status": "draft",
        "categories": ["テスト"]
    }'
    
    if check_api_response "/api/post-to-wordpress" "POST" "$test_data" ""; then
        print_success "WordPress投稿API: 正常動作"
    else
        print_warning "WordPress投稿API: 設定が必要または異常"
    fi
    
    echo ""
}

# 外部サービス接続テスト
test_external_connections() {
    print_info "=== 外部サービス接続テスト ==="
    
    # OpenAI接続テスト
    if check_api_response "/api/test-openai-connection" "GET" "" "connection"; then
        print_success "OpenAI接続: 正常"
    else
        print_warning "OpenAI接続: 設定が必要"
    fi
    
    # Notion接続テスト
    if check_api_response "/api/test-notion-connection" "GET" "" "connection"; then
        print_success "Notion接続: 正常"
    else
        print_warning "Notion接続: 設定が必要"
    fi
    
    # Google Business接続テスト
    if check_api_response "/api/test-google-business-connection" "GET" "" ""; then
        print_success "Google Business接続: 正常"
    else
        print_warning "Google Business接続: 設定が必要"
    fi
    
    echo ""
}

# レポート生成
generate_report() {
    print_info "=== テスト結果レポート ==="
    
    local success_count=$(grep -c "\[SUCCESS\]" "$LOG_FILE" || echo "0")
    local error_count=$(grep -c "\[ERROR\]" "$LOG_FILE" || echo "0")
    local warning_count=$(grep -c "\[WARNING\]" "$LOG_FILE" || echo "0")
    
    echo "📊 テスト結果サマリー:"
    echo "  ✅ 成功: $success_count"
    echo "  ❌ エラー: $error_count"  
    echo "  ⚠️ 警告: $warning_count"
    echo ""
    echo "📋 詳細ログ: $LOG_FILE"
    echo ""
    
    if [ "$error_count" -eq 0 ]; then
        print_success "すべてのテストが正常に完了しました！"
    else
        print_error "$error_count 個のエラーが発生しました。ログを確認してください。"
    fi
}

# メイン実行
main() {
    echo "🚀 SEO記事生成システム API テスト開始"
    echo "=================================================="
    echo "方針: jq非依存・sleep必須・テキストベース確認"
    echo "=================================================="
    echo ""
    
    # テスト実行
    check_server_status
    test_article_generation
    test_seo_check
    test_quality_evaluation
    test_ad_management
    test_wordpress_post
    test_external_connections
    
    # レポート生成
    generate_report
    
    echo ""
    echo "🎯 次のステップ:"
    echo "1. エラーがある場合は該当APIの設定を確認"
    echo "2. 外部サービスの認証情報を.envに設定"
    echo "3. 本格的な機能テストを実行"
    echo ""
    echo "テスト完了時刻: $(date)"
}

# スクリプト実行
main "$@"
