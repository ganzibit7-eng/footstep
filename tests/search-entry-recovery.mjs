import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { applyRegionSearchGuidance } from '../scripts/region-search-guidance.mjs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const recovery = read('search-entry-recovery.js');
const html404 = read('404.html');
const sitemap = read('sitemap.xml');

function render(pathname) {
  const section = {hidden: true};
  const links = [];
  const nav = {append: link => links.push(link)};
  const document = {
    getElementById: id => id === 'entry-recovery' ? section : nav,
    createElement: () => ({}),
  };
  runInNewContext(recovery, {location: {pathname}, document});
  return {hidden: section.hidden, links};
}

test('retired search entries show verified public area links without replacing the 404', () => {
  const holds = [
    ...JSON.parse(read('data/place-review-holds-20261107.json')).ids,
    ...JSON.parse(read('data/pet-access-review-holds-20261111.json')).facilities,
  ];
  const entries = [...recovery.matchAll(/^    (pub[0-9]+_[0-9]+_[a-z0-9]+):/gm)].map(match => match[1]);
  assert.equal(entries.length, 15);
  assert.match(html404, /content="noindex, follow"/);
  assert.match(html404, /<section id="entry-recovery" hidden/);
  assert.match(html404, /href="\/discover\.html"/);
  for (const id of entries) {
    assert(holds.includes(id), id);
    const path = '/places/' + id + '/';
    assert(!existsSync(new URL('..' + path + 'index.html', import.meta.url)));
    assert(!sitemap.includes('https://balzaguk.com' + path));
    const {hidden,links} = render(path);
    assert.equal(hidden, false);
    assert(links.length === 1 || links.length === 2);
    for (const {href,textContent} of links) {
      assert.match(href, /^\/places\/regions\/[a-z]+\/areas\/[A-Za-z0-9_-]+\/(?:cafes\/|stays\/)?$/);
      assert.match(textContent, /애견동반/);
      assert(sitemap.includes('<loc>https://balzaguk.com' + href + '</loc>'), href);
      assert(read(href.slice(1) + 'index.html').includes('rel="canonical" href="https://balzaguk.com' + href + '"'));
    }
  }
  assert.deepEqual(render('/places/missing/'), {hidden: true, links: []});
  assert.deepEqual(render('/courses/c434/'), {hidden: true, links: []});
  assert.deepEqual(render('/places/pub1788410826322_167_ilth5f/?path=//example.com'), {hidden: true, links: []});
});

test('Jeju search entry gives three connected public course choices and retains the same canonical', () => {
  const page = read('courses/regions/jeju/index.html');
  assert.equal(applyRegionSearchGuidance(page), page);
  assert.match(page, /<title>제주 강아지 산책 코스 \| 송악산·닭머르·쇠소깍 \| 발자국<\/title>/);
  assert.match(page, /rel="canonical" href="https:\/\/balzaguk\.com\/courses\/regions\/jeju\/"/);
  const section = page.match(/<section[^>]+id="region-search-guidance"[\s\S]*?<\/section>/)?.[0];
  assert(section);
  for (const id of ['c395', 'c430', 'walk_20261114c_kto_129617']) {
    const path = '/courses/' + id + '/';
    assert(section.includes('href="' + path + '"'));
    const course = read(path.slice(1) + 'index.html');
    assert.match(course, /id="detail-route-data"/);
    assert.match(course.match(/id="detail-route"[^>]*>\s*<h2>([^<]+)/)?.[1] || '',
      id.startsWith('walk_') ? /공개 보행로 기반 제안 경로/ : /공식 GPX (?:경로|선택 구간)/);
  }
});
