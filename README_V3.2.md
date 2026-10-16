# Our Quest V3.2 — Test release

Upload all files and the assets folder to your existing GitHub Pages repository. Back up your Supabase data before installing.

New: coupon management (edit/archive), expired quest cleanup, per-task mass editor, seasonal date windows, favorite daily Home list, task template availability filtering and visible version.

Important: Deleting an active task is exposed in the Mass Task Editor. Task completion history and XP records are retained. Reward deletion archives the shop listing to preserve purchased coupons.

The app still uses a shared JSON state without server-enforced admin permissions or concurrency-safe transactions. Browser + live Supabase testing is required.
