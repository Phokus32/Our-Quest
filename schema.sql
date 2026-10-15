-- Our Quest V2.0: run in the NEW Supabase project's SQL Editor.
-- IMPORTANT: replace the two email placeholders at the bottom before running.
create table if not exists public.oq_members (
 email text primary key,
 role text not null check (role in ('matthew','beth'))
);
create table if not exists public.oq_shared_state (
 id integer primary key check (id = 1),
 payload jsonb not null,
 revision bigint not null default 1,
 updated_at timestamptz not null default now()
);
alter table public.oq_members enable row level security;
alter table public.oq_shared_state enable row level security;
revoke all on public.oq_members from anon, authenticated;
revoke all on public.oq_shared_state from anon, authenticated;
grant select on public.oq_shared_state to authenticated;
create policy oq_member_read on public.oq_shared_state for select to authenticated
 using (exists(select 1 from public.oq_members m where m.email=lower(auth.jwt()->>'email')));
-- Membership rows are only administered through the Supabase SQL Editor.
create or replace function public.oq_initialize(new_payload jsonb) returns void
language plpgsql security definer set search_path = '' as $$
begin
 if not exists(select 1 from public.oq_members where email=lower(auth.jwt()->>'email') and role='matthew') then raise exception 'Admin only'; end if;
 if pg_catalog.pg_column_size(new_payload)>3000000 then raise exception 'Game state too large'; end if;
 insert into public.oq_shared_state(id,payload,revision) values(1,new_payload,1) on conflict(id) do nothing;
end;$$;
create or replace function public.oq_save_state(expected_revision bigint,new_payload jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare old_revision bigint; new_revision bigint; role_name text; old_payload jsonb;
begin
 select m.role into role_name from public.oq_members m where m.email=lower(auth.jwt()->>'email');
 if role_name is null then raise exception 'Not an invited member'; end if;
 if pg_catalog.pg_column_size(new_payload)>3000000 then raise exception 'Game state too large'; end if;
 select revision,payload into old_revision,old_payload from public.oq_shared_state where id=1 for update;
 if old_revision is null then raise exception 'Game not initialized'; end if;
 if old_revision <> expected_revision then return pg_catalog.jsonb_build_object('saved',false,'revision',old_revision); end if;
 -- Beth cannot change administrator-controlled definitions or settings.
 if role_name='beth' and (
   new_payload->'tasks' is distinct from old_payload->'tasks' or
   new_payload->'categories' is distinct from old_payload->'categories' or
   new_payload->'rewards' is distinct from old_payload->'rewards' or
   new_payload->'settings' is distinct from old_payload->'settings' or
   new_payload->'atlasPages' is distinct from old_payload->'atlasPages'
 ) then raise exception 'Admin-controlled data cannot be changed'; end if;
 new_revision:=old_revision+1;
 update public.oq_shared_state set payload=new_payload,revision=new_revision,updated_at=now() where id=1;
 return pg_catalog.jsonb_build_object('saved',true,'revision',new_revision);
end;$$;
revoke all on function public.oq_initialize(jsonb) from public,anon;
revoke all on function public.oq_save_state(bigint,jsonb) from public,anon;
grant execute on function public.oq_initialize(jsonb) to authenticated;
grant execute on function public.oq_save_state(bigint,jsonb) to authenticated;
-- EDIT THESE EMAILS. Use the same addresses in config.js.
insert into public.oq_members(email,role) values
 (lower('MATTHEW_EMAIL_HERE'),'matthew'),
 (lower('BETH_EMAIL_HERE'),'beth')
on conflict(email) do update set role=excluded.role;
