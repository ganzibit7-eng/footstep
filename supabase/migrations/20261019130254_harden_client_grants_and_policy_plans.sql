-- Keep public API grants aligned with server-authoritative rewards and notifications.
-- No rows are modified by this migration.
revoke truncate, references, trigger on all tables in schema public from public, anon, authenticated;
revoke insert, update on public.points_log from public, anon, authenticated;
revoke insert, update on public.course_boosts from public, anon, authenticated;
revoke insert on public.notifications from public, anon, authenticated;
drop policy if exists "authenticated insert notifications" on public.notifications;

-- The nested SELECT ensures auth.uid() is evaluated once for the statement.
alter policy affiliate_links_admin on private.affiliate_links
 using ((select public.is_admin((select auth.uid())::text)));
alter policy affiliate_clicks_admin on private.affiliate_clicks
 using ((select public.is_admin((select auth.uid())::text)));
create index if not exists prize_slots_current_campaign_idx on event_private.prize_slots(current_campaign);
