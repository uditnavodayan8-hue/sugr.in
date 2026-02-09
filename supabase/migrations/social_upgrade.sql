-- 1. Identity Sync: "The Ghost Fix"
-- Automatically creates a profile when a user signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, phone_number, sugr_index)
  values (new.id, new.phone, 1);
  return new;
end;
$$ language plpgsql security definer;

-- Ensure the trigger is set
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. The Handshake Protocol (Relational Logic)
-- Replaces the static "Gallery" model with a permission-based social graph
create table if not exists public.handshakes (
  id uuid primary key default uuid_generate_v4(),
  sender_id uuid references public.profiles(id) not null,
  receiver_id uuid references public.profiles(id) not null,
  status text check (status in ('pending', 'accepted', 'denied')) default 'pending',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(sender_id, receiver_id)
);

-- Enable Row Level Security
alter table public.handshakes enable row level security;

-- Policies
create policy "Users can view their own handshakes"
  on public.handshakes for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can send handshakes"
  on public.handshakes for insert
  with check (auth.uid() = sender_id);

create policy "Users can update their own received handshakes"
  on public.handshakes for update
  using (auth.uid() = receiver_id);

-- 3. Cleanup Legacy/Casual Tables if they exist
-- drop table if exists access_requests;
