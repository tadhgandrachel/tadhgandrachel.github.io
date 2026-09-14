# Rachel & Tadhg — wedding website

A small static site for our wedding on **9 April 2027** at **The Ravenswood, Sussex**. White background, film-strip photos, handwritten type, and an RSVP form that writes straight to a Google Sheet.

Pages: `index.html` (invitation) · `the-day.html` · `photos.html` · `rsvp.html`

There is no build step. Open `index.html` locally, or host the folder on GitHub Pages.

## Quick start

1. Edit `js/config.js` with your details.
2. Replace the images in `img/photos/`.
3. Connect Google Sheets (below) and paste the Web App URL into `js/config.js`.
4. Preview the site:

```bash
python3 -m http.server 5173
```

Then open [http://localhost:5173](http://localhost:5173).

---

## 1. Information to populate

Everything guests see is driven by **`js/config.js`**. Change the values, save, and refresh.

| Field | What to put |
| --- | --- |
| `partnerOne` / `partnerTwo` | Names, as they should appear in the header and footer |
| `headline` | The three red lines on the hero (`we're` / `getting` / `married!`) |
| `inviteLead` | Line above the names (`You're invited to`) |
| `date.display` | Date as shown on the page (`09.04.2027`) |
| `date.weekday` | Day of the week |
| `date.timeLabel` | Ceremony time, or leave as `Time to be confirmed` |
| `date.start` / `date.end` | ISO datetimes used for Add to Calendar |
| `venue.name` | Venue name |
| `venue.area` | Short location line (`Sussex, UK`) |
| `venue.address` | Full address |
| `venue.mapsUrl` | Google Maps link |
| `venue.notes` | Small line under the hero (`Please RSVP if you can come.`) |
| `story.heading` / `story.body` | The short “about the day” paragraph |
| `schedule` | Running order. Keep `time: "TBC"` until you know |
| `stay.heading` / `stay.body` | Hotels / on-site rooms |
| `photos` | File paths and alt text. Add or remove entries as needed |
| `rsvp.deadline` | Reply-by date shown above the form |
| `rsvp.googleScriptUrl` | Web App URL from Apps Script (section 3) |
| `rsvp.inviteCode` | Optional shared code. Leave `""` to hide the field |
| `contactEmail` | Shown in the footer |

You do **not** need to edit the HTML files for ordinary copy changes.

---

## 2. Photos

Hero frames and the photo strip both read from the `photos` list in `js/config.js`.

| File | Role |
| --- | --- |
| `img/photos/01.jpg`–`04.jpg` | Hero photos from the invitation card. Overwrite these anytime |
| `img/photos/05.jpg`–`08.jpg` | Labelled placeholders ready to use |
| `img/invite.jpg` | Social-share image |

To add or replace photos:

1. Export portraits, roughly **3:4**, under about **800 KB** each.
2. Save them as `img/photos/05.jpg` (or overwrite `01.jpg`, …).
3. Add a line to the `photos` array in `js/config.js`.

The first four images are the hero film strip. Every entry in `photos` appears in the Photos section.

---

## 3. Connect Google Sheets

RSVPs are posted to a Google Apps Script web app, which appends a row to your spreadsheet. No server, no database.

### Create the sheet

1. Go to [sheets.google.com](https://sheets.google.com) and start a **Blank spreadsheet**.
2. Name it something like `Wedding RSVPs`.
3. You can leave the first tab empty. The script creates a tab called `RSVPs` and writes these headers on first use:

`Timestamp | Name | Email | Attending | Guests | Dietary | Message`

### Add the script

1. In the sheet: **Extensions → Apps Script**.
2. Delete any code in `Code.gs`.
3. Paste the contents of [`sheets/Code.gs`](sheets/Code.gs).
4. Optional: set `NOTIFY_EMAIL` at the top of that file to your email if you want a message each time someone RSVPs.
5. Click **Save** (disk icon). Name the project `Wedding RSVP`.

### Deploy the web app

1. Click **Deploy → New deployment**.
2. Gear icon next to **Select type → Web app**.
3. Settings:
   - **Description:** `RSVP form`
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`
4. Click **Deploy**.
5. Google will ask you to **Authorise access**. Choose your account, click through the “unverified app” warning (**Advanced → Go to Wedding RSVP**), and allow.
6. Copy the **Web app URL**. It looks like:

```
https://script.google.com/macros/s/AKfycb…/exec
```

7. Paste that URL into `js/config.js`:

```js
rsvp: {
  deadline: "1 February 2027",
  googleScriptUrl: "https://script.google.com/macros/s/YOUR_ID/exec",
  inviteCode: "",
}
```

### Test it

1. Open the site and submit a dummy RSVP.
2. Check the `RSVPs` tab in the sheet — a new row should appear within a few seconds.
3. Optional: open the Web App URL in a browser. You should see `RSVP endpoint is live.`

If nothing appears, open **Apps Script → Executions** and look for a failed run. The usual causes are forgetting to deploy, or setting “Who has access” to something other than **Anyone**.

When you change `Code.gs` later, use **Deploy → Manage deployments → Edit (pencil) → New version**, then Deploy again. The URL stays the same.

---

## 4. Publish

The site is just HTML, CSS, JS, and images.

**GitHub Pages**

1. Push this repo to GitHub.
2. **Settings → Pages → Deploy from a branch**.
3. Branch: `main` or `master`, folder: `/ (root)`.
4. After a minute the site is at `https://YOUR_USER.github.io/YOUR_REPO/`.

Any other static host (Netlify, Cloudflare Pages, a folder on your own domain) works the same way: upload the repo root.

---

## Folder map

```
index.html          Invitation home page
the-day.html        When, where, running order, stay
photos.html         Photo gallery
rsvp.html           RSVP form
css/styles.css      Layout and invitation styling
js/config.js        All guest-facing copy and the Sheets URL
js/app.js           Renders each page, calendar links, RSVP submit
sheets/Code.gs      Paste this into Apps Script
img/photos/         Replace these JPEGs
img/invite.jpg
```
