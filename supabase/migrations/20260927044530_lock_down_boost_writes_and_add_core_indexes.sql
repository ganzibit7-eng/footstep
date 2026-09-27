drop policy if exists "owner upsert course_boosts" on public.course_boosts;
drop policy if exists "owner update course_boosts" on public.course_boosts;

create index if not exists idx_reviews_course_id on public.reviews(course_id);
create index if not exists idx_reviews_owner_id on public.reviews(owner_id);
create index if not exists idx_walks_owner_created on public.walks(owner_id, created_at desc);
create index if not exists idx_points_log_owner_created on public.points_log(owner_id, created_at desc);
create index if not exists idx_notifications_owner_created on public.notifications(owner_id, created_at desc);
create index if not exists idx_course_photos_course_id on public.course_photos(course_id);
create index if not exists idx_courses_owner_id on public.courses(owner_id);
create index if not exists idx_bins_owner_id on public.bins(owner_id);
create index if not exists idx_facilities_owner_id on public.facilities(owner_id);
