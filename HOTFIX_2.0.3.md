# Our Quest V2.0.3 — XP dock and icon picker fix

- Moves XP progress to the bottom and reserves scroll space.
- Automatically hides XP progress whenever a modal is open.
- Raises modal stacking above the XP bar, including the free-position icon picker.
- Restores missing built-in atlas page definitions from seed defaults when cloud data is incomplete.
- Preserves the existing Supabase project configuration.

## Install
Back up your data, upload the extracted website files to your existing GitHub Pages repository and wait for deployment. Hard-refresh (Ctrl+Shift+R). Test Create Task → Choose from Icon Atlas → select crop → Use This Icon → Save. Verify the XP dock disappears when the editor opens.

This is a targeted hotfix, not the planned V2.1 quest release. Backend security and simultaneous-write limitations remain.
