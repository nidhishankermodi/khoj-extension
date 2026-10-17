# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow [Semantic Versioning](https://semver.org/).

### Fixed
- The Tests workflow now runs on pushes to `master`. It was set to `main`, which this repo doesn't use.

### Removed
- `scripts/set-owner.mjs`, the one-time script that filled in the owner placeholders.

### Added
- First release: plain-language search across Amazon, Flipkart, JioMart, Croma and Reliance Digital, with price sorting, spec matching and a side-panel UI.
- 55 categories in 14 groups, each with its own filters (138 in total).
- Category box with type-ahead suggestions (`mob` → Mobile phones) in all 9 languages.
- Automatic category detection from the description.
- Stores that don't sell the chosen category are unchecked automatically.
- Out-of-stock detection, with a **Show out-of-stock items** toggle and badge.
- Budget, size and quantity parsing now understands more units and languages (`लीटर`, `इंच`, `किलो`, `पर्यंत`, `வரை` …).
- Accessory filtering is now defined per category.
- Interface in 9 languages: English (default), Hindi, Marathi, Gujarati, Bengali, Tamil, Telugu, Kannada, Punjabi.

