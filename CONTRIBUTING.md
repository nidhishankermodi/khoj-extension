# Contributing to Khoj

Thanks for helping! This guide covers the most common kinds of contribution. There's no build step: edit the files in `extension/`, then click the 🔄 reload icon on `chrome://extensions`.

## Setup

```bash
git clone https://github.com/nidhishankermodi/khoj.git
cd khoj
npm test          # runs the unit tests (Node 20+; no npm install needed)
```

Load `extension/` with **Load unpacked** (see the README). To debug:

- **Panel UI:** right-click inside the side panel → *Inspect*.
- **Background / search flow:** on `chrome://extensions`, click *service worker* under Khoj.
- **Extractor:** open a store's search page yourself, open DevTools, and paste the body of `extractProducts` from `extractor.js` into the console to see what it returns.

## 🔧 A store stopped returning results

This is the most valuable fix. Stores change their markup regularly.

1. Open the store's search page and check that the URL in `extension/sites.js` (`searchUrl`) still works.
2. Check that product links still match `linkPattern` (a regex tested against each `<a href>`). For example, Flipkart product URLs contain `/p/itm`.
3. If links match but prices or titles are wrong, look at `pricesFrom` / `titleFrom` in `extension/extractor.js`. Prefer **structural** signals (links, `₹` text, strike-through, `aria-label`) over class names, which change often.
4. In your PR, include the search term you tested and a screenshot of the results.

## 🛒 Adding a store

1. Add an entry to `SITES` in `extension/sites.js`:
   ```js
   { id: 'vijaysales', name: 'Vijay Sales', color: '#1F5BA8',
     searchUrl: (q) => `https://www.vijaysales.com/search/${encodeURIComponent(q)}`,
     linkPattern: 'vijaysales\\.com/p/' }
   ```
2. Add the domain to `host_permissions` in `extension/manifest.json`.
3. In `extension/categories.js`, add the store's `id` to the `sites` list of the categories it sells. `ALL` and `GEN` at the top are shared lists.
4. Update the store list in `README.md`, `README.hi.md` and `PRIVACY.md`.

## 🗂️ Adding a category or filter

Everything lives in `extension/categories.js`. A category looks like this:

```js
C('fridges', 'appliances', ['Refrigerators', 'फ्रिज', /* mr, gu, bn, ta, te, kn, pa */], {
  q: 'refrigerator',                       // added to the search if the user didn't name the product
  syn: ['fridge', 'refrigerator', 'फ्रिज'], // words that auto-detect this category
  brands: BR.fridges,
  fields: [
    LITRES([180, 240, 300, 400]),         // "at least" number, read from titles
    sel('door', 'fDoor', [['Single door', 'single\\s*door', 'single door'], /* … */]),
    STARS([2, 3, 4, 5]),
    INVERTER                               // checkbox
  ],
  exclude: 'cover|stand|stabili[sz]er',    // hidden by "Hide covers/accessories"
  minPrice: 6000                           // cheaper results are treated as accessories
})
```

Field types:

| Builder | Meaning | Example |
|---|---|---|
| `min(id, labelKey, extractor, values, fmt)` | "At least X". `extractor` is a key of `EXTRACT` in `parser.js` | RAM 8 GB+, 300 L+ |
| `range(id, labelKey, extractor, [[label, lo, hi, searchTerm]])` | A band | TV 55" |
| `sel(id, labelKey, [[label, regex, searchTerm, labelKey?]])` | One of several options; `regex` is tested on titles | Door type |
| `bool(id, labelKey, regex, searchTerm, chip)` | Checkbox | Inverter, ANC |

Label keys must be registered with translations for all 9 languages (`L('fDoor', [...])` near the top of the file). `npm test` fails if any are missing.

Please add a test in `tests/` with a couple of example descriptions for your category.

## 🌐 Languages

UI strings are in `extension/i18n.js`, and category and filter labels are in `extension/categories.js`. Arrays are always in the order **en, hi, mr, gu, bn, ta, te, kn, pa**.

- **Improving a translation:** native-speaker reviews are especially welcome, since several translations haven't been reviewed by native speakers yet.
- **Adding a language:** add it to `LANGS`, then add a block in `STRINGS` and an extra item to each `register(...)` / `L(...)` array. Missing keys fall back to English.

## Pull request checklist

- [ ] `npm test` passes
- [ ] Tested by loading the extension and running at least one real search
- [ ] No new permissions, or the reason is explained in the PR and added to `PRIVACY.md`
- [ ] User-visible text goes through `t()`, with translations or an English fallback
- [ ] `CHANGELOG.md` updated under **Unreleased**

## Code style

Plain modern JavaScript (ES modules), no frameworks, no dependencies, 2-space indent. Some code comments are in Hindi, and comments in English or Hindi are both fine.

## Code of conduct

Be kind and constructive. Harassment of any kind isn't tolerated.
