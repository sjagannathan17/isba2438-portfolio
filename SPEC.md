# SPEC: Portfolio Website (Assignment 2)

A personal portfolio for Srinidhi Jagannathan, built with Next.js (App Router, JavaScript, no TypeScript) and plain CSS. Visual theme: light world atlas. Deadline: tonight 11:59 PM Pacific. Runs locally with `npm run dev` on Node v24.22.1. No deployment needed.

## 1. Tech and conventions

- Next.js App Router, JavaScript only, no Tailwind.
- Styling: one global stylesheet (`app/globals.css`) for the theme tokens, plus CSS Modules for components.
- Fonts via `next/font`: Playfair Display for headings, Inter for body.
- Light theme only. Cream paper background, near-black ink text, one map-red accent (dark enough for WCAG AA contrast on cream). Tinted panels for cards.
- Atlas touch on non-home pages: paper colors and a small compass icon in the page header area. No maps outside the home page.
- No em dashes anywhere in the site's text (and avoided in docs too).
- Commits in small steps with clear messages. Sri pushes to GitHub.
- Repo root: this folder (`Assignment 2 - Portfolio`). The Next.js app is created directly here.
- Git-ignored: `node_modules`, `.next`, `data/contact-submissions.json`.

## 2. Routes

| Route | Page |
|---|---|
| `/` | Home: hero, journey map, project cards |
| `/about-me` | About Me |
| `/projects` | Projects index |
| `/projects/[slug]` | Project detail (2 valid slugs, friendly not-found otherwise) |
| `/contact-me-server-form` | Contact form (server-validated via a Server Action) |

## 3. File layout

```
app/
  layout.js                     fonts, NavBar, Footer, metadata
  globals.css                   theme tokens and base styles
  page.js                       home
  about-me/page.js
  projects/page.js
  projects/[slug]/page.js       project detail
  projects/[slug]/not-found.js  friendly not-found
  contact-me-server-form/page.js
  contact-me-server-form/actions.js   Server Action: validate + save
  icon.svg                      red map pin favicon
components/
  NavBar.js + NavBar.module.css
  Footer.js + Footer.module.css
  ProjectCard.js + ProjectCard.module.css
  WorldMap.js + WorldMap.module.css
  ContactForm.js (client component) + ContactForm.module.css
lib/
  journeyPins.js                single data file for map pins (real lat/long)
  projects.js                   single data file for the two projects
  validateContact.js            shared validation rules (reused later)
  submissions.js                shared JSON read/write (reused later)
  validateContact.test.js       node:test unit tests
data/
  contact-submissions.json      git-ignored, auto-created on first save
SPEC.md, README.md, LICENSE (MIT), PROMPT_LOG.md
```

## 4. Shared elements

### Navigation bar (every page)
- Brand: "Srinidhi Jagannathan", links to `/`.
- Links in order: Home, About Me, Projects, Contact Me (Contact Me goes to `/contact-me-server-form`).
- Active page: small map-red underline. Project detail pages highlight "Projects".
- Mobile: links wrap to a second row, no hamburger.

### Footer (every page)
- LinkedIn: https://www.linkedin.com/in/srinidhi-jagannathan
- GitHub: https://github.com/sjagannathan17
- No resume PDF, no email address.

### Tab titles and favicon
- Home: `Srinidhi Jagannathan`
- Others: `About Me | Srinidhi Jagannathan`, `Projects | Srinidhi Jagannathan`, `Contact Me | Srinidhi Jagannathan`, `Flex Competitive Intelligence | Srinidhi Jagannathan`, `Agri-Intelligence Platform | Srinidhi Jagannathan`.
- Favicon: red map pin SVG (`app/icon.svg`).

## 5. Page plans

### 5.1 Home (`/`)
1. Hero: name, intro line "AI builder and product manager, MS Business Analytics at Santa Clara University", two buttons: "View projects" (to `/projects`) and "Get in touch" (to `/contact-me-server-form`).
2. Small heading "My journey" above the map.
3. World atlas map: simplified world map drawn by hand as an inline SVG in the repo (rough continent outlines are fine), no downloads, no map library, no API keys, no external requests.
4. Pins (single data file `lib/journeyPins.js`). Each pin stores its real latitude and longitude; a simple equirectangular projection formula converts lat/long to x/y positions on the SVG, so pins land roughly correctly and new pins are easy to add. Pins are keyboard-focusable controls with readable labels; activating a pin opens a small card with the text, the dates, and a link.

