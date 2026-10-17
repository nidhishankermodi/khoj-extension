# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [1.1.0] - 2026-10-17

### Added
- **Customer rating** filter (3★, 3.5★, 4★, 4.5★ and up) next to the budget. It applies to the current results straight away, and the result count says how many items it hid. It is also read from the description, such as `4 star and above`, `rating 4.5+` or `highly rated`. In fridges, ACs and washing machines, a plain "3 star" still means the energy rating.
- **Expandable storage (microSD)** filter for mobiles and tablets, read from descriptions like `expandable up to 1 TB` or `memory card slot`.
- Words from the description that aren't a filter, such as `dual sim`, `headphone jack` or a model name, are shown under **Understood** and get their own `✓` / `?` badge on each result.

### Fixed
- "upto 1 TB" in a description was thrown away, because it was tried as a ₹1 budget. Specs like "under 512 GB" are no longer read as a budget either.
- "Expandable up to 1 TB" was read as 1 TB of internal storage, both in the description and in product titles.
- Recognised features such as `wireless charging` and `ip68` were left out of the store search.
- "4.5 star" was read as a 5-star energy rating.

### Changed
- Each GitHub Release now uses its version's section of CHANGELOG.md as the release notes, with install and update steps.
- The README has new screenshots, the release download steps again, and steps for updating an existing install.

## [1.0.0] - 2026-10-17

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

[Unreleased]: https://github.com/nidhishankermodi/khoj-extension/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/nidhishankermodi/khoj-extension/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/nidhishankermodi/khoj-extension/releases/tag/v1.0.0
