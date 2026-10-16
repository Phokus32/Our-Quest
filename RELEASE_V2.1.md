# Our Quest V2.1 — Feature Foundation Release

This package builds on V2.0.6 and preserves the existing Supabase configuration and shared JSON payload. It adds new `v21.js` and `v21.css` files. Upload the entire package contents to the root of the existing GitHub Pages repository. **Back up your shared game before installing.**

## Implemented in this release
- Daily and weekly chest claims with guaranteed XP/gold and a chance at bonus gold
- Couple Adventures with Matthew, Beth and jointly confirmed objectives, with one-time completion rewards
- Manual journal entries plus automatic records of completed Couple Adventures and chest openings
- Coupon wishlist with admin review, pricing and publishing to the Reward Shop
- Achievement collection and administrator-created achievements with manual awarding
- Basic monthly calendar and agenda/weekly date selection based on existing tasks and completion logs
- Analytics summary from the existing XP/gold ledger and CSV export
- Activity history and administrator balance adjustments with an adjustment audit record
- Universal search for tasks, quests, goals, rewards, adventures and journal entries, with saved searches
- Economy settings for caps, chest thresholds, streak limit storage and other reward values
- Task editor removes the difficulty field and adds maximum XP per completion, including bonus XP
- Custom quests become one-time only for newly created quests; replay of already approved quests is blocked
- Goal milestone progress bars and personalized Home shortcut visibility

## Important limitations: not yet implemented or verified
- Not fully feature-complete against the V2.1 design: journal photo uploads, background push reminders, custom recurring calendar events, sophisticated achievement rules, full search filters and date ranges, full dashboard drag ordering, tiered chest loot, custom quest icon picker and advanced analytics visualizations are not included.
- The level curve setting is stored but does not yet alter the legacy leveling formula.
- The shared game is still a JSON document saved using the existing Supabase RPC. This is **not** a server-side transactional ledger; simultaneous device edits and duplicate requests may still cause conflicts. Admin checks are client-side and should not be considered tamper-proof authorization.
- Browser syntax checked, but the complete app was not interactively tested against your live Supabase project or both accounts. Treat this as a **preview / foundation build**, not a production-verified final release.

## Installation
1. In the existing live V2.0.6 app, export a backup of your game data.
2. Download and extract the ZIP, then upload all files and the `assets` folder to the same GitHub repository root. Preserve `config.js` or use your existing working config.
3. Wait for GitHub Pages to publish and reload on both devices. If stale assets persist, remove the old website cache or re-open in a private tab.
4. Confirm login and cloud saving before making large edits. Test the atlas picker and task editor with one small task.
5. Do not delete your Supabase tables or replace your existing `schema.sql` on the live database. No new SQL migration is required for this additive preview.

## Safety
Existing shared records are not intentionally reset or deleted. New V2.1 data is stored under `payload.oq21`. A backup and cautious first-run test are strongly recommended.
