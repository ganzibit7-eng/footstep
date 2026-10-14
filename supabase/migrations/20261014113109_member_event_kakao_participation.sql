-- Event-only restriction. Existing accepted entries keep their tickets.
create table event_private.kakao_hash_key(singleton boolean primary key default true check(singleton), secret bytea not null default extensions.gen_random_bytes(32));
insert into event_private.kakao_hash_key(singleton) values(true);
alter table event_private.kakao_hash_key enable row level security;
revoke all on event_private.kakao_hash_key from public,anon,authenticated;
create table event_private.kakao_participation(
 campaign_id text not null references event_private.campaigns(id), subject_hash text not null,
 user_id uuid not null, expires_at timestamptz not null,
 primary key(campaign_id,subject_hash)
);
alter table event_private.kakao_participation enable row level security;
revoke all on event_private.kakao_participation from public,anon,authenticated;
create index kakao_participation_expiry_idx on event_private.kakao_participation(expires_at);
create function event_private.kakao_key(p_uid uuid) returns text language sql stable security invoker set search_path='' as $$
 select encode(extensions.hmac(convert_to('member-event:kakao:'||i.provider_id,'UTF8'),k.secret,'sha256'),'hex')
 from auth.identities i cross join event_private.kakao_hash_key k
 where i.user_id=p_uid and i.provider='kakao' and nullif(i.provider_id,'') is not null
 order by i.created_at,i.id limit 1;
$$;
revoke all on function event_private.kakao_key(uuid) from public,anon,authenticated;
-- Previously accepted entries remain valid without extending their original consent.

create or replace function event_private.enter(p_campaign text,p_consent boolean,p_version text) returns jsonb language plpgsql security definer set search_path='' as $$
declare uid uuid;c event_private.campaigns%rowtype;signup_at timestamptz;key text;owner_id uuid;
begin
 uid:=event_private.require_user();
 if p_consent is distinct from true or p_version is distinct from '2026-10-14-v2-kakao' then raise exception 'event_consent_required';end if;
 select * into c from event_private.campaigns where id=p_campaign for share;
 if not found or not c.enabled or c.opens_at is null or now()<c.opens_at or now()>=c.closes_at then raise exception 'event_not_open';end if;
 select created_at into signup_at from auth.users where id=uid;
 if signup_at<c.opens_at or signup_at>=c.closes_at then raise exception 'event_signup_outside';end if;
 if exists(select 1 from event_private.entries where campaign_id=p_campaign and user_id=uid) then return event_private.status();end if;
 key:=event_private.kakao_key(uid);
 if key is null then raise exception 'event_kakao_required' using errcode='42501';end if;
 -- Unique key serializes concurrent submissions and survives account deletion.
 insert into event_private.kakao_participation(campaign_id,subject_hash,user_id,expires_at)
 values(p_campaign,key,uid,c.announces_at+interval '90 days') on conflict do nothing;
 select user_id into owner_id from event_private.kakao_participation where campaign_id=p_campaign and subject_hash=key;
 if owner_id is distinct from uid then raise exception 'event_already_participated';end if;
 insert into event_private.entries(campaign_id,user_id,consent_version) values(p_campaign,uid,p_version) on conflict(campaign_id,user_id) do nothing;
 return event_private.status();
end $$;

create or replace function event_private.status() returns jsonb language plpgsql security definer set search_path='' as $$
declare result jsonb;key text;
begin
 key:=event_private.kakao_key(auth.uid());
 select jsonb_agg(jsonb_build_object(
 'id',c.id,'opens_at',c.opens_at,'closes_at',c.closes_at,'announces_at',c.announces_at,'winner_count',c.winner_count,'base_winner_count',c.base_winner_count,
 'retired_tickets',case when now()>=c.announces_at then to_jsonb(c.retired_tickets) else '[]'::jsonb end,
 'enabled',c.enabled,'kakao_only',true,'drawn',case when now()>=c.announces_at then c.drawn_at is not null else false end,
 'winner_tickets',case when now()>=c.announces_at then to_jsonb(c.winner_tickets) else '[]'::jsonb end,
 'eligibility',case when not c.enabled then 'not_open' when now()<c.opens_at then 'upcoming' when now()>=c.closes_at then 'closed'
 when u.id is null or coalesce(u.is_anonymous,false) or u.email_confirmed_at is null then 'sign_in'
 when exists(select 1 from private.account_deletion_jobs j where j.user_id=u.id) then 'sign_in'
 when u.created_at<c.opens_at or u.created_at>=c.closes_at then 'signup_outside'
 when e.id is not null then 'eligible'
 when key is null then 'kakao_required'
 when exists(select 1 from event_private.kakao_participation p where p.campaign_id=c.id and p.subject_hash=key and p.user_id<>u.id) then 'already_participated'
 else 'eligible' end,
 'my_entry',case when e.id is null then null else jsonb_build_object('ticket',e.ticket,'entered_at',e.entered_at,
 'winner',e.winner and now()>=c.announces_at,'rolled_over',e.rolled_over_at is not null,'claim_requested',e.claim_requested_at is not null,'delivered',e.delivered_at is not null) end
 ) order by c.id) into result from event_private.campaigns c left join auth.users u on u.id=auth.uid()
 left join event_private.entries e on e.campaign_id=c.id and e.user_id=u.id;
 return jsonb_build_object('server_now',now(),'campaigns',coalesce(result,'[]'::jsonb));
end $$;
-- Minimal duplicate-prevention record is separate from the deleted entry.
select cron.schedule('member-event-kakao-retention','30 18 * * *',$job$delete from event_private.kakao_participation where now()>=expires_at;$job$);
