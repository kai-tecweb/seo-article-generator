#!/bin/bash

# Cron設定用スクリプト
# 定期的な自動バックアップを設定します

PROJECT_DIR="/home/iwasaki/work/seo-article-generator-nextjs-backup"
SCRIPT_PATH="$PROJECT_DIR/scripts/auto-backup.sh"

echo "=== SEO記事生成システム 自動バックアップ設定 ==="
echo ""

# 現在のcron設定を表示
echo "現在のcron設定:"
crontab -l 2>/dev/null || echo "cron設定はありません"
echo ""

# 設定オプションを表示
echo "バックアップ頻度を選択してください:"
echo "1) 15分ごと（開発中推奨）"
echo "2) 30分ごと"
echo "3) 1時間ごと"
echo "4) 2時間ごと"
echo "5) カスタム設定"
echo "6) 設定を削除"
echo "7) 終了"
echo ""

read -p "選択してください (1-7): " choice

case $choice in
    1)
        cron_setting="*/15 * * * * $SCRIPT_PATH >/dev/null 2>&1"
        echo "15分ごとのバックアップを設定します..."
        ;;
    2)
        cron_setting="*/30 * * * * $SCRIPT_PATH >/dev/null 2>&1"
        echo "30分ごとのバックアップを設定します..."
        ;;
    3)
        cron_setting="0 * * * * $SCRIPT_PATH >/dev/null 2>&1"
        echo "1時間ごとのバックアップを設定します..."
        ;;
    4)
        cron_setting="0 */2 * * * $SCRIPT_PATH >/dev/null 2>&1"
        echo "2時間ごとのバックアップを設定します..."
        ;;
    5)
        echo "カスタムcron設定を入力してください（例: 0 */4 * * *）:"
        read -p "cron設定: " custom_cron
        cron_setting="$custom_cron $SCRIPT_PATH >/dev/null 2>&1"
        echo "カスタムバックアップを設定します..."
        ;;
    6)
        echo "自動バックアップ設定を削除します..."
        (crontab -l 2>/dev/null | grep -v "$SCRIPT_PATH") | crontab -
        echo "設定を削除しました。"
        exit 0
        ;;
    7)
        echo "設定を終了します。"
        exit 0
        ;;
    *)
        echo "無効な選択です。"
        exit 1
        ;;
esac

# 既存の設定を削除して新しい設定を追加
(crontab -l 2>/dev/null | grep -v "$SCRIPT_PATH"; echo "$cron_setting") | crontab -

echo "設定が完了しました！"
echo "設定内容: $cron_setting"
echo ""
echo "現在のcron設定:"
crontab -l
echo ""
echo "注意事項:"
echo "- バックアップログは $PROJECT_DIR/backup.log に記録されます"
echo "- 古いバックアップブランチは7日後に自動削除されます"
echo "- 手動でバックアップする場合: $SCRIPT_PATH"
echo ""
