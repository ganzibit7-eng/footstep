create or replace function private.create_signup_profile()
returns trigger language plpgsql security definer set search_path=''
as $$
begin
  insert into public.profiles(owner_id,nickname,avatar_url,created_at,updated_at)
  values(new.id::text,left(coalesce(nullif(new.raw_user_meta_data->>'display_name',''),nullif(new.raw_user_meta_data->>'name',''),nullif(new.raw_user_meta_data->>'nickname',''),nullif(new.raw_user_meta_data->>'full_name',''),nullif(new.raw_user_meta_data->>'preferred_username',''),'회원'),120),nullif(new.raw_user_meta_data->>'avatar_url',''),new.created_at,coalesce(new.updated_at,new.created_at))
  on conflict(owner_id) do nothing;
  return new;
end $$;
revoke all on function private.create_signup_profile() from public,anon,authenticated;
create trigger balzaguk_signup_profile after insert on auth.users for each row execute function private.create_signup_profile();
insert into public.profiles(owner_id,nickname,avatar_url,created_at,updated_at)
select u.id::text,left(coalesce(nullif(u.raw_user_meta_data->>'display_name',''),nullif(u.raw_user_meta_data->>'name',''),nullif(u.raw_user_meta_data->>'nickname',''),nullif(u.raw_user_meta_data->>'full_name',''),nullif(u.raw_user_meta_data->>'preferred_username',''),'회원'),120),nullif(u.raw_user_meta_data->>'avatar_url',''),u.created_at,coalesce(u.updated_at,u.created_at)
from auth.users u where not exists(select 1 from public.profiles p where p.owner_id=u.id::text)
on conflict(owner_id) do nothing;

create or replace function private.admin_signup_members(p_after text default null,p_limit integer default 500)
returns table(owner_id text,nickname text,badge text,created_at timestamptz,updated_at timestamptz,last_sign_in_at timestamptz)
language plpgsql security definer set search_path=''
as $$
begin
  if auth.uid() is null or not (auth.uid()='f5cbbb53-cdc8-4c05-8772-1309271b0681'::uuid or exists(select 1 from public.admins a where a.owner_id=auth.uid()::text)) then
    raise exception 'Administrator access required' using errcode='42501';
  end if;
  return query select u.id::text,coalesce(nullif(p.nickname,''),left(coalesce(nullif(u.raw_user_meta_data->>'display_name',''),nullif(u.raw_user_meta_data->>'name',''),nullif(u.raw_user_meta_data->>'nickname',''),nullif(u.raw_user_meta_data->>'full_name',''),'회원'),120)),p.badge,u.created_at,p.updated_at,u.last_sign_in_at
  from auth.users u left join public.profiles p on p.owner_id=u.id::text
  where p_after is null or u.id::text>p_after
  order by u.id::text limit least(500,greatest(1,coalesce(p_limit,500)));
end $$;
revoke all on function private.admin_signup_members(text,integer) from public,anon,authenticated;
grant usage on schema private to authenticated;
grant execute on function private.admin_signup_members(text,integer) to authenticated;
create or replace function public.admin_signup_members(p_after text default null,p_limit integer default 500)
returns table(owner_id text,nickname text,badge text,created_at timestamptz,updated_at timestamptz,last_sign_in_at timestamptz)
language sql security invoker set search_path=''
as $$ select * from private.admin_signup_members(p_after,p_limit); $$;
revoke all on function public.admin_signup_members(text,integer) from public,anon,authenticated;
grant execute on function public.admin_signup_members(text,integer) to authenticated;