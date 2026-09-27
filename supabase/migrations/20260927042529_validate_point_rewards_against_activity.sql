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
  v_claimed integer;
  v_eligible integer;
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
    select count(*) into v_claimed from public.points_log
    where owner_id=v_uid::text and reason=p_reason;
    if v_claimed>=1 then return jsonb_build_object('awarded',false,'amount',0,'reason',p_reason,'cap',1); end if;
  else
    v_start := ((now() at time zone 'Asia/Seoul')::date)::timestamp at time zone 'Asia/Seoul';
    select count(*) into v_claimed from public.points_log
    where owner_id=v_uid::text and reason=p_reason and created_at>=v_start;

    if p_reason='코스 등록' then
      select count(*) into v_eligible from public.courses where owner_id=v_uid::text and created_at>=v_start;
    elsif p_reason='배변봉투함 등록' then
      select count(*) into v_eligible from public.bins where owner_id=v_uid::text and created_at>=v_start;
    elsif p_reason='동반시설 등록' then
      select count(*) into v_eligible from public.facilities where owner_id=v_uid::text and created_at>=v_start;
    elsif p_reason='리뷰 작성' then
      select count(*) into v_eligible from public.reviews where owner_id=v_uid::text and created_at>=v_start;
    elsif p_reason='산책 기록 저장' then
      select count(*) into v_eligible from public.walks where owner_id=v_uid::text and created_at>=v_start;
    elsif p_reason='사진 등록' then
      select count(*) into v_eligible from public.course_photos where uploader_id=v_uid::text and created_at>=v_start;
    end if;

    if v_claimed>=least(v_cap,coalesce(v_eligible,0)) then
      return jsonb_build_object('awarded',false,'amount',0,'reason',p_reason,'cap',v_cap,'eligible',coalesce(v_eligible,0));
    end if;
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
  v_created timestamptz;
begin
  if v_uid is null or not private.account_can_write() then raise exception 'sign_in_required' using errcode='42501'; end if;
  if p_referrer_id is null or p_referrer_id=v_uid then raise exception 'invalid_referrer'; end if;
  if not exists(select 1 from auth.users where id=p_referrer_id) then raise exception 'invalid_referrer'; end if;

  select created_at into v_created from auth.users where id=v_uid;
  if v_created is null or v_created < now()-interval '24 hours' then
    raise exception 'referral_window_closed';
  end if;

  perform pg_advisory_xact_lock(hashtext('balzaguk_referral'));

  if not exists(select 1 from public.points_log
                where owner_id=v_uid::text and reason='회원가입 축하 포인트'
                  and created_at>=now()-interval '24 hours') then
    raise exception 'signup_bonus_required';
  end if;
  if exists(select 1 from public.points_log where owner_id=v_uid::text and reason='추천 링크로 가입한 보너스') then
    return jsonb_build_object('awarded',false,'referrer_awarded',false);
  end if;

  insert into public.points_log(owner_id,amount,reason)
  values(v_uid::text,50,'추천 링크로 가입한 보너스');

  v_start := ((now() at time zone 'Asia/Seoul')::date)::timestamp at time zone 'Asia/Seoul';
  select count(*) into v_ref_count from public.points_log
  where owner_id=p_referrer_id::text and reason='친구 추천 보너스' and created_at>=v_start;

  if v_ref_count<5 then
    insert into public.points_log(owner_id,amount,reason)
    values(p_referrer_id::text,50,'친구 추천 보너스');
    v_ref_awarded := true;
  end if;

  return jsonb_build_object('awarded',true,'referrer_awarded',v_ref_awarded);
end $$;

revoke all on function public.claim_points(text) from public,anon;
revoke all on function public.claim_referral_bonus(uuid) from public,anon;
grant execute on function public.claim_points(text) to authenticated;
grant execute on function public.claim_referral_bonus(uuid) to authenticated;
