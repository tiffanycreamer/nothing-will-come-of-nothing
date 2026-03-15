# Nothing Will Come of Nothing — Teaser Site

Psychological horror film splash page. Static HTML/CSS/JS, deployable on GitHub Pages.

---

## Folder Structure

```
/site
├── index.html        ← Main page
├── style.css         ← All styles
├── script.js         ← Audio, form, FX logic
└── /media
    ├── wind.mp3      ← Ambient wind/horror audio (you supply)
    ├── background.jpg  ← Optional: swap sky gradient for a real photo
    └── README.md
```

---

## Step 1 — Connect Formspark

1. Go to https://formspark.io and create a free account
2. Click **Create Form** — name it "NWCON Mailing List" (or anything)
3. Copy your **Form ID** (looks like: `abc123xyz`)
4. In `index.html`, find this line:

```html
action="https://submit-form.com/YOUR_FORMSPARK_ID"
```

Replace `YOUR_FORMSPARK_ID` with your actual Form ID:

```html
action="https://submit-form.com/abc123xyz"
```

5. That's it. Formspark handles storage + email notifications.
   Go to your Formspark dashboard to export or view submitted emails.

> **Note:** Until you replace the placeholder ID, the form runs in
> "dev mode" — it simulates a successful submission without sending
> anything, so you can test the UI locally.

---

## Step 2 — Add Audio

The site expects `media/wind.mp3` for ambient sound.

**Free sources for atmospheric horror audio:**
- https://freesound.org — search "wind ambience", "horror drone", "forest night"
- https://pixabay.com/sound-effects/ — search "eerie wind"

**Recommended:** A low, continuous wind with a distant unsettling undertone.
Keep the file under 2–3MB for fast loading. Convert to MP3 if needed:
```
ffmpeg -i input.wav -b:a 96k media/wind.mp3
```

---

## Step 3 — Deploy to GitHub Pages

### First time:

1. Create a new GitHub repository (e.g. `nothing-will-come-of-nothing`)
2. Make it **public** (required for free GitHub Pages)
3. Push your `/site` folder contents to the repo root:

```bash
cd site
git init
git add .
git commit -m "Initial teaser site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

4. In GitHub: go to **Settings → Pages**
5. Under **Source**, select branch `main`, folder `/ (root)`
6. Click **Save**
7. Your site will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

### Updates later:

```bash
git add .
git commit -m "Update"
git push
```

GitHub Pages auto-deploys within ~60 seconds.

---

## Optional: Custom Domain

1. Buy a domain (e.g. `nothingwillcomeofnothing.com`)
2. In GitHub Pages settings, enter your custom domain
3. Add a `CNAME` file to your repo root containing just your domain name
4. Point your domain's DNS to GitHub Pages IPs (GitHub docs have the exact IPs)

---

## Expanding Later

- Add a **countdown timer** to a premiere date
- Swap the CSS sky gradient for a **real atmospheric background image**
- Add a **trailer modal** that opens on a button click
- Add **scroll sections** for cast, director, festival selections
- Integrate a **Mailchimp** link if you want more powerful email campaigns

---

## Performance Notes

- All visuals are CSS/SVG — no heavy images required to launch
- Audio is lazy-loaded and only plays after user interaction (browser policy)
- Fonts load from Google Fonts CDN — consider self-hosting for max speed
- Total page weight without audio: ~20KB

---

*"Some things cannot be undone."*
