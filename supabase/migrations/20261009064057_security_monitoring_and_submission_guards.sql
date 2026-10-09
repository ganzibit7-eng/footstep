-- Private audit records; no emails, passwords, tokens, raw IPs or URL queries.
create table private.security_events (
 id bigint generated always as identity primary key,
 created_at timestamptz not null default now(),
 source text not null check(source in ('server','browser')),
 event text not null,
 actor_id uuid,
 subject_hash text not null,
 path text not null default '/',
 severity text not null check(severity in ('info','warning'))
);
create index security_events_time on private.security_events(created_at desc);
create index security_events_subject_time on private.security_events(subject_hash,created_at desc);
alter table private.security_events enable row level security;
revoke all on private.security_events from public,anon,authenticated;
grant select on private.security_events to authenticated;
grant all on private.security_events to service_role;
grant usage,select on sequence private.security_events_id_seq to service_role;
create policy admin_security_read on private.security_events for select to authenticated
 using (public.is_admin((select auth.uid())::text));

create function public.record_security_event(p_source text,p_event text,p_actor_id uuid,p_subject_hash text,p_path text default '/')
returns boolean language plpgsql security definer set search_path='' as $$
begin
 if p_source not in ('server','browser') or p_subject_hash !~ '^[a-f0-9]{64}$'
 or p_event not in ('auth_failed','auth_rate_limited','script_policy_block','suspicious_route','admin_access_denied','invalid_session','invalid_request','account_deleted','account_delete_failed','submission_guard') then return false; end if;
 perform pg_advisory_xact_lock(hashtext('balzaguk_security_events'));
 -- Server timestamp/labels, bounded storage and atomic per-subject throttling.
 if (select count(*) from private.security_events where subject_hash=p_subject_hash and created_at>now()-interval '1 minute')>=10
 or (select count(*) from private.security_events where source=p_source and created_at>now()-interval '1 day')>=(case when p_source='browser' then 2000 else 10000 end) then return false; end if;
 delete from private.security_events where id in (select id from private.security_events where created_at<now()-interval '30 days' limit 100);
 insert into private.security_events(source,event,actor_id,subject_hash,path,severity)
 values(p_source,p_event,p_actor_id,p_subject_hash,
 case when p_path ~ '^/[A-Za-z0-9/_\.\-]{0,180}$' then p_path else '/' end,
 case when p_event='account_deleted' then 'info' else 'warning' end);
 return true;
end $$;
revoke all on function public.record_security_event(text,text,uuid,text,text) from public,anon,authenticated;
grant execute on function public.record_security_event(text,text,uuid,text,text) to service_role;

create function public.admin_security_summary(p_days integer default 7)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare result jsonb;
begin
 if auth.uid() is null or not coalesce(public.is_admin(auth.uid()::text),false) then raise exception 'admin_only' using errcode='42501'; end if;
 select jsonb_build_object('server_count',count(*) filter(where source='server'),
 'browser_count',count(*) filter(where source='browser'),
 'events',coalesce((select jsonb_agg(to_jsonb(e)) from
 (select id,created_at,source,event,severity,path,actor_id from private.security_events
 where created_at>=now()-make_interval(days=>greatest(1,least(coalesce(p_days,7),30))) order by created_at desc limit 100)e),'[]'::jsonb)) into result
 from private.security_events where created_at>=now()-make_interval(days=>greatest(1,least(coalesce(p_days,7),30)));
 return result;
end $$;
revoke all on function public.admin_security_summary(integer) from public,anon;
grant execute on function public.admin_security_summary(integer) to authenticated;

create function public.validate_sensitive_session(p_user_id uuid,p_session_id uuid)
returns boolean language sql security definer set search_path='' as $$
 select exists(select 1 from auth.sessions where id=p_session_id and user_id=p_user_id
 and created_at>now()-interval '15 minutes' and (not_after is null or not_after>now()));
$$;
revoke all on function public.validate_sensitive_session(uuid,uuid) from public,anon,authenticated;
grant execute on function public.validate_sensitive_session(uuid,uuid) to service_role;

-- Neither approval nor another member's ownership comes from browser input.
create or replace function public.prevent_status_change_by_non_admin()
returns trigger language plpgsql security definer set search_path='' as $$
begin
 if (auth.uid() is null and current_setting('role') in ('none','postgres','service_role'))
 or coalesce(public.is_admin(auth.uid()::text),false) then return new; end if;
 if (tg_op='INSERT' and new.status is distinct from 'pending') or (tg_op='UPDATE' and new.status is distinct from old.status) then
  perform public.record_security_event('server','submission_guard',auth.uid(),encode(sha256(convert_to(auth.uid()::text,'UTF8')),'hex'),'/api/submissions');
 end if;
 if tg_op='INSERT' then
  new.status:='pending';
 else
  new.owner_id:=old.owner_id;new.id:=old.id;
  if (to_jsonb(new)-'status'-'created_at') is distinct from (to_jsonb(old)-'status'-'created_at') then new.status:='pending'; else new.status:=old.status; end if;
 end if;
 return new;
end $$;
do $$ declare t text; begin
 foreach t in array array['courses','bins','facilities'] loop
  execute format('create trigger %I before insert on public.%I for each row execute function public.prevent_status_change_by_non_admin()',t||'_insert_guard',t);
  execute format('alter table public.%I add constraint %I check (id ~ ''^[A-Za-z0-9_-]{1,160}$'') not valid',t,t||'_safe_id');
  execute format('drop policy %I on public.%I','public read '||t,t);
  execute format('create policy %I on public.%I for select to anon,authenticated using (status=''approved'' or owner_id=(select auth.uid())::text or public.is_admin((select auth.uid())::text))','approved owner admin read '||t,t);
 end loop;
end $$;

-- Activity notifications are generated from committed activity, never arbitrary client text.
revoke insert on public.notifications from anon,authenticated;
create function private.notify_activity() returns trigger language plpgsql security definer set search_path='' as $$
declare recipient text;begin
 if auth.uid() is null then return new;end if;
 if tg_table_name='reviews' then
  select owner_id into recipient from public.courses where id=new.course_id;
 else
  select owner_id into recipient from public.reviews where id=new.review_id;
 end if;
 if recipient is not null and recipient<>auth.uid()::text then
  insert into public.notifications(owner_id,type,message) values(recipient,
   case when tg_table_name='reviews' then 'review' else 'helpful' end,
   case when tg_table_name='reviews' then '내 코스에 새 리뷰가 등록됐어요 🐾' else '내 리뷰에 도움이 됐어요가 추가됐어요 👍' end);
 end if;return new;
end $$;
revoke all on function private.notify_activity() from public,anon,authenticated;
create trigger reviews_activity_notification after insert on public.reviews for each row execute function private.notify_activity();
create trigger helpful_activity_notification after insert on public.review_helpful for each row execute function private.notify_activity();
