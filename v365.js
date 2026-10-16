/* Our Quest 3.6.5: compact More navigation, goal deletion, provider purchase restrictions */
'use strict';
(function(){
 const oldBuy=window.buyReward;
 window.buyReward=function(id){const r=data.rewards.find(x=>x.id===id);if(r&&r.provider===data.current)return notify('You provide this coupon and cannot purchase it.');return oldBuy.apply(this,arguments)};
 const oldRender=window.render;
 function enhance(){
  // Consolidate all secondary navigation without removing the destination routes.
  document.querySelectorAll('main .oq21-nav-global').forEach(n=>n.remove());
  const side=document.querySelector('aside.side nav.nav');
  if(side&&!side.querySelector('.oq365-more')){
   const b=document.createElement('button');b.className='oq365-more'+(['calendar','chests','adventures','badges','journal','wishlist','analytics','history','search','economy','tasklibrary'].includes(page)?' active':'');b.innerHTML='<span>☷</span>More';b.onclick=()=>nav('more');side.append(b);
  }
  if(page==='rewards')document.querySelectorAll('button[onclick^="buyReward("]').forEach(b=>{
   const id=b.getAttribute('onclick')?.match(/buyReward\('([^']+)'\)/)?.[1],r=data.rewards.find(x=>x.id===id);
   if(!r||r.provider!==data.current)return;
   b.disabled=true;b.textContent='Provided by You';b.title='You can edit this coupon, but cannot buy your own coupon';
   const card=b.closest('.card');if(card&&!card.querySelector('.oq365-provider')){
    const note=document.createElement('p');note.className='oq365-provider tiny muted';note.textContent='You provide this coupon · Not available for your purchase';card.append(note)
   }
  });
  if(page==='goals'&&isAdmin()){
   const all=data.goals||[];
   document.querySelectorAll('.oq3-weight-panel').forEach(card=>{
    const h=card.querySelector('h2');if(!h)return;
    const g=all.find(x=>x.goalType==='weight'&&h.textContent.includes(x.title));
    if(g&&!card.querySelector('.oq365-delete'))card.insertAdjacentHTML('beforeend',`<div class="oq365-goal-actions"><button class="btn2 oq365-delete" onclick="oq365DeleteGoal('${g.id}')">Delete Goal</button></div>`);
   });
   // Non-weight goals live inside the legacy details area.
   const legacy=document.querySelector('.oq3-old-goals');
   if(legacy&&!legacy.querySelector('.oq365-other-goals')){
    const area=document.createElement('div');area.className='oq365-other-goals';
    area.innerHTML='<h3>Delete other goals</h3>'+all.filter(g=>g.goalType!=='weight').map(g=>`<div class="row between wrap"><span>${safe(g.title)}</span><button class="btn2" onclick="oq365DeleteGoal('${g.id}')">Delete Goal</button></div>`).join('');
    if(all.some(g=>g.goalType!=='weight'))legacy.append(area)
   }
  }
  document.querySelectorAll('.sidefoot').forEach(el=>{el.innerHTML=el.innerHTML.replace(/V3\.6\.[0-9]+/g,'V3.6.5')});
 }
 window.render=function(){const out=oldRender.apply(this,arguments);enhance();return out};
 const oldMore=window.moreView;
 window.moreView=function(){const options=[['calendar','Calendar'],['chests','Chests'],['adventures','Couple Adventures'],['badges','Achievements'],['journal','Journal'],['wishlist','Wishlist'],['analytics','Analytics'],['history','History'],['search','Search'],...(isAdmin()?[['economy','Economy'],['tasklibrary','Task Library']]:[])];return `<section class="card section"><h2>More</h2><p class="tiny muted">Additional pages and tools</p><div class="oq365-more-grid">${options.map(([id,name])=>`<button class="btn2" onclick="nav('${id}')">${name}</button>`).join('')}</div></section>`+oldMore()};
 window.oq365DeleteGoal=function(id){if(!isAdmin())return notify('Administrator only');const g=data.goals.find(x=>x.id===id);if(!g)return notify('Goal not found');const name=g.title||'Untitled Goal',count=(g.milestones||[]).length;if(!confirm(`Delete goal "${name}" and its ${count} milestone(s)?\n\nThis cannot be undone. Previously earned XP and gold will not be changed.`))return;const idx=data.goals.findIndex(x=>x.id===id);if(idx<0)return;data.goals.splice(idx,1);event('goal deleted',name);save();render();notify('Goal deleted')};
 // Ensure the goal can be deleted even when a legacy panel does not render.
 const oldGoals=window.goalsView;
 window.goalsView=function(){let html=oldGoals.apply(this,arguments);if(isAdmin()&&data.goals.length){html+=`<details class="oq365-goal-list"><summary>Manage / Delete Goals</summary>${data.goals.map(g=>`<div class="row between wrap"><span>${safe(g.title)}</span><button class="btn2" onclick="oq365DeleteGoal('${g.id}')">Delete Goal</button></div>`).join('')}</details>`}return html};
})();
