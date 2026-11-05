'use strict';
(function(){
  const themeButton=document.querySelector('#themeButton');
  function applyTheme(theme){document.documentElement.dataset.theme=theme;try{localStorage.setItem(STORE_PREFIX+'theme',theme);}catch{};document.querySelector('#themeText').textContent=theme==='dark'?'Светлая тема':'Тёмная тема';themeButton.setAttribute('aria-label',theme==='dark'?'Включить светлую тему':'Включить тёмную тему');}
  let theme='dark';try{const saved=localStorage.getItem(STORE_PREFIX+'theme');theme=saved==='light'?'light':'dark';}catch{};applyTheme(theme);
  themeButton.addEventListener('click',()=>applyTheme(document.documentElement.dataset.theme==='dark'?'light':'dark'));
  const menu=document.querySelector('#menuToggle');menu.addEventListener('click',()=>{const open=document.querySelector('#sidebar').classList.toggle('show');menu.setAttribute('aria-expanded',String(open));});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.querySelector('#sidebar').classList.remove('show');menu.setAttribute('aria-expanded','false');}});
  const latest=latestRelease();if(latest)document.querySelector('#headerVersion').textContent=latest.version;
})();
let toastTimer;
window.notify=(message,isError=false)=>{const el=document.querySelector('#toast');el.textContent=message;el.classList.toggle('error',isError);el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),3200);};
