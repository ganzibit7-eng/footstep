-- New private inbox only. Existing reports, roles and notification grants stay unchanged.
begin;
create table private.content_corrections (
 id uuid primary key,
 target_path text not null check(length(target_path) between 5 and 400),
 target_name text not null check(length(target_name) between 1 and 160),
 category text not null check(category in ('pet','route','location','hours','photo','other')),
 message text not null check(length(btrim(message)) between 10 and 2000),
 source_url text check(source_url is null or (length(source_url)<=1000 and source_url like 'https://%')),
 status text not null default 'pending' check(status in ('pending','reviewing','resolved','rejected')),
 review_note text not null default '' check(length(review_note)<=1000),
 revision integer not null default 1,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index content_corrections_status_created on private.content_corrections(status,created_at desc,id);
create index content_corrections_created on private.content_corrections(created_at);
create table private.correction_rate_buckets (
 network_hash text not null check(network_hash ~ '^[a-f0-9]{64}$'),
 bucket timestamptz not null,
 count integer not null,
 primary key(network_hash,bucket)
);
create index correction_buckets_expiry on private.correction_rate_buckets(bucket);
create table private.content_correction_events (
 id bigint generated always as identity primary key,
 correction_id uuid not null references private.content_corrections(id) on delete cascade,
 actor_id uuid not null,
 status text not null,
 note text not null,
 created_at timestamptz not null default now()
);
create index correction_events_parent on private.content_correction_events(correction_id,created_at);
alter table private.content_corrections enable row level security;
alter table private.correction_rate_buckets enable row level security;
alter table private.content_correction_events enable row level security;
revoke all on private.content_corrections,private.correction_rate_buckets,private.content_correction_events from public,anon,authenticated;
revoke all on sequence private.content_correction_events_id_seq from public,anon,authenticated;

create function public.submit_content_correction(p_id uuid,p_path text,p_name text,p_category text,p_message text,p_source text,p_network_hash text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare recipient text; label text; n integer; total integer; previous private.content_corrections;
begin
 if auth.role() is distinct from 'service_role' then raise exception 'service_only' using errcode='42501'; end if;
 if p_id is null or p_path is null or p_name is null or p_category is null or p_message is null or p_network_hash is null or p_path !~ '^/(places|courses|bins)/[A-Za-z0-9_-]+/$' and p_path !~ '^/pet-care/places/[A-Za-z0-9_-]+/$'
  or p_network_hash !~ '^[a-f0-9]{64}$' or p_category not in ('pet','route','location','hours','photo','other')
  or char_length(btrim(p_name)) not between 1 and 160 or char_length(btrim(p_message)) not between 10 and 2000
 then raise exception 'invalid_correction' using errcode='22023'; end if;
 perform pg_catalog.pg_advisory_xact_lock(681106,1);
 select * into previous from private.content_corrections where id=p_id;
 if found then
  if previous.target_path is distinct from p_path or previous.category is distinct from p_category or previous.message is distinct from btrim(p_message) or previous.source_url is distinct from nullif(p_source,'')
  then raise exception 'correction_id_conflict' using errcode='22023'; end if;
  return jsonb_build_object('accepted',true,'id',p_id);
 end if;
 select coalesce(sum(count),0),coalesce(sum(count) filter(where bucket>=date_trunc('hour',now())),0) into total,n
  from private.correction_rate_buckets where network_hash=p_network_hash and bucket>=date_trunc('day',now());
 if total>=10 or n>=3 or (select count(*) from private.content_corrections where created_at>=date_trunc('day',now()))>=100
 then raise exception 'correction_rate_limited' using errcode='P0001'; end if;
 if pg_total_relation_size('private.content_corrections')+pg_total_relation_size('private.content_correction_events')+pg_total_relation_size('private.correction_rate_buckets')>10485760
 then raise exception 'correction_capacity' using errcode='P0001'; end if;
 insert into private.correction_rate_buckets values(p_network_hash,date_trunc('hour',now()),1)
  on conflict(network_hash,bucket) do update set count=private.correction_rate_buckets.count+1;
 insert into private.content_corrections(id,target_path,target_name,category,message,source_url)
  values(p_id,p_path,btrim(p_name),p_category,btrim(p_message),nullif(p_source,''));
 label:=case p_category when 'pet' then '동반 조건' when 'route' then '코스·경로' when 'location' then '주소·위치' when 'hours' then '운영·이용 정보' when 'photo' then '사진·출처' else '기타 정보' end;
 for recipient in select u.id::text from auth.users u where public.is_admin(u.id::text) loop
  insert into public.notifications(owner_id,type,message) values(recipient,'correction','정보 정정 요청 · '||btrim(p_name)||' · '||label||' · 관리자 접수함에서 확인해 주세요.');
 end loop;
 return jsonb_build_object('accepted',true,'id',p_id);
end $$;
revoke all on function public.submit_content_correction(uuid,text,text,text,text,text,text) from public,anon,authenticated;
grant execute on function public.submit_content_correction(uuid,text,text,text,text,text,text) to service_role;

create function public.admin_list_content_corrections(p_status text default 'pending',p_offset integer default 0,p_limit integer default 20)
returns jsonb language plpgsql security definer set search_path='' as $$
declare result jsonb; total bigint;
begin
 if auth.uid() is null or not public.is_admin(auth.uid()::text) then raise exception 'admin_only' using errcode='42501'; end if;
 if p_status is null or p_offset is null or p_limit is null or p_status not in ('all','pending','reviewing','resolved','rejected') or p_offset not between 0 and 100000 or p_limit not between 1 and 50
 then raise exception 'invalid_filter' using errcode='22023'; end if;
 select count(*) into total from private.content_corrections where p_status='all' or status=p_status;
 select coalesce(jsonb_agg(to_jsonb(r)),'[]'::jsonb) into result from (
  select id,target_path,target_name,category,message,source_url,status,review_note,revision,created_at,updated_at
  from private.content_corrections where p_status='all' or status=p_status order by created_at desc,id offset p_offset limit p_limit
 )r;
 return jsonb_build_object('items',result,'total',total);
end $$;
create function public.admin_review_content_correction(p_id uuid,p_revision integer,p_status text,p_note text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare result private.content_corrections;
begin
 if auth.uid() is null or not public.is_admin(auth.uid()::text) then raise exception 'admin_only' using errcode='42501'; end if;
 if p_id is null or p_revision is null or p_status is null or p_status not in ('pending','reviewing','resolved','rejected') or char_length(coalesce(p_note,''))>1000
  or p_status in ('resolved','rejected') and char_length(btrim(coalesce(p_note,'')))<5
 then raise exception 'invalid_review' using errcode='22023'; end if;
 update private.content_corrections set status=p_status,review_note=btrim(coalesce(p_note,'')),revision=revision+1,updated_at=now()
  where id=p_id and revision=p_revision returning * into result;
 if not found then raise exception 'correction_conflict' using errcode='40001'; end if;
 insert into private.content_correction_events(correction_id,actor_id,status,note) values(p_id,auth.uid(),p_status,result.review_note);
 return jsonb_build_object('id',result.id,'revision',result.revision,'status',result.status);
end $$;
revoke all on function public.admin_list_content_corrections(text,integer,integer),public.admin_review_content_correction(uuid,integer,text,text) from public,anon;
grant execute on function public.admin_list_content_corrections(text,integer,integer),public.admin_review_content_correction(uuid,integer,text,text) to authenticated;

create function private.purge_content_corrections() returns void language plpgsql security definer set search_path='' as $$
begin
 delete from private.content_corrections where created_at<now()-interval '180 days' or status in ('resolved','rejected') and updated_at<now()-interval '90 days';
 delete from private.correction_rate_buckets where bucket<now()-interval '48 hours';
 delete from public.notifications where type='correction' and created_at<now()-interval '180 days';
end $$;
revoke all on function private.purge_content_corrections() from public,anon,authenticated;
select cron.schedule('content-corrections-retention','17 * * * *','select private.purge_content_corrections();');
commit;
