-- Additive aggregates of existing records only. No tables, policies, grants or collection changes.
CREATE OR REPLACE FUNCTION public.admin_traffic_summary_v2(p_days integer DEFAULT 7)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
 SET search_path TO ''
AS $function$
declare start_at timestamptz; cutoff timestamptz:=now(); result jsonb;
begin
 if auth.uid() is null or not coalesce(public.is_admin(auth.uid()::text),false) then raise exception 'admin_only' using errcode='42501'; end if;
 if p_days not in(1,7,30,90) then raise exception 'invalid_period'; end if;
 start_at:=((now() at time zone 'Asia/Seoul')::date-(p_days-1))::timestamp at time zone 'Asia/Seoul';
 with raw as materialized(select p.*,private.traffic_included(visitor_id,owner_id,client_kind) included from public.page_views p where created_at>=start_at and created_at<=cutoff),
 clean as(select * from raw where included),
 first_touch as(select distinct on(visitor_id) visitor_id,referrer from clean order by visitor_id,created_at,id),
 daily as(select (created_at at time zone 'Asia/Seoul')::date date,count(*) views,count(distinct visitor_id) visitors,
 count(distinct visitor_id) filter(where client_kind='browser' and (active_seconds>=10 or click_count>0)) engaged from clean group by 1),
 dates as(select (start_at at time zone 'Asia/Seoul')::date+n date from generate_series(0,p_days-1)n),
 sources as(select case when coalesce(referrer,'') in ('','직접 방문','직접 방문 / 출처 미상') then '직접 방문 / 출처 미상' else referrer end source,count(*) visitors from first_touch group by 1),
 source_views as(select case when coalesce(referrer,'') in ('','직접 방문','직접 방문 / 출처 미상') then '직접 방문 / 출처 미상' else referrer end source,count(*) views from clean group by 1),
 paths as(select coalesce(path,'이전 기록 · 페이지 미수집') path,count(*) views,count(distinct visitor_id) visitors,count(*) filter(where client_kind='browser') measured_views,count(*) filter(where client_kind='browser' and (active_seconds>=10 or click_count>0)) engaged_views,round(avg(active_seconds) filter(where client_kind='browser'),1) average_active_seconds from clean group by 1 order by views desc limit 15),
 campaigns as(select referrer source,utm_medium medium,utm_campaign campaign,count(*) views,count(distinct visitor_id) visitors from clean where coalesce(utm_campaign,'')<>'' group by 1,2,3 order by views desc limit 15),
 previous as(select * from public.traffic_clean_page_views where created_at>=start_at-make_interval(days=>p_days) and created_at<=cutoff-make_interval(days=>p_days))
 select jsonb_build_object('experience',(select jsonb_build_object(
'measured_views',count(*) filter(where client_kind='browser'),
'measured_visitors',count(distinct visitor_id) filter(where client_kind='browser'),
'searches',sum(case when client_kind='browser' then case when action_counts->>'search' ~ '^[0-9]{1,4}$' then least(1000,(action_counts->>'search')::integer) else 0 end end),
'search_visitors',count(distinct visitor_id) filter(where client_kind='browser' and action_counts->>'search' ~ '^[1-9][0-9]{0,3}$'),
'detail_views',count(*) filter(where client_kind='browser' and (path ~ '^/pet-care/places/pc-[a-z-]+-[a-f0-9]{16}/$' or path in(select '/places/'||id::text||'/' from public.facilities union all select '/courses/'||id::text||'/' from public.courses)))
) from clean),'days',p_days,'from',start_at,'to',cutoff,'views',(select count(*) from clean),'visitors',(select count(distinct visitor_id) from clean),
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

DO $verify$ BEGIN
 IF (SELECT proacl::text FROM pg_proc WHERE oid='public.admin_traffic_summary_v2(integer)'::regprocedure) IS DISTINCT FROM '{postgres=X/postgres,authenticated=X/postgres,service_role=X/postgres}' THEN RAISE EXCEPTION 'RPC ACL changed'; END IF;
 IF (SELECT prosecdef FROM pg_proc WHERE oid='public.admin_traffic_summary_v2(integer)'::regprocedure) THEN RAISE EXCEPTION 'Unexpected SECURITY DEFINER'; END IF;
END $verify$;

