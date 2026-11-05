'use strict';
const STORE_PREFIX = 'ssh.v1.';
const DATA_KEYS = {deployments:'deployments',incidents:'incidents',requests:'requests',releases:'releases'};
function saveData(key,value){try{localStorage.setItem(STORE_PREFIX+key,JSON.stringify(value));return true;}catch(error){console.warn('Не удалось сохранить данные',error);window.notify?.('Не удалось сохранить данные браузера',true);return false;}}
function loadData(key,fallback){try{const raw=localStorage.getItem(STORE_PREFIX+key);if(raw===null)return structuredClone(fallback);const value=JSON.parse(raw);if(!Array.isArray(value))throw Error('Ожидается массив');return value;}catch(error){console.warn('Данные повреждены, используется учебный набор:',key);return structuredClone(fallback);}}
function getData(key){const defaults={deployments:startDeployments,incidents:startIncidents,requests:startRequests,releases:startReleases};const sample=defaults[key]||[];return loadData(key,sample).filter(x=>x && typeof x==='object' && typeof x.id==='string');}
function nextId(prefix,items){const ids=items.map(x=>Number(String(x.id).split('-').pop())).filter(Number.isFinite);return prefix+'-'+String(Math.max(0,...ids)+1).padStart(3,'0');}
function getSlaState(item,config=settings,now=Date.now()){
  const hours=config.slaHours[item.priority];const created=Date.parse(item.createdAt);if(!Number.isFinite(hours)||!Number.isFinite(created))return 'breached';
  const deadline=created+hours*3600000;
  if(item.status==='resolved'){const resolved=Date.parse(item.resolvedAt);return Number.isFinite(resolved)&&resolved<=deadline?'met':'breached';}
  return now>deadline?'breached':'on_track';
}
function getSlaPercent(incidents,config=settings){const resolved=incidents.filter(x=>x.status==='resolved');if(!resolved.length)return 100;return Math.round(resolved.filter(x=>getSlaState(x,config)==='met').length/resolved.length*100);}
function getNextVersion(current,level){const match=/^v?(\d+)\.(\d+)\.(\d+)$/.exec(String(current));if(!match)throw Error('Некорректный номер версии');let [a,b,c]=match.slice(1).map(Number);if(level==='major')return `v${a+1}.0.0`;if(level==='minor')return `v${a}.${b+1}.0`;if(level==='patch')return `v${a}.${b}.${c+1}`;throw Error('Неизвестный тип версии');}
function compareVersions(a,b){const parse=v=>String(v).replace(/^v/,'').split('.').map(Number);const x=parse(a),y=parse(b);for(let i=0;i<3;i++){if((x[i]||0)!==(y[i]||0))return (x[i]||0)-(y[i]||0);}return 0;}
function latestRelease(){return [...getData('releases')].sort((a,b)=>compareVersions(b.version,a.version))[0]||null;}
function formatDate(v){const date=new Date(v);return Number.isFinite(date.getTime())?new Intl.DateTimeFormat('ru-RU',{day:'2-digit',month:'short',year:'numeric'}).format(date):'Не указана';}
function formatDateTime(v){const date=new Date(v);return Number.isFinite(date.getTime())?new Intl.DateTimeFormat('ru-RU',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}).format(date):'Не указано';}
function escapeHTML(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function badge(text,tone='neutral'){return `<span class="pill pill-${tone}">${escapeHTML(text)}</span>`;}
function safeValue(group,key){return LABELS[group]?.[key]??String(key??'—');}
