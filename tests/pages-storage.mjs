import test from 'node:test';
import assert from 'node:assert/strict';
import {audit,excluded,excludesFrom} from '../scripts/audit-pages-storage.mjs';

test('research exclusions cannot remove similarly named public pages',()=>{
 const entries=excludesFrom('exclude:\n  - docs\n  - "index .html"\n');
 assert(excluded('docs/research.json',entries));assert(excluded('index .html',entries));
 assert(!excluded('docs-public/index.html',entries));assert(!excluded('index.html',entries));
 assert(!excluded('updates/archive/index.html',entries));
});
test('public links and service files survive deployment exclusions',()=>{
 const result=audit();assert(result.excludedBytes>20_000_000);
 assert(result.publicSourceBytes<975_000_000);assert(result.publicFiles>4000);
});
