import { SITES } from './sites.js';
import { extractProducts } from './extractor.js';

// Toolbar icon पर click → side panel खुले
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});

// एक समय में एक ही खोज चलती है। उसकी पूरी state storage.session में रहती है,
// panel उसे वहीं से पढ़ता है — panel बंद करके दोबारा खोलने पर भी नतीजे बचे रहते हैं।
let run = null;

const save = () => run && chrome.storage.session.set({ lastRun: run.state });

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === 'search') {
    startRun(msg).catch((e) => console.error('[Khoj]', e));
    sendResponse({ ok: true });
  } else if (msg?.type === 'cancel') {
    cancelRun('errCancelled').then(() => sendResponse({ ok: true }));
    return true;
  }
});

chrome.windows.onRemoved.addListener((windowId) => {
  if (run && run.windowId === windowId && !run.state.done) {
    finishPending('errWindowClosed');
  }
});

async function startRun({ runId, query, criteria, siteIds }) {
  if (run && !run.state.done) await cancelRun('errNewSearch');

  const sites = SITES.filter((s) => siteIds.includes(s.id));
  const urls = sites.map((s) => s.searchUrl(query));

  run = {
    windowId: null,
    state: {
      runId, query, criteria,
      startedAt: Date.now(),
      done: false,
      items: [],
      sites: Object.fromEntries(sites.map((s, i) => [s.id, { status: 'loading', count: 0, url: urls[i] }]))
    }
  };
  const myRun = run;
  await save();

  // सारी साइट्स एक minimized window में, ताकि आपका काम disturb न हो
  let win;
  try {
    win = await chrome.windows.create({ url: urls, state: 'minimized' });
  } catch {
    win = await chrome.windows.create({ url: urls, focused: false });
  }
  myRun.windowId = win.id;

  await Promise.all(sites.map((site, i) => scrapeSite(myRun, site, win.tabs[i].id)));

  if (run !== myRun) return;
  myRun.state.done = true;
  myRun.state.finishedAt = Date.now();
  await save();
  chrome.windows.remove(win.id).catch(() => {});
}

async function scrapeSite(myRun, site, tabId) {
  const entry = myRun.state.sites[site.id];
  try {
    await waitForLoad(tabId, 25000);
    let res;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        [{ result: res }] = await chrome.scripting.executeScript({
          target: { tabId },
          func: extractProducts,
          args: [site.linkPattern, site.id, 40]
        });
        break;
      } catch (e) {
        if (attempt === 1) throw e;
        await new Promise((r) => setTimeout(r, 2500)); // पेज redirect हो रहा हो तो
      }
    }
    if (run !== myRun) return;

    const items = (res?.items || []).map((it, i) => ({ ...it, id: `${site.id}-${i}`, site: site.id }));
    myRun.state.items.push(...items);
    entry.count = items.length;
    entry.status = items.length ? 'ok' : res?.blocked ? 'blocked' : 'empty';
  } catch (e) {
    if (run !== myRun) return;
    entry.status = 'error';
    entry.error = String(e?.message || e).slice(0, 160);
  } finally {
    chrome.tabs.remove(tabId).catch(() => {});
  }
  await save();
}

function waitForLoad(tabId, timeout) {
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      chrome.tabs.onUpdated.removeListener(listener);
      clearTimeout(timer);
      resolve();
    };
    const listener = (id, info) => { if (id === tabId && info.status === 'complete') finish(); };
    chrome.tabs.onUpdated.addListener(listener);
    const timer = setTimeout(finish, timeout); // timeout पर भी जो render हुआ है वो पढ़ लेंगे
    chrome.tabs.get(tabId).then((t) => {
      if (t.status === 'complete' && t.url && /^https:/.test(t.url)) finish();
    }).catch(finish);
  });
}

function finishPending(errorCode) { // errorCode = i18n key, panel अपनी भाषा में दिखाता है
  for (const s of Object.values(run.state.sites)) {
    if (s.status === 'loading') { s.status = 'error'; s.errorCode = errorCode; }
  }
  run.state.done = true;
  run.state.finishedAt = Date.now();
  save();
}

async function cancelRun(errorCode) {
  if (!run || run.state.done) return;
  const wid = run.windowId;
  finishPending(errorCode);
  run = { ...run, windowId: null }; // पुराने scrapers के नतीजे अब ignore होंगे
  if (wid != null) await chrome.windows.remove(wid).catch(() => {});
}
