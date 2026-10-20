/* Our Quest 3.6.9 — shared completion mode, player statistics and bandwidth-friendly sync */
'use strict';
(function(){
 const safeText=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 let selected='matthew',range='month',claimBusy=false;
 const startDate=()=>{
  const d=new Date();
  if(range==='today')return new Date(d.getFullYear(),d.getMonth(),d.getDate());
  if(range==='week'){let x=new Date(d.getFullYear(),d.getMonth(),d.getDate());x.setDate(x.getDate()-((x.getDay()+6)%7));return x}
  if(range==='month')return new Date(d.getFullYear(),d.getMonth(),1);
  if(range==='year')return new Date(d.getFullYear(),0,1);
  return new Date(0)
 };
 const inRange=(v,start)=>{let d=new Date(String(v||'').length===10?String(v)+'T12:00:00':v);return !isNaN(d)&&d>=start};
 const players=()=>selected==='both'?['matthew','beth']:[selected];
 const metric=(id,start)=>{
  let logs=(data.logs||[]).filter(l=>l.player===id&&!l.undone&&inRange(l.at||l.date,start));
  let ledger=(data.ledger||[]).filter(l=>l.player===id&&inRange(l.at||l.date,start));
  let tasks=logs.filter(l=>l.taskId);
  let xp=ledger.filter(l=>Number(l.amount)>0&&(String(l.currency||'xp').toLowerCase()==='xp'||l.xp!==undefined)).reduce((n,l)=>n+Number(l.amount||0),0);
  // Task XP is always present on the task completion records.
  let taskXP=tasks.reduce((n,l)=>n+Number(l.xp||0),0);
  let days=new Set(logs.map(l=>l.date)).size;
  let categories={};tasks.forEach(l=>{let t=data.tasks.find(t=>t.id===l.taskId);let c=t?.category||'Deleted task';categories[c]=(categories[c]||0)+1});
  let names={};tasks.forEach(l=>{let n=l.name||data.tasks.find(t=>t.id===l.taskId)?.name||'Task';names[n]=(names[n]||0)+1});
  let favorite=Object.entries(names).sort((a,b)=>b[1]-a[1])[0];
  return {id,logs,ledger,tasks,taskXP,xp,days,categories,favorite};
 };
 const periodLabel={today:'Today',week:'This Week',month:'This Month',year:'This Year',all:'All Time'};
 function card(m){
  const p=(data.players||[]).find(p=>p.id===m.id);
  const name=p?.name||m.id;
  const categories=Object.entries(m.categories).sort((a,b)=>b[1]-a[1]);
  return `<section class="card"><h2>${safeText(name)}</h2>
   <div class="grid"><div><div class="statLabel">Task XP Earned</div><div class="stat">${m.taskXP.toLocaleString()}</div></div>
   <div><div class="statLabel">Tasks Completed</div><div class="stat">${m.tasks.length}</div></div>
   <div><div class="statLabel">Active Days</div><div class="stat">${m.days}</div></div></div>
   <p class="tiny muted">Most completed: ${m.favorite?safeText(m.favorite[0])+' ('+m.favorite[1]+')':'No task completions in this period'}</p>
   <h3>Activity by Category</h3>${categories.length?categories.map(([c,n])=>`<div class="listline row between tiny"><span>${safeText(c)}</span><b>${n}</b></div>`).join(''):'<p class="tiny muted">No activity yet.</p>'}
   <h3>Recent Task Activity</h3>${m.tasks.slice().sort((a,b)=>String(b.at||b.date).localeCompare(String(a.at||a.date))).slice(0,15).map(l=>`<div class="listline row between tiny"><span>${safeText(l.name||'Task')}<div class="muted">${safeText(l.date||'')}</div></span><b>+${Number(l.xp||0)} XP</b></div>`).join('')||'<p class="tiny muted">No completed tasks.</p>'}</section>`;
 }
 window.oq369StatsPlayer=x=>{selected=x;render()};
 window.oq369StatsRange=x=>{range=x;render()};
 window.statsView=function(){
  const start=startDate(),ms=players().map(id=>metric(id,start));
  return `<div class="card"><h2>Player Activity</h2><div class="row wrap" style="gap:12px">
  <label>Player<select onchange="oq369StatsPlayer(this.value)">
  ${[['matthew','Matthew'],['beth','Beth'],['both','Compare Both']].map(([v,n])=>`<option value="${v}" ${selected===v?'selected':''}>${n}</option>`).join('')}</select></label>
  <label>Time Period<select onchange="oq369StatsRange(this.value)">
  ${Object.entries(periodLabel).map(([v,n])=>`<option value="${v}" ${range===v?'selected':''}>${n}</option>`).join('')}</select></label></div>
  <p class="tiny muted">Completion history is credited to the player who performed the task. Deactivated and deleted tasks retain their recorded history.</p></div>
  <div class="grid ${selected==='both'?'two':''} section">${ms.map(card).join('')}</div>`;
 };
 // Existing revision-based cloud writes are compare-and-swap. Refresh immediately
 // before a shared claim, then let the server reject a concurrent stale write.
 const previous=window.logTask;
 window.logTask=async function(id){
  const t=(data.tasks||[]).find(x=>x.id===id);
  if(!t||t.completionMode!=='first')return previous.apply(this,arguments);
  if(claimBusy)return notify('A completion is already being processed');
  if(!navigator.onLine||!window.oqCloudActive)return notify('Shared tasks require an online connection');
  claimBusy=true;
  try{
   if(oqDirty||oqSaving)return notify('Please wait for your previous changes to save');
   // Revision-only preflight followed by full download only if another device changed state.
   const {data:ver,error}=await oqClient.from('oq_shared_state').select('revision').eq('id',1).maybeSingle();
   if(error)throw error;
   if(ver&&ver.revision!==oqRevision){await oqRefresh(true);if(ver.revision!==oqRevision)return notify('Please refresh before claiming this task')}
   if(countTask(t)>=maxTask(t))return notify('All shared completion slots have been claimed');
   // The existing server-side oq_save_state expected_revision comparison
   // ensures simultaneous submissions cannot both commit.
   return previous.call(this,id);
  }catch(e){notify('Could not verify task availability. Please retry.');console.error(e)}
  finally{claimBusy=false}
 };
 // Expose claim mode on the task list so both players can see how XP is awarded.
 const originalLine=window.taskLine;
 window.taskLine=function(t){
  let h=originalLine(t);
  if(t.completionMode==='first')h=h.replace('</div><button class="iconbtn"', '<span class="tag">First Come, First Served</span></div><button class="iconbtn"');
  return h;
 };
})();
