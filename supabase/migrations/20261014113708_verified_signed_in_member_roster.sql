-- Display only confirmed members who have completed their first sign-in.
-- Pending Auth accounts stay available for the original email link to work.
CREATE OR REPLACE FUNCTION private.admin_signup_members(p_after text DEFAULT NULL::text, p_limit integer DEFAULT 500)
 RETURNS TABLE(owner_id text, nickname text, badge text, created_at timestamp with time zone, updated_at timestamp with time zone, last_sign_in_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  if auth.uid() is null or not (auth.uid()='f5cbbb53-cdc8-4c05-8772-1309271b0681'::uuid or exists(select 1 from public.admins a where a.owner_id=auth.uid()::text)) then
    raise exception 'Administrator access required' using errcode='42501';
  end if;
  return query select u.id::text,coalesce(nullif(p.nickname,''),left(coalesce(nullif(u.raw_user_meta_data->>'display_name',''),nullif(u.raw_user_meta_data->>'name',''),nullif(u.raw_user_meta_data->>'nickname',''),nullif(u.raw_user_meta_data->>'full_name',''),'회원'),120)),p.badge,u.created_at,p.updated_at,u.last_sign_in_at
  from auth.users u left join public.profiles p on p.owner_id=u.id::text
  where (p_after is null or u.id::text>p_after)
  and not coalesce(u.is_anonymous,false)
  and u.email_confirmed_at is not null and u.last_sign_in_at is not null
  order by u.id::text limit least(500,greatest(1,coalesce(p_limit,500)));
end $function$
;
CREATE OR REPLACE FUNCTION private.admin_signup_members_v2(p_after text DEFAULT NULL::text, p_limit integer DEFAULT 500)
 RETURNS TABLE(owner_id text, nickname text, badge text, created_at timestamp with time zone, updated_at timestamp with time zone, last_sign_in_at timestamp with time zone, signup_provider text, linked_providers text[])
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  if auth.uid() is null or not (auth.uid()='f5cbbb53-cdc8-4c05-8772-1309271b0681'::uuid or exists(select 1 from public.admins a where a.owner_id=auth.uid()::text)) then
    raise exception 'Administrator access required' using errcode='42501';
  end if;
  return query select u.id::text,coalesce(nullif(p.nickname,''),left(coalesce(nullif(u.raw_user_meta_data->>'display_name',''),nullif(u.raw_user_meta_data->>'name',''),nullif(u.raw_user_meta_data->>'nickname',''),nullif(u.raw_user_meta_data->>'full_name',''),'회원'),120)),p.badge,u.created_at,p.updated_at,u.last_sign_in_at,
    coalesce(nullif(u.raw_app_meta_data->>'provider',''),'unknown'),
    coalesce((select array_agg(distinct i.provider order by i.provider) from auth.identities i where i.user_id=u.id),array[]::text[])
  from auth.users u left join public.profiles p on p.owner_id=u.id::text
  where (p_after is null or u.id::text>p_after)
  and not coalesce(u.is_anonymous,false)
  and u.email_confirmed_at is not null and u.last_sign_in_at is not null order by u.id::text limit least(500,greatest(1,coalesce(p_limit,500)));
end $function$
;
