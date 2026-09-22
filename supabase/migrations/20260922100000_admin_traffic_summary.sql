begin;
create or replace function public.admin_traffic_summary(p_days integer default 7)
returns jsonb language plpgsql stable security invoker set search_path = '' as $$
declare
 start_at timestamptz;
 cutoff timestamptz := now();
 result jsonb;
begin
 if auth.uid() is null or not coalesce(public.is_admin(auth.uid()::text),false) then
   raise exception 'admin_only' using errcode='42501';
 end if;
 if p_days not in (7,30,90) then raise exception 'invalid_period'; end if;
 start_at := ((now() at time zone 'Asia/Seoul')::date - (p_days-1))::timestamp at time zone 'Asia/Seoul';
 with current_rows as (
  select created_at,visitor_id,coalesce(nullif(btrim(referrer),''),'직접 방문') as source
  from public.page_views where created_at>=start_at and created_at<=cutoff
 ), previous_rows as (
  select visitor_id from public.page_views
  where created_at>=start_at-make_interval(days=>p_days) and created_at<=cutoff-make_interval(days=>p_days)
 ), daily as (
  select (created_at at time zone 'Asia/Seoul')::date as day_key,count(*) views,count(distinct nullif(visitor_id,'')) visitors
  from current_rows group by 1
 ), dates as (
  select ((start_at at time zone 'Asia/Seoul')::date + n)::date as day_key from generate_series(0,p_days-1) n
 ), sources as (
  select source,count(*) views,count(distinct nullif(visitor_id,'')) visitors
  from current_rows group by source order by views desc,source limit 10
 )
 select jsonb_build_object(
  'days',p_days,'from',start_at,'to',cutoff,
  'views',(select count(*) from current_rows),
  'visitors',(select count(distinct nullif(visitor_id,'')) from current_rows),
  'previous_views',(select count(*) from previous_rows),
  'previous_visitors',(select count(distinct nullif(visitor_id,'')) from previous_rows),
  'daily',(select jsonb_agg(jsonb_build_object('date',dates.day_key,'views',coalesce(daily.views,0),'visitors',coalesce(daily.visitors,0)) order by dates.day_key) from dates left join daily using(day_key)),
  'sources',coalesce((select jsonb_agg(jsonb_build_object('source',source,'views',views,'visitors',visitors) order by views desc,source) from sources),'[]'::jsonb)
 ) into result;
 return result;
end $$;
revoke all on function public.admin_traffic_summary(integer) from public,anon;
grant execute on function public.admin_traffic_summary(integer) to authenticated;
commit;