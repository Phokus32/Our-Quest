/* Our Quest V3.5: grid-cell selection and targeted save repairs. */
'use strict';
const oq35Version='3.5.1';
const oq35TemplateIcons=new Map();
function oq35Ref(page,cell){return {page,cell,x:(cell%10)/10,y:Math.floor(cell/10)/10,size:.1}}
function oq35Icon(ref){if(!ref)return '✦';return atlasIconHtml(ref)}
function oq35Picker(callback,selected){
 if(typeof oq33EnsureAtlas==='function')oq33EnsureAtlas();
 const pages=(data.atlasPages||[]).filter(x=>atlasSource(x.id));
 if(!pages.length)return notify('No icon sheets found. Upload an atlas sheet first.');
 document.getElementById('oq35-picker')?.remove();
 const page=pages.find(x=>x.id===selected?.page)||pages[0];
 const holder=document.createElement('div');holder.id='oq35-picker';holder.className='modalback';holder.style.zIndex='120000';
 holder.innerHTML=`<div class="modal oq35-modal" role="dialog" aria-modal="true" aria-label="Select an icon"><div class="row between"><h2>Select an Icon</h2><button class="btn2" type="button" id="oq35-close">Close</button></div><label>Icon sheet<select id="oq35-page">${pages.map(x=>`<option value="${safe(x.id)}" ${x.id===page.id?'selected':''}>${safe(x.name||x.id)}</option>`).join('')}</select></label><p class="tiny muted">Tap an icon on the original sheet. The selection overlay is exactly 10 × 10 with no gaps or resizing.</p><div id="oq35-cells" class="oq35-cells"></div><p id="oq35-feedback" class="tiny muted">100 icons on this sheet</p></div>`;
 document.body.appendChild(holder);
 const close=()=>holder.remove();holder.querySelector('#oq35-close').onclick=close;
 holder.onclick=e=>{if(e.target===holder)close()};
 const grid=holder.querySelector('#oq35-cells');
 function draw(id){
  const src=atlasSource(id);
  // Render ONE intact image beneath an exactly coincident 10x10 hit grid.
  // Sprite backgrounds inside buttons drift because borders/gaps shrink their
  // painting areas; the image and grid must share the SAME coordinate space.
  grid.replaceChildren();
  const sheet=document.createElement('img');sheet.className='oq351-sheet';
  sheet.alt='Icon atlas sheet';sheet.src=src;sheet.draggable=false;
  sheet.onerror=()=>{holder.querySelector('#oq35-feedback').textContent='Could not load this atlas sheet. Check that its PNG is uploaded to assets.'};
  grid.appendChild(sheet);
  for(let i=0;i<100;i++){
   const b=document.createElement('button');b.type='button';b.className='oq35-cell';
   b.title=`Row ${Math.floor(i/10)+1}, column ${i%10+1}`;
   b.setAttribute('aria-label',b.title);
   b.style.left=`${i%10*10}%`;b.style.top=`${Math.floor(i/10)*10}%`;
   if(selected?.page===id&&(Number(selected.cell)===i||(!Number.isInteger(Number(selected.cell))&&Math.floor(Number(selected.y)*10)*10+Math.floor(Number(selected.x)*10)===i)))b.classList.add('selected');
   b.onclick=()=>{const ref=oq35Ref(id,i);try{callback(ref);close()}catch(err){console.error('Icon selection failed',err);notify('Could not apply icon: '+err.message)}};
   grid.appendChild(b);
  }
 }
 holder.querySelector('#oq35-page').onchange=e=>draw(e.target.value);draw(page.id);
}
// Preserve the existing icon storage format while replacing all crop interactions.
window.v16OpenCrop=function(target='task',index=-1){
 if(!isAdmin())return notify('Admin only');
 let current=target==='task'?pendingAtlas:target==='coupon'?v16CouponDraft?.atlas:target==='goal'?v15GoalDraft?.icon:target==='milestone'?v15GoalDraft?.milestones?.[index]?.icon:null;
 oq35Picker(ref=>{
  if(target==='task'){pendingAtlas=ref;const preview=document.getElementById('atlasChoicePreview');if(preview)preview.innerHTML=oq35Icon(ref)}
  else if(target==='coupon'){if(v16CouponDraft)v16CouponDraft.atlas=ref;const el=document.getElementById('v16CouponIconPreview');if(el)el.innerHTML=oq35Icon(ref)}
  else if(target==='goal'||target==='milestone'){if(!v15GoalDraft)return;v15SyncDraftForm();if(target==='goal')v15GoalDraft.icon=ref;else if(v15GoalDraft.milestones[index])v15GoalDraft.milestones[index].icon=ref;oq35RefreshGoal()}
 },current)
};
window.openAtlasPicker=()=>v16OpenCrop('task');
window.v15ChooseIcon=(target,index=-1)=>v16OpenCrop(target,index);
window.oq33PickIcon=function(cb){oq35Picker(cb)};
window.oq32RowIcon=function(id){const t=data.tasks.find(x=>x.id===id);oq35Picker(ref=>{oq32IconDraft[id]=ref;const el=document.getElementById('oq32-icon-'+id);if(el)el.innerHTML=oq35Icon(ref)},oq32IconDraft[id]||t?.atlas)};
// Replace the old grid selection with the exact same picker in library review.
const oq35OriginalActivation=window.oq3OpenActivation;
window.oq3OpenActivation=function(id){oq35OriginalActivation.apply(this,arguments);const holder=document.querySelector('.oq3-activation');if(!holder)return;
 holder.querySelectorAll('.oq3-activation-row').forEach((row,i)=>{const template=oq3Templates.find(t=>t.id===oq3Activation?.[i]);if(!template)return;
  const b=document.createElement('button');b.type='button';b.className='btn2';b.textContent='Choose Icon';
  const preview=document.createElement('span');preview.className='oq35-review-preview';preview.innerHTML=oq35Icon(oq35TemplateIcons.get(template.id)||oq3Ref(template.cell,template.atlasPage||'quest-tasks'));
  b.onclick=()=>oq35Picker(ref=>{oq35TemplateIcons.set(template.id,ref);preview.innerHTML=oq35Icon(ref)},oq35TemplateIcons.get(template.id));row.append(preview,b)
 });
};
const oq35OriginalActivate=window.oq3Activate;
window.oq3Activate=function(e){const before=new Set(data.tasks.map(t=>t.id));const chosen=[...(oq3Activation||[])];oq35OriginalActivate.apply(this,arguments);
 let updated=false;for(const t of data.tasks){if(before.has(t.id)||!chosen.includes(t.oq3TemplateId))continue;const icon=oq35TemplateIcons.get(t.oq3TemplateId);if(icon){t.atlas={...icon};updated=true}}
 if(updated){save();render()}for(const id of chosen)oq35TemplateIcons.delete(id);
};
// Annual availability is stored in YYYY-MM-DD for legacy compatibility but edited as MM/DD.
// Crucially prevent browser form submission before any validation, including invalid dates.
const oq35OriginalSubmit=window.submitModal;
window.submitModal=function(e,type,id){if(type==='task'||type==='editTask')e.preventDefault();return oq35OriginalSubmit.apply(this,arguments)};
// Ensure annual date range always uses a fixed valid year, with no page reload.
const oq35PreviousTaskModal=window.modalView;
window.modalView=function(){let html=oq35PreviousTaskModal();if(!modal||!/^(task|editTask)\|/.test(modal))return html;
 return html.replace(/name="oq32Start" type="text"/g,'name="oq32Start" type="text" inputmode="numeric"').replace(/name="oq32End" type="text"/g,'name="oq32End" type="text" inputmode="numeric"')
};
function oq35RefreshGoal(){const existing=[...document.querySelectorAll('body > .modalback')].find(x=>x.querySelector('form[onsubmit*="v15SaveGoal"]'));if(existing)existing.outerHTML=v15WeightEditorHtml()}
// Repair independent goal modal form saving, including milestone text edits.
window.v15SaveGoal=function(e){e.preventDefault();e.stopPropagation();if(!isAdmin()||!v15GoalDraft)return notify('Goal editor is not ready');
 try{const f=new FormData(e.target),g=v15GoalDraft;
 g.title=String(f.get('title')||'').trim();g.description=String(f.get('description')||'').trim();g.startWeight=Number(f.get('startWeight'));g.targetWeight=Number(f.get('targetWeight'));g.owner=String(f.get('owner')||g.owner);
 const rows=[...e.target.querySelectorAll('.weight-editor-milestone')];rows.forEach((row,i)=>{const m=g.milestones[i];if(!m)return;m.weight=Number(row.querySelector('input[type=number]')?.value);m.reward=row.querySelector('input[maxlength="200"]')?.value||'';m.description=row.querySelector('textarea[data-milestone-description]')?.value||m.description||''});
 if(!g.title||!Number.isFinite(g.startWeight)||!Number.isFinite(g.targetWeight)||g.startWeight<=g.targetWeight||g.targetWeight<=0)return notify('Check starting and final weights');
 if(g.milestones.some(m=>!Number.isFinite(m.weight)||m.weight<g.targetWeight||m.weight>g.startWeight))return notify('Milestone weights must be within the goal range');
 if(new Set(g.milestones.map(m=>m.weight)).size!==g.milestones.length)return notify('Each milestone must have a unique weight');
 const i=data.goals.findIndex(x=>x.id===g.id);if(i<0)return notify('Goal not found');const old=data.goals[i];g.currentWeight=old.currentWeight;g.weightHistory=old.weightHistory||[];
 for(const m of g.milestones){const prior=old.milestones?.find(x=>x.id===m.id);m.completed=Boolean(prior?.completed);m.rewardedAt=prior?.rewardedAt||null}
 data.goals[i]=JSON.parse(JSON.stringify(g));v15GoalDraft=null;v15IconTarget=null;modal='';document.querySelectorAll('body > .modalback').forEach(el=>{if(el.querySelector('form[onsubmit*="v15SaveGoal"]'))el.remove()});event('goal updated',g.title);save();render();notify('Goal and milestones saved');
 }catch(err){console.error('Goal save error',err);notify('Goal save failed: '+err.message)}
};
const oq35OldGoalHtml=window.v15WeightEditorHtml;
window.v15WeightEditorHtml=function(){let html=oq35OldGoalHtml();if(!html)return html;let idx=0;
 return html.replace(/(<div class="weight-editor-milestone">[\s\S]*?<div class="weight-editor-row">)/g,(match)=>{const m=v15GoalDraft?.milestones?.[idx++]||{};return `<div class="field oq35-milestone-description"><label>Milestone description</label><textarea data-milestone-description rows="2" placeholder="What does this milestone celebrate?">${safe(m.description||'')}</textarea></div>`+match})
};
// Keep the original modal's Save button from reloading the page even if a nested wrapper throws.
document.addEventListener('submit',e=>{if(e.target?.matches('form[onsubmit*="v15SaveGoal"],form[onsubmit*="submitModal"]'))e.preventDefault()},true);
// Ensure the on-screen version matches the actual files.
const oq35Render=window.render;
window.render=function(){const result=oq35Render.apply(this,arguments);document.querySelectorAll('.sidefoot').forEach(el=>{el.innerHTML=el.innerHTML.replace(/V3\.3\.2/g,'V3.5.1')});return result};
