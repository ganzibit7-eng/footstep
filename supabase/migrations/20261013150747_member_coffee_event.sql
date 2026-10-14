-- New event-only data. No existing login, profile, course or GPS rules change.
create schema if not exists event_private;
revoke all on schema event_private from public;
grant usage on schema event_private to anon,authenticated;
create table event_private.campaigns(
 id text primary key, opens_at timestamptz, closes_at timestamptz not null,
 announces_at timestamptz not null, winner_count integer not null check(winner_count between 1 and 2),
 enabled boolean not null default false, drawn_at timestamptz, drawn_count integer,
 winner_tickets text[] not null default '{}', check(opens_at is null or opens_at<closes_at),check(closes_at<announces_at)
);
create table event_private.entries(
 id uuid primary key default gen_random_uuid(), campaign_id text not null references event_private.campaigns(id),
 user_id uuid not null references auth.users(id) on delete cascade,
 ticket text not null unique default upper(substr(replace(gen_random_uuid()::text,'-',''),1,16)),
 entered_at timestamptz not null default now(),consent_version text not null,
 winner boolean not null default false,claim_requested_at timestamptz,delivered_at timestamptz,
 unique(campaign_id,user_id)
);
create index event_entries_user_idx on event_private.entries(user_id);
alter table event_private.campaigns enable row level security;
alter table event_private.entries enable row level security;
revoke all on event_private.campaigns,event_private.entries from public,anon,authenticated;
insert into event_private.campaigns(id,opens_at,closes_at,announces_at,winner_count,enabled) values
 ('2026-10',null,'2026-11-01 00:00+09','2026-11-05 00:00+09',1,false),
 ('2026-11','2026-11-01 00:00+09','2026-12-01 00:00+09','2026-12-05 00:00+09',2,true);

create function event_private.require_user() returns uuid language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or not exists(select 1 from auth.users u where u.id=auth.uid() and not coalesce(u.is_anonymous,false) and u.email_confirmed_at is not null)
 or exists(select 1 from private.account_deletion_jobs j where j.user_id=auth.uid()) then
  raise exception 'event_sign_in_required' using errcode='42501';
 end if;
 return auth.uid();
end $$;
create function event_private.require_admin() returns void language plpgsql security definer set search_path='' as $$
begin
 perform event_private.require_user();
 if not public.is_admin(auth.uid()::text) then raise exception 'event_admin_required' using errcode='42501';end if;
end $$;

create function event_private.status() returns jsonb language plpgsql security definer set search_path='' as $$
declare result jsonb;
begin
 select jsonb_agg(jsonb_build_object(
 'id',c.id,'opens_at',c.opens_at,'closes_at',c.closes_at,'announces_at',c.announces_at,'winner_count',c.winner_count,
 'enabled',c.enabled,'drawn',case when now()>=c.announces_at then c.drawn_at is not null else false end,
 'winner_tickets',case when now()>=c.announces_at then to_jsonb(c.winner_tickets) else '[]'::jsonb end,
 'eligibility',case when not c.enabled then 'not_open' when now()<c.opens_at then 'upcoming' when now()>=c.closes_at then 'closed'
 when u.id is null or coalesce(u.is_anonymous,false) or u.email_confirmed_at is null then 'sign_in'
 when exists(select 1 from private.account_deletion_jobs j where j.user_id=u.id) then 'sign_in'
 when u.created_at<c.opens_at or u.created_at>=c.closes_at then 'signup_outside' else 'eligible' end,
 'my_entry',case when e.id is null then null else jsonb_build_object('ticket',e.ticket,'entered_at',e.entered_at,
 'winner',e.winner and now()>=c.announces_at,'claim_requested',e.claim_requested_at is not null,'delivered',e.delivered_at is not null) end
 ) order by c.id) into result from event_private.campaigns c left join auth.users u on u.id=auth.uid()
 left join event_private.entries e on e.campaign_id=c.id and e.user_id=u.id;
 return jsonb_build_object('server_now',now(),'campaigns',coalesce(result,'[]'::jsonb));
