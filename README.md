# BuildFlow

An AI-powered visual website builder. Describe an app idea in a sentence, get back a suggested screen flow, design each screen on a drag-and-resize canvas with 17 pre-built components, then export a production-ready single-file HTML site.

## How it works

1. **Prompt** — describe the app you want ("a SaaS landing page for a habit tracker...").
2. **Flow** — Claude proposes 4–7 screens with names, routes, and suggested components.
3. **Design** — an editor canvas where you drag, resize, restyle, and rearrange components (navbar, hero, cards, forms, testimonials, etc.), with layers, undo/redo, keyboard shortcuts, and snap-to-grid.
4. **Code** — Claude turns your design into a single self-contained HTML file (embedded CSS + vanilla JS routing), which you can preview live or download.

## Project structure

```
buildflow/
├── index.html                     # Vite entry HTML
├── package.json
├── vite.config.js                 # dev proxy — injects the API key server-side
├── .env.example                   # copy to .env and add your API key
├── api/
│   └── anthropic/v1/messages.js   # Vercel serverless function (production proxy)
└── src/
    ├── main.jsx                   # React root
    └── App.jsx                    # the entire app (single component, ~1150 lines)
```

## Running it locally

```bash
npm install
cp .env.example .env     # then paste your Anthropic API key in
npm run dev
```

Open the printed local URL (usually http://localhost:5173).

## Connecting the API

This app calls the Anthropic Messages API twice — once to plan the screen flow, once to generate the final HTML.

The API key is **never** sent to or stored in the browser:

- In dev, `vite.config.js` proxies `/api/anthropic/*` to `https://api.anthropic.com` and attaches your key from `ANTHROPIC_API_KEY` (read from `.env`) on the server side, inside the proxy itself.
- In production (see Deploying below), `api/anthropic/v1/messages.js` does the same job as a serverless function.

`src/App.jsx` just POSTs to `/api/anthropic/v1/messages` with no key attached — it works identically in both environments.

## Building for production

```bash
npm run build
npm run preview
```

`dist/` contains the static build.

## Deploying (e.g. to Vercel)

1. Push this project to a GitHub repo.
2. Import it in Vercel (vercel.com → Add New → Project). Vercel auto-detects Vite and the `api/` folder.
3. In Project Settings → Environment Variables, add `ANTHROPIC_API_KEY` with your real key. Do **not** prefix it with `VITE_`.
4. Deploy. Vercel builds the static site and deploys `api/anthropic/v1/messages.js` as a serverless function automatically — no other config needed.

Other hosts (Netlify, Cloudflare Pages) work the same way in principle: build the static site, and add an equivalent serverless/edge function at the same path that reads the key from a server-only environment variable. Plain static hosts with no server-side compute (GitHub Pages, a plain S3 bucket) **cannot** run this app publicly, since there'd be nowhere to hide the key.

## Tech

Plain React (hooks only, no external UI libraries), inline styles, and the Anthropic Messages API. No router, no state library — the whole app is one component tree.
