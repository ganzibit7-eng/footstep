-- Read-only commercial overview over existing visit/action and Coupang records.
BEGIN;
CREATE OR REPLACE FUNCTION private.admin_commercial_summary(p_from date,p_to date) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
DECLARE result jsonb; cutoff timestamptz:=now(); start_at timestamptz;
 new_start timestamptz:='2026-11-04 08:14:17.094057+00'; coupang_start timestamptz;
BEGIN
 IF auth.uid() IS NULL OR NOT coalesce(public.is_admin(auth.uid()::text),false) THEN RAISE EXCEPTION 'admin_only' USING ERRCODE='42501'; END IF;
 IF p_from IS NULL OR p_to IS NULL OR p_from>p_to OR p_to>(now() AT TIME ZONE 'Asia/Seoul')::date OR p_to-p_from>89 THEN RAISE EXCEPTION 'invalid_period'; END IF;
 start_at:=p_from::timestamp AT TIME ZONE 'Asia/Seoul';
 SELECT min(started_at) INTO coupang_start FROM private.affiliate_links;
 WITH channels(id,tracking_start) AS (VALUES('ad_banner',new_start),('advertise',null::timestamptz),('coupang',coupang_start),('trip',new_start)),
 dates AS (SELECT p_from+n AS day_key FROM generate_series(0,p_to-p_from)n),
 clean AS MATERIALIZED(SELECT * FROM public.page_views WHERE created_at>=start_at-interval '1 day' AND created_at<least(cutoff,(p_to+1)::timestamp AT TIME ZONE 'Asia/Seoul')
 AND CASE WHEN client_kind IN('automation_signal','google_ads_crawler','meta_crawler','naver_crawler') THEN false ELSE private.traffic_included(visitor_id,owner_id,client_kind) END),
 events AS MATERIALIZED(
 SELECT k.id,b.key::date AS day_key,p.visitor_id,k.clicks
 FROM clean p CROSS JOIN LATERAL jsonb_each(coalesce(p.action_counts->'commercial_daily','{}'::jsonb)) b
 CROSS JOIN LATERAL (VALUES
 ('ad_banner',CASE WHEN b.value->>'ad_banner' ~ '^[0-9]{1,4}$' THEN least(1000,(b.value->>'ad_banner')::int) ELSE 0 END),
 ('trip',CASE WHEN b.value->>'trip' ~ '^[0-9]{1,4}$' THEN least(1000,(b.value->>'trip')::int) ELSE 0 END))k(id,clicks)
 WHERE k.clicks>0 AND b.key::date BETWEEN p_from AND p_to
 UNION ALL SELECT 'advertise',(p.created_at AT TIME ZONE 'Asia/Seoul')::date,p.visitor_id,1 FROM clean p
 WHERE p.created_at>=start_at AND p.path IN('/advertise/','/advertise/index.html','/advertise')
 UNION ALL SELECT 'coupang',(c.created_at AT TIME ZONE 'Asia/Seoul')::date,c.visitor_id,1 FROM private.affiliate_clicks c
 WHERE c.created_at>=start_at AND c.created_at<least(cutoff,(p_to+1)::timestamp AT TIME ZONE 'Asia/Seoul')
 AND CASE WHEN c.client_kind IN('automation_signal','google_ads_crawler','meta_crawler','naver_crawler') THEN false ELSE private.traffic_included(c.visitor_id,c.actor_id::text,c.client_kind) END),
 daily AS(SELECT id,day_key,sum(clicks) clicks,count(distinct visitor_id) visitors FROM events GROUP BY 1,2),
 totals AS(SELECT id,sum(clicks) clicks,count(distinct visitor_id) visitors FROM events GROUP BY 1)
 SELECT jsonb_build_object('date_from',p_from,'date_to',p_to,'as_of',cutoff,'channels',(
 SELECT jsonb_agg(jsonb_build_object('id',ch.id,'tracking_started_at',ch.tracking_start,
 'clicks',CASE WHEN p_to<greatest((cutoff AT TIME ZONE 'Asia/Seoul')::date-89,(ch.tracking_start AT TIME ZONE 'Asia/Seoul')::date) THEN null ELSE coalesce(t.clicks,0) END,
 'visitors',CASE WHEN p_to<greatest((cutoff AT TIME ZONE 'Asia/Seoul')::date-89,(ch.tracking_start AT TIME ZONE 'Asia/Seoul')::date) THEN null ELSE coalesce(t.visitors,0) END,
 'daily',(SELECT jsonb_agg(jsonb_build_object('date',dt.day_key,
 'views',CASE WHEN dt.day_key<greatest((cutoff AT TIME ZONE 'Asia/Seoul')::date-89,(ch.tracking_start AT TIME ZONE 'Asia/Seoul')::date) THEN null ELSE coalesce(d.clicks,0) END,
 'visitors',CASE WHEN dt.day_key<greatest((cutoff AT TIME ZONE 'Asia/Seoul')::date-89,(ch.tracking_start AT TIME ZONE 'Asia/Seoul')::date) THEN null ELSE coalesce(d.visitors,0) END) ORDER BY dt.day_key)
 FROM dates dt LEFT JOIN daily d ON d.day_key=dt.day_key AND d.id=ch.id))) FROM channels ch LEFT JOIN totals t ON t.id=ch.id)) INTO result;
 RETURN result;
END $$;
REVOKE ALL ON FUNCTION private.admin_commercial_summary(date,date) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION private.admin_commercial_summary(date,date) TO authenticated,service_role;
CREATE OR REPLACE FUNCTION public.admin_commercial_summary(p_from date,p_to date) RETURNS jsonb
LANGUAGE sql STABLE SECURITY INVOKER SET search_path='' AS $$SELECT private.admin_commercial_summary(p_from,p_to)$$;
REVOKE ALL ON FUNCTION public.admin_commercial_summary(date,date) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.admin_commercial_summary(date,date) TO authenticated,service_role;
COMMIT;

