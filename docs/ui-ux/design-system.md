# デザインシステム・スタイルガイド

## 基本デザインコンセプト

### ブログサイト（静的HTML生成）
- **デザインコンセプト**: 美しい技術ブログサイト（参考LPフォルダのデザイン）
- **生成方式**: 完全な静的HTMLファイル生成（.html形式）
- **テンプレートエンジン**: Laravel Blade（HTMLテンプレート）+ React（コンポーネント）

### 管理画面（Next.js）
- **デザインコンセプト**: ダッシュボード型の管理画面
- **サイドバーレイアウト**: 左サイドにナビゲーションメニューを配置

## カラーパレット

### 淡い色調システム

```css
/* globals.css - カスタムカラー定義 */
:root {
  --soft-bg: 210 20% 98%;
  --soft-card: 0 0% 100% / 0.7;
  --soft-border: 215 20% 85% / 0.5;
  --soft-hover: 0 0% 100% / 0.8;
  --soft-shadow: 0 0% 0% / 0.1;
}
```

### ブログサイト（静的HTML）
- **背景色**: `bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20`
- **カード背景**: `bg-white/95`, `bg-card/90`
- **アクセント色**: `bg-gradient-to-r from-blue-600 to-purple-600`
- **テキスト色**: `text-gray-700`, `text-slate-800`

### 管理画面（Next.js）
- **背景色**: `bg-slate-50/30`, `bg-gray-50/40`
- **カード背景**: `bg-white/70`, `bg-card/60`
- **アクセント色**: `bg-blue-500/80 hover:bg-blue-600/90`

### 詳細カラー定義

```typescript
// デザイントークン
const colors = {
  // 背景色（淡い色調）
  background: {
    primary: 'bg-slate-50/30',
    secondary: 'bg-gray-50/40',
    gradient: 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20',
  },
  
  // カード背景
  card: {
    primary: 'bg-white/70',
    secondary: 'bg-card/60',
    elevated: 'bg-white/95',
    blur: 'backdrop-blur-sm',
  },
  
  // アクション色
  action: {
    primary: 'bg-blue-500/80 hover:bg-blue-600/90',
    secondary: 'bg-slate-200/60 hover:bg-slate-300/70',
    success: 'bg-green-500/80 hover:bg-green-600/90',
    warning: 'bg-amber-400/80 hover:bg-amber-500/90',
    danger: 'bg-red-400/80 hover:bg-red-500/90',
  },
  
  // テキスト色
  text: {
    primary: 'text-slate-800',
    secondary: 'text-gray-700',
    muted: 'text-slate-600',
    light: 'text-slate-500',
    white: 'text-white',
  },
  
  // ボーダー色
  border: {
    primary: 'border-slate-200/50',
    secondary: 'border-gray-200/30',
    accent: 'border-blue-200/50',
  },
}
```

## タイポグラフィ

### フォント設定

```css
/* フォント定義 */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');

:root {
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-heading: 'Playfair Display', Georgia, serif;
}

/* Tailwind CSS設定 */
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
}
```

### フォントサイズ・ウェイト

```typescript
const typography = {
  // 見出し
  headings: {
    h1: 'text-4xl font-bold font-serif',  // Playfair Display
    h2: 'text-3xl font-bold font-serif',
    h3: 'text-2xl font-semibold font-serif',
    h4: 'text-xl font-semibold font-sans', // Inter
    h5: 'text-lg font-medium font-sans',
    h6: 'text-base font-medium font-sans',
  },
  
  // 本文
  body: {
    large: 'text-lg font-normal font-sans',
    base: 'text-base font-normal font-sans',
    small: 'text-sm font-normal font-sans',
    xs: 'text-xs font-normal font-sans',
  },
  
  // キャプション・ラベル
  caption: {
    base: 'text-sm font-medium font-sans',
    small: 'text-xs font-medium font-sans',
  },
}
```

## レイアウトシステム

### ブログサイトレイアウト

