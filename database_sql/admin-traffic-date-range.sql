-- Additive read-only date range RPCs. Existing presets, RLS and records remain unchanged.
-- Private bounded aggregates check the JWT administrator before any reads, avoiding
-- repeated administrator policy evaluation for every page-view row. Public wrappers
-- remain SECURITY INVOKER. No private schema is exposed to the Data API.
BEGIN;
CREATE OR REPLACE FUNCTION private.admin_traffic_range(p_from date, p_to date)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare start_at timestamptz; cutoff timestamptz; result jsonb; p_days integer;
begin
 if auth.uid() is null or not coalesce(public.is_admin(auth.uid()::text),false) then raise exception 'admin_only' using errcode='42501'; end if;
 if p_from is null or p_to is null or p_from>p_to or p_to>(now() at time zone 'Asia/Seoul')::date or p_to-p_from>365 then raise exception 'invalid_period'; end if;
 p_days:=p_to-p_from+1;
 start_at:=p_from::timestamp at time zone 'Asia/Seoul';
 cutoff:=least(now(),(p_to+1)::timestamp at time zone 'Asia/Seoul');
 with raw as materialized(select p.*,CASE WHEN client_kind IN ('automation_signal','google_ads_crawler','meta_crawler','naver_crawler') THEN false ELSE private.traffic_included(visitor_id,owner_id,client_kind) END included from public.page_views p where created_at>=start_at and created_at<cutoff),
 clean as(select * from raw where included),
 first_touch as(select distinct on(visitor_id) visitor_id,referrer from clean order by visitor_id,created_at,id),
 daily as(select (created_at at time zone 'Asia/Seoul')::date date,count(*) views,count(distinct visitor_id) visitors,
 count(distinct visitor_id) filter(where client_kind='browser' and (active_seconds>=10 or click_count>0)) engaged from clean group by 1),
 dates as(select (start_at at time zone 'Asia/Seoul')::date+n date from generate_series(0,p_days-1)n),
 sources as(select case when coalesce(referrer,'') in ('','직접 방문','직접 방문 / 출처 미상') then '직접 방문 / 출처 미상' else referrer end source,count(*) visitors from first_touch group by 1),
 source_views as(select case when coalesce(referrer,'') in ('','직접 방문','직접 방문 / 출처 미상') then '직접 방문 / 출처 미상' else referrer end source,count(*) views from clean group by 1),
 paths as(select coalesce(path,'이전 기록 · 페이지 미수집') path,count(*) views,count(distinct visitor_id) visitors,count(*) filter(where client_kind='browser') measured_views,count(*) filter(where client_kind='browser' and (active_seconds>=10 or click_count>0)) engaged_views,round(avg(active_seconds) filter(where client_kind='browser'),1) average_active_seconds from clean group by 1 order by views desc limit 15),
 campaigns as(select referrer source,utm_medium medium,utm_campaign campaign,count(*) views,count(distinct visitor_id) visitors from clean where coalesce(utm_campaign,'')<>'' group by 1,2,3 order by views desc limit 15),
 previous as(select * from public.page_views where created_at>=start_at-make_interval(days=>p_days) and created_at<cutoff-make_interval(days=>p_days) and CASE WHEN client_kind IN ('automation_signal','google_ads_crawler','meta_crawler','naver_crawler') THEN false ELSE private.traffic_included(visitor_id,owner_id,client_kind) END)
 select jsonb_build_object('experience',(select jsonb_build_object(
'measured_views',count(*) filter(where client_kind='browser'),
'measured_visitors',count(distinct visitor_id) filter(where client_kind='browser'),
'searches',sum(case when client_kind='browser' then case when action_counts->>'search' ~ '^[0-9]{1,4}$' then least(1000,(action_counts->>'search')::integer) else 0 end end),
'search_visitors',count(distinct visitor_id) filter(where client_kind='browser' and action_counts->>'search' ~ '^[1-9][0-9]{0,3}$'),
'detail_views',count(*) filter(where client_kind='browser' and (path ~ '^/pet-care/places/pc-[a-z-]+-[a-f0-9]{16}/$' or path in(select '/places/'||id::text||'/' from public.facilities union all select '/courses/'||id::text||'/' from public.courses)))
) from clean),'days',p_days,'date_from',p_from,'date_to',p_to,'is_partial',p_to=(now() at time zone 'Asia/Seoul')::date,'generated_at',now(),'from',start_at,'to',cutoff,'views',(select count(*) from clean),'visitors',(select count(distinct visitor_id) from clean),
 'raw_views',(select count(*) from raw),'excluded_views',(select count(*) from raw where not included),
 'automation_views',(select count(*) from raw where client_kind in ('automation_signal','google_ads_crawler','meta_crawler','naver_crawler')),
 'engaged_visitors',(select count(distinct visitor_id) from clean where client_kind='browser' and (active_seconds>=10 or click_count>0)),
 'unmeasured_views',(select count(*) from clean where client_kind='legacy'),
 'previous_views',(select count(*) from previous),'previous_visitors',(select count(distinct visitor_id) from previous),
 'daily',(select jsonb_agg(jsonb_build_object('date',dates.date,'views',coalesce(daily.views,0),'visitors',coalesce(daily.visitors,0),'engaged',coalesce(daily.engaged,0)) order by dates.date) from dates left join daily using(date)),
 'sources',coalesce((select jsonb_agg(jsonb_build_object('source',sources.source,'visitors',sources.visitors,'views',coalesce(source_views.views,0)) order by sources.visitors desc) from sources left join source_views using(source)),'[]'::jsonb),
 'paths',coalesce((select jsonb_agg(to_jsonb(paths)) from paths),'[]'::jsonb),'campaigns',coalesce((select jsonb_agg(to_jsonb(campaigns)) from campaigns),'[]'::jsonb)) into result;
 return result;
