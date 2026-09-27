create table if not exists public.user_badges(
  owner_id text not null,
  badge_id text not null,
  active boolean not null default false,
  purchased_at timestamptz not null default now(),
  primary key(owner_id,badge_id),
  constraint user_badges_badge_id_check
    check (badge_id in ('paw','star','medal','crown','heart','rainbow','diamond'))
);

alter table public.user_badges enable row level security;
revoke all on public.user_badges from anon,authenticated;
grant select on public.user_badges to anon,authenticated;

drop policy if exists "read active or own badges" on public.user_badges;
create policy "read active or own badges"
on public.user_badges
for select
to anon,authenticated
using (active or owner_id=(select auth.uid())::text);

insert into public.user_badges(owner_id,badge_id,active,purchased_at)
select pl.owner_id,
       case pl.reason
         when '배지 구매(발자국)' then 'paw'
         when '배지 구매(스타)' then 'star'
         when '배지 구매(골드메달)' then 'medal'
         when '배지 구매(왕관)' then 'crown'
         when '배지 구매(하트)' then 'heart'
         when '배지 구매(무지개)' then 'rainbow'
         when '배지 구매(다이아몬드)' then 'diamond'
       end,
       false,
       min(pl.created_at)
from public.points_log pl
where pl.reason in (
 '배지 구매(발자국)','배지 구매(스타)','배지 구매(골드메달)','배지 구매(왕관)',
 '배지 구매(하트)','배지 구매(무지개)','배지 구매(다이아몬드)'
)
group by pl.owner_id,
  case pl.reason
    when '배지 구매(발자국)' then 'paw'
    when '배지 구매(스타)' then 'star'
    when '배지 구매(골드메달)' then 'medal'
    when '배지 구매(왕관)' then 'crown'
    when '배지 구매(하트)' then 'heart'
    when '배지 구매(무지개)' then 'rainbow'
    when '배지 구매(다이아몬드)' then 'diamond'
  end
on conflict(owner_id,badge_id) do nothing;

update public.user_badges ub
set active=true
from public.profiles p
where p.owner_id=ub.owner_id
  and p.badge=ub.badge_id
  and not exists(
    select 1 from public.user_badges x
    where x.owner_id=ub.owner_id and x.active
  );

create unique index if not exists idx_user_badges_one_active
on public.user_badges(owner_id)
where active;

create or replace function private.enforce_profile_badge()
returns trigger
language plpgsql
security definer
set search_path=''
as $$
begin
  new.badge := (
    select ub.badge_id
    from public.user_badges ub
    where ub.owner_id=new.owner_id and ub.active
    limit 1
  );
  return new;
end $$;

revoke all on function private.enforce_profile_badge() from public;

drop trigger if exists enforce_profile_badge on public.profiles;
create trigger enforce_profile_badge
before insert or update of badge,owner_id
on public.profiles
for each row
execute function private.enforce_profile_badge();

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
  v_owned boolean;
begin
  if v_uid is null or not private.account_can_write() then
    raise exception 'sign_in_required' using errcode='42501';
  end if;

  select x.cost,x.name into v_cost,v_name
  from (values
    ('paw',50,'발자국'),('star',100,'스타'),('medal',150,'골드메달'),('crown',300,'왕관'),
    ('heart',80,'하트'),('rainbow',200,'무지개'),('diamond',500,'다이아몬드')
  ) as x(id,cost,name)
  where x.id=p_badge;
  if v_cost is null then raise exception 'invalid_badge'; end if;

  perform pg_advisory_xact_lock(hashtext('balzaguk_badge:'||v_uid::text));
  perform pg_advisory_xact_lock(hashtext('balzaguk_points:'||v_uid::text));

  select exists(
    select 1 from public.user_badges
    where owner_id=v_uid::text and badge_id=p_badge
  ) into v_owned;

  select coalesce(sum(amount),0) into v_balance
  from public.points_log
  where owner_id=v_uid::text;

  if not v_owned then
    if v_balance<v_cost then
      return jsonb_build_object('purchased',false,'error','insufficient_points','balance',v_balance,'cost',v_cost);
    end if;
    insert into public.points_log(owner_id,amount,reason)
    values(v_uid::text,-v_cost,'배지 구매('||v_name||')');
    insert into public.user_badges(owner_id,badge_id,active)
    values(v_uid::text,p_badge,false)
    on conflict(owner_id,badge_id) do nothing;
    v_balance:=v_balance-v_cost;
  end if;

  update public.user_badges set active=false
  where owner_id=v_uid::text and active;
  update public.user_badges set active=true
  where owner_id=v_uid::text and badge_id=p_badge;

  update public.profiles
  set badge=p_badge,updated_at=now()
  where owner_id=v_uid::text;

  return jsonb_build_object(
    'purchased',true,
    'new_purchase',not v_owned,
    'balance',v_balance,
    'cost',case when v_owned then 0 else v_cost end,
    'badge',p_badge
  );
end $$;

revoke all on function public.purchase_badge_points(text) from public,anon;
grant execute on function public.purchase_badge_points(text) to authenticated;
