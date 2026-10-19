# DameosAI Tailwind CSS CDN

A static Tailwind CSS v4 utility bundle deployed to Vercel from GitHub.

## Requirements

- Node.js 20+ recommended
- npm
- Git and a GitHub repository
- Vercel account connected to GitHub

## Local build

```powershell
npm install
npm run build
```

Open `public/index.html` locally through a static server, or deploy the repository to Vercel. The generated CSS is `public/tailwind.css`; the versioned copy is `public/v1/tailwind.css`.

## Vercel settings

- Framework Preset: Other
- Root Directory: repository root
- Build Command: `npm run build`
- Output Directory: `public`
- Install Command: `npm install` (or `npm ci` after committing package-lock.json)

`vercel.json` defines cache headers. `/v1/tailwind.css` is immutable for a year. Only publish a new file under a new versioned path when changing that immutable asset.

## Usage

```html
<link rel="stylesheet" href="https://tailwind.dameosai.com/v1/tailwind.css">
```

This is a curated utility set, not every possible Tailwind class or arbitrary value. Add the utility patterns you need to `src/input.css`, build, and deploy. Do not dynamically construct class names in consuming code unless the corresponding classes have been explicitly included in the generated stylesheet.

## Release/versioning

For a breaking or materially changed CSS release:
1. Increment the `version` field in `package.json`.
2. Update the versioned path in `scripts/build.mjs` to match the intended public URL (see note below).
3. Update consuming websites to the new URL.
4. Deploy and test the new asset before switching production websites.

For production versioning, use explicit version directories such as `/v1/tailwind.css`, `/v2/tailwind.css`, etc. Never overwrite a file at an immutable versioned URL with different contents.

## DNS

In Vercel Project Settings -> Domains, add `tailwind.dameosai.com`. Copy the exact DNS record Vercel shows into the DNS manager authoritative for `dameosai.com`. Do not remove or change the existing `assets` record. Wait for Vercel to verify the domain and issue HTTPS.

## Verification

```powershell
curl.exe -I https://tailwind.dameosai.com/v1/tailwind.css
curl.exe -I https://tailwind.dameosai.com/version.json
```

Expect HTTP 200, `Content-Type: text/css` for the stylesheet, HTTPS without certificate errors, and the configured Cache-Control headers.
