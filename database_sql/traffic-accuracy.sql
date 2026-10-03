-- Additive analytics upgrade. Existing raw records remain intact.
create schema if not exists private;
create table if not exists private.traffic_exclusions(
 visitor_id text primary key, reason text not null check(reason in ('admin','work_test')), created_at timestamptz not null default now()
);
alter table private.traffic_exclusions enable row level security;
revoke all on private.traffic_exclusions from public,anon,authenticated;
insert into private.traffic_exclusions(visitor_id,reason)
select distinct visitor_id,'admin' from public.page_views where owner_id is not null and public.is_admin(owner_id)
on conflict(visitor_id) do nothing;
alter table public.page_views
 add column if not exists view_token uuid,
 add column if not exists path text,
 add column if not exists last_page text,
 add column if not exists utm_medium text,
 add column if not exists utm_campaign text,
 add column if not exists active_seconds integer not null default 0,
 add column if not exists click_count integer not null default 0,
 add column if not exists scroll_depth integer not null default 0,
 add column if not exists action_counts jsonb not null default '{}'::jsonb,
 add column if not exists client_kind text not null default 'legacy',
 add column if not exists last_event_at timestamptz;
create unique index if not exists page_views_view_token_idx on public.page_views(view_token) where view_token is not null;
create index if not exists page_views_visitor_created_idx on public.page_views(visitor_id,created_at);

create or replace function private.record_traffic_visit(p_payload jsonb) returns jsonb
language plpgsql security definer set search_path='' as $$
declare
 vid text:=p_payload->>'visitor_id'; tok uuid; loc text:=p_payload->>'path';
 uid text:=auth.uid()::text; headers jsonb; automated boolean; n integer;
 a integer; c integer; d integer; counts jsonb:='{}'::jsonb; key text;
begin
 if octet_length(p_payload::text)>4096 or vid is null or vid!~'^v[0-9]{10,16}[a-z0-9]{4,20}$' then raise exception 'invalid_payload'; end if;
 if loc is null or length(loc)>180 or loc!~'^/[A-Za-z0-9/_-]*(\.html)?$' then raise exception 'invalid_path'; end if;
 tok:=(p_payload->>'view_token')::uuid;
 if tok is null then raise exception 'invalid_token'; end if;
 if uid is not null and coalesce(public.is_admin(uid),false) then
  insert into private.traffic_exclusions(visitor_id,reason) values(vid,'admin') on conflict(visitor_id) do nothing;
 end if;
 if exists(select 1 from private.traffic_exclusions where visitor_id=vid) then return jsonb_build_object('excluded',true); end if;
 headers:=coalesce(nullif(current_setting('request.headers',true),''),'{}')::jsonb;
 automated:=coalesce((p_payload->>'automated')::boolean,false) or coalesce(headers->>'user-agent','')~*'(bot|crawler|spider|headless|playwright|puppeteer|selenium)';
 a:=least(86400,greatest(0,coalesce((p_payload->>'active_seconds')::integer,0)));
 c:=least(1000,greatest(0,coalesce((p_payload->>'clicks')::integer,0)));
 d:=least(100,greatest(0,coalesce((p_payload->>'depth')::integer,0)));
 foreach key in array array['link','button','search','navigation'] loop
  counts:=counts||jsonb_build_object(key,least(1000,greatest(0,coalesce((p_payload->'actions'->>key)::integer,0))));
 end loop;
 -- Bound per-browser creation volume; pings update the same token, never add views.
 if not exists(select 1 from public.page_views where view_token=tok) then
  select count(*) into n from public.page_views where visitor_id=vid and created_at>now()-interval '1 hour';
  if n>=120 then return jsonb_build_object('limited',true); end if;
 end if;
 insert into public.page_views(visitor_id,owner_id,referrer,view_token,path,last_page,utm_medium,utm_campaign,client_kind,last_event_at)
 values(vid,uid,left(coalesce(nullif(p_payload->>'source',''),'직접 방문 / 출처 미상'),120),tok,loc,left(coalesce(p_payload->>'page',loc),180),
 left(p_payload->>'medium',80),left(p_payload->>'campaign',80),case when automated then 'automation_signal' else 'browser' end,now())
 on conflict(view_token) where view_token is not null do nothing;
 update public.page_views set
  active_seconds=greatest(active_seconds,least(a,greatest(0,extract(epoch from now()-created_at)::integer+2))),
  click_count=greatest(click_count,c),scroll_depth=greatest(scroll_depth,d),action_counts=counts,
  last_page=left(coalesce(p_payload->>'page',loc),180),last_event_at=now(),owner_id=coalesce(owner_id,uid),
  client_kind=case when automated then 'automation_signal' else client_kind end
 where view_token=tok and visitor_id=vid and path=loc and created_at>now()-interval '1 day';
 return jsonb_build_object('excluded',automated);
