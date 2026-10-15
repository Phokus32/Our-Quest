# Our Quest V2.0: go-live guide

## Before you begin
1. Export your V1.7 backup JSON. Keep the old ZIP.
2. Create a **new** project at https://supabase.com/dashboard. Store its database password privately.
3. In Supabase > SQL Editor, open `schema.sql`, replace `MATTHEW_EMAIL_HERE` and `BETH_EMAIL_HERE` with your actual email addresses and run it.
4. In Supabase > Authentication > Providers > Email, enable email/password sign-in. Consider requiring email confirmation.
5. In Supabase > Project Settings / API, copy **Project URL** and **publishable** (or legacy anon) key into `config.js`. Never use a secret or service_role key. Put the exact same two emails in `config.js`.
6. Deploy the **contents** of this ZIP to GitHub Pages (or any HTTPS static host), including `config.js`, `schema.sql` is NOT needed on the public website and should be removed before publishing. `SETUP.md` is also optional.
7. In Supabase > Authentication > URL Configuration, set Site URL to your published HTTPS site and add its URL to allowed redirect URLs.
8. Open the website, select Create My Account for Matthew. Confirm the email if prompted. Sign in. The first admin login initializes shared data; you can import the current browser's existing V1.7 data or start fresh.
9. Beth creates her own account using the second configured email. After verification and login, both see the same shared game.
10. Test: Matthew creates a task; Beth refreshes or waits up to 8 seconds; Beth completes it; Matthew sees the XP result. Test coupon purchases, goals, logouts and re-login.
11. Install the HTTPS site to both phone Home Screens.

## Important limitations
- This release is a **two-trusted-user cloud deployment**, not a security-audited financial-grade game engine. Server-side permissions restrict uninvited users and Beth's admin-controlled definitions, but XP, gold and other gameplay calculations still originate in browser JavaScript. A knowledgeable authorized user could manipulate these values. For tamper-resistant rewards, move XP/coin transactions to dedicated validated database functions.
- All shared game data is one revisioned JSON document. Simultaneous edits can conflict: the second save is rejected instead of silently overwriting the first. Export your local backup before refreshing after a conflict.
- Embedded photos/base64 data can exceed the 3 MB document limit. A later release should move photo proof and custom atlas uploads to private Supabase Storage with signed URLs and storage policies. Custom atlas uploads currently live in each browser's IndexedDB and do **not** sync between devices.
- Local data import happens only on initial cloud creation if that browser has existing V1.7 data under the same origin. On a new GitHub Pages URL, export your V1.7 JSON and use the app's Import Backup control after creating the shared game, if the app's import control is available. Avoid overwriting other users' recent changes.
- Supabase free tier has limits and projects can pause after inactivity. Arrange independent exports and recovery backups.
- CDN dependency: Supabase JS library is loaded from jsDelivr and requires internet access.
- Test on your phones before relying on it. No live Supabase project credentials were available during build, so actual end-to-end cloud tests could not be performed here.