| Pin | Dates | Card text | Link |
|---|---|---|---|
| Chennai, India | 2014 to 2018 | B.E. in Electrical & Electronics Engineering at SSN College of Engineering | `/about-me` |
| Bengaluru, India | 2021 to 2024 | About 2.5 years at iGreenData in fintech, payments and data | `/about-me` |
| Fiji, Samoa, and Vanuatu | 2022 to 2024 | Led go-live of RTGS and ACH payment systems | `/about-me` |
| Santa Clara, USA | 2024 to present | MS Business Analytics at SCU, Graduate TA, Flex practicum | `/projects/flex-competitive-intelligence` |
| Zambia | 2026 | Agri-Intelligence Platform, a WhatsApp AI system for 22,000+ farmers (team project) | `/projects/agri-intelligence-platform` |

5. Below the map: both project cards and a "See all projects" link. No skills strip, no about teaser.
6. Agreed fallback: if the SVG map is not solid by the deadline, ship a simple styled list of places (same data file, same card content) and improve later.

### 5.2 About Me (`/about-me`)
Real content, professional tone, no em dashes:
- Intro: "Srinidhi Jagannathan, an AI builder and product manager, and an MS in Business Analytics student at Santa Clara University."
- Education: M.S. in Business Analytics (Data Science & AI track), Santa Clara University, Leavey School of Business, graduating December 2026. B.E. in Electrical & Electronics Engineering, SSN College of Engineering, Chennai.
- Experience: about 2.5 years at iGreenData (a Synechron company), Bengaluru, in fintech. Led go-live of RTGS and ACH payment systems in Samoa, Fiji, and Vanuatu, moving interbank settlement from up to 5 days to real time. Built dashboards tracking 50+ KPIs across 12 institutions.
- AI Product Manager on the Flex industry practicum at SCU.
- Graduate Teaching Assistant for the Operations & Supply Chain and Supply Chain Finance courses, mentoring 60+ graduate students.
- Skills, grouped: Code and data (Python, SQL, R, JavaScript, Pandas, scikit-learn, PyTorch, XGBoost); AI (RAG, LLMs, multi-agent systems, LangGraph, LangChain, ChromaDB, FAISS, model and LLM evaluation); Product (PRDs, roadmapping, user research, A/B testing, stakeholder management, Agile, Figma, Jira); Build and visualize (FastAPI, Next.js, Streamlit, Tableau, Power BI, Gurobi).
- Looking for: Associate or early-career Product Manager roles in AI and fintech, full-time, starting after December 2026, open to relocating anywhere in the US.
- CTA: "Get in touch" button linking to the contact page.

### 5.3 Projects (`/projects` and `/projects/[slug]`)
- Index: one tinted card per project (name, tag, short blurb, placeholder panel, link to detail page). Tags: Flex Competitive Intelligence = "AI · Competitive Intelligence", Agri-Intelligence Platform = "AI · Social Impact".
- Detail pages look up the slug in `lib/projects.js`. If the slug is not there, the page calls `notFound()`, which renders the friendly not-found page below. Content uses "we" for the platform work; no team sizes, and no names of the sponsor, advisor, or teammates anywhere on the site.

**Flex Competitive Intelligence** (`/projects/flex-competitive-intelligence`)
- What: an AI platform that tracks AI capital spending at 5 contract manufacturers using SEC filings, earnings calls, patents, and job posts, and answers natural-language questions about competitors.
- Why: Flex's analysts spent hours reading financial documents by hand. We cut that manual analysis by 70% for about $30 a month, replacing a five-figure SaaS tool.
- Role: AI Product Manager for an SCU industry practicum with Flex. I defined the scope and led delivery, built NLP pipelines to pull insights from earnings calls and investor communications, and implemented the RAG application with vector search.
- Tech: Python, RAG with vector search, web search, NLP pipelines, LangGraph, ChromaDB, FastAPI, Next.js.
- Link: https://github.com/sjagannathan17/flex-competitive-intelligence

