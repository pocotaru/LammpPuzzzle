# 開発者ガイド / Developer Guide

## 🔧 開発環境セットアップ

### 必要な環境

- Node.js（voltaによりインストール済み）
- Git

### 依存関係のインストール

```bash
npm install
```

### 利用可能なスクリプト

#### 構文チェック

```bash
# すべてのファイルをチェック
npm run lint

# JavaScript専用
npm run lint:js

# HTML専用
npm run lint:html

# CSS専用
npm run lint:css

# 自動修正（JavaScript、CSS）
npm run lint:fix
```

#### フォーマット

```bash
# すべてのファイルをフォーマット
npm run format

# フォーマットをチェックのみ
npm run format:check
```

#### CSS分析・最適化

```bash
# 未使用CSSクラスの検出
npm run css:analyze

# PurgeCSSによる最適化
npm run css:purge

# UnCSSによる最適化
npm run css:uncss
```

#### 複合コマンド

```bash
# 全体チェック（並列実行）
npm run check:all

# 全体修正（自動修正 + フォーマット）
npm run fix:all
```

## 🔄 Pre-commit機能

このプロジェクトにはpre-commit機能が設定されており、コミット時に自動的に以下が実行されます：

- **JavaScriptファイル**: ESLint + Prettier
- **HTMLファイル**: HTMLHint + Prettier
- **CSSファイル**: Stylelint + Prettier
- **Markdownファイル**: Prettier

### Git Hooks

- `pre-commit`: コミット前に構文チェックとフォーマット実行

問題が発見された場合、コミットは中断されるため、コードの品質が保たれます。

## 📁 詳細ファイル構成

```
├── index.html              # メインHTMLファイル
├── style.css               # スタイルシート
├── script.js               # JavaScriptゲームロジック
├── package.json            # Node.js設定・依存関係
├── package-lock.json       # 依存関係ロック
├── eslint.config.js        # ESLint設定
├── .prettierrc             # Prettier設定
├── .stylelintrc.json       # Stylelint設定
├── .htmlhintrc             # HTMLHint設定
├── .gitignore              # Git除外設定
├── .gitattributes          # Git属性設定
├── .editorconfig           # エディタ設定
├── purgecss.config.json    # PurgeCSS設定
├── .husky/                 # Git hooks設定
│   └── pre-commit          # コミット前フック
├── .vscode/                # VSCode設定
│   ├── tasks.json          # タスク定義
│   └── launch.json         # デバッグ設定
├── .github/                # GitHub Actions
│   └── workflows/
│       └── deploy.yml      # Pages自動デプロイ
├── README.md               # プロジェクト概要
└── DEVELOP.md              # このファイル
```

## 🛠️ 使用技術・ツール

### フロントエンド

- **HTML5**: セマンティックマークアップ
- **CSS3**: Flexbox、CSS Grid、カスタムプロパティ
- **Vanilla JavaScript**: ES6+モジュール、非同期処理

### 開発ツール

- **ESLint 9.39.1**: JavaScript構文チェック
- **Prettier 3.6.2**: コード整形
- **Stylelint 16.25.0**: CSS構文チェック
- **HTMLHint 1.7.1**: HTML構文チェック
- **Husky 9.1.7**: Gitフック管理
- **lint-staged 16.2.6**: ステージファイル処理
- **npm-run-all 4.1.5**: 並列スクリプト実行

### CSS最適化

- **PurgeCSS 7.0.2**: 未使用CSS除去
- **UnCSS 0.17.3**: 未使用CSS検出

## 🎯 VSCode統合

### タスク実行

**Ctrl+Shift+P** → 「Tasks: Run Task」

- 🔍 全体チェック - ESLint + Prettier + HTML + CSS
- 🔧 自動修正 - ESLint + Prettier
- 🎨 フォーマット - Prettier
- その他個別ツール

### デバッグ実行

**F5キー** または「実行とデバッグ」パネル

- 🔍 全体チェック実行
- 🔧 自動修正実行
- 🎨 フォーマット実行
- その他各種チェック

## 🚀 CI/CD

### GitHub Actions

- **自動デプロイ**: mainブランチへのpush時
- **構文チェック**: 全PR作成時
- **Pages公開**: 自動的にGitHub Pagesにデプロイ

### ワークフロー

```yaml
# .github/workflows/deploy.yml
- ESLint, Prettier, HTMLHint, Stylelint実行
- ビルド成功時のみPages更新
- 失敗時は通知
```

## 🔍 コード品質管理

### 品質ゲート

1. **開発時**: VSCodeリアルタイムチェック
2. **コミット前**: Pre-commit hooks
3. **プッシュ時**: GitHub Actions
4. **デプロイ前**: 全チェック通過が必須

### 設定ファイル概要

- **ESLint**: ES6+、ブラウザ環境、Prettier統合
- **Prettier**: 2スペース、セミコロン有、単一引用符
- **Stylelint**: 標準ルール、緩い設定
- **HTMLHint**: 基本構文チェック

## 🐛 トラブルシューティング

### よくある問題

#### 1. npm run lint でエラー

```bash
# 依存関係を再インストール
npm ci

# キャッシュクリア
npm cache clean --force
```

#### 2. pre-commit が動作しない

```bash
# Huskyを再設定
npm run prepare
```

#### 3. VSCodeでタスクが見つからない

- `.vscode/tasks.json`の存在確認
- VSCodeの再起動

## 📝 開発ガイドライン

### コーディング規約

- **JavaScript**: ESLint設定に従う
- **CSS**: BEM記法推奨、Stylelint準拠
- **HTML**: セマンティックタグ使用

### コミット規約

```bash
# 推奨形式
feat: 新機能追加
fix: バグ修正
docs: ドキュメント更新
style: コード整形
refactor: リファクタリング
```

### ブランチ戦略

- **main**: 本番リリース用
- **develop**: 開発統合用
- **feature/\***: 機能開発用

---

## English / 英語

### Development Setup

#### Prerequisites

- Node.js (managed via volta)
- Git

#### Installation

```bash
npm install
```

#### Available Scripts

- `npm run lint` - Run all linters
- `npm run lint:fix` - Auto-fix issues
- `npm run format` - Format all files
- `npm run check:all` - Comprehensive check

#### Pre-commit Hooks

Automatically runs ESLint, Prettier, HTMLHint, and Stylelint on staged files before commit.

#### VSCode Integration

- Use **Tasks: Run Task** (Ctrl+Shift+P) for manual execution
- Use **Run and Debug** (F5) for quick testing
- Real-time error highlighting in Problems panel

#### CI/CD

GitHub Actions automatically deploys to GitHub Pages on main branch push after successful linting and formatting checks.
