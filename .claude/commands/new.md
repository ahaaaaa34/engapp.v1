# 新しいアプリ作成スキル

現在のアプリの枠組みだけをコピーして、ローカルに新しい作業フォルダを作るスキル。
データ（問題文・英コミュの文・単語）は空の状態でスタートする。
GitHubへのアップロードは /publish で行う。

## 手順

1. `$ARGUMENTS` にフォルダ名があればそれを使う。なければ「フォルダ名を教えてください」と聞く。

2. `~/Downloads/<フォルダ名>` に作業ディレクトリを作成する。

3. 現在のプロジェクトから以下をコピーする：
   - `index.html`
   - `app.js`
   - `sw.js`
   - `manifest.json`
   - `icon.svg`（あれば）
   - `vocab/index.html`
   - `vocab/app.js`
   - `vocab/tts.js`
   - `vocab/sw.js`
   - `vocab/manifest.json`
   - `.claude/commands/`（スキルごとコピー）
   - `.env`（GitHubトークンごとコピー）

4. 以下のファイルは**空のテンプレート**で新規作成する：

   **data.js:**
   ```js
   const QUIZ_DATA = {
     frames: [],
     exA: [],
     exB: [],
     exC: []
   };

   const EIGO_SENTENCES = [];
   ```

   **vocab/data.js:**
   ```js
   export const WORDS = [];
   ```

5. `git init && git add -A && git commit -m "initial: app template"` を実行する。

6. Claude Code で開く：

   ```bash
   claude ~/Downloads/<フォルダ名>
   ```

7. 完了したら「/grammar・/eigo・/vocabでデータを追加して、完成したら /publish でGitHubにあげてください」と伝える。
