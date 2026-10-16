# Our Quest V3.5.0 — Lightweight Test Build

This build deliberately excludes large icon atlas PNG files. It includes the app and its icon picker. Existing atlases already hosted in your GitHub repository should NOT be deleted. To add new icon sheets, upload PNGs to your GitHub repository under `assets/` with the existing expected filenames, or use the app's atlas uploader (note that some uploads may be browser-local rather than cloud-synced). A 10×10 atlas should be square and each icon should occupy its own evenly sized cell. The picker now chooses exactly one grid cell instead of a freehand crop.

Important: If you upload the lightweight package via a method that deletes old repository files, restore the six atlas PNGs under `assets/` first or existing icons will not load. Prefer adding/replacing individual files without deleting existing assets.

Changes: V3.5 grid picker for task, library review, bulk edit, coupon, category and goal icons; prevents native form reload on task submission; saves goal edits and milestone descriptions; version display update. This is a test build. Make a JSON backup before installation and test on desktop and mobile. No Supabase schema migration is required.
