CREATE OR REPLACE FUNCTION public.admin_bot_traffic(p_days integer DEFAULT 1) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY INVOKER SET search_path='' AS $$
DECLARE start_at timestamptz; result jsonb;
BEGIN
 IF auth.uid() IS NULL OR NOT coalesce(public.is_admin(auth.uid()::text),false) THEN RAISE EXCEPTION 'admin_only' USING ERRCODE='42501'; END IF;
 IF p_days NOT IN(1,7,30,90) THEN RAISE EXCEPTION 'invalid_period'; END IF;
 start_at:=((now() AT TIME ZONE 'Asia/Seoul')::date-(p_days-1))::timestamp AT TIME ZONE 'Asia/Seoul';
 WITH raw AS (SELECT * FROM public.page_views WHERE created_at>=start_at AND created_at<=now()),
 bots AS (SELECT * FROM raw WHERE client_kind IN('automation_signal','google_ads_crawler','meta_crawler','naver_crawler')),
 kinds AS (SELECT client_kind,count(*) views,count(distinct visitor_id) browsers,min(created_at) first_seen,max(created_at) last_seen FROM bots GROUP BY 1),
 hours AS (SELECT to_char(created_at AT TIME ZONE 'Asia/Seoul','YYYY-MM-DD HH24:00') hour_kst, count(*) views,count(*) FILTER(WHERE client_kind IN('automation_signal','google_ads_crawler','meta_crawler','naver_crawler')) bots,count(*) FILTER(WHERE private.traffic_included(visitor_id,owner_id,client_kind)) included FROM raw GROUP BY 1),
 paths AS (SELECT coalesce(path,'이전 기록 · 페이지 미수집') path,client_kind,count(*) views FROM bots GROUP BY 1,2 ORDER BY views DESC LIMIT 30),
 recent AS (SELECT created_at,path,client_kind,active_seconds,click_count FROM bots ORDER BY created_at DESC,id DESC LIMIT 50)
 SELECT jsonb_build_object('total_views',(SELECT count(*) FROM raw),'bot_views',(SELECT count(*) FROM bots),
 'unclassified_views',(SELECT count(*) FROM raw WHERE client_kind IN('browser','legacy')),
 'kinds',coalesce((SELECT jsonb_agg(to_jsonb(kinds) ORDER BY views DESC) FROM kinds),'[]'::jsonb),
 'hours',coalesce((SELECT jsonb_agg(to_jsonb(hours) ORDER BY hour_kst DESC) FROM hours),'[]'::jsonb),
 'paths',coalesce((SELECT jsonb_agg(to_jsonb(paths)) FROM paths),'[]'::jsonb),
 'recent',coalesce((SELECT jsonb_agg(to_jsonb(recent)) FROM recent),'[]'::jsonb)) INTO result;
 RETURN result;
END $$;
REVOKE ALL ON FUNCTION public.admin_bot_traffic(integer) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.admin_bot_traffic(integer) TO authenticated;
