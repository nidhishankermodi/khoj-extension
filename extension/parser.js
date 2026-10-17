// आपकी लिखी description (English / Hinglish / भारतीय भाषाएँ) से ज़रूरतें निकालना,
// साइट्स के लिए search query बनाना, और हर नतीजे को चुनी हुई category के filters से मिलाना।

import { catById, optLabel } from './categories.js';
import { t } from './i18n.js';

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const IND = '\\u0900-\\u0DFF'; // सारी भारतीय लिपियाँ
export const wordRe = (w) => new RegExp(`(^|[^a-z0-9${IND}])${esc(w)}(?=$|[^a-z0-9${IND}])`, 'i');

// ---------- बजट ----------
const NUM = '(\\d[\\d,]*(?:\\.\\d+)?)';
const UNIT = '\\s*(k|हजार|हज़ार|thousand|l|lakh|लाख)?(?![a-z])';
const CUR = '(?:₹|rs\\.?|inr|रु\\.?)?\\s*';
const UPTO = 'तक|के\\s*अंदर|के\\s*अन्दर|से\\s*कम|के\\s*नीचे|tak|ke\\s*andar|se\\s*kam|or less|max|पर्यंत|સુધી|পর্যন্ত|வரை|వరకు|ವರೆಗೆ|ਤੱਕ';

function money(n, unit) {
  let v = parseFloat(String(n).replace(/,/g, ''));
  const u = (unit || '').toLowerCase();
  if (/^(k|हजार|हज़ार|thousand)$/.test(u)) v *= 1000;
  if (/^(l|lakh|लाख)$/.test(u)) v *= 100000;
  return v;
}

// ---------- extractors: text → number | null ----------
function readRamStorage(t) {
  const r = {};
  let m = t.match(/(\d{1,2})\s*gb\s*(?:of\s*)?(?:(?:lp)?ddr\d\w*\s*)?(?:ram|रैम)/i) || t.match(/ram\s*[:\-]?\s*(\d{1,2})\s*gb/i);
  if (m) r.ram = +m[1];
  m = t.match(/(\d{1,2})\s*gb\s*[+/,|]\s*(\d{2,4}|1|2)\s*(gb|tb)/i) || t.match(/(?:^|\s)(\d{1,2})\s*\/\s*(\d{2,4})(?=\s|$)()/);
  if (m) { r.ram ??= +m[1]; r.storage = (m[3] || '').toLowerCase() === 'tb' ? +m[2] * 1024 : +m[2]; }
  if (r.storage == null) {
    m = t.match(/(\d{2,4})\s*gb\s*(?:rom|storage|internal|ssd|emmc|ufs)/i) || t.match(/(\d)\s*tb\b/i);
    if (m) r.storage = /tb/i.test(m[0]) ? +m[1] * 1024 : +m[1];
  }
  if (r.storage == null) {
    for (const x of t.matchAll(/(\d{2,4})\s*gb(?!\s*(?:of\s*)?(?:(?:lp)?ddr\d\w*\s*)?ram)/gi)) {
      const v = +x[1]; if (v >= 32 && v <= 4096 && v !== r.ram) { r.storage = v; break; }
    }
  }
  return r;
}
const one = (re) => (t) => { const m = t.match(re); return m ? parseFloat(m[1]) : null; };
const most = (re) => (t) => { let best = null; for (const m of t.matchAll(re)) best = Math.max(best ?? 0, parseFloat(m[1])); return best; };

