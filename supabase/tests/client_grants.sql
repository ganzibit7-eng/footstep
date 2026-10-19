begin;
do $$
begin
 if exists(select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind='r' and not c.relrowsecurity) then raise exception 'public table without RLS';end if;
 if has_table_privilege('anon','public.profiles','truncate') or has_table_privilege('authenticated','public.profiles','truncate') then raise exception 'client truncate privilege';end if;
 if has_table_privilege('authenticated','public.points_log','insert') or has_table_privilege('authenticated','public.points_log','update') then raise exception 'client can write reward ledger';end if;
 if has_table_privilege('authenticated','public.course_boosts','insert') or has_table_privilege('authenticated','public.course_boosts','update') then raise exception 'client can bypass boost purchase';end if;
 if has_table_privilege('authenticated','public.notifications','insert') then raise exception 'client can forge notifications';end if;
 if not has_function_privilege('authenticated','public.claim_points(text)','execute') then raise exception 'reward endpoint unavailable';end if;
 if not has_table_privilege('anon','public.courses','select') then raise exception 'public courses unavailable';end if;
 if has_function_privilege('anon','public.begin_account_deletion(uuid)','execute') or has_function_privilege('authenticated','public.begin_account_deletion(uuid)','execute') then raise exception 'client can begin privileged deletion';end if;
 if exists(select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind='v' and has_table_privilege('anon',c.oid,'select') and not coalesce(c.reloptions @> array['security_invoker=true'],false)) then raise exception 'public definer view';end if;
end $$;
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-000000000001","role":"authenticated"}',true);
do $$
begin
 if exists(select 1 from public.walks) or exists(select 1 from public.points_log) or exists(select 1 from public.notifications) then raise exception 'unrelated account can read private rows';end if;
 begin
  perform public.admin_adjust_points('00000000-0000-4000-8000-000000000001'::uuid,1,'audit');
  raise exception 'non-admin adjustment accepted';
 exception when insufficient_privilege then null;
 end;
end $$;
rollback;
