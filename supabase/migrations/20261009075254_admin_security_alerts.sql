-- Server-generated, bounded in-app alerts; browser reports remain unverified.
create table private.security_alert_state (
 source text not null, event text not null, last_notified_at timestamptz not null,
 primary key(source,event)
);
alter table private.security_alert_state enable row level security;
revoke all on private.security_alert_state from public,anon,authenticated;
create index security_events_alert_window on private.security_events(source,event,created_at desc);

create function private.notify_security_anomaly() returns trigger
language plpgsql security definer set search_path='' as $$
declare n integer; threshold integer; label text; recipient text; stamp timestamptz;
begin
 if new.severity<>'warning' then return new; end if;
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
revoke all on function private.notify_security_anomaly() from public,anon,authenticated;
create trigger security_anomaly_notification after insert on private.security_events
for each row execute function private.notify_security_anomaly();
