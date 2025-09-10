# TaskFlow - タスク管理アプリケーション

Next.js 15.5.2 で構築されたモダンなタスク管理アプリケーションです。

## 🚀 機能

- ✅ タスクの作成、編集、削除
- 📅 日別・週別表示
- 🔔 リアルタイム通知システム
- 📱 レスポンシブデザイン（モバイル・デスクトップ対応）
- 🎯 優先度管理
- 🏷️ タグシステム
- ⏰ 期限アラート

## 🏗️ プロジェクト構造

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # ルートレイアウト
│   └── page.tsx           # ホームページ
├── components/            # UIコンポーネント
│   ├── common/           # 共通コンポーネント
│   ├── layout/           # レイアウトコンポーネント
│   ├── tasks/            # タスク関連コンポーネント
│   ├── filters/          # フィルタリングコンポーネント
│   └── calendar/         # カレンダーコンポーネント
├── data/                 # モックデータ（開発用）
│   ├── mockTasks.ts      # サンプルタスクデータ
│   └── mockNotifications.ts # サンプル通知データ
├── hooks/                # カスタムフック
│   ├── useNotifications.ts # 通知管理
│   ├── useTaskForm.ts    # タスクフォーム
│   └── useKeyboardShortcuts.ts # キーボードショートカット
├── lib/                  # コアライブラリ
│   ├── types.ts          # 型定義
│   ├── store.ts          # Zustand状態管理
│   ├── constants.ts      # 定数
│   └── selectors.ts      # データセレクタ
├── services/             # ビジネスロジック・API
│   ├── api.ts            # APIクライアント
│   ├── taskService.ts    # タスク関連ロジック
│   └── notificationService.ts # 通知関連ロジック
├── utils/                # ユーティリティ関数
│   ├── date.ts           # 日付処理
│   └── taskUtils.ts      # タスクユーティリティ
└── styles/               # スタイル
    └── globals.css       # グローバルCSS
```

## 🛠️ 技術スタック

- **フレームワーク**: Next.js 15.5.2 (App Router)
- **言語**: TypeScript
- **状態管理**: Zustand
- **スタイリング**: Tailwind CSS
- **通知**: Browser Notification API
- **日付処理**: ネイティブ Date API

## 📦 セットアップ

### 前提条件

- Node.js 18.17 以上
- npm, yarn, pnpm, または bun

### インストール

```bash
# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認できます。

### 環境変数

```bash
# .env.local を作成
NEXT_PUBLIC_API_URL=http://localhost:3001/api  # バックエンドAPI URL（オプション）
```

## 🔧 開発

### プロジェクトのベストプラクティス

1. **コンポーネント設計**

   - 各コンポーネントは単一責任の原則に従う
   - Props の型定義を明確にする
   - 適切なコメントを記述する

2. **状態管理**

   - Zustand ストアで一元管理
   - コンポーネント固有の状態は useState を使用
   - 副作用は useEffect で管理

3. **データフロー**

   ```
   UI Components → Services → Store → Components
   ```

4. **型安全性**
   - 全ての関数・変数に適切な型注釈
   - interface を使用した明確なデータ構造定義

### 主要コンポーネント

- **AppHeader**: ナビゲーションと通知機能
- **TaskList**: タスク一覧表示
- **TaskCard**: 個別タスクカード
- **NotificationPanel**: 通知パネル
- **FilterBar**: フィルタリング機能

### カスタムフック

- **useAppStore**: メインの状態管理
- **useNotifications**: 通知システム
- **useTaskForm**: タスクフォーム管理

## 🔄 バックエンド連携準備

現在はモックデータを使用していますが、バックエンド API 実装時には以下を置き換えます：

1. `src/data/` のモックデータ
2. `src/services/api.ts` の API 呼び出し
3. Zustand ストアの初期化ロジック

### API エンドポイント設計

```typescript
// タスク関連
GET    /api/tasks              // 全タスク取得
POST   /api/tasks              // タスク作成
PUT    /api/tasks/:id          // タスク更新
DELETE /api/tasks/:id          // タスク削除

// 通知関連
GET    /api/notifications      // 全通知取得
PUT    /api/notifications/:id/read  // 既読化
DELETE /api/notifications/:id  // 通知削除
```

## 🧪 テスト

```bash
# E2Eテスト（Playwright）
npm run test:e2e

# Linting
npm run lint

# 型チェック
npm run type-check
```

## 📱 レスポンシブデザイン

- **モバイル**: 320px〜768px
- **タブレット**: 768px〜1024px
- **デスクトップ**: 1024px 以上

## 🚀 デプロイ

### Vercel（推奨）

```bash
# Vercel CLI を使用
npm i -g vercel
vercel --prod
```

### その他のプラットフォーム

- Netlify
- AWS Amplify
- Railway

## 📝 ライセンス

MIT License

## 🤝 コントリビューション

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 サポート

質問や問題がある場合は、Issue を作成してください。
