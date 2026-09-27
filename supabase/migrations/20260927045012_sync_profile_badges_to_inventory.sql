update public.profiles p
set badge = (
  select ub.badge_id
  from public.user_badges ub
  where ub.owner_id=p.owner_id and ub.active
  limit 1
),
updated_at=now()
where p.badge is distinct from (
  select ub.badge_id
  from public.user_badges ub
  where ub.owner_id=p.owner_id and ub.active
  limit 1
);
