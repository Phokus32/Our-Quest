# Our Quest V3.6.9 — Low Bandwidth & Shared Tasks

## Included
- First Come, First Served and Individual completion modes in Create/Edit Task.
- First Come, First Served shares each task's completion slots across Matthew and Beth, regardless of original assignment.
- Player Activity statistics with Matthew, Beth and Compare Both plus Today, This Week, This Month, This Year and All Time.
- Cloud polling changed from downloading the full state every 8 seconds to a revision-only check every 60 seconds, with full payload downloaded only after a detected revision change.
- Hidden tabs skip background polling. Returning to the app, focus and reconnection trigger revision checks.
- Shared task claims perform a server revision preflight and use the existing revision-checked cloud save. Simultaneous claims: the database rejects a stale revision; the losing device must refresh. Do not ignore any conflict warning.
- Existing V3.6.8 features remain in place.

## Important limits
- This is a client-side optimization of the existing shared JSON state, not a database schema migration. Every successful write still uploads the entire state. High-frequency writes can continue to consume egress.
- Realtime updates are not instant while a tab is idle: background checks are intentionally reduced. On return to the app, changes are checked.
- Concurrent edits of different objects can still trigger the existing conflict warning. Back up data before installing and refresh the losing browser after a conflict.
- Statistics rely on existing logs and may not cover historical activity that was never logged.

## Deployment
1. Export/backup your data in the existing app.
2. Upload all files from this ZIP to the existing GitHub Pages repository, retaining config.js and assets as appropriate.
3. Hard refresh on both devices.
4. Test a shared daily task in two signed-in sessions; test both completion orders.
5. Monitor Supabase Egress for 24–48 hours to verify actual savings.
