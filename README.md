# Study Roadmaps — Offline Developer Learning Site

A self-contained, **offline-first** web app that turns popular developer learning
roadmaps into browsable study material: every topic has a plain-English summary,
multiple **worked code examples** (including edge cases and gotchas), and a
"when to use it / trade-offs" section. Progress is tracked locally so you can
work through a roadmap over time.

Built with **vanilla HTML, CSS, and JavaScript — zero dependencies and zero build step.**
Clone it and open one file, or host the folder anywhere static.

---

## TL;DR for reviewers

- **~584 topic pages** of original technical content across **7 roadmaps**.
- **2,260+ worked code examples**, each topic pairing a typical use case with an
  explicitly labelled **edge-case / gotcha** example.
- **~32,000 lines** of hand-authored learning content.
- **No framework, no bundler, no `node_modules`** — a deliberate constraint (see
  [Engineering decisions](#engineering-decisions)).
- Clean separation of **data → content → renderer**; a tiny hash router; XSS-safe
  rendering; accessible, themeable, responsive UI; progress persistence.

If you only read one section, read [Engineering decisions](#engineering-decisions)
and [Content scope](#content-scope).

---

## Table of contents

- [What it does](#what-it-does)
- [Quick start](#quick-start)
- [Content scope](#content-scope)
- [Features](#features)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Engineering decisions](#engineering-decisions)
- [Code quality & conventions](#code-quality--conventions)
- [What this project demonstrates](#what-this-project-demonstrates)
- [Limitations & roadmap](#limitations--roadmap)
- [Attribution & license](#attribution--license)

---

## What it does

Each roadmap is a structured tree of sections and topics. Clicking a topic opens
a study page with three consistent parts:

1. **Summary** — what the concept is, in plain English.
2. **Examples** — multiple runnable-style snippets. Every topic includes at least
   one common use case **and** an example tagged `(edge case)` that covers a
   gotcha, anti-pattern, or failure mode (e.g. the `Integer ==` caching trap in
   Java, JWT `alg:'none'` attacks, cache stampedes, offset-pagination drift,
   GDPR erasure vs. immutable logs).
3. **When to use it** — real-world fit and trade-offs.

A left sidebar lets you navigate and filter topics; a checkbox per topic records
completion; a progress bar shows how far through each roadmap you are.

---

## Quick start

No install, no build.

**Option A — open directly**

```bash
git clone https://github.com/GosuStely/offline-study-roadmaps.git
cd offline-study-roadmaps
# open index.html in any modern browser
```

**Option B — serve it (recommended for clean routing)**

```bash
# Python 3
python -m http.server 8080
# then visit http://localhost:8080

# or Node
npx http-server -p 8080
```

That's the whole setup. There is nothing to compile and no environment to
configure — the app runs entirely in the browser and makes no network calls.

---

## Content scope

| Roadmap | Topic pages | Worked examples |
|---|--:|--:|
| System Design | 148 | 524 |
| TypeScript | 93 | 372 |
| Software Design & Architecture | 86 | 344 |
| API Design | 84 | 336 |
| Java | 78 | 312 |
| API Security Best Practices | 50 | 200 |
| Spring Boot | 45 | 180 |
| **Total** | **~584** | **2,268** |

> An eighth roadmap (**Software Architect**) has its full navigation structure in
> place but its written content is still in progress — see
> [Limitations & roadmap](#limitations--roadmap). Honesty over inflated numbers.

Content is original prose written for this project; the roadmap *structures*
(section/topic breakdowns) are modelled on the community roadmaps at
[roadmap.sh](https://roadmap.sh).

---

## Features

- **Offline-first** — all content ships as static JS; works with no internet,
  no API, no backend.
- **Progress tracking** — per-topic completion stored in `localStorage`, with a
  live progress bar per roadmap. Degrades gracefully if storage is unavailable.
- **Instant client-side search/filter** of topics within a roadmap.
- **Dark / light theme** — persisted, and applied *before first paint* to avoid a
  flash of the wrong theme.
- **Hash-based routing** — every topic is deep-linkable and shareable
  (`#/r/system-design/cap-theorem`), with Previous/Next navigation.
- **Responsive layout** with a collapsible topics menu on small screens.
- **Accessible** — semantic markup plus `aria-label` / `aria-pressed` on
  interactive controls.

---

## Architecture

The app is organised around a clean three-layer split:

```
 data/*.js      →  roadmap STRUCTURE (sections, ordered topic ids, titles)
 content/*.js   →  topic CONTENT     (summary, examples[], whenToUse) keyed by id
 js/app.js      →  RENDERER + ROUTER (reads the two above, builds the DOM)
```

- **Data layer** (`data/`) defines each roadmap as groups of topics. Each group
  can have an `overviewId` so the section header is itself a study page.
- **Content layer** (`content/`) holds one entry per topic id. Topics that share
  material (e.g. cross-listed cloud patterns in System Design) are **aliased** to
  a single source object, so content is written once and reused — no duplication.
- **Renderer** (`js/app.js`) is a small single-file router. It flattens roadmaps
  into an ordered list for prev/next, renders home/roadmap/topic views from the
  hash, and wires up theme, search, progress, and the collapsible nav.

Rendering is **XSS-safe by construction**: all untrusted/text values pass through
an `escapeHtml` helper, and code blocks are escaped before insertion into
`<pre><code>`.

---

## Project structure

```
offline-study-roadmaps/
├── index.html                 # entry point; loads data, content, then the app
├── css/
│   └── style.css              # full styling incl. dark/light theme variables
├── js/
│   └── app.js                 # hash router + renderer + theme/progress/search
├── data/                      # roadmap STRUCTURE (one file per roadmap)
│   ├── java.js
│   ├── spring-boot.js
│   ├── typescript.js
│   ├── system-design.js
│   ├── software-design-architecture.js
│   ├── api-security-best-practices.js
│   ├── api-design.js
│   └── software-architect.js
└── content/                   # topic CONTENT (one file per roadmap)
    ├── java-content.js
    ├── spring-boot-content.js
    ├── typescript-content.js
    ├── system-design-content.js
    ├── software-design-architecture-content.js
    ├── api-security-best-practices-content.js
    ├── api-design-content.js
    └── software-architect-content.js
```

`index.html` loads the data files, then the content files, then `app.js` — so
each layer is independently editable and the renderer never hard-codes content.

---

## Engineering decisions

These choices are intentional and worth calling out, because the "obvious"
default would have been a framework + build pipeline:

- **Vanilla JS, zero dependencies, zero build step.** The product requirement is
  *runs offline, forever, with no toolchain*. A static folder satisfies that with
  no supply-chain risk, no bundler config to rot, and no `npm install` before it
  works. The whole app is auditable in a few hundred lines.
- **Data/content/renderer separation.** New roadmaps or topics are added by
  editing plain data — the renderer doesn't change. This keeps the large body of
  content decoupled from UI logic.
- **Content as JS modules, not JSON fetched at runtime.** Loading content via
  `<script>` means the site works from `file://` with no CORS/fetch issues — true
  offline use, including double-clicking `index.html`.
- **Aliasing shared content** instead of copy-pasting keeps a single source of
  truth for topics that appear in multiple sections.
- **Theme applied before first paint** (an inline script in `<head>`) to avoid a
  flash of incorrect theme — a small but deliberate UX detail.
- **Graceful degradation** — if `localStorage` is blocked, progress simply
  doesn't persist rather than throwing.

---

## Code quality & conventions

- **Security:** every dynamic value is HTML-escaped before rendering; topic
  `code` blocks are escaped, so example snippets can contain `<`, `>`, `&`
  (e.g. TypeScript generics `Array<T>`) without breaking the page or enabling XSS.
- **Consistency:** every topic follows the same `{ summary, examples[], whenToUse }`
  shape; examples follow a `{ title, description, code }` contract enforced by the
  renderer.
- **Readability:** small, named helper functions (`escapeHtml`, `flattenItems`,
  `progressBarHtml`, `countComplete`), commented routing table, and consistent
  naming throughout.
- **Validation:** all eight content files parse cleanly under `node --check`, and
  rendering was verified in-browser across roadmaps with no console errors.

---

## What this project demonstrates

For reviewers assessing skills, this repo shows:

- **Breadth of technical knowledge** — authoring correct, idiomatic, edge-case-aware
  examples across Java, Spring Boot, TypeScript, system design, software
  architecture, and API design/security.
- **Front-end fundamentals without a framework** — DOM construction, client-side
  routing, state in `localStorage`, theming, responsive/accessible UI.
- **Software design sense** — a layered, decoupled architecture and a single
  source of truth for content, chosen to match real product constraints.
- **Attention to correctness and UX** — XSS-safe rendering, graceful degradation,
  no-flash theming, deep-linkable routes.
- **Judgement** — picking the *simplest tool that meets the requirement* rather
  than reaching for a framework by default, and documenting the trade-off.

---

## Limitations & roadmap

- **Software Architect roadmap** ships with its full navigation structure but the
  written content is not yet complete; those topics currently render a
  "content coming soon" placeholder.
- No automated test suite yet — content is validated via `node --check` and manual
  in-browser verification. A lightweight schema check for content entries is a
  natural next step.
- Search is per-roadmap; a global cross-roadmap search could be added.

---

## Attribution & license

- Roadmap **structures** are inspired by the open community roadmaps at
  [roadmap.sh](https://roadmap.sh). All explanatory prose and code examples were
  written for this project.
- No license file is currently included. If you'd like to reuse this, please open
  an issue or contact the author.
