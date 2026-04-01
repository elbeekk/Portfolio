# Premium Portfolio Website

Minimal static portfolio for a Flutter and iOS developer, with Firebase-backed visit tracking, source attribution, and live anonymous cursors.

## What’s included

- Premium responsive portfolio UI with editable content in one file
- Live cursor presence with anonymous labels and a subtle built-in reviewer bot
- Session-based visit tracking with source attribution
- Separate debug dashboard at `/admin.html`
- Firebase Hosting, Netlify, and Vercel-friendly structure

## Project structure

```text
.
├── README.md
├── firebase.json
├── firestore.indexes.json
├── firestore.rules
├── database.rules.json
├── netlify.toml
└── public
    ├── admin.html
    ├── index.html
    ├── assets
    │   └── favicon.svg
    ├── styles
    │   └── site.css
    └── scripts
        ├── admin.mjs
        ├── app.mjs
        ├── content.mjs
        ├── firebase-config.example.mjs
        ├── firebase-config.mjs
        ├── firebase-service.mjs
        ├── live-cursors.mjs
        ├── source-tracking.mjs
        └── utils.mjs
```

## Setup

1. Edit the portfolio content in `public/scripts/content.mjs`.
2. Replace the placeholder values in `public/scripts/firebase-config.mjs`.
3. Set `enabled: true` in `public/scripts/firebase-config.mjs`.
4. Create these Firebase services in your project:
   - Analytics
   - Firestore
   - Realtime Database
   - Hosting if you want Firebase-native deployment
5. Deploy the provided Firebase rules before using the live features:

```bash
firebase deploy --only firestore:rules,database
```

6. Preview locally from the repo root:

```bash
python3 -m http.server 4173 --directory public
```

Then open `http://localhost:4173`.

## Firebase config

Update this file:

- `public/scripts/firebase-config.mjs`

Reference template:

- `public/scripts/firebase-config.example.mjs`

The app stays in preview mode until Firebase is enabled. In preview mode:

- the portfolio UI still works
- admin data shows empty states
- live cursors stay disabled

## Source tracking behavior

Visit attribution is session-based, not raw page-refresh based.

- Session length defaults to 30 minutes and is configurable in `firebase-config.mjs`
- The first page load for a session creates one visit record
- Refreshes within the same session reuse the same visit record
- Source precedence is:
  - `?src=...`
  - `utm_source`
  - referrer match
  - `direct`
- Supported direct source labels:
  - `linkedin`
  - `github`
  - `instagram`
  - `x`
  - `telegram`
  - `direct`
- `utm_medium` and `utm_campaign` are stored on the visit record when present

Visit counters are lightweight and client-side. This is appropriate for a portfolio and testing, but not hardened against malicious traffic. If you need tamper-resistant analytics, move counting logic to a trusted backend or Cloud Functions.

## Live cursor behavior

- Presence uses Firebase Realtime Database
- Each visitor gets a stored anonymous label like `swift-fox`
- Cursor rendering is desktop-first and hidden on coarse pointers / smaller screens
- A subtle `bot-reviewer` cursor is always present so the portfolio never feels empty in demos
- Presence is removed on disconnect and filtered client-side if stale

## Debug dashboard

Open:

- `/admin.html`

It shows:

- total visits
- unique sessions
- live visitors now
- visits by source
- latest visit records

This page is intentionally simple and is not access-controlled.

## Deployment

### Firebase Hosting

From the project root:

```bash
firebase deploy
```

The provided `firebase.json` already points Hosting to `public/`.

### Vercel

- Import the repo
- Use no build command
- Keep the default static output behavior
- Put your real Firebase config in `public/scripts/firebase-config.mjs`

Vercel serves files in `public/` directly.

### Netlify

- Import the repo
- Publish directory: `public`
- No build command needed

`netlify.toml` is already included.

## What to replace with real information

- `siteContent.brand`
- `siteContent.hero.*`
- project cards in `siteContent.projects`
- experience entries in `siteContent.experience`
- skills in `siteContent.skillGroups`
- links and email in `siteContent.contact`
- Firebase credentials in `public/scripts/firebase-config.mjs`

## Notes

- The site uses plain HTML, CSS, and ES modules to keep deployment and maintenance straightforward.
- Firebase Analytics is optional but supported automatically when a `measurementId` is present.
- The admin page does not create extra visit records by itself.
