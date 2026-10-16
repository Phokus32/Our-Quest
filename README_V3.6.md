# Our Quest V3.6.0 — Universal Icon Picker Test Release

Upload the contents to the existing GitHub Pages repository, **without deleting the assets directory**. This lightweight package excludes large atlas PNGs. Back up shared JSON data before installing.

- One shared draggable crop picker with size slider and optional snap-to-grid for tasks, library activation, rewards, categories, goals, milestones and bulk task editing.
- Picker uses a native modal dialog (top layer) to appear above coupon editors.
- Atlas management adds rename and logical delete for built-in and user-uploaded sheets. Deleting a sheet in the app does not delete the actual PNG from GitHub.
- Sheets referenced by saved icons require two confirmations. Referenced selections revert to defaults.
- Existing crop refs remain compatible.

**Limitations:** Live Supabase integration and mobile browser behavior have not been verified. Uploaded images stored in browser IndexedDB may not synchronize to other devices. This is a test release, not a fully tested production release.
