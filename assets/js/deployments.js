'use strict';
let deployments=getData('deployments');
const table=document.querySelector('#deploymentTable');
const renderDeployments=()=>{
  document.querySelector('#deploymentCount').textContent=`Записей: ${deployments.length}`;
  table.innerHTML=deployments.length?deployments.map(d=>{const pct=d.total>0?Math.min(100,Math.round(d.done/d.total*100)):0;return `<tr><td><strong>${escapeHTML(d.client)}</strong><span class="subtext">${escapeHTML(d.id)} · ${escapeHTML(d.product)} · ${escapeHTML(d.version)}</span></td><td>${escapeHTML(d.owner)}</td><td>${badge(safeValue('stage',d.stage),d.stage==='production'?'green':'blue')}</td><td class="no-wrap">${formatDate(d.plannedDate)}</td><td><div class="progress-row"><span class="progress"><span style="width:${pct}%"></span></span><strong>${pct}%</strong></div><span class="subtext">${d.done} из ${d.total} задач</span></td><td><div class="row-actions"><button type="button" class="small-button" data-action="advance" data-id="${escapeHTML(d.id)}" ${d.stage==='production'?'disabled':''}>Следующий этап</button><button type="button" class="small-button" data-action="progress" data-id="${escapeHTML(d.id)}" ${d.done>=d.total?'disabled':''}>+ задача</button></div></td></tr>`;}).join(''):'<tr><td colspan="6" class="empty">Нет внедрений</td></tr>';
};
renderDeployments();
document.querySelector('#deploymentForm').addEventListener('submit',e=>{
 e.preventDefault();const f=new FormData(e.currentTarget);const done=Number(f.get('done')),total=Number(f.get('total'));const error=document.querySelector('#deploymentError');error.textContent='';
 if(!String(f.get('client')).trim()||!String(f.get('product')).trim()||!String(f.get('owner')).trim()||done<0||total<1||done>total){error.textContent='Проверьте поля и количество выполненных задач.';return;}
 deployments.unshift({id:nextId('DEP',deployments),client:String(f.get('client')).trim(),product:String(f.get('product')).trim(),version:String(f.get('version')).trim(),stage:f.get('stage'),owner:String(f.get('owner')).trim(),plannedDate:f.get('plannedDate'),done,total});
 if(saveData('deployments',deployments)){renderDeployments();e.currentTarget.reset();notify('Внедрение добавлено');document.dispatchEvent(new Event('ssh:saved'));}
});
table.addEventListener('click',e=>{
 const btn=e.target.closest('button[data-action]');if(!btn)return;const item=deployments.find(x=>x.id===btn.dataset.id);if(!item)return;
 if(btn.dataset.action==='progress'&&item.done<item.total)item.done++;
 if(btn.dataset.action==='advance'){const stages=['planning','setup','training','production'];const n=stages.indexOf(item.stage);if(n>=0&&n<3)item.stage=stages[n+1];}
 if(saveData('deployments',deployments)){renderDeployments();notify('Внедрение обновлено');}
});
