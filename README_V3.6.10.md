# Our Quest V3.6.10 — Low-bandwidth task completions and batch admin edits

## Mandatory Supabase SQL upgrade

1. Export a backup of `public.oq_shared_state` before changing anything.
2. Open **Supabase → Our Quest project → SQL Editor → New query**.
3. Paste and run `V3.6.10_SUPABASE_UPGRADE.sql`. It creates/replaces one function. It does not drop or overwrite game data.
4. Upload all web app files from this ZIP to your existing GitHub Pages repo. Preserve your actual `config.js` and existing asset images. The ZIP contains the previous config.js: don't replace your working configuration without checking it.
5. Hard refresh on both phones/computers and confirm version V3.6.10 files are loaded.
6. Test one task completion on Matthew's account and verify XP, coins, completion log and achievements. Then test a First Come, First Served task on Beth's account.
7. On Matthew's account, select **Start Batch Editing**, edit several quests/rewards/tasks, then **Save All Changes**. Confirm Beth sees the updates after refresh.

## Design / limitations

- Each task completion uses the `oq_complete_task` RPC, sending task ID, date and expected cloud revision. The server serializes simultaneous claims and updates XP, gold, history and basic task achievements atomically. It returns only the changed records rather than the full state.
- The original JSON shared-state table is retained. Server-side processing still rewrites the JSON document internally, but the browser no longer uploads that JSON for normal task completion.
- **Batch Editing** is an explicit admin mode. While enabled, all edits are staged locally and a single full-state cloud save occurs on **Save All Changes**. Task completions are disabled until you finish batch editing. The mode should not be used concurrently with changes on Beth's device. A revision conflict prevents overwriting remote changes.
- The app preserves a local draft snapshot while editing. If you close the browser unexpectedly, the draft is retained in localStorage, but this release does not automatically restore it. Export a backup before navigating away or clearing browser data.
- Other actions (messaging, approvals, coupon redemption and goal updates) still use full-state saves. They are not yet separate lightweight database operations.
- The server checks assignment, archived/hidden status and completion limits. Client-side hour/day and seasonal availability checks still apply, but those schedules are not yet fully validated by the SQL function. Avoid relying on browser-side schedule restrictions as an anti-cheating security control.
- Calendar date boundaries may differ between device and Supabase server near midnight. The server allows dates within one day of its current date.
- No claim of verified live Supabase behavior: SQL must be run and tested in your project.
