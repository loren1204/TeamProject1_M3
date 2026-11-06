-- Account profiles only. Passwords and sessions are managed by Supabase Auth.
create table public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null default '' check (length(display_name) <= 120),
 created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (display_name) on public.profiles to authenticated;
create policy "Users read their own profile" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "Users edit their own display name" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create function public.kaizen_create_profile() returns trigger language plpgsql security definer set search_path = '' as $$
begin
 insert into public.profiles (id, display_name)
 values (new.id, left(coalesce(new.raw_user_meta_data ->> 'display_name', ''), 120));
 return new;
end;
$$;
revoke all on function public.kaizen_create_profile() from public, anon, authenticated;
create trigger kaizen_profile_on_signup after insert on auth.users for each row execute function public.kaizen_create_profile();
