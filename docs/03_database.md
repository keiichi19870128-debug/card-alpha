# Card Alpha データベース設計

## 1. ER図（テキスト表現）

```
+----------------+       +------------------+       +----------------+
|     User       |       |  Subscription    |       |   PriceAlert   |
+----------------+       +------------------+       +----------------+
| id (PK)        |1-----*| user_id (FK)     |       | id (PK)        |
| email          |       +------------------+       | user_id (FK)   |
| password_hash  |                                   | card_id (FK)   |
| role           |       +------------------+       | target_price   |
| name           |       |  Watchlist       |       | is_active      |
| created_at     |1-----*| user_id (FK)     |       | created_at     |
+----------------+       | card_id (FK)     |       +----------------+
                         +------------------+

+----------------+       +------------------+       +----------------+
|     Card       |       |    Article       |       |  BudgetStrategy|
+----------------+       +------------------+       +----------------+
| id (PK)        |1-----*| id (PK)          |       | id (PK)        |
| name           |       | title            |       | budget_amount  |
| image_url      |       | slug             |       | title          |
| current_price  |       | content          |       | description    |
| rating         |       | category_id(FK)  |*-----1| content        |
| game_id (FK)   |       | featured_image   |       | is_premium     |
| card_code      |       | is_published     |       | created_at     |
| rarity         |       | is_premium       |       +----------------+
| set_name       |       | published_at     |              |1
| release_date   |       | created_at       |              |
| description    |       +------------------+       +-----------------+
| reason         |       +------------------+       | StrategyCardItem|
| created_at     |       |  ArticleCategory |       +-----------------+
+----------------+       +------------------+       | id (PK)         |
        |1              | id (PK)          |1------*| strategy_id(FK) |
        |               | name             |       | card_id (FK)    |
        |               | slug             |       | recommended_qty |
        |               | description      |       | sort_order      |
        |               +------------------+       | description     |
+-------+--------+                                    +-----------------+
|     Game       |
+----------------+
| id (PK)        |
| name           |
| slug           |
| logo_url       |
| is_active      |
+----------------+
```

---

## 2. テーブル定義

### 2.1 Game（ゲームマスター）

ポケモンカード、ワンピースカードなどをかんたんに切り替えるためのマスターテーブル。
未来の拡張に備えた中心テーブル。

| カラム名 | 型 | 制約 | 説明 |
|---------|------|------|------|
| id | UUID / SERIAL | PK | 自動生成 |
| name | VARCHAR(100) | NOT NULL, UNIQUE | ゲーム名称（例: ポケモンカード） |
| slug | VARCHAR(100) | NOT NULL, UNIQUE | URL用（例: pokemon-card） |
| logo_url | VARCHAR(500) | NULL | ロゴ画像パス |
| is_active | BOOLEAN | DEFAULT true | 有効フラグ |
| created_at | TIMESTAMP | DEFAULT now() | 作成日時 |
| updated_at | TIMESTAMP | DEFAULT now() | 更新日時 |

---

### 2.2 Card（注目カード）

| カラム名 | 型 | 制約 | 説明 |
|---------|------|------|------|
| id | UUID / SERIAL | PK | 自動生成 |
| name | VARCHAR(200) | NOT NULL | カード名 |
| image_url | VARCHAR(500) | NULL | カード画像URL |
| current_price | INTEGER | NOT NULL | 現在価格（円） |
| rating | VARCHAR(1) | NOT NULL | 評価 S/A/B |
| game_id | UUID/INT | FK → Game.id | 属するゲーム |
| card_code | VARCHAR(50) | NULL | カード番号（拡張性：将来的に価格連携） |
| rarity | VARCHAR(50) | NULL | レアリティ（例: SR, UR, HR） |
| set_name | VARCHAR(100) | NULL | 拡張パック名 |
| release_date | DATE | NULL | 発売日 |
| reason | TEXT | NULL | 注目理由（マークダウン対応） |
| is_featured | BOOLEAN | DEFAULT false | ホームに表示するか |
| status | VARCHAR(20) | DEFAULT "active" | active / hidden |
| created_at | TIMESTAMP | DEFAULT now() | 作成日時 |
| updated_at | TIMESTAMP | DEFAULT now() | 更新日時 |

#### インデックス

- `idx_cards_game_id` : game_id
- `idx_cards_rating` : rating（S/A/B絞り込み用）
- `idx_cards_featured` : is_featured + game_id（ホーム表示用）
- `idx_cards_created` : created_at（新着順）

---

### 2.3 ArticleCategory（記事カテゴリー）

