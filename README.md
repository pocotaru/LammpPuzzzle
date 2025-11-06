# LammpPuzzzle

某 MMORPG のダンジョンで出現するランプパズル仕組みにインスパイアされた Web アプリケーションです。

## 🎮 ゲームについて

このパズルは、ランプの点灯パターンから正しいランプの配置順序を推測するロジックゲームです。

### ルール

- 3 ～ 10 個のランプから数を選択してゲームを開始
- 点灯しているランプをクリックして選択
- システムが次の推測候補を提示
- 正解を見つけるまで繰り返し

## 🚀 使用方法

1. ブラウザで `index.html` を開く
2. ランプ数（3 ～ 10 個）を選択
3. 「スタート」をクリック
4. 点灯しているランプをクリックして選択
5. 「確定」をクリック
6. 提示された候補から次の推測を選択
7. 正解が見つかるまで繰り返し

## 🛠️ 技術仕様

- **HTML5**: 基本構造
- **CSS3**: スタイリング
- **Vanilla JavaScript**: ゲームロジック
- **Node.js**: 開発環境・ツール

## 📁 ファイル構成

```
├── index.html          # メインHTMLファイル
├── style.css           # スタイルシート
├── script.js           # JavaScriptゲームロジック
├── package.json        # Node.js設定・依存関係
├── eslint.config.js    # ESLint設定
├── .prettierrc         # Prettier設定
├── .stylelintrc.json   # Stylelint設定
├── .htmlhintrc         # HTMLHint設定
├── .husky/             # Git hooks設定
└── README.md           # このファイル
```

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

## 🔄 Pre-commit機能

このプロジェクトにはpre-commit機能が設定されており、コミット時に自動的に以下が実行されます：

- **JavaScriptファイル**: ESLint + Prettier
- **HTMLファイル**: HTMLHint + Prettier
- **CSSファイル**: Stylelint + Prettier
- **Markdownファイル**: Prettier

### Git Hooks

- `pre-commit`: コミット前に構文チェックとフォーマット実行

問題が発見された場合、コミットは中断されるため、コードの品質が保たれます。

## 🎯 特徴

- レスポンシブデザイン
- 直感的なユーザーインターフェース
- 履歴機能付き
- 複数のランプ数対応

## 📝 License

このプロジェクトは MIT ライセンスの下で公開されています。

## ⚖️ 著作権・免責事項

### 作品について

このアプリケーションは某 MMORPG のダンジョン仕組みにインスパイアされた完全オリジナル作品です。

**免責事項:**

- 当サイトは各ゲーム会社とは一切関係ありません。
- このサイトは個人制作の非営利サイトです。
- 当サイトに記載されている会社名・製品名・システム名などは、各社の商標、または登録商標です。
- ゲームの仕組みやルールは一般的なパズルゲームとして独自に実装されています。

### 開発ガイドライン

このプロジェクトは以下を考慮して開発されています：

- 完全オリジナルの実装
- 非営利・個人利用の範囲
- 各社の知的財産権の尊重

## 🙏 Attributions

- **Developer**: pocotaru
- **Inspired by**: MMORPG dungeon mechanics
- **License**: MIT License

---

**重要**: このアプリケーションは完全オリジナルの個人プロジェクトです。いかなるゲーム会社とも関係がなく、承認・推奨等もありません。

---

## English / 英語

### About

This is an original puzzle game inspired by dungeon mechanics found in MMORPGs. Players must deduce the correct sequence of lamp positions based on lighting patterns.

### Features

- Responsive web design
- Intuitive user interface
- History tracking
- Support for 3-10 lamps
- Code quality tools (ESLint, Prettier, etc.)

### License

MIT License - See [LICENSE](LICENSE) for details.

### Disclaimer

This is a completely original personal project. It is not affiliated with, endorsed by, or connected to any game company. All company names and product names mentioned are trademarks or registered trademarks of their respective owners.
