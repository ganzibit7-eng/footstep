import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(import.meta.dirname, '..');

test('published terms identify the latest documented update and expose every article as a heading', () => {
  const terms = readFileSync(path.join(root, 'terms/index.html'), 'utf8');
  assert.deepEqual([...terms.matchAll(/<h1\b[^>]*>([^<]*)<\/h1>/g)].map(match => match[1]), ['이용약관']);
  const items = [...terms.matchAll(/href="#(terms-item-\d+)">([^<]+)<\/a>/g)];
  assert.equal(items.length, 13);
  for (const [, id, title] of items) {
    assert.ok(terms.includes(`id="${id}"><h2>${title}</h2>`), title);
  }
  const latest = terms.match(/최근 내용 갱신 <time datetime="(\d{4})-(\d{2})-(\d{2})">/);
  assert.ok(latest);
  const [, year, month, day] = latest;
  const history = terms.slice(terms.indexOf('id="terms-item-13"'));
  assert.ok(history.includes(`${year}년 ${Number(month)}월 ${Number(day)}일`));
  assert.match(history, /2026년 10월 18일에는 콘텐츠 표시 범위와 책임/);
});

test('the archived legal migration leaves current published notices untouched on rerun', t => {
  const fixture = mkdtempSync(path.join(tmpdir(), 'balzaguk-legal-'));
  t.after(() => rmSync(fixture, {recursive: true, force: true}));
  const policies = ['privacy/index.html', 'terms/index.html', 'location/index.html', 'privacy/archive/2026-10-15/index.html'];
  const script = 'scripts/update-legal-policy.cjs';
  for (const file of [script, ...policies]) {
    const target = path.join(fixture, file);
    mkdirSync(path.dirname(target), {recursive: true});
    cpSync(path.join(root, file), target);
  }
  execFileSync(process.execPath, [path.join(fixture, script)], {cwd: fixture});
  for (const file of policies) {
    assert.deepEqual(readFileSync(path.join(fixture, file)), readFileSync(path.join(root, file)), file);
  }
});
