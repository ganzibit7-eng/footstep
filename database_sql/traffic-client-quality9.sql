-- Forward-only classifier coverage. No historical labels, table schema or grants change.
CREATE OR REPLACE FUNCTION private.traffic_client_kind(user_agent text, automated boolean DEFAULT false)
RETURNS text LANGUAGE sql IMMUTABLE SECURITY INVOKER SET search_path='' AS $function$
SELECT CASE
 WHEN coalesce(user_agent,'') ~* 'Mediapartners-Google|AdsBot-Google' THEN 'google_ads_crawler'
 WHEN coalesce(user_agent,'') ~* 'meta-externalagent|meta-externalfetcher|facebookexternalhit|Facebot' THEN 'meta_crawler'
 WHEN coalesce(user_agent,'') ~* 'Yeti/' THEN 'naver_crawler'
 WHEN coalesce(automated,false) OR coalesce(user_agent,'') ~* '(bot|crawler|spider|headless|playwright|puppeteer|selenium|GoogleOther|Google-InspectionTool)'
 OR coalesce(user_agent,'') ~* '(^|[ /;(])(curl|wget|python-requests|python-urllib|aiohttp|httpx|Go-http-client|libwww-perl)([/ ;)]|$)'
 THEN 'automation_signal'
 ELSE 'browser' END;
$function$;
DO $check$
BEGIN
 IF private.traffic_client_kind('curl/8.7.1')<>'automation_signal'
 OR private.traffic_client_kind('python-requests/2.32.0')<>'automation_signal'
 OR private.traffic_client_kind('Go-http-client/1.1')<>'automation_signal'
 OR private.traffic_client_kind('Mozilla/5.0 Chrome/130 Safari/537.36')<>'browser'
 OR private.traffic_client_kind('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1')<>'browser'
 OR private.traffic_client_kind('Mozilla/5.0 (Linux; Android 14; SM-S921B) Chrome/130.0 Mobile Safari/537.36')<>'browser'
 OR private.traffic_client_kind('Mozilla/5.0',true)<>'automation_signal'
 OR private.traffic_client_kind('Yeti/1.1')<>'naver_crawler'
 THEN RAISE EXCEPTION 'traffic classifier regression'; END IF;
 IF EXISTS(select 1 from pg_proc p where p.oid='private.traffic_client_kind(text,boolean)'::regprocedure and p.prosecdef) THEN RAISE EXCEPTION 'Unexpected security definer'; END IF;
END $check$;