```typescript
// ブログサイト基本レイアウト構造
const blogLayout = {
  container: 'container mx-auto px-4 py-8',
  grid: 'grid grid-cols-1 lg:grid-cols-4 gap-8',
  main: 'lg:col-span-3',
  sidebar: 'lg:col-span-1',
  
  // ヘッダー
  header: {
    wrapper: 'bg-white/90 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50',
    container: 'container mx-auto px-4',
    nav: 'flex items-center justify-between h-16',
  },
  
  // フッター
  footer: {
    wrapper: 'bg-slate-900 text-white mt-16',
    container: 'container mx-auto px-4 py-12',
    grid: 'grid grid-cols-1 md:grid-cols-4 gap-8',
  },
}
```

### 管理画面レイアウト

```typescript
// 管理画面サイドバーレイアウト
const adminLayout = {
  wrapper: 'flex min-h-screen bg-gray-50/40',
  sidebar: {
    container: 'w-64 bg-white/70 backdrop-blur-sm border-r border-slate-200/50',
    header: 'p-6 border-b border-slate-200/50',
    nav: 'p-4 space-y-2',
    item: 'flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-100/50 transition-colors',
  },
  main: {
    container: 'flex-1 flex flex-col',
    header: 'bg-white/70 backdrop-blur-sm border-b border-slate-200/50 px-6 py-4',
    content: 'flex-1 p-6 overflow-auto',
  },
}
```

### サイドバーナビゲーション構造

```typescript
// 管理画面サイドバー項目
const sidebarItems = [
  { title: "ダッシュボード", href: "/dashboard", icon: Home },
  { title: "記事管理", href: "/articles", icon: FileText },
  { title: "AI記事生成", href: "/generation", icon: Bot },
  { title: "HTML生成", href: "/html-generator", icon: Code },
  { title: "ファイル管理", href: "/files", icon: Folder },
  { title: "カテゴリ管理", href: "/categories", icon: Tag },
  { title: "サイト設定", href: "/site-settings", icon: Globe },
  { title: "テンプレート", href: "/templates", icon: Layout },
  { title: "デプロイ", href: "/deploy", icon: Upload },
  { title: "設定", href: "/settings", icon: Settings },
]
```

## コンポーネントデザイン

### カードコンポーネント

```typescript
// カードバリエーション
const cardStyles = {
  // 基本カード
  base: 'bg-white/70 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md/20 transition-all duration-200 border border-slate-200/50',
  
  // エレベーテッドカード
  elevated: 'bg-white/95 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl/30 transition-all duration-300',
  
  // インタラクティブカード
  interactive: 'bg-white/95 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl/30 transition-all duration-300 hover:scale-105 overflow-hidden group cursor-pointer',
  
  // アクセントカード
  accent: 'bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-pink-600/10 backdrop-blur-sm rounded-lg border border-blue-200/50',
}
```

### ボタンコンポーネント

```typescript
// ボタンバリエーション
const buttonStyles = {
  // プライマリボタン
  primary: 'bg-blue-500/80 hover:bg-blue-600/90 text-white shadow-sm hover:shadow-md/20 transition-all duration-200 px-4 py-2 rounded-md font-medium',
  
  // セカンダリボタン
  secondary: 'bg-slate-100/60 hover:bg-slate-200/70 text-slate-700 shadow-sm hover:shadow-md/20 transition-all duration-200 px-4 py-2 rounded-md font-medium',
  
  // アウトラインボタン
  outline: 'border border-slate-200/50 hover:bg-slate-50/50 text-slate-700 hover:text-slate-900 transition-all duration-200 px-4 py-2 rounded-md font-medium',
  
  // ゴーストボタン
  ghost: 'hover:bg-slate-100/30 text-slate-600 hover:text-slate-900 transition-all duration-200 px-4 py-2 rounded-md font-medium',
  
  // 危険ボタン
  destructive: 'bg-red-400/80 hover:bg-red-500/90 text-white shadow-sm hover:shadow-md/20 transition-all duration-200 px-4 py-2 rounded-md font-medium',
}
```

### フォームコンポーネント

