# Our Quest V3.1 — Installation and safety

1. **Before uploading**, export or copy the current shared Supabase JSON payload as a backup. A local backup helper is available in V3.1 Settings/Task Library, but make a pre-update backup first using your existing data/export tools or Supabase dashboard. Do not overwrite your Supabase table.
2. Upload all files and `assets/` to the existing GitHub Pages repository, retaining `config.js`.
3. Refresh the deployed site and test both accounts. Existing tasks, custom XP, assignments, purchases and history are not intentionally modified by this update.

New: 68 task templates with 5 XP / daily / shared defaults, bulk editor, personal favorites, 6th icon atlas, editable rewards with quantity limits and purchase-relative expiry, two player-specific weight-goal editors and milestones, dated weigh-ins, approvals and history.

**Cautions:** The original application uses a shared JSON document and client-side role checks. They are not security boundaries. Cloud persistence and simultaneous writes cannot be fully verified without signing into the live deployment; keep a backup and avoid simultaneous edits until tested. Deleting a reward with past purchases archives it so history remains accessible. Expiration is calculated from purchase time; expired wallet coupons are displayed as expired but historical records remain.