end $$;
revoke all on function private.record_traffic_visit(jsonb) from public;
grant usage on schema private to anon,authenticated;
grant execute on function private.record_traffic_visit(jsonb) to anon,authenticated;
create or replace function public.record_traffic_visit(p_payload jsonb) returns jsonb
language sql security invoker set search_path='' as $$select private.record_traffic_visit(p_payload);$$;
revoke all on function public.record_traffic_visit(jsonb) from public;
grant execute on function public.record_traffic_visit(jsonb) to anon,authenticated;

create or replace function private.traffic_included(vid text,uid text,kind text) returns boolean
language sql stable security definer set search_path='' as $$
 select not exists(select 1 from private.traffic_exclusions where visitor_id=vid)
 and not coalesce(public.is_admin(uid),false) and kind<>'automation_signal';
$$;
revoke all on function private.traffic_included(text,text,text) from public;
grant execute on function private.traffic_included(text,text,text) to authenticated;
create or replace view public.traffic_clean_page_views with(security_invoker=true) as
 select * from public.page_views where private.traffic_included(visitor_id,owner_id,client_kind);
revoke all on public.traffic_clean_page_views from public,anon;
grant select on public.traffic_clean_page_views to authenticated;

create or replace function public.admin_traffic_summary_v2(p_days integer default 7) returns jsonb
language plpgsql stable security invoker set search_path='' as $$
declare start_at timestamptz; cutoff timestamptz:=now(); result jsonb;
begin
 if auth.uid() is null or not coalesce(public.is_admin(auth.uid()::text),false) then raise exception 'admin_only' using errcode='42501'; end if;
 if p_days not in(1,7,30,90) then raise exception 'invalid_period'; end if;
 start_at:=((now() at time zone 'Asia/Seoul')::date-(p_days-1))::timestamp at time zone 'Asia/Seoul';
 with raw as(select * from public.page_views where created_at>=start_at and created_at<=cutoff),
 clean as(select * from raw where private.traffic_included(visitor_id,owner_id,client_kind)),
 first_touch as(select distinct on(visitor_id) visitor_id,referrer from clean order by visitor_id,created_at,id),
 daily as(select (created_at at time zone 'Asia/Seoul')::date date,count(*) views,count(distinct visitor_id) visitors,
 count(distinct visitor_id) filter(where client_kind='browser' and (active_seconds>=10 or click_count>0)) engaged from clean group by 1),
 dates as(select (start_at at time zone 'Asia/Seoul')::date+n date from generate_series(0,p_days-1)n),
 sources as(select case when coalesce(referrer,'') in ('','직접 방문','직접 방문 / 출처 미상') then '직접 방문 / 출처 미상' else referrer end source,count(*) visitors from first_touch group by 1),
 source_views as(select case when coalesce(referrer,'') in ('','직접 방문','직접 방문 / 출처 미상') then '직접 방문 / 출처 미상' else referrer end source,count(*) views from clean group by 1),
 paths as(select coalesce(path,'이전 기록 · 페이지 미수집') path,count(*) views,count(distinct visitor_id) visitors from clean group by 1 order by views desc limit 15),
 campaigns as(select referrer source,utm_medium medium,utm_campaign campaign,count(*) views,count(distinct visitor_id) visitors from clean where coalesce(utm_campaign,'')<>'' group by 1,2,3 order by views desc limit 15),
 previous as(select * from public.traffic_clean_page_views where created_at>=start_at-make_interval(days=>p_days) and created_at<=cutoff-make_interval(days=>p_days))
 select jsonb_build_object('days',p_days,'from',start_at,'to',cutoff,'views',(select count(*) from clean),'visitors',(select count(distinct visitor_id) from clean),
 'raw_views',(select count(*) from raw),'excluded_views',(select count(*) from raw where not private.traffic_included(visitor_id,owner_id,client_kind)),
 'automation_views',(select count(*) from raw where client_kind='automation_signal'),
 'engaged_visitors',(select count(distinct visitor_id) from clean where client_kind='browser' and (active_seconds>=10 or click_count>0)),
 'unmeasured_views',(select count(*) from clean where client_kind='legacy'),
 'previous_views',(select count(*) from previous),'previous_visitors',(select count(distinct visitor_id) from previous),
 'daily',(select jsonb_agg(jsonb_build_object('date',dates.date,'views',coalesce(daily.views,0),'visitors',coalesce(daily.visitors,0),'engaged',coalesce(daily.engaged,0)) order by dates.date) from dates left join daily using(date)),
 'sources',coalesce((select jsonb_agg(jsonb_build_object('source',sources.source,'visitors',sources.visitors,'views',coalesce(source_views.views,0)) order by sources.visitors desc) from sources left join source_views using(source)),'[]'::jsonb),
 'paths',coalesce((select jsonb_agg(to_jsonb(paths)) from paths),'[]'::jsonb),'campaigns',coalesce((select jsonb_agg(to_jsonb(campaigns)) from campaigns),'[]'::jsonb)) into result;
 return result;
