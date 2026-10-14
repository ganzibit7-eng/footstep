-- Run inside BEGIN/ROLLBACK. Only synthetic accounts are created.
do $$begin
 if exists(select 1 from auth.users where id::text like '9e141026-0000-4000-8000-%') then raise exception 'fixture_collision';end if;
end $$;
insert into auth.users(id,aud,role,email,email_confirmed_at,last_sign_in_at,created_at,updated_at,raw_app_meta_data,raw_user_meta_data)
select ('9e141026-0000-4000-8000-00000000000'||n)::uuid,'authenticated','authenticated','verified-roster-'||n||'@example.invalid',
case when n>=2 then now() end,case when n>=3 then now() end,now(),now(),'{"provider":"email","providers":["email"]}'::jsonb,'{}'::jsonb from generate_series(1,4)n;
insert into public.admins(owner_id,role) values('9e141026-0000-4000-8000-000000000004','admin');
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"9e141026-0000-4000-8000-000000000004","role":"authenticated"}',true);
do $$begin
 if exists(select 1 from public.admin_signup_members(null,500) where owner_id in ('9e141026-0000-4000-8000-000000000001','9e141026-0000-4000-8000-000000000002')) then raise exception 'legacy_pending_leak';end if;
 if exists(select 1 from public.admin_signup_members_v2(null,500) where owner_id in ('9e141026-0000-4000-8000-000000000001','9e141026-0000-4000-8000-000000000002')) then raise exception 'v2_pending_leak';end if;
 if exists(select 1 from public.admin_signup_members_v3(null,500) where owner_id in ('9e141026-0000-4000-8000-000000000001','9e141026-0000-4000-8000-000000000002')) then raise exception 'v3_pending_leak';end if;
 if not exists(select 1 from public.admin_signup_members_v3(null,500) where owner_id='9e141026-0000-4000-8000-000000000003') then raise exception 'verified_email_hidden';end if;
end $$;
reset role;
update auth.users set email_confirmed_at=now(),last_sign_in_at=now() where id='9e141026-0000-4000-8000-000000000001';
set local role authenticated;
do $$begin
 if not exists(select 1 from public.admin_signup_members_v3(null,500) where owner_id='9e141026-0000-4000-8000-000000000001') then raise exception 'newly_verified_not_visible';end if;
 perform set_config('request.jwt.claims','{"sub":"9e141026-0000-4000-8000-000000000003","role":"authenticated"}',true);
 begin perform public.admin_signup_members_v3(null,500);raise exception 'nonadmin_access';exception when insufficient_privilege then null;end;
end $$;
reset role;
