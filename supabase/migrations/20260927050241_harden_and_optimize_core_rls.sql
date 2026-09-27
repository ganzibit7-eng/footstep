-- Points: members may read their ledger, but only admins may delete it.
drop policy if exists "owner or admin read points_log" on public.points_log;
create policy "owner or admin read points_log"
on public.points_log for select to authenticated
using (
  owner_id = (select auth.uid())::text
  or public.is_admin((select auth.uid())::text)
);

drop policy if exists "owner or admin delete points_log" on public.points_log;
create policy "admin delete points_log"
on public.points_log for delete to authenticated
using (public.is_admin((select auth.uid())::text));

-- Favorites
drop policy if exists "owner read favorites" on public.favorites;
create policy "owner read favorites"
on public.favorites for select to authenticated
using (owner_id=(select auth.uid())::text);

drop policy if exists "owner insert favorites" on public.favorites;
create policy "owner insert favorites"
on public.favorites for insert to authenticated
with check (owner_id=(select auth.uid())::text);

drop policy if exists "owner or admin delete favorites" on public.favorites;
create policy "owner or admin delete favorites"
on public.favorites for delete to authenticated
using (
  owner_id=(select auth.uid())::text
  or public.is_admin((select auth.uid())::text)
);

-- Profiles
drop policy if exists "owner upsert profiles" on public.profiles;
create policy "owner upsert profiles"
on public.profiles for insert to authenticated
with check (owner_id=(select auth.uid())::text);

drop policy if exists "owner update profiles" on public.profiles;
create policy "owner update profiles"
on public.profiles for update to authenticated
using (owner_id=(select auth.uid())::text)
with check (owner_id=(select auth.uid())::text);

drop policy if exists "owner or admin delete profiles" on public.profiles;
create policy "owner or admin delete profiles"
on public.profiles for delete to authenticated
using (
  owner_id=(select auth.uid())::text
  or public.is_admin((select auth.uid())::text)
);

-- Active walkers
drop policy if exists "owner read active_walkers" on public.active_walkers;
create policy "owner read active_walkers"
on public.active_walkers for select to authenticated
using (owner_id=(select auth.uid())::text);

drop policy if exists "owner insert active_walkers" on public.active_walkers;
create policy "owner insert active_walkers"
on public.active_walkers for insert to authenticated
with check (owner_id=(select auth.uid())::text);

drop policy if exists "owner update active_walkers" on public.active_walkers;
create policy "owner update active_walkers"
on public.active_walkers for update to authenticated
using (owner_id=(select auth.uid())::text)
with check (owner_id=(select auth.uid())::text);

drop policy if exists "owner or admin delete active_walkers" on public.active_walkers;
create policy "owner or admin delete active_walkers"
on public.active_walkers for delete to authenticated
using (
  owner_id=(select auth.uid())::text
  or public.is_admin((select auth.uid())::text)
);

-- Walk history
drop policy if exists "owner insert walks" on public.walks;
create policy "owner insert walks"
on public.walks for insert to authenticated
with check (owner_id=(select auth.uid())::text);

drop policy if exists "owner or admin read walks" on public.walks;
create policy "owner or admin read walks"
on public.walks for select to authenticated
using (
  owner_id=(select auth.uid())::text
  or public.is_admin((select auth.uid())::text)
);

drop policy if exists "owner or admin delete walks" on public.walks;
create policy "owner or admin delete walks"
on public.walks for delete to authenticated
using (
  owner_id=(select auth.uid())::text
  or public.is_admin((select auth.uid())::text)
);

-- Notifications
drop policy if exists "owner read notifications" on public.notifications;
create policy "owner read notifications"
on public.notifications for select to authenticated
using (owner_id=(select auth.uid())::text);

drop policy if exists "owner update notifications" on public.notifications;
create policy "owner update notifications"
on public.notifications for update to authenticated
using (owner_id=(select auth.uid())::text)
with check (owner_id=(select auth.uid())::text);

drop policy if exists "owner or admin delete notifications" on public.notifications;
create policy "owner or admin delete notifications"
on public.notifications for delete to authenticated
using (
  owner_id=(select auth.uid())::text
  or public.is_admin((select auth.uid())::text)
);

drop policy if exists "authenticated insert notifications" on public.notifications;
create policy "authenticated insert notifications"
on public.notifications for insert to authenticated
with check (
  (select auth.uid()) is not null
  and char_length(coalesce(message,'')) between 1 and 300
);

