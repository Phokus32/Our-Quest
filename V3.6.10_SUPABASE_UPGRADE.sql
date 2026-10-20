-- Our Quest V3.6.10: run once in Supabase SQL Editor, after backing up oq_shared_state.
-- No table deletion or data migration is required. All existing history remains intact.
create or replace function public.oq_complete_task(p_task_id text, p_local_date date, p_expected_revision bigint)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_role text; v_state jsonb; v_task jsonb; v_logs jsonb; v_players jsonb; v_ledger jsonb;
  v_player jsonb; v_log jsonb; v_xp_tx jsonb; v_gold_tx jsonb; v_events jsonb;
  v_xp int; v_gold int; v_old_xp int; v_new_xp int; v_old_coins int; v_rate int;
  v_count int := 0; v_limit int; v_freq text; v_mode text; v_owner text; v_key text;
  v_now timestamptz := now(); v_id text; v_revision bigint; v_day date; v_other jsonb;
  v_achievements jsonb; v_new_achievements jsonb := '[]'::jsonb; v_completed int; v_rule text; v_title text; v_icon text; v_level int;
begin
  select role into v_role from public.oq_members where email=lower(auth.jwt()->>'email');
  if v_role not in ('matthew','beth') then raise exception 'Not an invited member'; end if;
  if p_local_date < current_date-1 or p_local_date > current_date+1 then raise exception 'Invalid completion date'; end if;
  select payload,revision into v_state,v_revision from public.oq_shared_state where id=1 for update;
  if v_revision is distinct from p_expected_revision then
    return jsonb_build_object('saved',false,'reason','stale','revision',v_revision);
  end if;
  select x into v_task from jsonb_array_elements(coalesce(v_state->'tasks','[]'::jsonb)) x where x->>'id'=p_task_id limit 1;
  if v_task is null then raise exception 'Task not found'; end if;
  if coalesce((v_task->>'archived')::boolean,false) or coalesce((v_task->>'hidden')::boolean,false) then raise exception 'Task inactive'; end if;
  v_mode := coalesce(v_task->>'completionMode','individual');
  v_owner := coalesce(v_task->>'owner','shared');
  if v_mode <> 'first' and v_owner not in ('shared','both',v_role) then raise exception 'Not assigned to this player'; end if;
  v_freq := coalesce(v_task->>'frequency','daily');
  v_limit := greatest(1,least(100,coalesce((v_task->>'maxPerPeriod')::int,1)));
  v_logs := coalesce(v_state->'logs','[]'::jsonb);
  for v_other in select value from jsonb_array_elements(v_logs) loop
    if v_other->>'taskId' = p_task_id and not coalesce((v_other->>'undone')::boolean,false)
       and (v_mode='first' or v_other->>'player'=v_role) then
      begin v_day := (v_other->>'date')::date; exception when others then continue; end;
      if (v_freq='daily' and v_day=p_local_date)
         or (v_freq='weekly' and date_trunc('week',v_day::timestamp)=date_trunc('week',p_local_date::timestamp))
         or (v_freq='monthly' and date_trunc('month',v_day::timestamp)=date_trunc('month',p_local_date::timestamp))
         or (v_freq in ('annual','yearly') and date_trunc('year',v_day::timestamp)=date_trunc('year',p_local_date::timestamp))
         or (v_freq in ('once','one-time'))
         or (v_freq not in ('daily','weekly','monthly','annual','yearly','once','one-time') and v_day=p_local_date)
      then v_count:=v_count+1; end if;
    end if;
  end loop;
  if v_count>=v_limit then return jsonb_build_object('saved',false,'reason','claimed','revision',v_revision); end if;
  v_xp:=greatest(0,least(100000,coalesce((v_task->>'xp')::int,0)));
  v_players:=coalesce(v_state->'players','[]'::jsonb);
  select x into v_player from jsonb_array_elements(v_players) x where x->>'id'=v_role limit 1;
  if v_player is null then raise exception 'Player missing'; end if;
  v_old_xp:=coalesce((v_player->>'xp')::int,0);v_old_coins:=coalesce((v_player->>'coins')::int,0);
  v_rate:=greatest(1,coalesce((v_state->'settings'->>'coinRate')::int,10));
  v_new_xp:=v_old_xp+v_xp;
  v_gold:=floor(v_new_xp::numeric/v_rate)::int-floor(v_old_xp::numeric/v_rate)::int;
  v_player:=jsonb_set(jsonb_set(v_player,'{xp}',to_jsonb(v_new_xp)),'{coins}',to_jsonb(v_old_coins+v_gold));
  select coalesce(jsonb_agg(case when x->>'id'=v_role then v_player else x end),'[]'::jsonb)
    into v_players from jsonb_array_elements(v_players) x;
  v_id:=md5(random()::text||clock_timestamp()::text);
  v_log:=jsonb_build_object('id',v_id,'taskId',p_task_id,'name',v_task->>'name','player',v_role,'date',p_local_date::text,'xp',v_xp,'at',v_now);
  v_xp_tx:=jsonb_build_object('id',md5(random()::text),'player',v_role,'kind','xp','amount',v_xp,'source','task','detail',v_task->>'name','at',v_now);
  v_ledger:=jsonb_build_array(v_xp_tx);
  if v_gold<>0 then
    v_gold_tx:=jsonb_build_object('id',md5(random()::text),'player',v_role,'kind','gold','amount',v_gold,'source','task','detail',v_task->>'name','at',v_now);
    v_ledger:=v_ledger||jsonb_build_array(v_gold_tx);
  end if;
  v_events:=jsonb_build_array(jsonb_build_object('id',md5(random()::text),'type','task completed','detail',coalesce(v_task->>'name','Task')||' +'||v_xp||' XP','actor',initcap(v_role),'at',v_now));
  -- Preserve the existing achievement progression for task completions.
  v_achievements:=coalesce(v_state->'achievements','[]'::jsonb);
  select count(*) into v_completed from jsonb_array_elements(v_logs) x
   where x->>'player'=v_role and not coalesce((x->>'undone')::boolean,false);
  v_completed:=v_completed+1;
  v_level:=floor(sqrt(v_new_xp::numeric/100))::int+1;
  for v_rule,v_title,v_icon in
    select * from (values ('first','First Steps','🌟'),('five','Five Victories','⚔️'),
      ('ten','Ten Victories','🏅'),('hero','Rising Hero','👑'),('gold','Treasure Hunter','🪙')) a(rule,title,icon)
  loop
    if ((v_rule='first' and v_new_xp>0) or (v_rule='five' and v_completed>=5)
      or (v_rule='ten' and v_completed>=10) or (v_rule='hero' and v_level>=3)
      or (v_rule='gold' and v_new_xp>=1000))
      and not exists(select 1 from jsonb_array_elements(v_achievements) x
        where x->>'id'=v_rule and x->>'player'=v_role) then
      v_new_achievements:=v_new_achievements||jsonb_build_array(
        jsonb_build_object('id',v_rule,'player',v_role,'at',v_now));
      v_events:=v_events||jsonb_build_array(jsonb_build_object('id',md5(random()::text),
        'type','achievement','detail',initcap(v_role)||' unlocked '||v_title,'actor',initcap(v_role),'at',v_now));
    end if;
  end loop;
  v_state:=jsonb_set(v_state,'{achievements}',v_achievements||v_new_achievements);
  v_state:=jsonb_set(v_state,'{logs}',v_logs||jsonb_build_array(v_log));
  v_state:=jsonb_set(v_state,'{players}',v_players);
  v_state:=jsonb_set(v_state,'{ledger}',v_ledger||coalesce(v_state->'ledger','[]'::jsonb));
  v_state:=jsonb_set(v_state,'{events}',v_events||coalesce(v_state->'events','[]'::jsonb));
  update public.oq_shared_state set payload=v_state,revision=revision+1,updated_at=now() where id=1;
  return jsonb_build_object('saved',true,'revision',v_revision+1,'log',v_log,'player',v_player,'ledger',v_ledger,'events',v_events,'achievements',v_new_achievements);
end;$$;
revoke all on function public.oq_complete_task(text,date,bigint) from public,anon;
grant execute on function public.oq_complete_task(text,date,bigint) to authenticated;
