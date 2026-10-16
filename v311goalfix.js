/* V3.1.1: open weight goal editor without a full app re-render. */
(function(){
  'use strict';
  window.v15EditGoal=function(id){
    try {
      if(!isAdmin())return notify('Only Matthew can edit goal definitions');
      const goal=(data.goals||[]).find(g=>String(g.id)===String(id));
      if(!goal)return notify('Goal not found');
      if(goal.goalType!=='weight')return notify('This editor is for weight-loss goals');
      // Draft is kept separate from the cloud record until Save is pressed.
      v15GoalDraft=JSON.parse(JSON.stringify(goal));
      v15GoalDraft.milestones??=[];
      v15IconTarget=null;
      modal='v15WeightGoal|'+id;
      document.querySelectorAll('.modalback').forEach(el=>el.remove());
      document.body.insertAdjacentHTML('beforeend',v15WeightEditorHtml());
      const editor=document.querySelector('body > .modalback:last-of-type');
      if(!editor)throw new Error('Editor dialog was not created');
      editor.style.zIndex='10050';
      editor.querySelector('input[name="title"]')?.focus();
    } catch(err){
      console.error('Weight goal editor:',err);
      alert('Could not open weight goal editor: '+(err?.message||String(err)));
    }
  };
  // On Cancel/close, remove the independently mounted editor as well.
  const oldClose=window.closeModal;
  window.closeModal=function(){
    document.querySelectorAll('body > .modalback').forEach(el=>el.remove());
    return oldClose.apply(this,arguments);
  };
})();
