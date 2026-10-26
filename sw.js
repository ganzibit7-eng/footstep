// Offline app shell only: no database responses, location data, ads or map tiles.
const CACHE_NAME='balzaguk-shell-v205-quality9-search';
const MAP_DESIGN_FILE='/map-premium.css?v=20261024-tools';
const SHELL_FILES=["/course-detail-editorial.css?v=20261025-editorial","/trip-stays.css?v=20261022","/walk-calendar.js?v=20261009-detail", "/mong-calendar.css?v=20261009-results", "./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png", "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css", "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js", "https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/MarkerCluster.css", "https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/MarkerCluster.Default.css", "https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/leaflet.markercluster.js", "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.57.4", "/legal.css?v=20261026-controls4-final", "/home-premium.css?v=20261025-disclosure", "/experience.css?v=20261025-kickers", "traffic.js?v=20261009-affiliate", "course-photos.js?v=20261020-nationwide-b", "course-info.js?v=20261020-nationwide-b", "bin-info.js?v=20261008-disposal-sites", "/place-saves.js?v=20261026-quality8", "shopping-config.js?v=20261025-disclosure", "shopping.js?v=20261025-disclosure", "account-deletion-client.js?v=20261014-member-auth-fix", "auth-presentation.js?v=20261024-shop", "/account-ui.css?v=20261024-touch", "facility-info.js?v=20261003", "course-routes.js?v=20261004-expansion", "course-expansion-300.js?v=20261004-300", "course-expansion-20261009.js?v=20261009", "course-expansion-20261009-night.js?v=20261009-night", "course-addresses.js?v=20261020-nationwide-b", "walk-tracker.js?v=20261005-offline", "security-monitor.js?v=20261009", "/readability.css?v=20261026-quality8"];
SHELL_FILES.push("/professional-map.js?v=20261023-explorer",MAP_DESIGN_FILE,"/map-explorer.js?v=20261024-tools","/map-services.js?v=20261020");
SHELL_FILES.push("course-comfort.css?v=20261010-env", "course-photos.js?v=20261020-nationwide-b", "/place-conditions.js?v=20261020-nationwide-e", "course-pet-access.js?v=20261020-nationwide-b", "course-comfort.js?v=20261010-senior", "security-monitor.js?v=20261018-signal-filter", "/place-search.js?v=20261024-polish", "/readability.css?v=20261026-quality8");
SHELL_FILES.push("/admin-loader.js?v=20261025-history-stage4", "/privacy/", "/terms/", "/location/");
SHELL_FILES.push("/home-explore.js?v=20261013-reselect");

SHELL_FILES.push("/design-system.css?v=20261026-controls4-final");
SHELL_FILES.push("/member-event.js?v=20261016-event-flow", "/member-event.css?v=20261016-event-flow");
SHELL_FILES.push("/share-link.js?v=20261016-growth");
SHELL_FILES.push("/legal.css?v=20261026-controls4-final","/home-premium.css?v=20261025-disclosure","/experience.css?v=20261025-kickers","/mong-calendar.css?v=20261009-results","/walk-calendar.js?v=20261009-detail","course-comfort.css?v=20261010-env","/readability.css?v=20261026-quality8","/account-ui.css?v=20261024-touch","/design-system.css?v=20261026-controls4-final","/member-event.css?v=20261016-event-flow","/weather-widget.js?v=20261017-simple","home-explore.js?v=20261013-reselect","/home-scenes.css?v=20261025-kickers","/home-places.css?v=20261023-type","/home-places.js?v=20261017-shopping","/home-scenes.js?v=20261024-polish","share-link.js?v=20261016-growth","admin-loader.js?v=20261025-history-stage4","member-event.js?v=20261016-event-flow","traffic.js?v=20261018-compliance","course-photos.js?v=20261020-nationwide-b","course-info.js?v=20261020-nationwide-b","account-deletion-client.js?v=20261014-member-auth-fix","/signup-consent.js?v=20261018-consent","auth-presentation.js?v=20261024-shop","shopping-config.js?v=20261025-disclosure","shopping.js?v=20261025-disclosure","/place-saves.js?v=20261026-quality8","bin-info.js?v=20261008-disposal-sites","facility-info.js?v=20261003","/place-photos.js?v=20261026-gallery","/place-conditions.js?v=20261020-nationwide-e","course-routes.js?v=20261004-expansion","course-expansion-300.js?v=20261004-300","course-expansion-20261009.js?v=20261009","course-expansion-20261009-night.js?v=20261009-night","course-expansion-20261017.js?v=20261020-nationwide-b","course-pet-access.js?v=20261020-nationwide-b","course-comfort.js?v=20261010-senior","course-addresses.js?v=20261020-nationwide-b","walk-tracker.js?v=20261005-offline","security-monitor.js?v=20261018-signal-filter","/photo-display.js?v=20261018-r2","/privacy-settings.js?v=20261018-choice");
SHELL_FILES.push('/product-ui.css?v=20261026-quality8','/product-motion.js?v=20261024-polish');
SHELL_FILES.push('/assets/fonts/home-sans-subset.woff2','/internal-pages.css?v=20261026-controls4-final');
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>Promise.allSettled(SHELL_FILES.map(path=>cache.add(path)))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('balzaguk-shell-')&&k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url),navigation=url.origin===self.location.origin&&event.request.mode==='navigate';
 if(url.origin===self.location.origin&&/^\/(?:admin-panel\.(?:html|js|css)|admin-affiliate\.js|admin-bot-panel\.js)$/.test(url.pathname))return;
 if(!navigation&&!allowed.has(url.href))return;
 event.respondWith(fetch(event.request,navigation?{cache:'no-cache'}:undefined).then(response=>{if(response.ok&&(allowed.has(url.href)||navigation)){const copy=response.clone();event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy)).catch(()=>{}));}return response;}).catch(async()=>{const cache=await caches.open(CACHE_NAME);const hit=await cache.match(event.request);if(hit)return hit;if(navigation)return (await cache.match('./index.html'))||Response.error();return Response.error();}));
});

