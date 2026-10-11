-- Read-only checks; no account or activity data is changed.
begin;
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"f5cbbb53-cdc8-4c05-8772-1309271b0681","role":"authenticated"}',true);
do $$
begin
  assert (select coalesce(sum(visits),0) from public.admin_member_activity_summary()) =
    (select count(*) from public.traffic_clean_page_views where owner_id is not null);
  assert (select coalesce(sum(points),0) from public.admin_member_activity_summary()) =
    (select coalesce(sum(amount),0) from public.points_log where owner_id is not null);
end $$;
rollback;
begin;
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"00000000-0000-0000-0000-000000000001","role":"authenticated"}',true);
do $$
begin
  begin
    perform public.admin_member_activity_summary();
    raise exception 'non_admin_accepted';
  exception when insufficient_privilege then null;
  end;
end $$;
rollback;
do $$
begin
  assert not has_function_privilege('anon','public.admin_member_activity_summary()','execute');
  assert (select not prosecdef from pg_proc where oid='public.admin_member_activity_summary()'::regprocedure);
end $$;