| カラム名 | 型 | 制約 | 説明 |
|---------|------|------|------|
| id | UUID / SERIAL | PK | 自動生成 |
| name | VARCHAR(50) | NOT NULL, UNIQUE | カテゴリ名 |
| slug | VARCHAR(50) | NOT NULL, UNIQUE | URL用 |
| description | TEXT | NULL | 説明文 |
| sort_order | INTEGER | DEFAULT 0 | 並び順 |
| created_at | TIMESTAMP | DEFAULT now() | 作成日時 |

#### 初期データ

| name | slug | description |
|------|------|-------------|
| ポケモンカード | pokemon-card | ポケモンカードに関する情報 |
| 投資戦略 | investment-strategy | カード投資の戦略・考え方 |
| 高騰予想 | price-prediction | 価格高騰の予想・分析 |

---

### 2.4 Article（記事）

| カラム名 | 型 | 制約 | 説明 |
|---------|------|------|------|
| id | UUID / SERIAL | PK | 自動生成 |
| title | VARCHAR(200) | NOT NULL | 記事タイトル |
| slug | VARCHAR(200) | NOT NULL, UNIQUE | URL用 |
| content | TEXT | NOT NULL | 本文（マークダウン） |
| category_id | UUID/INT | FK → ArticleCategory.id | カテゴリ |
| featured_image | VARCHAR(500) | NULL | アイキャッチ画像URL |
| is_published | BOOLEAN | DEFAULT false | 公開フラグ |
| is_premium | BOOLEAN | DEFAULT false | 有料会員限定記事か |
| published_at | TIMESTAMP | NULL | 公開日時 |
| meta_title | VARCHAR(100) | NULL | SEO用タイトル |
| meta_description | VARCHAR(300) | NULL | SEO用説明文 |
| view_count | INTEGER | DEFAULT 0 | 閲覧数 |
| author_id | UUID/INT | FK → User.id | 作成者（将来的） |
| created_at | TIMESTAMP | DEFAULT now() | 作成日時 |
| updated_at | TIMESTAMP | DEFAULT now() | 更新日時 |

#### インデックス

- `idx_articles_category` : category_id
- `idx_articles_published` : is_published + published_at
- `idx_articles_slug` : slug（一意検索）

---

### 2.5 BudgetStrategy（予算別投資戦略）

| カラム名 | 型 | 制約 | 説明 |
|---------|------|------|------|
| id | UUID / SERIAL | PK | 自動生成 |
| budget_amount | INTEGER | NOT NULL, UNIQUE | 予算金額（10000, 50000...） |
| title | VARCHAR(200) | NOT NULL | タイトル |
| description | TEXT | NOT NULL | 戦略概要 |
| content | TEXT | NULL | 戦略詳細（マークダウン） |
| is_premium | BOOLEAN | DEFAULT false | 有料会員限定詳細版か |
| game_id | UUID/INT | FK → Game.id | 対象ゲーム |
| sort_order | INTEGER | DEFAULT 0 | 並び順 |
| created_at | TIMESTAMP | DEFAULT now() | 作成日時 |
| updated_at | TIMESTAMP | DEFAULT now() | 更新日時 |

---

### 2.6 StrategyCardItem（戦略に含まれるカード項目）

ある予算戦略に含まれるカードと推奨数量を管理する中間テーブル。

| カラム名 | 型 | 制約 | 説明 |
|---------|------|------|------|
| id | UUID / SERIAL | PK | 自動生成 |
| strategy_id | UUID/INT | FK → BudgetStrategy.id, NOT NULL | 戦略 |
| card_id | UUID/INT | FK → Card.id, NOT NULL | カード |
| recommended_qty | INTEGER | DEFAULT 1 | 推奨枚数 |
| sort_order | INTEGER | DEFAULT 0 | 戦略内の表示順 |
| description | TEXT | NULL | このカードの選定理由 |

---

### 2.7 User（ユーザー） ※ Phase 2以降

| カラム名 | 型 | 制約 | 説明 |
|---------|------|------|------|
| id | UUID / SERIAL | PK | 自動生成 |
| email | VARCHAR(255) | NOT NULL, UNIQUE | メールアドレス |
| password_hash | VARCHAR(255) | NOT NULL | bcryptハッシュ |
| name | VARCHAR(100) | NULL | 表示名 |
| role | VARCHAR(20) | DEFAULT "user" | admin / user / premium |
| email_verified | BOOLEAN | DEFAULT false | メール認証済みフラグ |
| stripe_customer_id | VARCHAR(100) | NULL | Stripe顧客ID |
| is_premium | BOOLEAN | DEFAULT false | 有料会員フラグ |
| premium_since | TIMESTAMP | NULL | 有料会員開始日 |
| premium_until | TIMESTAMP | NULL | 有料会員期限 |
| created_at | TIMESTAMP | DEFAULT now() | 作成日時 |
| updated_at | TIMESTAMP | DEFAULT now() | 更新日時 |