```typescript
// フォーム要素スタイル
const formStyles = {
  // 入力フィールド
  input: 'bg-white/60 border border-slate-200/50 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200 px-3 py-2',
  
  // テキストエリア
  textarea: 'bg-white/60 border border-slate-200/50 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200 px-3 py-2 resize-none',
  
  // セレクト
  select: 'bg-white/60 border border-slate-200/50 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200 px-3 py-2',
  
  // ラベル
  label: 'text-slate-700 font-medium text-sm mb-1 block',
  
  // エラーメッセージ
  error: 'text-red-500/80 text-sm mt-1',
  
  // ヘルプテキスト
  help: 'text-slate-500 text-xs mt-1',
}
```

## 視覚効果・アニメーション

### シャドウシステム

```typescript
const shadows = {
  // 基本シャドウ
  sm: 'shadow-sm',
  base: 'shadow-md/20',
  lg: 'shadow-lg/10',
  xl: 'shadow-xl/20',
  
  // ホバーシャドウ
  'hover-sm': 'hover:shadow-sm/30',
  'hover-md': 'hover:shadow-md/30',
  'hover-lg': 'hover:shadow-lg/20',
  'hover-xl': 'hover:shadow-2xl/30',
}
```

### ホバー効果

```typescript
const hoverEffects = {
  // カードホバー
  card: 'hover:shadow-md/30 hover:bg-white/80 transition-all duration-200',
  
  // ボタンホバー
  button: 'hover:shadow-lg/20 hover:scale-[1.02] transition-all duration-200',
  
  // ナビゲーションホバー
  nav: 'hover:bg-slate-100/50 transition-colors duration-200',
  
  // 画像ホバー
  image: 'hover:scale-110 transition-transform duration-500',
}
```

### トランジション

```typescript
const transitions = {
  // 基本トランジション
  base: 'transition-all duration-200 ease-in-out',
  
  // 複雑なトランジション
  complex: 'transition-[background-color,box-shadow,transform] duration-300 ease-out',
  
  // 色のトランジション
  colors: 'transition-colors duration-200',
  
  // 変形トランジション
  transform: 'transition-transform duration-300 ease-out',
}
```

### ブラー効果

```typescript
const blurEffects = {
  // 背景ブラー
  backdrop: 'backdrop-blur-sm',
  'backdrop-md': 'backdrop-blur-md',
  
  // オーバーレイブラー
  overlay: 'backdrop-blur-md bg-black/20',
}
```

## レスポンシブデザイン

### ブレイクポイント

```typescript
const breakpoints = {
  sm: '640px',    // モバイル（横向き）
  md: '768px',    // タブレット
  lg: '1024px',   // デスクトップ（小）
  xl: '1280px',   // デスクトップ（中）
  '2xl': '1536px' // デスクトップ（大）
}
```

### レスポンシブグリッド

```typescript
const responsiveGrids = {
  // 記事グリッド
  articles: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  
  // 2カラムレイアウト
  twoColumn: 'grid grid-cols-1 lg:grid-cols-2 gap-8',
  
  // サイドバー付きレイアウト
  withSidebar: 'grid grid-cols-1 lg:grid-cols-4 gap-8',
  
  // ダッシュボード統計
  stats: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
}
```

### サイドバーレスポンシブ

```typescript
const sidebarResponsive = {
  // デスクトップ
  desktop: 'hidden lg:flex w-64 flex-col fixed inset-y-0',
  
  // モバイル（オーバーレイ）
  mobile: 'fixed inset-0 z-50 lg:hidden',
  overlay: 'fixed inset-0 bg-black/20 backdrop-blur-sm',
  panel: 'relative flex w-full max-w-xs flex-col bg-white shadow-xl',
  
  // ハンバーガーメニュー
  hamburger: 'lg:hidden p-2 rounded-md hover:bg-gray-100',
}
```

## アクセシビリティ

### フォーカス管理

```typescript
const focusStyles = {
  // 基本フォーカス
  base: 'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50',
  
  // ボタンフォーカス
  button: 'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2',
  
  // 入力フィールドフォーカス
  input: 'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50',
  
  // ナビゲーションフォーカス
  nav: 'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-inset',
}
```

