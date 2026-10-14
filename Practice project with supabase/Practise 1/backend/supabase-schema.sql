-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run

create table todos (
  id bigint generated always as identity primary key,
  text text not null,
  user_id uuid not null references auth.users(id) default auth.uid(),
  created_at timestamptz not null default now()
);

-- Row Level Security: without this, any logged-in user could read/edit everyone's todos
alter table todos enable row level security;

create policy "Users can view their own todos"
  on todos for select
  using (auth.uid() = user_id);

create policy "Users can insert their own todos"
  on todos for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own todos"
  on todos for update
  using (auth.uid() = user_id);

create policy "Users can delete their own todos"
  on todos for delete
  using (auth.uid() = user_id);

-- Second resource: notes. Same shape as todos (own id, owned by a user),
-- with an extra optional "content" column for the note body.

create table notes (
  id bigint generated always as identity primary key,
  title text not null,
  content text not null default '',
  user_id uuid not null references auth.users(id) default auth.uid(),
  created_at timestamptz not null default now()
);

-- Row Level Security: same reason as todos - keeps each user's notes private
alter table notes enable row level security;

create policy "Users can view their own notes"
  on notes for select
  using (auth.uid() = user_id);

create policy "Users can insert their own notes"
  on notes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own notes"
  on notes for update
  using (auth.uid() = user_id);

create policy "Users can delete their own notes"
  on notes for delete
  using (auth.uid() = user_id);

-- Third resource: education. Stores degree/qualification, institution, and year.
create table education (
  id bigint generated always as identity primary key,
  degree text not null,
  institution text not null default '',
  year text not null default '',
  user_id uuid not null references auth.users(id) default auth.uid(),
  created_at timestamptz not null default now()
);

-- Row Level Security: keeps each user's education records private
alter table education enable row level security;

create policy "Users can view their own education"
  on education for select
  using (auth.uid() = user_id);

create policy "Users can insert their own education"
  on education for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own education"
  on education for update
  using (auth.uid() = user_id);

create policy "Users can delete their own education"
  on education for delete
  using (auth.uid() = user_id);

