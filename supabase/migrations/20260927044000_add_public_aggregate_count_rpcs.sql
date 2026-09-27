create or replace function public.public_active_walker_counts()
returns table(course_id text, walker_count bigint)
language sql
stable
security definer
set search_path = ''
as $$
  select aw.course_id, count(*)::bigint as walker_count
  from public.active_walkers aw
  where aw.course_id is not null
    and aw.updated_at >= now() - interval '5 minutes'
  group by aw.course_id;
$$;

create or replace function public.public_report_counts()
returns table(target_type text, target_id text, report_count bigint)
language sql
stable
security definer
set search_path = ''
as $$
  select r.target_type, r.target_id, count(*)::bigint as report_count
  from public.reports r
  group by r.target_type, r.target_id;
$$;

revoke all on function public.public_active_walker_counts() from public;
revoke all on function public.public_report_counts() from public;
grant execute on function public.public_active_walker_counts() to anon, authenticated;
grant execute on function public.public_report_counts() to anon, authenticated;
