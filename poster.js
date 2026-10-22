const TARGET=[
  {id:'circle',name:'Солнце',x:221,y:105,size:86,angle:0,color:'#dc7f67'},
  {id:'arch',name:'Арка',x:96,y:235,size:118,angle:0,color:'#2f535b'},
  {id:'bar',name:'Акцент',x:206,y:288,size:128,angle:-12,color:'#76a49a'},
  {id:'title',name:'Заголовок',x:153,y:354,size:22,angle:0,color:'#2f535b'}
];
const INITIAL=[
  {id:'circle',name:'Солнце',x:88,y:122,size:76,angle:0,color:'#76a49a'},
  {id:'arch',name:'Арка',x:204,y:211,size:106,angle:20,color:'#2f535b'},
  {id:'bar',name:'Акцент',x:106,y:274,size:110,angle:13,color:'#dc7f67'},
  {id:'title',name:'Заголовок',x:170,y:361,size:18,angle:0,color:'#2f535b'}
];
const clone=items=>items.map(item=>({...item}));
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
export const POSTER_CHALLENGES={
  easy:{title:'Зачёт · мягкий бриф',reason:'Ты уверенно прошла маршрут: преподавательница дала понятный макет с небольшими правками.',target:[
    {id:'circle',name:'Солнце',x:108,y:112,size:82,angle:0,color:'#dc7f67'},
    {id:'arch',name:'Арка',x:197,y:215,size:112,angle:0,color:'#2f535b'},
    {id:'bar',name:'Акцент',x:116,y:292,size:116,angle:0,color:'#76a49a'},
    {id:'title',name:'Заголовок',x:155,y:354,size:22,angle:0,color:'#2f535b'}
  ]},
  standard:{title:'Доработка · композиция',reason:'Маршрут был неровным: собери постер по новому расположению форм.',target:clone(TARGET)},
  hard:{title:'Пересдача · сложный бриф',reason:'После задержек и пропущенных бонусов преподавательница выдала новую композицию с поворотами и другой палитрой.',target:[
    {id:'circle',name:'Солнце',x:220,y:284,size:68,angle:0,color:'#e9bb73'},
    {id:'arch',name:'Арка',x:103,y:204,size:128,angle:-15,color:'#76a49a'},
    {id:'bar',name:'Акцент',x:208,y:125,size:142,angle:30,color:'#dc7f67'},
    {id:'title',name:'Заголовок',x:152,y:359,size:26,angle:0,color:'#2f535b'}
  ]}
};
export const POSTER_TARGET=clone(TARGET);
export const POSTER_INITIAL=clone(INITIAL);
export function scorePoster(objects,targetShapes=TARGET){let total=0;for(const target of targetShapes){const item=objects.find(shape=>shape.id===target.id);if(!item)return 0;const distance=Math.hypot(item.x-target.x,item.y-target.y);const position=clamp(1-distance/160,0,1);const size=clamp(1-Math.abs(item.size-target.size)/target.size,0,1);const angle=clamp(1-Math.abs(item.angle-target.angle)/90,0,1);const color=item.color===target.color?1:0;total+=position*.55+size*.18+angle*.07+color*.2}return Math.round(total/targetShapes.length*100)}
export function posterAdvice(objects,targetShapes=TARGET){
  let biggest={loss:0,text:'Отлично! Формы, цвет и композиция очень близки к референсу.'};
  for(const target of targetShapes){const item=objects.find(shape=>shape.id===target.id);if(!item)continue;const options=[
    {loss:Math.min(1,Math.hypot(item.x-target.x,item.y-target.y)/160)*.55,text:`Подвинь «${target.name}» ближе к месту на референсе.`},
    {loss:Math.min(1,Math.abs(item.size-target.size)/target.size)*.18,text:`Подгони размер слоя «${target.name}».`},
    {loss:Math.min(1,Math.abs(item.angle-target.angle)/90)*.07,text:`Поверни слой «${target.name}» точнее.`},
    {loss:item.color===target.color?0:.2,text:`Смени цвет слоя «${target.name}» как в образце.`}
  ];for(const option of options)if(option.loss>biggest.loss)biggest=option}
  return biggest.text;
}

