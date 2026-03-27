# Philepedia

Philepedia is the internet's first beautifully crafted, immersive encyclopedia of "-phile" words. It is a static Astro experience focused on reverse discovery: users search for what they love and the site reveals the word that describes them.

The first release targets 30 flagship philes with hand-curated references, distinctive color palettes, thematic motion, and fully prerendered detail pages. The product is designed as an editorial museum of passions rather than a flat dictionary.

Developed by [Naveen Purimittla](https://x.com/np9royal)

## Current Scope

- Immersive homepage with reverse search and drifting phile atmosphere
- Explore grid with category, mood, and A-Z filtering
- Root-level phile pages with etymology, palette, references, and related terms
- Static SEO metadata, JSON-LD, sitemap, and prerendered OG images
- Cloudflare Pages-friendly output with minimal hydration

## Commands

- `npm install` installs dependencies
- `npm run dev` starts the local Astro dev server
- `npm run check` runs Astro type checks and content validation
- `npm run build` validates content, generates OG images, and builds production output
- `npm run preview` previews the production build locally

## Notes

- Source-of-truth product brief: `PHILEPEDIA_SPEC.md`
- Launch content is curated in `src/content/philes`
- `SITE_URL` can be provided at build time to override the default canonical site URL
