import { SITES, siteById } from './sites.js';
import { parseDescription, mergeCriteria, buildQuery, matchSpecs, brandMatches, isAccessory, hasAccessoryRule, valueLabel, formatINR } from './parser.js';
import { catById, groupById, detectCategory, searchCategories, optLabel } from './categories.js';
import { LANGS, DEFAULT_LANG, t, setLang, getLang, applyStatic } from './i18n.js';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const VIEW_FIELDS = ['sort', 'onlyMatch', 'hideAcc', 'hideAds', 'showOOS'];
const RATING_STEPS = [3, 3.5, 4, 4.5];
let lastRun = null;
let hiddenSites = new Set();
let flashKey = null;
let ratingOverride = null; // { runId, value } — खोज के बाद rating बदली हो तो नतीजे दोबारा खोजे बिना छँटें
const state = { catId: 'all', catManual: false, catAuto: false };

// ---------- setup ----------
$('siteChips').innerHTML = SITES.map((s) => `
  <label class="chip" style="--c:${s.color}" data-site="${s.id}">
    <input type="checkbox" name="site" value="${s.id}" checked><span class="dot"></span>${esc(s.name)}
  </label>`).join('');

function renderRatingOptions() {
  const sel = $('minRating');
  const keep = sel.value;
  sel.innerHTML = `<option value="">${esc(t('any'))}</option>` +
    RATING_STEPS.map((r) => `<option value="${r}">${esc(t('ratingUp', { r }))}</option>`).join('');
  sel.value = keep;
}
renderRatingOptions();

$('lang').innerHTML = LANGS.map((l) => `<option value="${l.id}">${esc(l.name)}</option>`).join('');
function useLang(id) {
  const keep = readFieldValues();
  setLang(id || DEFAULT_LANG);
  $('lang').value = getLang();
  applyStatic();
  renderRatingOptions();
  $('catInput').value = t(catById(state.catId).name);
  renderFields(keep);
  markSites();
  showCatNote();
  if (flashKey) flash(flashKey);
  render();
}
$('lang').addEventListener('change', () => {
  chrome.storage.local.set({ lang: $('lang').value });
  useLang($('lang').value);
});

$('openTab').addEventListener('click', () => chrome.tabs.create({ url: chrome.runtime.getURL('panel.html') }));
$('openTab').hidden = window.innerWidth > 600; // पहले से बड़े टैब में हों तो बटन की ज़रूरत नहीं

const val = (id) => { const el = $(id); return el.type === 'checkbox' ? el.checked : el.value; };
const setVal = (id, v) => { const el = $(id); if (!el) return; if (el.type === 'checkbox') el.checked = !!v; else el.value = v ?? ''; };

// ---------- category combobox ----------
let listItems = [];
let active = 0;

function openList(query) {
  listItems = searchCategories(query);
  active = 0;
  const ul = $('catList');
  ul.innerHTML = listItems.length
    ? listItems.map((c, i) => `
      <li role="option" id="opt-${c.id}" data-id="${c.id}" class="${i === 0 ? 'active' : ''} ${c.id === state.catId ? 'current' : ''}" aria-selected="${i === 0}">
        <span class="cname">${esc(t(c.name))}</span><span class="cgroup">${esc(t(groupById(c.group).name))}</span>
      </li>`).join('')
    : `<li class="none">${esc(t('catNoMatch'))}</li>`;
  ul.hidden = false;
  $('catInput').setAttribute('aria-expanded', 'true');
}
function closeList() {
  $('catList').hidden = true;
  $('catInput').setAttribute('aria-expanded', 'false');
}
function moveActive(d) {
  if (!listItems.length) return;
  const lis = $('catList').querySelectorAll('li[data-id]');
  lis[active]?.classList.remove('active');
  active = (active + d + listItems.length) % listItems.length;
  lis[active].classList.add('active');
  lis[active].scrollIntoView({ block: 'nearest' });
  $('catInput').setAttribute('aria-activedescendant', lis[active].id);
}

