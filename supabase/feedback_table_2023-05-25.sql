-- Create feedback table
create table public.feedback (
  id serial primary key,
  type text not null check (type in ('issue', 'suggestion')),
  message text not null,
  contact_info text,
  user_id text not null,
  is_guest boolean not null default false,
  created_at timestamp with time zone not null default now(),
  resolved boolean not null default false,
  resolution_notes text
);

-- Table comment
comment on table public.feedback is 'Stores user feedback including bug reports and feature suggestions';

-- Enable RLS for the feedback table
alter table public.feedback enable row level security;

-- Create policy for admins to read all feedback
create policy "Admins can read all feedback"
  on public.feedback
  for select
  to authenticated
  using (
    -- This would ideally check for an admin role
    -- For now, allowing all authenticated users to view their own feedback
    (auth.uid()::text = user_id) or 
    -- Add admin check here when you have admin roles
    (false)
  );

-- Create policy allowing anyone to insert feedback
create policy "Anyone can insert feedback"
  on public.feedback
  for insert
  to authenticated, anon
  with check (true); 