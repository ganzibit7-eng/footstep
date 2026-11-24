import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const origin = 'https://balzaguk.com';
const worker = readFileSync(new URL('../sw.js', import.meta.url), 'utf8');

function startWorker() {
  const events = new Map();
  const entries = new Map([[origin + '/index.html', new Response('cached home')]]);
  const key = request => new URL(typeof request === 'string' ? request : request.url, origin).href;
  const cache = {
    async put(request, response) { entries.set(key(request), response); },
    async match(request) { return entries.get(key(request))?.clone(); },
    async delete(request, options) {
      for (const url of entries.keys()) {
        if (url === key(request) || (options?.ignoreSearch && new URL(url).pathname === new URL(key(request)).pathname)) entries.delete(url);
      }
    }
  };
  let network;
  vm.runInNewContext(worker, {
    URL, Response,
    self: {location: new URL(origin + '/sw.js'), addEventListener: (type, handler) => events.set(type, handler)},
    caches: {open: async () => cache},
    fetch: async () => {
      if (!network) throw new TypeError('offline');
      return network.clone();
    }
  });
  return async function visit(path, onlineResponse) {
    network = onlineResponse;
    const pending = [];
    let result;
    events.get('fetch')({
      request: {url: origin + path, method: 'GET', mode: 'navigate'},
      respondWith: response => { result = response; },
      waitUntil: operation => pending.push(operation)
    });
    const page = await result;
    await Promise.all(pending);
    return page;
  };
}

test('offline deep links show the saved detail or a retry notice, and the home shell still opens', async () => {
  const visit = startWorker();
  await visit('/courses/c361/', new Response('saved course'));
  assert.equal(await (await visit('/courses/c361/')).text(), 'saved course');
  const unseen = await visit('/places/unvisited/');
  assert.equal(unseen.status, 503);
  assert.match(unseen.headers.get('content-type'), /text\/html/);
  assert.match(await unseen.text(), /다시 시도/);
  assert.equal(await (await visit('/?from=map')).text(), 'cached home');
  assert.equal(await (await visit('/index.html?from=map')).text(), 'cached home');
});

test('withdrawn details stay withdrawn offline after a live 404 or 410, while temporary failures retain the saved copy', async () => {
  for (const status of [404, 410, 503]) {
    const visit = startWorker();
    const path = '/places/previously-visited/';
    await visit(path, new Response('former listing'));
    await visit(path + '?from=list', new Response('former listing'));
    assert.equal((await visit(path, new Response('live response', {status}))).status, status);
    const offline = await visit(path);
    if (status === 503) assert.equal(await offline.text(), 'former listing');
    else {
      assert.equal(offline.status, 503);
      assert.equal((await visit(path + '?from=list')).status, 503);
    }
  }
});
