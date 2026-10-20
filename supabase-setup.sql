-- Web Lab 8.0: dữ liệu học tập riêng cho từng tài khoản Supabase Auth.
-- Chạy trong Supabase → SQL Editor, đúng dự án của bạn.
create table if not exists public.web_lab_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.web_lab_progress enable row level security;
revoke all on public.web_lab_progress from anon;
grant select, insert, update on public.web_lab_progress to authenticated;

create policy "WebLab read own progress"
  on public.web_lab_progress for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "WebLab insert own progress"
  on public.web_lab_progress for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "WebLab update own progress"
  on public.web_lab_progress for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
