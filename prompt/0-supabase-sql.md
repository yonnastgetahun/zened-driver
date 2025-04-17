create table public.drivesafe_session (
  id integer generated always as identity primary key,
  user_id uuid not null default next_auth.uid(),
  started_at timestamp with time zone not null default now(),
  ended_at timestamp with time zone,
  constraint drivesafe_session_user_id_fk check (user_id = next_auth.uid())
);
comment on table public.drivesafe_session is 'Table to track driving sessions. It stores the start time and optional end time of each session, linked to a specific user.';

alter table public.drivesafe_session enable row level security;

create policy "select drivesafe_session policy" on public.drivesafe_session as permissive
  for select
  to authenticated
  using (next_auth.uid() = user_id);

create policy "insert drivesafe_session policy" on public.drivesafe_session as permissive
  for insert
  to authenticated
  with check (next_auth.uid() = user_id);

create policy "update drivesafe_session policy" on public.drivesafe_session as permissive
  for update
  to authenticated
  using (next_auth.uid() = user_id);

create policy "delete drivesafe_session policy" on public.drivesafe_session as permissive
  for delete
  to authenticated
  using (next_auth.uid() = user_id);



create table public.drivesafe_alert (
  id integer generated always as identity primary key,
  session_id integer not null references public.drivesafe_session(id) on delete cascade,
  user_id uuid not null default next_auth.uid(),
  alert_level integer not null,
  alert_variant text not null,
  started_at timestamp with time zone not null default now(),
  ended_at timestamp with time zone
);
comment on table public.drivesafe_alert is 'Table to log alert events during driving sessions. Each alert records its associated session, alert level, variant, and timing details for analysis.';

alter table public.drivesafe_alert enable row level security;

create policy "select drivesafe_alert policy" on public.drivesafe_alert as permissive
  for select
  to authenticated
  using (next_auth.uid() = user_id);

create policy "insert drivesafe_alert policy" on public.drivesafe_alert as permissive
  for insert
  to authenticated
  with check (next_auth.uid() = user_id);

create policy "update drivesafe_alert policy" on public.drivesafe_alert as permissive
  for update
  to authenticated
  using (next_auth.uid() = user_id);

create policy "delete drivesafe_alert policy" on public.drivesafe_alert as permissive
  for delete
  to authenticated
  using (next_auth.uid() = user_id);