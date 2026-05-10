# GitHubパブリッシュスキル

完成したアプリをGitHubに engapp.v[n] として公開するスキル。
nはすでに存在するリポジトリを確認して自動で次の番号にする。

## 手順

1. `.env` から `GITHUB_TOKEN` を読み込む：

   ```bash
   export $(cat .env | xargs)
   ```

2. GitHub APIで既存の `engapp.v*` リポジトリを確認して次の番号を決める：

   ```bash
   curl -s -H "Authorization: token $GITHUB_TOKEN" \
     https://api.github.com/user/repos?per_page=100 \
     | grep '"name"' | grep 'engapp.v'
   ```

   例：engapp.v1 が存在すれば次は engapp.v2

3. GitHub に新しいリポジトリを作成する（Public）：

   ```bash
   curl -X POST https://api.github.com/user/repos \
     -H "Authorization: token $GITHUB_TOKEN" \
     -H "Accept: application/vnd.github.v3+json" \
     -d '{"name":"engapp.v[n]","private":false}'
   ```

4. リモートを登録してプッシュする：

   ```bash
   git remote add origin https://$GITHUB_TOKEN@github.com/ahaaaaa34/engapp.v[n].git
   git push -u origin main
   ```

5. GitHub Pages を有効にする：

   ```bash
   curl -X POST https://api.github.com/repos/ahaaaaa34/engapp.v[n]/pages \
     -H "Authorization: token $GITHUB_TOKEN" \
     -H "Accept: application/vnd.github.v3+json" \
     -d '{"source":{"branch":"main","path":"/"}}'
   ```

6. 完了したら以下を報告する：
   - リポジトリ: `https://github.com/ahaaaaa34/engapp.v[n]`
   - WebアプリURL: `https://ahaaaaa34.github.io/engapp.v[n]/`
   （GitHub Pagesは反映まで1〜2分かかる）
