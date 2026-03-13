# Stephen — Developer Portfolio

A professional developer portfolio website built with vanilla HTML, CSS, and JavaScript. Content is driven by JSON files — no backend, no database, no build step required.

---

## 🚀 Running Locally

Because the site uses `fetch()` to load JSON and HTML components, you **cannot** open `index.html` directly as a local file (browsers block fetch requests from `file://`). You need a simple local server.

### Option A — VS Code Live Server (Recommended)
1. Install the **Live Server** extension in VS Code
2. Right-click `index.html` → **Open with Live Server**
3. The site opens at `http://127.0.0.1:5500`

### Option B — Node.js serve
```bash
# Install once
npm install -g serve

# Run from the portfolio folder
serve .

# Opens at http://localhost:3000
```

### Option C — Python HTTP server
```bash
# From the portfolio folder
python -m http.server 8080

# Opens at http://localhost:8080
```

---

## 📁 Project Structure

```
Portfolio/
├── index.html              # Home page
├── about.html              # About me
├── projects.html           # Projects listing + filter
├── project.html            # Project detail (uses ?id= query param)
├── skills.html             # Skills & technologies
├── certifications.html     # Certifications & achievements
├── lab.html                # Lab / Experiments
├── blog.html               # Blog post listing
├── blog-post.html          # Blog post reader (uses ?id= query param)
├── contact.html            # Contact form
│
├── css/
│   ├── variables.css       # Design tokens (colors, spacing, fonts)
│   ├── main.css            # Global styles & layout utilities
│   ├── components.css      # Reusable UI component styles
│   ├── animations.css      # Keyframe animations & scroll-reveal
│   └── pages/
│       ├── home.css        # Home-specific styles
│       ├── about.css       # About-specific styles
│       ├── projects.css    # Projects & project-detail styles
│       └── secondary.css  # Skills, Certs, Blog, Lab, Contact styles
│
├── js/
│   ├── main.js             # Component loader + SEO helpers (runs on every page)
│   └── animations.js       # Scroll-reveal + typing effect
│
├── data/
│   ├── projects.json       # All project data
│   ├── skills.json         # Skills categories & tech icons
│   ├── certifications.json # Certifications list
│   ├── blog.json           # Blog post metadata index
│   └── lab.json            # Lab / experiments data
│
├── components/
│   ├── header.html         # Navigation bar (loaded on every page)
│   └── footer.html         # Footer (loaded on every page)
│
├── blog/
│   └── posts/              # Blog posts as Markdown files
│       ├── subnetting.md
│       ├── kaggle-analysis.md
│       └── ai-project-notes.md
│
└── assets/
    └── images/             # Profile photo, project screenshots
```

---

## ✏️ Updating Content

### Change your personal info
- **Name, tagline, job status**: Edit `index.html` and `components/header.html`
- **Social links**: Edit `components/footer.html` — replace `YOUR_GITHUB`, `YOUR_LINKEDIN`, `YOUR_EMAIL`
- **Email on contact page**: Edit `contact.html` — find all `YOUR_EMAIL` references

### Update the "Currently Learning" section
Open `index.html` and find the `<!-- Currently Learning -->` section.
Edit the `.learning-item` divs directly in the HTML:

```html
<div class="learning-item reveal">
  <span class="learning-item__dot"></span>
  <div>
    <div style="font-weight:600;font-size:var(--text-sm);color:var(--text-primary)">
      Your Topic Here
    </div>
    <div style="font-size:var(--text-xs);color:var(--text-muted);margin-top:2px">
      Brief description of what you're doing
    </div>
  </div>
</div>
```

---

## ➕ Adding a New Project

1. Open `data/projects.json`
2. Copy an existing project object and paste it at the top of the array
3. Fill in your new project's details:

```json
{
  "id": "my-unique-id",          // URL-safe, no spaces
  "title": "Project Title",
  "tagline": "One sentence description",
  "categories": ["AI"],          // From: AI, Data Science, Cybersecurity, Tools, ML
  "technologies": ["Python", "Flask"],
  "emoji": "🤖",
  "description": "Full description here.\n\nSecond paragraph here.",
  "highlights": [
    "Key achievement 1",
    "Key achievement 2"
  ],
  "links": {
    "live": "https://...",
    "github": "https://github.com/..."
  },
  "date": "2026-04",
  "featured": true               // true = shows on homepage
}
```

4. Save the file — refresh the page. Your project appears immediately.

---

## ✍️ Writing a New Blog Post

1. Create a new Markdown file in `blog/posts/`:
   ```
   blog/posts/my-post-title.md
   ```

2. Write your post in Markdown format (see existing posts for examples).

3. Add an entry to `data/blog.json`:
   ```json
   {
     "id": "my-post-title",
     "title": "My Post Title",
     "slug": "my-post-title",
     "excerpt": "One or two sentence summary shown in listings.",
     "date": "2026-04-01",
     "readingTime": "5 min read",
     "tags": ["Tag1", "Tag2"],
     "file": "/blog/posts/my-post-title.md"
   }
   ```

4. Save and refresh — the post appears on `blog.html`. Clicking it opens `blog-post.html?id=my-post-title` and renders the Markdown.

---

## 🧪 Adding a Lab Experiment

1. Open `data/lab.json`
2. Add a new object:
   ```json
   {
     "id": "experiment-id",
     "title": "Experiment Title",
     "type": "ML Experiment",      // Used for filter buttons
     "emoji": "🧪",
     "description": "What you did and what you learned.",
     "tools": ["Python", "Jupyter"],
     "status": "Completed",
     "link": "https://...",
     "date": "2026-04"
   }
   ```

---

## 🌐 Deployment

### GitHub Pages (Recommended — Free)
1. Push this folder to a GitHub repository
2. Go to **Settings → Pages → Source → Deploy from branch → main → / (root)**
3. Your site is live at `https://yourusername.github.io/Portfolio`

### Netlify (Also Free — Easier)
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the entire `Portfolio` folder onto the deploy zone
3. Done — you get a live URL instantly

### Custom Domain (Optional)
Add a `CNAME` file in the root containing your domain, and configure your DNS as instructed by GitHub Pages or Netlify.

---

## 🔧 Contact Form Setup (Formspree)
1. Go to [formspree.io](https://formspree.io) and create a free account
2. Create a new form — you'll get a URL like `https://formspree.io/f/YOUR_ID`
3. In `contact.html`, replace the form action:
   ```html
   <form action="https://formspree.io/f/YOUR_ID" method="POST">
   ```
4. Test it — submissions are emailed to you automatically.

---

## 🎨 Customizing the Design

All design values live in `css/variables.css`. To change the accent color from purple to teal:

```css
--accent:       hsl(180, 90%, 45%);
--accent-hover: hsl(180, 90%, 55%);
--accent-glow:  hsla(180, 90%, 45%, 0.25);
```

Change one file → updates every page automatically.

---

## 📋 Tech Stack

| Technology | Use |
|-----------|-----|
| HTML5 | Structure (semantic, accessible) |
| CSS3 (Vanilla) | Styling — design tokens, animations |
| JavaScript (Vanilla ES2022) | Logic — component loading, data fetching |
| JSON | "Database" — content lives here |
| Markdown + marked.js | Blog posts |
| Google Fonts (Inter) | Typography |
| Formspree | Contact form backend |
| GitHub Pages / Netlify | Deployment |

No build step. No framework. No npm install needed.

---

*Built by Stephen — CS student, 2026.*