end $$;
revoke all on function public.admin_traffic_summary_v2(integer) from public,anon;
grant execute on function public.admin_traffic_summary_v2(integer) to authenticated;

-- Preserve old-client compatibility while excluding known internal browser IDs.
create or replace function public.record_page_view(p_visitor_id text,p_referrer text) returns void
language plpgsql security definer set search_path='' as $$
begin
 if p_visitor_id is null or p_visitor_id!~'^v[0-9]{10,16}[a-z0-9]{4,20}$' then raise exception 'invalid_visitor_id'; end if;
 if coalesce(public.is_admin(auth.uid()::text),false) then
  insert into private.traffic_exclusions(visitor_id,reason) values(p_visitor_id,'admin') on conflict(visitor_id) do nothing;
 end if;
 if exists(select 1 from private.traffic_exclusions where visitor_id=p_visitor_id) then return; end if;
 insert into public.page_views(visitor_id,referrer,owner_id) values(p_visitor_id,left(coalesce(nullif(btrim(p_referrer),''),'직접 방문'),240),auth.uid()::text);
end $$;
revoke all on function public.record_page_view(text,text) from public;
grant execute on function public.record_page_view(text,text) to anon,authenticated;
create or replace function public.record_presence(p_visitor_id text,p_page text) returns void
language plpgsql security definer set search_path='' as $$
begin
 if p_visitor_id is null or p_visitor_id!~'^v[0-9]{10,16}[a-z0-9]{4,20}$' then raise exception 'invalid_visitor_id'; end if;
 if coalesce(public.is_admin(auth.uid()::text),false) or exists(select 1 from private.traffic_exclusions where visitor_id=p_visitor_id) then return; end if;
 if p_page is null or length(p_page) not between 1 and 64 then raise exception 'invalid_page'; end if;
 insert into public.presence(visitor_id,last_seen,page) values(p_visitor_id,now(),p_page)
 on conflict(visitor_id) do update set last_seen=excluded.last_seen,page=excluded.page;
end $$;
revoke all on function public.record_presence(text,text) from public;
grant execute on function public.record_presence(text,text) to anon,authenticated;
create or replace function public.admin_live_traffic_count() returns bigint
language plpgsql stable security invoker set search_path='' as $$
declare result bigint;
begin
 if auth.uid() is null or not coalesce(public.is_admin(auth.uid()::text),false) then raise exception 'admin_only' using errcode='42501'; end if;
 select count(distinct visitor_id) into result from public.presence p where last_seen>now()-interval '5 minutes' and private.traffic_included(p.visitor_id,null,'browser') and not exists(select 1 from public.page_views v where v.visitor_id=p.visitor_id and v.client_kind='automation_signal' and v.created_at>now()-interval '5 minutes');
 return result;
end $$;
revoke all on function public.admin_live_traffic_count() from public,anon;
grant execute on function public.admin_live_traffic_count() to authenticated;
