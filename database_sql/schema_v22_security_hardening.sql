-- 발자국 v22: 개인정보·권한 보안 강화
-- Supabase Dashboard > SQL Editor에서 이 파일 전체를 한 번 실행하세요.
-- 기존 데이터는 삭제하지 않고 RLS 정책과 집계용 뷰만 교체합니다.

begin;

-- 1) 산책 경로(GPS)는 본인과 관리자만 조회/작성/삭제
alter table if exists walks enable row level security;
drop policy if exists "public read walks" on walks;
drop policy if exists "public insert walks" on walks;
drop policy if exists "owner or admin read walks" on walks;
create policy "owner or admin read walks" on walks for select
  using (owner_id = auth.uid()::text or is_admin(auth.uid()::text));
drop policy if exists "owner insert walks" on walks;
create policy "owner insert walks" on walks for insert
  with check (owner_id = auth.uid()::text);

-- 2) 실시간 위치 원본은 본인만 접근. 공개 화면에는 5분 이내 코스별 인원수만 제공
alter table if exists active_walkers enable row level security;
drop policy if exists "public read active_walkers" on active_walkers;
drop policy if exists "public upsert active_walkers" on active_walkers;
drop policy if exists "public update active_walkers" on active_walkers;
drop policy if exists "owner read active_walkers" on active_walkers;
create policy "owner read active_walkers" on active_walkers for select
  using (owner_id = auth.uid()::text);
drop policy if exists "owner insert active_walkers" on active_walkers;
create policy "owner insert active_walkers" on active_walkers for insert
  with check (owner_id = auth.uid()::text);
drop policy if exists "owner update active_walkers" on active_walkers;
create policy "owner update active_walkers" on active_walkers for update
  using (owner_id = auth.uid()::text)
  with check (owner_id = auth.uid()::text);

drop view if exists active_walker_counts;
create view active_walker_counts
with (security_barrier = true)
as
select course_id, count(*)::bigint as walker_count
from active_walkers
where course_id is not null
  and updated_at >= now() - interval '5 minutes'
group by course_id;
revoke all on active_walker_counts from public;
grant select on active_walker_counts to anon, authenticated;

-- 3) 방문 통계와 접속자 식별자는 관리자만 조회
drop policy if exists "public read page_views" on page_views;
drop policy if exists "admin read page_views" on page_views;
create policy "admin read page_views" on page_views for select
  using (is_admin(auth.uid()::text));
drop policy if exists "public read presence" on presence;
drop policy if exists "admin read presence" on presence;
create policy "admin read presence" on presence for select
  using (is_admin(auth.uid()::text));

-- 4) 포인트 내역은 본인과 관리자만 조회
drop policy if exists "public read points_log" on points_log;
drop policy if exists "owner or admin read points_log" on points_log;
create policy "owner or admin read points_log" on points_log for select
  using (owner_id = auth.uid()::text or is_admin(auth.uid()::text));

-- 5) 도움이 됐어요/사진/알림 쓰기는 로그인 사용자로 제한
drop policy if exists "public insert review_helpful" on review_helpful;
drop policy if exists "owner insert review_helpful" on review_helpful;
create policy "owner insert review_helpful" on review_helpful for insert
  with check (owner_id = auth.uid()::text);

drop policy if exists "public insert course_photos" on course_photos;
drop policy if exists "owner insert course_photos" on course_photos;
create policy "owner insert course_photos" on course_photos for insert
  with check (uploader_id = auth.uid()::text);

drop policy if exists "public insert notifications" on notifications;
drop policy if exists "authenticated insert notifications" on notifications;
create policy "authenticated insert notifications" on notifications for insert
  with check (auth.uid() is not null and char_length(coalesce(message,'')) between 1 and 300);

-- 6) 관리자 목록은 본인 행 또는 최고관리자에게만 노출
drop policy if exists "public read admins" on admins;
drop policy if exists "owner or superadmin read admins" on admins;
create policy "owner or superadmin read admins" on admins for select
  using (
    owner_id = auth.uid()::text
    or auth.uid() = 'f5cbbb53-cdc8-4c05-8772-1309271b0681'
  );

-- 7) 스토리지 업로드는 로그인 사용자만, 아바타 덮어쓰기는 자기 파일만 허용
drop policy if exists "public insert course-photos storage" on storage.objects;
drop policy if exists "authenticated insert course-photos storage" on storage.objects;
create policy "authenticated insert course-photos storage" on storage.objects for insert
  with check (bucket_id = 'course-photos' and auth.uid() is not null);

drop policy if exists "public update course-photos storage" on storage.objects;
drop policy if exists "owner update avatar storage" on storage.objects;
create policy "owner update avatar storage" on storage.objects for update
  using (
    bucket_id = 'course-photos'
    and (storage.foldername(name))[1] = 'avatars'
    and storage.filename(name) = auth.uid()::text || '.jpg'
  )
  with check (
    bucket_id = 'course-photos'
    and (storage.foldername(name))[1] = 'avatars'
    and storage.filename(name) = auth.uid()::text || '.jpg'
  );

commit;
