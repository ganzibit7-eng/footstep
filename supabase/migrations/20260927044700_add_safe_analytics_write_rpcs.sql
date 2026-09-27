create or replace function public.record_presence(p_visitor_id text, p_page text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_visitor_id is null
     or char_length(p_visitor_id) not between 10 and 64
     or p_visitor_id !~ '^v[0-9]{10,16}[a-z0-9]{4,20}$' then
    raise exception 'invalid_visitor_id';
  end if;
  if p_page is null or char_length(p_page) not between 1 and 64 then
    raise exception 'invalid_page';
  end if;

  insert into public.presence(visitor_id,last_seen,page)
  values(p_visitor_id,now(),left(p_page,64))
  on conflict(visitor_id) do update
    set last_seen=excluded.last_seen,
        page=excluded.page;
end $$;

create or replace function public.record_page_view(p_visitor_id text, p_referrer text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_owner text := null;
begin
  if p_visitor_id is null
     or char_length(p_visitor_id) not between 10 and 64
     or p_visitor_id !~ '^v[0-9]{10,16}[a-z0-9]{4,20}$' then
    raise exception 'invalid_visitor_id';
  end if;
  if auth.uid() is not null then v_owner := auth.uid()::text; end if;

  insert into public.page_views(visitor_id,referrer,owner_id)
  values(p_visitor_id,left(coalesce(nullif(btrim(p_referrer),''),'직접 방문'),240),v_owner);
end $$;

revoke all on function public.record_presence(text,text) from public;
revoke all on function public.record_page_view(text,text) from public;
grant execute on function public.record_presence(text,text) to anon,authenticated;
grant execute on function public.record_page_view(text,text) to anon,authenticated;
