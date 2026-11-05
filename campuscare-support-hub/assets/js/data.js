/* Учебные записи. Все организации и участники вымышлены. */
const startDeployments = [
  {id:'DEP-001',client:'Административный корпус',product:'Система расписания',version:'v1.1.0',stage:'training',owner:'Р. Джолдошбеков',plannedDate:'2026-11-20',done:6,total:8},
  {id:'DEP-002',client:'Учебная библиотека',product:'Портал заявок',version:'v1.0.0',stage:'setup',owner:'Айбек С.',plannedDate:'2026-11-26',done:3,total:10},
  {id:'DEP-003',client:'Техническая служба',product:'Каталог ресурсов',version:'v1.1.0',stage:'planning',owner:'Аделина А.',plannedDate:'2026-12-02',done:1,total:6},
  {id:'DEP-004',client:'Медиалаборатория',product:'База знаний',version:'v1.1.0',stage:'production',owner:'Данияр Н.',plannedDate:'2026-11-01',done:10,total:10}
];
const startIncidents = [
  {id:'INC-001',title:'В журнале заявок не обновляется счётчик',priority:'high',status:'in_progress',createdAt:'2026-11-03T14:00:00+06:00',resolvedAt:null},
  {id:'INC-002',title:'Сбросился пароль тестового оператора',priority:'critical',status:'resolved',createdAt:'2026-11-02T09:00:00+06:00',resolvedAt:'2026-11-02T11:40:00+06:00'},
  {id:'INC-003',title:'После обновления не сохраняется фильтр',priority:'medium',status:'new',createdAt:'2026-11-03T12:00:00+06:00',resolvedAt:null},
  {id:'INC-004',title:'Замедлилась выгрузка таблицы обращений',priority:'high',status:'resolved',createdAt:'2026-11-01T10:00:00+06:00',resolvedAt:'2026-11-01T20:15:00+06:00'},
  {id:'INC-005',title:'Опечатка в письме с уведомлением',priority:'low',status:'new',createdAt:'2026-11-03T09:15:00+06:00',resolvedAt:null},
  {id:'INC-006',title:'Не сохраняется настройка уведомлений',priority:'medium',status:'resolved',createdAt:'2026-11-02T13:00:00+06:00',resolvedAt:'2026-11-03T08:00:00+06:00'}
];
const startRequests = [
  {id:'REQ-001',title:'Исправить сортировку отчётов',type:'corrective',status:'planned',targetVersion:'v1.2.0'},
  {id:'REQ-002',title:'Поддержать новую версию браузера',type:'adaptive',status:'new',targetVersion:'v1.2.0'},
  {id:'REQ-003',title:'Добавить экспорт в PDF',type:'perfective',status:'planned',targetVersion:'v1.3.0'},
  {id:'REQ-004',title:'Обновить зависимости графиков',type:'preventive',status:'done',targetVersion:'v1.1.0'}
];
const startReleases = [
  {id:'REL-001',version:'v1.0.0',date:'2026-11-03',level:'major',changes:['Первый рабочий прототип','Внедрения, инциденты, заявки и релизы']},
  {id:'REL-002',version:'v1.1.0',date:'2026-11-03',level:'minor',changes:['Добавлены фильтры и поиск обращений','Улучшены мобильная навигация и сообщения форм','Добавлены проверки SLA и сохранения данных']}
];
const settings = {slaHours:{critical:4,high:8,medium:24,low:72}};
const LABELS = {
  stage:{planning:'Планирование',setup:'Настройка',training:'Обучение',production:'Запуск'},
  priority:{critical:'Критический',high:'Высокий',medium:'Средний',low:'Низкий'},
  incidentStatus:{new:'Новый',in_progress:'В работе',resolved:'Решён'},
  sla:{on_track:'В срок',breached:'Просрочен',met:'Решён вовремя'},
  type:{corrective:'Корректирующее',adaptive:'Адаптивное',perfective:'Совершенствующее',preventive:'Профилактическое'},
  requestStatus:{new:'Новая',planned:'Запланирована',done:'Выполнена'},
  level:{patch:'Исправления',minor:'Улучшения',major:'Крупное обновление'}
};