// click करते ही पुराना नाम select हो जाए, ताकि टाइप करने पर replace हो (mouseup selection न हटाए, इसलिए अगले frame में)
const selectAllSoon = () => {
  const before = $('catInput').value;
  $('catInput').select();
  requestAnimationFrame(() => { if ($('catInput').value === before) $('catInput').select(); }); // इस बीच टाइप हुआ हो तो छेड़ें नहीं
};
let justFocused = false;
$('catInput').addEventListener('focus', () => { justFocused = true; selectAllSoon(); openList(''); });
$('catInput').addEventListener('mouseup', (e) => { if (justFocused) { e.preventDefault(); selectAllSoon(); } justFocused = false; });
$('catInput').addEventListener('input', () => openList($('catInput').value));
$('catInput').addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') { e.preventDefault(); if ($('catList').hidden) openList($('catInput').value); else moveActive(1); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); moveActive(-1); }
  else if (e.key === 'Enter') { e.preventDefault(); if (listItems[active]) pickCategory(listItems[active].id); }
  else if (e.key === 'Escape') { closeList(); $('catInput').value = t(catById(state.catId).name); }
});
$('catInput').addEventListener('blur', () => setTimeout(() => {
  closeList();
  const typed = $('catInput').value.trim();
  if (!typed) pickCategory('all');
  else if (typed !== t(catById(state.catId).name)) {
    const first = searchCategories(typed)[0];
    if (first) pickCategory(first.id, { silentFocus: true }); else $('catInput').value = t(catById(state.catId).name);
  }
}, 150));
$('catList').addEventListener('mousedown', (e) => {
  const li = e.target.closest('li[data-id]');
  if (li) { e.preventDefault(); pickCategory(li.dataset.id); }
});

function pickCategory(id, opts = {}) {
  setCategory(id, { manual: true });
  closeList();
  if (!opts.silentFocus) $('desc').focus();
}

/** category बदलें → filters दोबारा बनें, सही साइट्स चुनी जाएँ */
function setCategory(id, { manual = false, auto = false, keepSites = false, values = null } = {}) {
  const changed = id !== state.catId;
  state.catId = catById(id).id;
  state.catManual = manual || (state.catManual && !auto);
  state.catAuto = auto;
  $('catInput').value = t(catById(state.catId).name);
  if (changed || values) renderFields(values || {});
  if (changed && !keepSites) {
    const cat = catById(state.catId);
    document.querySelectorAll('input[name=site]').forEach((c) => (c.checked = cat.sites.includes(c.value)));
  }
  markSites();
  showCatNote();
}

function markSites() {
  const cat = catById(state.catId);
  document.querySelectorAll('#siteChips .chip').forEach((chip) => {
    const ok = cat.sites.includes(chip.dataset.site);
    chip.classList.toggle('irrelevant', !ok);
    chip.title = ok ? '' : t('siteIrrelevant');
  });
}

function showCatNote() {
  const n = $('catNote');
  n.hidden = !state.catAuto;
  n.textContent = state.catAuto ? `✨ ${t('catAuto')}` : '';
}

// description लिखते समय category अपने-आप पहचानें (जब तक user ने ख़ुद न चुनी हो)
let detectTimer = null;
$('desc').addEventListener('input', () => {
  clearTimeout(detectTimer);
  detectTimer = setTimeout(autoDetect, 450);
});
function autoDetect() {
  if (state.catManual) return;
  const id = detectCategory($('desc').value);
  if (id && id !== state.catId) setCategory(id, { auto: true });
}

