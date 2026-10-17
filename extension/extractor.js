// यह function हर साइट के search page के अंदर inject होकर चलता है।
// chrome.scripting इसे serialize करता है, इसलिए यह पूरी तरह self-contained है
// (बाहर का कोई variable/import इस्तेमाल नहीं करता)।
//
// तरीका: class names पर निर्भर रहने के बजाय (वो अक्सर बदलते हैं), हम
// product links ढूँढते हैं, फिर ऊपर चढ़कर वह "card" पकड़ते हैं जिसमें सिर्फ़
// एक ही product है, और उसमें से title / ₹ price / rating / image निकालते हैं।
// Amazon के लिए उसके stable data-attributes वाला तेज़ रास्ता भी है।

export async function extractProducts(linkPatternSrc, siteId, maxItems = 40) {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const linkRe = new RegExp(linkPatternSrc, 'i');
  const PRICE_RE = /₹\s?([\d,]+(?:\.\d{1,2})?)/;
  const NOT_SELLING = /\boff\b|save|emi|\/\s?mo|month|bank|cashback|coupon|delivery|exchange|up\s?to|extra|fee|bonus|worth/i;

  const toNum = (s) => {
    if (s == null) return null;
    const n = parseFloat(String(s).replace(/[^\d.]/g, ''));
    return Number.isFinite(n) ? n : null;
  };
  const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
  const textOf = (el) => clean(el ? (el.innerText ?? el.textContent) : '');

  const productLinks = (root = document) =>
    [...root.querySelectorAll('a[href]')].filter((a) => linkRe.test(a.href));

  const normUrl = (href) => {
    try {
      const u = new URL(href, location.href);
      if (siteId === 'amazon') {
        const m = u.pathname.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
        if (m) return `https://www.amazon.in/dp/${m[1]}`;
      }
      if (siteId === 'flipkart') {
        const pid = u.searchParams.get('pid');
        return u.origin + u.pathname + (pid ? `?pid=${pid}` : '');
      }
      return u.origin + u.pathname;
    } catch {
      return href;
    }
  };

  const imgSrc = (img) => {
    if (!img) return '';
    const cands = [img.currentSrc, img.src, img.getAttribute('data-src'), (img.getAttribute('srcset') || '').split(/\s+/)[0]];
    return cands.find((s) => s && /^https?:/.test(s) && !s.startsWith('data:')) || '';
  };

  const ratingFrom = (card) => {
    const t = textOf(card);
    let m = t.match(/([1-5](?:\.\d)?)\s*out of\s*5/i) || t.match(/([1-5]\.\d)\s*★/);
    if (m) return parseFloat(m[1]);
    for (const el of card.querySelectorAll('div,span')) {
      if (el.children.length > 2) continue;
      const own = clean(el.textContent);
      if (/^[1-5]\.\d$/.test(own)) return parseFloat(own);
    }
    return null;
  };

  const reviewsFrom = (card) => {
    // text node-wise, ताकि "4.2" और "12,345 Ratings" आपस में न जुड़ें
    const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const m = node.textContent.match(/\(?([\d,]+)\)?\s*(?:ratings|reviews|rating)/i);
      if (m) return toNum(m[1]);
    }
    return null;
  };

  const isStruck = (el, stopAt) => {
    for (let n = el, d = 0; n && n !== stopAt && d < 4; n = n.parentElement, d++) {
      if (/^(S|DEL|STRIKE)$/.test(n.tagName)) return true;
      const deco = getComputedStyle(n).textDecorationLine || getComputedStyle(n).textDecoration || '';
      if (deco.includes('line-through')) return true;
    }
    return false;
  };

  const pricesFrom = (card) => {
    let price = null, mrp = null;
    const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const m = node.textContent.match(PRICE_RE);
      if (!m) continue;
      const el = node.parentElement;
      const ctx = clean(el.textContent) + ' ' + clean(el.parentElement?.textContent || '').slice(0, 80);
      const v = toNum(m[1]);
      if (!v || v < 50) continue;
      if (isStruck(el, card)) { if (mrp == null) mrp = v; continue; }
      if (NOT_SELLING.test(clean(el.textContent)) || /^\s*(?:m\.?r\.?p)/i.test(ctx)) continue;
      if (price == null) price = v;
    }
    if (price == null) {
      // fallback: ₹ और अंक अलग-अलग elements में हों
      for (const line of (card.innerText || card.textContent || '').split('\n')) {
        const m = line.match(PRICE_RE);
        if (m && !NOT_SELLING.test(line)) { price = toNum(m[1]); break; }
      }
    }
    if (mrp == null) {
      // MRP जहाँ "₹" और अंक अलग elements में हों
      for (const el of card.querySelectorAll('s,del,strike,span,div,p')) {
        if (el.children.length > 3) continue;
        const m = clean(el.textContent).match(/^(?:m\.?r\.?p\.?:?\s*)?₹\s?([\d,]+(?:\.\d{1,2})?)$/i);
        if (m && isStruck(el, card)) { mrp = toNum(m[1]); break; }
      }
    }
    if (mrp != null && price != null && mrp <= price) mrp = null;
    return { price, mrp };
  };

  const BAD_TITLE = /^(add to compare|sponsored|bestseller|currently unavailable|out of stock|sold out|coming soon|notify me|new|ad)$/i;
  const OOS_RE = /out of stock|currently unavailable|sold out|temporarily unavailable|coming soon|notify me|not available|no longer available/i;
  const titleFrom = (card, anchors) => {
    const cands = [];
    for (const a of anchors) {
      if (a.title) cands.push(a.title);
      if (a.getAttribute('aria-label')) cands.push(a.getAttribute('aria-label'));
    }
    const anchorTexts = anchors.map(textOf).filter((t) => t && !PRICE_RE.test(t));
    anchorTexts.sort((a, b) => b.length - a.length);
    cands.push(...anchorTexts);
    card.querySelectorAll('h2,h3,h4,[class*="title" i],[class*="name" i]').forEach((h) => cands.push(textOf(h)));
    card.querySelectorAll('img[alt]').forEach((i) => cands.push(i.alt));
    return clean(cands.find((t) => t && t.length >= 8 && t.length <= 300 && !BAD_TITLE.test(t.trim()) && !PRICE_RE.test(t)) || '');
  };

  // 1) पेज के products render होने तक रुकें
  for (let i = 0; i < 24; i++) {
    if (productLinks().length >= 4) break;
    await sleep(500);
  }
  // 2) lazy-load वाली images/cards के लिए थोड़ा scroll
  for (let i = 0; i < 4; i++) { window.scrollBy(0, window.innerHeight || 800); await sleep(350); }
  window.scrollTo(0, 0);
  await sleep(250);

  const items = [];
  const seen = new Set();

  // 3a) Amazon: stable data-attributes
  if (siteId === 'amazon') {
    for (const card of document.querySelectorAll('[data-component-type="s-search-result"][data-asin]')) {
      const asin = card.getAttribute('data-asin');
      if (!asin || seen.has(asin)) continue;
      const h2 = card.querySelector('h2');
      const title = clean(h2?.getAttribute('aria-label') || textOf(h2));
      const price = toNum(card.querySelector('.a-price:not(.a-text-price) .a-offscreen')?.textContent);
      const mrp = toNum(card.querySelector('.a-price.a-text-price .a-offscreen')?.textContent);
      const ratingLabel = card.querySelector('[aria-label*="out of 5"]')?.getAttribute('aria-label') || card.querySelector('.a-icon-alt')?.textContent || '';
      const rm = ratingLabel.match(/([1-5](?:\.\d)?)\s*out of/);
      if (!title) continue;
      const oos = OOS_RE.test(textOf(card));
      if (price == null && !oos) continue; // "See options" वाले cards
      seen.add(asin);
      items.push({
        title,
        url: `https://www.amazon.in/dp/${asin}`,
        price, mrp: mrp && price && mrp > price ? mrp : null,
        rating: rm ? parseFloat(rm[1]) : null,
        reviews: reviewsFrom(card),
        image: imgSrc(card.querySelector('img.s-image') || card.querySelector('img')),
        sponsored: /\bSponsored\b/.test(textOf(card).slice(0, 200)),
        oos,
        text: textOf(card).slice(0, 500)
      });
      if (items.length >= maxItems) break;
    }
  }

  // 3b) Generic: link → single-product card
  if (items.length === 0) {
    const groups = new Map();
    for (const a of productLinks()) {
      const key = normUrl(a.href);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(a);
    }
    for (const [key, anchors] of groups) {
      if (seen.has(key)) continue;
      let card = anchors[0];
      for (let d = 0, n = anchors[0].parentElement; d < 10 && n && n !== document.body; d++, n = n.parentElement) {
        const keys = new Set(productLinks(n).map((a) => normUrl(a.href)));
        if (keys.size > 1) break;
        card = n;
      }
      const cardAnchors = productLinks(card).filter((a) => normUrl(a.href) === key);
      const title = titleFrom(card, cardAnchors.length ? cardAnchors : anchors);
      const { price, mrp } = pricesFrom(card);
      const oos = OOS_RE.test(textOf(card));
      if (!title || (price == null && !oos)) continue; // stock ख़त्म वालों की कीमत अक्सर नहीं दिखती
      seen.add(key);
      items.push({
        title,
        url: key,
        price, mrp,
        rating: ratingFrom(card),
        reviews: reviewsFrom(card),
        image: imgSrc(card.querySelector('img')),
        sponsored: /\b(Sponsored|Ad)\b/.test(textOf(card).slice(0, 120)),
        oos,
        text: textOf(card).slice(0, 500)
      });
      if (items.length >= maxItems) break;
    }
  }

  const head = (document.title + ' ' + (document.body?.innerText || '').slice(0, 1500));
  return {
    items,
    blocked: items.length === 0 && /captcha|robot check|access denied|are you a human|unusual traffic|verify you are/i.test(head),
    pageTitle: document.title
  };
}
