# Labour Canteen

Responsive workforce catering website for Selangor, built from the approved Labour Canteen artwork. Includes English and Bahasa Malaysia pages, all 75 menu entries, a customisable weekly planner, subsidy support, central kitchen, story and enquiry pages.

## Run locally

Use Node.js 24 or newer.

```sh
npm ci
npm run build
npm run dev
```

Open http://127.0.0.1:4173. The local server deliberately sends `noindex` and is not a production server.

## Deploy on Cloudflare Workers

Connect this GitHub repository to a new **Worker** in Cloudflare Workers & Pages. Use these settings:

| Setting | Value |
| --- | --- |
| Root directory | `/` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Node version | `24` |
| Build variable `SITE_URL` | Your final HTTPS domain, without a trailing slash |

`wrangler.jsonc` already points to the Worker entry and generated `dist` assets. No database, API key or secret is required. The deployment account needs its normal Cloudflare permissions. CLI deployment is also supported with `npm run deploy` after Cloudflare authentication.

The current canonical origin defaults to **https://labourcanteen.com**, inferred from the supplied business email. Set `SITE_URL` to the domain you actually attach before the production build. Changing a runtime variable alone does not update already-built HTML; rebuild after changing it. A Cloudflare `workers.dev` preview address is not the final business domain.

Cloudflare serves `/menus`, `/central-kitchen`, `/subsidy-support`, `/our-story` and the other pages without `.html`. Unknown URLs receive a real 404. The site is statically rendered so navigation and menu content remain available without JavaScript.

Official setup references: [Workers build settings](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/) and [static-site routing](https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/).

## Customer enquiries and the planner

- Email: **mail@labourcanteen.com**
- WhatsApp: **+60 12-927 0108**
- A visitor chooses a five- or seven-day plan, dishes, portions, spice preferences and fruit. They can copy meals to other days, save locally and download a CSV.
- Plans are stored only in that browser's local storage. There is no account, shared database, payment processing or automatic order confirmation.
- Enquiry buttons open the visitor's WhatsApp or email composer with their details and optional plan. The visitor reviews and sends the message themselves. This is not a background email-delivery service.
- Menu availability, dietary arrangements, subsidies and deferred company settlement are confirmed with the business. The subsidy page contains no prices.

## Editing

| File | Purpose |
| --- | --- |
| `src/pages.mjs` | Page templates and visible English copy |
| `src/ms.json` | Malay translations |
| `src/config.mjs` | Contacts, default origin and SEO metadata |
| `public/assets/dishes.json` | Complete menu data and original image mapping |
| `public/site.css` | Responsive layout, typography, decorative geometry and motion |
| `public/site.js` | Planner, menu filters, local saving and form behaviour |
| `public/contact.mjs` | Safe email/WhatsApp message construction |
| `src/worker.js` | Clean URL redirects and fallback asset responses |

The Inter variable font is self-hosted. It is a visual match to the generated artwork; the raster references do not identify an exact source font. Font sizes scale on large screens. Keyboard focus, 44px interaction targets and reduced-motion settings are supported.

## Checks and design evidence

```sh
npm run build
npm run check
npm test
```

Tests cover all 24 routes, local links/assets, structured data, menu completeness, Malay translations, contact-message encoding, business facts, clean URLs and 404 status. Browser QA covers menu search/filtering, dish addition, copy-to-days, portions, saved state, CSV export, mobile navigation and enquiry validation.

`docs/visual-audit.txt` explains visual corrections and intentional differences. `docs/comparisons/` contains approved-design versus website comparisons and responsive screenshots. `docs/seo-research.txt` records keyword and competitor research. `docs/asset-manifest.json` records source crop provenance; `docs/image-generation-prompts.txt` records the ImageGen prompts.

For fresh automated screenshots on your own machine, install the Playwright browser with `npx playwright install chromium`, run the local server, then run `npm run screenshots`. You can set `BROWSER_PATH` to an installed compatible browser. This optional script was not the capture mechanism used in the restricted build environment; the supplied evidence was captured through the connected browser.

## Image quality and scope

Original generated artwork and enhanced archive photos are reused where available. Four missing high-resolution hero photographs were reconstructed with built-in ImageGen. Source-resolution WebP encoding was checked for pixel equality; responsive derivatives are resized for delivery, with full-resolution masters retained. The original small catalogue crops cannot gain new photographic detail through compression or upscaling.

The implementation preserves the approved page hierarchy, colour palette, backgrounds and decorative shapes. It is not claimed to be a pixel-identical bitmap copy: larger readable type, functioning controls, responsive layouts and reconstructed hero details produce documented differences. Individual training summaries do not assert company halal certification, and personal certificate identifiers are not published.

No production Cloudflare deployment is performed by committing this repository.
