alter table event_private.campaigns drop constraint campaigns_winner_count_check;
alter table event_private.campaigns add constraint campaigns_winner_count_check check(winner_count between 1 and 3);
alter table event_private.campaigns add column base_winner_count integer not null default 0;
alter table event_private.campaigns add column retired_tickets text[] not null default '{}';
update event_private.campaigns set base_winner_count=winner_count;
alter table event_private.entries add column rolled_over_at timestamptz;
create table event_private.prize_slots(
 id text primary key,origin_campaign text not null,current_campaign text not null references event_private.campaigns(id),
 winner_ticket text,assigned_at timestamptz,claimed_at timestamptz,delivered_at timestamptz,rollover_count integer not null default 0
);
alter table event_private.prize_slots enable row level security;
revoke all on event_private.prize_slots from public,anon,authenticated;
insert into event_private.prize_slots(id,origin_campaign,current_campaign) values
 ('2026-10-1','2026-10','2026-10'),('2026-11-1','2026-11','2026-11'),('2026-11-2','2026-11','2026-11');
create function event_private.sync_prize_slot() returns trigger language plpgsql security definer set search_path='' as $$
declare slot_id text;
begin
 if new.winner and not old.winner then
  select id into slot_id from event_private.prize_slots where current_campaign=new.campaign_id and assigned_at is null and delivered_at is null order by id for update limit 1;
  if slot_id is null then raise exception 'event_prize_pool_empty';end if;
  update event_private.prize_slots set winner_ticket=new.ticket,assigned_at=now() where id=slot_id;
 end if;
 if new.winner and new.rolled_over_at is null then
  update event_private.prize_slots set claimed_at=new.claim_requested_at,delivered_at=new.delivered_at where current_campaign=new.campaign_id and winner_ticket=new.ticket;
 end if;
 return new;
end $$;
revoke all on function event_private.sync_prize_slot() from public,anon,authenticated;
create trigger event_entry_prize_slot after update on event_private.entries for each row execute function event_private.sync_prize_slot();

create function event_private.rollover_unclaimed() returns integer language plpgsql security definer set search_path='' as $$
declare r record;target_id text;start_date date;finish_at timestamptz;total integer:=0;slot event_private.prize_slots%rowtype;
begin
 for r in select p.id,p.current_campaign,p.winner_ticket,c.announces_at from event_private.prize_slots p join event_private.campaigns c on c.id=p.current_campaign
 where p.assigned_at is not null and p.delivered_at is null and now()>=c.announces_at+interval '7 days'
 and (p.claimed_at is null or not exists(select 1 from event_private.entries e where e.ticket=p.winner_ticket)) order by p.id loop
  perform 1 from event_private.campaigns where id=r.current_campaign for update;
  select * into slot from event_private.prize_slots where id=r.id for update;
  if slot.current_campaign<>r.current_campaign or slot.assigned_at is null or slot.delivered_at is not null
   or (slot.claimed_at is not null and exists(select 1 from event_private.entries e where e.ticket=slot.winner_ticket)) then continue;end if;
  start_date:=((r.current_campaign||'-01')::date+interval '1 month')::date;
  if now()>=((start_date+interval '1 month')::timestamp at time zone 'Asia/Seoul') then start_date:=date_trunc('month',now() at time zone 'Asia/Seoul')::date;end if;
  target_id:=to_char(start_date,'YYYY-MM');
  if exists(select 1 from event_private.campaigns where id=target_id and drawn_at is not null) then start_date:=(start_date+interval '1 month')::date;target_id:=to_char(start_date,'YYYY-MM');end if;
  finish_at:=(start_date+interval '1 month')::timestamp at time zone 'Asia/Seoul';
  insert into event_private.campaigns(id,opens_at,closes_at,announces_at,winner_count,base_winner_count,enabled)
  values(target_id,greatest(now(),start_date::timestamp at time zone 'Asia/Seoul'),finish_at,finish_at+interval '4 days',1,0,true)
  on conflict(id) do update set winner_count=event_private.campaigns.winner_count+1;
  update event_private.entries set rolled_over_at=now() where ticket=slot.winner_ticket;
  update event_private.campaigns set retired_tickets=array_append(retired_tickets,slot.winner_ticket) where id=r.current_campaign;
  update event_private.prize_slots set current_campaign=target_id,winner_ticket=null,assigned_at=null,claimed_at=null,delivered_at=null,rollover_count=rollover_count+1 where id=r.id;
  total:=total+1;
 end loop;
 return total;
end $$;
revoke all on function event_private.rollover_unclaimed() from public,anon,authenticated;

create or replace function event_private.claim(p_campaign text) returns jsonb language plpgsql security definer set search_path='' as $$
declare c event_private.campaigns%rowtype;uid uuid;
begin
 uid:=event_private.require_user();select * into c from event_private.campaigns where id=p_campaign;
 if not found or now()<c.announces_at or now()>=c.announces_at+interval '7 days' then raise exception 'event_claim_closed';end if;
 update event_private.entries set claim_requested_at=coalesce(claim_requested_at,now()) where campaign_id=p_campaign and user_id=uid and winner and rolled_over_at is null;
 if not found then raise exception 'event_not_winner';end if;
 return event_private.status();
