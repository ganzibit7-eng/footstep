// Offline app shell only: no database responses, location data, ads or map tiles.
const CACHE_NAME='balzaguk-shell-v99-place-batch2';
const SHELL_FILES=["/walk-calendar.js?v=20261009-detail", "/mong-calendar.css?v=20261009-results", "./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png", "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css", "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js", "https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/MarkerCluster.css", "https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/MarkerCluster.Default.css", "https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/leaflet.markercluster.js", "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.57.4", "/legal.css?v=20261006-premium", "/home-premium.css?v=20261016-premium-finish", "/experience.css?v=20261013-map-flow", "traffic.js?v=20261009-affiliate", "course-photos.js?v=20261017-routes3", "course-info.js?v=20261017-routes3", "bin-info.js?v=20261008-disposal-sites", "/place-saves.js?v=20261008", "shopping-config.js?v=20261011-photo-badges", "shopping.js?v=20261017-compact", "account-deletion-client.js?v=20261014-member-auth-fix", "auth-presentation.js?v=20261013-consent", "/account-ui.css?v=20261013-consent", "facility-info.js?v=20261003", "course-routes.js?v=20261004-expansion", "course-expansion-300.js?v=20261004-300", "course-expansion-20261009.js?v=20261009", "course-expansion-20261009-night.js?v=20261009-night", "course-addresses.js?v=20261017-routes3", "walk-tracker.js?v=20261005-offline", "security-monitor.js?v=20261009", "/readability.css?v=20261013-readable"];
SHELL_FILES.push("course-comfort.css?v=20261010-env", "course-photos.js?v=20261017-routes3", "/place-conditions.js?v=20261018-batch2-final", "course-pet-access.js?v=20261017-routes3", "course-comfort.js?v=20261010-senior", "security-monitor.js?v=20261009-alerts", "/place-search.js?v=20261011-search", "/readability.css?v=20261013-readable");
SHELL_FILES.push("/admin-loader.js?v=20261014-member-auth-fix", "/privacy/", "/terms/", "/location/");
SHELL_FILES.push("/home-explore.js?v=20261013-reselect");
SHELL_FILES.push("/assets/mong-front-v2.webp");
SHELL_FILES.push("/design-system.css?v=20261016-discovery");
SHELL_FILES.push("/member-event.js?v=20261016-event-flow", "/member-event.css?v=20261016-event-flow");
SHELL_FILES.push("/share-link.js?v=20261016-growth");
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>Promise.allSettled(SHELL_FILES.map(path=>cache.add(path)))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('balzaguk-shell-')&&k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url),navigation=url.origin===self.location.origin&&event.request.mode==='navigate';
 if(url.origin===self.location.origin&&/^\/(?:admin-panel\.(?:html|js|css)|admin-affiliate\.js|admin-bot-panel\.js)$/.test(url.pathname))return;
 if(!navigation&&!allowed.has(url.href))return;
 event.respondWith(fetch(event.request).then(response=>{if(response.ok&&(allowed.has(url.href)||navigation)){const copy=response.clone();event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy)).catch(()=>{}));}return response;}).catch(async()=>{const cache=await caches.open(CACHE_NAME);const hit=await cache.match(event.request);if(hit)return hit;if(navigation)return (await cache.match('./index.html'))||Response.error();return Response.error();}));
});

SHELL_FILES.push("course-expansion-20261017.js?v=20261017-routes3");

SHELL_FILES.push('/place-photos.js?v=20261018-batch2-final');

SHELL_FILES.push('/home-scenes.css?v=20261017-motion','/home-scenes.js?v=20261017-motion');

SHELL_FILES.push('/home-places.css?v=20261017-native-cards','/home-places.js?v=20261017-shopping');

SHELL_FILES.push('/weather-widget.js?v=20261017-simple');

// Include every late-added public module; weather responses stay outside the shell cache.
const allowed=new Set(SHELL_FILES.map(path=>new URL(path,self.location.href).href));
