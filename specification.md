# MDXDoc デスクトップアプリ仕様書・設計書・実装ToDo

## 1. 仕様書（Requirements）

### 1.1 コンセプト

- Markdown初心者〜ビジネスユーザー向け
- エンジニアも文書作成用途で効率的に使用可能
- Notion風リッチビューとWYSIWYM風ビューの切替可能
- 図・表にはキャプションを付与可能
- ドキュメントは1ファイル形式（.mxdoc）で保存・共有
- バージョン管理（スナップショット方式）を搭載

### 1.2 UI構成

#### 上部ツールバー

- **ファイル / 編集 / 挿入 / フォーマット / 表示**
- **画像挿入ボタン**（ドラッグ&ドロップ、コピー&ペースト、挿入ボタン）

#### 表示タブ

- **デフォルト**: Notion風リッチビュー
- **オプション**: WYSIWYM風

#### サイドバー

- **アウトライン表示**
- **相互リンクパネル**（折りたたみ可）
- **バージョンタブ**（履歴閲覧・復元）

#### 表・画像

- **表**: ツールバーから挿入、セル右クリックで編集
- **画像**: 自動キャプション生成、内部保存 `/assets/`、Markdown参照
- **PDF出力時**: ビジネス文書／技術文書スタイル切替可能

### 1.3 保存形式

- **.mxdoc**（Zip形式）
  - `meta.json`：タイトル、作成者、最新バージョン、履歴情報
  - `content.json`：本文・見出し・キャプション・構造情報
  - `versions/vX.json`：各バージョンのスナップショット
  - `assets/`：画像・添付ファイル
- **エクスポート**: Markdown, PDF, AI用ファイル（`.mdpack`）

### 1.4 バージョン管理

- **スナップショット方式**
- 履歴閲覧、任意のバージョン復元可能
- 復元時、新しいバージョンとして保存

### 1.5 ショートカット & 補完

- `Ctrl+B/I/U`, `Ctrl+Shift+S`, `Ctrl+1〜6`, `Ctrl+Shift+L/N`
- 記号補完、自動リスト継続、数式補完

### 1.6 LLM関連

- 当初はLLM連携不要
- 出力形式はLLMが理解しやすいAST/JSON形式

## 2. 設計書（Design）

### 2.1 技術スタック

- **フレームワーク**: Electron
- **フロントエンド**: React + TipTap (ProseMirrorベース)
- **AST処理**: unified.js (remark/rehype)
- **PDF生成**: Puppeteer（Chromium print-to-pdf）
- **状態管理**: Zustand
- **プロジェクト管理**: JSON + Zip (.mxdoc)
- **ファイル操作**: JSZip, fs-extra
- **日付管理**: dayjs
- **商用ライセンス確認済み**: すべてMIT/Apache2.0/PD

### 2.2 内部データ構造

```json
{
  "meta.json": {
    "title": "ドキュメントタイトル",
    "author": "作成者",
    "latest_version": 3,
    "history": [
      {"version":1, "date":"2025-08-30T12:00:00Z", "comment":"初版"},
      {"version":2, "date":"2025-08-30T13:00:00Z", "comment":"表追加"},
      {"version":3, "date":"2025-08-30T14:00:00Z", "comment":"画像挿入"}
    ]
  },
  "content.json": {
    "nodes": [
      {"type":"heading","level":1,"text":"はじめに"},
      {"type":"paragraph","text":"本文テキスト"},
      {"type":"figure","kind":"image","src":"assets/img_001.png","caption":"説明文"},
      {"type":"table","table_data":[["A","B"],["C","D"]],"caption":"表の説明"}
    ]
  }
}
```

### 2.3 バージョン管理構造

- `versions/vX.json` に `content.json` のスナップショットを格納
- 復元時、新しいバージョンとして `vN+1.json` に保存

### 2.4 ファイル保存フロー

1. 編集内容を `content.json` に反映
2. 新しいバージョンを `versions/vN.json` に保存
3. `meta.json` 更新
4. `content.json` + `meta.json` + `versions/` + `assets/` を Zip化して `.mxdoc` とする

### 2.5 UIフロー

- **メインタブ**: 文書編集 + プレビュー切替
- **サイドバー**: アウトライン、リンク、履歴
- **バージョンタブ**: 過去バージョン表示、復元ボタン
- **保存ボタン**: 新バージョン作成 & `.mxdoc` 出力

## 3. 実装ToDo（ToDo List）
現状のToDo管理（更新版）
3.1 プロジェクトセットアップ ✅

 Electron 初期セットアップ

 main.js / index.html / renderer.js 作成

 package.json に start スクリプト設定

3.2 Markdownエディタ ⚪

 TipTap 導入

 キャプション付き画像挿入機能

 表挿入・編集機能

 Smart補完・ショートカット実装

3.3 ファイル管理 ⚪

 meta.json / content.json 読み書き実装

 .mxdoc Zip化 / 展開機能（JSZip）

 assets フォルダ管理

3.4 バージョン管理 ⚪

 スナップショット保存機能

 履歴タブ UI 実装

 過去バージョン復元機能

3.5 PDF出力機能 ⚪

 Puppeteer で PDF生成

 ビジネス文書/技術文書切替スタイル

3.6 UI統合 ⚪

 上部ツールバー、サイドバー、メイン編集画面結合

 プレビュー切替、アウトライン表示、リンクパネル

 バージョンタブ実装

3.7 最終確認・テスト ⚪

 .mxdoc 作成・開封テスト

 バージョン履歴確認テスト

 PDF出力テスト

 画像挿入・表挿入テスト