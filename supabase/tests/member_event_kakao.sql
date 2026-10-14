-- Run inside BEGIN/ROLLBACK. Synthetic users only; no real entries changed.
do $$begin
 if exists(select 1 from auth.users where id::text like '8e141026-0000-4000-8000-%') then raise exception 'fixture_collision';end if;
end $$;
insert into auth.users(id,aud,role,email,email_confirmed_at,created_at,updated_at,raw_app_meta_data,raw_user_meta_data)
select ('8e141026-0000-4000-8000-00000000000'||n)::uuid,'authenticated','authenticated','kakao-event-fixture-'||n||'@example.invalid',now(),now()-interval '20 minutes',now(),'{}'::jsonb,'{"provider":"kakao"}'::jsonb from generate_series(1,3)n;
update event_private.campaigns set enabled=true,opens_at=now()-interval '1 hour',closes_at=now()+interval '1 day',announces_at=now()+interval '2 days' where id='2026-10';
-- Previously accepted email entry remains visible and can be replayed safely.
insert into event_private.entries(campaign_id,user_id,consent_version) values('2026-10','8e141026-0000-4000-8000-000000000002','2026-10-14-v1');
do $$begin
 if has_table_privilege('authenticated','event_private.kakao_participation','SELECT') or has_table_privilege('anon','event_private.kakao_hash_key','SELECT') then raise exception 'private_record_exposed';end if;
 if has_function_privilege('authenticated','event_private.kakao_key(uuid)','EXECUTE') then raise exception 'hash_oracle_exposed';end if;
end $$;
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"8e141026-0000-4000-8000-000000000001","role":"authenticated"}',true);
do $$declare s jsonb;begin
 s:=public.member_event_status();
 if s->'campaigns'->0->>'eligibility'<>'kakao_required' then raise exception 'metadata_spoof_passed';end if;
 begin perform public.enter_member_event('2026-10',true,'2026-10-14-v2-kakao');raise exception 'email_entry_allowed';exception when others then if sqlerrm<>'event_kakao_required' then raise;end if;end;
 begin perform public.enter_member_event('2026-10',true,'2026-10-14-v1');raise exception 'old_consent_allowed';exception when others then if sqlerrm<>'event_consent_required' then raise;end if;end;
 perform set_config('request.jwt.claims','{"sub":"8e141026-0000-4000-8000-000000000002","role":"authenticated"}',true);
 s:=public.enter_member_event('2026-10',true,'2026-10-14-v2-kakao');
 if s->'campaigns'->0->'my_entry'->>'ticket' is null then raise exception 'grandfather_entry_lost';end if;
end $$;
reset role;
insert into auth.identities(provider_id,user_id,identity_data,provider,created_at,updated_at) values('kakao-event-fixture-subject','8e141026-0000-4000-8000-000000000001','{"sub":"kakao-event-fixture-subject","email_verified":true}'::jsonb,'kakao',now(),now());
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"8e141026-0000-4000-8000-000000000001","role":"authenticated"}',true);
do $$declare s jsonb;t text;begin
 s:=public.enter_member_event('2026-10',true,'2026-10-14-v2-kakao');t:=s->'campaigns'->0->'my_entry'->>'ticket';
 if t is null then raise exception 'kakao_entry_missing';end if;
 s:=public.enter_member_event('2026-10',true,'2026-10-14-v2-kakao');
 if s->'campaigns'->0->'my_entry'->>'ticket' is distinct from t then raise exception 'duplicate_ticket';end if;
 perform public.withdraw_member_event('2026-10');
 s:=public.enter_member_event('2026-10',true,'2026-10-14-v2-kakao');
 if s->'campaigns'->0->'my_entry'->>'ticket' is null then raise exception 'same_member_reentry_failed';end if;
end $$;
reset role;
delete from auth.users where id='8e141026-0000-4000-8000-000000000001';
insert into auth.identities(provider_id,user_id,identity_data,provider,created_at,updated_at) values('kakao-event-fixture-subject','8e141026-0000-4000-8000-000000000003','{"sub":"kakao-event-fixture-subject","email_verified":true}'::jsonb,'kakao',now(),now());
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"8e141026-0000-4000-8000-000000000003","role":"authenticated"}',true);
do $$declare s jsonb;begin
 s:=public.member_event_status();
 if s->'campaigns'->0->>'eligibility'<>'already_participated' then raise exception 'recreated_account_not_detected';end if;
 begin perform public.enter_member_event('2026-10',true,'2026-10-14-v2-kakao');raise exception 'recreated_account_allowed';exception when others then if sqlerrm<>'event_already_participated' then raise;end if;end;
 if s::text like '%subject_hash%' or s::text like '%secret%' then raise exception 'private_hash_leak';end if;
end $$;
reset role;
update event_private.kakao_participation set expires_at=now()-interval '1 second' where user_id='8e141026-0000-4000-8000-000000000001';
do $$declare cmd text;begin
 select command into cmd from cron.job where jobname='member-event-kakao-retention';execute cmd;
 if exists(select 1 from event_private.kakao_participation where user_id='8e141026-0000-4000-8000-000000000001') then raise exception 'retention_failed';end if;
end $$;
