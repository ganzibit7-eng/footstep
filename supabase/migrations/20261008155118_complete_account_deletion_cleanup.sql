CREATE OR REPLACE FUNCTION public.erase_account_activity(p_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
 if not exists(select 1 from private.account_deletion_jobs where user_id=p_user_id) then raise exception 'deletion_not_started'; end if;
 if exists(select 1 from storage.objects where owner_id=p_user_id::text or owner=p_user_id) then raise exception 'files_remaining'; end if;
 -- Clean dependants before course/review deletion, including references by other users.
 delete from public.review_helpful where owner_id=p_user_id::text or review_id in
 (select id from public.reviews where owner_id=p_user_id::text or course_id in(select id from public.courses where owner_id=p_user_id::text));
 delete from public.favorites where owner_id=p_user_id::text or course_id in(select id from public.courses where owner_id=p_user_id::text);
 delete from public.course_boosts where boosted_by=p_user_id::text or course_id in(select id from public.courses where owner_id=p_user_id::text);
 delete from public.course_photos where uploader_id=p_user_id::text or course_id in(select id from public.courses where owner_id=p_user_id::text);
 delete from public.reports where reporter_id=p_user_id::text
 or (target_type='course' and target_id in(select id from public.courses where owner_id=p_user_id::text))
 or (target_type='review' and target_id in(select id::text from public.reviews where owner_id=p_user_id::text or course_id in(select id from public.courses where owner_id=p_user_id::text)))
 or (target_type='bin' and target_id in(select id from public.bins where owner_id=p_user_id::text))
 or (target_type='facility' and target_id in(select id from public.facilities where owner_id=p_user_id::text));
 delete from public.active_walkers where owner_id=p_user_id::text;
 update public.active_walkers set course_id=null where course_id in(select id from public.courses where owner_id=p_user_id::text);
 delete from public.reviews where owner_id=p_user_id::text;
 delete from public.courses where owner_id=p_user_id::text;
 delete from public.bins where owner_id=p_user_id::text;
 delete from public.facilities where owner_id=p_user_id::text;
 delete from public.walks where owner_id=p_user_id::text;
 delete from public.points_log where owner_id=p_user_id::text;
 delete from public.notifications where owner_id=p_user_id::text;
 delete from public.presence where visitor_id in(select visitor_id from public.page_views where owner_id=p_user_id::text);
 delete from public.page_views where owner_id=p_user_id::text;
 delete from public.user_badges where owner_id=p_user_id::text;
 delete from public.profiles where owner_id=p_user_id::text;
end $function$;

REVOKE ALL ON FUNCTION public.erase_account_activity(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.erase_account_activity(uuid) TO service_role;
DROP POLICY IF EXISTS account_active_insert ON public.user_badges;
CREATE POLICY account_active_insert ON public.user_badges AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (private.account_can_write());
DROP POLICY IF EXISTS account_active_update ON public.user_badges;
CREATE POLICY account_active_update ON public.user_badges AS RESTRICTIVE FOR UPDATE TO authenticated USING (private.account_can_write()) WITH CHECK (private.account_can_write());
DROP POLICY IF EXISTS account_active_delete ON public.user_badges;
CREATE POLICY account_active_delete ON public.user_badges AS RESTRICTIVE FOR DELETE TO authenticated USING (private.account_can_write());

