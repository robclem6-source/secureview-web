# SecureView AI — Hosted Deployment

This is your assessment app wired up to run as a real hosted site instead of a
claude.ai artifact. It's been built and tested locally (Next.js 16, production
build + server start both verified working) — you just need to add your API
key and push it to Vercel.

## What's in here
- `public/app.html` — your assessment app (unchanged UI/logic), with every
  `fetch()` call pointed at `/api/analyze` instead of `api.anthropic.com` directly.
- `pages/index.js` — serves `app.html` at the root URL (`/`).
- `pages/api/analyze.js` — the backend proxy. This is the only place your
  Anthropic API key ever lives. It adds the key server-side and forwards the
  request to Anthropic, so the key is never sent to, or visible in, the browser.

## Step 1 — Add your API key locally (to test before deploying)
1. Copy `.env.local.example` to a new file named `.env.local`.
2. Open `.env.local` and replace the placeholder with your real Anthropic API key:
   ```
   ANTHROPIC_API_KEY=sk-ant-...your real key...
   ```
3. `.env.local` is already in `.gitignore` — it will never be committed or pushed
   to GitHub, so your key stays private.

## Step 2 — Test it locally
```bash
npm install
npm run dev
```
Open http://localhost:3000 — this should be your actual assessment app, and
clicking "Analyze" on any page should now hit real Claude and return a real result
(instead of the placeholder fallback scores).

## Step 3 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial hosted version of SecureView AI"
```
Create a new repo on GitHub (empty, no README), then:
```bash
git remote add origin https://github.com/YOUR-USERNAME/secureview-web.git
git push -u origin main
```

## Step 4 — Deploy on Vercel
1. Go to vercel.com → "Add New..." → "Project"
2. Import the GitHub repo you just pushed
3. Vercel will auto-detect Next.js — you don't need to change any build settings
4. **Before clicking Deploy**, expand "Environment Variables" and add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your real key
5. Click Deploy

Vercel will build and give you a live URL (something like
`secureview-web.vercel.app`). That's your hosted app — same UI, same logic,
now doing real AI analysis with the key safely on the server side only.

## If something's wrong
- **"Server misconfigured: ANTHROPIC_API_KEY is not set"** shown in the app —
  the env var isn't set. Check Vercel Project Settings → Environment Variables,
  and make sure you redeployed after adding it (env var changes require a
  redeploy to take effect).
- **App loads but nothing happens when you click Analyze** — open the browser's
  dev tools (F12) → Console/Network tab, and check what `/api/analyze` returned.
- **Works locally but not on Vercel** — double check the env var is set in
  Vercel's dashboard specifically, not just your local `.env.local` (they're
  separate; local env vars never get uploaded).

## Adding your Vercel teammate (Mark)
Once deployed under your account, go to the Vercel project → Settings →
Members, and invite Mark's email so he has access too. This is where the
Pro-plan seat cost applies (one seat per person with dashboard access).
