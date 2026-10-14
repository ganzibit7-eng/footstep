-- Run after the event migration within BEGIN/ROLLBACK. All identities are fixtures.
do $$begin
 if exists(select 1 from auth.users where id::text like '7e141026-0000-4000-8000-%') then raise exception 'fixture_collision';end if;
end $$;
insert into auth.users(id,aud,role,email,email_confirmed_at,created_at,updated_at,raw_app_meta_data,raw_user_meta_data)
select ('7e141026-0000-4000-8000-00000000000'||n)::uuid,'authenticated','authenticated','event-fixture-'||n||'@example.invalid',now(),
 case when n=2 then now()-interval '2 hours' else now()-interval '20 minutes' end,now(),'{"provider":"email","providers":["email"]}'::jsonb,'{}'::jsonb from generate_series(1,4)n;
update auth.users set last_sign_in_at=now() where id::text like '7e141026-0000-4000-8000-%';
insert into auth.identities(provider_id,user_id,identity_data,provider,created_at,updated_at)
select 'contract-kakao-fixture-'||n,('7e141026-0000-4000-8000-00000000000'||n)::uuid,jsonb_build_object('sub','contract-kakao-fixture-'||n,'email_verified',true),'kakao',now(),now() from unnest(array[1,3])n;
insert into public.admins(owner_id,role) values('7e141026-0000-4000-8000-000000000004','admin');
update event_private.campaigns set enabled=true,opens_at=now()-interval '1 hour',closes_at=now()+interval '1 day',announces_at=now()+interval '2 days' where id='2026-10';
do $$begin
 if has_table_privilege('anon','event_private.entries','SELECT') or has_table_privilege('authenticated','event_private.entries','SELECT') then raise exception 'raw_entries_exposed';end if;
 if not (select relrowsecurity from pg_class where oid='event_private.entries'::regclass) then raise exception 'rls_missing';end if;
 if has_function_privilege('anon','public.enter_member_event(text,boolean,text)','EXECUTE') then raise exception 'anonymous_entry_allowed';end if;
end $$;
set local role anon;
select set_config('request.jwt.claims','{}',true);
do $$declare s jsonb;begin
 s:=public.member_event_status();
 if exists(select 1 from jsonb_array_elements(s->'campaigns') c where c->'my_entry'<>'null'::jsonb or jsonb_array_length(c->'winner_tickets')<>0) then raise exception 'guest_private_data_leak';end if;
end $$;
reset role;
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"7e141026-0000-4000-8000-000000000001","role":"authenticated"}',true);
do $$declare s jsonb;t text;begin
 begin perform public.enter_member_event('2026-10',false,'2026-10-14-v2-kakao');raise exception 'missing_consent_accepted';exception when others then if sqlerrm<>'event_consent_required' then raise;end if;end;
 s:=public.enter_member_event('2026-10',true,'2026-10-14-v2-kakao');t:=s->'campaigns'->0->'my_entry'->>'ticket';if t is null then raise exception 'entry_missing';end if;
 s:=public.enter_member_event('2026-10',true,'2026-10-14-v2-kakao');if t is distinct from s->'campaigns'->0->'my_entry'->>'ticket' then raise exception 'duplicate_entry';end if;
 begin perform public.admin_member_event_status();raise exception 'non_admin_access';exception when insufficient_privilege then null;end;
 begin perform public.admin_signup_members_v3(null,500);raise exception 'non_admin_roster_access';exception when insufficient_privilege then null;end;
 s:=public.withdraw_member_event('2026-10');if s->'campaigns'->0->'my_entry'<>'null'::jsonb then raise exception 'withdraw_failed';end if;
 perform public.enter_member_event('2026-10',true,'2026-10-14-v2-kakao');
 perform set_config('request.jwt.claims','{"sub":"7e141026-0000-4000-8000-000000000002","role":"authenticated"}',true);
 s:=public.member_event_status();if s->'campaigns'->0->'my_entry'<>'null'::jsonb then raise exception 'cross_user_entry_leak';end if;
 begin perform public.enter_member_event('2026-10',true,'2026-10-14-v2-kakao');raise exception 'old_signup_accepted';exception when others then if sqlerrm<>'event_signup_outside' then raise;end if;end;
 perform set_config('request.jwt.claims','{"sub":"7e141026-0000-4000-8000-000000000003","role":"authenticated"}',true);
 perform public.enter_member_event('2026-10',true,'2026-10-14-v2-kakao');
 perform set_config('request.jwt.claims','{"sub":"7e141026-0000-4000-8000-000000000004","role":"authenticated"}',true);
 if not exists(select 1 from public.admin_signup_members_v3(null,500) m where m.owner_id='7e141026-0000-4000-8000-000000000001' and jsonb_array_length(m.event_entries)=1) then raise exception 'member_event_badge_missing';end if;
 begin perform public.admin_draw_member_event('2026-10');raise exception 'early_draw_accepted';exception when others then if sqlerrm<>'event_draw_too_early' then raise;end if;end;
end $$;
reset role;
update event_private.campaigns set closes_at=now()-interval '2 seconds',announces_at=now()+interval '1 day' where id='2026-10';
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"7e141026-0000-4000-8000-000000000004","role":"authenticated"}',true);
do $$declare s jsonb;first_result jsonb;begin
 s:=public.admin_draw_member_event('2026-10');first_result:=s->'campaigns'->0->'winners';
 if jsonb_array_length(first_result)<>1 then raise exception 'wrong_winner_count';end if;
 s:=public.admin_draw_member_event('2026-10');if first_result<>s->'campaigns'->0->'winners' then raise exception 'redraw_changed_winner';end if;
 s:=public.member_event_status();if jsonb_array_length(s->'campaigns'->0->'winner_tickets')<>0 then raise exception 'early_winner_publication';end if;
end $$;
reset role;
update event_private.campaigns set announces_at=now()-interval '1 second' where id='2026-10';
select set_config('request.jwt.claims',jsonb_build_object('sub',(select user_id::text from event_private.entries where winner),'role','authenticated')::text,true);
set local role authenticated;
do $$declare s jsonb;begin
 s:=public.member_event_status();if jsonb_array_length(s->'campaigns'->0->'winner_tickets')<>1 or not (s->'campaigns'->0->'my_entry'->>'winner')::boolean then raise exception 'published_result_missing';end if;
 s:=public.claim_member_event('2026-10');if not (s->'campaigns'->0->'my_entry'->>'claim_requested')::boolean then raise exception 'claim_missing';end if;
 begin perform public.enter_member_event('2026-10',true,'2026-10-14-v2-kakao');raise exception 'late_entry_accepted';exception when others then if sqlerrm<>'event_not_open' then raise;end if;end;
end $$;
reset role;
update event_private.campaigns set opens_at=now()-interval '100 days',closes_at=now()-interval '92 days',announces_at=now()-interval '91 days' where id='2026-10';
do $$declare cmd text;begin
 select command into cmd from cron.job where jobname='member-event-retention';execute cmd;
 if exists(select 1 from event_private.entries where campaign_id='2026-10') then raise exception 'retention_failed';end if;
end $$;

