# Elbek Mirzamakhmudov Portfolio

Personal portfolio website for Elbek Mirzamakhmudov, a Flutter and iOS developer.

This repo contains a static portfolio focused on:

- polished mobile product presentation
- real published apps and client work
- separate project detail pages for archived or unpublished work
- Firebase-backed live visitors, source attribution, and lightweight stats

## Stack

- HTML
- CSS
- Vanilla JavaScript with ES modules
- Firebase Firestore
- Firebase Realtime Database
- Firebase Analytics optional

The project stays intentionally simple so it is easy to deploy, edit, and maintain.

## Main features

- Editorial landing page with hero, selected work, experience, education, skills, and contact
- Project cards generated from a single content file
- Dedicated project pages at `project.html?slug=...`
- Support for older/private work through screenshot-ready detail pages
- Firebase visit tracking with `src` and UTM attribution
- Live anonymous cursor presence with a subtle built-in reviewer bot
- Debug dashboard at `/admin.html`

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
    ├── project.html
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
        ├── project.mjs
        ├── reviewer-bot.mjs
        ├── source-tracking.mjs
        └── utils.mjs
```

## Where to edit content

Most portfolio content lives in:

- `public/scripts/content.mjs`

This file controls:

- hero text
- projects
- project detail pages
- experience
- education
- skills
- contact links
- footer copy

## Updating projects

Each project entry in `public/scripts/content.mjs` supports:

- `slug`
- `name`
- `subtitle`
- `description`
- `tags`
- `icon` or `iconImage`
- `links`
- optional `detail`

Use `detail` for:

- longer project overview
- highlights list
- screenshots gallery
- archived project placeholder states

Example use cases:

- published App Store apps can keep `App Store` and `Website` links
- old or unpublished work can use `View project` and show screenshots on `project.html`

## Firebase setup

Update:

- `public/scripts/firebase-config.mjs`

Reference:

- `public/scripts/firebase-config.example.mjs`

The site stays in preview mode until:

1. `enabled` is set to `true`
2. real Firebase web config values are added

Required Firebase services:

- Firestore
- Realtime Database
- Analytics optional

Deploy rules:

```bash
firebase deploy --only firestore:rules,database
```

## Tracking behavior

Visit tracking is session-based, so refreshes in the same session do not inflate counts.

Supported incoming source patterns:

- `?src=linkedin`
- `?src=github`
- `?src=instagram`
- `?src=x`
- `?src=telegram`
- `?src=direct`

UTM support:

- `utm_source`
- `utm_medium`
- `utm_campaign`

Source precedence:

1. `src`
2. `utm_source`
3. referrer match
4. `direct`

## Live presence

- Presence uses Firebase Realtime Database
- Visitors get anonymous labels
- Live cursors render on desktop and stay hidden on touch/coarse pointer devices
- A reviewer bot is always present for demo feel

## Admin page

Open:

- `/admin.html`

It shows:

- total visits
- unique sessions
- live visitors now
- source breakdown
- latest visit records

## Run locally

From the repo root:

```bash
python3 -m http.server 4173 --directory public
```

Then open:

- `http://localhost:4173/`
- `http://localhost:4173/admin.html`

## Deploy

### Firebase Hosting

```bash
firebase deploy
```

### Netlify

- publish directory: `public`
- no build command

### Vercel

- import the repo
- no build command
- static output from `public/`

## Notes

- This portfolio uses plain web technologies on purpose for easy deployment and long-term editing.
- Project detail pages make it possible to show archived/private work without cluttering the homepage.
- If a project has no public screenshots yet, the detail page can stay as a clean placeholder until assets are added.
