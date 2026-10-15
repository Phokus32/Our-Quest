# Our Quest V1.1 — Local Interactive Prototype

This release expands the Stage 1 prototype. Open `index.html` in a desktop browser, or host the folder on HTTPS for PWA installation. The included approved-style Our Quest icon, manifest and service worker are preserved.

## What's new in V1.1

- Quest acceptance, submission and **sender approval** now credit the recipient XP once per approved completion. Quest limits of 1–20 completions per day can be configured on creation. A quest can be repeated after approval until its limit is reached, or on the following day.
- Only the Matthew demo profile can create/edit tasks, create categories, edit rewards and change economy settings. **This is a UI-only demo restriction, not secure authorization.**
- Admin-created categories with recurrence defaults, task duplication and bulk category schedule changes.
- Tasks support daily, weekly (Monday-start), monthly, quarterly, annual and one-time recurrence, per-period completion limits, optional hours and optional weekdays. A completed task disables until its next eligible period.
- Level titles, six initial achievements, a 35-day activity heatmap and XP/gold transaction ledger.
- Daily, weekly and monthly champion calculation, with configurable rewards. The demo settles past periods when the app opens. Winner rewards are not included in competition scores. Historical champion accuracy is limited by locally recorded ledger data.
- Coupon wallet, redemption request, provider fulfillment confirmation and purchase/usage history. Includes Dinner at Olive Garden (1,000 gold).
- Pending quest/coupon approval inbox, recent-completion undo with XP/gold reversal and data export/restore.

## Test quest approval

1. Select Matthew. Open Quests and send a quest to Beth.
2. Select Beth. Accept the quest and mark it complete. No XP should be awarded yet.
3. Select Matthew. Open Approvals or Quests and approve the completion.
4. Select Beth. The approved XP and resulting gold should now appear. Repeat the quest if configured for multiple completions.

## Test task recurrence

1. Select Matthew. Open Tasks > Create Task.
2. Select a category, recurrence, XP value and maximum completions per period.
3. Complete the task until its counter reaches the maximum. The button should disable until the next period.

## Limitations and important safety notes

**This is NOT yet the final cloud-connected V1.0 described in the 70-question specification.** Both profiles are simulated in the same browser. There is no Supabase connection, real authentication, cross-device synchronization, true privacy enforcement, secure admin permissions, remote messaging, phone push notifications, guaranteed automatic backups or reliable server-side scheduled settlement. Anyone with access to the browser storage can change its data. Do not use this build for sensitive/private task details or as a trusted real-world ledger.

The app retains the Stage 1 localStorage key so existing data in the same browser and origin can migrate. Export a backup before replacing a deployed copy. If the origin changes, data will not automatically follow. Old quest/log records are retained but may lack newer ledger metadata. Backup/restore is manual. Undo is limited to recent task completions and can produce a negative coin balance if coins have already been spent.

The first prototype remains a standalone HTML/CSS/JavaScript application. Further backend integration is required before two real devices can use it together.