-- User content delete/update policies
drop policy if exists "owner or admin update courses" on public.courses;
create policy "owner or admin update courses"
on public.courses for update to authenticated
using (
  owner_id=(select auth.uid())::text
  or public.is_admin((select auth.uid())::text)
)
with check (
  owner_id=(select auth.uid())::text
  or public.is_admin((select auth.uid())::text)
);

drop policy if exists "owner or admin delete courses" on public.courses;
create policy "owner or admin delete courses"
on public.courses for delete to authenticated
using (
  owner_id=(select auth.uid())::text
  or public.is_admin((select auth.uid())::text)
);

drop policy if exists "owner or admin update bins" on public.bins;
create policy "owner or admin update bins"
on public.bins for update to authenticated
using (
  owner_id=(select auth.uid())::text
  or public.is_admin((select auth.uid())::text)
)
with check (
  owner_id=(select auth.uid())::text
  or public.is_admin((select auth.uid())::text)
);

drop policy if exists "owner or admin delete bins" on public.bins;
create policy "owner or admin delete bins"
on public.bins for delete to authenticated
using (
  owner_id=(select auth.uid())::text
  or public.is_admin((select auth.uid())::text)
);

drop policy if exists "owner or admin update facilities" on public.facilities;
create policy "owner or admin update facilities"
on public.facilities for update to authenticated
using (
  owner_id=(select auth.uid())::text
  or public.is_admin((select auth.uid())::text)
)
with check (
  owner_id=(select auth.uid())::text
  or public.is_admin((select auth.uid())::text)
);

drop policy if exists "owner or admin delete facilities" on public.facilities;
create policy "owner or admin delete facilities"
on public.facilities for delete to authenticated
using (
  owner_id=(select auth.uid())::text
  or public.is_admin((select auth.uid())::text)
);

drop policy if exists "owner or admin delete reviews" on public.reviews;
create policy "owner or admin delete reviews"
on public.reviews for delete to authenticated
using (
  owner_id=(select auth.uid())::text
  or public.is_admin((select auth.uid())::text)
);

drop policy if exists "owner insert course_photos" on public.course_photos;
create policy "owner insert course_photos"
on public.course_photos for insert to authenticated
with check (uploader_id=(select auth.uid())::text);

drop policy if exists "owner or admin delete course_photos" on public.course_photos;
create policy "owner or admin delete course_photos"
on public.course_photos for delete to authenticated
using (
  uploader_id=(select auth.uid())::text
  or public.is_admin((select auth.uid())::text)
);

drop policy if exists "owner insert review_helpful" on public.review_helpful;
create policy "owner insert review_helpful"
on public.review_helpful for insert to authenticated
with check (owner_id=(select auth.uid())::text);

drop policy if exists "owner or admin delete review_helpful" on public.review_helpful;
create policy "owner or admin delete review_helpful"
on public.review_helpful for delete to authenticated
using (
  owner_id=(select auth.uid())::text
  or public.is_admin((select auth.uid())::text)
);

-- Admin-only analytics reads
drop policy if exists "admin read page_views" on public.page_views;
create policy "admin read page_views"
on public.page_views for select to authenticated
using (public.is_admin((select auth.uid())::text));

drop policy if exists "admin read presence" on public.presence;
create policy "admin read presence"
on public.presence for select to authenticated
using (public.is_admin((select auth.uid())::text));

drop policy if exists "owner or admin delete presence" on public.presence;
create policy "admin delete presence"
on public.presence for delete to authenticated
using (public.is_admin((select auth.uid())::text));

-- Admin roster
drop policy if exists "owner or superadmin read admins" on public.admins;
create policy "owner or superadmin read admins"
on public.admins for select to authenticated
using (
  owner_id=(select auth.uid())::text
  or (select auth.uid())='f5cbbb53-cdc8-4c05-8772-1309271b0681'::uuid
);

drop policy if exists "super admin manage admins" on public.admins;
create policy "super admin manage admins"
on public.admins for all to authenticated
using ((select auth.uid())='f5cbbb53-cdc8-4c05-8772-1309271b0681'::uuid)
with check ((select auth.uid())='f5cbbb53-cdc8-4c05-8772-1309271b0681'::uuid);
