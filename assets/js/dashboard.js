'use strict';
const incidents=getData('incidents'),deployments=getData('deployments'),requests=getData('requests');
const open=incidents.filter(x=>x.status!=='resolved');
document.querySelector('#kpiDeployments').textContent=deployments.filter(x=>x.stage!=='production').length;
document.querySelector('#kpiIncidents').textContent=open.length;
document.querySelector('#kpiBreach').textContent=`Просрочено: ${open.filter(x=>getSlaState(x)==='breached').length}`;
document.querySelector('#kpiSla').textContent=getSlaPercent(incidents)+'%';
document.querySelector('#kpiRelease').textContent=latestRelease()?.version||'Нет выпусков';
const recent=document.querySelector('#recentIncidents');const latestIncidents=[...incidents].sort((a,b)=>Date.parse(b.createdAt)-Date.parse(a.createdAt)).slice(0,5);
recent.innerHTML=latestIncidents.length?latestIncidents.map(i=>`<a class="compact-item" href="incidents.html"><span class="compact-icon">◎</span><span class="compact-main"><strong>${escapeHTML(i.title)}</strong><small>${escapeHTML(i.id)} · ${formatDateTime(i.createdAt)}</small></span>${badge(safeValue('incidentStatus',i.status),i.status==='resolved'?'green':i.priority==='critical'?'red':'blue')}</a>`).join(''):'<div class="empty">Пока нет обращений</div>';
const recentDep=document.querySelector('#recentDeployments');recentDep.innerHTML=deployments.length?deployments.slice(0,4).map(d=>{const pct=d.total>0?Math.min(100,Math.round(d.done/d.total*100)):0;return `<a class="compact-item dep-item" href="deployments.html"><span class="compact-main"><strong>${escapeHTML(d.client)}</strong><small>${escapeHTML(d.product)} · ${safeValue('stage',d.stage)}</small><span class="progress"><span style="width:${pct}%"></span></span></span><strong>${pct}%</strong></a>`;}).join(''):'<div class="empty">Пока нет внедрений</div>';
const priorities=['critical','high','medium','low'],types=['corrective','adaptive','perfective','preventive'];
if(typeof Chart==='undefined'){
  document.querySelectorAll('.chart-wrap').forEach(x=>{x.innerHTML='<div class="empty">Не удалось загрузить Chart.js. Проверьте подключение к сети.</div>';});
}else{
  const ink=getComputedStyle(document.documentElement).getPropertyValue('--muted').trim();
  Chart.defaults.font.family='Inter,Segoe UI,Arial,sans-serif';Chart.defaults.color=ink;
  new Chart(document.querySelector('#priorityChart'),{type:'bar',data:{labels:priorities.map(p=>LABELS.priority[p]),datasets:[{data:priorities.map(p=>incidents.filter(i=>i.priority===p).length),backgroundColor:['#eb6b69','#f6b05a','#448ce7','#84b9e9'],borderRadius:7,maxBarThickness:45}]},options:{animation:false,responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,ticks:{stepSize:1,precision:0},grid:{color:'rgba(130,145,165,.13)'}},x:{grid:{display:false}}}}});
  new Chart(document.querySelector('#maintenanceChart'),{type:'doughnut',data:{labels:types.map(t=>LABELS.type[t]),datasets:[{data:types.map(t=>requests.filter(r=>r.type===t).length),backgroundColor:['#4c8ce7','#4cc4a6','#a89aef','#efb460'],borderWidth:0,hoverOffset:7}]},options:{animation:false,responsive:true,maintainAspectRatio:false,cutout:'71%',plugins:{legend:{position:'bottom',labels:{boxWidth:12,usePointStyle:true,padding:14}}}}});
}
