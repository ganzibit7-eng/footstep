-- Noise filtering and notification tests. All fixture writes roll back.
begin;
do $$declare before_events bigint; before_alerts bigint; admin_count integer; i integer; sample_admin uuid; summary jsonb;
begin
 select count(*) into before_events from private.security_events;
 select count(*) into before_alerts from public.notifications where type='security';
 foreach i in array array[1,2,3] loop
  assert public.record_security_event('browser',(array['script_policy_block','auth_failed','auth_rate_limited'])[i],null,repeat('b',64),'/');
 end loop;
 assert (select count(*) from private.security_events)=before_events,'generic noise was stored';
 assert (select count(*) from public.notifications where type='security')=before_alerts,'generic noise notified';
 perform public.record_security_event('browser','external_script_block',null,repeat('c',64),'/');
 assert exists(select 1 from private.security_events where subject_hash=repeat('c',64) and event='external_script_block' and severity='info'),'qualified signal lost';
 perform public.record_security_event('server','invalid_session',null,repeat('d',64),'/');
 assert (select count(*) from public.notifications where type='security')=before_alerts,'browser or expired session alerted';
 select count(*),min(u.id::text)::uuid into admin_count,sample_admin from auth.users u where public.is_admin(u.id::text);
 assert admin_count>0,'administrator missing';
 insert into private.security_alert_state(source,event,last_notified_at) values('server','admin_access_denied',now()-interval '31 minutes') on conflict(source,event) do update set last_notified_at=excluded.last_notified_at;
 perform public.record_security_event('server','admin_access_denied',null,repeat('e',64),'/');
 assert (select count(*) from public.notifications where type='security')=before_alerts+admin_count,'critical alert lost';
 perform public.record_security_event('server','admin_access_denied',null,repeat('f',64),'/');
 assert (select count(*) from public.notifications where type='security')=before_alerts+admin_count,'cooldown broken';
 perform set_config('request.jwt.claims',json_build_object('sub',sample_admin,'role','authenticated')::text,true);
 summary:=public.admin_security_summary(7);
 assert not exists(select 1 from jsonb_array_elements(summary->'events') e where e->>'event' in ('script_policy_block','auth_failed','invalid_session','account_deleted')),'noise in panel';
 assert exists(select 1 from jsonb_array_elements(summary->'events') e where e->>'event'='external_script_block'),'qualified signal missing from panel';
end $$;
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"f0000000-0000-4000-8000-000000000021","role":"authenticated"}',true);
do $$begin
 begin perform public.record_security_event('server','admin_access_denied',null,repeat('7',64),'/');raise exception 'member injected event';exception when insufficient_privilege then null;end;
 begin perform public.admin_security_summary(1);raise exception 'member read events';exception when insufficient_privilege then null;end;
end $$;
rollback;
select 'PASS: noise ignored, qualified signal retained, critical alerts/cooldown preserved, panel filtered, member access denied; all fixtures rolled back' verified;