#### インデックス

- `idx_users_email` : email（ログイン用）
- `idx_users_stripe` : stripe_customer_id

---

### 2.8 Subscription（サブスクリプション）※ Phase 2以降

| カラム名 | 型 | 制約 | 説明 |
|---------|------|------|------|
| id | UUID / SERIAL | PK | 自動生成 |
| user_id | UUID/INT | FK → User.id, NOT NULL | ユーザー |
| stripe_subscription_id | VARCHAR(100) | NOT NULL, UNIQUE | StripeサブスクリプションID |
| status | VARCHAR(20) | NOT NULL | active / cancelled / past_due |
| plan_name | VARCHAR(50) | NOT NULL | プラン名 |
| price_amount | INTEGER | NOT NULL | 月額金額（円） |
| current_period_start | TIMESTAMP | NOT NULL | 現在周期開始日 |
| current_period_end | TIMESTAMP | NOT NULL | 現在周期終了日 |
| created_at | TIMESTAMP | DEFAULT now() | 作成日時 |
| updated_at | TIMESTAMP | DEFAULT now() | 更新日時 |

---

### 2.9 Watchlist（ウォッチリスト）※ Phase 2以降

| カラム名 | 型 | 制約 | 説明 |
|---------|------|------|------|
| id | UUID / SERIAL | PK | 自動生成 |
| user_id | UUID/INT | FK → User.id, NOT NULL | ユーザー |
| card_id | UUID/INT | FK → Card.id, NOT NULL | カード |
| note | TEXT | NULL | メモ |
| created_at | TIMESTAMP | DEFAULT now() | 作成日時 |

#### 制約

- UNIQUE(user_id, card_id) : 同じカードを重複登録不可

---

### 2.10 PriceAlert（価格アラート）※ Phase 2以降

| カラム名 | 型 | 制約 | 説明 |
|---------|------|------|------|
| id | UUID / SERIAL | PK | 自動生成 |
| user_id | UUID/INT | FK → User.id, NOT NULL | ユーザー |
| card_id | UUID/INT | FK → Card.id, NOT NULL | カード |
| target_price | INTEGER | NOT NULL | 目標価格（円） |
| condition | VARCHAR(10) | DEFAULT "below" | below（以下） / above（以上） |
| is_active | BOOLEAN | DEFAULT true | 有効フラグ |
| triggered_at | TIMESTAMP | NULL | 発火日時 |
| created_at | TIMESTAMP | DEFAULT now() | 作成日時 |

---

### 2.11 PriceHistory（価格履歴）※ Phase 3以降

| カラム名 | 型 | 制約 | 説明 |
|---------|------|------|------|
| id | UUID / SERIAL | PK | 自動生成 |
| card_id | UUID/INT | FK → Card.id, NOT NULL | カード |
| price | INTEGER | NOT NULL | 記録時価格 |
| recorded_at | DATE | NOT NULL | 記録日 |
| source | VARCHAR(50) | NULL | 取得元（手動 / API） |
| created_at | TIMESTAMP | DEFAULT now() | 作成日時 |

#### 制約

- UNIQUE(card_id, recorded_at) : 1日1レコード

#### インデックス

- `idx_pricehistory_card_date` : card_id + recorded_at（ランキング計算用）

---

## 3. リレーション（Prisma Schema 想定）