end $$;
create function event_private.mark_contacted(p_campaign text,p_ticket text) returns jsonb language plpgsql security definer set search_path='' as $$
begin
 perform event_private.require_admin();
 update event_private.entries e set claim_requested_at=coalesce(claim_requested_at,now()) from event_private.campaigns c
 where e.campaign_id=c.id and c.id=p_campaign and e.ticket=p_ticket and e.winner and e.rolled_over_at is null
 and now()>=c.announces_at and now()<c.announces_at+interval '7 days';
 if not found then raise exception 'event_contact_window_closed';end if;
 return event_private.admin_status();
end $$;
revoke all on function event_private.mark_contacted(text,text) from public,anon,authenticated;
grant execute on function event_private.mark_contacted(text,text) to authenticated;
create function public.admin_mark_member_event_contacted(p_campaign text,p_ticket text) returns jsonb language sql security invoker set search_path='' as $$select event_private.mark_contacted(p_campaign,p_ticket);$$;
revoke all on function public.admin_mark_member_event_contacted(text,text) from public,anon,authenticated;
grant execute on function public.admin_mark_member_event_contacted(text,text) to authenticated;
select cron.schedule('member-event-rollover','10 15 * * *',$job$select event_private.rollover_unclaimed();$job$);
select cron.schedule('member-event-retention','25 18 * * *',$job$
delete from event_private.entries e using event_private.campaigns c where e.campaign_id=c.id and now()>=c.announces_at+interval '90 days';
update event_private.campaigns set winner_tickets='{}',retired_tickets='{}' where now()>=announces_at+interval '90 days';
$job$);
 
create or replace function event_private.status() returns jsonb language plpgsql security definer set search_path='' as $$
declare result jsonb;
begin
 select jsonb_agg(jsonb_build_object(
 'id',c.id,'opens_at',c.opens_at,'closes_at',c.closes_at,'announces_at',c.announces_at,'winner_count',c.winner_count,'base_winner_count',c.base_winner_count,'retired_tickets',case when now()>=c.announces_at then to_jsonb(c.retired_tickets) else '[]'::jsonb end,
 'enabled',c.enabled,'drawn',case when now()>=c.announces_at then c.drawn_at is not null else false end,
 'winner_tickets',case when now()>=c.announces_at then to_jsonb(c.winner_tickets) else '[]'::jsonb end,
 'eligibility',case when not c.enabled then 'not_open' when now()<c.opens_at then 'upcoming' when now()>=c.closes_at then 'closed'
 when u.id is null or coalesce(u.is_anonymous,false) or u.email_confirmed_at is null then 'sign_in'
 when exists(select 1 from private.account_deletion_jobs j where j.user_id=u.id) then 'sign_in'
 when u.created_at<c.opens_at or u.created_at>=c.closes_at then 'signup_outside' else 'eligible' end,
 'my_entry',case when e.id is null then null else jsonb_build_object('ticket',e.ticket,'entered_at',e.entered_at,
 'winner',e.winner and now()>=c.announces_at,'rolled_over',e.rolled_over_at is not null,'claim_requested',e.claim_requested_at is not null,'delivered',e.delivered_at is not null) end
 ) order by c.id) into result from event_private.campaigns c left join auth.users u on u.id=auth.uid()
 left join event_private.entries e on e.campaign_id=c.id and e.user_id=u.id;
 return jsonb_build_object('server_now',now(),'campaigns',coalesce(result,'[]'::jsonb));
end $$;


create or replace function event_private.admin_status() returns jsonb language plpgsql security definer set search_path='' as $$
declare result jsonb;
begin
 perform event_private.require_admin();
 select jsonb_agg(jsonb_build_object('id',c.id,'opens_at',c.opens_at,'closes_at',c.closes_at,'announces_at',c.announces_at,
 'winner_count',c.winner_count,'drawn_at',c.drawn_at,'drawn_count',c.drawn_count,
 'base_winner_count',c.base_winner_count,'entry_count',(select count(*) from event_private.entries e where e.campaign_id=c.id),
 'can_draw',c.enabled and now()>=c.closes_at and c.drawn_at is null,
 'winners',coalesce((select jsonb_agg(jsonb_build_object('ticket',e.ticket,'email',u.email,'rolled_over_at',e.rolled_over_at,'claim_requested_at',e.claim_requested_at,'delivered_at',e.delivered_at,'can_contact',now()>=c.announces_at and now()<c.announces_at+interval '7 days') order by e.entered_at)
 from event_private.entries e join auth.users u on u.id=e.user_id where e.campaign_id=c.id and e.winner),'[]'::jsonb)) order by c.id)
 into result from event_private.campaigns c;
 return jsonb_build_object('server_now',now(),'campaigns',coalesce(result,'[]'::jsonb));
end $$;

