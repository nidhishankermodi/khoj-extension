import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseDescription, mergeCriteria, buildQuery, matchSpecs, isAccessory } from '../extension/parser.js';
import { detectCategory } from '../extension/categories.js';

const understand = (text) => {
  const category = detectCategory(text) || 'all';
  const parsed = parseDescription(text, category);
  const criteria = mergeCriteria(parsed, { category });
  return { category, parsed, criteria, query: buildQuery(criteria) };
};

test('mobile: brand, specs and Hindi budget', () => {
  const r = understand('Samsung 5G phone, 8GB RAM, 128GB, 50MP camera, 20000 तक');
  assert.equal(r.category, 'mobiles');
  assert.equal(r.parsed.brand, 'samsung');
  assert.deepEqual(r.parsed.values, { ram: 8, storage: 128, camera: 50, g5: true });
  assert.equal(r.parsed.maxPrice, 20000);
  assert.match(r.query, /samsung/);
  assert.match(r.query, /8gb ram/);
});

test('budget formats', () => {
  const cases = [
    ['phone 15k-25k', 15000, 25000],
    ['phone under 30000', null, 30000],
    ['phone 15000 से 20000', 15000, 20000],
    ['phone 20000 पर्यंत', null, 20000],
    ['phone 15000 வரை', null, 15000],
    ['phone above 40000', 40000, null],
    ['phone 1.5 lakh tak', null, 150000]
  ];
  for (const [text, min, max] of cases) {
    const p = parseDescription(text, 'mobiles');
    assert.equal(p.minPrice, min, `${text} → min`);
    assert.equal(p.maxPrice, max, `${text} → max`);
  }
});

test('"4k tv" is a resolution, not a ₹4,000 budget', () => {
  const r = understand('sony 55 inch 4k tv');
  assert.equal(r.category, 'tvs');
  assert.equal(r.parsed.maxPrice, null);
  assert.equal(r.parsed.values.screen, '55"');
  assert.equal(r.parsed.values.res, '4K Ultra HD');
});

test('refrigerator filters', () => {
  const r = understand('LG double door fridge 300 litres 3 star inverter under 35000');
  assert.equal(r.category, 'fridges');
  assert.equal(r.parsed.brand, 'lg');
  assert.deepEqual(r.parsed.values, { capacity: 300, stars: 3, door: 'Double door', inverter: true });
});

test('other categories', () => {
  assert.deepEqual(understand('daikin 1.5 ton split ac 5 star').parsed.values, { stars: 5, ton: '1.5 Ton', type: 'Split' });
  assert.deepEqual(understand('bosch cordless drill 18v').parsed.values, { type: 'Drill / driver', source: 'Cordless (battery)', volt: '18V / 20V' });
  assert.deepEqual(understand('pampers pants xl diapers 50 pcs').parsed.values, { count: 50, type: 'Pants', size: 'XL' });
  assert.equal(understand('samsung semi automatic washing machine 8 kg').parsed.values.type, 'Semi-automatic');
  assert.equal(understand('मुझे 43 इंच का टीवी चाहिए 25000 तक').parsed.values.screen, '43"');
});

test('category detection: first product mentioned wins', () => {
  assert.equal(detectCategory('Samsung 5G phone with 50MP camera'), 'mobiles');
  assert.equal(detectCategory('angle grinder 850w'), 'power_tools');
  assert.equal(detectCategory('फ्रिज 300 लीटर'), 'fridges');
  assert.equal(detectCategory('nothing specific here'), null);
});

test('spec matching: ✓ / ✕ / ?', () => {
  const c = mergeCriteria(parseDescription('double door fridge 300 litres 3 star inverter', 'fridges'), { category: 'fridges' });
  const ok = matchSpecs({ title: 'LG 322 L 3 Star Frost-Free Smart Inverter Double Door Refrigerator' }, c);
  assert.equal(ok.fails, 0);
  assert.equal(ok.score, 1);
  const bad = matchSpecs({ title: 'Samsung 192 L 2 Star Single Door Refrigerator' }, c);
  assert.equal(bad.fails, 3); // capacity, door, stars fail; inverter unknown
  assert.ok(bad.checks.find((x) => x.label === 'Inverter').unknown);
});

test('accessories are filtered per category', () => {
  const c = { category: 'mobiles' };
  assert.equal(isAccessory({ title: 'Spigen Back Cover for Galaxy M35', price: 799 }, c), true);
  assert.equal(isAccessory({ title: 'Samsung Galaxy M35 5G (8GB RAM, 128GB)', price: 16499 }, c), false);
});
