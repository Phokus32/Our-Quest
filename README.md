# Our Quest - V1.0 Stage 1 Interactive Foundation

This is an **interactive, local-only foundation**, not the fully deployed two-account V1.0. The entire 70-decision scope is planned for later stages. Do not treat the player switcher as authentication or local data as cloud sync.

## Run it

1. Unzip all files into a folder.
2. Open `index.html` in a modern browser to try the local demo. (Browser storage behavior may differ on file URLs.)
3. For the installable PWA, serve the directory over HTTPS, such as GitHub Pages. The app includes `manifest.webmanifest`, a service worker and the approved-logo-derived icon.
4. In the mobile browser, use Add to Home Screen / Install app.

## What works in Stage 1

- Responsive fantasy-themed dashboard, desktop sidebar and mobile navigation.
- Two selectable local preview profiles with separate XP, coins and activity records.
- Create and edit shared/private tasks, log XP, levels and automatic coin earnings.
- Send quests, accept/decline, mark complete and approve to award XP.
- Create and buy coupons, wallet and simplified redemption.
- Local message history, personal/shared goals, simple statistics and history.
- Local settings, JSON backup/export and import/restore.
- Installable PWA on HTTPS and basic static-file offline caching.

## Not yet implemented or secure

- Real two-user sign-in, cloud database, synchronization across devices, Row Level Security, protected XP transactions, secure privacy enforcement.
- Real-time messaging, push notifications, read receipts, images and attachments.
- Complete five-tier task configuration, schedules, streak protection, challenges, infinite achievements, prestige, coupon provider approvals and comprehensive analytics.
- Production-grade offline write queue, conflict resolution, automated backups, restore verification, migrations and deployment tests.

## Data warning

Data is saved in browser `localStorage` and may be lost if browser data is cleared. Export JSON backups frequently. A shared browser user can switch between both preview identities and see their data. **Do not store sensitive private information in this stage.**

## Next development milestone

Add Supabase Auth, PostgreSQL schema and Row Level Security, backend-validated XP/coins and proper two-device synchronization. Keep secrets out of frontend source code. Publishable keys may be public, service-role keys must never be shipped to the browser.
