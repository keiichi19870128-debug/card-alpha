# Card Alpha 設計書

Card Alpha（ポケモンカード投資・分析プラットフォーム）の全体設計書です。

---

## ドキュメント一覧

| No | ファイル | 内容 |
|----|---------|------|
| 1 | [01_overview.md](./01_overview.md) | 全体設計書（コンセプト、アーキテクチャ、技術スタック、セキュリティ） |
| 2 | [02_ui_design.md](./02_ui_design.md) | 画面構成・ワイヤーフレーム（12画面分） |
| 3 | [03_database.md](./03_database.md) | データベース設計（ER図、Prisma Schema 完全版） |
| 4 | [04_roadmap.md](./04_roadmap.md) | MVP → 拡張版の開発ロードマップ |

---

## 次のステップ

### 1. 設計レビュー
上記4つの設計書を確認し、気になる点・修正したい点があればフィードバック。

### 2. MVP開発開始
設計が確定したら、以下の順で開発を進めます：

```
Phase 0: 環境準備 ──→ Phase 1: MVP開発 ──→ リリース
```

### 3. 推奨の最初のアクション
1. `01_overview.md` の技術スタックを確認
2. Replit で Next.js 14 + TypeScript テンプレートを作成
3. `03_database.md` の Prisma Schema をコピーして初期設定
4. `02_ui_design.md` のホームページから実装開始

---

*Card Alpha Project*
*作成日: 2026-06-05*
