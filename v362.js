/* Our Quest V3.6.2: unified coupon icon and quest icon integration */
'use strict';
(function(){
 const icon=ref=>ref&&typeof atlasIconHtml==='function'?atlasIconHtml(ref):'⚔';
 // Coupon draft is owned by v33.js, not the old v16 modal.
 window.oq361NewCouponIcon=function(){
  if(!isAdmin())return notify('Admin only');
  const draft=typeof oq33CouponDraft!=='undefined'?oq33CouponDraft:null;
  if(!draft)return notify('Open the coupon editor first');
  oq36Pick(ref=>{draft.atlas={...ref};const el=document.getElementById('oq33-coupon-icon');if(el)el.innerHTML=icon(ref)},draft.atlas);
 };
 // Correct the rendered shop cards, regardless of the older view's emoji markup.
 function refreshCouponIcons(){
  if(page!=='rewards')return;
  document.querySelectorAll('button[onclick^="buyReward("]').forEach(button=>{
   const id=button.getAttribute('onclick')?.match(/buyReward\('([^']+)'\)/)?.[1];
   const reward=data.rewards.find(r=>r.id===id);if(!reward?.atlas)return;
   const card=button.closest('.card');if(!card)return;
   let target=card.querySelector('.reward-icon');
   if(!target){const heading=card.querySelector('h2');target=heading?.previousElementSibling;if(!target||target.tagName==='IMG')return}
   target.innerHTML=icon(reward.atlas);
   target.classList.add('reward-icon','oq362-icon');
  });
 }
 let questDraft=null;
 window.oq362PickQuest=function(){
  if(!questDraft)questDraft={atlas:null};
  oq36Pick(ref=>{questDraft.atlas={...ref};const el=document.getElementById('oq362-quest-preview');if(el)el.innerHTML=icon(ref)},questDraft.atlas);
 };
 const priorOpen=window.openModal;
 window.openModal=function(type,id=''){
  if(type==='quest')questDraft={atlas:null};
  return priorOpen.apply(this,arguments);
 };
 const priorModal=window.modalView;
 window.modalView=function(){
  let html=priorModal.apply(this,arguments);
  if(modal?.split('|')[0]!=='quest')return html;
  const field=`<div class="field"><label>Quest Icon</label><div class="row" style="align-items:center;gap:12px"><div id="oq362-quest-preview" class="reward-icon" style="width:54px;height:54px;font-size:30px">${questDraft?.atlas?icon(questDraft.atlas):'⚔'}</div><button type="button" class="btn2" onclick="oq362PickQuest()">Choose Atlas Icon</button></div></div>`;
  return html.replace('<form onsubmit="submitModal(event,\'quest\',\'\')">','<form onsubmit="submitModal(event,\'quest\',\'\')">'+field);
 };
 const priorSubmit=window.submitModal;
 window.submitModal=function(e,type,id){
  if(type!=='quest')return priorSubmit.apply(this,arguments);
  const before=new Set((data.quests||[]).map(q=>q.id));
  const selected=questDraft?.atlas?{...questDraft.atlas}:null;
  const result=priorSubmit.apply(this,arguments);
  if(selected){const q=data.quests.find(q=>!before.has(q.id));if(q){q.atlas=selected;save();render()}}
  questDraft=null;return result;
 };
 const priorQuestLine=window.questLine;
 window.questLine=function(q){
  let html=priorQuestLine.apply(this,arguments);
  if(!q.atlas)return html;
  return html.replace('<div class="listline">',`<div class="listline oq362-quest"><div class="oq362-quest-icon">${icon(q.atlas)}</div>`);
 };
 const priorRender=window.render;
 window.render=function(){const r=priorRender.apply(this,arguments);refreshCouponIcons();return r};
})();
