create extension if not exists pg_cron with schema pg_catalog;
select cron.schedule('security-events-retention','25 18 * * *', $$delete from private.security_events where created_at < now()-interval '30 days'$$);
