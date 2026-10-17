-- No email is sent. All fixture users and ledger rows are rolled back.
begin;
do $$begin
 if exists(select 1 from auth.users where id::text like '8b171026-0000-4000-8000-%') then raise exception 'fixture_collision';end if;
end $$;
insert into auth.users(id,aud,role,email,email_confirmed_at,is_anonymous,created_at,updated_at,raw_app_meta_data,raw_user_meta_data)
values('8b171026-0000-4000-8000-000000000001','authenticated','authenticated','points-verified@example.invalid',now(),false,now(),now(),'{}','{}'),
 ('8b171026-0000-4000-8000-000000000002','authenticated','authenticated','points-unverified@example.invalid',null,false,now(),now(),'{}','{}'),
 ('8b171026-0000-4000-8000-000000000003','authenticated','authenticated','points-anonymous@example.invalid',now(),true,now(),now(),'{}','{}');
do $$begin
 if (select count(*) from public.points_log where owner_id='8b171026-0000-4000-8000-000000000001' and reason='회원가입 축하 포인트' and amount=100)<>1 then raise exception 'signup_trigger_failed';end if;
 if exists(select 1 from public.points_log where owner_id in('8b171026-0000-4000-8000-000000000002','8b171026-0000-4000-8000-000000000003')) then raise exception 'unverified_or_anonymous_rewarded';end if;
 begin
  insert into public.points_log(owner_id,amount,reason) values('8b171026-0000-4000-8000-000000000001',100,'회원가입 축하 포인트');
  raise exception 'duplicate_ledger_row_allowed';
 exception when unique_violation then null;end;
end $$;
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"8b171026-0000-4000-8000-000000000001","role":"authenticated"}',true);
do $$begin
 if (public.claim_points('회원가입 축하 포인트')->>'awarded')::boolean then raise exception 'duplicate_rpc_reward';end if;
 if (public.claim_points('코스 등록')->>'awarded')::boolean then raise exception 'unearned_other_reward';end if;
 if has_function_privilege('authenticated','private.ensure_signup_points(uuid)','EXECUTE') then raise exception 'private_function_exposed';end if;
end $$;
select set_config('request.jwt.claims','{"sub":"8b171026-0000-4000-8000-000000000002","role":"authenticated"}',true);
do $$begin
 if (public.claim_points('회원가입 축하 포인트')->>'awarded')::boolean then raise exception 'unverified_rpc_reward';end if;
end $$;
select set_config('request.jwt.claims','{"sub":"8b171026-0000-4000-8000-000000000003","role":"authenticated"}',true);
do $$begin
 if (public.claim_points('회원가입 축하 포인트')->>'awarded')::boolean then raise exception 'anonymous_rpc_reward';end if;
end $$;
reset role;
update auth.users set email_confirmed_at=now() where id='8b171026-0000-4000-8000-000000000002';
update auth.users set email_confirmed_at=now() where id='8b171026-0000-4000-8000-000000000002';
do $$begin
 if (select count(*) from public.points_log where owner_id='8b171026-0000-4000-8000-000000000002' and reason='회원가입 축하 포인트')<>1 then raise exception 'confirmation_update_not_exactly_once';end if;
end $$;
set local role anon;
do $$begin
 begin perform public.claim_points('회원가입 축하 포인트');raise exception 'guest_rpc_allowed';exception when insufficient_privilege then null;end;
end $$;
reset role;
rollback;
select 'PASS: signup trigger, later verification, duplicate index/RPC, unverified/anonymous/guest denial, private helper and other reward eligibility; fixtures rolled back' as result;
