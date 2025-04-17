-- Create quick_feedback table for simple reactions
create table public.quick_feedback (
  id serial primary key,
  screen text not null,
  reaction text not null check (reaction in ('positive', 'neutral', 'negative')),
  user_id text not null,
  is_guest boolean not null default false,
  created_at timestamp with time zone not null default now()
);

-- Table comment
comment on table public.quick_feedback is 'Stores quick user reactions to different screens or features';

-- Enable RLS for the quick_feedback table
alter table public.quick_feedback enable row level security;

-- Create policy for admins to read all quick feedback
create policy "Admins can read all quick feedback"
  on public.quick_feedback
  for select
  to authenticated
  using (
    -- This would ideally check for an admin role
    -- For now, allowing all authenticated users to view their own feedback
    (auth.uid()::text = user_id) or 
    -- Add admin check here when you have admin roles
    (false)
  );

-- Create policy allowing anyone to insert quick feedback
create policy "Anyone can insert quick feedback"
  on public.quick_feedback
  for insert
  to authenticated, anon
  with check (true); 