### ARIA属性

```typescript
// アクセシビリティ属性の例
const ariaAttributes = {
  // ナビゲーション
  navigation: {
    'role': 'navigation',
    'aria-label': 'メインナビゲーション',
  },
  
  // ボタン
  button: {
    'aria-pressed': 'false', // トグルボタンの場合
    'aria-expanded': 'false', // ドロップダウンの場合
    'aria-haspopup': 'true', // ポップアップがある場合
  },
  
  // フォーム
  form: {
    'aria-required': 'true',
    'aria-invalid': 'false',
    'aria-describedby': 'field-error',
  },
  
  // 状態表示
  status: {
    'role': 'status',
    'aria-live': 'polite',
  },
}
```

### カラーコントラスト

```typescript
// WCAG AA準拠のカラーコントラスト
const contrastColors = {
  // 通常テキスト（4.5:1以上）
  normal: {
    'text-slate-800': 'bg-white', // 15.8:1
    'text-gray-700': 'bg-slate-50', // 8.9:1
    'text-slate-600': 'bg-white', // 5.7:1
  },
  
  // 大きなテキスト（3:1以上）
  large: {
    'text-slate-500': 'bg-white', // 4.6:1
    'text-gray-500': 'bg-slate-50', // 4.1:1
  },
}
```

## アニメーション・モーション

### キーフレーム

```css
/* カスタムアニメーション */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
```

### モーション設定

```typescript
const animations = {
  // ページ読み込み
  pageLoad: 'animate-[fadeInUp_0.6s_ease-out]',
  
  // カード表示
  cardReveal: 'animate-[slideInLeft_0.4s_ease-out]',
  
  // ローディング
  loading: 'animate-pulse',
  
  // スピン
  spin: 'animate-spin',
  
  // バウンス
  bounce: 'animate-bounce',
}
```

## 状態表示

### ローディング状態

```typescript
const loadingStates = {
  // スケルトン
  skeleton: 'animate-pulse bg-slate-200/50 rounded',
  
  // スピナー
  spinner: 'animate-spin rounded-full border-2 border-slate-200 border-t-blue-500',
  
  // プログレスバー
  progress: 'bg-slate-200/50 rounded-full overflow-hidden',
  progressBar: 'bg-blue-500 h-full transition-all duration-300 ease-out',
}
```

### エラー状態

```typescript
const errorStates = {
  // エラーアラート
  alert: 'bg-red-50/80 border border-red-200/50 text-red-800 px-4 py-3 rounded-md',
  
  // フィールドエラー
  field: 'border-red-300 focus:border-red-500 focus:ring-red-500/20',
  
  // エラーアイコン
  icon: 'text-red-500',
}
```

### 成功状態

```typescript
const successStates = {
  // 成功アラート
  alert: 'bg-green-50/80 border border-green-200/50 text-green-800 px-4 py-3 rounded-md',
  
  // 成功バッジ
  badge: 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium',
  
  // 成功アイコン
  icon: 'text-green-500',
}
```

## デザイントークン

### スペーシング

```typescript
const spacing = {
  section: 'py-16',      // セクション間
  container: 'py-8',     // コンテナ内
  component: 'p-6',      // コンポーネント内
  element: 'p-4',        // 要素内
  tight: 'p-2',          // 密な間隔
  card: 'p-6',           // カード内
  form: 'space-y-6',     // フォーム要素間
  list: 'space-y-4',     // リスト項目間
}
```

### 角丸

```typescript
const borderRadius = {
  sm: 'rounded-sm',      // 2px
  base: 'rounded',       // 4px
  md: 'rounded-md',      // 6px
  lg: 'rounded-lg',      // 8px
  xl: 'rounded-xl',      // 12px
  '2xl': 'rounded-2xl',  // 16px
  full: 'rounded-full',  // 50%
}
```

### Z-Index

```typescript
const zIndex = {
  dropdown: 'z-10',
  sticky: 'z-20',
  fixed: 'z-30',
  modal: 'z-40',
  popover: 'z-50',
  tooltip: 'z-60',
}
```
