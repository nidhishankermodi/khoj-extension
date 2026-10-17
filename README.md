<div align="center">

<img src="extension/icons/icon128.png" width="88" alt="Khoj logo">

# Khoj — Price Aggregator for Indian Stores

**Describe what you want once. Compare it across Amazon, Flipkart, JioMart, Croma and Reliance Digital, side by side.**

[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg)](LICENSE)
![Manifest V3](https://img.shields.io/badge/Chrome-Manifest%20V3-4285F4?logo=googlechrome&logoColor=white)
[![Latest release](https://img.shields.io/github/v/release/nidhishankermodi/khoj-extension?label=release&color=blue)](https://github.com/nidhishankermodi/khoj-extension/releases/latest)
![Languages](https://img.shields.io/badge/UI-9%20languages-2B8A3E)
[![Tests](https://github.com/nidhishankermodi/khoj-extension/actions/workflows/ci.yml/badge.svg)](https://github.com/nidhishankermodi/khoj-extension/actions/workflows/ci.yml)

[English](README.md) · [हिन्दी](README.hi.md)

<img src="docs/screenshots/full-tab.png" width="900" alt="Khoj comparing Samsung 5G phones under ₹20,000 across five stores">

</div>

---

## Why Khoj?

Buying a phone (or a fridge, or diapers) in India usually means opening five tabs, typing the same search five times, and squinting at prices that are each formatted differently. Khoj does that for you:

> *"Samsung 5G phone, 8GB RAM, 128GB, 50MP camera, under 20000"*

…goes in, and you get **one list, sorted by price**. Each result shows which of your specs it matches.

It runs entirely in your browser. No server, no account, no tracking.

## Features

- 🗣️ **Plain-language search.** Write it the way you'd say it, in English, Hinglish or an Indian language. Khoj picks out the brand, budget and specs: `15k-25k`, `20000 तक`, `8/256`, `300 litres 3 star`, `1.5 ton split`, `XL 50 pcs`.
- 🛒 **5 stores at once.** Amazon.in, Flipkart, JioMart, Croma and Reliance Digital.
- 🗂️ **55 categories in 14 groups, 140 smart filters.** Each category gets its own fields:

  | Category | Its filters |
  |---|---|
  | Mobiles | RAM, storage, expandable storage (microSD), camera MP, battery mAh, AMOLED/LCD, refresh rate, 5G |
  | Laptops | Processor, RAM, SSD, screen size, gaming / thin & light, OS, dedicated GPU |
  | Refrigerators | Capacity (L), door type, star rating, inverter |
  | Power tools | Tool type, corded/cordless, battery voltage, wattage |
  | Diapers | Pants/taped, size (NB → XXL), pack count |
  | …and 50 more | TVs, ACs, washing machines, footwear, grocery, toys, pet food… |

- 🔎 **Category type-ahead.** Type `mob`, `fri`, `dia` or `tool` to jump to that category. Khoj also detects the category from your description, and unticks stores that don't sell it.
- ⭐ **Customer rating filter.** Show only items rated 3★, 3.5★, 4★ or 4.5★ and up. Changing it updates the current results straight away, without searching again. Khoj also picks it up from your description: `4 star and above`, `rating 4.5+`, `highly rated`.
- ↕️ **Sort & filter.** Sort by price (either way), best match, rating or biggest discount. You can show only items that match your specs, hide sponsored items and accessories (no phone covers in your phone search), and show or hide out-of-stock items.
- ✅ **Spec badges.** `✓` matched, `✕` doesn't match, `?` not mentioned. Anything else you write, like `dual sim`, `headphone jack` or a model name, is searched for and gets its own badge too. **Best deal** marks the cheapest in-stock item that meets all your specs.
- 🌐 **9 languages.** English (default), हिन्दी, मराठी, ગુજરાતી, বাংলা, தமிழ், తెలుగు, ಕನ್ನಡ, ਪੰਜਾਬੀ.
- 🌙 **Light & dark mode**, following your system setting.
- 💾 **Picks up where you left off.** Your last description, filters, language and view settings are remembered, and the latest results survive closing and reopening the panel.
- 🔒 **Private by design.** Nothing leaves your browser, and Khoj can only read the five store sites. See [PRIVACY.md](PRIVACY.md).

## Screenshots

| Results, 4★ & up | Your words, checked on every result | Phone filters |
|:---:|:---:|:---:|
| <img src="docs/screenshots/results.png" width="260" alt="Results sorted by price with spec badges; 2 items rated below 4 stars are hidden"> | <img src="docs/screenshots/description-match.png" width="260" alt="Description 'expandable up to 1TB, dual sim, rating 4+' understood as filters, with a badge for each on every result"> | <img src="docs/screenshots/mobile-filters.png" width="260" alt="Mobile phone filters including Expandable storage (microSD) and Customer rating"> |
| **Category type-ahead** | **Category-specific filters** | **Dark mode** |
| <img src="docs/screenshots/category-search.png" width="260" alt="Typing 'wa' suggests Washing machines and more"> | <img src="docs/screenshots/category-filters.png" width="260" alt="Refrigerator filters: capacity, door type, energy rating, inverter, customer rating"> | <img src="docs/screenshots/results-dark.png" width="260" alt="Results in dark mode"> |
| **हिन्दी UI** | | |
| <img src="docs/screenshots/hindi.png" width="260" alt="Hindi interface with refrigerator filters"> | | |

<sub>Screenshots show sample results. The prices and ratings in them are for illustration only.</sub>

## Install

### Option A: From a release (easiest)

1. Download `khoj-extension-vX.Y.Z.zip` from the [**latest release**](https://github.com/nidhishankermodi/khoj-extension/releases/latest) and unzip it.
2. Open `chrome://extensions` (Edge: `edge://extensions`, Brave: `brave://extensions`).
3. Turn on **Developer mode** (top-right).
4. Click **Load unpacked** and select the unzipped folder (the one containing `manifest.json`).
5. Pin Khoj from the 🧩 puzzle menu. Clicking the icon opens it in the side panel.

### Option B: From source

```bash
git clone https://github.com/nidhishankermodi/khoj-extension.git
```

Then follow steps 2–5 above and select the **`extension/`** folder.

> Works in Chrome 116+ and other Chromium browsers that support the Side Panel API (Edge, Brave, Opera, Arc). Firefox and Safari are not supported yet.

### Updating to a new version

Unpacked extensions don't update by themselves. Your saved settings are kept as long as you update the folder in place rather than removing the extension.

- **Installed from a release:** download the new zip, unzip it over your old Khoj folder (replacing the files), then click 🔄 **Reload** on Khoj's card in `chrome://extensions`.
- **Installed from source:** run `git pull` in your clone, then click 🔄 **Reload**.

Check the version on Khoj's card in `chrome://extensions`. [CHANGELOG.md](CHANGELOG.md) lists what changed in each version.

## How to use

1. **Pick a category.** Type a few letters, or just skip it and Khoj will detect it from your description.
2. **Describe what you want.** Some examples:
   - `oneplus nord under 30000`
   - `samsung phone, expandable up to 1 TB, dual sim, rating 4+`
   - `mujhe 8/256 wala phone chahiye 15k-25k, amoled 120hz`
   - `dell laptop i5 16gb ram 512gb ssd under 70000`
   - `LG double door fridge 300 litres 3 star inverter`
   - `bosch cordless drill 18v`
   - `pampers pants xl 50 pcs`
   - `मुझे 43 इंच का टीवी चाहिए 25000 तक`
3. **Optionally fine-tune the filters.** Anything you set here overrides what was understood from the text.
4. Press **Search** (or <kbd>Ctrl</kbd>/<kbd>⌘</kbd>+<kbd>Enter</kbd>). Results stream in store by store.
5. **Sort, filter, click.** Each card opens the product page on the store's own site. <kbd>Ctrl</kbd>/<kbd>⌘</kbd>-click opens it in a background tab.

## How it works

```mermaid
flowchart LR
    A[Your description] --> B[parser.js<br/>brand · budget · specs]
    B --> C[Search query]
    C --> D[background.js<br/>opens each store's search page<br/>in a minimised window]
    D --> E[extractor.js<br/>reads title · price · MRP<br/>rating · stock from the page]
    E --> F[panel.js<br/>filter · match specs · sort]
    F --> G[One sorted list]
```

- Khoj opens each store's normal **public search page** in a minimised background window, exactly as if you had typed the search yourself. Once the page has loaded, it reads the product cards, then closes the tab.
- The extractor doesn't rely on CSS class names, which change often. Instead it finds **product links**, climbs to the card that contains exactly one product, and reads the `₹` prices, the struck-through MRP, the rating and stock status. Amazon also has a fast path that uses its stable `data-asin` attributes.
- Spec matching reads each result's title and the short spec line on its card. When neither mentions a spec, the badge shows `?` (for example, when a fridge's title doesn't mention its star rating).

## Known limitations

- **Stores change their HTML.** When one does, that store may return "Nothing found" until the extractor is updated. Please [open an issue](https://github.com/nidhishankermodi/khoj-extension/issues/new?template=site-broken.yml) with the store and your search.
- **Captchas.** If a store shows a robot check, Khoj tells you and gives you a link to open the page and verify. Then search again.
- **Search-page matching.** Specs that aren't in the product title or card can't be verified from the search page (shown as `?`).
- **Unrated items and the rating filter.** Items without a rating are hidden while a rating filter is on, and the result count says how many. Some stores don't show ratings on their search pages at all.
- **Prices are a snapshot.** They're read at the moment you search. Always confirm on the store before buying, including bank offers and delivery charges, which Khoj doesn't include.
- **First-page results only**, up to 40 per store.

## Project structure

```
khoj-extension/
├── extension/            ← load this folder in Chrome
│   ├── manifest.json     Manifest V3 config
│   ├── background.js     Runs a search: opens tabs, injects the extractor, collects results
│   ├── extractor.js      Injected into each store page; reads the product cards
│   ├── sites.js          Store list: search URL + product-link pattern
│   ├── categories.js     55 categories: filters, brands, synonyms, which stores sell them
│   ├── parser.js         Understands your description; matches specs; builds the query
│   ├── i18n.js           UI text in 9 languages
│   ├── panel.html/css/js Side-panel UI
│   └── icons/
├── tests/                Unit tests for the parser & category catalog (node --test)
├── scripts/
│   ├── zip.mjs           Packs extension/ into dist/khoj-extension-v<version>.zip
│   └── release-notes.mjs Builds the GitHub Release text from CHANGELOG.md
├── docs/screenshots/
├── .github/              CI, release automation, issue templates
├── CHANGELOG.md
├── CONTRIBUTING.md
└── PRIVACY.md
```

No build step and no dependencies. It's plain JavaScript (ES modules).

## Development

You need Node.js 20 or newer to run the tests. There's nothing to `npm install`.

```bash
npm test          # unit tests for the parser and category catalog
npm run zip       # builds dist/khoj-extension-v<version>.zip (uses the system zip tool)
```

After editing files in `extension/`, click the 🔄 reload icon on `chrome://extensions` to pick up the changes.

### Releasing

1. Set the same new `version` in `extension/manifest.json` and `package.json`. The tests fail if they differ.
2. In [CHANGELOG.md](CHANGELOG.md), rename **Unreleased** to `## [X.Y.Z] - YYYY-MM-DD` and update the links at the bottom.
3. Merge to `main`, then tag that commit and push the tag:

   ```bash
   git checkout main && git pull
   git tag -a vX.Y.Z -m "Khoj vX.Y.Z"
   git push origin vX.Y.Z
   ```

The release workflow then checks that the tag matches the manifest, runs the tests and builds the zip. It publishes a GitHub Release with the zip attached, using that version's CHANGELOG section as the release notes. To preview the notes locally:

```bash
node scripts/release-notes.mjs X.Y.Z
```

## Contributing

Contributions are very welcome, especially **fixes when a store changes its layout**, **new categories**, and **translation reviews** by native speakers. See [CONTRIBUTING.md](CONTRIBUTING.md) for:

- adding a new store
- adding a category or filter
- adding or improving a language
- running the tests

## Roadmap

- [ ] More stores (Vijay Sales, Tata CLiQ, Myntra, Nykaa, BigBasket)
- [ ] Price history & price-drop alerts
- [ ] Merge the same product across stores into one row
- [ ] Firefox support
- [ ] Chrome Web Store listing

## Disclaimer

Khoj is an independent, open-source project. It is **not affiliated with, endorsed by, or sponsored by** Amazon, Flipkart, JioMart, Reliance Retail, Croma (Infiniti Retail) or any other store. All product names, logos and trademarks belong to their respective owners.

Khoj only reads publicly visible search-result pages, in the user's own browser, at the user's request, at the same pace a person would browse. It does not bypass logins, paywalls or captchas, and it does not collect or resell data. Please use it for personal shopping and respect each store's terms of use.

## License

[MIT](LICENSE) © 2026 Nidhi Shanker Modi
