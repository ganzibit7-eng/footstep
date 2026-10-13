-- Only ephemeral presence and historical analytics are affected. No course,
-- member profile, stored walk, photo, authentication or RLS rules change.
select cron.schedule('presence-retention','* * * * *',$job$delete from public.presence where last_seen < now()-interval '5 minutes'$job$);
select cron.schedule('active-walker-retention','* * * * *',$job$delete from public.active_walkers where updated_at < now()-interval '5 minutes'$job$);
select cron.schedule('page-view-retention','45 18 * * *',$job$delete from public.page_views where created_at < now()-interval '90 days'$job$);
