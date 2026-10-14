create function event_private.member_roster(p_after text default null,p_limit integer default 500)
returns table(owner_id text,nickname text,badge text,created_at timestamptz,updated_at timestamptz,last_sign_in_at timestamptz,signup_provider text,linked_providers text[],event_entries jsonb)
language plpgsql security definer set search_path='' as $$
begin
 perform event_private.require_admin();
 return query select m.owner_id,m.nickname,m.badge,m.created_at,m.updated_at,m.last_sign_in_at,m.signup_provider,m.linked_providers,
 coalesce((select jsonb_agg(jsonb_build_object('campaign_id',e.campaign_id,'ticket',e.ticket,'entered_at',e.entered_at) order by e.campaign_id desc) from event_private.entries e where e.user_id=m.owner_id::uuid),'[]'::jsonb)
 from public.admin_signup_members_v2(p_after,least(greatest(p_limit,1),500)) m;
end $$;
revoke all on function event_private.member_roster(text,integer) from public,anon,authenticated;
grant execute on function event_private.member_roster(text,integer) to authenticated;
create function public.admin_signup_members_v3(p_after text default null,p_limit integer default 500)
returns table(owner_id text,nickname text,badge text,created_at timestamptz,updated_at timestamptz,last_sign_in_at timestamptz,signup_provider text,linked_providers text[],event_entries jsonb)
language sql security invoker set search_path='' as $$select * from event_private.member_roster(p_after,p_limit);$$;
revoke all on function public.admin_signup_members_v3(text,integer) from public,anon,authenticated;
grant execute on function public.admin_signup_members_v3(text,integer) to authenticated;
