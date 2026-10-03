-- Additive migration: old records retain NULL for metrics that were not measured.
alter table public.walks
  add column if not exists estimated_steps integer check (estimated_steps >= 0),
  add column if not exists stride_cm integer check (stride_cm between 30 and 120),
  add column if not exists paused_sec integer check (paused_sec >= 0),
  add column if not exists path_segments jsonb check (jsonb_typeof(path_segments) = 'array');
-- Existing owner policies and grants continue to protect the same walks table.
notify pgrst, 'reload schema';
