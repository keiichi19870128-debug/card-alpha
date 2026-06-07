# Vercel デプロイ & ドメイン設定ガイド

## 1. Vercel プロジェクト作成

```bash
# Vercel CLIでデプロイ（初回）
npx vercel

# 本番デプロイ
npx vercel --prod
```

または [vercel.com](https://vercel.com) からGitHubリポジトリを接続。

## 2. 環境変数の設定

Vercelダッシュボード → Settings → Environment Variables に以下を設定：

| 変数名 | 値 | 説明 |
|--------|-----|------|
| `DATABASE_URL` | `postgresql://...` | Supabase PostgreSQL接続文字列 |
| `NEXTAUTH_URL` | `https://card-alpha.jp` | NextAuth用のベースURL |
| `NEXTAUTH_SECRET` | (ランダム文字列) | `openssl rand -base64 32` で生成 |
| `NEXT_PUBLIC_SITE_URL` | `https://card-alpha.jp` | OGPやcanonical URLで使用 |

## 3. ドメイン設定 (card-alpha.jp)

### Vercel側
1. Vercelダッシュボード → プロジェクト → Settings → Domains
2. `card-alpha.jp` を追加
3. `www.card-alpha.jp` も追加（wwwからのリダイレクト用）

### DNS側（お名前.com / ムームードメイン等）
以下のDNSレコードを設定：

```
# Aレコード（ルートドメイン）
card-alpha.jp    A    76.76.21.21

# CNAMEレコード（www）
www.card-alpha.jp    CNAME    cname.vercel-dns.com
```

### 確認
- 設定後、SSL証明書が自動発行されるまで数分〜数時間
- Vercelダッシュボードでドメインのステータスが「Valid Configuration」になればOK

## 4. デプロイ後の確認事項

- [ ] トップページが正常に表示される
- [ ] OGPがSNSシェア時に正しく表示される（[OGP Debugger](https://developers.facebook.com/tools/debug/) で確認）
- [ ] 画像が最適化されて配信されている（DevToolsのNetworkタブで確認）
- [ ] モバイル表示が崩れない
- [ ] 管理画面にログインできる
- [ ] API レスポンスが正常

## 5. Supabase 設定メモ

Vercelリージョンを `hnd1`（東京）に設定しているため、Supabaseも東京リージョン（`ap-northeast-1`）を選択すると、レイテンシが最小になります。

## 6. 本番運用のポイント

- `revalidate = 3600` で1時間ごとにページ再生成（ISR）
- 管理画面で更新した場合は `revalidatePath` で即時反映
- 画像はNext.js Image Optimizationで自動WebP変換・リサイズ
