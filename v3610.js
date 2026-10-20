/* Our Quest 3.6.10: server-atomic lightweight task completion and manual batch editing. */
'use strict';
(function(){
 let busy=false, batch=false, changes=0;
 const draftKey='oq3610-admin-draft';
 const cloudQueue=oqQueueSave;
 const originalLog=window.logTask;
 const originalRefresh=oqRefresh;
 function updateBanner(){
  document.getElementById('oq3610-bar')?.remove();
  if(!window.oqCloudActive || !isAdmin())return;
  const el=document.createElement('div');el.id='oq3610-bar';
  el.style.cssText='position:fixed;bottom:76px;right:12px;z-index:2000;max-width:min(94vw,410px);padding:10px 14px;background:#281d3c;color:#fff;border:1px solid #a58bca;border-radius:12px;box-shadow:0 5px 25px #0007;font-size:13px';
  if(batch){
   el.innerHTML='<b>Batch editing ON</b> · '+changes+' unsaved change(s)<div style="display:flex;gap:8px;margin-top:8px"><button id="oq3610-commit" class="btn">Save All Changes</button><button id="oq3610-cancel" class="btn2">Discard Draft</button></div>';
   el.querySelector('#oq3610-commit').onclick=commit;
   el.querySelector('#oq3610-cancel').onclick=discard;
  }else{
   el.innerHTML='<button id="oq3610-begin" class="btn2">Start Batch Editing</button>';
   el.querySelector('#oq3610-begin').onclick=begin;
  }
  document.body.appendChild(el);
 }
 function begin(){
  if(oqDirty||oqSaving)return notify('Wait for the current save to finish');
  batch=true;changes=0;
  localStorage.setItem(draftKey,JSON.stringify({base:oqRevision,payload:data}));
  updateBanner();notify('Edits stay on this device until Save All Changes');
 }
 function stage(){
  changes++;
  localStorage.setItem(draftKey,JSON.stringify({base:oqRevision,payload:data}));
  oqStatus('Unsaved batch edits ('+changes+')');updateBanner();
 }
 async function commit(){
  if(busy)return;
  busy=true;
  try{
   const {data:version,error}=await oqClient.from('oq_shared_state').select('revision').eq('id',1).maybeSingle();
   if(error)throw error;
   if(version?.revision!==oqRevision){alert('Another device changed the cloud data. Your local draft is preserved. Export a backup before refreshing, then reconcile your edits.');return}
   batch=false;
   oqDirty=true;
   await oqFlush();
   if(!oqReady){batch=true;return}
   localStorage.removeItem(draftKey);changes=0;updateBanner();notify('Batch saved to cloud');
  }catch(e){batch=true;notify('Save failed: '+e.message)}finally{busy=false;updateBanner()}
 }
 async function discard(){
  if(!confirm('Discard all unsaved batch changes and reload the cloud version?'))return;
  batch=false;changes=0;localStorage.removeItem(draftKey);
  const row=await oqLoad();if(row){data=oqNormalize(row.payload);migrate();oqRevision=row.revision;localStorage.setItem(KEY,JSON.stringify(data));render()}
  updateBanner();
 }
 // Intercept the central cloud-save hook. Batch edits still save local drafts.
 oqQueueSave=function(){if(batch){stage();return}cloudQueue()};
 window.oqCloudSave=function(){oqQueueSave()};
 oqRefresh=async function(force=false){if(batch)return;return originalRefresh(force)};
 // All task completions use a short authenticated RPC, rather than uploading full state.
 window.logTask=async function(id){
  if(!window.oqCloudActive)return originalLog(id);
  if(busy)return notify('Please wait for the previous action');
  if(batch)return notify('Save or discard your batch edits before completing tasks');
  if(oqDirty||oqSaving)return notify('Wait for cloud saving to finish');
  if(!navigator.onLine)return notify('Task completion requires a connection');
  const task=data.tasks.find(t=>t.id===id);
  if(!task||!taskVisible(task)||!taskAvailable(task))return notify('Task unavailable');
  busy=true;
  try{
   const {data:res,error}=await oqClient.rpc('oq_complete_task',{p_task_id:String(id),p_local_date:today(),p_expected_revision:oqRevision});
   if(error)throw error;
   if(!res?.saved){await originalRefresh(true);return notify(res?.reason==='claimed'?'Already completed for this period':'Changes detected. Please try again')}
   oqRevision=res.revision;
   data.logs.push(res.log);
   data.players=data.players.map(p=>p.id===res.player.id?res.player:p);
   data.ledger.unshift(...res.ledger);
   data.events.unshift(...res.events);
   if(res.achievements?.length)data.achievements.push(...res.achievements);
   localStorage.setItem(KEY,JSON.stringify(data));
   render();notify('✦ +'+res.log.xp+' XP earned!');
  }catch(e){console.error(e);notify('Task not saved: '+(e.message||e))}
  finally{busy=false;updateBanner()}
 };
 const baseRender=window.render;
 window.render=function(){baseRender();updateBanner()};
 window.addEventListener('beforeunload',e=>{if(batch&&changes){e.preventDefault();e.returnValue='Unsaved changes';}});
 // Do not silently overwrite a previously staged draft on startup.
 const savedDraft=localStorage.getItem(draftKey);
 if(savedDraft){setTimeout(()=>{if(window.oqCloudActive)notify('Unsaved batch draft found on this device. Export your backup before making new edits.');},2500)}
 setTimeout(updateBanner,1000);
})();
