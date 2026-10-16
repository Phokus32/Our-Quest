/* Our Quest V3.6: one universal, adjustable atlas picker and atlas management. */
'use strict';
(function(){
 const VERSION='3.6.0';
 const safeText=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
 const pages=()=>Array.isArray(data?.atlasPages)?data.atlasPages:[];
 const hidden=()=>Array.isArray(data?.oq36DeletedAtlasIds)?data.oq36DeletedAtlasIds:[];
 function activePages(){return pages().filter(p=>!hidden().includes(p.id)&&!!atlasSource(p.id))}
 function crop(ref,page){if(ref&&Number.isFinite(Number(ref.x))&&Number(ref.size)>0)return {page:ref.page||page,x:Number(ref.x),y:Number(ref.y),size:Number(ref.size)};if(ref&&Number.isInteger(Number(ref.cell))){let n=Number(ref.cell);return {page:ref.page||page,x:n%10/10,y:Math.floor(n/10)/10,size:.1}}return {page,x:.35,y:.35,size:.12}}
 function icon(ref){return typeof atlasIconHtml==='function'?atlasIconHtml(ref):'✦'}
 function pick(cb,existing){
  if(typeof oqEnsureAtlasPages==='function')oqEnsureAtlasPages();
  const sheets=activePages();if(!sheets.length){notify('No available icon sheets. Upload a sheet in the Atlas.');return}
  document.getElementById('oq36-picker')?.remove();
  let ref=crop(existing,sheets.find(p=>p.id===existing?.page)?.id||sheets[0].id);
  ref.size=clamp(ref.size,.035,.45);ref.x=clamp(ref.x,0,1-ref.size);ref.y=clamp(ref.y,0,1-ref.size);
  const dlg=document.createElement('dialog');dlg.id='oq36-picker';dlg.className='oq36-dialog';
  dlg.innerHTML=`<div class="oq36-head"><h2>Choose Icon</h2><button type="button" class="btn2" data-action="close">Close</button></div><label class="field">Icon sheet<select id="oq36-page">${sheets.map(p=>`<option value="${safeText(p.id)}" ${p.id===ref.page?'selected':''}>${safeText(p.name||p.id)}</option>`).join('')}</select></label><p class="tiny muted">Drag the gold square over an icon. Adjust its size to fit the artwork. The preview shows exactly what will be saved.</p><div class="oq36-stage" id="oq36-stage"><img id="oq36-img" alt="Icon sheet" draggable="false"><div id="oq36-box" role="img" aria-label="Draggable square selection"></div></div><div class="oq36-controls"><label>Square size <input id="oq36-size" type="range" min="3.5" max="45" step="0.5"></label><button type="button" class="btn2" id="oq36-grid">Snap to nearest 10×10 cell</button></div><div class="oq36-bottom"><div class="oq36-preview" id="oq36-preview"></div><div class="tiny muted" id="oq36-coords"></div><div class="actions"><button type="button" class="btn2" data-action="close">Cancel</button><button type="button" class="btn" id="oq36-apply">Use This Icon</button></div></div>`;
  document.body.appendChild(dlg);
  const stage=dlg.querySelector('#oq36-stage'),img=dlg.querySelector('#oq36-img'),square=dlg.querySelector('#oq36-box'),slider=dlg.querySelector('#oq36-size');
  const update=()=>{ref.size=clamp(ref.size,.035,.45);ref.x=clamp(ref.x,0,1-ref.size);ref.y=clamp(ref.y,0,1-ref.size);square.style.cssText=`left:${ref.x*100}%;top:${ref.y*100}%;width:${ref.size*100}%;height:${ref.size*100}%`;slider.value=String(ref.size*100);dlg.querySelector('#oq36-preview').innerHTML=icon(ref);dlg.querySelector('#oq36-coords').textContent=`Crop: ${Math.round(ref.x*1000)/10}% × ${Math.round(ref.y*1000)/10}% · ${Math.round(ref.size*1000)/10}% size`};
  const setPage=id=>{ref=crop(null,id);img.src=atlasSource(id);update()};
  img.src=atlasSource(ref.page);img.onerror=()=>notify('Atlas image failed to load. Check your assets folder.');update();
  dlg.querySelector('#oq36-page').onchange=e=>setPage(e.target.value);
  slider.oninput=e=>{let cx=ref.x+ref.size/2,cy=ref.y+ref.size/2;ref.size=Number(e.target.value)/100;ref.x=cx-ref.size/2;ref.y=cy-ref.size/2;update()};
  dlg.querySelector('#oq36-grid').onclick=()=>{const cx=ref.x+ref.size/2,cy=ref.y+ref.size/2;ref.size=.1;ref.x=clamp(Math.floor(cx*10),0,9)/10;ref.y=clamp(Math.floor(cy*10),0,9)/10;update()};
  let drag=null;
  const point=e=>{const r=stage.getBoundingClientRect();return {x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height}};
  stage.onpointerdown=e=>{if(e.button!==0&&e.pointerType==='mouse')return;e.preventDefault();const p=point(e);drag={dx:p.x-ref.x,dy:p.y-ref.y};if(e.target!==square){drag.dx=ref.size/2;drag.dy=ref.size/2;ref.x=p.x-drag.dx;ref.y=p.y-drag.dy;update()}stage.setPointerCapture(e.pointerId)};
  stage.onpointermove=e=>{if(!drag)return;const p=point(e);ref.x=p.x-drag.dx;ref.y=p.y-drag.dy;update()};
  const stop=()=>drag=null;stage.onpointerup=stop;stage.onpointercancel=stop;
  dlg.querySelectorAll('[data-action="close"]').forEach(b=>b.onclick=()=>dlg.close());
  dlg.querySelector('#oq36-apply').onclick=()=>{try{cb({...ref});dlg.close()}catch(err){console.error('Atlas apply failed',err);notify('Could not save icon selection: '+err.message)}};
  dlg.addEventListener('close',()=>dlg.remove());
  // Native modal dialog enters the browser top layer, above coupon/goal/task modals.
  if(typeof dlg.showModal==='function')dlg.showModal();else{dlg.setAttribute('open','');dlg.style.zIndex='2147483647'}
 }
 window.oq36Pick=pick;
 window.v16OpenCrop=function(target='task',index=-1){
  if(!isAdmin())return notify('Admin only');
  const current=target==='task'?pendingAtlas:target==='coupon'?v16CouponDraft?.atlas:target==='goal'?v15GoalDraft?.icon:target==='milestone'?v15GoalDraft?.milestones?.[index]?.icon:null;
  if((target==='goal'||target==='milestone')&&typeof v15SyncDraftForm==='function')v15SyncDraftForm();
  pick(ref=>{
   if(target==='task'){pendingAtlas=ref;const preview=document.getElementById('taskIconLivePreview');if(preview)preview.innerHTML=icon(ref);const label=document.getElementById('atlasChoicePreview');if(label)label.textContent='Icon selected. Save task to apply.'}
   else if(target==='coupon'){v16CouponDraft??={};v16CouponDraft.atlas=ref;const el=document.getElementById('v16CouponIconPreview');if(el)el.innerHTML=icon(ref)}
   else if(target==='goal'||target==='milestone'){if(!v15GoalDraft)return;if(target==='goal')v15GoalDraft.icon=ref;else if(v15GoalDraft.milestones?.[index])v15GoalDraft.milestones[index].icon=ref;if(typeof oq35RefreshGoal==='function')oq35RefreshGoal();else if(typeof v15RefreshEditor==='function')v15RefreshEditor()}
  },current);
 };
 window.openAtlasPicker=()=>window.v16OpenCrop('task');
 window.v15ChooseIcon=(target,index=-1)=>window.v16OpenCrop(target,index);
 window.oq33PickIcon=(cb,ref)=>pick(cb,ref);
 window.oq32RowIcon=function(id){const t=data.tasks.find(x=>x.id===id);pick(ref=>{oq32IconDraft[id]=ref;const el=document.getElementById('oq32-icon-'+id);if(el)el.innerHTML=icon(ref)},oq32IconDraft[id]||t?.atlas)};
 // Activation review uses this same picker, and V3.5's activation-save wrapper
 // already reads the oq35TemplateIcons map.
 window.oq3OpenActivation=((original)=>function(){const result=original.apply(this,arguments);const holder=document.querySelector('.oq3-activation');if(!holder)return result;holder.querySelectorAll('.oq3-activation-row').forEach((row,i)=>{const template=oq3Templates.find(t=>t.id===oq3Activation?.[i]);if(!template)return;let button=row.querySelector('.oq36-activation-icon');if(!button){button=document.createElement('button');button.type='button';button.className='btn2 oq36-activation-icon';button.textContent='Choose Icon';row.append(button)}button.onclick=()=>pick(ref=>{oq35TemplateIcons.set(template.id,ref);let preview=row.querySelector('.oq35-review-preview');if(preview)preview.innerHTML=icon(ref)},oq35TemplateIcons.get(template.id))});return result})(window.oq3OpenActivation);
 // Rename/delete are permitted for built-in sheets too. Built-in file deletion
 // is logical (hide metadata), because GitHub static assets cannot be deleted
 // by a browser. This preserves stable IDs for other sheets.
 function usages(id){const found=[];const visited=new WeakSet();function scan(obj,path,depth){if(!obj||typeof obj!=='object'||depth>12||visited.has(obj))return;visited.add(obj);if(obj.page===id&&(obj.cell!==undefined||obj.x!==undefined)){found.push({obj,path});return}if(Array.isArray(obj)){obj.forEach((v,i)=>scan(v,path+'['+i+']',depth+1));return}for(const [k,v] of Object.entries(obj)){if(k==='atlasPages'||k==='oq36DeletedAtlasIds')continue;scan(v,path+'.'+k,depth+1)}}scan(data,'data',0);return found}
 window.oq36Rename=function(id){const p=pages().find(x=>x.id===id);if(!p)return;const name=prompt('Rename icon sheet',p.name||p.id);if(!name?.trim())return;p.name=name.trim();save();render();notify('Icon sheet renamed')};
 window.oq36Delete=function(id){const p=pages().find(x=>x.id===id);if(!p)return;const refs=usages(id);const message=refs.length?`This sheet is used by ${refs.length} saved icon selection(s). Deleting it will replace those selections with their default icon. Continue?`:'Delete this icon sheet from the app?';if(!confirm(message))return;
  // A second confirmation prevents accidentally destroying referenced crops.
  if(refs.length&&!confirm('Confirm replacing all affected icons with defaults. This cannot be undone without restoring a backup.'))return;
  refs.forEach(({obj})=>{obj.page='__deleted__';delete obj.cell;delete obj.x;delete obj.y;delete obj.size});
  data.oq36DeletedAtlasIds??=[];if(!data.oq36DeletedAtlasIds.includes(id))data.oq36DeletedAtlasIds.push(id);
  data.atlasPages=data.atlasPages.filter(x=>x.id!==id);if(typeof atlasPickerPage!=='undefined')atlasPickerPage=activePages()[0]?.id||'';
  save();render();notify('Sheet removed from atlas. Existing artwork files are not deleted from GitHub.')
 };
 const oldAtlasView=window.atlasView;
 window.atlasView=function(){let html=oldAtlasView();if(!isAdmin())return html;const p=activePages().find(x=>x.id===atlasPickerPage)||activePages()[0];if(!p)return html;
  // Add controls even for original built-in sheets.
  const tools=`<div class="row wrap oq36-atlas-tools"><button class="btn2" type="button" onclick="oq36Rename('${safeText(p.id)}')">Rename Sheet</button><button class="btn2" type="button" onclick="oq36Delete('${safeText(p.id)}')">Delete Sheet</button></div>`;
  html=html.replace(/<div class="row wrap" style="margin-top:12px"><button class="btn2" onclick="renameAtlas\('[^']+'\)">Rename Page<\/button><button class="btn2" onclick="deleteAtlas\('[^']+'\)">Delete Page<\/button><\/div>/g,'');
  return html.replace('</div><div class="card section">',tools+'</div><div class="card section">')
 };
 const oldRender=window.render;
 window.render=function(){if(typeof data!=='undefined'&&data&&Array.isArray(data.atlasPages)&&hidden().length){data.atlasPages=data.atlasPages.filter(p=>!hidden().includes(p.id))}const result=oldRender.apply(this,arguments);document.querySelectorAll('.sidefoot').forEach(el=>{el.innerHTML=el.innerHTML.replace(/V3\.5\.1|V3\.5\.0|V3\.3\.2/g,'V3.6.0')});return result};
})();
