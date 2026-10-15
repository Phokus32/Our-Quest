# Our Quest V1.6.0 — Local Interactive Prototype

Open `index.html` to test, or host the entire folder on the same origin as V1.4. This is not yet a cloud-connected multi-account release.

## V1.6 changes
- Fixed the atlas icon CSS rule that made task icons escape their 44 × 44 pixel thumbnails and cover the screen. Atlas grid cells still use absolute positioning, but other icons are positioned relative to their own clipped containers.
- Matthew can delete unused coupon definitions. If a coupon has purchase history, it is **archived** from the shop instead, preserving its purchases, wallet entries and usage history. Archived coupons can be restored from the Rewards screen.
- Each weight goal has a customizable icon selected from the 300-icon atlas. Matthew can edit weight goal titles, descriptions, starting/target weights and ownership.
- Each weight goal supports multiple milestones, each with a configurable target, reward and icon. Matthew can add, edit and remove milestones. Previously reached milestones retain their completion state when edited.
- Weight milestone achievements are marked once when the goal owner records progress; milestone rewards are descriptive and do not automatically purchase real-world items.
- Version labels updated to V1.6.0 and the service worker cache bumped.

## Updating safely
1. In V1.4 export a JSON backup first.
2. Replace hosted files at the **same site URL** to preserve localStorage. Refresh the page.
3. Open Tasks and verify icon thumbnails stay inside task rows.
4. Open Goals as Matthew and choose **Edit Goal & Milestones**. Add several milestones, assign atlas icons and save.
5. Open Rewards as Matthew and delete a coupon. Purchased coupons will be archived rather than erased.

## Known limitations
The app still simulates both users on a single device. Supabase accounts, private cloud photo storage, push and cross-device sync are not connected. Custom atlas pages are stored in IndexedDB and are not included in the JSON export. Goal rewards are descriptive and do not issue purchases. Export data before upgrading. Visual browser tests may differ by device.


## V1.6 additions
- Adjustable draggable icon crop square. Tap or drag on the original atlas sheet and resize with the slider. The selected icon is a coordinate reference to the existing sheet, not a separate uploaded file.
- Shared icon crop selector for tasks, weight goals, milestone rewards and coupons.
- Create or edit coupons with atlas icons and a special one-time purchase restriction.
- Atlas Library preview no longer overlays a misleading fixed grid.
- Browser storage only: not synced across devices. Export a JSON backup before upgrading. Atlas uploads remain separately stored in IndexedDB and are not included in the JSON backup.
