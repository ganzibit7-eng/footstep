-- Existing visit token, exclusions, rate bound, privacy choices and classification retained.
-- Add two bounded destination counters to the existing action_counts JSON only.
CREATE OR REPLACE FUNCTION private.record_traffic_visit(p_payload jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
 vid text:=p_payload->>'visitor_id'; tok uuid; loc text:=p_payload->>'path';
 uid text:=auth.uid()::text; headers jsonb; automated boolean; kind text; n integer;
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
 kind:=private.traffic_client_kind(headers->>'user-agent',coalesce((p_payload->>'automated')::boolean,false));
 automated:=kind<>'browser';
 a:=least(86400,greatest(0,coalesce((p_payload->>'active_seconds')::integer,0)));
 c:=least(1000,greatest(0,coalesce((p_payload->>'clicks')::integer,0)));
 d:=least(100,greatest(0,coalesce((p_payload->>'depth')::integer,0)));
 foreach key in array array['link','button','search','navigation','ad_banner','trip'] loop
  counts:=counts||jsonb_build_object(key,least(1000,greatest(0,coalesce((p_payload->'actions'->>key)::integer,0))));
 end loop;
 -- Bound per-browser creation volume; pings update the same token, never add views.
 if not exists(select 1 from public.page_views where view_token=tok) then
  select count(*) into n from public.page_views where visitor_id=vid and created_at>now()-interval '1 hour';
  if n>=120 then return jsonb_build_object('limited',true); end if;
 end if;
 insert into public.page_views(visitor_id,owner_id,referrer,view_token,path,last_page,utm_medium,utm_campaign,client_kind,last_event_at)
 values(vid,uid,left(coalesce(nullif(p_payload->>'source',''),'직접 방문 / 출처 미상'),120),tok,loc,left(coalesce(p_payload->>'page',loc),180),
 left(p_payload->>'medium',80),left(p_payload->>'campaign',80),kind,now())
 on conflict(view_token) where view_token is not null do nothing;
 update public.page_views set
  active_seconds=greatest(active_seconds,least(a,greatest(0,extract(epoch from now()-created_at)::integer+2))),
  click_count=greatest(click_count,c),scroll_depth=greatest(scroll_depth,d),action_counts=private.commercial_actions(action_counts,counts,(now() AT TIME ZONE 'Asia/Seoul')::date),
  last_page=left(coalesce(p_payload->>'page',loc),180),last_event_at=now(),owner_id=coalesce(owner_id,uid),
  client_kind=case when automated then kind else client_kind end
 where view_token=tok and visitor_id=vid and path=loc and created_at>now()-interval '1 day';
 return jsonb_build_object('excluded',automated);
end $function$


