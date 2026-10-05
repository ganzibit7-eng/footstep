create or replace function private.admin_signup_members_v2(p_after text default null,p_limit integer default 500)
returns table(owner_id text,nickname text,badge text,created_at timestamptz,updated_at timestamptz,last_sign_in_at timestamptz,signup_provider text,linked_providers text[])
language plpgsql security definer set search_path=''
as $$
begin
  if auth.uid() is null or not (auth.uid()='f5cbbb53-cdc8-4c05-8772-1309271b0681'::uuid or exists(select 1 from public.admins a where a.owner_id=auth.uid()::text)) then
    raise exception 'Administrator access required' using errcode='42501';
  end if;
  return query select u.id::text,coalesce(nullif(p.nickname,''),left(coalesce(nullif(u.raw_user_meta_data->>'display_name',''),nullif(u.raw_user_meta_data->>'name',''),nullif(u.raw_user_meta_data->>'nickname',''),nullif(u.raw_user_meta_data->>'full_name',''),'회원'),120)),p.badge,u.created_at,p.updated_at,u.last_sign_in_at,
    coalesce(nullif(u.raw_app_meta_data->>'provider',''),'unknown'),
    coalesce((select array_agg(distinct i.provider order by i.provider) from auth.identities i where i.user_id=u.id),array[]::text[])
  from auth.users u left join public.profiles p on p.owner_id=u.id::text
  where p_after is null or u.id::text>p_after order by u.id::text limit least(500,greatest(1,coalesce(p_limit,500)));
end $$;
revoke all on function private.admin_signup_members_v2(text,integer) from public,anon,authenticated;
grant execute on function private.admin_signup_members_v2(text,integer) to authenticated;
create or replace function public.admin_signup_members_v2(p_after text default null,p_limit integer default 500)
returns table(owner_id text,nickname text,badge text,created_at timestamptz,updated_at timestamptz,last_sign_in_at timestamptz,signup_provider text,linked_providers text[])
language sql security invoker set search_path=''
as $$ select * from private.admin_signup_members_v2(p_after,p_limit); $$;
revoke all on function public.admin_signup_members_v2(text,integer) from public,anon,authenticated;
grant execute on function public.admin_signup_members_v2(text,integer) to authenticated;