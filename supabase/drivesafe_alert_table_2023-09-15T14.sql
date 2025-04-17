-- Create the drivesafe_alert table to track individual alert events
create table public.drivesafe_alert (
  id integer generated always as identity primary key,
  user_id uuid not null default next_auth.uid(),
  alert_level integer not null,
  alert_variant text not null,
  duration interval,
  started_at timestamp with time zone not null default now(),
  ended_at timestamp with time zone,
  created_at timestamp with time zone not null default now()
);
comment on table public.drivesafe_alert is 'Table to track individual alert events with A/B testing variant information';

-- Apply Row Level Security to the drivesafe_alert table
alter table public.drivesafe_alert enable row level security;

-- Create policies for the drivesafe_alert table
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

-- Create alert_metrics table to store aggregated data for A/B testing analysis
create table public.alert_metrics (
  id integer generated always as identity primary key,
  user_id uuid not null default next_auth.uid(),
  alert_variant text not null,
  alert_count integer not null default 0,
  avg_duration interval,
  last_occurred timestamp with time zone
);
comment on table public.alert_metrics is 'Table to track aggregated metrics about different alert variants for A/B testing';

-- Apply Row Level Security to the alert_metrics table
alter table public.alert_metrics enable row level security;

-- Create policies for the alert_metrics table
create policy "select alert_metrics policy" on public.alert_metrics as permissive
  for select
  to authenticated
  using (next_auth.uid() = user_id);

create policy "insert alert_metrics policy" on public.alert_metrics as permissive
  for insert
  to authenticated
  with check (next_auth.uid() = user_id);

create policy "update alert_metrics policy" on public.alert_metrics as permissive
  for update
  to authenticated
  using (next_auth.uid() = user_id);

create policy "delete alert_metrics policy" on public.alert_metrics as permissive
  for delete
  to authenticated
  using (next_auth.uid() = user_id);

-- Create unique constraint on user_id and alert_variant
create unique index alert_metrics_user_variant_idx on public.alert_metrics(user_id, alert_variant);

-- Function to update alert metrics when an alert ends
create or replace function public.update_alert_metrics() 
returns trigger as $$
declare
  alert_duration interval;
begin
  -- Calculate duration of the alert
  alert_duration := NEW.ended_at - NEW.started_at;
  
  -- Update or insert alert metrics
  insert into public.alert_metrics (user_id, alert_variant, alert_count, avg_duration, last_occurred)
  values (
    NEW.user_id, 
    NEW.alert_variant, 
    1, 
    alert_duration,
    NEW.ended_at
  )
  on conflict (user_id, alert_variant) do update
  set 
    alert_count = alert_metrics.alert_count + 1,
    avg_duration = (alert_metrics.avg_duration * alert_metrics.alert_count + alert_duration) / (alert_metrics.alert_count + 1),
    last_occurred = NEW.ended_at;
  
  return NEW;
end;
$$ language plpgsql security definer;

-- Trigger to update metrics when an alert ends
create trigger on_alert_end
  after update of ended_at on public.drivesafe_alert
  for each row
  when (OLD.ended_at is null and NEW.ended_at is not null)
  execute function public.update_alert_metrics(); 