**Agri-Intelligence Platform** (`/projects/agri-intelligence-platform`)
- What: a WhatsApp-based AI system for Good Nature Agro in Zambia that sends farmers risk-based advisories by zone, and answers questions in English, Bemba, and Nyanja. Serves 22,000+ farmers.
- Why: smallholder farmers needed timely, local-language advice on a channel they already use.
- Context: a team project for the SCU Analytics Showdown, Spring 2026, where we finished runner-up.
- Tech: Claude, a 5-agent system, WhatsApp, two-stage XGBoost risk model (AUC 0.931).
- Link: https://github.com/sjagannathan17/agri-intelligence-platform

- Unknown slug (e.g. `/projects/nope`): friendly "Project not found" page with a link back to `/projects`. Use the route segment `not-found.js` so the rest of the site is unaffected.

### 5.4 Contact (`/contact-me-server-form`)
- Client component form with labeled Name, Email, Message fields and a "Send message" button, disabled while submitting and showing "Sending...".
- `noValidate` on the form so the browser's own checks are off and the server's rules run.
- The browser runs no rules of its own: no required attributes, no client-side copy of the validation logic. The form only displays the errors returned by the server.
- The Server Action catches save failures (for example a read-only data file) and returns the request-failure state instead of crashing.
- Submits to a Server Action defined in `app/contact-me-server-form/actions.js` (`"use server"`), which validates with `lib/validateContact.js` and saves with `lib/submissions.js`. No `/api/contact` route yet; Part 2 adds that route and both share the same modules.
- Exactly three visible states, clearly different:
  1. **Validation errors**: summary line above the form plus red error text under each invalid field. Typed values are kept.
  2. **Success**: green confirmation box above the form, fields cleared, box stays visible.
  3. **Request failure**: saving to the JSON file failed. Distinct message, e.g. "Something went wrong sending your message. Please try again." Typed values kept.

### 5.5 Shared validation rules (`lib/validateContact.js`)
One function, for example `validateContact({ name, email, message })`, returning per-field errors plus a summary. Rules:
- Name: required, not empty after trimming.
- Message: required, not empty after trimming.
- Email: exactly one `@`, non-empty text before it, a domain after it that contains at least one dot with no empty parts between dots, including after the last dot (so a trailing dot fails), and no whitespace anywhere (spaces, tabs, or line breaks). So all of these fail: `a@b`, `a@@b.com`, `@b.com`, `a@b..com`, `a@.com`, `"a@b.com."`, `a b@c.com`. All of these pass: `a@b.com`, `first.last@sub.domain.org`.
- Missing fields are treated as empty strings, never a crash.
- Pure module with no I/O, so it can be unit-tested and reused by the future second form and admin page.

### 5.6 Shared submissions storage (`lib/submissions.js`)
- File: `data/contact-submissions.json`, git-ignored.
- Auto-created on first save, including the `data` folder if missing.
- Each entry: `id` (unique), `name` (trimmed), `email` (exactly as typed), `message` (trimmed), `submitted` (timestamp), `source: "server-form"`.
- A save failure (for example a read-only file) is caught by the Server Action and returned as the request-failure state, never a crash.
- All read and write logic lives here, ready for Part 2: a second contact form via an API route at `/api/contact` (source `"api"`) and an admin page, all reading this same file. Do not build those now.

## 6. Test checklist

### 6.1 Automated (node:test, no extra packages)
Run with `node --test`. `lib/validateContact.test.js` covers:
- [ ] Valid input passes with no errors (e.g. name "Sri", email "a@b.com", message "Hello").
- [ ] Blank name fails (empty and spaces-only).
- [ ] Blank message fails (empty and spaces-only).
- [ ] Bad emails fail: `a@b`, `a@@b.com`, `@b.com`, `a@b..com`, `a@.com`, `"a@b.com."`, `a b@c.com`, plus a tab case such as `a<TAB>b@c.com`.
- [ ] Missing fields (undefined) are treated as empty and return errors instead of crashing.
- [ ] Good emails pass: `a@b.com`, `first.last@sub.domain.org`.

