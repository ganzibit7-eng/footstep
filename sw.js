// 발자국 - 최소 서비스워커 (PWA 설치 조건 충족용)
const CACHE_NAME = 'balzaguk-shell-v2';
const SHELL_FILES = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 네트워크 우선, 실패 시 캐시로 대체 (지도/DB 등 실시간 데이터는 항상 최신을 우선함)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // DB/API/지도 타일/사용자 사진은 캐시에 저장하지 않습니다.
  // 오프라인 캐시에 개인정보와 대용량 타일이 쌓이는 것을 방지합니다.
  if (url.origin !== self.location.origin) return;

  const isShellFile = SHELL_FILES.some((path) => {
    const shellUrl = new URL(path, self.location.origin);
    return shellUrl.pathname === url.pathname;
  });
  if (!isShellFile && event.request.mode !== 'navigate') return;

  event.respondWith(
    fetch(event.request)
      .then((res) => {
        if (res.ok) {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone)).catch(()=>{});
        }
        return res;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match('./index.html')))
  );
});
