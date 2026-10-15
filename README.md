# Our Quest V1.4.0 — Local Interactive Prototype

Open `index.html` to test. Keep this folder together when hosting. This build still uses local browser storage and simulated profile switching, not Supabase or secure accounts.

## Changes
- Three bundled 10 × 10 atlas sheets with 300 selectable icons; icon preview while editing.
- Task frequency selector limited to Daily, Weekly, Monthly, Annual, with separate completion count. Calendar period resets retained.
- Admin-configurable consecutive-day XP percentage and same-day repeat XP percentage, awarded with transaction ledger entries.
- Individual weight goals seeded once: Beth 250 → 159 lb, Matthew 365 → 190 lb. Beth final milestone: Matthew buys a C7 or C8 Corvette. Owners can add/edit milestone rewards.
- Admin can mark newly created coupons as one purchase per player.
- Back to Overview navigation on internal screens and version 1.4.0 displayed.

## Migration and limitations
Export a JSON backup before updating. Keep the same site origin to retain local storage. New weight goals only seed when a player does not already have a weight goal. Previously created tasks retain legacy schedule types until edited. Imported image atlases are stored separately in IndexedDB and are not included in JSON backup. XP bonuses apply to new task completions only. A browser visual test is recommended. This is not yet a secure, multi-device production release.
