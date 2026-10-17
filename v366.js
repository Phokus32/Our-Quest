/* Our Quest 3.6.6: consistent atlas crop, visible goal deletion, task dedupe, shop cleanup */
'use strict';
(function(){
 const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const originalIcon=window.atlasIconHtml;
 // A square SVG viewport with an image positioned by normalized crop coordinates.
 // Unlike CSS background-size/position, this does not depend on the parent element's
 // aspect ratio, its padding, or competing legacy .atlas-icon CSS selectors.
 window.atlasIconHtml=function(ref){
  if(!ref||!ref.page||typeof atlasSource!=='function')return originalIcon(ref);
  const source=atlasSource(ref.page);if(!source)return originalIcon(ref);
  let z=Number(ref.size),x=Number(ref.x),y=Number(ref.y);
  if(!(Number.isFinite(z)&&z>0&&Number.isFinite(x)&&Number.isFinite(y))){
   const cell=Number(ref.cell);if(!Number.isInteger(cell)||cell<0||cell>99)return originalIcon(ref);
   z=.1;x=(cell%10)/10;y=Math.floor(cell/10)/10;
  }
  z=Math.max(.005,Math.min(1,z));x=Math.max(0,Math.min(1-z,x));y=Math.max(0,Math.min(1-z,y));
  const scale=100/z,px=-x*scale,py=-y*scale;
  return `<span class="oq366-icon" role="img" aria-label="Atlas icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><image href="${escapeHtml(source)}" x="${px.toFixed(6)}" y="${py.toFixed(6)}" width="${scale.toFixed(6)}" height="${scale.toFixed(6)}" preserveAspectRatio="none" /></svg></span>`;
 };
 // The preview in the V3.6 picker calls atlasIconHtml dynamically; no independent
 // crop math remains between the preview and the saved task/coupon/goal/quest.
 const oldRender=window.render;
 function tidy(){
  if(page==='rewards'){
   // Keep the top action pair; remove only later duplicate manage/edit buttons.
   const buttons=[...document.querySelectorAll('main button')].filter(b=>/manage\s*\/\s*edit coupons/i.test(b.textContent||''));
   buttons.slice(1).forEach(b=>b.remove());
  }
  if(page==='goals'&&isAdmin()){
   // Place deletion next to each goal's existing Edit control, not buried in details.
   document.querySelectorAll('main .oq3-weight-panel').forEach(panel=>{
    if(panel.querySelector('.oq366-delete-goal'))return;
    const title=panel.querySelector('h2')?.textContent?.trim();
    const goal=(data.goals||[]).find(g=>g.goalType==='weight'&&title?.includes(g.title));
    if(!goal)return;
    const edit=[...panel.querySelectorAll('button')].find(b=>/edit goal/i.test(b.textContent));
    if(!edit)return;
    const button=document.createElement('button');button.type='button';button.className='btn2 oq366-delete-goal';button.textContent='Delete Goal';
    button.onclick=()=>window.oq365DeleteGoal(goal.id);
    edit.insertAdjacentElement('afterend',button);
   });
  }
  if(page==='tasks'&&!isAdmin()){
   // Older render wrappers sometimes append the same task list twice. Remove
   // repeated DOM cards only, without deleting task records or completion logs.
   const seen=new Set();document.querySelectorAll('main .task').forEach(el=>{
    const id=el.getAttribute('data-task-id');
    const name=el.querySelector('.taskName')?.textContent?.trim();
    const key=id||name;
    if(!key)return;
    if(seen.has(key))el.remove();else seen.add(key);
   });
  }
  document.querySelectorAll('.sidefoot').forEach(el=>{
   el.innerHTML=el.innerHTML.replace(/V3\.6\.[0-9]+/g,'V3.6.6');
  });
 }
 window.render=function(){const result=oldRender.apply(this,arguments);tidy();return result};
 // Ensure all icons that render after a picker selection also use the same SVG.
 // Initial render occurs after the new script is loaded.
 try{render()}catch(e){console.error('V3.6.6 initial render:',e)}
})();
