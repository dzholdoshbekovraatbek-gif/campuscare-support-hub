'use strict';
let releases=getData('releases');const list=document.querySelector('#releaseList');
const levelSelect=document.querySelector('#releaseLevel');
function currentVersion(){return [...releases].sort((a,b)=>compareVersions(b.version,a.version))[0]?.version||'v0.0.0';}
function updatePreview(){try{document.querySelector('#nextVersion').textContent=getNextVersion(currentVersion(),levelSelect.value);}catch{document.querySelector('#nextVersion').textContent='—';}}
function renderReleases(){
 document.querySelector('#releaseCount').textContent=`Выпусков: ${releases.length}`;
 list.innerHTML=releases.length?[...releases].sort((a,b)=>compareVersions(b.version,a.version)).map(r=>`<article class="release-item"><div class="release-marker"></div><div class="release-details"><div class="release-head"><h3>${escapeHTML(r.version)}</h3>${badge(safeValue('level',r.level),r.level==='major'?'orange':'blue')}<span>${formatDate(r.date)}</span></div><ul>${(Array.isArray(r.changes)?r.changes:[]).map(c=>`<li>${escapeHTML(c)}</li>`).join('')}</ul></div></article>`).join(''):'<div class="empty">Пока нет выпусков</div>';
 updatePreview();document.querySelector('#headerVersion').textContent=currentVersion();
}
levelSelect.addEventListener('change',updatePreview);document.querySelector('#releaseDate').value=new Date().toLocaleDateString('en-CA');
document.querySelector('#releaseForm').addEventListener('submit',e=>{
 e.preventDefault();const f=new FormData(e.currentTarget),changes=String(f.get('changes')).split(/\r?\n/).map(s=>s.trim()).filter(Boolean),error=document.querySelector('#releaseError');error.textContent='';
 if(!changes.length){error.textContent='Добавьте хотя бы одно изменение.';return;}
 const version=getNextVersion(currentVersion(),f.get('level'));
 releases.unshift({id:nextId('REL',releases),version,date:f.get('date'),level:f.get('level'),changes});
 if(saveData('releases',releases)){e.currentTarget.reset();document.querySelector('#releaseDate').value=new Date().toLocaleDateString('en-CA');renderReleases();notify(`Релиз ${version} сохранён`);document.dispatchEvent(new Event('ssh:saved'));}
});
renderReleases();
