-- Server alert thresholds, cooldown, recipients and RLS. Everything rolls back.
begin;
delete from private.security_events where event in ('admin_access_denied','auth_failed','suspicious_route','account_deleted');
delete from private.security_alert_state;
delete from public.notifications where type='security';
insert into auth.users(id,aud,role,email) values('f0000000-0000-4000-8000-000000000021','authenticated','authenticated','security-test@example.invalid');
do $$declare admins integer; n integer; i integer;
begin
 select count(*) into admins from auth.users u where public.is_admin(u.id::text);
 assert admins>0,'administrator missing';
 perform public.record_security_event('server','account_deleted',null,repeat('1',64),'/');
 assert (select count(*) from public.notifications where type='security')=0,'info event alerted';
 perform public.record_security_event('server','admin_access_denied',null,repeat('2',64),'/');
 assert (select count(*) from public.notifications where type='security')=admins,'server immediate alert failed';
 perform public.record_security_event('server','admin_access_denied',null,repeat('3',64),'/');
 assert (select count(*) from public.notifications where type='security')=admins,'duplicate alert';
 for i in 1..4 loop
  perform public.record_security_event('server','auth_failed',null,repeat('4',64),'/');
 end loop;
 assert (select count(*) from public.notifications where type='security')=admins,'login failure alerted too soon';
 perform public.record_security_event('server','auth_failed',null,repeat('4',64),'/');
 assert (select count(*) from public.notifications where type='security')=admins*2,'login failure threshold failed';
 for i in 1..5 loop
  perform public.record_security_event('browser','suspicious_route',null,repeat('5',64),'/');
 end loop;
 assert (select count(*) from public.notifications where type='security')=admins*3,'browser threshold failed';
 assert not exists(select 1 from public.notifications where type='security' and not public.is_admin(owner_id)),'nonadmin recipient';
 assert exists(select 1 from public.notifications where message like '%미확인%'),'browser report not labeled';
 update private.security_alert_state set last_notified_at=now()-interval '31 minutes' where event='admin_access_denied';
 perform public.record_security_event('server','admin_access_denied',null,repeat('6',64),'/');
 assert (select count(*) from public.notifications where type='security')=admins*4,'cooldown never reset';
end $$;
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"f0000000-0000-4000-8000-000000000021","role":"authenticated"}',true);
do $$begin
 assert (select count(*) from public.notifications where type='security')=0,'member read admin alerts';
 begin perform public.record_security_event('server','admin_access_denied',null,repeat('7',64),'/');raise exception 'member injected event';exception when insufficient_privilege then null;end;
 begin perform private.notify_security_anomaly();raise exception 'member invoked trigger';exception when insufficient_privilege then null;end;
end $$;
select set_config('request.jwt.claims','{"sub":"f5cbbb53-cdc8-4c05-8772-1309271b0681","role":"authenticated"}',true);
do $$begin
 assert (select count(*) from public.notifications where type='security')=4,'admin cannot read own alerts';
 assert public.admin_security_summary(1) is not null;
end $$;
rollback;
