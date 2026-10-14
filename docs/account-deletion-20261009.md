# Account deletion update — 2026-10-09 (Asia/Seoul)

Self withdrawal and administrator withdrawal share `account-deletion-client.js`. The client refreshes a rejected session once, stops if the acting account changes, and does not automatically retry ambiguous network or partial cleanup failures. Administrative deletion refreshes the member summary/list on success.

The Deno entrypoint wraps the testable handler so connection metadata cannot replace its injected createClient argument (the original entrypoint caused runtime errors after the initial request checks). The Edge Function authenticates the supplied token through Auth.getUser before any privileged operation. Administrator targets require server-side is_admin verification; protected administrators cannot be deleted. Recent sign-in (15 minutes) is required. Gateway JWT verification is disabled because authentication is performed in the function and supports current signing keys. Storage objects are removed using the Storage API before transactional activity cleanup and Auth deletion. Errors identify the failed stage and release the retry lease. Once Auth deletion succeeds, a final bookkeeping failure is returned as deleted with cleanup_pending.

The database cleanup now removes user_badges and reports referencing reviews cascaded by a deleted course. Restrictive badge write policies prevent writes by deleted or deletion-in-progress accounts. Deletion RPCs remain callable only by service_role.

Validation: `node tests/account-deletion.mjs` exercises self/admin targets, protections, storage order, failures, lease release, one session retry, switched accounts, uncertain network failures and post-delete bookkeeping errors. A database transaction used two synthetic users and asserted badge/course/review/report cleanup plus preservation of unrelated data, then rolled back. All 16 existing members remain; no test users or jobs remain. No real member was deleted. Deployed endpoint returned 401 for missing authentication and 204 for the allowed origin preflight.

The browser clears local saved-place/registration context after successful self withdrawal. External provider accounts, backups and external caches are outside this deletion flow. Actual Auth/Storage destructive operations are covered by mocks; they were not run against an existing member for validation.


## 2026-10-14 administrator-session and member-roster correction

Administrative deletion no longer calls signOutUser when recent authentication is required. The existing admin session stays in place while the sign-in dialog explains how to authenticate again as the same administrator; no deletion is automatically replayed after sign-in. The server's 15-minute sensitive-session check remains enforced. A successful response must identify the selected target before the client removes a member from its list. Self withdrawal keeps its original session cleanup flow.

Member-roster RPCs v1/v2/v3 now exclude anonymous accounts and require email_confirmed_at and last_sign_in_at. Pending email Auth accounts remain intact so their magic links can still complete login. The admin member list, total count and exports share this filtered roster. Tests use rollback-only synthetic accounts to verify pending/confirmed-but-not-signed-in filtering and immediate inclusion after first authenticated sign-in. Existing Google/Kakao member accounts remain included.

Validation: node tests/admin-withdraw.cjs; node tests/account-deletion.mjs; supabase/tests/verified_member_roster.sql; updated member_event_contract.sql. No existing member was deleted during validation.