// ---------- dynamic filters ----------
function renderFields(values = {}) {
  const cat = catById(state.catId);
  const grid = [];
  const checks = [];

  if (cat.brands.length) {
    grid.push(`<label class="field"><span>${esc(t('brand'))}</span><select data-brand>
      <option value="">${esc(t('any'))}</option>
      ${cat.brands.map((b) => `<option value="${b.id}" ${values.brand === b.id ? 'selected' : ''}>${esc(b.name)}</option>`).join('')}
    </select></label>`);
  } else {
    grid.push(`<label class="field"><span>${esc(t('brand'))}</span><input type="text" data-brandtext placeholder="${esc(t('brandAnyText'))}" value="${esc(values.brandText || '')}"></label>`);
  }

  for (const f of cat.fields) {
    const v = values.fields?.[f.id];
    if (f.type === 'bool') {
      checks.push(`<label class="check"><input type="checkbox" data-field="${f.id}" ${v ? 'checked' : ''}> <span>${esc(t(f.label))}</span></label>`);
      continue;
    }
    const opts = f.type === 'min'
      ? f.values.map((x) => `<option value="${x}" ${String(v) === String(x) ? 'selected' : ''}>${esc(f.fmt(x))}</option>`)
      : f.options.map((o) => `<option value="${esc(o.v)}" ${v === o.v ? 'selected' : ''}>${esc(optLabel(o))}</option>`);
    grid.push(`<label class="field"><span>${esc(t(f.label))}</span><select data-field="${f.id}" data-num="${f.type === 'min' ? 1 : ''}">
      <option value="">${esc(t('any'))}</option>${opts.join('')}</select></label>`);
  }
  $('dynFields').innerHTML = grid.join('');
  $('dynChecks').innerHTML = checks.join('');
  $('dynChecks').hidden = !checks.length;
}

function readFieldValues() {
  const fields = {};
  document.querySelectorAll('[data-field]').forEach((el) => {
    if (el.type === 'checkbox') { if (el.checked) fields[el.dataset.field] = true; }
    else if (el.value !== '') fields[el.dataset.field] = el.dataset.num ? +el.value : el.value;
  });
  return {
    brand: document.querySelector('[data-brand]')?.value || '',
    brandText: document.querySelector('[data-brandtext]')?.value || '',
    fields
  };
}

function readForm() {
  const f = readFieldValues();
  return {
    desc: $('desc').value, category: state.catId, catManual: state.catManual,
    brand: f.brand, brandText: f.brandText, fields: f.fields,
    minPrice: $('minPrice').value, maxPrice: $('maxPrice').value, minRating: $('minRating').value
  };
}

// ---------- restore ----------
async function restore() {
  const { form, view, sites, lang } = await chrome.storage.local.get(['form', 'view', 'sites', 'lang']);
  setLang(lang || DEFAULT_LANG);
  if (form && form.fields) { // v1.2 format
    $('desc').value = form.desc || '';
    setVal('minPrice', form.minPrice); setVal('maxPrice', form.maxPrice); setVal('minRating', form.minRating);
    setCategory(form.category || 'all', { manual: !!form.catManual, keepSites: true, values: form });
  } else {
    if (form?.desc) $('desc').value = form.desc;
    renderFields();
  }
  if (view) VIEW_FIELDS.forEach((f) => f in view && setVal(f, view[f]));
  if (sites) document.querySelectorAll('input[name=site]').forEach((c) => (c.checked = sites.includes(c.value)));
  useLang(getLang());
  const { lastRun: lr, ratingOverride: ro } = await chrome.storage.session.get(['lastRun', 'ratingOverride']);
  if (lr) {
    lastRun = lr;
    if (ro?.runId === lr.runId) { ratingOverride = ro; setVal('minRating', ro.value ?? ''); }
    render();
  }
}
restore();

// ---------- search ----------
$('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!state.catManual) autoDetect();
  const form = readForm();
  const siteIds = [...document.querySelectorAll('input[name=site]:checked')].map((c) => c.value);
  if (!siteIds.length) return flash('errPickSite');
  if (!form.desc.trim() && !form.brand && !form.brandText && !Object.keys(form.fields).length && form.category === 'all') return flash('errWriteSomething');

  const criteria = mergeCriteria(parseDescription(form.desc, form.category), form);
  const query = buildQuery(criteria);
  if (!query) return flash('errMoreDetail');

  chrome.storage.local.set({ form, sites: siteIds });
  hiddenSites = new Set();
  flashKey = null;
  ratingOverride = null;
  await chrome.runtime.sendMessage({ type: 'search', runId: crypto.randomUUID(), query, criteria, siteIds });
});

$('stop').addEventListener('click', () => chrome.runtime.sendMessage({ type: 'cancel' }));
$('desc').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) $('form').requestSubmit();
});

