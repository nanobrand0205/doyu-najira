# Doyu Board

同友会の支部運営を支えるマルチテナント型アプリ。三条支部での表示名は「なじらボード」。

e-doyu(事業登録・出欠管理・全体名簿)を置き換えるものではなく、支部内の
例会準備・なじら会(支部ごとに名称変更可)・チームミーティング・Google Drive
資料管理・Google Calendarリマインド・Gmailによる候補者フォロー・会員カルテ・
組織図をひとつにまとめる「支部活動の司令塔」です。

初期リリースは三条支部のみで運用しますが、燕支部・長岡支部など他支部への
展開を見据え、データモデル・権限・Google連携はすべて支部(Branch)単位で
分離されたマルチテナント構成になっています。

## 技術スタック

- Next.js (App Router) / TypeScript / Tailwind CSS v4
- UIコンポーネントは shadcn/ui 相当のものを手動実装(`src/components/ui`)
- Prisma + PostgreSQL(本番は Supabase を推奨)
- NextAuth.js (v5) + Google OAuth(個人ログイン)
- googleapis(支部単位のDrive / Calendar / Gmail 連携)
- デプロイ: GitHub → Vercel(自動デプロイ)、DBはSupabase

## マルチテナント設計

- `Branch` テーブルが支部(テナント)の単位。会員・チーム・例会・なじら会・
  資料・タスク・候補者・メール履歴・LINE投稿など支部に属するデータは
  すべて `branchId` を持ち、クエリ層(`src/lib/data/*.ts`)とserver action層
  (`src/lib/data/guard.ts` の `requireBranchSession` / `assertBranchOwnership`)
  の両方で、必ずログインユーザー自身の `branchId` に絞り込みます。他支部の
  データは仕組み上参照・更新できません。
- `BranchSettings` に支部名・アプリ内表示名・「なじら会」「例会」などの名称・
  テーマカラー・署名を持たせ、UI文言(サイドバー、ナビ、LINE/Gmail文面など)は
  ここから動的に決まります。三条支部では以下のように設定されています。
  - 支部名: 三条支部 / アプリ内表示名: なじらボード
  - 幹事会の名称: なじら会 / 例会の名称: 例会
- `GoogleIntegration` は支部単位のGoogle Workspace共有アカウント連携
  (Drive/Calendar/Gmail)を保持します。個人のログイン(NextAuthの`Account`)
  とは別物です。Settings画面の「支部としてGoogleに接続する」から
  `branch_admin` が接続します。
- 権限は5段階: `SUPER_ADMIN`(全支部管理、`branchId`なし) /
  `BRANCH_ADMIN`(支部管理者) / `BRANCH_MANAGER`(幹事) /
  `BRANCH_MEMBER`(会員) / `VIEWER`(閲覧のみ)。`SUPER_ADMIN` は `/admin` で
  支部一覧の確認・新規支部の作成(最初の`branch_admin`を1名登録)ができます。
- RLS(Row Level Security): `prisma/migrations/*_rls_policies` に、全テナント
  テーブルへ `branchId` ベースのRLSポリシーを用意しています。**現状はアプリ層の
  `branchId` フィルタが実効的なアクセス制御の主軸で、このRLSポリシーはSET LOCAL
  によるセッション変数連携が未実装のため実発動していません**(Supabaseの
  `postgres`ロール接続はBYPASSRLSのため安全に適用できます)。次のフェーズで
  リクエスト単位のトランザクションから `SET LOCAL app.current_branch_id` を
  発行するようになれば、正式な多層防御として機能します。

## セットアップ(ローカル開発)

```bash
npm install
cp .env.example .env   # 値を編集 (ローカルはDATABASE_URL/DIRECT_URLのみでOK)
npx prisma migrate dev
npm run db:seed        # 三条支部のデモデータ投入
npm run dev
```

### 環境変数

`.env.example` を参照してください。

- `DATABASE_URL` / `DIRECT_URL`: PostgreSQL接続文字列。Supabaseではpoolerと
  直接接続の2つを分けて設定します(詳細は`.env.example`のコメント参照)。
- `AUTH_SECRET`: `openssl rand -base64 32` で生成
- `AUTH_URL`: 本番URL(Vercelでは自動設定されるため通常は省略可)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: Google Cloud ConsoleでOAuth
  クライアントを作成してください。個人ログイン用と支部単位のDrive/Calendar/Gmail
  連携用で、同じクライアントを使い回せます(リダイレクトURIを両方登録)。
- `DEMO_MODE`: `true` にすると、Google未連携でもログイン画面から役割ごとの
  デモアカウント(支部管理者・幹事・会員・運営管理者)でログインし、画面を
  確認できます。**本番環境では必ず `false` にするか未設定にしてください。**

## 権限モデル

| 役割 | 説明 |
| --- | --- |
| 閲覧のみ (VIEWER) | 支部の公開情報を閲覧のみ |
| 会員 (BRANCH_MEMBER) | 閲覧中心。ダッシュボード・例会・なじら会・資料・会員・組織図を閲覧 |
| 幹事 (BRANCH_MANAGER) | 例会計画書・なじら会・資料・LINE投稿文・候補者フォロー・設定の一部を編集 |
| 支部管理者 (BRANCH_ADMIN) | 幹事の権限に加え、年度設定・ユーザー権限管理・Google連携・支部設定 |
| 運営管理者 (SUPER_ADMIN) | `/admin` で全支部の一覧・新規支部の作成(支部横断、`branchId`なし) |