function drawBase(g){
  g.fillStyle='#f2e6cb';g.fillRect(0,0,300,420);g.fillStyle='#e9d6b8';for(let y=30;y<410;y+=28)g.fillRect(18,y,264,1);
  g.fillStyle='#344f55';g.font='bold 10px monospace';g.fillText('СПбГУПТД  /  ГРАФИЧЕСКИЙ ДИЗАЙН',19,24);
  g.fillStyle='#ab8d7a';g.fillRect(20,394,260,2);g.font='9px monospace';g.fillText('ПОСЛЕДНЯЯ ПАРА  ·  ЗАЩИТА ПРОЕКТА',20,409);
}
function drawShape(g,shape){
  g.save();g.translate(shape.x,shape.y);g.rotate(shape.angle*Math.PI/180);g.fillStyle=shape.color;
  if(shape.id==='circle'){g.beginPath();g.arc(0,0,shape.size/2,0,Math.PI*2);g.fill();g.fillStyle='#f2e6cb';g.fillRect(-shape.size*.18,-shape.size*.07,shape.size*.36,shape.size*.14)}
  else if(shape.id==='arch'){const s=shape.size;g.beginPath();g.arc(0,-s*.08,s/2,Math.PI,0);g.lineTo(s/2,s*.48);g.lineTo(-s/2,s*.48);g.closePath();g.fill();g.fillStyle='#f2e6cb';g.fillRect(-s*.18,s*.1,s*.36,s*.38)}
  else if(shape.id==='bar'){g.fillRect(-shape.size/2,-16,shape.size,32);g.fillStyle='#e5d3ae';g.fillRect(-shape.size*.32,-3,shape.size*.64,6)}
  else{g.font=`900 ${shape.size}px Arial, sans-serif`;g.textAlign='center';g.fillText('ФОРМА / СМЫСЛ',0,0);g.font='bold 11px monospace';g.fillText('ПОСТЕР О ДИЗАЙНЕ',0,20)}
  g.restore();
}
function drawPoster(canvas,shapes,selected=null,guides=false,targetShapes=TARGET){
  const g=canvas.getContext('2d');g.clearRect(0,0,300,420);drawBase(g);
  if(guides){g.strokeStyle='#8b9e9b80';g.setLineDash([4,5]);for(const target of targetShapes){g.strokeRect(target.x-target.size/2,target.y-target.size/2,target.size,target.size)}g.setLineDash([])}
  for(const shape of shapes)drawShape(g,shape);
  if(selected){const s=shapes.find(item=>item.id===selected);if(s){const w=s.id==='title'?230:s.size;g.strokeStyle='#2a777c';g.lineWidth=2;g.setLineDash([5,4]);g.strokeRect(s.x-w/2-7,s.y-(s.id==='title'?26:s.size/2)-7,w+14,(s.id==='title'?54:s.size)+14);g.setLineDash([])}}
}

