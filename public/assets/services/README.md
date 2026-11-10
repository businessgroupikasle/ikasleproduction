# Service detail imagery

Placeholder imagery for the service detail pages (`/services/:slug`). Replace with approved IKASLÉ work.

## `video-production/`

`cine-*.jpg` are stills cropped from the showreel (`../videos/vdx.mp4`). The crops deliberately exclude the small ✦ mark in the bottom-right corner of the source video, so re-crop the same way if you regenerate them.

## Where each discipline's image is set

Every discipline on every service page (including Photography) points at its image in one place: `src/data/serviceDetails.ts` (Photography's list lives in `src/data/photography.ts`). To swap an image, drop the new file in `public/assets/` and update that discipline's `image` path. Use `focus` (a CSS `object-position`) to control the crop inside the 16:10 preview, and `alt` to describe it.

Several images are shared between pages (for example the wedding, event and corporate photos appear in both Photography and Video Production, and `objects-in-motion.jpg` is used twice in Creative Solutions with different crops). Give each discipline its own image when real work is available.
