# Our Quest V3.5.1 — Icon Grid Alignment Hotfix

Replaces the 100 independently cropped button backgrounds with one intact atlas image and a mathematically aligned, gapless 10 × 10 click overlay. The previous button borders and gaps caused visible drift and clipping. Each click still stores the same `{page,cell,x,y,size}` reference so existing selections are not migrated or overwritten. No icon PNGs are included. Keep all existing assets in GitHub.

This fixes the PICKER grid alignment. It does not repair icons that were painted across multiple cells in the source PNG, nor does it automatically re-map incorrectly selected existing icons. This has been syntax-checked but not tested with live Supabase.