end $$;

create function event_private.enter(p_campaign text,p_consent boolean,p_version text) returns jsonb language plpgsql security definer set search_path='' as $$
declare uid uuid; c event_private.campaigns%rowtype; signup_at timestamptz;
begin
 uid:=event_private.require_user();
 if p_consent is distinct from true or p_version is distinct from '2026-10-14-v1' then raise exception 'event_consent_required';end if;
 select * into c from event_private.campaigns where id=p_campaign for share;
 if not found or not c.enabled or c.opens_at is null or now()<c.opens_at or now()>=c.closes_at then raise exception 'event_not_open';end if;
 select created_at into signup_at from auth.users where id=uid;
 if signup_at<c.opens_at or signup_at>=c.closes_at then raise exception 'event_signup_outside';end if;
 insert into event_private.entries(campaign_id,user_id,consent_version) values(p_campaign,uid,p_version) on conflict(campaign_id,user_id) do nothing;
 return event_private.status();
end $$;
create function event_private.withdraw(p_campaign text) returns jsonb language plpgsql security definer set search_path='' as $$
declare c event_private.campaigns%rowtype;uid uuid;
begin
 uid:=event_private.require_user();select * into c from event_private.campaigns where id=p_campaign for share;
 if not found or now()>=c.closes_at then raise exception 'event_entry_closed';end if;
 delete from event_private.entries where campaign_id=p_campaign and user_id=uid;
 return event_private.status();
end $$;
create function event_private.claim(p_campaign text) returns jsonb language plpgsql security definer set search_path='' as $$
declare c event_private.campaigns%rowtype;uid uuid;
begin
 uid:=event_private.require_user();select * into c from event_private.campaigns where id=p_campaign;
 if not found or now()<c.announces_at or now()>=c.announces_at+interval '14 days' then raise exception 'event_claim_closed';end if;
 update event_private.entries set claim_requested_at=coalesce(claim_requested_at,now()) where campaign_id=p_campaign and user_id=uid and winner;
 if not found then raise exception 'event_not_winner';end if;
 return event_private.status();
end $$;

create function event_private.admin_status() returns jsonb language plpgsql security definer set search_path='' as $$
declare result jsonb;
begin
 perform event_private.require_admin();
 select jsonb_agg(jsonb_build_object('id',c.id,'opens_at',c.opens_at,'closes_at',c.closes_at,'announces_at',c.announces_at,
 'winner_count',c.winner_count,'drawn_at',c.drawn_at,'drawn_count',c.drawn_count,
 'entry_count',(select count(*) from event_private.entries e where e.campaign_id=c.id),
 'can_draw',c.enabled and now()>=c.closes_at and c.drawn_at is null,
 'winners',coalesce((select jsonb_agg(jsonb_build_object('ticket',e.ticket,'email',u.email,'claim_requested_at',e.claim_requested_at,'delivered_at',e.delivered_at) order by e.entered_at)
 from event_private.entries e join auth.users u on u.id=e.user_id where e.campaign_id=c.id and e.winner),'[]'::jsonb)) order by c.id)
 into result from event_private.campaigns c;
 return jsonb_build_object('server_now',now(),'campaigns',coalesce(result,'[]'::jsonb));
