-- Grant ALL schema permissions to the postgres role (for debugging)
grant all on schema public to postgres;

-- Drop existing table if it exists
drop table if exists public.profiles cascade;

-- Drop existing function and trigger if they exist
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Create the profiles table with correct schema
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text,
  email text,
  fname text,
  lname text,
  mname text,
  suffix text,
  address text,
  contact_no text,
  birthday date,
  age integer,
  gender text,
  interests text[],
  role text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set table owner to postgres
alter table public.profiles owner to postgres;

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Create policies for authenticated users
create policy "Authenticated users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Create policy for anon users to view public profiles
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

-- Set up auth triggers
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Log that the function is starting
  raise notice '[TRIGGER] handle_new_user started for user ID: %, Email: %', new.id, new.email;

  -- Attempt to insert the basic profile
  insert into public.profiles (id, email)
  values (new.id, new.email);

  -- Log success
  raise notice '[TRIGGER] handle_new_user successfully inserted profile for user ID: %', new.id;

  return new;

exception
  when others then
    -- Log any error that occurs during insertion
    raise notice '[TRIGGER] handle_new_user ERROR: %', sqlerrm;
    -- Optional: Depending on desired behavior, you might want to re-raise the error
    -- raise exception '%', sqlerrm;
    -- For now, we'll just log it and allow the auth insert to succeed
    return new; -- Return new even if profile insert fails to not block auth
end;
$$ language plpgsql security definer;

-- Set function owner to postgres
alter function public.handle_new_user() owner to postgres;

-- Create the trigger on the auth.users table
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Grant necessary permissions to anon and authenticated roles
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.profiles to anon, authenticated;
grant all privileges on all sequences in schema public to anon, authenticated;

-- Optional: updated_at trigger setup
create or replace function public.handle_updated_at()
returns trigger as $$ begin new.updated_at = now(); return new; end; $$ language plpgsql;
create trigger handle_profile_updated_at before update on public.profiles for each row execute procedure public.handle_updated_at();

-- Remove any existing policies
DROP POLICY IF EXISTS "Avatar storage access" ON storage.objects;

-- Policy for users to access their own folder
CREATE POLICY "Avatar storage access"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text)
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Policy for public read access to avatars
CREATE POLICY "Public avatar access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');

select 'Database setup revised with logging. Ready for testing.'; 