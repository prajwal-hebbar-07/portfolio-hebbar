import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import { createContext, runInContext } from 'node:vm';

const html = readFileSync(new URL('./dist/index.html', import.meta.url), 'utf8');
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(match => match[1]);

test('the page presents five sections and all four projects', () => {
  const sections = [...html.matchAll(/<section id="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(sections, ['intro', 'projects', 'experience', 'about', 'contact']);
  for (const name of ['Logbook', 'Prompt Burn', 'LedgerFlow', 'GrowthOS']) {
    assert.ok(html.includes(`<h3>${name}</h3>`), `${name} is visible`);
  }
  assert.equal([...html.matchAll(/<details>/g)].length, 4);
  assert.equal([...html.matchAll(/<h1>/g)].length, 1);
  assert.doesNotMatch(html, /ph_config|ConfigEditor|maker-checker|GuardRail|form-engine|schema pane/i);
});

test('every local link and asset resolves in the production output', () => {
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
  const links = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map(match => match[1]);
  for (const link of links) {
    if (link.startsWith('#')) assert.ok(ids.has(link.slice(1)), `Missing anchor: ${link}`);
    if (link.startsWith('/')) {
      assert.ok(existsSync(new URL(`./dist${decodeURIComponent(link)}`, import.meta.url)), `Missing asset: ${link}`);
    }
  }
  assert.equal(readFileSync(new URL('./dist/Prajwal Hebbar - Resume.pdf', import.meta.url)).subarray(0, 5).toString(), '%PDF-');
});

function visit(stored = null, storageBlocked = false, hasButton = true) {
  const attributes = {};
  const listeners = {};
  const saved = new Map(stored === null ? [] : [['ph_theme', stored]]);
  saved.set('ph_config', '{"theme":"dark"}');
  const button = {
    hidden: true,
    setAttribute: (key, value) => { attributes[key] = value; },
    addEventListener: (name, callback) => { listeners[name] = callback; },
  };
  const document = {
    documentElement: { dataset: { theme: 'light' } },
    querySelector: () => hasButton ? button : null,
  };
  const localStorage = {
    getItem(key) {
      if (storageBlocked) throw new Error('Storage unavailable');
      return saved.get(key) ?? null;
    },
    setItem(key, value) {
      if (storageBlocked) throw new Error('Storage unavailable');
      saved.set(key, value);
    },
  };
  const context = createContext({ document, localStorage });
  for (const script of scripts) runInContext(script, context);
  return { attributes, button, document, saved, click: () => listeners.click() };
}

test('light is the default, old preferences are ignored, and theme choice persists', () => {
  const page = visit();
  assert.equal(page.document.documentElement.dataset.theme, 'light');
  assert.equal(page.button.hidden, false);
  assert.equal(page.attributes['aria-label'], 'Use dark theme');
  page.click();
  assert.equal(page.document.documentElement.dataset.theme, 'dark');
  assert.equal(page.attributes['aria-pressed'], 'true');
  assert.equal(page.saved.get('ph_theme'), 'dark');
  const nextVisit = visit(page.saved.get('ph_theme'));
  assert.equal(nextVisit.document.documentElement.dataset.theme, 'dark');
  nextVisit.click();
  assert.equal(nextVisit.saved.get('ph_theme'), 'light');
  assert.equal(nextVisit.attributes['aria-label'], 'Use dark theme');
});

test('invalid preferences and unavailable storage do not break the page', () => {
  assert.equal(visit('unexpected').document.documentElement.dataset.theme, 'light');
  const page = visit(null, true);
  page.click();
  assert.equal(page.document.documentElement.dataset.theme, 'dark');
  page.click();
  assert.equal(page.document.documentElement.dataset.theme, 'light');
  assert.doesNotThrow(() => visit(null, false, false));
});
