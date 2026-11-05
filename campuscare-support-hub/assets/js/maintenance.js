'use strict';
let requests=getData('requests');const table=document.querySelector('#requestTable');
const typeFilter=document.querySelector('#typeFilter'),statusFilter=document.querySelector('#requestStatusFilter');
function renderRequests(){
 const list=requests.filter(r=>(typeFilter.value==='all'||r.type===typeFilter.value)&&(statusFilter.value==='all'||r.status===statusFilter.value));
 document.querySelector('#requestCount').textContent=`Показано: ${list.length} из ${requests.length}`;
 table.innerHTML=list.length?list.map(r=>`<tr><td><strong>${escapeHTML(r.title)}</strong><span class="subtext">${escapeHTML(r.id)}</span></td><td>${badge(safeValue('type',r.type),'blue')}</td><td>${badge(safeValue('requestStatus',r.status),r.status==='done'?'green':'neutral')}</td><td>${escapeHTML(r.targetVersion)}</td><td><div class="row-actions">${r.status==='new'?`<button type="button" class="small-button" data-action="plan" data-id="${escapeHTML(r.id)}">В план</button>`:''}${r.status!=='done'?`<button type="button" class="small-button success" data-action="done" data-id="${escapeHTML(r.id)}">Выполнено</button>`:'<span class="subtext">Завершена</span>'}</div></td></tr>`).join(''):'<tr><td colspan="5" class="empty">Подходящих заявок нет</td></tr>';
}
typeFilter.addEventListener('change',renderRequests);statusFilter.addEventListener('change',renderRequests);
document.querySelector('#requestForm').addEventListener('submit',e=>{
 e.preventDefault();const f=new FormData(e.currentTarget),title=String(f.get('title')).trim();const error=document.querySelector('#requestError');error.textContent='';if(!title){error.textContent='Введите название заявки.';return;}
 requests.unshift({id:nextId('REQ',requests),title,type:f.get('type'),status:'new',targetVersion:String(f.get('targetVersion')).trim()});
 if(saveData('requests',requests)){e.currentTarget.reset();typeFilter.value='all';statusFilter.value='all';renderRequests();notify('Заявка создана');document.dispatchEvent(new Event('ssh:saved'));}
});
table.addEventListener('click',e=>{const btn=e.target.closest('button[data-action]');if(!btn)return;const r=requests.find(x=>x.id===btn.dataset.id);if(!r)return;if(btn.dataset.action==='plan')r.status='planned';if(btn.dataset.action==='done')r.status='done';if(saveData('requests',requests)){renderRequests();notify('Статус заявки обновлён');}});
renderRequests();
