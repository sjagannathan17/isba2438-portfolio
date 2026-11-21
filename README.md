# Assignment 2 - Portfolio

Personal portfolio website for Srinidhi Jagannathan, AI builder and product manager and MS Business Analytics student at Santa Clara University.

Built with Next.js (App Router, JavaScript) and plain CSS (global styles plus CSS modules). The home page shows a dotted world atlas with pins for the places in my journey, connected by a dashed route in the order they happened. The contact form is validated on the server and messages are saved to a local JSON file.

## Run it

```
npm install
npm run dev
```

Then open http://localhost:3000.

```
npm test
```

Runs the unit tests for the contact form validation rules (Node's built-in test runner, no extra packages).

## Pages

| Page | Address |
|---|---|
| Home (hero, journey map, featured projects, recruiter assistant) | `/` |
| About Me (journey timeline, skills) | `/about-me` |
| Projects index | `/projects` |
| Project detail (one per project) | `/projects/flex-competitive-intelligence`, `/projects/agri-intelligence-platform` |
| Blog index and posts | `/blogs` |
| Workshops public board | `/workshops` |
| Contact Me (server-validated form) | `/contact-me-server-form` |
| Contact Me (client form via the API) | `/contact-me` |
| Admin (sign-in required) | `/admin`, `/admin/contacts`, `/admin/projects`, `/admin/workshops`, `/admin/blogs` |

Unknown project or blog addresses show a friendly "not found" page with a link back to the index.

Every page also has a recruiter assistant: a guided chat that answers questions from the portfolio, links to case studies, and submits an enquiry through the same validated contact backend.

## Contact form

Messages are checked on the server: name and message can't be blank, and the email needs one @, text before it, a valid domain, and no whitespace. Valid messages are saved to `data/contact-submissions.json`, which is git-ignored and created automatically on the first save.

## Admin access

The admin pages (`/admin`, `/admin/contacts`, `/admin/projects`, `/admin/workshops`, `/admin/blogs`) and all mutating API endpoints require server-verified admin sign-in. Configure it before running:

1. Copy `.env.example` to `.env.local` (both are git-ignored except `.env.example`, which holds placeholders only).
2. Fill in `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` (generate a secret with `openssl rand -base64 32`). Never commit real values.
3. Restart the dev server and sign in at `/admin`.

Data files: `data/blogs.json` and `data/projects.json` are committed portfolio content; `data/contact-submissions.json` holds personal enquiries and is git-ignored, created automatically on first save. Workshop data (`data/workshops.json`) is created automatically on first use. Public pages read these JSON files directly on the server; the admin pages and all mutations go through the `/api/*` endpoints, which require the admin session.

## License

MIT
