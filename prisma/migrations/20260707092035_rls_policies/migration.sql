-- Defense-in-depth Row Level Security policies for multi-tenant isolation.
--
-- The application already enforces tenant isolation at the query layer:
-- every Prisma query in src/lib/data/*.ts and every server action is scoped
-- by branchId (see src/lib/data/guard.ts). That is the primary, currently
-- effective access control.
--
-- These policies are a defense-in-depth backstop, keyed on the Postgres
-- session variable `app.current_branch_id`. IMPORTANT: this backstop is not
-- yet actually enforced end-to-end, because:
--   1. Prisma's client here connects with a role that has not been
--      configured to bypass-disable RLS explicitly either way, and
--   2. the app does not yet run each request inside a transaction that
--      issues `SET LOCAL app.current_branch_id = '<branchId>'` before
--      querying.
-- Until that wiring is added (a Prisma Client Extension wrapping each
-- request in a transaction), `current_setting(..., true)` returns NULL for
-- every connection, so these policies pass through only rows where the
-- comparison is against NULL, i.e. effectively allow-nothing for a normal
-- app connection lacking that context. Enabling RLS with a real Supabase
-- non-bypass DB role plus the SET LOCAL wiring is a documented follow-up
-- (see README "Phase 2/3").

ALTER TABLE "Member" ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "Member"
  USING ("branchId" = current_setting('app.current_branch_id', true));

ALTER TABLE "Team" ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "Team"
  USING ("branchId" = current_setting('app.current_branch_id', true));

ALTER TABLE "OrgPosition" ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "OrgPosition"
  USING ("branchId" = current_setting('app.current_branch_id', true));

ALTER TABLE "FiscalYear" ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "FiscalYear"
  USING ("branchId" = current_setting('app.current_branch_id', true));

ALTER TABLE "Event" ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "Event"
  USING ("branchId" = current_setting('app.current_branch_id', true));

ALTER TABLE "NajiraDetail" ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "NajiraDetail"
  USING ("branchId" = current_setting('app.current_branch_id', true));

ALTER TABLE "NajiraAgendaItem" ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "NajiraAgendaItem"
  USING ("branchId" = current_setting('app.current_branch_id', true));

ALTER TABLE "Plan" ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "Plan"
  USING ("branchId" = current_setting('app.current_branch_id', true));

ALTER TABLE "FileAsset" ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "FileAsset"
  USING ("branchId" = current_setting('app.current_branch_id', true));

ALTER TABLE "Task" ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "Task"
  USING ("branchId" = current_setting('app.current_branch_id', true));

ALTER TABLE "Candidate" ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "Candidate"
  USING ("branchId" = current_setting('app.current_branch_id', true));

ALTER TABLE "EmailLog" ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "EmailLog"
  USING ("branchId" = current_setting('app.current_branch_id', true));

ALTER TABLE "LinePost" ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "LinePost"
  USING ("branchId" = current_setting('app.current_branch_id', true));

ALTER TABLE "BranchSettings" ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "BranchSettings"
  USING ("branchId" = current_setting('app.current_branch_id', true));

ALTER TABLE "GoogleIntegration" ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "GoogleIntegration"
  USING ("branchId" = current_setting('app.current_branch_id', true));

-- User.branchId is nullable (SUPER_ADMIN has none); rows with a NULL
-- branchId simply won't match any branch-scoped session, which is correct:
-- branch-scoped connections should never see the cross-branch super_admin.
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "User"
  USING ("branchId" = current_setting('app.current_branch_id', true));
