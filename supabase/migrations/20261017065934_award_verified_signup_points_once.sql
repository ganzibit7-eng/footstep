-- A verified signup must not depend on a particular browser auth event.
-- The same advisory lock as claim_points serializes signup, retries and backfill.
create unique index if not exists points_signup_bonus_once
on public.points_log(owner_id) where reason='회원가입 축하 포인트';

create or replace function private.ensure_signup_points(p_user_id uuid)
returns boolean language plpgsql security definer set search_path=''
as $$
declare v_inserted integer;
begin
 if not exists(select 1 from auth.users u where u.id=p_user_id
   and (u.email_confirmed_at is not null or u.phone_confirmed_at is not null)
   and not coalesce(u.is_anonymous,false) and u.deleted_at is null)
   or exists(select 1 from private.account_deletion_jobs d where d.user_id=p_user_id)
 then return false;end if;
 perform pg_advisory_xact_lock(hashtext('balzaguk_points:'||p_user_id::text||':회원가입 축하 포인트'));
 insert into public.points_log(owner_id,amount,reason)
 values(p_user_id::text,100,'회원가입 축하 포인트')
 on conflict(owner_id) where reason='회원가입 축하 포인트' do nothing;
 get diagnostics v_inserted=row_count;
 return v_inserted=1;
end $$;
revoke all on function private.ensure_signup_points(uuid) from public,anon,authenticated;

create or replace function private.award_verified_signup_points()
returns trigger language plpgsql security definer set search_path=''
as $$
begin
 perform private.ensure_signup_points(new.id);
 return new;
exception when others then
 -- Never break authentication because a secondary reward is temporarily unavailable.
 -- The authenticated claim_points fallback can retry; no user data is logged here.
 raise warning 'Signup points deferred, SQLSTATE %',sqlstate;
 return new;
end $$;
revoke all on function private.award_verified_signup_points() from public,anon,authenticated;
create trigger balzaguk_verified_signup_points
after insert or update of email_confirmed_at,phone_confirmed_at,is_anonymous on auth.users
for each row execute function private.award_verified_signup_points();

-- Preserve every other reward rule; route only this one reward through the shared helper.
do $$
declare v_definition text;v_old text;v_new text;
begin
 v_definition:=pg_get_functiondef('public.claim_points(text)'::regprocedure);
 v_old:=$old$    select count(*) into v_claimed from public.points_log
    where owner_id=v_uid::text and reason=p_reason;
    if v_claimed>=1 then return jsonb_build_object('awarded',false,'amount',0,'reason',p_reason,'cap',1); end if;$old$;
 v_new:=$new$    if private.ensure_signup_points(v_uid) then
      return jsonb_build_object('awarded',true,'amount',100,'reason',p_reason,'cap',1);
    end if;
    return jsonb_build_object('awarded',false,'amount',0,'reason',p_reason,'cap',1);$new$;
 if strpos(v_definition,v_old)=0 then raise exception 'unexpected_claim_points_definition';end if;
 execute replace(v_definition,v_old,v_new);
end $$;

-- Transactional fixtures are rolled back inside this block before real-user backfill.
do $$
declare v_verified uuid:='8a171026-0000-4000-8000-000000000001';
 v_later uuid:='8a171026-0000-4000-8000-000000000002';
 v_anon uuid:='8a171026-0000-4000-8000-000000000003';
begin
 if exists(select 1 from auth.users where id in(v_verified,v_later,v_anon)) then raise exception 'signup_points_fixture_collision';end if;
 begin
  insert into auth.users(id,aud,role,email,email_confirmed_at,is_anonymous,created_at,updated_at,raw_app_meta_data,raw_user_meta_data)
  values(v_verified,'authenticated','authenticated','verified-signup-points@example.invalid',now(),false,now(),now(),'{}','{}'),
   (v_later,'authenticated','authenticated','later-signup-points@example.invalid',null,false,now(),now(),'{}','{}'),
   (v_anon,'authenticated','authenticated','anonymous-signup-points@example.invalid',now(),true,now(),now(),'{}','{}');
  if (select count(*) from public.points_log where owner_id=v_verified::text and reason='회원가입 축하 포인트' and amount=100)<>1 then raise exception 'verified_signup_not_awarded';end if;
  if exists(select 1 from public.points_log where owner_id in(v_later::text,v_anon::text)) then raise exception 'unverified_or_anonymous_awarded';end if;
  if private.ensure_signup_points(v_verified) then raise exception 'retry_awarded_twice';end if;
  update auth.users set email_confirmed_at=now() where id=v_later;
  update auth.users set email_confirmed_at=now() where id=v_later;
  if (select count(*) from public.points_log where owner_id=v_later::text and reason='회원가입 축하 포인트')<>1 then raise exception 'verification_update_not_exactly_once';end if;
  perform set_config('request.jwt.claims',jsonb_build_object('sub',v_verified,'role','authenticated')::text,true);
  if (public.claim_points('회원가입 축하 포인트')->>'awarded')::boolean then raise exception 'client_fallback_awarded_twice';end if;
  if has_function_privilege('authenticated','private.ensure_signup_points(uuid)','EXECUTE') or has_function_privilege('anon','private.ensure_signup_points(uuid)','EXECUTE') then raise exception 'private_reward_helper_exposed';end if;
  raise exception using errcode='PT001',message='rollback_signup_points_fixtures';
 exception when sqlstate 'PT001' then null;
 end;
end $$;

-- Restore only missing rewards for existing verified, nondeleted accounts.
do $$
declare v_uid uuid;
begin
 for v_uid in select u.id from auth.users u
  where (u.email_confirmed_at is not null or u.phone_confirmed_at is not null)
   and not coalesce(u.is_anonymous,false) and u.deleted_at is null
   and not exists(select 1 from private.account_deletion_jobs d where d.user_id=u.id)
   and not exists(select 1 from public.points_log p where p.owner_id=u.id::text and p.reason='회원가입 축하 포인트')
 loop perform private.ensure_signup_points(v_uid);end loop;
end $$;