候補者情報・メール履歴は `BRANCH_MANAGER` 以上のみ閲覧・編集できます。

## 実装済み機能 (Phase 1 MVP)

- Googleログイン(Google未連携時はデモログイン)と役割別の画面出し分け
- ダッシュボード(会員向け・幹事向け)
- 例会一覧・詳細、例会計画書のステータス管理(下書き→…→振り返り完了)
- なじら会一覧・詳細(次第・決定事項・継続協議・宿題・上程中の計画書)
- 資料BOX(Google Driveリンクの登録・種別/年度フィルタ)
- 会員一覧・会員カルテ
- 組織図(年度切り替え)
- LINE投稿文・Gmail下書きの自動生成 + コピー機能(支部名・署名は動的)
- 候補者フォロー管理(ステータス・次回連絡日・メール下書き)
- 設定(支部単位のGoogle連携、年度設定、ユーザー権限)
- 運営管理者向け最小画面(`/admin`: 支部一覧・新規支部作成)

## Phase 2 / 3 (未実装・今後の拡張ポイント)

- RLSのSET LOCAL連携(上記「マルチテナント設計」参照)によるDB層の多層防御
- Google Calendarへの自動登録・逆算リマインダー生成
  (`src/lib/google` にDrive連携の実装例あり。Calendar/Gmail送信も同様の
  パターンで `googleapis` クライアントを組み込める設計にしてあります)
- Gmail実送信(現在はテンプレート生成 + コピーのみ)
- タスクの自動生成(例会日から逆算)
- なじら会資料からのAI要約・ToDo抽出
- 新規支部の会員・チーム・組織図データを画面から登録するCRUD
  (現状、`/admin/new` で支部と最初の管理者は作成できますが、会員や
  チームなどの初期データ投入は本リリースの範囲外です)
- 操作ログ・監査ログ、論理削除

## デプロイ(GitHub → Vercel + Supabase)

1. **Supabaseプロジェクトを作成**し、Project Settings → Database から
   Connection string(Transaction pooler / Direct connection)を控えます。
2. **Vercelプロジェクトを作成**し、このGitHubリポジトリを接続します。
3. Vercelの Environment Variables に以下を設定します(Production/Preview両方):
   - `DATABASE_URL`(Supabaseのpooler接続文字列)
   - `DIRECT_URL`(Supabaseの直接接続文字列)
   - `AUTH_SECRET`
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
   - `DEMO_MODE` は本番では設定しない(または `false`)
4. Google Cloud ConsoleのOAuthクライアントに、Vercelの本番URLを使って
   リダイレクトURIを2つ登録します:
   - `https://<your-domain>/api/auth/callback/google`(個人ログイン)
   - `https://<your-domain>/api/google/callback`(支部単位のDrive/Calendar/Gmail連携)
5. 初回のみ、Supabaseに対してマイグレーションとseedを実行します
   (ローカルから `DATABASE_URL`/`DIRECT_URL` をSupabaseに向けて実行するか、
   Vercelのビルドフックで `prisma migrate deploy` を実行する運用にしてください)。
   ```bash
   npx prisma migrate deploy
   npm run db:seed   # 三条支部の初期データが必要な場合のみ
   ```
6. GitHubにpushすると、Vercelが自動でビルド・デプロイします。デプロイ後、
   公開URLの `/login` からログイン画面が確認できます。

※ 上記の「プロジェクト作成」「Secret設定」「実際のデプロイ実行」は、
Vercel/Supabase/Google Cloudの各アカウントでの操作が必要です。

## ディレクトリ構成

```
prisma/schema.prisma          データモデル (Branch/BranchSettings/GoogleIntegration含む)
prisma/seed.ts                 デモデータ (三条支部)
prisma/migrations/*_rls_policies  RLSポリシー(defense-in-depth、上記参照)
src/lib/auth.ts                 NextAuth設定 (Node runtime)
src/lib/auth.config.ts         NextAuth設定 (Edge / proxy用)
src/proxy.ts                    ルート保護 (旧middleware)
src/lib/branch-settings.ts      支部設定(表示名・ラベル)の取得
src/lib/data/guard.ts           branchIdスコープ・所有権チェックの共通ヘルパー
src/lib/google/                Drive/Calendar/Gmail連携(支部単位)
src/lib/data/                   Prismaクエリ(ページ単位、すべてbranchId必須)
src/components/ui/              shadcn/ui相当のUIプリミティブ
src/components/layout/          サイドバー・ボトムナビ・ヘッダー
src/components/providers/       支部設定のReact Context
src/app/(app)/                  支部スコープの認証必須ページ群
src/app/(admin)/admin/          SUPER_ADMIN向け最小画面(支部一覧・新規作成)
src/app/api/google/             支部単位のGoogle OAuth接続フロー
```
