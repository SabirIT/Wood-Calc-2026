# 🪵 Wood Calculator

A simple, free, mobile-first app to calculate the volume of **size wood** and **log wood** in cubic feet (cft), keep a running list, and save it as a PDF.

**Live app:** https://sabirit.github.io/wood-Calc/

It works in any phone browser and can be installed like a normal app. No sign-up, no ads, no server. Your data stays on your own phone.

---

## ✨ Features

- Two calculators: **Size Wood** and **Log Wood**
- Separate list and separate total for each type
- Add each result to a list, delete single entries, or clear the list
- **Save list as PDF** to the phone's storage
- Installable on Android and iPhone (PWA)
- Works offline after the first visit
- Light and dark mode follow the phone's setting
- Saved data stays on the user's device only (nothing is uploaded)

---

## 🧮 How it calculates

### Size Wood

| Field | Unit |
|---|---|
| Length | feet (e.g. `6.5`) |
| Width | inches |
| Thickness | inches |

```
Volume (cft) = Length × Width × Thickness ÷ 144
```

Every step is **rounded normally** to 2 decimals (5.2163 shows as 5.22).

### Log Wood

| Field | Unit |
|---|---|
| Length | feet (e.g. `6.5`) |
| Roundness | typed as `ft.in` (e.g. `3.7` means 3 ft 7 in) |

The number before the point is multiplied by 12, and the number after the point is added as inches.

```
Roundness in inches = (feet × 12) + inches        e.g. 3.7 → 43
Volume (cft) = Roundness² × Length ÷ 2304         e.g. 43 × 43 × 6.5 ÷ 2304
```

Every step is **cut off** after 2 decimals with no rounding up (5.2163 shows as 5.21).

The list total for each type adds up the values shown in its list.

---

## 📱 Install on your phone

**Android (Chrome):** open the link, tap the menu (⋮), then **Install app** or **Add to Home screen**.

**iPhone (Safari):** open the link, tap **Share**, then **Add to Home Screen**.

---

## 📄 Save the list as PDF

1. Add your entries.
2. Tap **Save list as PDF**.
3. In the print screen, choose **Save as PDF** and save.

The PDF has a title, the date, a numbered table of entries and the total.

---

## 🛠️ Tech stack

- HTML, CSS and vanilla JavaScript (no frameworks, no build step)
- `localStorage` for saving the list on the device
- Progressive Web App: `manifest.json` and a service worker for install and offline use
- Hosted free on GitHub Pages

---

## 📁 Project structure

```
wood-Calc/
├── index.html          # page structure
├── css/
│   └── style.css       # design, dark mode, print styles
├── js/
│   └── app.js          # calculations, list, PDF button
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
├── manifest.json       # app name, colors, icons
├── service-worker.js   # offline support
└── README.md
```

---

## 💻 Run locally

PWA features need `http://`, so do not open `index.html` by double-clicking.

**With VS Code:** install the **Live Server** extension, right-click `index.html`, then choose **Open with Live Server**.

**With Python:**

```bash
python -m http.server 8000
```

Then open http://localhost:8000

---

## 🚀 Deploy on GitHub Pages

1. Push all files to a public GitHub repository, with `index.html` at the top level.
2. Go to **Settings → Pages**.
3. Set **Source** to *Deploy from a branch*, choose `main` and `/ (root)`, then **Save**.
4. After 1 to 2 minutes your app is live at `https://YOURNAME.github.io/REPO/`.

### Updating the app

After changing any file, open `service-worker.js` and increase the cache version, for example from `woodcalc-v2` to `woodcalc-v3`. Without this, users may keep seeing the old version.

---

## 🔒 Privacy

The app has no account, no analytics and no backend. Wood entries are stored in the browser's `localStorage` on each user's own phone. Clearing browser data or uninstalling the app removes the saved list, so save a PDF of anything you need to keep.

---

## 🗺️ Ideas for the future

- Backup and restore the list as a file
- Price per cft and amount column
- Bengali and Hindi language options
- Share the list on WhatsApp

---

## 📜 License

Add a license of your choice (for example MIT) in a `LICENSE` file.

## 👤 Author

Made by **Sabir Ahamed**.