export const EXTRACT = {
  ram: (t) => readRamStorage(t).ram ?? null,
  storage: (t) => readRamStorage(t).storage ?? null,
  gbtb: (t) => { const m = t.match(/(\d{1,4})\s*(gb|tb)\b/i); return m ? +m[1] * (m[2].toLowerCase() === 'tb' ? 1024 : 1) : null; },
  inch: (t) => {
    let m = t.match(/(\d{1,3}(?:\.\d{1,2})?)\s*(?:inch(?:es)?\b|-inch|"|”|''|इंच|इन्च|in\b(?!\s*1\b))/i);
    if (m && +m[1] >= 5) return +m[1];
    m = t.match(/(\d{2,3}(?:\.\d{1,2})?)\s*cm\b/i);
    return m ? Math.round((+m[1] / 2.54) * 10) / 10 : null;
  },
  litre: one(/(\d{1,4}(?:\.\d{1,2})?)\s*(?:l|ltr?s?|litres?|liters?|लीटर|लिटर)(?![a-z])/i),
  kg: one(/(\d{1,3}(?:\.\d{1,2})?)\s*(?:kgs?|kilo|किलो)(?![a-z])/i),
  qty: (t) => {
    let m = t.match(/(\d{1,3}(?:\.\d{1,2})?)\s*(kgs?|kilo|किलो|l|ltr?s?|litres?|liters?|लीटर)(?![a-z])/i);
    if (m) return +m[1];
    m = t.match(/(\d{2,4})\s*(g|gm|gms|grams?|ml)\b/i);
    return m ? +m[1] / 1000 : null;
  },
  watt: one(/(\d{1,5})\s*(?:w|watts?)\b/i),
  mp: most(/(\d{1,3})\s*mp\b/gi),
  mah: one(/(\d{4,5})\s*mah/i),
  hz: most(/(\d{2,3})\s*hz\b/gi),
  stars: one(/([1-5])\s*[-\s]?star/i),
  count: (t) => { const m = t.match(/pack\s*of\s*(\d{1,4})/i) || t.match(/(\d{1,4})\s*(?:count|pcs|pieces|pants|diapers|wipes|sheets|units|nos)\b/i); return m ? +m[1] : null; }
};

// keyword बनाते समय ये शब्द नहीं रखते
const STOP = new Set(('i want need a an the with and or for of in to my me is be should have has good best better great nice cheap ' +
  'price budget under below upto within around range rs inr ram rom gb tb storage internal memory ssd hdd camera battery ' +
  'display screen size capacity pack count pcs inch inches cm litre litres liter liters ltr kg kgs ton tons star stars watt watts ' +
  'chahiye chahie mujhe muje mera meri ka ki ke ko wala wali wale aur bhi hona hai me mein se tak kam ' +
  'lena dikhao batao show find search buy new latest please plz approx about for').split(' '));
const UNIT_TOKEN = /^\d+(?:\.\d+)?(gb|tb|mp|mah|hz|kgs?|l|ltrs?|w|v|inch|cm|ton|star|ml|g|gm|pcs|count|k)$/;

/** description → { brand, brandText, values{fieldId: value}, minPrice, maxPrice, features[], keywords[] } */
export function parseDescription(input, catId) {
  const cat = catById(catId);
  let s = ' ' + (input || '').toLowerCase().replace(/[“”"']/g, ' ') + ' ';
  const out = { brand: '', values: {}, minPrice: null, maxPrice: null, features: [], keywords: [] };
  const take = (re, fn) => { s = s.replace(re, (...m) => { fn(m); return ' '; }); };

  // बजट
  take(new RegExp(`${CUR}${NUM}${UNIT}\\s*(?:-|–|to|से|ते|થી|থেকে|ਤੋਂ)\\s*${CUR}${NUM}${UNIT}`, 'i'), (m) => {
    const u2 = m[4]; const a = money(m[1], m[2] || u2), b = money(m[3], u2);
    if (a >= 100 && b >= 100 && b > a) { out.minPrice = a; out.maxPrice = b; }
  });
  if (out.maxPrice == null) take(new RegExp(`(?:under|below|less than|upto|up to|within|max(?:imum)?|budget(?:\\s+(?:is|of))?|बजट(?:\\s+है)?)\\s*${CUR}${NUM}${UNIT}`, 'i'),
    (m) => { const v = money(m[1], m[2]); if (v >= 100) out.maxPrice = v; });
  if (out.maxPrice == null) take(new RegExp(`${CUR}${NUM}${UNIT}\\s*(?:rs|rupees|रुपये|रुपए|रु)?\\s*(?:${UPTO})`, 'i'),
    (m) => { const v = money(m[1], m[2]); if (v >= 100) out.maxPrice = v; });
  take(new RegExp(`(?:above|over|more than|min(?:imum)?|starting)\\s*${CUR}${NUM}${UNIT}`, 'i'),
    (m) => { const v = money(m[1], m[2]); if (v >= 100) out.minPrice = v; });
  take(new RegExp(`${CUR}${NUM}${UNIT}\\s*(?:से\\s*ज़?्?या?दा|से\\s*ऊपर|के\\s*ऊपर|se\\s*upar|se\\s*zyada)`, 'i'),
    (m) => { const v = money(m[1], m[2]); if (v >= 100) out.minPrice = v; });
  if (out.maxPrice == null) take(/(?:₹|rs\.?\s*)\s*(\d[\d,]{2,})|(?:^|\s)(\d{2,3})\s*k(?=\s)/i  /* 4k/8k = resolution, बजट नहीं */, (m) => {
    const v = m[1] ? money(m[1]) : money(m[2], 'k'); if (v >= 100) out.maxPrice = v;
  });

  // category के fields
  const usedNums = new Set(); // "300 litres" का 300 keyword न बने
  const numFirst = [...cat.fields].sort((a, b) => (/min|range/.test(b.type) ? 1 : 0) - (/min|range/.test(a.type) ? 1 : 0));
  for (const f of numFirst) {
    if (f.type === 'min') {
      const v = EXTRACT[f.extract](s);
      if (v != null && v > 0) { out.values[f.id] = v; usedNums.add(String(v)); }
    } else if (f.type === 'range') {
      const v = EXTRACT[f.extract](s);
      const op = v != null && f.options.find((o) => v >= o.lo && v <= o.hi);
      if (op) { out.values[f.id] = op.v; usedNums.add(String(v)); }
    } else if (f.type === 'select') {
      const op = f.options.find((o) => o.rx.test(s));
      if (op) out.values[f.id] = op.v; // user के शब्द keywords में रहते हैं ("basmati rice")
    } else if (f.type === 'bool') {
      if (f.rx.test(s)) out.values[f.id] = true;
    }
  }
  for (const w of cat.featureWords || []) if (wordRe(w).test(s)) { out.features.push(w); s = s.replace(wordRe(w), ' '); }

  // ब्रांड
  for (const b of cat.brands) {
    for (const a of b.alias) {
      if (a.length < 2 || a === 'mi') continue; // "mi" जैसे शब्द description से नहीं पकड़ते (LG, HP, Vu ठीक हैं)
      if (wordRe(a).test(s)) {
        if (!out.brand) out.brand = b.id;
        if (!['galaxy', 'iphone', 'ipad', 'pixel', 'redmi', 'narzo', 'macbook', 'airpods', 'surface'].includes(a)) s = s.replace(wordRe(a), ' ');
      }
    }
  }

  // बचे हुए काम के शब्द (model नाम, product noun…)
  out.keywords = s
    .replace(/[ऀ-෿]+/g, ' ')
    .replace(/[^a-z0-9+.\s-]/g, ' ')
    .split(/\s+/)
    .map((w) => w.replace(/^[.-]+|[.-]+$/g, ''))
    // "iphone 15" का 15 रखें, पर 4+ अंक वाले नंबर (कीमतें) और "8gb", "300l" जैसे unit-tokens नहीं
    .filter((w) => w.length > 1 && !STOP.has(w) && !UNIT_TOKEN.test(w) && !/^\d{4,}$/.test(w) && !/^\d+\.\d+$/.test(w) && !usedNums.has(w))
    .slice(0, 6);
  return out;
}

/** form की explicit values description से ऊपर */
export function mergeCriteria(parsed, form) {
  const values = { ...parsed.values };
  for (const [k, v] of Object.entries(form.fields || {})) if (v !== '' && v !== false && v != null) values[k] = v;
  return {
    category: form.category || 'all',
    brand: form.brand || (form.brandText ? '' : parsed.brand) || '',
    brandText: (form.brandText || '').trim(),
    values,
    minPrice: form.minPrice ? +form.minPrice : parsed.minPrice,
    maxPrice: form.maxPrice ? +form.maxPrice : parsed.maxPrice,
    features: parsed.features,
    keywords: parsed.keywords
  };
}

const fieldTerm = (f, v) => {
  if (v == null || v === '' || v === false || f.inQuery === false) return '';
  if (f.type === 'min') return f.q ? f.q(v) : '';
  if (f.type === 'bool') return f.q || '';
  const op = f.options.find((o) => o.v === v);
  return op?.q || '';
};

export function buildQuery(c) {
  const cat = catById(c.category);
  const parts = [];
  const brand = cat.brands.find((b) => b.id === c.brand);
  if (brand) parts.push(brand.name.startsWith('Apple') ? (brand.alias[1] || 'apple') : brand.alias[0]);
  else if (c.brandText) parts.push(c.brandText.toLowerCase());
  parts.push(...c.keywords);
  for (const f of cat.fields) parts.push(fieldTerm(f, c.values?.[f.id]));

  // शब्द दोहराए न जाएँ
  const seen = new Set();
  const tokens = parts.join(' ').toLowerCase().split(/\s+/).filter((w) => w && !seen.has(w) && seen.add(w));
  const hasType = cat.fields.some((f) => f.label === 'fType' && c.values?.[f.id]);
  if (cat.q && !hasType && !tokens.some((w) => cat.synWords.has(w)) && !cat.q.split(' ').every((w) => seen.has(w))) {
    tokens.push(...cat.q.split(' ').filter((w) => !seen.has(w)));
  }
  return tokens.join(' ').trim();
}

/** filter value का छोटा label (chips के लिए) */
export function valueLabel(f, v) {
  if (f.type === 'min') return (f.chip || f.fmt)(v);
  if (f.type === 'bool') return f.chip || t(f.label);
  const op = f.options.find((o) => o.v === v);
  return op ? optLabel(op) : String(v);
}

/** कौन-सी specs मिलीं — { checks:[{label, ok, unknown}], score 0..1, fails } */
export function matchSpecs(item, c) {
  const cat = catById(c.category);
  const title = item.title || '';
  const hay = `${title} ${item.text || ''}`;
  const checks = [];
  for (const f of cat.fields) {
    const v = c.values?.[f.id];
    if (v == null || v === '' || v === false) continue;
    const label = valueLabel(f, v);
    if (f.type === 'min' || f.type === 'range') {
      const x = EXTRACT[f.extract](title) ?? EXTRACT[f.extract](item.text || '');
      if (x == null) { checks.push({ label, ok: false, unknown: true }); continue; }
      if (f.type === 'min') checks.push({ label, ok: x >= v - 1e-6 });
      else { const op = f.options.find((o) => o.v === v); checks.push({ label, ok: !!op && x >= op.lo && x <= op.hi }); }
    } else if (f.type === 'select') {
      const op = f.options.find((o) => o.v === v);
      if (!op) continue;
      if (op.rx.test(hay)) checks.push({ label, ok: true });
      else if (f.options.some((o) => o !== op && o.rx.test(title))) checks.push({ label, ok: false });
      else checks.push({ label, ok: false, unknown: true });
    } else if (f.type === 'bool') {
      const ok = f.rx.test(hay);
      checks.push({ label, ok, unknown: !ok && !f.absentNo });
    }
  }
  for (const w of c.features || []) {
    const ok = wordRe(w).test(hay);
    checks.push({ label: w.toUpperCase(), ok, unknown: !ok });
  }
  const score = checks.length ? checks.filter((x) => x.ok).length / checks.length : 1;
  const fails = checks.filter((x) => !x.ok && !x.unknown).length;
  return { checks, score, fails };
}

export function brandMatches(item, c) {
  const cat = catById(c.category);
  const b = cat.brands.find((x) => x.id === c.brand);
  if (b) return b.alias.some((a) => wordRe(a).test(item.title || ''));
  if (c.brandText) return wordRe(c.brandText.toLowerCase()).test(item.title || '');
  return true;
}

/** accessories / spare parts (जैसे फ़ोन के लिए cover) — category के हिसाब से */
export function isAccessory(item, c) {
  const cat = catById(c.category);
  if (cat.excludeRx && cat.excludeRx.test(item.title || '') && !(cat.keepRx && cat.keepRx.test(item.title || ''))) return true;
  return !!(cat.minPrice && item.price != null && item.price < cat.minPrice);
}
export const hasAccessoryRule = (catId) => { const c = catById(catId); return !!(c.excludeRx || c.minPrice); };

export const formatINR = (n) => (n == null ? '—' : '₹' + Math.round(n).toLocaleString('en-IN'));
