create table public.ad_campaigns (
 id uuid primary key default gen_random_uuid(), brand text not null check(length(brand) between 1 and 100),
 headline text not null check(length(headline) between 1 and 160), description text not null default '' check(length(description)<=300),
 image_pc text not null check(image_pc ~ '^https://[^[:space:]]+$'), image_mobile text not null check(image_mobile ~ '^https://[^[:space:]]+$'),
 target_url text not null check(target_url ~ '^https://[^[:space:]]+$'),
 starts_at timestamptz not null, ends_at timestamptz not null, status text not null default 'paused' check(status in ('active','paused','ended')),
 updated_at timestamptz not null default now(), check(ends_at>starts_at)
);
alter table public.ad_campaigns enable row level security;
revoke all on public.ad_campaigns from anon, authenticated;
grant select,insert,update on public.ad_campaigns to authenticated;
create policy ad_admin_read on public.ad_campaigns for select to authenticated using(public.is_admin((select auth.uid())::text));
create policy ad_admin_insert on public.ad_campaigns for insert to authenticated with check(public.is_admin((select auth.uid())::text));
create policy ad_admin_update on public.ad_campaigns for update to authenticated using(public.is_admin((select auth.uid())::text)) with check(public.is_admin((select auth.uid())::text));
create function public.ad_check_schedule() returns trigger language plpgsql security invoker set search_path='' as $$
begin
 perform pg_catalog.pg_advisory_xact_lock(20261029,1);
 if new.status='active' and exists(select 1 from public.ad_campaigns a where a.id<>new.id and a.status='active' and tstzrange(a.starts_at,a.ends_at,'[)') && tstzrange(new.starts_at,new.ends_at,'[)')) then raise exception '광고 기간이 기존 활성 광고와 겹칩니다'; end if;
 new.updated_at=now();return new;
end;$$;
revoke all on function public.ad_check_schedule() from public,anon,authenticated;
create trigger ad_schedule before insert or update on public.ad_campaigns for each row execute function public.ad_check_schedule();
create table public.ad_settings(id boolean primary key default true check(id),kmong_url text check(kmong_url is null or kmong_url ~ '^https://(www\.)?kmong\.com/[^[:space:]]+$'));
alter table public.ad_settings enable row level security;
revoke all on public.ad_settings from anon,authenticated;
grant select,update on public.ad_settings to authenticated;
insert into public.ad_settings(id) values(true);
create policy ad_settings_read on public.ad_settings for select to authenticated using(public.is_admin((select auth.uid())::text));
create policy ad_settings_write on public.ad_settings for update to authenticated using(public.is_admin((select auth.uid())::text)) with check(public.is_admin((select auth.uid())::text));
-- Narrow public projection. No contact details, drafts or future creatives are returned.
create function public.public_ad_slot() returns jsonb language sql stable security definer set search_path='' as $$
 select jsonb_build_object('server_time',now(),'campaign',(select jsonb_build_object('id',id,'brand',brand,'headline',headline,'description',description,'image_pc',image_pc,'image_mobile',image_mobile,'target_url',target_url,'ends_at',ends_at) from public.ad_campaigns where status='active' and starts_at<=now() and ends_at>now() order by starts_at limit 1),'kmong_url',(select kmong_url from public.ad_settings where id=true));
$$;
revoke all on function public.public_ad_slot() from public;
grant execute on function public.public_ad_slot() to anon,authenticated;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('ad-images','ad-images',true,1048576,array['image/jpeg','image/png','image/webp']);
create policy ad_image_read on storage.objects for select to anon,authenticated using(bucket_id='ad-images');
create policy ad_image_insert on storage.objects for insert to authenticated with check(bucket_id='ad-images' and public.is_admin((select auth.uid())::text));
