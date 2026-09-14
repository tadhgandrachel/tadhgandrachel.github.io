# Rachel & Tadhg — wedding website

A small static site for our wedding on **9 April 2027** at **The Ravenswood, Sussex**. White background, film-strip photos, handwritten type, and personal RSVP links that update a Google Sheet guest list. After someone replies, their link becomes read-only — they email you to change it.

Pages: `index.html` (invitation) · `the-day.html` · `getting-there.html` · `photos.html` · `rsvp.html`

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
| `venue.mapsEmbedUrl` | Embed URL for the map on Getting there |
| `venue.notes` | Small line under the hero (`Please RSVP if you can come.`) |
| `story.heading` / `story.body` | The short “about the day” paragraph |
| `itinerary` | Friday and Saturday running order. Keep Friday times as `TBC` until you know |
| `gettingThere.heading` / `gettingThere.body` | Intro on the Getting there page |
| `travel.heading` / `travel.paragraphs` | Saturday trains from The Ravenswood to Putney |
| `flights` | Dublin–Gatwick Skyscanner copy and dates |
| `sunday.heading` / `sunday.body` | Boat Race note for anyone staying on |
| `stay.heading` / `stay.paragraphs` | Where to stay, Gatwick, nearby towns |
| `photos` | File paths and alt text. Add or remove entries as needed |
| `rsvp.deadline` | Reply-by date shown above the form |
| `rsvp.googleScriptUrl` | Web App URL from Apps Script (section 3) |
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

## 3. Guest list and unique RSVP links

Each household gets a private link like:

```
https://tadhgandrachel.github.io/?g=ab3k9m2q
```

That link opens the invitation home page. The token stays with them as they browse, so RSVP still knows who they are. The form will not accept RSVPs without a valid token from your sheet. Older `/rsvp.html?g=` links still work.

### Create the sheet

1. Go to [sheets.google.com](https://sheets.google.com) and start a **Blank spreadsheet**.
2. Name it something like `Wedding guests`.
3. Rename the first tab to **Guests** (or leave it; the script will create `Guests` if needed).
4. Put guests in rows. You only need to fill the name columns yourself:

| Token | Name | Plus one allowed | Plus one name | Email | Link | … |
| --- | --- | --- | --- | --- | --- | --- |
| *(leave blank)* | Sam O'Neill | No | | sam@example.com | *(leave blank)* | |
| *(leave blank)* | Alex & Jo | Yes | Jo Murphy | alex@example.com | *(leave blank)* | |

- **Name** — the person (or household) the invite is for. This is locked on the form.
- **Plus one allowed** — `Yes` if they may bring a guest, `No` if not.
- **Plus one name** — optional. Fill this if you already know who the +1 is; they will see that name. Leave blank to let them type a name.
- **Email** — optional. Prefills the form.

The script fills **Token** and **Link**, and later writes the RSVP answers into the remaining columns on **that same row**. It does not add a new row.

When someone opens their personal link (and any other page in that same tab), the script also writes **Opened at**, **Last opened**, **Opens**, and **Last page**. That happens even if they never submit the form — handy for seeing who looked and who has not replied yet. Filter for Opens greater than 0 and a blank Attending column.

Once **Attending** or **Responded at** is filled, the guest sees a read-only copy of their reply. They cannot edit it on the site. If they need a change, they contact you; you can unlock the row by clearing those two cells.

### Add the script

1. In the sheet: **Extensions → Apps Script**.
2. Delete any code in `Code.gs`.
3. Paste the contents of [`sheets/Code.gs`](sheets/Code.gs).
4. Set `SITE_URL` at the top to `https://tadhgandrachel.github.io/`
5. Optional: set `NOTIFY_EMAIL` if you want an email each time someone RSVPs.
6. **Save**. Name the project `Wedding RSVP`.

### Generate the links

1. In Apps Script: select `generateGuestLinks` → **Run**. Authorise when asked.
2. Or reload the spreadsheet and use **Wedding → Generate RSVP links**.
3. Each named row now has a Token and a full Link to the home page (`/?g=…`). Send that Link to that guest — not a generic URL without `?g=`. Re-run this after updating the script if older rows still point at `/rsvp.html`.

If you add more guests later, run **Generate RSVP links** again. Existing tokens are left as they are.

### Deploy the web app

1. **Deploy → New deployment** → type **Web app**.
2. **Execute as:** `Me`. **Who has access:** `Anyone`.
3. **Deploy**, authorise, and copy the Web App URL (`https://script.google.com/macros/s/…/exec`).
4. Paste it into `js/config.js`:

```js
rsvp: {
  deadline: "1 February 2027",
  googleScriptUrl: "https://script.google.com/macros/s/YOUR_ID/exec",
}
```

5. Push the site so the live Pages site has that URL.

### Test it

1. Copy one **Link** from the sheet.
2. Open it. You should land on the invitation. Open RSVP — you should see “Hello, [Name]” and, if allowed, the +1 fields.
3. Submit a dummy RSVP. The same row should update: Attending, Plus one attending, Dietary, Message, Responded at. Opening the link (even without submitting) should fill Opened at, Last opened, Opens, and Last page.
4. Open the same link again. They should see a read-only copy of their reply, not the form. A second submit is rejected.

To let someone reply again (for example after they email you), clear **Attending** and **Responded at** on their row.

Opening `/rsvp.html` with no saved token shows a note to use the personal link.

If a link fails, check **Apps Script → Executions**. After you change `Code.gs`, use **Deploy → Manage deployments → Edit → New version**.

---

## 4. Publish (GitHub Pages)

This repo is `tadhgandrachel.github.io`, so GitHub Pages serves the site from the `main` branch. No extra host is needed.

1. Push `main` to GitHub (see below if you use a PAT).
2. On GitHub: **Settings → Pages**.
3. **Build and deployment → Source:** `Deploy from a branch`.
4. **Branch:** `main` / `/ (root)` → **Save**.
5. After a minute or two the site is at:

   **https://tadhgandrachel.github.io/**

`.nojekyll` is already in the repo so GitHub will not run Jekyll on the files.

Later changes go live the same way: commit, push `main`, wait for Pages to rebuild.

### Push with a PAT (no Keychain)

`origin` is HTTPS. From a local terminal, so the token is not stored:

```bash
cd /Users/tadhgokeeffe/repos/jsons/wedding-website
read -s GH_TOKEN
git -c credential.helper= \
  push -u "https://tadhgandrachel:${GH_TOKEN}@github.com/tadhgandrachel/tadhgandrachel.github.io.git" main
unset GH_TOKEN
```

Use the GitHub username that owns the token if it is not `tadhgandrachel`.

---

## Folder map

```
index.html          Invitation home page
the-day.html        When, where, running order
getting-there.html  Map, flights, stay, and Saturday to Putney
photos.html         Photo gallery
rsvp.html           RSVP (uses ?g= from the link or the same tab)
css/styles.css      Layout and invitation styling
js/config.js        All guest-facing copy and the Sheets URL
js/app.js           Renders each page, calendar links, RSVP submit
sheets/Code.gs      Paste this into Apps Script
img/photos/         Replace these JPEGs
img/invite.jpg
```
