import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CATEGORIES, GROUPS, searchCategories } from '../extension/categories.js';
import { LANGS, langKeys, allKeys } from '../extension/i18n.js';
import { SITES } from '../extension/sites.js';
import { readFileSync } from 'node:fs';

test('every category, group and filter label is translated into every language', () => {
  const keys = new Set();
  for (const c of CATEGORIES) {
    keys.add(c.name);
    for (const f of c.fields) {
      keys.add(f.label);
      f.options?.forEach((o) => o.labelKey && keys.add(o.labelKey));
    }
  }
  GROUPS.forEach((g) => keys.add(g.name));
  for (const l of LANGS) {
    const have = new Set(langKeys(l.id));
    const missing = [...keys].filter((k) => !have.has(k));
    assert.deepEqual(missing, [], `missing in ${l.id}`);
  }
});

test('core UI strings exist in English', () => {
  for (const k of ['search', 'showOOS', 'outOfStock', 'catPlaceholder', 'bestDeal']) assert.ok(allKeys().includes(k), k);
});

test('categories are well formed', () => {
  const ids = new Set();
  const siteIds = new Set(SITES.map((s) => s.id));
  for (const c of CATEGORIES) {
    assert.ok(!ids.has(c.id), `duplicate id ${c.id}`);
    ids.add(c.id);
    assert.ok(GROUPS.some((g) => g.id === c.group), `${c.id}: unknown group ${c.group}`);
    assert.ok(c.sites.length && c.sites.every((s) => siteIds.has(s)), `${c.id}: bad sites`);
    const fids = c.fields.map((f) => f.id);
    assert.equal(new Set(fids).size, fids.length, `${c.id}: duplicate field ids`);
  }
});

test('type-ahead suggestions', () => {
  assert.equal(searchCategories('mob')[0].id, 'mobiles');
  assert.equal(searchCategories('fri')[0].id, 'fridges');
  assert.equal(searchCategories('dia')[0].id, 'diapers');
  assert.deepEqual(searchCategories('tool').slice(0, 2).map((c) => c.id), ['power_tools', 'hand_tools']);
  assert.equal(searchCategories('').length, CATEGORIES.length);
});

test('manifest has a host permission for every store', () => {
  const manifest = JSON.parse(readFileSync(new URL('../extension/manifest.json', import.meta.url)));
  for (const s of SITES) {
    const host = new URL(s.searchUrl('test')).host;
    assert.ok(manifest.host_permissions.some((h) => h.includes(host)), `${s.id}: ${host} missing from host_permissions`);
  }
});
