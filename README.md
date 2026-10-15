# Our Quest V1.2.0 — Local Interactive Prototype

This package builds on Our Quest V1.1. Unzip the folder and open `index.html` in a desktop browser. For installable PWA behavior, host the entire folder over HTTPS. The app icon, manifest and versioned service worker are included.

## What's new in V1.2.0

- **Photo attachments:** Select or take photos (depending on your device/browser), compressed locally to JPEG (max 1,000px on longest side). Attach up to five images per quest proof submission or XP request. Attach a photo to a message, upload task/coupon artwork, select artwork from a reusable library, and upload a profile picture. Preview attached photos.
- **Proof requirements:** Quest creators can choose none, optional photo, photo required, or photo plus notes required. Recipients submit evidence before the sender approves XP. Approved quests keep submitted proof.
- **Player-initiated XP requests:** Create an activity title, description, proposed XP and optional evidence. Recipient can approve, decline, ask a question or counteroffer. Sender can answer questions and accept counteroffers. Approval credits XP once, with ledger entries.
- **Recent Partner Activity:** Overview shows up to five public completions, quest approvals and achievements. Private task completions are excluded.
- **Visible version number:** V1.2.0 is displayed in the navigation and More menu.
- **Prior V1.1 systems remain:** Admin-only task definition editing, categories, daily/weekly/monthly/quarterly/annual/one-time recurrence, per-period limits, achievements, level titles, XP/gold ledger, daily/weekly/monthly champion bonuses, approval inbox, coupon usage history and the 1,000-gold Olive Garden coupon.

## Try it

1. Open the app and switch to Matthew (demo profile).
2. In Quests, create a quest with **Photo Required**.
3. Switch to Beth, accept it, choose **Submit Photo Proof**, attach a photo and submit.
4. Switch to Matthew and approve the quest. Beth's XP should increase once.
5. Switch to Beth, open **More → XP Requests**, submit a new request with photo evidence.
6. Switch to Matthew, open **Approvals** or **More → XP Requests**, ask a question, counteroffer or approve.
7. Upload artwork in the task/coupon editor. Open **More → Photo Library** to review saved artwork.
8. Open **Messages** and send a photo. Switch profiles to see it in the same browser.

## Important limitations

- **Local-only prototype.** Profiles are simulated and anyone using the same browser can switch between them. There is no real authentication, secure authorization, cloud database, real-time cross-phone synchronization or private cloud photo storage yet.
- **Photos are stored as data URLs in browser localStorage.** Browser storage quotas are small and large numbers of photos can cause saves to fail. Photos are included in JSON exports, making backup files large. Keep backups private. Export before changing hosting addresses or clearing browser data.
- Photo selection and preview work in modern browsers; camera access varies by device and context. This build does not yet offer a full crop editor, before/after side-by-side viewer, photo comments, retention cleanup, resumable uploads, secure photo access policies or reliable offline synchronization.
- Version display works, but cloud update notifications and release-history management are not implemented.
- The administrator restriction is only a UI restriction. Do not use this build as a real two-person secure service.
- No external services or Supabase credentials are needed for this local prototype.
- No visual browser test was completed in this environment. JavaScript syntax and simulated state-flow tests were performed.

## Updating from V1.1

If you host V1.1 and V1.2 at the **same origin**, V1.2 uses the same `ourquest-stage1-data-v1` storage key and attempts to migrate existing data. **Export a JSON backup from V1.1 first.** Opening the file from a different path or hostname may use a separate storage area, and `file://` storage behavior varies by browser.

## Next technical milestone

Supabase Auth, PostgreSQL with Row Level Security, Supabase Storage for private images, server-side XP approval transactions and cloud synchronization between both phones. These features are not included in this package.