VIEW_FIELDS.forEach((f) => $(f).addEventListener('change', () => {
  chrome.storage.local.set({ view: Object.fromEntries(VIEW_FIELDS.map((x) => [x, val(x)])) });
  render();
}));

// rating filter नतीजों पर तुरंत लगे — दोबारा खोजने की ज़रूरत नहीं
$('minRating').addEventListener('change', () => {
  if (!lastRun) return;
  ratingOverride = { runId: lastRun.runId, value: $('minRating').value ? +$('minRating').value : null };
  chrome.storage.session.set({ ratingOverride }); // panel और tab दोनों में एक जैसा रहे
  render();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'session' && changes.lastRun) { lastRun = changes.lastRun.newValue; render(); }
  if (area === 'session' && changes.ratingOverride) {
    const ro = changes.ratingOverride.newValue;
    if (ro && lastRun && ro.runId === lastRun.runId && ro.value !== ratingOverride?.value) {
      ratingOverride = ro;
      setVal('minRating', ro.value ?? '');
      render();
    }
  }
  if (area === 'local' && changes.lang && changes.lang.newValue !== getLang()) useLang(changes.lang.newValue); // panel और tab साथ में बदलें
});

function flash(key) {
  flashKey = key;
  const u = $('understood');
  u.hidden = false;
  u.innerHTML = `<b style="color:var(--bad)">${esc(t(key))}</b>`;
}

