-- Affiliate clicks are site-side interaction reports, not purchases or Coupang reports.
create table private.affiliate_links(
 link_id text primary key, product_id text not null, title text not null,
 url text not null unique check(url ~ '^https://link[.]coupang[.]com/a/[A-Za-z0-9]+$'),
 started_at timestamptz not null default now()
);
insert into private.affiliate_links(link_id,product_id,title,url) values
 ('hHjJ8nlsJg','waste-bags','코멧 펫 배변봉투 리필형','https://link.coupang.com/a/hHjJ8nlsJg'),
 ('hHjPJ6DMUS','water-bottle','딩동펫 버튼식 물병 + 풉백','https://link.coupang.com/a/hHjPJ6DMUS'),
 ('hHjVHyyABU','harness-leash','베니즈 베이직 하네스 + 리드줄','https://link.coupang.com/a/hHjVHyyABU');
create table private.affiliate_clicks(
 event_id uuid primary key, created_at timestamptz not null default now(),
 link_id text not null references private.affiliate_links(link_id),
 visitor_id text not null, actor_id uuid references auth.users(id) on delete cascade,
 path text not null, section text not null, placement text not null,
 source text not null, browser text not null, device text not null, client_kind text not null
);
create index affiliate_clicks_created on private.affiliate_clicks(created_at desc,event_id);
create index affiliate_clicks_visitor_created on private.affiliate_clicks(visitor_id,created_at desc);
create index affiliate_clicks_actor on private.affiliate_clicks(actor_id) where actor_id is not null;
create index affiliate_clicks_link_created on private.affiliate_clicks(link_id,created_at desc);
alter table private.affiliate_links enable row level security;
alter table private.affiliate_clicks enable row level security;
revoke all on private.affiliate_links,private.affiliate_clicks from public,anon,authenticated;
grant usage on schema private to authenticated;
grant select on private.affiliate_links,private.affiliate_clicks to authenticated;
create policy affiliate_links_admin on private.affiliate_links for select to authenticated
 using((select public.is_admin(auth.uid()::text)));
create policy affiliate_clicks_admin on private.affiliate_clicks for select to authenticated
 using((select public.is_admin(auth.uid()::text)));

create function private.record_affiliate_click(p_payload jsonb) returns jsonb
language plpgsql security definer set search_path='' as $$
declare vid text:=p_payload->>'visitor_id'; uid uuid:=auth.uid(); tok uuid;
 link text; h jsonb; ua text; kind text; br text; dev text; loc text:=p_payload->>'path';
begin
 if p_payload is null or octet_length(p_payload::text)>2048 or vid is null
 or vid!~'^v[0-9]{10,16}[a-z0-9]{4,20}$' then raise exception 'invalid_payload'; end if;
 tok:=(p_payload->>'event_id')::uuid;
 if tok is null or loc is null or length(loc)>180 or loc!~'^/[A-Za-z0-9/_-]*([.]html)?$'
 or coalesce(p_payload->>'section','')!~'^[a-z_-]{1,32}$'
 or coalesce(p_payload->>'placement','') not in ('home-walk-shopping') then raise exception 'invalid_context'; end if;
 select link_id into link from private.affiliate_links
 where product_id=p_payload->>'product_id' and url=p_payload->>'url';
 if link is null then raise exception 'unknown_affiliate_link'; end if;
 if coalesce(public.is_admin(uid::text),false)
 or exists(select 1 from private.traffic_exclusions where visitor_id=vid)
 or exists(select 1 from private.account_deletion_jobs where user_id=uid)
 then return jsonb_build_object('excluded',true); end if;
 -- Serialize the per-visitor limit; duplicate retries remain idempotent.
 perform pg_advisory_xact_lock(hashtextextended('affiliate:'||vid,0));
 if exists(select 1 from private.affiliate_clicks where event_id=tok) then return jsonb_build_object('duplicate',true); end if;
 if (select count(*) from private.affiliate_clicks where visitor_id=vid and created_at>now()-interval '1 minute')>=10
 or (select count(*) from private.affiliate_clicks where visitor_id=vid and created_at>now()-interval '1 day')>=240
 then return jsonb_build_object('limited',true); end if;
 h:=coalesce(nullif(current_setting('request.headers',true),''),'{}')::jsonb;ua:=coalesce(h->>'user-agent','');
 kind:=private.traffic_client_kind(ua,coalesce((p_payload->>'automated')::boolean,false));
 br:=case when ua~*'Edg/' then 'Edge' when ua~*'SamsungBrowser' then 'Samsung Internet'
 when ua~*'Firefox|FxiOS' then 'Firefox' when ua~*'Chrome|CriOS' then 'Chrome'
 when ua~*'Safari' then 'Safari' else '기타 / 미확인' end;
 dev:=case when ua~*'iPhone|iPad|iPod' then 'iOS' when ua~*'Android' then 'Android'
 when ua~*'Windows' then 'Windows' when ua~*'Macintosh' then 'macOS' when ua~*'Linux' then 'Linux' else '미확인' end;
 insert into private.affiliate_clicks(event_id,link_id,visitor_id,actor_id,path,section,placement,source,browser,device,client_kind)
 values(tok,link,vid,uid,loc,p_payload->>'section',p_payload->>'placement',
 left(coalesce(nullif(p_payload->>'source',''),'직접 방문 / 출처 미상'),120),br,dev,kind);
 return jsonb_build_object('recorded',true);
end $$;
revoke all on function private.record_affiliate_click(jsonb) from public;
grant usage on schema private to anon;
grant execute on function private.record_affiliate_click(jsonb) to anon,authenticated;
create function public.record_affiliate_click(p_payload jsonb) returns jsonb
language sql set search_path='' as $$select private.record_affiliate_click(p_payload);$$;
revoke all on function public.record_affiliate_click(jsonb) from public;
grant execute on function public.record_affiliate_click(jsonb) to anon,authenticated;