end $function$;


CREATE OR REPLACE FUNCTION private.admin_bot_traffic_range(p_from date,p_to date) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
DECLARE start_at timestamptz; cutoff timestamptz; result jsonb;
BEGIN
 IF auth.uid() IS NULL OR NOT coalesce(public.is_admin(auth.uid()::text),false) THEN RAISE EXCEPTION 'admin_only' USING ERRCODE='42501'; END IF;
 IF p_from IS NULL OR p_to IS NULL OR p_from>p_to OR p_to>(now() AT TIME ZONE 'Asia/Seoul')::date OR p_to-p_from>365 THEN RAISE EXCEPTION 'invalid_period'; END IF;
 start_at:=p_from::timestamp AT TIME ZONE 'Asia/Seoul';
 cutoff:=least(now(),(p_to+1)::timestamp AT TIME ZONE 'Asia/Seoul');
 WITH raw AS (SELECT * FROM public.page_views WHERE created_at>=start_at AND created_at<cutoff),
 bots AS (SELECT * FROM raw WHERE client_kind IN('automation_signal','google_ads_crawler','meta_crawler','naver_crawler')),
 kinds AS (SELECT client_kind,count(*) views,count(distinct visitor_id) browsers,min(created_at) first_seen,max(created_at) last_seen FROM bots GROUP BY 1),
 hours AS (SELECT to_char(created_at AT TIME ZONE 'Asia/Seoul','YYYY-MM-DD HH24:00') hour_kst, count(*) views,count(*) FILTER(WHERE client_kind IN('automation_signal','google_ads_crawler','meta_crawler','naver_crawler')) bots,count(*) FILTER(WHERE CASE WHEN client_kind IN ('automation_signal','google_ads_crawler','meta_crawler','naver_crawler') THEN false ELSE private.traffic_included(visitor_id,owner_id,client_kind) END) included FROM raw GROUP BY 1),
 paths AS (SELECT coalesce(path,'이전 기록 · 페이지 미수집') path,client_kind,count(*) views FROM bots GROUP BY 1,2 ORDER BY views DESC LIMIT 30),
 recent AS (SELECT created_at,path,client_kind,active_seconds,click_count FROM bots ORDER BY created_at DESC,id DESC LIMIT 50)
 SELECT jsonb_build_object('date_from',p_from,'date_to',p_to,'total_views',(SELECT count(*) FROM raw),'bot_views',(SELECT count(*) FROM bots),
 'unclassified_views',(SELECT count(*) FROM raw WHERE client_kind IN('browser','legacy')),
 'kinds',coalesce((SELECT jsonb_agg(to_jsonb(kinds) ORDER BY views DESC) FROM kinds),'[]'::jsonb),
 'hours',coalesce((SELECT jsonb_agg(to_jsonb(hours) ORDER BY hour_kst DESC) FROM hours),'[]'::jsonb),
 'paths',coalesce((SELECT jsonb_agg(to_jsonb(paths)) FROM paths),'[]'::jsonb),
 'recent',coalesce((SELECT jsonb_agg(to_jsonb(recent)) FROM recent),'[]'::jsonb)) INTO result;
 RETURN result;
END $$;

CREATE OR REPLACE FUNCTION public.admin_traffic_range(p_from date,p_to date) RETURNS jsonb
LANGUAGE sql STABLE SECURITY INVOKER SET search_path='' AS $$ SELECT private.admin_traffic_range(p_from,p_to) $$;
CREATE OR REPLACE FUNCTION public.admin_bot_traffic_range(p_from date,p_to date) RETURNS jsonb
LANGUAGE sql STABLE SECURITY INVOKER SET search_path='' AS $$ SELECT private.admin_bot_traffic_range(p_from,p_to) $$;
REVOKE ALL ON FUNCTION private.admin_traffic_range(date,date),private.admin_bot_traffic_range(date,date) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION private.admin_traffic_range(date,date),private.admin_bot_traffic_range(date,date) TO authenticated,service_role;
REVOKE ALL ON FUNCTION public.admin_traffic_range(date,date),public.admin_bot_traffic_range(date,date) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.admin_traffic_range(date,date),public.admin_bot_traffic_range(date,date) TO authenticated,service_role;
COMMIT;
