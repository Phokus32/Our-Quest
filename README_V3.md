# Our Quest V3.0

Deploy **all files and the assets directory** to the existing GitHub Pages repository. Keep config.js values unchanged. Refresh the app and allow its service worker to update. Existing cloud data is not intentionally reset.

## New
- Fifth bundled 10x10 transparent PNG icon atlas: Quest Tasks (100 icons).
- 48 task library templates with suggested XP, recurrence and atlas icons. Admin-only activation with per-task review, player assignment and optional streak bonus.
- Per-player task favorites and Favorites task filter.
- Weight history logging, dated entries, visual trend and pending administrator milestone approval with redemption status.
- Fix for crop rendering: previous CSS forced 1000% background size and overrode the crop selection.

## Notes and limitations
- Task library is preloaded as templates only; nothing is activated automatically.
- No automatic XP/gold is awarded for milestone rewards. Milestone rewards are tracked as descriptions and approval/redemption states.
- Weight logs and milestone approvals use the app's existing shared cloud JSON state. The current architecture does not enforce role restrictions server-side, and concurrent edits may overwrite each other.
- Browser-only smoke tests are not a substitute for testing with both actual Supabase accounts on the live deployment.
- Atlas artwork contains some colored effects around icons; its PNG background is transparent.
