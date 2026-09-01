# Squad Tennis

NorCal's college club tennis rankings, results, and rivalries.

Club tennis has real teams, real matches, and real rivalries, but no shared place to keep score. Results live in group chats and captains' notebooks, so nobody outside a team knows who's actually good. Squad Tennis gives every enrolled school a home page, tracks division standings and individual player rankings, and lets captains submit match results directly.

**Live:** [squadtennis.vercel.app](https://squadtennis.vercel.app)

---

## Table of contents

- [What it does](#what-it-does)
- [Quick start](#quick-start)
- [Project structure](#project-structure)
- [Accounts and access](#accounts-and-access)
- [School onboarding](#school-onboarding)
- [Data model](#data-model)
- [Design](#design)
- [Deployment](#deployment)
- [Roadmap](#roadmap)

---

## What it does

**Public — no account needed**

- Squad Tennis home with overall standings and top players across enrolled schools
- Every enrolled school's page: roster, division standings, recent match results
- Find a college search

**Private — members of that school only**

- **Team Spot**: practice schedule, announcements, and internal team info, visible only to accounts belonging to that school
- Officer editing: update team info, upload a hero background image, manage the roster
- Captain-driven match result submission

The public/private split is the core product decision. Anyone can look at any school's results, because rankings only matter if rivals can see them. But practice times and internal announcements are gated to that school's own members. On another school's page, Team Spot doesn't render at all — no lock icon, no placeholder, it simply isn't there.

Only enrolled schools appear anywhere in the app. Empty pre-created pages for every college in NorCal would make the platform look abandoned, so a school shows up in standings and search only once it's actually on the platform.

---

## Quick start

```bash
npm install
npm start
```

Runs at `http://localhost:3000` with hot reload.

```bash
npm test           # test runner in watch mode
npm run build      # production build to /build
```

Bootstrapped with Create React App.

---

## Project structure

```
src/
├── App.js                     # Routes
├── pages/
│   ├── SquadTennisHome.js     # Platform home: standings, top players, find a college
│   ├── SchoolHome.js          # /schools/:slug — template used by every school
│   ├── FindCollege.js
│   ├── Login.js
│   ├── Register.js            # Join-code entry determines school and role
│   └── Onboarding/            # Officer enrollment flow
├── components/
│   ├── Nav.js                 # Context-aware nav, differs by page and login state
│   ├── Standings.js
│   ├── Roster.js
│   ├── RecentMatches.js
│   ├── TeamSpot.js            # Gated internal section
│   └── SubmitResult.js        # Captain match submission
├── data/
│   ├── schools.js             # School records, colors, enrollment status
│   └── store.js               # App data store
└── styles/
```

---

## Accounts and access

Two account types. No viewer accounts — if you're browsing, you don't need an account at all.

| Type | Can do |
|---|---|
| **Player** | View their own school's Team Spot, appear on the roster and player rankings |
| **Officer** | Everything a player can, plus edit school content, manage the roster, and submit match results |

Every account is scoped to one college via `college_id`. Authorization follows from that:

- Write and edit actions only apply to your own school's pages
- Team Spot renders only when the logged-in user's college matches the page's college
- Officers edit; players view

Registration is code-based. Each school has two six-character join codes, one for officers and one for players. The code entered at registration determines both which school the account belongs to and what role it gets, which means no manual approval queue and no way to accidentally join the wrong roster.

---

## School onboarding

A new school enrolls itself in a five-step flow:

1. Enter the officer join code
2. Confirm officer status for that school
3. Officer registration — name, email, password, role on the team
4. Choose to enter roster and results now, or skip and create the page immediately
5. Page generation

Generation looks up the school's colors from a hardcoded mapping (defaulting to the platform green and white if unknown), creates the page at `/schools/:slug` using the standard school template, generates the officer and player join codes, marks the school as enrolled, and drops the officer onto their new home page already logged in. The codes are shown once on a confirmation screen with copy buttons.

The whole flow exists so onboarding a school takes one captain five minutes and zero conversations with me. That's the only way this scales past SJSU.

---

## Data model

| Entity | Fields that matter |
|---|---|
| **School** | name, slug, primary/secondary color, division, `enrolled`, officer code, player code |
| **Account** | name, email, role (officer/player), `college_id` |
| **Player** | name, school, singles/doubles record, ranking points |
| **Match** | date, two schools, lineup results, submitting officer, overall result |
| **Team info** | practice schedule, announcements, custom fields — the contents of Team Spot |

Standings are derived from submitted match results rather than stored, so there's one source of truth and no way for the table to drift from the record.

Roster, division standings, and recent matches are capped at seven rows with a "View All" link instead of a scroll area. Long unbounded lists make a page feel like a spreadsheet.

---

## Design

Dark background, green accent, subtle court-line texture behind the hero. Each school page inherits its own colors — SJSU is gold and black — while keeping the platform layout, so schools feel like theirs without fragmenting the product.

Layout notes worth preserving:

- The standings panel is deliberately wider than the top players panel. Breaking the symmetry keeps the page from reading like a template.
- Court lines stay at low opacity. Visible enough to register, faint enough to stay professional.
- No section header icons.
- The nav is context-aware: on a school page it centers "[SCHOOL] TENNIS" with a circular green button back to Squad Tennis home; on the platform home it centers "SQUAD TENNIS" and, when logged in, shows a circular button in the school's color linking to your team's page. Login and register don't appear on the platform home — they surface contextually when an action requires them.

---

## Deployment

Hosted on Vercel, connected to GitHub. Any push to `main` deploys automatically.

```bash
git add .
git commit -m "your message"
git push
```

Manual deploy:

```bash
npx vercel --prod
```

**Build note:** the build script sets `CI=false`. Vercel treats CRA warnings as errors in CI, which fails the build on lint warnings that are harmless locally. Don't remove it without cleaning up the warnings first.

---

## Roadmap

Features aimed at making teams actually compete rather than just recording that they did:

1. **Challenge system** — one team formally challenges another through the platform, which is harder to ignore than a group text
2. **Head-to-head records** — all-time record against every opponent a school has faced
3. **Season MVP leaderboard** — individual rankings across all NorCal schools, so players stay invested even when their team isn't playing
4. **End-of-season tournament** — standings seed a NorCal championship bracket, giving every regular-season match stakes
5. **Backend and real database** — move off the local data store to persist accounts, results, and uploads
6. **School logos** — replace initial-circle placeholders, the last obviously templated element on the page