SHELL_FILES.push("course-expansion-20261017.js?v=20261020-nationwide-b");

SHELL_FILES.push('/place-photos.js?v=20261026-gallery');

SHELL_FILES.push('/home-scenes.css?v=20261025-kickers','/home-scenes.js?v=20261024-polish');

SHELL_FILES.push('/home-places.css?v=20261023-type','/home-places.js?v=20261017-shopping');

SHELL_FILES.push('/weather-widget.js?v=20261017-simple');

// Include every late-added public module; weather responses stay outside the shell cache.
SHELL_FILES.push('/photo-display.js?v=20261018-r2');
SHELL_FILES.push("/hero-park.css?v=20261023-home-sans","/hero-park.js?v=20261020-immediate","/hero-park-player.js?v=20261020-immediate","/assets/hero-park/poster.webp","/assets/hero-park/gallop-v1/frames.json","/assets/hero-park/gallop-v1/pom-00.webp","/assets/hero-park/gallop-v1/pom-01.webp","/assets/hero-park/gallop-v1/pom-02.webp","/assets/hero-park/gallop-v1/pom-03.webp","/assets/hero-park/gallop-v1/pom-04.webp","/assets/hero-park/gallop-v1/pom-05.webp","/assets/hero-park/gallop-v1/maltese-00.webp","/assets/hero-park/gallop-v1/maltese-01.webp","/assets/hero-park/gallop-v1/maltese-02.webp","/assets/hero-park/gallop-v1/maltese-03.webp","/assets/hero-park/gallop-v1/maltese-04.webp","/assets/hero-park/gallop-v1/maltese-05.webp","/assets/hero-park-preview/desktop-1280.webp","/assets/hero-park-preview/desktop-1920.webp","/assets/hero-park-preview/mobile-480.webp","/assets/hero-park-preview/mobile-960.webp");
// Retain the previous CSS import while already-open documents refresh.
SHELL_FILES.push('/ui-control-tokens.css?v=20261026-controls4-final','/internal-pages.css?v=20261024-third-layout');
SHELL_FILES.push('/place-presentation.js?v=20261026-quality8','/card-media.js?v=20261026-quality8','/card-media.css?v=20261026-quality8','/internal-pages.css?v=20261026-quality8');
SHELL_FILES.push('/place-search.js?v=20261026-quality9-search');
SHELL_FILES.push('/public-update.js?v=20261026-quality9','/photo-display.js?v=20261026-quality9','/place-photos.js?v=20261026-context9');
SHELL_FILES.push('/traffic.js?v=20261026-quality9');
const allowed=new Set(SHELL_FILES.map(path=>new URL(path,self.location.href).href));
