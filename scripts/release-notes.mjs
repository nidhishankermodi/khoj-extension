// Builds the GitHub Release text for one version from CHANGELOG.md, plus install/update steps.
// Usage:  node scripts/release-notes.mjs [version] [outFile]
//   version defaults to extension/manifest.json; without outFile the text is printed.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const manifest = JSON.parse(readFileSync('extension/manifest.json', 'utf8'));
const version = (process.argv[2] || manifest.version).replace(/^v/, '');
const outFile = process.argv[3];
const repo = process.env.GITHUB_REPOSITORY || 'nidhishankermodi/khoj-extension';

const changelog = readFileSync('CHANGELOG.md', 'utf8');
const start = changelog.search(new RegExp(`^## \\[${version.replace(/\./g, '\\.')}\\]`, 'm'));
if (start < 0) {
  console.error(`CHANGELOG.md has no "## [${version}]" section. Rename "Unreleased" to it before tagging.`);
  process.exit(1);
}
const rest = changelog.slice(start);
const next = rest.slice(1).search(/^## \[|^\[[^\]]+\]:/m);
const section = (next < 0 ? rest : rest.slice(0, next + 1)).split('\n').slice(1).join('\n').trim();
if (!section) {
  console.error(`The "## [${version}]" section in CHANGELOG.md is empty.`);
  process.exit(1);
}

const zip = `khoj-extension-v${version}.zip`;
const notes = `## What's new in Khoj v${version}

${section}

## Install

1. Download **\`${zip}\`** from **Assets** below and unzip it.
2. Open \`chrome://extensions\` (Edge: \`edge://extensions\`, Brave: \`brave://extensions\`) and turn on **Developer mode**.
3. Click **Load unpacked** and select the unzipped folder (the one containing \`manifest.json\`).
4. Pin Khoj from the 🧩 puzzle menu. Clicking the icon opens it in the side panel.

## Update from an earlier version

Unzip **\`${zip}\`** over your existing Khoj folder, replacing the files. Then click 🔄 **Reload** on Khoj's card in \`chrome://extensions\`. Your saved settings are kept. If you installed from source, run \`git pull\` and reload instead.

Requires Chrome 116+ or another Chromium browser with the Side Panel API (Edge, Brave, Opera, Arc).

[README](https://github.com/${repo}/blob/v${version}/README.md) · [Full changelog](https://github.com/${repo}/blob/v${version}/CHANGELOG.md) · [Privacy](https://github.com/${repo}/blob/v${version}/PRIVACY.md) · [Report a broken store](https://github.com/${repo}/issues/new?template=site-broken.yml)
`;

if (outFile) {
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, notes);
  console.log(`Wrote ${outFile}`);
} else {
  process.stdout.write(notes);
}
