create or replace function event_private.claim(p_campaign text) returns jsonb language plpgsql security definer set search_path='' as $$
declare c event_private.campaigns%rowtype;uid uuid;
begin
 uid:=event_private.require_user();select * into c from event_private.campaigns where id=p_campaign for update;
 if not found or now()<c.announces_at or now()>=c.announces_at+interval '7 days' then raise exception 'event_claim_closed';end if;
 update event_private.entries set claim_requested_at=coalesce(claim_requested_at,now()) where campaign_id=p_campaign and user_id=uid and winner and rolled_over_at is null;
 if not found then raise exception 'event_not_winner';end if;
 return event_private.status();
end $$;
create or replace function event_private.mark_contacted(p_campaign text,p_ticket text) returns jsonb language plpgsql security definer set search_path='' as $$
begin
 perform event_private.require_admin();
 perform 1 from event_private.campaigns where id=p_campaign for update;
 update event_private.entries e set claim_requested_at=coalesce(claim_requested_at,now()) from event_private.campaigns c
 where e.campaign_id=c.id and c.id=p_campaign and e.ticket=p_ticket and e.winner and e.rolled_over_at is null
 and now()>=c.announces_at and now()<c.announces_at+interval '7 days';
 if not found then raise exception 'event_contact_window_closed';end if;
 return event_private.admin_status();
end $$;
create or replace function event_private.rollover_unclaimed() returns integer language plpgsql security definer set search_path='' as $$
declare r record;target_id text;start_date date;finish_at timestamptz;total integer:=0;slot event_private.prize_slots%rowtype;
begin
 for r in select p.id,p.current_campaign,p.winner_ticket,c.announces_at from event_private.prize_slots p join event_private.campaigns c on c.id=p.current_campaign
 where p.assigned_at is not null and p.delivered_at is null and now()>=c.announces_at+interval '7 days'
 and (p.claimed_at is null or (p.winner_ticket is not null and not exists(select 1 from event_private.entries e where e.ticket=p.winner_ticket))) order by p.id loop
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
select cron.schedule('member-event-retention','25 18 * * *',$job$
update event_private.prize_slots p set winner_ticket=null from event_private.campaigns c where p.current_campaign=c.id and now()>=c.announces_at+interval '90 days' and (p.claimed_at is not null or p.delivered_at is not null);
delete from event_private.entries e using event_private.campaigns c where e.campaign_id=c.id and now()>=c.announces_at+interval '90 days';
update event_private.campaigns set winner_tickets='{}',retired_tickets='{}' where now()>=announces_at+interval '90 days';
$job$);