create function public.admin_affiliate_summary(
 p_from date default null,p_to date default null,p_link text default null,
 p_audience text default 'all',p_include_excluded boolean default false,
 p_event_page integer default 1,p_visitor_page integer default 1,p_cutoff timestamptz default null
) returns jsonb language plpgsql stable set search_path='' as $$
declare f date:=coalesce(p_from,(now() at time zone 'Asia/Seoul')::date);
 t date:=coalesce(p_to,(now() at time zone 'Asia/Seoul')::date);result jsonb;
 cutoff timestamptz:=least(now(),coalesce(p_cutoff,now()));
begin
 if auth.uid() is null or not coalesce(public.is_admin(auth.uid()::text),false) then raise exception 'admin_only' using errcode='42501'; end if;
 if t<f or t-f>89 or p_audience not in ('all','member','anonymous')
 or p_event_page not between 1 and 100000 or p_visitor_page not between 1 and 100000 then raise exception 'invalid_filter'; end if;
 with raw as materialized(
 select c.*,l.title,l.url,l.product_id,
 private.traffic_included(c.visitor_id,c.actor_id::text,c.client_kind) included,
 '방문자-'||substr(encode(extensions.digest(c.visitor_id,'sha256'),'hex'),1,12) alias,
 case when c.actor_id is null then 'v:'||c.visitor_id else 'u:'||c.actor_id::text end person_key,
 p.nickname
 from private.affiliate_clicks c join private.affiliate_links l using(link_id)
 left join public.profiles p on p.owner_id=c.actor_id::text
 where c.created_at>=f::timestamp at time zone 'Asia/Seoul' and c.created_at<(t+1)::timestamp at time zone 'Asia/Seoul'
 and c.created_at<=cutoff
 and (p_link is null or c.link_id=p_link)
 and (p_audience='all' or (p_audience='member' and c.actor_id is not null) or (p_audience='anonymous' and c.actor_id is null))
 ), chosen as materialized(select * from raw where included or coalesce(p_include_excluded,false)),
 products as(select l.link_id,l.title,l.url,l.product_id,count(c.event_id) clicks,count(distinct c.visitor_id) visitors,
 count(distinct c.actor_id) members,max(c.created_at) last_at from private.affiliate_links l
 left join chosen c using(link_id) where p_link is null or l.link_id=p_link group by l.link_id),
 people as(select person_key,actor_id,max(nickname) nickname,min(alias) alias,
 count(*) clicks,count(distinct visitor_id) browsers,min(created_at) first_at,max(created_at) last_at,
 jsonb_agg(distinct jsonb_build_object('title',title,'link_id',link_id)) products
 from chosen group by person_key,actor_id),
 events as(select event_id,created_at,link_id,title,url,actor_id,nickname,alias,path,section,placement,source,browser,device,included
 from chosen order by created_at desc,event_id desc limit 50 offset (p_event_page-1)*50),
 people_page as(select actor_id,nickname,alias,clicks,browsers,first_at,last_at,products from people
 order by last_at desc,person_key limit 20 offset (p_visitor_page-1)*20),
 daily as(select (created_at at time zone 'Asia/Seoul')::date date,count(*) clicks,count(distinct visitor_id) visitors from chosen group by 1),
 dates as(select f+n date from generate_series(0,t-f)n),
 sources as(select source,count(*) clicks,count(distinct visitor_id) visitors from chosen group by source order by clicks desc limit 30),
 placements as(select path,section,placement,count(*) clicks,count(distinct visitor_id) visitors from chosen group by path,section,placement order by clicks desc limit 30)
 select jsonb_build_object('from',f,'to',t,'as_of',cutoff,'tracking_started_at',(select min(started_at) from private.affiliate_links),
 'clicks',(select count(*) from chosen),'visitors',(select count(distinct visitor_id) from chosen),
 'members',(select count(distinct actor_id) from chosen),'anonymous_browsers',(select count(distinct visitor_id) from chosen where actor_id is null),
 'raw_clicks',(select count(*) from raw),'excluded_clicks',(select count(*) from raw where not included),
 'people_total',(select count(*) from people),'event_page',p_event_page,'visitor_page',p_visitor_page,
 'products',coalesce((select jsonb_agg(to_jsonb(products) order by clicks desc,link_id) from products),'[]'::jsonb),
 'catalog',(select jsonb_agg(jsonb_build_object('link_id',link_id,'title',title) order by link_id) from private.affiliate_links),
 'events',coalesce((select jsonb_agg(to_jsonb(events) order by created_at desc,event_id desc) from events),'[]'::jsonb),
 'people',coalesce((select jsonb_agg(to_jsonb(people_page) order by last_at desc) from people_page),'[]'::jsonb),
 'daily',(select jsonb_agg(jsonb_build_object('date',dates.date,'clicks',coalesce(daily.clicks,0),'visitors',coalesce(daily.visitors,0)) order by dates.date) from dates left join daily using(date)),
 'sources',coalesce((select jsonb_agg(to_jsonb(sources) order by clicks desc) from sources),'[]'::jsonb),
 'placements',coalesce((select jsonb_agg(to_jsonb(placements) order by clicks desc) from placements),'[]'::jsonb)) into result;
 return result;
end $$;
revoke all on function public.admin_affiliate_summary(date,date,text,text,boolean,integer,integer,timestamptz) from public,anon;
grant execute on function public.admin_affiliate_summary(date,date,text,text,boolean,integer,integer,timestamptz) to authenticated;
select cron.schedule('affiliate-click-retention','35 18 * * *',
 $$delete from private.affiliate_clicks where created_at < now()-interval '90 days'$$);
