# なじらボード

新潟県中小企業家同友会 三条支部向けの支部運営アプリ。

e-doyu(事業登録・出欠管理・全体名簿)を置き換えるものではなく、支部内の
例会準備・なじら会・チームミーティング・Google Drive資料管理・Google
Calendarリマインド・Gmailによる候補者フォロー・会員カルテ・組織図を
ひとつにまとめる「支部活動の司令塔」です。

## 技術スタック

- Next.js (App Router) / TypeScript / Tailwind CSS v4
- UIコンポーネントは shadcn/ui 相当のものを手動実装(`src/components/ui`)
- Prisma + PostgreSQL(本番は Supabase を推奨)
- NextAuth.js (v5) + Google OAuth
- googleapis(Drive / Calendar / Gmail 連携の下地)

## セットアップ

```bash
npm install
cp .env.example .env   # 値を編集
npx prisma migrate dev
npm run db:seed        # デモデータ投入(任意)
npm run dev
```

### 環境変数

`.env.example` を参照してください。

- `DATABASE_URL`: PostgreSQL接続文字列
- `AUTH_SECRET`: `openssl rand -base64 32` で生成
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: Google Cloud ConsoleでOAuthクライアントを作成し、
  Drive / Calendar / Gmail APIを有効化してください。スコープは
  `drive.file` `calendar.events` `gmail.send` `gmail.compose` を使用します。
- `DEMO_MODE`: `true` にすると、Google未連携でもログイン画面から役割ごとの
  デモアカウント(支部長・幹事長・幹事・事務局・会員)でログインし、画面を
  確認できます。**本番環境では必ず `false` にするか未設定にしてください。**

## 権限モデル

| 役割 | 説明 |
| --- | --- |
| 会員 (MEMBER) | 閲覧中心。ダッシュボード・例会・なじら会・資料・会員・組織図を閲覧 |
| 幹事 (SECRETARY) | 例会計画書・なじら会・資料・LINE投稿文・候補者フォロー・設定の一部を編集 |
| 事務局 (ADMIN) | 幹事の権限に加え、年度設定・ユーザー権限管理 |
| 支部長・幹事長 (MANAGER) | 全データの編集、年度・権限管理 |

## 実装済み機能 (Phase 1 MVP)

- Googleログイン(Google未連携時はデモログイン)と役割別の画面出し分け
- ダッシュボード(会員向け・幹事向け)
- 例会一覧・詳細、例会計画書のステータス管理(下書き→…→振り返り完了)
- なじら会一覧・詳細(次第・決定事項・継続協議・宿題・上程中の計画書)
- 資料BOX(Google Driveリンクの登録・種別/年度フィルタ)
- 会員一覧・会員カルテ
- 組織図(年度切り替え)
- LINE投稿文・Gmail下書きの自動生成 + コピー機能
- 候補者フォロー管理(ステータス・次回連絡日・メール下書き)
- 設定(Google連携状態、年度設定、ユーザー権限)

## Phase 2 / 3 (未実装・今後の拡張ポイント)

- Google Calendarへの自動登録・逆算リマインダー生成
  (`src/lib/google` にDrive連携の実装例あり。Calendar/Gmail送信も同様の
  パターンで `googleapis` クライアントを組み込める設計にしてあります)
- Gmail実送信(現在はテンプレート生成 + コピーのみ)
- タスクの自動生成(例会日から逆算)
- なじら会資料からのAI要約・ToDo抽出

## ディレクトリ構成

```
prisma/schema.prisma        データモデル
prisma/seed.ts               デモデータ
src/lib/auth.ts              NextAuth設定 (Node runtime)
src/lib/auth.config.ts       NextAuth設定 (Edge / proxy用)
src/proxy.ts                 ルート保護 (旧middleware)
src/lib/google/              Drive/Calendar/Gmail連携の下地
src/lib/data/                Prismaクエリ(ページ単位)
src/components/ui/           shadcn/ui相当のUIプリミティブ
src/components/layout/       サイドバー・ボトムナビ・ヘッダー
src/app/(app)/                認証必須ページ群
```