```prisma
model Game {
  id        String   @id @default(uuid())
  name      String   @unique
  slug      String   @unique
  logo_url  String?
  is_active Boolean  @default(true)
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  cards     Card[]
  strategies BudgetStrategy[]
}

model Card {
  id            String   @id @default(uuid())
  name          String
  image_url     String?
  current_price Int
  rating        String   // S, A, B
  game_id       String
  card_code     String?
  rarity        String?
  set_name      String?
  release_date  DateTime?
  reason        String?  @db.Text
  is_featured   Boolean  @default(false)
  status        String   @default("active")
  created_at    DateTime @default(now())
  updated_at    DateTime @updatedAt

  game            Game              @relation(fields: [game_id], references: [id])
  strategy_items  StrategyCardItem[]
  watchlists      Watchlist[]
  price_alerts    PriceAlert[]
  price_histories PriceHistory[]
}

model ArticleCategory {
  id          String @id @default(uuid())
  name        String @unique
  slug        String @unique
  description String?
  sort_order  Int    @default(0)
  created_at  DateTime @default(now())

  articles Article[]
}

model Article {
  id               String   @id @default(uuid())
  title            String
  slug             String   @unique
  content          String   @db.Text
  category_id      String
  featured_image   String?
  is_published     Boolean  @default(false)
  is_premium       Boolean  @default(false)
  published_at     DateTime?
  meta_title       String?
  meta_description String?
  view_count       Int      @default(0)
  created_at       DateTime @default(now())
  updated_at       DateTime @updatedAt

  category ArticleCategory @relation(fields: [category_id], references: [id])
}

model BudgetStrategy {
  id            String   @id @default(uuid())
  budget_amount Int      @unique
  title         String
  description   String   @db.Text
  content       String?  @db.Text
  is_premium    Boolean  @default(false)
  game_id       String
  sort_order    Int      @default(0)
  created_at    DateTime @default(now())
  updated_at    DateTime @updatedAt

  game  Game @relation(fields: [game_id], references: [id])
  items StrategyCardItem[]
}

model StrategyCardItem {
  id              String @id @default(uuid())
  strategy_id     String
  card_id         String
  recommended_qty Int    @default(1)
  sort_order      Int    @default(0)
  description     String?

  strategy BudgetStrategy @relation(fields: [strategy_id], references: [id])
  card     Card           @relation(fields: [card_id], references: [id])

  @@unique([strategy_id, card_id])
}

model User {
  id               String   @id @default(uuid())
  email            String   @unique
  password_hash    String
  name             String?
  role             String   @default("user")
  email_verified   Boolean  @default(false)
  stripe_customer_id String?
  is_premium       Boolean  @default(false)
  premium_since    DateTime?
  premium_until    DateTime?
  created_at       DateTime @default(now())
  updated_at       DateTime @updatedAt

  watchlists   Watchlist[]
  price_alerts PriceAlert[]
  subscriptions Subscription[]
}

model Subscription {
  id                     String   @id @default(uuid())
  user_id                String
  stripe_subscription_id String   @unique
  status                 String
  plan_name              String
  price_amount           Int
  current_period_start   DateTime
  current_period_end     DateTime
  created_at             DateTime @default(now())
  updated_at             DateTime @updatedAt

  user User @relation(fields: [user_id], references: [id])
}

model Watchlist {
  id         String   @id @default(uuid())
  user_id    String
  card_id    String
  note       String?
  created_at DateTime @default(now())

  user User @relation(fields: [user_id], references: [id])
  card Card @relation(fields: [card_id], references: [id])

  @@unique([user_id, card_id])
}

model PriceAlert {
  id           String    @id @default(uuid())
  user_id      String
  card_id      String
  target_price Int
  condition    String    @default("below")
  is_active    Boolean   @default(true)
  triggered_at DateTime?
  created_at   DateTime  @default(now())

  user User @relation(fields: [user_id], references: [id])
  card Card @relation(fields: [card_id], references: [id])
}

model PriceHistory {
  id           String   @id @default(uuid())
  card_id      String
  price        Int
  recorded_at  DateTime @db.Date
  source       String?
  created_at   DateTime @default(now())

  card Card @relation(fields: [card_id], references: [id])

  @@unique([card_id, recorded_at])
}
```

---

## 4. MVP時点での最小構成

MVPでは以下のテーブルのみで開始し、将来のテーブルは空テーブルまたは後から追加します。

**MVP必須テーブル**
1. `Game` — ゲーム種別（ポケモンカードのみ初期登録）
2. `Card` — 注目カード
3. `ArticleCategory` — 記事カテゴリ
4. `Article` — 記事
5. `BudgetStrategy` — 予算別戦略
6. `StrategyCardItem` — 戦略内カード構成

**Phase 2で追加**
7. `User`
8. `Subscription`
9. `Watchlist`
10. `PriceAlert`

**Phase 3で追加**
11. `PriceHistory`

---

## 5. 将来的な拡張設計ポイント

| 拡張 | 対応方法 |
|------|---------|
| ワンピースカード対応 | `Game` テーブルに1レコード追加、`Card.game_id` で紐付け、UIで切替 |
| 他のTCG対応 | 同様に `Game` テーブルの追加のみ |
| 価格自動取得 | `Card.card_code` を外部APIキーとして利用 |
| AI分析スコア | `Card` テーブルに `ai_popularity_score`, `ai_rarity_score`, `ai_future_score` を追加 |
| ランキング | `PriceHistory` テーブルから日次・週次・月次の変動率を集計クエリで算出 |

---

*作成日: 2026-06-05*
