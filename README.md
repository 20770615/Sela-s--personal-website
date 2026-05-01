# Sela Portfolio (Editable)

This is a no-build static website for job applications.

## What is included

- Bilingual switch (Chinese / English)
- Curtain-style opening animation on first load
- Sections for education, experience, asset management focus, awards
- `Outside of Work` cards with click-to-open details
- Favorite artists section
- Travel map with hover tooltip for visited countries
- Decap CMS admin panel at `/admin` for content editing

## File structure

- `index.html` - page shell
- `styles.css` - full visual style and animations
- `script.js` - rendering, language switch, modal, map interactions
- `content/zh.json` - Chinese content
- `content/en.json` - English content
- `admin/config.yml` - Decap CMS config
- `admin/index.html` - Decap CMS entry

## How to edit content quickly

1. Edit `content/zh.json` and `content/en.json` directly.
2. Replace text, lists, and travel details.
3. Add your images in a folder such as `assets/uploads/`.
4. Update `script.js` rendering blocks to place image URLs where needed.

## Using Decap CMS (visual editor)

1. Push this project to your GitHub repository.
2. Update `admin/config.yml`:
   - `repo: your-github-username/your-repo-name`
3. Deploy on Netlify (or similar static host).
4. Enable Identity + Git Gateway on Netlify.
5. Open `/admin` to visually edit your content.

> If you want fully local visual editing without Netlify, install Decap local proxy server later and switch backend mode.