export class PosterEditor{
  constructor(root,onSubmit){
    this.root=root;this.onSubmit=onSubmit;this.reference=root.querySelector('#reference-canvas');this.workspace=root.querySelector('#work-canvas');this.feedback=root.querySelector('#poster-feedback');this.challenge=POSTER_CHALLENGES.standard;this.preview=null;this.checked=false;this.objects=clone(INITIAL);this.selected='circle';this.guides=false;this.dragging=null;
    this.workspace.addEventListener('pointerdown',event=>this.pointerDown(event));this.workspace.addEventListener('pointermove',event=>this.pointerMove(event));this.workspace.addEventListener('pointerup',()=>this.pointerUp());this.workspace.addEventListener('pointercancel',()=>this.pointerUp());
    root.querySelectorAll('[data-layer]').forEach(button=>button.addEventListener('click',()=>{this.selected=button.dataset.layer;this.draw()}));
    root.querySelectorAll('[data-color]').forEach(button=>button.addEventListener('click',()=>{this.active.color=button.dataset.color;this.changed();this.draw()}));
    root.querySelectorAll('[data-adjust]').forEach(button=>button.addEventListener('click',()=>this.adjust(button.dataset.adjust)));
    root.querySelector('#guides-btn').addEventListener('click',()=>{this.guides=!this.guides;root.querySelector('#guides-btn').setAttribute('aria-pressed',String(this.guides));this.draw()});
    root.querySelector('#poster-check').addEventListener('click',()=>{const score=this.score(),result=this.preview?.(score);this.checked=true;this.feedback.textContent=`Проверка: сходство ${score}%${result?` → предварительно ${result.points}/100 · оценка ${result.grade}`:''}. ${posterAdvice(this.objects,this.challenge.target)} Проверка бесплатна и не сдаёт работу.`});
    root.querySelector('#poster-submit').addEventListener('click',()=>{const score=this.score();this.close();this.onSubmit(score)});
    root.querySelector('#poster-reset').addEventListener('click',()=>{this.objects=clone(INITIAL);this.checked=false;this.feedback.textContent='Макет сброшен. Сравни его с референсом и проверь снова.';this.draw()});
    window.addEventListener('keydown',event=>{if(this.root.classList.contains('hidden'))return;const delta={ArrowLeft:[-2,0],ArrowRight:[2,0],ArrowUp:[0,-2],ArrowDown:[0,2]}[event.key];if(delta){event.preventDefault();this.active.x=clamp(this.active.x+delta[0],15,285);this.active.y=clamp(this.active.y+delta[1],45,380);this.changed();this.draw()}});
    this.draw();
  }
  get active(){return this.objects.find(shape=>shape.id===this.selected)}
  open(challenge=POSTER_CHALLENGES.standard,preview=null){this.challenge=challenge;this.preview=preview;this.objects=clone(INITIAL);this.selected='circle';this.guides=false;this.checked=false;this.root.classList.remove('hidden');document.body.classList.add('studio-open');this.root.querySelector('#poster-brief-title').textContent=challenge.title;this.root.querySelector('#poster-brief-reason').textContent=challenge.reason;const route=preview?.(0);this.root.querySelector('#poster-rules').textContent=`Сходство: положение 55% · цвет 20% · размер 18% · поворот 7%. Итог: макет до 55 баллов · бонусы +6 каждый (до 24) · задержки −3 от 16 · время до 5.${route?` Маршрут уже даёт ${Math.round(route.routePoints)} баллов.`:''}`;this.feedback.textContent='Сравни четыре слоя с образцом. «Проверить» покажет предварительную оценку и совет без штрафа; «Сдать» завершит игру.';this.draw();this.root.querySelector('#poster-check').focus()}
  close(){this.root.classList.add('hidden');document.body.classList.remove('studio-open')}
  point(event){const r=this.workspace.getBoundingClientRect();return{x:(event.clientX-r.left)*300/r.width,y:(event.clientY-r.top)*420/r.height}}
  pointerDown(event){const point=this.point(event);for(const shape of [...this.objects].reverse()){const w=shape.id==='title'?120:shape.size/2;if(Math.abs(point.x-shape.x)<w+12&&Math.abs(point.y-shape.y)<(shape.id==='title'?35:shape.size/2+12)){this.selected=shape.id;this.dragging={dx:point.x-shape.x,dy:point.y-shape.y};this.workspace.setPointerCapture(event.pointerId);this.draw();return}}}
  pointerMove(event){if(!this.dragging)return;const point=this.point(event);this.active.x=clamp(point.x-this.dragging.dx,16,284);this.active.y=clamp(point.y-this.dragging.dy,46,378);this.changed();this.draw()}
  pointerUp(){this.dragging=null}
  adjust(kind){const item=this.active;if(kind==='rotate-left')item.angle-=15;if(kind==='rotate-right')item.angle+=15;if(kind==='smaller')item.size=clamp(item.size-8,item.id==='title'?14:48,item.id==='title'?35:160);if(kind==='larger')item.size=clamp(item.size+8,item.id==='title'?14:48,item.id==='title'?35:160);this.changed();this.draw()}
  changed(){if(this.checked){this.checked=false;this.feedback.textContent='Макет изменён. Нажми «Проверить», чтобы обновить предварительную оценку.'}}
  score(){return scorePoster(this.objects,this.challenge.target)}
  draw(){drawPoster(this.reference,this.challenge.target);drawPoster(this.workspace,this.objects,this.selected,this.guides,this.challenge.target);this.root.querySelector('#selected-layer').textContent=this.active.name;this.root.querySelectorAll('[data-layer]').forEach(button=>button.classList.toggle('active',button.dataset.layer===this.selected));this.root.querySelectorAll('[data-color]').forEach(button=>button.classList.toggle('active',button.dataset.color===this.active.color))}
}
