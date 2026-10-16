/* Our Quest 3.3 - additive compatibility layer. Existing cloud records are not reset. */
'use strict';
const oq33Version='3.3.2';
const oq33Safe=v=>safe(String(v??''));
const oq33Today=()=>{let d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
const oq33DatePart=v=>String(v||'').slice(5);
function oq33Available(t){let a=t.oq32Availability;if(!a||a.mode==='always')return true;let d=oq33Today();if(a.mode==='once')return (!a.start||d>=a.start)&&(!a.end||d<=a.end);if(a.mode==='annual'){let x=d.slice(5),start=oq33DatePart(a.start),end=oq33DatePart(a.end);if(!start||!end)return true;return start<=end?x>=start&&x<=end:x>=start||x<=end}return true}
// Persist view preference locally per device; do not change account permissions.
const oq33ViewKey='ourquest33-view';
let oq33View='admin';try{oq33View=localStorage.getItem(oq33ViewKey)||'admin'}catch{}
function oq33PlayerView(){return oq33ActualAdmin()&&oq33View==='player'}
function oq33SetView(v){oq33View=v==='player'?'player':'admin';try{localStorage.setItem(oq33ViewKey,oq33View)}catch{}render()}
// Global isAdmin is used by all existing permission checks. Player view is presentation only:
// retain the original authorization function for sensitive actions and never rewrite data.current.
function oq33ActualAdmin(){ return typeof data !== 'undefined' && !!data && data.current === 'matthew'; }
// Keep original lexical isAdmin unchanged: it is not exported on window.
// Presentation-only player view is applied to V3.3 UI controls.
// Goal editor: remove TDZ by changing its declaration in the base file to var; mount once.
window.v15EditGoal=function(id){
 if(!oq33ActualAdmin())return notify('Only Matthew can edit goals');
 let g=(data.goals||[]).find(x=>String(x.id)===String(id));if(!g)return notify('Goal not found');
 try{v15GoalDraft=JSON.parse(JSON.stringify(g));v15GoalDraft.milestones??=[];v15IconTarget=null;modal='v15WeightGoal|'+id;
 document.querySelectorAll('body > .modalback').forEach(e=>e.remove());document.body.insertAdjacentHTML('beforeend',v15WeightEditorHtml());
 }catch(e){console.error(e);notify('Goal editor error: '+e.message)}
};
// Render atlas references with x/y/size consistently, even for older cell references.
const oq33PriorIcon=window.atlasIconHtml;
window.atlasIconHtml=function(ref){if(!ref)return '✨';let src=atlasSource(ref.page);if(!src)return '✨';let size=Number(ref.size),x=Number(ref.x),y=Number(ref.y);
 if(!Number.isFinite(size)||size<=0){let n=Number(ref.cell)||0;size=.1;x=(n%10)/10;y=Math.floor(n/10)/10}
 x=Math.max(0,Math.min(1-size,Number.isFinite(x)?x:0));y=Math.max(0,Math.min(1-size,Number.isFinite(y)?y:0));
 let scale=100/size,px=(x/(1-size))*100,py=(y/(1-size))*100;
 return `<span class="atlas-icon oq33-atlas" style="display:inline-block;flex-shrink:0;background-image:url('${oq33Safe(src)}');background-size:${scale}% ${scale}%;background-position:${px}% ${py}%;background-repeat:no-repeat" role="img" aria-label="Selected atlas icon"></span>`;
};
// A shared picker for coupon and category icons: select a cell visually, no numeric prompts.
let oq33PickCallback=null;
function oq33PickIcon(callback){oq33PickCallback=callback;let pages=(data.atlasPages||[]).filter(p=>atlasSource(p.id));let id=pages[0]?.id;if(!id)return notify('No atlas sheets found');let holder=document.createElement('div');holder.className='modalback oq33-picker';holder.style.zIndex='11000';holder.innerHTML=`<div class="modal" style="width:min(780px,96vw)"><div class="row between"><h2>Choose an Atlas Icon</h2><button class="btn2" type="button" onclick="oq33ClosePicker()">Close</button></div><select id="oq33-page" onchange="oq33ShowGrid(this.value)">${pages.map(p=>`<option value="${oq33Safe(p.id)}">${oq33Safe(p.name||p.id)}</option>`).join('')}</select><div id="oq33-grid"></div></div>`;document.body.append(holder);oq33ShowGrid(id)}
function oq33ClosePicker(){document.querySelector('.oq33-picker')?.remove();oq33PickCallback=null}
function oq33ShowGrid(id){let src=atlasSource(id),el=document.getElementById('oq33-grid');if(!el||!src)return;el.innerHTML=`<div class="oq33-gridicons">${Array.from({length:100},(_,i)=>`<button type="button" aria-label="Icon ${i+1}" onclick="oq33ChooseIcon('${oq33Safe(id)}',${i})">${atlasIconHtml({page:id,cell:i})}</button>`).join('')}</div>`}
function oq33ChooseIcon(page,cell){let fn=oq33PickCallback;oq33ClosePicker();if(fn)fn({page,x:(cell%10)/10,y:Math.floor(cell/10)/10,size:.1,cell})}
// Task list: seasonal tasks disappear rather than appear disabled. Completion filter is independent of category.
let oq33TaskStatus='incomplete';
const oq33TasksOld=window.tasksView;
window.tasksView=function(){let html=oq33TasksOld();let tasks=data.tasks.filter(t=>taskVisible(t)&&!t.archived&&!t.hidden&&oq33Available(t)&&(filter==='All'||t.category===filter));
 if(oq33TaskStatus==='completed')tasks=tasks.filter(t=>countTask(t)>=maxTask(t));
 if(oq33TaskStatus==='incomplete')tasks=tasks.filter(t=>countTask(t)<maxTask(t));
 let start=html.indexOf('<section class="card">'),end=start<0?-1:html.indexOf('</section>',start);
 if(start>=0&&end>=0){let rows=tasks.map(t=>`<div class="row between" style="gap:5px"><div style="flex:1;min-width:0">${taskLine(t)}</div>${isAdmin()?`<button class="iconbtn" title="Edit task" onclick="openModal('editTask','${t.id}')">✎</button>`:''}</div>`).join('')||'<div class="empty">No matching tasks currently available.</div>';html=html.slice(0,start)+'<section class="card">'+rows+'</section>'+html.slice(end+10)}
 let controls=`<div class="oq33-filter"><label for="oq33-taskstatus">Completion</label><select id="oq33-taskstatus" onchange="oq33TaskStatus=this.value;render()"><option value="incomplete" ${oq33TaskStatus==='incomplete'?'selected':''}>Incomplete</option><option value="completed" ${oq33TaskStatus==='completed'?'selected':''}>Completed</option><option value="all" ${oq33TaskStatus==='all'?'selected':''}>All</option></select></div>`;
 return controls+html};
// Month/day editor for recurring annual availability, replacing year-based date inputs.
const oq33ModalOld=window.modalView;
window.modalView=function(){let html=oq33ModalOld();if(!modal||!/^(task|editTask)\|/.test(modal))return html;let id=modal.split('|')[1],t=data.tasks.find(t=>t.id===id),a=t?.oq32Availability||{mode:'always'};
 let monthDay=v=>/^\d{2}-\d{2}$/.test(v||'')?v:oq33DatePart(v);
 html=html.replace(/<fieldset class="oq32-fieldset">[\s\S]*?<\/fieldset>/,`<fieldset class="oq32-fieldset"><legend>Task availability</legend><label>Availability mode<select name="oq32Mode" onchange="oq33UpdateDateMode(this)"><option value="always" ${a.mode==='always'?'selected':''}>Always</option><option value="annual" ${a.mode==='annual'?'selected':''}>Annual month/day window</option><option value="once" ${a.mode==='once'?'selected':''}>One-time date range</option></select></label><div id="oq33-datefields" class="oq32-grid"><label>Start <input name="oq32Start" type="${a.mode==='once'?'date':'text'}" placeholder="MM-DD" value="${oq33Safe(a.mode==='annual'?monthDay(a.start):a.start||'')}"></label><label>End <input name="oq32End" type="${a.mode==='once'?'date':'text'}" placeholder="MM-DD" value="${oq33Safe(a.mode==='annual'?monthDay(a.end):a.end||'')}"></label></div><p class="tiny muted">For annual tasks, enter month and day, such as 09-01 and 10-15. Tasks outside the window are hidden.</p></fieldset>`);
 return html};
function oq33UpdateDateMode(el){let f=el.closest('fieldset');let annual=el.value==='annual',once=el.value==='once';f.querySelectorAll('[name=oq32Start],[name=oq32End]').forEach(input=>{input.type=once?'date':'text';input.placeholder=annual?'MM-DD':'';input.value=''});f.querySelector('#oq33-datefields').style.display=el.value==='always'?'none':''}
const oq33SubmitOld=window.submitModal;
window.submitModal=function(e,type,id){if(type!=='task'&&type!=='editTask')return oq33SubmitOld.apply(this,arguments);let f=new FormData(e.target),mode=String(f.get('oq32Mode')||'always'),a=String(f.get('oq32Start')||''),b=String(f.get('oq32End')||'');if(mode==='annual'){
 let valid=v=>/^\d{2}-\d{2}$/.test(v)&&(()=>{let [m,d]=v.split('-').map(Number);return m>=1&&m<=12&&d>=1&&d<=new Date(2024,m,0).getDate()})();if(!valid(a)||!valid(b))return notify('Use valid MM-DD dates for both annual boundaries');
 // Existing submit handler requires YYYY-MM-DD, so feed synthetic dates for validation only.
 e.target.querySelector('[name=oq32Start]').value='2026-'+a;e.target.querySelector('[name=oq32End]').value='2026-'+b;
 }return oq33SubmitOld.apply(this,arguments)};
// Category editing with atlas icons; rename linked tasks without changing task IDs/history.
function oq33Categories(){if(!oq33ActualAdmin()||oq33PlayerView())return;let cats=data.categories||[];oq31Open(`<h2>Manage Categories</h2><p class="tiny muted">Renaming updates linked tasks. Existing history stays intact.</p>${cats.map((c,i)=>`<div class="oq33-category"><span id="oq33-cat-icon-${i}">${c.atlas?atlasIconHtml(c.atlas):oq33Safe(c.emoji||'✨')}</span><input aria-label="Category name" id="oq33-cat-name-${i}" value="${oq33Safe(c.name)}"><button type="button" class="btn2" onclick="oq33CategoryIcon(${i})">Icon</button><button type="button" class="btn2" onclick="oq33SaveCategory(${i})">Save</button></div>`).join('')}<div class="actions"><button class="btn2" onclick="oq31Close()">Close</button></div>`)}
const oq33CatDraft={};
function oq33CategoryIcon(i){oq33PickIcon(ref=>{oq33CatDraft[i]=ref;let el=document.getElementById('oq33-cat-icon-'+i);if(el)el.innerHTML=atlasIconHtml(ref)})}
function oq33SaveCategory(i){if(!isAdmin())return;let c=data.categories?.[i];if(!c)return;let name=document.getElementById('oq33-cat-name-'+i)?.value.trim();if(!name)return notify('Enter category name');if(data.categories.some((x,j)=>j!==i&&x.name.toLowerCase()===name.toLowerCase()))return notify('Category already exists');let old=c.name;c.name=name;if(oq33CatDraft[i])c.atlas={...oq33CatDraft[i]};for(let t of data.tasks)if(t.category===old)t.category=name;event('category updated',name);save();oq33Categories();render();notify('Category saved')}
const oq33TasksWithCategory=window.tasksView;
window.tasksView=function(){let h=oq33TasksWithCategory();if(isAdmin())h=`<div class="row"><button class="btn2" onclick="oq361Categories()">Edit Category Names & Icons</button></div>`+h;return h};
// Coupon management: full editor with purchase mode, escalation, expiry, atlas icon.
let oq33CouponDraft=null;
function oq33CouponEditor(id=''){if(!isAdmin())return;let r=data.rewards.find(x=>x.id===id)||{},mode=r.oq33Mode||(r.oneTime?'once':Number(r.maxPurchases)>0?'limited':'unlimited');oq33CouponDraft={id,atlas:r.atlas||null};
 oq31Open(`<h2>${id?'Edit':'Create'} Coupon</h2><form onsubmit="oq33SaveCoupon(event)"><div class="field"><label>Name<input name="name" maxlength="80" required value="${oq33Safe(r.name||'')}"></label></div><div class="field"><label>Description<textarea name="description">${oq33Safe(r.description||'')}</textarea></label></div><div class="oq33-fields"><label>Starting gold price<input name="price" type="number" min="1" max="1000000" required value="${Number(r.price||100)}"></label><label>Provided by<select name="provider">${['matthew','beth','either'].map(x=>`<option value="${x}" ${r.provider===x?'selected':''}>${x}</option>`).join('')}</select></label></div><label>Purchase policy<select name="mode" onchange="oq33ModeUI(this.value)"><option value="once" ${mode==='once'?'selected':''}>One-time purchase</option><option value="unlimited" ${mode==='unlimited'?'selected':''}>Unlimited repeat purchases</option><option value="limited" ${mode==='limited'?'selected':''}>Limited repeat purchases</option></select></label><div class="oq33-fields"><label>Maximum purchases per player<input name="limit" type="number" min="1" max="100000" value="${Math.max(1,Number(r.maxPurchases)||1)}"></label><label>Gold price increase per repeat purchase<input name="increase" type="number" min="0" max="1000000" value="${Number(r.oq33PriceIncrease||0)}"></label><label>Expires this many days after purchase (0 = never)<input name="expiry" type="number" min="0" max="36500" value="${Number(r.expiryDays||0)}"></label></div><div class="row"><span id="oq33-coupon-icon">${r.atlas?atlasIconHtml(r.atlas):'🎁'}</span><button class="btn2" type="button" onclick="oq361NewCouponIcon()">Choose Atlas Icon</button></div><div class="actions"><button class="btn2" type="button" onclick="oq31Close()">Cancel</button><button class="btn" type="submit">Save Coupon</button></div></form>`)}
function oq33ModeUI(mode){let input=document.querySelector('.oq31-modal [name=limit]');if(input)input.disabled=mode!=='limited'}
function oq33SaveCoupon(e){e.preventDefault();if(!isAdmin())return;let f=new FormData(e.target),name=String(f.get('name')||'').trim(),price=Number(f.get('price')),mode=String(f.get('mode')),limit=Number(f.get('limit')),increase=Number(f.get('increase')),expiry=Number(f.get('expiry'));
 if(!name||!Number.isInteger(price)||price<1||!['once','unlimited','limited'].includes(mode)||mode==='limited'&&(!Number.isInteger(limit)||limit<1)||!Number.isInteger(increase)||increase<0||!Number.isInteger(expiry)||expiry<0)return notify('Check coupon values');
 let r=data.rewards.find(x=>x.id===oq33CouponDraft.id);if(!r){r={id:uid(),emoji:'🎁'};data.rewards.push(r)}Object.assign(r,{name,description:String(f.get('description')||''),price,provider:String(f.get('provider')),oneTime:mode==='once',maxPurchases:mode==='once'?1:mode==='limited'?limit:0,oq33Mode:mode,oq33PriceIncrease:increase,expiryDays:expiry,atlas:oq33CouponDraft.atlas||null});event('coupon saved',name);save();oq31Close();render();notify('Coupon saved')}
// Make coupon edit controls work regardless of legacy modal wrappers.
window.oq32CouponManage=function(){if(!isAdmin())return;oq31Open(`<h2>Manage Coupons</h2>${data.rewards.map(r=>`<div class="listline row between wrap"><span>${r.atlas?atlasIconHtml(r.atlas):'🎁'} ${oq33Safe(r.name)} · ${r.price} gold ${r.archived?'(archived)':''}</span><div class="row"><button class="btn2" onclick="oq31Close();oq33CouponEditor('${r.id}')">Edit</button><button class="btn2" onclick="oq32DeleteCoupon('${r.id}')">Delete</button></div></div>`).join('')}<div class="actions"><button class="btn2" onclick="oq31Close()">Close</button><button class="btn" onclick="oq31Close();oq33CouponEditor()">Create Coupon</button></div>`)};
const oq33RewardsOld=window.rewardsView;
window.rewardsView=function(){let h=oq33RewardsOld();if(isAdmin())h=`<div class="row"><button class="btn" onclick="oq32CouponManage()">Manage / Edit Coupons</button><button class="btn2" onclick="oq33CouponEditor()">New Coupon</button></div>`+h;return h};
const oq33BuyOld=window.buyReward;
window.buyReward=function(id){let r=data.rewards.find(x=>x.id===id);if(!r||r.archived)return notify('Coupon unavailable');let n=data.purchases.filter(p=>p.rewardId===id&&p.buyer===data.current).length,limit=Number(r.maxPurchases??(r.oneTime?1:0));if(limit>0&&n>=limit)return notify('Purchase limit reached');let increment=Number(r.oq33PriceIncrease||0),cost=Number(r.price)+n*increment;if(me().coins<cost)return notify(`You need ${cost} gold`);
 // Legacy purchase handler reads r.price. Temporarily override synchronously, then restore.
 let base=r.price,existing=new Set(data.purchases.map(p=>p.id));try{r.price=cost;oq33BuyOld(id)}finally{r.price=base}let p=data.purchases.find(p=>!existing.has(p.id)&&p.rewardId===id&&p.buyer===data.current);if(p){p.rewardPrice=cost;p.rewardName??=r.name;p.rewardDescription??=r.description;save()}render()};
// Correct shop prices and icon display using DOM updates after render, not by fragile nested regex.
function oq33UpdateShop(){if(page!=='rewards')return;document.querySelectorAll('button[onclick^="buyReward("]').forEach(b=>{let id=b.getAttribute('onclick')?.match(/buyReward\('([^']+)'\)/)?.[1],r=data.rewards.find(x=>x.id===id);if(!r)return;let n=data.purchases.filter(p=>p.rewardId===id&&p.buyer===data.current).length,cost=Number(r.price)+n*Number(r.oq33PriceIncrease||0),max=Number(r.maxPurchases??(r.oneTime?1:0));let card=b.closest('.card');if(card){let price=card.querySelector('.gold');if(price)price.textContent='🪙 '+cost;let icon=card.querySelector('.reward-icon');if(icon&&r.atlas)icon.innerHTML=atlasIconHtml(r.atlas)}b.disabled=!!r.archived||(max>0&&n>=max)||me().coins<cost})}
// Existing atlas pages may not be preloaded on mobile. Add all bundled sheets and a load fallback.
function oq33EnsureAtlas(){if(typeof oqEnsureAtlasPages==='function')oqEnsureAtlasPages();for(let p of data.atlasPages||[])if(p.src&&(!atlasSources[p.id]||atlasSources[p.id].startsWith('blob:')))atlasSources[p.id]=p.src}
const oq33RenderOld=window.render;
window.render=function(){oq33EnsureAtlas();let out=oq33RenderOld.apply(this,arguments);document.querySelectorAll('.sidefoot').forEach(el=>{el.innerHTML=el.innerHTML.replace(/V\d+(?:\.\d+){1,2}/g,'V'+oq33Version);el.querySelectorAll('.oq32-version').forEach(x=>x.textContent='Our Quest V'+oq33Version)});
 if(typeof oq33ActualAdmin === 'function' && oq33ActualAdmin()){let nav=document.querySelector('.sidefoot');if(nav&&!nav.querySelector('.oq33-toggle'))nav.insertAdjacentHTML('afterbegin',`<div class="oq33-toggle"><label>Matthew's View</label><select onchange="oq33SetView(this.value)"><option value="admin" ${oq33View==='admin'?'selected':''}>Admin View</option><option value="player" ${oq33View==='player'?'selected':''}>Player View</option></select></div>`)}
 oq33UpdateShop();return out};
// Use local calendar dates rather than UTC date for seasonal windows.
window.oq32Available=oq33Available;
// Do not force a second render at script evaluation time. Cloud bootstrap calls render after loading the authenticated state.
