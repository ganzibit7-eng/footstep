CREATE OR REPLACE FUNCTION private.traffic_client_kind(user_agent text, automated boolean DEFAULT false)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
 SET search_path TO ''
AS $function$
SELECT CASE
 WHEN coalesce(user_agent,'') ~* 'Mediapartners-Google|AdsBot-Google' THEN 'google_ads_crawler'
 WHEN coalesce(user_agent,'') ~* 'meta-externalagent|meta-externalfetcher|facebookexternalhit|Facebot' THEN 'meta_crawler'
 WHEN coalesce(user_agent,'') ~* 'Yeti/' THEN 'naver_crawler'
 WHEN coalesce(automated,false) OR coalesce(user_agent,'') ~* '(bot|crawler|spider|headless|playwright|puppeteer|selenium|GoogleOther|Google-InspectionTool)' THEN 'automation_signal'
 ELSE 'browser' END;
$function$;