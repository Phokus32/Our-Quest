/* Our Quest 3.6.3: quest negotiation and layout cleanup */
(function(){
 const esc=s=>typeof safe==='function'?safe(s):String(s);
 const oldLine=window.questLine;
 window.questLine=function(q){
  let html=oldLine(q), canTalk=q.from===data.current||q.to===data.current;
  if(!canTalk)return html;
  const pending=q.status==='pending',submitted=q.status==='submitted';
  const actionButtons=`<div class="row wrap oq363-actions">
   ${pending?`<button class="btn2 tiny" onclick="oq363Counter('${q.id}')">Counteroffer XP</button>`:''}
   ${submitted&&q.from===data.current?`<button class="btn2 tiny" onclick="oq363More('${q.id}')">Request More Work</button>`:''}
   <button class="btn2 tiny" onclick="oq363Comment('${q.id}')">Reply with Comment</button></div>`;
  const history=(q.history||[]).filter(h=>h.comment||h.action==='counteroffer'||h.action==='counter-accepted'||h.action==='more-work').slice(-8).map(h=>`<div class="tiny muted oq363-history">${esc((data.players.find(p=>p.id===h.actor)||{}).name||h.actor||'Player')}: ${esc(h.comment||h.action)}${h.offer!=null?' · '+Number(h.offer)+' XP':''}</div>`).join('');
  const offer=q.oq363Offer;
  const negotiation=offer&&offer.to===data.current&&pending?`<div class="oq363-offer">Counteroffer: <b>${Number(offer.xp)} XP</b> <button class="btn tiny" onclick="oq363Resolve('${q.id}',true)">Accept XP</button> <button class="btn2 tiny" onclick="oq363Resolve('${q.id}',false)">Decline Offer</button></div>`:'';
  return html.replace(/<\/div>\s*$/,`${negotiation}${actionButtons}${history}</div>`);
 };
 function get(id){return data.quests.find(q=>q.id===id)}
 function record(q,action,comment,extra={}){q.history??=[];q.history.push({action,actor:data.current,at:new Date().toISOString(),comment,...extra});event('quest '+action,q.title);save();render();notify('Quest updated')}
 window.oq363Comment=function(id){const q=get(id);if(!q)return;const c=prompt('Reply to this quest (comment):');if(c===null||!c.trim())return;record(q,'comment',c.trim().slice(0,1000))};
 window.oq363Counter=function(id){const q=get(id);if(!q||q.status!=='pending'||![q.from,q.to].includes(data.current))return;const val=prompt('Propose a new XP amount:',String(q.xp));if(val===null)return;const xp=Number(val);if(!Number.isInteger(xp)||xp<1||xp>100000)return notify('Enter a whole-number XP amount from 1 to 100000');q.oq363Offer={xp,from:data.current,to:q.from===data.current?q.to:q.from};record(q,'counteroffer','', {offer:xp})};
 window.oq363Resolve=function(id,accept){const q=get(id),o=q?.oq363Offer;if(!o||o.to!==data.current||q.status!=='pending')return;if(accept)q.xp=o.xp;delete q.oq363Offer;record(q,accept?'counter-accepted':'counter-declined','',accept?{offer:q.xp}:{})};
 window.oq363More=function(id){const q=get(id);if(!q||q.from!==data.current||q.status!=='submitted')return;const comment=prompt('What additional work is required?');if(comment===null||!comment.trim())return;q.status='accepted';record(q,'more-work',comment.trim().slice(0,1000))};
 const oldAction=window.questAction;
 window.questAction=function(id,status){const q=get(id);if(q?.oq363Offer&&status==='accepted')return notify('Resolve the XP counteroffer before accepting');return oldAction.apply(this,arguments)};
 const oldRewards=window.rewardsView;
 window.rewardsView=function(){let html=oldRewards();html=html.replace(/<button[^>]*onclick="oq32CouponManage\(\)"[^>]*>[^<]*Manage \/ Edit Coupons<\/button>/g,'');html=html.replace(/<button[^>]*onclick="openModal\('reward'\)"[^>]*>[^<]*Create Coupon<\/button>/g,'');return html};
 const oldRender=window.render;
 window.render=function(){const out=oldRender.apply(this,arguments);document.querySelectorAll('.sidefoot').forEach(el=>el.innerHTML=el.innerHTML.replace(/V3\.6\.[0-9]+/g,'V3.6.3'));return out};
})();
