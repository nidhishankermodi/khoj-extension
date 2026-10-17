# Privacy Policy

_Last updated: October 2026_

Khoj is built to work entirely inside your browser.

## What Khoj does not do

- It does **not** collect, transmit, sell or share any personal data.
- It has **no server**, no analytics, no ads and no tracking.
- It does **not** read your browsing history, cookies, passwords, or any page other than the store search pages it opens for you.

## What stays on your device

Khoj uses Chrome's built-in extension storage to remember:

| Data | Where | Why |
|---|---|---|
| Your last description, category and filters | `chrome.storage.local` | So the form is filled in next time |
| Your language and view preferences (sort order, toggles) | `chrome.storage.local` | So your choices persist |
| Results of your latest search, and any customer-rating filter you changed after it | `chrome.storage.session` | So results survive closing and reopening the panel. Cleared when the browser closes |

This data never leaves your computer. Removing the extension deletes it.

## Network requests

When you press **Search**, Khoj opens the public search pages of the stores you selected (amazon.in, flipkart.com, jiomart.com, croma.com, reliancedigital.in). It does this in your browser, just as if you had visited them yourself. Those sites see a normal visit from your browser and handle it under their own privacy policies. Product images in the results load directly from the stores' image servers.

## Permissions and why they're needed

| Permission | Used for |
|---|---|
| `sidePanel` | Showing Khoj in Chrome's side panel |
| `tabs` | Opening the store search pages in a background window and closing them afterwards; opening a product when you click it |
| `scripting` | Reading the product list from those search pages |
| `storage` | Remembering your settings and last search (see above) |
| Host access to the 5 stores | Only these sites can be read. Khoj cannot access any other website |

## Contact

Questions or concerns? Open an issue at https://github.com/nidhishankermodi/khoj-extension/issues.
