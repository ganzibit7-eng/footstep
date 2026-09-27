create or replace function public.claim_points(p_reason text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_amount integer;
  v_cap integer;
  v_count integer;
  v_start timestamptz;
begin
  if v_uid is null or not private.account_can_write() then
    raise exception 'sign_in_required' using errcode='42501';
  end if;
  select x.amount,x.cap into v_amount,v_cap
  from (values
    ('회원가입 축하 포인트',100,1),
    ('코스 등록',50,5),
    ('배변봉투함 등록',20,5),
    ('동반시설 등록',20,5),
    ('리뷰 작성',10,10),
    ('산책 기록 저장',20,5),
    ('사진 등록',15,10)
  ) as x(reason,amount,cap)
  where x.reason=p_reason;
  if v_amount is null then raise exception 'invalid_point_reason'; end if;
  perform pg_advisory_xact_lock(hashtext('balzaguk_points:'||v_uid::text||':'||p_reason));
  if p_reason='회원가입 축하 포인트' then
    select count(*) into v_count from public.points_log where owner_id=v_uid::text and reason=p_reason;
  else
    v_start := ((now() at time zone 'Asia/Seoul')::date)::timestamp at time zone 'Asia/Seoul';
    select count(*) into v_count from public.points_log
    where owner_id=v_uid::text and reason=p_reason and created_at>=v_start;
  end if;
  if v_count>=v_cap then
    return jsonb_build_object('awarded',false,'amount',0,'reason',p_reason,'cap',v_cap);
  end if;
  insert into public.points_log(owner_id,amount,reason) values(v_uid::text,v_amount,p_reason);
  return jsonb_build_object('awarded',true,'amount',v_amount,'reason',p_reason,'cap',v_cap);
end $$;

create or replace function public.claim_referral_bonus(p_referrer_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_start timestamptz;
  v_ref_count integer;
  v_ref_awarded boolean := false;
begin
  if v_uid is null or not private.account_can_write() then raise exception 'sign_in_required' using errcode='42501'; end if;
  if p_referrer_id is null or p_referrer_id=v_uid then raise exception 'invalid_referrer'; end if;
  if not exists(select 1 from auth.users where id=p_referrer_id) then raise exception 'invalid_referrer'; end if;
  perform pg_advisory_xact_lock(hashtext('balzaguk_referral'));
  if not exists(select 1 from public.points_log where owner_id=v_uid::text and reason='회원가입 축하 포인트') then
    raise exception 'signup_bonus_required';
  end if;
  if exists(select 1 from public.points_log where owner_id=v_uid::text and reason='추천 링크로 가입한 보너스') then
    return jsonb_build_object('awarded',false,'referrer_awarded',false);
  end if;
  insert into public.points_log(owner_id,amount,reason) values(v_uid::text,50,'추천 링크로 가입한 보너스');
  v_start := ((now() at time zone 'Asia/Seoul')::date)::timestamp at time zone 'Asia/Seoul';
  select count(*) into v_ref_count from public.points_log
  where owner_id=p_referrer_id::text and reason='친구 추천 보너스' and created_at>=v_start;
  if v_ref_count<5 then
    insert into public.points_log(owner_id,amount,reason) values(p_referrer_id::text,50,'친구 추천 보너스');
    v_ref_awarded := true;
  end if;
  return jsonb_build_object('awarded',true,'referrer_awarded',v_ref_awarded);
end $$;

create or replace function public.purchase_badge_points(p_badge text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_cost integer;
  v_balance bigint;
  v_name text;
begin
  if v_uid is null or not private.account_can_write() then raise exception 'sign_in_required' using errcode='42501'; end if;
  select x.cost,x.name into v_cost,v_name from (values
    ('paw',50,'발자국'),('star',100,'스타'),('medal',150,'골드메달'),('crown',300,'왕관'),
    ('heart',80,'하트'),('rainbow',200,'무지개'),('diamond',500,'다이아몬드')
  ) as x(id,cost,name) where x.id=p_badge;
  if v_cost is null then raise exception 'invalid_badge'; end if;
  perform pg_advisory_xact_lock(hashtext('balzaguk_points:'||v_uid::text));
  select coalesce(sum(amount),0) into v_balance from public.points_log where owner_id=v_uid::text;
  if v_balance<v_cost then return jsonb_build_object('purchased',false,'error','insufficient_points','balance',v_balance,'cost',v_cost); end if;
  insert into public.points_log(owner_id,amount,reason) values(v_uid::text,-v_cost,'배지 구매('||v_name||')');
  return jsonb_build_object('purchased',true,'balance',v_balance-v_cost,'cost',v_cost);
end $$;

create or replace function public.purchase_course_boost(p_course_id text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_balance bigint;
  v_until timestamptz := now()+interval '3 days';
begin
  if v_uid is null or not private.account_can_write() then raise exception 'sign_in_required' using errcode='42501'; end if;
  if not exists(select 1 from public.courses where id=p_course_id and owner_id=v_uid::text) then
    raise exception 'not_course_owner' using errcode='42501';
  end if;
  perform pg_advisory_xact_lock(hashtext('balzaguk_points:'||v_uid::text));
  select coalesce(sum(amount),0) into v_balance from public.points_log where owner_id=v_uid::text;
  if v_balance<200 then return jsonb_build_object('purchased',false,'error','insufficient_points','balance',v_balance,'cost',200); end if;
  insert into public.points_log(owner_id,amount,reason) values(v_uid::text,-200,'코스 홍보권 구매');
  insert into public.course_boosts(course_id,boosted_by,boosted_until)
  values(p_course_id,v_uid::text,v_until)
  on conflict(course_id) do update set boosted_by=excluded.boosted_by,boosted_until=excluded.boosted_until;
  return jsonb_build_object('purchased',true,'balance',v_balance-200,'boosted_until',v_until);
end $$;

create or replace function public.admin_adjust_points(p_owner_id uuid,p_amount integer,p_reason text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare v_balance bigint;
begin
  if auth.uid() is null or not coalesce(public.is_admin(auth.uid()::text),false) then
    raise exception 'admin_only' using errcode='42501';
  end if;
  if p_amount=0 or p_reason is null or char_length(btrim(p_reason)) not between 1 and 200 then raise exception 'invalid_adjustment'; end if;
  if not exists(select 1 from auth.users where id=p_owner_id) then raise exception 'account_missing'; end if;
  perform pg_advisory_xact_lock(hashtext('balzaguk_points:'||p_owner_id::text));
  insert into public.points_log(owner_id,amount,reason) values(p_owner_id::text,p_amount,btrim(p_reason));
  select coalesce(sum(amount),0) into v_balance from public.points_log where owner_id=p_owner_id::text;
  return jsonb_build_object('adjusted',true,'balance',v_balance);
end $$;

revoke all on function public.claim_points(text) from public,anon;
revoke all on function public.claim_referral_bonus(uuid) from public,anon;
revoke all on function public.purchase_badge_points(text) from public,anon;
revoke all on function public.purchase_course_boost(text) from public,anon;
revoke all on function public.admin_adjust_points(uuid,integer,text) from public,anon;
grant execute on function public.claim_points(text) to authenticated;
grant execute on function public.claim_referral_bonus(uuid) to authenticated;
grant execute on function public.purchase_badge_points(text) to authenticated;
grant execute on function public.purchase_course_boost(text) to authenticated;
grant execute on function public.admin_adjust_points(uuid,integer,text) to authenticated;
