# Our Quest V2.1.1 — Icon Atlas Hotfix

Fixes the reported `Cannot access 'v16Crop' before initialization` error by making the crop editor state safely initialized and removing the redundant state reset in the V2.0.6 compatibility wrapper. Also removes the duplicate capture-phase launcher, which could open the picker twice, and bumps the service-worker cache version.

This patch does not alter the Supabase schema, credentials or existing game data. It is a focused repair, not a full verification of every V2.1 feature.

Upload all files from this ZIP to the same GitHub repository root, replacing matching files. After GitHub Pages deploys, hard-refresh (Ctrl+Shift+R). If the old page remains, clear site data for the GitHub Pages origin and sign in again.
