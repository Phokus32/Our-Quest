/* Our Quest V3.6.1: coupon-create icon and category editor integration repairs. */
'use strict';
(function(){
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const showIcon=ref=>ref&&typeof atlasIconHtml==='function'?atlasIconHtml(ref):'✨';
 // New-coupon drafts are distinct from the legacy coupon modal drafts.
 window.oq361NewCouponIcon=function(){
  if(typeof isAdmin==='function'&&!isAdmin())return;
  if(typeof oq36Pick!=='function')return notify('Icon picker is not available');
  const draft=typeof oq33CouponDraft!=='undefined'?oq33CouponDraft:null;
  const current=draft?.atlas||(typeof v16CouponDraft!=='undefined'?v16CouponDraft?.atlas:null);
  oq36Pick(ref=>{
   if(draft)draft.atlas={...ref};
   if(typeof v16CouponDraft!=='undefined'&&v16CouponDraft)v16CouponDraft.atlas={...ref};
   for(const id of ['oq33-coupon-icon','v16CouponIconPreview']){const el=document.getElementById(id);if(el)el.innerHTML=showIcon(ref)}
  },current);
 };
 // Dedicated modal: no dependency on older modal routing, works for all category records.
 const pending=new Map();
 window.oq361Categories=function(){
  if(typeof isAdmin==='function'&&!isAdmin())return notify('Admin only');
  document.getElementById('oq361-categories')?.remove();
  pending.clear();
  const cats=Array.isArray(data.categories)?data.categories:[];
  const dlg=document.createElement('dialog');dlg.id='oq361-categories';dlg.className='oq36-dialog';
  dlg.innerHTML=`<div class="oq36-head"><h2>Edit Category Names & Icons</h2><button type="button" class="btn2" id="oq361-close">Close</button></div><p class="tiny muted">Choose an icon for each category, rename categories and save your changes together. Existing tasks keep their history.</p><div id="oq361-rows">${cats.map((c,i)=>`<div class="oq361-category-row" data-row="${i}"><span class="oq361-category-icon" id="oq361-preview-${i}">${c.atlas?showIcon(c.atlas):esc(c.emoji||'✨')}</span><input aria-label="Category name" data-name="${i}" maxlength="60" value="${esc(c.name||'')}"><button type="button" class="btn2" data-pick="${i}">Choose Icon</button></div>`).join('')}</div><div class="actions" style="margin-top:16px"><button type="button" class="btn2" id="oq361-cancel">Cancel</button><button type="button" class="btn" id="oq361-save">Save Categories</button></div>`;
  document.body.appendChild(dlg);
  dlg.querySelector('#oq361-close').onclick=()=>dlg.close();dlg.querySelector('#oq361-cancel').onclick=()=>dlg.close();
  dlg.addEventListener('close',()=>dlg.remove(),{once:true});
  dlg.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{
   const i=Number(b.dataset.pick),existing=pending.get(i)||cats[i]?.atlas;
   if(typeof oq36Pick!=='function')return notify('Icon picker unavailable');
   oq36Pick(ref=>{pending.set(i,{...ref});const el=dlg.querySelector('#oq361-preview-'+i);if(el)el.innerHTML=showIcon(ref)},existing);
  });
  dlg.querySelector('#oq361-save').onclick=()=>{
   const changes=cats.map((c,i)=>({i,old:c.name,name:dlg.querySelector(`[data-name="${i}"]`)?.value.trim()||'',atlas:pending.get(i)}));
   if(changes.some(c=>!c.name))return notify('Every category needs a name');
   if(new Set(changes.map(c=>c.name.toLowerCase())).size!==changes.length)return notify('Category names must be unique');
   const renamed=new Map(changes.filter(c=>c.old!==c.name).map(c=>[c.old,c.name]));
   changes.forEach(c=>{cats[c.i].name=c.name;if(c.atlas)cats[c.i].atlas=c.atlas});
   for(const task of data.tasks||[]){if(renamed.has(task.category))task.category=renamed.get(task.category)}
   if(typeof event==='function')event('categories updated',changes.map(c=>c.name).join(', '));
   save();dlg.close();render();notify('Categories saved');
  };
  if(typeof dlg.showModal==='function')dlg.showModal();else dlg.setAttribute('open','');
 };
 const prev=window.render;
 window.render=function(){const out=prev.apply(this,arguments);document.querySelectorAll('.sidefoot').forEach(el=>{el.innerHTML=el.innerHTML.replace(/V3\.6\.0/g,'V3.6.1')});return out};
})();