end $$;
create function event_private.draw(p_campaign text) returns jsonb language plpgsql security definer set search_path='' as $$
declare c event_private.campaigns%rowtype;selected_ids uuid[];total integer;
begin
 perform event_private.require_admin();select * into c from event_private.campaigns where id=p_campaign for update;
 if not found or not c.enabled or now()<c.closes_at then raise exception 'event_draw_too_early';end if;
 if c.drawn_at is not null then return event_private.admin_status();end if;
 select count(*) into total from event_private.entries e join auth.users u on u.id=e.user_id where e.campaign_id=c.id
 and not coalesce(u.is_anonymous,false) and u.email_confirmed_at is not null and u.created_at>=c.opens_at and u.created_at<c.closes_at
 and not exists(select 1 from private.account_deletion_jobs j where j.user_id=u.id);
 select array_agg(q.id) into selected_ids from (select e.id from event_private.entries e join auth.users u on u.id=e.user_id where e.campaign_id=c.id
 and not coalesce(u.is_anonymous,false) and u.email_confirmed_at is not null and u.created_at>=c.opens_at and u.created_at<c.closes_at
 and not exists(select 1 from private.account_deletion_jobs j where j.user_id=u.id) order by gen_random_uuid() limit c.winner_count) q;
 update event_private.entries set winner=true where id=any(coalesce(selected_ids,'{}'::uuid[]));
 update event_private.campaigns set drawn_at=now(),drawn_count=total,winner_tickets=coalesce((select array_agg(ticket order by ticket) from event_private.entries where campaign_id=c.id and winner),'{}') where id=c.id;
 return event_private.admin_status();
end $$;
create function event_private.mark_delivered(p_campaign text,p_ticket text) returns jsonb language plpgsql security definer set search_path='' as $$
begin
 perform event_private.require_admin();
 update event_private.entries e set delivered_at=coalesce(delivered_at,now()) from event_private.campaigns c
 where e.campaign_id=c.id and c.id=p_campaign and e.ticket=p_ticket and e.winner and e.claim_requested_at is not null and now()>=c.announces_at;
 if not found then raise exception 'event_delivery_not_ready';end if;
 return event_private.admin_status();
end $$;

revoke all on all functions in schema event_private from public,anon,authenticated;
grant execute on function event_private.status() to anon,authenticated;
grant execute on function event_private.enter(text,boolean,text),event_private.withdraw(text),event_private.claim(text),event_private.admin_status(),event_private.draw(text),event_private.mark_delivered(text,text) to authenticated;
create function public.member_event_status() returns jsonb language sql security invoker set search_path='' as $$select event_private.status();$$;
create function public.enter_member_event(p_campaign text,p_consent boolean,p_version text) returns jsonb language sql security invoker set search_path='' as $$select event_private.enter(p_campaign,p_consent,p_version);$$;
create function public.withdraw_member_event(p_campaign text) returns jsonb language sql security invoker set search_path='' as $$select event_private.withdraw(p_campaign);$$;
create function public.claim_member_event(p_campaign text) returns jsonb language sql security invoker set search_path='' as $$select event_private.claim(p_campaign);$$;
create function public.admin_member_event_status() returns jsonb language sql security invoker set search_path='' as $$select event_private.admin_status();$$;
create function public.admin_draw_member_event(p_campaign text) returns jsonb language sql security invoker set search_path='' as $$select event_private.draw(p_campaign);$$;
create function public.admin_mark_member_event_delivered(p_campaign text,p_ticket text) returns jsonb language sql security invoker set search_path='' as $$select event_private.mark_delivered(p_campaign,p_ticket);$$;
revoke all on function public.member_event_status(),public.enter_member_event(text,boolean,text),public.withdraw_member_event(text),public.claim_member_event(text),public.admin_member_event_status(),public.admin_draw_member_event(text),public.admin_mark_member_event_delivered(text,text) from public,anon,authenticated;
grant execute on function public.member_event_status() to anon,authenticated;
grant execute on function public.enter_member_event(text,boolean,text),public.withdraw_member_event(text),public.claim_member_event(text),public.admin_member_event_status(),public.admin_draw_member_event(text),public.admin_mark_member_event_delivered(text,text) to authenticated;
select cron.schedule('member-event-retention','25 18 * * *',$job$
delete from event_private.entries e using event_private.campaigns c where e.campaign_id=c.id and now()>=c.announces_at+interval '90 days';
update event_private.campaigns set winner_tickets='{}' where now()>=announces_at+interval '90 days';
$job$);