// ---------- render ----------
function render() {
  if (!lastRun || flashKey) return;
  const { query, sites, items, done } = lastRun;
  const c = { values: {}, features: [], keywords: [], extras: [], category: 'all', ...lastRun.criteria };
  const cat = catById(c.category);
  const minRating = ratingOverride && ratingOverride.runId === lastRun.runId ? ratingOverride.value : c.minRating;

  $('go').disabled = !done;
  $('go').textContent = done ? t('search') : t('searching');
  $('stop').hidden = done;

  // जो समझा गया
  const tags = [];
  if (cat.id !== 'all') tags.push(t(cat.name));
  const brand = cat.brands.find((b) => b.id === c.brand);
  if (brand) tags.push(brand.name); else if (c.brandText) tags.push(c.brandText);
  for (const f of cat.fields) { const v = c.values[f.id]; if (v != null && v !== '' && v !== false) tags.push(valueLabel(f, v)); }
  c.features.forEach((f) => tags.push(f.toUpperCase()));
  c.extras.forEach((x) => tags.push(`“${x}”`));
  if (minRating) tags.push(t('ratingUp', { r: minRating }));
  if (c.minPrice && c.maxPrice) tags.push(`${formatINR(c.minPrice)} – ${formatINR(c.maxPrice)}`);
  else if (c.maxPrice) tags.push(t('priceUpTo', { p: formatINR(c.maxPrice) }));
  else if (c.minPrice) tags.push(t('priceAbove', { p: formatINR(c.minPrice) }));
  $('understood').hidden = false;
  $('understood').innerHTML = `<span>${esc(t('understood'))}</span> ${tags.map((x) => `<span class="tag">${esc(x)}</span>`).join(' ') || `<span class="tag">${esc(t('noFilter'))}</span>`}
    <span>${esc(t('searchedAs'))}</span> <code>${esc(query)}</code>`;

  // हर साइट की progress
  $('progress').hidden = false;
  $('progress').innerHTML = SITES.filter((x) => sites[x.id]).map((x) => [x.id, sites[x.id]]).map(([id, s]) => {
    const site = siteById(id);
    let st;
    if (s.status === 'loading') st = `<span class="spin"></span><span class="st">${esc(t('stLoading'))}</span>`;
    else if (s.status === 'ok') st = `<span class="st ok">${esc(t('stOk', { n: s.count }))}</span>`;
    else if (s.status === 'empty') st = `<span class="st bad">${esc(t('stEmpty'))}</span> <a href="${esc(s.url)}" target="_blank">${esc(t('viewOnSite'))}</a>`;
    else if (s.status === 'blocked') st = `<span class="st bad">${esc(t('stBlocked'))}</span> <a href="${esc(s.url)}" target="_blank">${esc(t('verifyOnSite'))}</a>`;
    else {
      const msg = s.errorCode ? t(s.errorCode) : (s.error || t('errGeneric'));
      st = `<span class="st bad" title="${esc(msg)}">⚠ ${esc(msg.slice(0, 40))}</span> <a href="${esc(s.url)}" target="_blank">${esc(t('viewOnSite'))}</a>`;
    }
    return `<div class="prow" style="--c:${site.color}"><span class="dot"></span><span class="name">${esc(site.name)}</span>${st}</div>`;
  }).join('');

  // नतीजे: filter → score → sort
  const view = Object.fromEntries(VIEW_FIELDS.map((f) => [f, val(f)]));
  $('hideAccWrap').hidden = !hasAccessoryRule(c.category);
  const counts = {};
  let oosHidden = 0;
  let ratingHidden = 0;
  let list = items.map((it) => ({ ...it, m: matchSpecs(it, c) }))
    .filter((it) => it.price != null || it.oos)
    .filter((it) => it.price == null || !c.minPrice || it.price >= c.minPrice)
    .filter((it) => it.price == null || !c.maxPrice || it.price <= c.maxPrice)
    .filter((it) => brandMatches(it, c))
    .filter((it) => !(view.hideAcc && isAccessory(it, c)))
    .filter((it) => !(view.hideAds && it.sponsored))
    .filter((it) => !view.onlyMatch || it.m.fails === 0)
    // बिना रेटिंग वाले भी छुपते हैं (जैसे Amazon/Flipkart का "4★ & up"), पर गिनती दिखाते हैं
    .filter((it) => { if (minRating && !(it.rating >= minRating)) { ratingHidden++; return false; } return true; })
    .filter((it) => { if (it.oos && !view.showOOS) { oosHidden++; return false; } return true; });

  // एक ही product एक साइट पर दो बार आए तो एक रखें
  const seen = new Set();
  list = list.filter((it) => { const k = it.site + '|' + it.url; if (seen.has(k)) return false; seen.add(k); return true; });

  list.forEach((it) => (counts[it.site] = (counts[it.site] || 0) + 1));
  list = list.filter((it) => !hiddenSites.has(it.site));

  const disc = (it) => (it.mrp && it.price ? (it.mrp - it.price) / it.mrp : 0);
  const P = (it, dir) => (it.price == null ? Infinity * dir : it.price);
  const sorters = {
    'price-asc': (a, b) => P(a, 1) - P(b, 1),
    'price-desc': (a, b) => P(b, -1) - P(a, -1),
    match: (a, b) => b.m.score - a.m.score || (b.rating || 0) - (a.rating || 0) || P(a, 1) - P(b, 1),
    rating: (a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviews || 0) - (a.reviews || 0),
    discount: (a, b) => disc(b) - disc(a)
  };
  // stock में मौजूद पहले, फिर चुना हुआ क्रम
  list.sort((a, b) => (a.oos ? 1 : 0) - (b.oos ? 1 : 0) || (sorters[view.sort] || sorters['price-asc'])(a, b));

  const buyable = list.filter((it) => !it.oos && it.price != null);
  const fullMatch = buyable.filter((it) => it.m.fails === 0);
  const bestId = (fullMatch.length ? fullMatch : buyable).reduce((m, it) => (!m || it.price < m.price ? it : m), null)?.id;

  $('resultsWrap').hidden = false;
  const cheapest = buyable.length ? Math.min(...buyable.map((i) => i.price)) : null;
  $('summary').innerHTML = (list.length
    ? t('summary', { n: list.length, p: formatINR(cheapest) }) // translations में सिर्फ़ <b> है, हमारी अपनी string
    : (done ? esc(t('noResults')) : ''))
    + (ratingHidden ? ` <span class="oosNote">· ${esc(t('ratingHidden', { n: ratingHidden, r: minRating }))}</span>` : '')
    + (oosHidden ? ` <span class="oosNote">· ${esc(t('oosCount', { n: oosHidden }))}</span>` : '');

  $('siteFilter').innerHTML = SITES.map((x) => x.id).filter((id) => sites[id]).map((id) => {
    const s = siteById(id);
    return `<label class="chip" style="--c:${s.color}"><input type="checkbox" data-site="${id}" ${hiddenSites.has(id) ? '' : 'checked'}><span class="dot"></span>${esc(s.name)} <span class="n">${counts[id] || 0}</span></label>`;
  }).join('');
  $('siteFilter').querySelectorAll('input').forEach((inp) => inp.addEventListener('change', () => {
    inp.checked ? hiddenSites.delete(inp.dataset.site) : hiddenSites.add(inp.dataset.site);
    render();
  }));

  $('results').innerHTML = list.map((it) => card(it, it.id === bestId, cat)).join('');
  $('empty').hidden = list.length > 0 || !done;
  $('empty').textContent = items.length ? t('emptyFiltered') : t('emptyNone');
}

