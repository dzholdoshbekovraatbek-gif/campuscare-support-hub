'use strict';
(function(){
  if(document.body.dataset.page!=='incidents') return;
  const input=document.querySelector('#statusFilter');
  const tabs=Array.from(document.querySelectorAll('[data-quick-status]'));
  function refresh(){
    const data=getData('incidents');
    const counts={all:data.length,new:0,in_progress:0,resolved:0};
    for(const row of data) if(row.status in counts) counts[row.status]++;
    for(const tab of tabs){
      const v=tab.dataset.quickStatus;
      const active=input.value===v;
      tab.classList.toggle('active',active);
      tab.setAttribute('aria-pressed',String(active));
      const counter=tab.querySelector('.view-counter');
      if(counter)counter.textContent=counts[v];
    }
  }
  for(const tab of tabs)tab.addEventListener('click',()=>{
    input.value=tab.dataset.quickStatus;
    input.dispatchEvent(new Event('change',{bubbles:true}));
  });
  input.addEventListener('change',refresh);
  document.querySelector('#incidentTable') && new MutationObserver(()=>requestAnimationFrame(refresh))
      .observe(document.querySelector('#incidentTable'),{childList:true});
  document.addEventListener('ssh:saved',refresh);
  document.addEventListener('keydown',e=>{
    if(e.key==='/' && !e.ctrlKey && !e.metaKey && !e.altKey &&
       !(e.target instanceof HTMLInputElement) &&
       !(e.target instanceof HTMLTextAreaElement) &&
       !(e.target instanceof HTMLSelectElement) &&
       !document.querySelector('.entry-dialog')?.open){
      e.preventDefault();
      document.querySelector('#incidentSearch')?.focus();
    }
  });
  refresh();
})();