### 6.2 Manual browser checks
**Setup**
- [ ] `npm install` then `npm run dev` starts cleanly, site loads at localhost:3000 with no console errors.

**Navigation and chrome (every page)**
- [ ] NavBar on all four pages with brand linking home and the four links in order.
- [ ] Red underline on the correct active link on each page; `/projects/flex-competitive-intelligence` highlights "Projects".
- [ ] Footer shows LinkedIn and GitHub links that open correctly.
- [ ] At 375px width the nav links wrap to a second row and nothing overlaps.
- [ ] Tab titles match Section 4 on every page; red pin favicon shows.

**Home**
- [ ] Hero shows name, intro line, and both buttons; "View projects" goes to `/projects`, "Get in touch" goes to `/contact-me-server-form`.
- [ ] "My journey" heading above the map; map is an inline SVG with no network requests to map services.
- [ ] Pins land in roughly correct places (equirectangular projection from lat/long in the data file).
- [ ] All 5 pins present with readable labels; Tab reaches each pin in order; Enter opens its card.
- [ ] Each pin card shows the right text, dates, and link from the table in 5.1, and the link navigates correctly.
- [ ] Both project cards render with names and tags, plus a working "See all projects" link.
- [ ] If fallback list shipped instead: same pin data renders as cards/list with working links.

**About Me**
- [ ] All sections from 5.2 present and accurate; skills grouped as specified; CTA button links to the contact page; no em dashes.

**Projects**
- [ ] Index shows both cards with correct names, tags, blurbs, and links.
- [ ] Both detail pages render their own content, tech list, and GitHub link, with "we" phrasing and no team sizes.
- [ ] `/projects/nope` shows the friendly "Project not found" message with a working link back to `/projects`.

**Contact form**
- [ ] Name, Email, Message all have visible labels; form has `noValidate` and no client-side rule copy (submitting an empty form shows server errors, not a browser popup, and no required attributes block it).
- [ ] Empty submit: summary line plus red errors under fields; typed values kept.
- [ ] Each bad email from 6.1 shows a clear error on the email field.
- [ ] Valid submit: green success box above the form, fields cleared, success box stays visible.
- [ ] After a valid submit, `data/contact-submissions.json` exists and the newest entry has id, name (trimmed), email (exactly as typed), message (trimmed), a submitted timestamp, and `"source": "server-form"`.
- [ ] Delete the `data` folder, submit again: folder and file are recreated automatically.
- [ ] Request failure state: make `data/contact-submissions.json` (or the `data` folder) read-only, submit, and confirm the distinct "Something went wrong..." message appears, with typed values kept. Restore permissions afterward.

**Hygiene**
- [ ] `git status` does not show `data/contact-submissions.json`.
- [ ] LICENSE (MIT), README (run instructions plus page list), and PROMPT_LOG.md placeholder exist.
- [ ] No em dashes in any rendered site text.

## 7. Commit plan (small steps)

1. Scaffold Next.js (JS, App Router), fonts, globals, NavBar, Footer, placeholder pages.
2. About Me page content.
3. Projects data file, index, detail pages, not-found.
4. Home: hero, journey pins data, WorldMap, project cards.
5. Contact: validation module + unit tests, submissions module, Server Action, form UI and states.
6. Content approval pass: render About, pins, and both project pages, show the final text for approval, apply edits.
7. Polish: favicon, titles, README, LICENSE, PROMPT_LOG.md placeholder, `.gitignore` entries, final manual pass.

## 8. Resolved decisions

1. **Endpoint**: Server Action for this form. Part 2 adds `/api/contact`; both share `lib/validateContact.js` and `lib/submissions.js`.
2. **Map**: simplified world map SVG drawn inside the repo, no internet downloads.
3. **Pins**: real lat/long in the data file, equirectangular projection to x/y.
4. **Copy review**: final About, pin, and project text gets shown for approval before being committed.
5. **Root**: repo root is the app root. SPEC.md is committed as part of the repo.
