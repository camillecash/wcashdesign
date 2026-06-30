# WCashDesign

Portfolio and service website for Walter Cash / WCashDesign.

## Local development

```bash
pnpm install
pnpm dev
```

## Sanity Studio

The Studio is scaffolded in `studio/` and configured for:

- Project ID: `mg9lwf9m`
- Dataset: `production`

Run the Studio locally with:

```bash
pnpm studio
```

The public site reads published Sanity content at build time. If Sanity is unavailable, it falls back to the local defaults in `src/data/site.ts`.

To seed the current local content and images into Sanity, create a Sanity token with write access and run:

```bash
SANITY_AUTH_TOKEN="paste-token-here" pnpm run sanity:seed
```

Do not commit the token or save it in the repo.

## Current pages

- `/`
- `/portfolio/`
- `/portfolio/creations-and-edits/`
- `/portfolio/flyers-posters/`
- `/portfolio/logos/`
- `/portfolio/magazines-newspaper-mockups/`
- `/portfolio/movie-poster-book-mockups/`
- `/portfolio/professional-headshots/`
- `/portfolio/restorations/`
- `/consultation/`

## Next setup steps

1. Run the Sanity seed script once.
2. Deploy the Studio.
3. Commit the project and connect it to GitHub.
4. Deploy to Cloudflare Pages with build command `pnpm install --frozen-lockfile && pnpm run build` and output directory `dist`.
