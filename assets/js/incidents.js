'use strict';
let incidents=getData('incidents');
const table=document.querySelector('#incidentTable');
const filters={status:document.querySelector('#statusFilter'),priority:document.querySelector('#priorityFilter'),search:document.querySelector('#incidentSearch')};
function renderIncidents(){
 const search=filters.search.value.trim().toLocaleLowerCase('ru');
 const list=incidents.filter(x=>(filters.status.value==='all'||x.status===filters.status.value)&&(filters.priority.value==='all'||x.priority===filters.priority.value)&&(!search||(`${x.title} ${x.id}`).toLocaleLowerCase('ru').includes(search)));
 document.querySelector('#incidentCount').textContent=`Показано: ${list.length} из ${incidents.length}`;
 table.innerHTML=list.length?list.map(i=>{const sla=getSlaState(i);const limit=settings.slaHours[i.priority];return `<tr><td><strong>${escapeHTML(i.title)}</strong><span class="subtext">${escapeHTML(i.id)}</span></td><td>${badge(safeValue('priority',i.priority),i.priority==='critical'?'red':i.priority==='high'?'orange':'blue')}</td><td>${badge(safeValue('incidentStatus',i.status),i.status==='resolved'?'green':'neutral')}</td><td class="no-wrap">${formatDateTime(i.createdAt)}</td><td>${badge(safeValue('sla',sla),sla==='breached'?'red':sla==='met'?'green':'blue')}<span class="subtext">Лимит: ${limit} ч</span></td><td><div class="row-actions">${i.status==='new'?`<button class="small-button" type="button" data-action="start" data-id="${escapeHTML(i.id)}">В работу</button>`:''}${i.status!=='resolved'?`<button class="small-button success" type="button" data-action="resolve" data-id="${escapeHTML(i.id)}">Решить</button>`:'<span class="subtext">Закрыт</span>'}</div></td></tr>`;}).join(''):'<tr><td colspan="6" class="empty">Обращений по этим условиям нет</td></tr>';
}
Object.values(filters).forEach(el=>el.addEventListener(el.tagName==='INPUT'?'input':'change',renderIncidents));
document.querySelector('#incidentForm').addEventListener('submit',e=>{
 e.preventDefault();const input=document.querySelector('#incidentTitle'),error=document.querySelector('#incidentError'),title=input.value.trim();error.textContent='';input.removeAttribute('aria-invalid');
 if(!title){error.textContent='Введите название обращения.';input.setAttribute('aria-invalid','true');input.focus();return;}
 const f=new FormData(e.currentTarget);incidents.unshift({id:nextId('INC',incidents),title,priority:f.get('priority'),status:'new',createdAt:new Date().toISOString(),resolvedAt:null});
 if(saveData('incidents',incidents)){e.currentTarget.reset();filters.status.value='all';filters.priority.value='all';filters.search.value='';renderIncidents();notify('Инцидент зарегистрирован');document.dispatchEvent(new Event('ssh:saved'));}
});
table.addEventListener('click',e=>{
 const button=e.target.closest('button[data-action]');if(!button)return;const item=incidents.find(x=>x.id===button.dataset.id);if(!item||item.status==='resolved')return;
 if(button.dataset.action==='start')item.status='in_progress';if(button.dataset.action==='resolve'){item.status='resolved';item.resolvedAt=new Date().toISOString();}
 if(saveData('incidents',incidents)){renderIncidents();notify('Статус обращения обновлён');}
});
renderIncidents();

// Export the current filtered view without external dependencies.
function csvCell(value){return '"'+String(value ?? '').replace(/"/g,'""')+'"';}
function downloadIncidentsCsv(){
 const search=filters.search.value.trim().toLocaleLowerCase('ru');
 const visible=incidents.filter(x=>(filters.status.value==='all'||x.status===filters.status.value)&&
  (filters.priority.value==='all'||x.priority===filters.priority.value)&&
  (!search||(`${x.title} ${x.id}`).toLocaleLowerCase('ru').includes(search)));
 const rows=[['ID','Обращение','Приоритет','Статус','Дата','SLA'],
  ...visible.map(x=>[x.id,x.title,safeValue('priority',x.priority),safeValue('incidentStatus',x.status),x.createdAt,safeValue('sla',getSlaState(x))])];
 const csv='\uFEFF'+rows.map(row=>row.map(csvCell).join(';')).join('\r\n');
 const link=document.createElement('a');link.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
 link.download='campuscare_incidents.csv';link.click();
 setTimeout(()=>URL.revokeObjectURL(link.href),1000);
}
document.querySelector('#exportIncidents')?.addEventListener('click',downloadIncidentsCsv);
