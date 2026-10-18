-- Limit new uploads; existing objects and their public URLs are unchanged.
update storage.buckets set file_size_limit=5242880,
 allowed_mime_types=array['image/jpeg','image/png','image/webp'] where id='course-photos';
create table if not exists private.signup_consent_receipts (
 user_id uuid not null references auth.users(id) on delete cascade,
 notice_version text not null,
 accepted_at timestamptz not null default now(),
 age_14_confirmed boolean not null default true check(age_14_confirmed),
 terms_accepted boolean not null default true check(terms_accepted),
 privacy_accepted boolean not null default true check(privacy_accepted),
 primary key(user_id,notice_version)
);
alter table private.signup_consent_receipts enable row level security;
revoke all on private.signup_consent_receipts from public,anon,authenticated;
create or replace function public.record_signup_consent(p_version text)
returns boolean language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'sign_in_required'; end if;
 if p_version is distinct from '2026-10-18-v1' then raise exception 'invalid_notice_version'; end if;
 insert into private.signup_consent_receipts(user_id,notice_version) values(auth.uid(),p_version)
 on conflict(user_id,notice_version) do nothing;
 return true;
end; $$;
revoke all on function public.record_signup_consent(text) from public,anon;
grant execute on function public.record_signup_consent(text) to authenticated;
comment on table private.signup_consent_receipts is 'Self-declared age and notice receipt; not identity verification. Deleted with auth account. No historical backfill.';
