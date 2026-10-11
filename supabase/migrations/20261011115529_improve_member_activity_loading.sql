-- Aggregate on the server instead of downloading every activity row.
-- Invoker rights preserve the existing table/view RLS and clean-traffic rules.
create or replace function public.admin_member_activity_summary()
returns table(owner_id text, points bigint, visits bigint, last_seen timestamptz)
language plpgsql security invoker set search_path = ''
as $$
begin
  if auth.uid() is null or not public.is_admin(auth.uid()::text) then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;
  return query
    with point_totals as (
      select p.owner_id, sum(p.amount)::bigint total
      from public.points_log p where p.owner_id is not null group by p.owner_id
    ), visit_totals as (
      select v.owner_id, count(*) total, max(v.created_at) last_at
      from public.traffic_clean_page_views v where v.owner_id is not null group by v.owner_id
    )
    select coalesce(p.owner_id,v.owner_id)::text, coalesce(p.total,0::bigint),
      coalesce(v.total,0::bigint),v.last_at
    from point_totals p full join visit_totals v on v.owner_id=p.owner_id;
end;
$$;
revoke all on function public.admin_member_activity_summary() from public, anon, authenticated;
grant execute on function public.admin_member_activity_summary() to authenticated;
