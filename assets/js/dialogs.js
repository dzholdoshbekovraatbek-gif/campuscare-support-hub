'use strict';
(function(){
  const dialog=document.querySelector('dialog.entry-dialog');
  if(!dialog) return;
  const opener=document.querySelector('a[href="#'+dialog.id+'"]');
  const close=()=>{
    if(dialog.open) dialog.close();
    document.body.classList.remove('dialog-open');
    if(location.hash==='#'+dialog.id) history.replaceState(null,'',location.pathname+location.search);
  };
  function openDialog(event){
    if(event)event.preventDefault();
    if(!dialog.open)dialog.showModal();
    document.body.classList.add('dialog-open');
    const first=dialog.querySelector('input:not([type=hidden]),select,textarea');
    if(first)requestAnimationFrame(()=>first.focus());
  }
  opener?.addEventListener('click',openDialog);
  dialog.querySelector('.dialog-close')?.addEventListener('click',close);
  dialog.addEventListener('close',()=>document.body.classList.remove('dialog-open'));
  dialog.addEventListener('click',e=>{
    if(e.target!==dialog)return;
    const r=dialog.getBoundingClientRect();
    if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();
  });
  document.addEventListener('ssh:saved',close);
  if(location.hash==='#'+dialog.id)openDialog();
  const title=dialog.querySelector('input[aria-describedby]');
  if(title)title.addEventListener('input',()=>{
    if(title.value.trim()){
      title.removeAttribute('aria-invalid');
      const err=document.getElementById(title.getAttribute('aria-describedby'));
      if(err)err.textContent='';
    }
  });
})();
