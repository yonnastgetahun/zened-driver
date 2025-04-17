create table public.driver_stats (
  id integer generated always as identity primary key,
  user_id uuid not null default next_auth.uid(),
  total_sessions integer not null default 0,
  total_driving_time interval not null default interval '0 seconds',
  total_alerts integer not null default 0,
  safety_score numeric(5,2) not null default 100.0,
  last_updated timestamp with time zone not null default now()
);
comment on table public.driver_stats is 'Table to track driver statistics including session counts, total driving time, alerts, and safety score metrics for user performance analysis.';

alter table public.driver_stats enable row level security;

create policy "select driver_stats policy" on public.driver_stats as permissive
  for select
  to authenticated
  using (next_auth.uid() = user_id);

create policy "insert driver_stats policy" on public.driver_stats as permissive
  for insert
  to authenticated
  with check (next_auth.uid() = user_id);

create policy "update driver_stats policy" on public.driver_stats as permissive
  for update
  to authenticated
  using (next_auth.uid() = user_id);

create policy "delete driver_stats policy" on public.driver_stats as permissive
  for delete
  to authenticated
  using (next_auth.uid() = user_id);

-- Function to update driver stats after a session ends
create or replace function public.update_driver_stats() 
returns trigger as $$
begin
  -- Create stats record if it doesn't exist
  insert into public.driver_stats (user_id)
  values (NEW.user_id)
  on conflict (user_id) do nothing;
  
  -- Update stats for the user
  update public.driver_stats
  set 
    total_sessions = total_sessions + 1,
    total_driving_time = total_driving_time + (NEW.ended_at - NEW.started_at),
    last_updated = now()
  where user_id = NEW.user_id;
  
  return NEW;
end;
$$ language plpgsql security definer;

-- Trigger to update stats when a session ends
create trigger on_session_end
  after update of ended_at on public.drivesafe_session
  for each row
  when (OLD.ended_at is null and NEW.ended_at is not null)
  execute function public.update_driver_stats(); 