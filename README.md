# Our Quest V1.3.0 — Local Prototype

## Start
Unzip this folder and open `index.html` in a modern browser. For the installable PWA and reliable IndexedDB support, deploy the complete folder to an HTTPS site (for example GitHub Pages). Do not upload only index.html: the assets, manifest and service worker must accompany it.

## New in V1.3
- **Icon Atlas Library:** The provided `Everyday Adventures` 10 × 10 PNG contains 100 icons. Matthew can open Tasks → Create/Edit Task → Choose from Icon Atlas, click any grid cell and save. Tasks reference the page and cell without creating individual icon files.
- **Upload more icon pages:** Open Icon Atlas Library and upload square 10 × 10 image sheets. The app resizes and stores uploaded sheets locally in IndexedDB. You can rename pages and delete unused pages. Atlas pages referenced by tasks cannot be deleted.
- **Task schedules:** Task editor includes 1, 2, 3 or 4 times/day; 1 or 2 times/week; once/month; once/3 months; once/6 months; once/year and one-time. The app uses calendar periods (Sunday–Saturday weeks, calendar months, calendar quarters and half-years). Completed tasks grey out when their limit is reached and reactivate in the next period. Task descriptions appear on cards.
- **Daily login bonuses:** A claimable daily XP and gold reward appears on the Overview. The admin can change the values in Settings. Each demo profile can claim once per local calendar day.
- **Weight milestone goals:** Create Goal → Weight goal; enter starting weight, target and a custom milestone reward. Update weight to see the progress bar and history. This is optional personal data, stored locally in this prototype.
- **Quest change comments:** Requesting changes to a submitted quest prompts for a written explanation.
- **Version:** Visible V1.3.0.

## What remains from V1.2
Quests with proof photos and sender approval, player XP requests with questions/counteroffers, Recent Partner Activity, messages and photo attachments, task/coupon artwork, achievements, champion bonuses, coupon tracking, admin-only task editing and XP/gold ledger.

## Important limitations
- This is still a **single-browser local prototype**. Matthew and Beth are simulated profiles; switching is not secure authentication. No live phone-to-phone syncing, Supabase database or private cloud photo storage exists yet.
- Uploaded atlas pages live in **IndexedDB** on the same browser and origin. The JSON export does **not** include these uploaded atlas images, so keep original source PNGs separately. Replacing the hosting origin or clearing browser storage may lose them.
- Photos from prior versions remain in browser localStorage, which has limited capacity.
- A weight-goal milestone reward is a displayed goal description, **not** an automatically purchased or fulfilled prize.
- Daily login bonuses are claimed manually, not automatically delivered by a cloud scheduler.
- No end-to-end browser visual test was possible in this environment. JavaScript syntax and deterministic scheduling/atlas/login smoke checks passed.

## Updating
**Export a JSON backup from V1.2 before updating.** Keep the same hosted URL/origin to preserve the existing `ourquest-stage1-data-v1` data key. Keep your uploaded atlas PNGs separately. Deploy all files in the package and refresh the browser. The app may need a reload to replace cached PWA files.
