const ground=(x,w)=>({x,y:460,w,h:80,kind:'ground'});
const platform=(x,y,w)=>({x,y,w,h:18,kind:'platform'});
const item=(x,y,name,icon)=>({x,y,w:30,h:30,name,icon,taken:false});
const bonus=(x,y)=>({x,y,w:24,h:24,taken:false});

export const LEVELS=[
  {
    name:'Двор на Большой Морской',short:'ДВОР',theme:'outside',width:2940,time:165,
    intro:'До защиты ещё есть время. Найди три вещи и доберись до корпуса. У луж подозрительно скользко.',
    items:[item(285,320,'Эскиз постера','sketch'),item(1400,260,'Палитра','palette'),item(2535,300,'Студенческий','card')],
    bonus:bonus(2030,383),
    solids:[ground(0,790),ground(860,770),ground(1700,710),ground(2480,460),platform(195,365,180),platform(425,315,180),platform(720,365,180),platform(1010,350,190),platform(1570,365,190),platform(1880,335,195),platform(2180,365,190),platform(2415,345,190),platform(2700,365,180)],
    movingPlatforms:[{x:1270,y:305,w:165,h:18,min:1230,max:1420,speed:70,dir:1,kind:'moving'}],
    hazards:[{x:350,y:355,w:25,h:10,type:'puddle'},{x:1105,y:450,w:125,h:10,type:'puddle'},{x:2220,y:450,w:120,h:10,type:'puddle'},{x:2760,y:450,w:100,h:10,type:'puddle'}],
    movers:[{x:1475,y:426,w:48,h:34,min:1450,max:1570,speed:55,dir:1,type:'cart'}],
    checkpoint:1750,teacher:{type:'granny',trigger:360,speed:280,lead:165,catchDistance:39,quote:'«А защита уже началась?»'},
    door:{x:2840,y:291,w:58,h:74,label:'В КОРПУС'},signs:[{x:680,text:'Б. МОРСКАЯ 18'},{x:1920,text:'ДИЗАЙН →'}]
  },
  {
    name:'Коридоры и типографика',short:'КОРИДОРЫ',theme:'hall',width:3080,time:175,
    intro:'Принтер опять спорит с макетом. Найди шрифт, распечатку и флешку, пока сонный преподаватель не проснулся.',
    items:[item(300,318,'Шрифтовая пара','type'),item(1480,245,'Пробный оттиск','print'),item(2630,310,'Флешка','drive')],
    bonus:bonus(2120,390),
    solids:[ground(0,800),ground(865,815),ground(1745,755),ground(2560,520),platform(200,365,190),platform(460,315,175),platform(735,365,190),platform(1080,345,190),platform(1650,325,180),platform(1940,365,200),platform(2245,335,190),platform(2560,355,190),platform(2820,365,190)],
    movingPlatforms:[{x:1370,y:315,w:170,h:18,min:1340,max:1510,speed:70,dir:1,kind:'moving'}],
    hazards:[{x:365,y:355,w:25,h:10,type:'papers'},{x:1160,y:450,w:125,h:10,type:'cables'},{x:2330,y:450,w:125,h:10,type:'papers'},{x:2880,y:450,w:100,h:10,type:'cables'}],
    movers:[{x:1520,y:425,w:46,h:35,min:1500,max:1620,speed:75,dir:1,type:'printer'}],
    checkpoint:1800,teacher:{type:'sleepy',trigger:330,speed:265,lead:175,catchDistance:38,quote:'«Где ваш PDF?..»'},
    door:{x:2980,y:291,w:58,h:74,label:'В МАСТЕРСКУЮ'},signs:[{x:530,text:'ШРИФТЫ'},{x:2020,text:'ПЕЧАТЬ →'}]
  },
  {
    name:'Мастерская графического дизайна',short:'МАСТЕРСКАЯ',theme:'studio',width:3220,time:185,
    intro:'Собери знак, сетку и векторный контур. Здесь можно выбрать безопасный путь или прыгать по верхним платформам.',
    items:[item(310,318,'Векторный контур','vector'),item(1540,245,'Модульная сетка','grid'),item(2760,315,'Знак проекта','logo')],
    bonus:bonus(2200,385),
    solids:[ground(0,850),ground(925,810),ground(1810,770),ground(2650,570),platform(215,365,185),platform(490,315,190),platform(770,365,190),platform(1110,340,190),platform(1720,365,190),platform(2030,340,190),platform(2360,365,190),platform(2680,360,190),platform(2940,365,190)],
    movingPlatforms:[{x:965,y:315,w:125,h:18,min:950,max:1035,speed:38,dir:1,kind:'moving'},{x:1430,y:300,w:230,h:18,min:1380,max:1510,speed:75,dir:1,kind:'moving'},{x:2560,y:325,w:110,h:18,min:2520,max:2610,speed:32,dir:1,kind:'moving'}],
    hazards:[{x:375,y:355,w:25,h:10,type:'rolls'},{x:1240,y:450,w:135,h:10,type:'cables'},{x:2110,y:450,w:125,h:10,type:'rolls'},{x:3020,y:450,w:105,h:10,type:'cables'}],
    movers:[{x:2310,y:424,w:48,h:36,min:2260,max:2440,speed:68,dir:1,type:'roll'}],
    checkpoint:1850,teacher:{type:'turbo',trigger:350,speed:315,lead:180,catchDistance:39,quote:'«Сетка сама себя не построит!»'},
    door:{x:3110,y:291,w:58,h:74,label:'НА ПРОСМОТР'},signs:[{x:600,text:'ВЕКТОРЫ'},{x:2250,text:'МАКЕТЫ →'}]
  },
  {
    name:'Последний рывок',short:'ЗАЩИТА',theme:'final',width:3020,time:170,
    intro:'Седая преподавательница уже ищет опоздавших. Собери заголовок, иллюстрацию и экспорт, затем создай финальный постер.',
    items:[item(310,315,'Заголовок','type'),item(1460,250,'Иллюстрация','vector'),item(2590,310,'Экспорт PDF','pdf')],
    bonus:bonus(2140,390),
    solids:[ground(0,850),ground(920,770),ground(1760,690),ground(2520,500),platform(205,360,180),platform(470,315,190),platform(760,365,190),platform(1080,345,190),platform(1660,315,180),platform(1940,365,190),platform(2250,335,190),platform(2520,355,190),platform(2780,365,170)],
    movingPlatforms:[{x:1350,y:305,w:170,h:18,min:1320,max:1500,speed:80,dir:1,kind:'moving'}],
    hazards:[{x:360,y:350,w:25,h:10,type:'papers'},{x:1150,y:450,w:130,h:10,type:'papers'},{x:2250,y:450,w:120,h:10,type:'cables'},{x:2840,y:450,w:105,h:10,type:'papers'}],
    movers:[{x:2050,y:425,w:45,h:35,min:2000,max:2180,speed:80,dir:1,type:'printer'}],
    checkpoint:1820,teacher:{type:'granny',trigger:260,speed:295,lead:150,catchDistance:42,quote:'«Я вас вижу за этим макетом!»'},
    door:{x:2920,y:291,w:58,h:74,label:'ФИНАЛЬНЫЙ МАКЕТ'},signs:[{x:700,text:'АУДИТОРИЯ →'},{x:2250,text:'ДЕДЛАЙН!'}]
  }
];

export function makeLevel(index){
  const source=LEVELS[index];
  return {...source,solids:source.solids.map(x=>({...x})),items:source.items.map(x=>({...x})),bonus:{...source.bonus},hazards:source.hazards.map(x=>({...x})),movers:source.movers.map(x=>({...x})),movingPlatforms:(source.movingPlatforms||[]).map(x=>({...x})),teacher:{...source.teacher,state:'patrol',x:0,y:410,stun:0,notice:0},door:{...source.door},signs:source.signs.map(x=>({...x}))};
}
