# Our Quest 3.6.2 test release
- Loads the previously omitted v361.js/v361.css patch (which caused the new coupon icon button to fail).
- Routes new coupon atlas selections to the actual v33 coupon draft.
- Replaces emoji in shop cards with the saved atlas icon.
- Adds atlas selection when sending a quest and displays selected atlas icons in quest listings.
- Keeps existing atlas assets in the repository; this package contains no icon sheets.
- Not verified against a live Supabase session. Back up data before deployment.
