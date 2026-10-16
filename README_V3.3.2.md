Our Quest V3.3.2 startup hotfix

Changes:
- Replaces the problematic admin checker const with a hoisted function declaration.
- Removes the forced pre-login render in the V3.3 extension.
- Cache-busts the V3.3 script and bumps the service-worker cache.

No database schema changes or resets.

Install by uploading the entire contents to GitHub Pages. Hard-refresh or remove the home-screen app and reopen the URL if an old service worker persists.
