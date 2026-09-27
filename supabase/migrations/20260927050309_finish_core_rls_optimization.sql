drop policy if exists "admin delete reports" on public.reports;
create policy "admin delete reports"
on public.reports for delete to authenticated
using (public.is_admin((select auth.uid())::text));

drop policy if exists "super admin manage admins" on public.admins;

create policy "super admin insert admins"
on public.admins for insert to authenticated
with check ((select auth.uid())='f5cbbb53-cdc8-4c05-8772-1309271b0681'::uuid);

create policy "super admin update admins"
on public.admins for update to authenticated
using ((select auth.uid())='f5cbbb53-cdc8-4c05-8772-1309271b0681'::uuid)
with check ((select auth.uid())='f5cbbb53-cdc8-4c05-8772-1309271b0681'::uuid);

create policy "super admin delete admins"
on public.admins for delete to authenticated
using ((select auth.uid())='f5cbbb53-cdc8-4c05-8772-1309271b0681'::uuid);
