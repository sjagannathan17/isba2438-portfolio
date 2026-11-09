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
| Home (hero, journey map, featured projects) | `/` |
| About Me (journey timeline, skills) | `/about-me` |
| Projects index | `/projects` |
| Project detail (one per project) | `/projects/flex-competitive-intelligence`, `/projects/agri-intelligence-platform` |
| Contact Me (server-validated form) | `/contact-me-server-form` |

Unknown project addresses show a friendly "Project not found" page with a link back to Projects.

## Contact form

Messages are checked on the server: name and message can't be blank, and the email needs one @, text before it, a valid domain, and no whitespace. Valid messages are saved to `data/contact-submissions.json`, which is git-ignored and created automatically on the first save.

## License

MIT