const ICONS = { mobiles: '📱', tablets: '📱', laptops: '💻', monitors: '🖥️', tvs: '📺', headphones: '🎧', speakers: '🔊', smartwatches: '⌚', watches: '⌚', cameras: '📷', fridges: '🧊', washers: '🫧', acs: '❄️', fans: '🌀', diapers: '👶', wipes: '👶', baby_food: '🍼', baby_gear: '🍼', power_tools: '🛠️', hand_tools: '🔧', footwear: '👟', books: '📚', toys: '🧸', pet: '🐾', cycles: '🚲' };

function card(it, best, cat) {
  const site = siteById(it.site);
  const off = it.mrp && it.price ? Math.round(((it.mrp - it.price) / it.mrp) * 100) : 0;
  const specs = it.m.checks.map((ch) =>
    `<span class="spec ${ch.ok ? 'ok' : ch.unknown ? 'unk' : 'no'}" title="${esc(t(ch.ok ? 'specOk' : ch.unknown ? 'specUnknown' : 'specNo'))}">${ch.ok ? '✓' : ch.unknown ? '?' : '✕'} ${esc(ch.label)}</span>`).join('');
  return `
  <li class="card ${best ? 'best' : ''} ${it.oos ? 'oos' : ''}" tabindex="0" data-url="${esc(it.url)}" style="--c:${site.color}">
    <div class="thumb">${it.image ? `<img src="${esc(it.image)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : `<span class="ph">${ICONS[cat.id] || '🛍️'}</span>`}</div>
    <div class="body">
      <div class="meta">
        <span class="site">${esc(site.name)}</span>
        ${it.oos ? `<span class="oosTag">${esc(t('outOfStock'))}</span>` : ''}
        ${best ? `<span class="bestTag" title="${esc(t('bestDealTitle'))}">${esc(t('bestDeal'))}</span>` : ''}
        ${it.sponsored ? `<span class="ad">${esc(t('ad'))}</span>` : ''}
      </div>
      <p class="title" title="${esc(it.title)}">${esc(it.title)}</p>
      <div class="priceRow">
        ${it.price != null ? `<span class="price">${formatINR(it.price)}</span>` : `<span class="noPrice">${esc(t('priceNA'))}</span>`}
        ${it.mrp && it.price ? `<span class="mrp">${formatINR(it.mrp)}</span><span class="off">${esc(t('off', { n: off }))}</span>` : ''}
      </div>
      ${it.rating ? `<div class="rating"><b>★ ${Number(it.rating).toFixed(1)}</b>${it.reviews ? ` · ${esc(t('ratings', { n: it.reviews.toLocaleString('en-IN') }))}` : ''}</div>` : ''}
      ${specs ? `<div class="specs">${specs}</div>` : ''}
    </div>
  </li>`;
}

$('results').addEventListener('click', (e) => {
  const li = e.target.closest('.card');
  if (li) chrome.tabs.create({ url: li.dataset.url, active: !(e.ctrlKey || e.metaKey) });
});
$('results').addEventListener('keydown', (e) => {
  const li = e.target.closest('.card');
  if (li && e.key === 'Enter') chrome.tabs.create({ url: li.dataset.url });
});
$('progress').addEventListener('click', (e) => {
  const a = e.target.closest('a');
  if (a) { e.preventDefault(); chrome.tabs.create({ url: a.href }); }
});

