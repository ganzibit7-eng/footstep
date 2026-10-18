-- Generic browser CSP reports are not incident evidence. Preserve old records for retention, hide noise from the panel.
create or replace function public.record_security_event(p_source text,p_event text,p_actor_id uuid,p_subject_hash text,p_path text default '/')
returns boolean language plpgsql security definer set search_path='' as $$
begin
 if p_source is null or p_event is null or p_subject_hash is null or p_source not in ('server','browser') or p_subject_hash !~ '^[a-f0-9]{64}$'
 or p_event not in ('auth_failed','auth_rate_limited','script_policy_block','external_script_block','suspicious_route','admin_access_denied','invalid_session','invalid_request','account_deleted','account_delete_failed','submission_guard') then return false; end if;
 if p_source='browser' and p_event in ('script_policy_block','auth_failed','auth_rate_limited') then return true; end if;
 if p_source='browser' and p_event not in ('external_script_block','suspicious_route','admin_access_denied') then return false; end if;
 perform pg_advisory_xact_lock(hashtext('balzaguk_security_events'));
 -- Server timestamp/labels, bounded storage and atomic per-subject throttling.
 if (select count(*) from private.security_events where subject_hash=p_subject_hash and created_at>now()-interval '1 minute')>=10
 or (select count(*) from private.security_events where source=p_source and created_at>now()-interval '1 day')>=(case when p_source='browser' then 2000 else 10000 end) then return false; end if;
 delete from private.security_events where id in (select id from private.security_events where created_at<now()-interval '30 days' limit 100);
 insert into private.security_events(source,event,actor_id,subject_hash,path,severity)
 values(p_source,p_event,p_actor_id,p_subject_hash,
 case when p_path ~ '^/[A-Za-z0-9/_\.\-]{0,180}$' then p_path else '/' end,
 case when p_source='server' and p_event in ('admin_access_denied','submission_guard','account_delete_failed') then 'warning' else 'info' end);
 return true;
end $$;

create or replace function public.admin_security_summary(p_days integer default 7)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare result jsonb;
begin
 if auth.uid() is null or not coalesce(public.is_admin(auth.uid()::text),false) then raise exception 'admin_only' using errcode='42501'; end if;
 select jsonb_build_object('server_count',count(*) filter(where source='server'),
 'browser_count',count(*) filter(where source='browser'),
 'events',coalesce((select jsonb_agg(to_jsonb(e)) from
 (select id,created_at,source,event,severity,path,actor_id from private.security_events
 where ((source='server' and event in ('admin_access_denied','submission_guard','account_delete_failed')) or (source='browser' and event in ('external_script_block','suspicious_route','admin_access_denied'))) and created_at>=now()-make_interval(days=>greatest(1,least(coalesce(p_days,7),30))) order by created_at desc limit 100)e),'[]'::jsonb)) into result
 from private.security_events where ((source='server' and event in ('admin_access_denied','submission_guard','account_delete_failed')) or (source='browser' and event in ('external_script_block','suspicious_route','admin_access_denied'))) and created_at>=now()-make_interval(days=>greatest(1,least(coalesce(p_days,7),30)));
 return result;
end $$;

create or replace function private.notify_security_anomaly() returns trigger
language plpgsql security definer set search_path='' as $$
declare n integer; threshold integer; label text; recipient text; stamp timestamptz;
begin
 if new.source<>'server' or new.severity<>'warning' or new.event not in ('admin_access_denied','submission_guard','account_delete_failed') then return new; end if;
 threshold := case when new.source='browser' then 5
   when new.event in ('admin_access_denied','submission_guard','account_delete_failed') then 1
   when new.event='auth_failed' then 5 else 3 end;
 select count(*) into n from private.security_events
 where source=new.source and event=new.event and created_at>=new.created_at-interval '10 minutes';
 if n<threshold then return new; end if;
 -- ON CONFLICT makes the 30-minute global cooldown atomic across concurrent requests.
 insert into private.security_alert_state(source,event,last_notified_at)
 values(new.source,new.event,new.created_at)
 on conflict(source,event) do update set last_notified_at=excluded.last_notified_at
 where private.security_alert_state.last_notified_at<=excluded.last_notified_at-interval '30 minutes'
 returning last_notified_at into stamp;
 if stamp is null then return new; end if;
 label := case new.event
 when 'auth_failed' then '로그인 요청 실패' when 'auth_rate_limited' then '인증 요청 제한'
 when 'script_policy_block' then '스크립트 정책 차단' when 'suspicious_route' then '의심 경로 접근'
 when 'admin_access_denied' then '관리자 권한 거절' when 'invalid_session' then '민감 작업 세션 오류'
 when 'invalid_request' then '잘못된 민감 작업 요청' when 'account_delete_failed' then '계정 삭제 처리 실패'
 when 'submission_guard' then '등록 승인 우회 방지' else '기타 보안 신호' end;
 for recipient in select u.id::text from auth.users u where public.is_admin(u.id::text) loop
  insert into public.notifications(owner_id,type,message) values(recipient,'security',
   '⚠️ 보안 알림 · '||case when new.source='server' then '서버 기록' else '브라우저 보고(미확인)' end
   ||' · '||label||' · 최근 10분 '||n||'건. 관리자 보안 기록을 확인해 주세요.');
 end loop;
 return new;
end $$;

-- Acknowledge old generic CSP alerts; keep messages and events for review.
update public.notifications set read=true where type='security' and not read and message like '%브라우저 보고%' and message like '%스크립트 정책 차단%';
