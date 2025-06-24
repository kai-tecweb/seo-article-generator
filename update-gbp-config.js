// Google Business Profile設定更新スクリプト

const fs = require('fs');
const path = require('path');

function updateGoogleBusinessConfig(apiKey, locationId) {
  const envPath = path.join(__dirname, '.env.local');
  
  try {
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // APIキーを更新
    envContent = envContent.replace(
      /GOOGLE_BUSINESS_API_KEY=.*/,
      `GOOGLE_BUSINESS_API_KEY=${apiKey}`
    );
    
    // ロケーションIDを更新
    envContent = envContent.replace(
      /GOOGLE_BUSINESS_LOCATION_ID=.*/,
      `GOOGLE_BUSINESS_LOCATION_ID=${locationId}`
    );
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Google Business Profile設定が更新されました');
    console.log(`📍 APIキー: ${apiKey.substring(0, 10)}...`);
    console.log(`📍 ロケーションID: ${locationId}`);
    
  } catch (error) {
    console.error('❌ 設定更新エラー:', error.message);
  }
}

// 使用例（実際のAPIキーとロケーションIDを入力してください）
console.log('Google Business Profile API設定更新ツール');
console.log('');
console.log('使用方法:');
console.log('const apiKey = "AIza..."; // 実際のAPIキー');
console.log('const locationId = "12345..."; // 実際のロケーションID');
console.log('updateGoogleBusinessConfig(apiKey, locationId);');
console.log('');
console.log('現在はデモモードです。');

// デモ用の値を表示
console.log('現在の設定:');
console.log('- APIキー: demo_google_api_key_test');
console.log('- ロケーションID: demo_location_id');

module.exports = { updateGoogleBusinessConfig };
