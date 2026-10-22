const rect=(g,x,y,w,h,color)=>{g.fillStyle=color;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};
const text=(g,value,x,y,color='#24434b',size=13)=>{g.fillStyle=color;g.font=`bold ${size}px monospace`;g.fillText(value,Math.round(x),Math.round(y))};

function sky(g,camera,time){
  const grad=g.createLinearGradient(0,0,0,540);grad.addColorStop(0,'#729399');grad.addColorStop(.6,'#d4c6a9');grad.addColorStop(1,'#f0b882');g.fillStyle=grad;g.fillRect(0,0,960,540);
  rect(g,746,74,66,66,'#f4d18f');rect(g,733,90,92,35,'#f4d18f');
  for(let i=-1;i<9;i++){const x=i*166-(camera*.22)%166;rect(g,x,264-(i%3)*24,148,210,'#829595');rect(g,x+12,253-(i%3)*24,124,12,'#a5aaa0');for(let j=0;j<3;j++)for(let k=0;k<3;k++)rect(g,x+27+j*37,294+k*45-(i%3)*24,18,25,'#e8bd8e')}
  for(let i=0;i<26;i++){const x=(i*77+time*12)%1060-50,y=100+(i*43)%340;rect(g,x,y,2,9,'#e2ecdf88')}
  for(let i=0;i<7;i++){const x=i*230-camera*.45%1610;rect(g,x,366,5,112,'#3a5d62');rect(g,x-12,366,29,6,'#3a5d62');rect(g,x-9,376,23,8,'#f3d6a0')}
}

function corridor(g,camera,theme){
  const final=theme==='final';rect(g,0,0,960,540,final?'#d3c0a8':'#bfccb6');rect(g,0,0,960,75,final?'#8a5f65':'#567b78');rect(g,0,75,960,11,final?'#623e4b':'#335b60');
  for(let i=-1;i<8;i++){const x=i*235-(camera*.3)%235;rect(g,x+18,102,137,246,'#eadac0');rect(g,x+25,110,123,228,final?'#7e7471':'#749798');rect(g,x+34,119,105,184,final?'#bcafa1':'#c7d6c5');rect(g,x+77,110,8,228,'#486b6d');rect(g,x+25,211,123,8,'#486b6d');rect(g,x+168,87,13,354,'#9ea88f')}
  rect(g,0,438,960,11,final?'#9a8077':'#829c89');for(let i=0;i<15;i++)rect(g,i*88-(camera*.25)%88,450,2,90,'#a6ae96');
  for(let i=0;i<7;i++){const x=i*210-(camera*.35)%1470;rect(g,x+14,74,8,22,'#405b61');rect(g,x-1,93,38,8,'#f6dba9')}
  if(final){for(let i=0;i<6;i++){const x=i*250-(camera*.21)%1500;rect(g,x+160,286,45,50,'#eee4c7');rect(g,x+165,292,35,40,'#b66268');text(g,'!',x+177,321,'#f8e4c5',22)}}
}

function workshop(g,camera,time){
  rect(g,0,0,960,540,'#d9c6a5');rect(g,0,0,960,76,'#5e777b');rect(g,0,76,960,12,'#334e58');
  for(let i=-1;i<7;i++){const x=i*280-(camera*.25)%280;rect(g,x+24,105,186,240,'#415f68');rect(g,x+32,113,170,220,'#a8bdba');rect(g,x+113,113,8,220,'#415f68');rect(g,x+32,220,170,8,'#415f68');rect(g,x+217,275,45,110,'#ae7766');rect(g,x+225,285,29,91,'#f2dfb9');rect(g,x+230,292,19,16,'#d27966')}
  for(let i=0;i<6;i++){const x=i*230-(camera*.4)%1380;rect(g,x+38,397,140,8,'#496b6c');rect(g,x+50,405,7,58,'#496b6c');rect(g,x+159,405,7,58,'#496b6c');rect(g,x+77,377,55,19,'#e5e0c6');rect(g,x+88,383,30,3,'#da8c6d')}
  for(let i=0;i<12;i++)rect(g,(i*131+time*4)%1080-50,165+(i*69)%170,3,3,'#fff0cd88');
}

function drawSolids(g,level,visible,left,right){
  for(const p of level.collisionSolids||level.solids.concat(level.movingPlatforms)){
    if(!visible(p))continue;
    if(p.kind==='ground'){rect(g,p.x,p.y,p.w,p.h,level.theme==='outside'?'#3c6868':'#638178');rect(g,p.x,p.y,p.w,10,'#a1ad8d');for(let x=Math.max(p.x+10,p.x+10+Math.floor((left-p.x-10)/32)*32);x<Math.min(p.x+p.w,right);x+=32)rect(g,x,p.y+32,17,3,'#2c555b');for(let x=Math.max(p.x+25,p.x+25+Math.floor((left-p.x-25)/52)*52);x<Math.min(p.x+p.w,right);x+=52)rect(g,x,p.y+59,20,3,'#355e5c')}
    else{rect(g,p.x+5,p.y+6,p.w,p.h,'#224047');rect(g,p.x,p.y,p.w,p.h,p.kind==='moving'?'#b37764':level.theme==='outside'?'#486d6a':'#668678');rect(g,p.x,p.y,p.w,5,'#edd29e');for(let x=p.x+12;x<p.x+p.w-12;x+=28)rect(g,x,p.y+10,16,2,'#335657');if(p.kind==='moving'){rect(g,p.x+8,p.y+6,12,6,'#f6d499');rect(g,p.x+p.w-20,p.y+6,12,6,'#f6d499')}}
  }
}
function drawHazard(g,h){
  if(h.type==='puddle'){rect(g,h.x,h.y,h.w,10,'#3d6b83');rect(g,h.x+Math.min(9,h.w*.15),h.y+2,Math.min(28,h.w*.4),2,'#b1d7d6');rect(g,h.x+h.w*.62,h.y+5,Math.min(26,h.w*.25),2,'#b1d7d6')}
  else if(h.type==='papers'){rect(g,h.x,h.y,h.w,10,'#d7bea0');for(let x=h.x+3;x<h.x+h.w;x+=18)rect(g,x,h.y-7,13,9,'#f8e6c9')}
  else{rect(g,h.x,h.y,h.w,10,'#343f55');for(let x=h.x+5;x<h.x+h.w;x+=16)rect(g,x,h.y-6,8,7,'#dfa769')}
  rect(g,h.x+h.w/2-12,h.y-27,24,18,'#f8d59d');text(g,'!',h.x+h.w/2-5,h.y-13,'#9c5052',17);
}
function drawMover(g,m,time){
  if(m.type==='cart'){rect(g,m.x,m.y+7,48,23,'#d78268');rect(g,m.x+6,m.y,32,12,'#cbd7c6');rect(g,m.x+6,m.y+28,9,8,'#294c53');rect(g,m.x+34,m.y+28,9,8,'#294c53')}
  else if(m.type==='printer'){rect(g,m.x,m.y+7,46,22,'#697b83');rect(g,m.x+5,m.y,36,11,'#b8c7bb');rect(g,m.x+10,m.y+25,26,8,'#e6dcc5');text(g,'!',m.x+20,m.y+23,'#d96d5b',12)}
  else{rect(g,m.x,m.y+4,48,30,'#d7a976');rect(g,m.x+5,m.y,38,6,'#f2d6a2');rect(g,m.x+10,m.y+9,28,17,'#9eb7a6');rect(g,m.x+20,m.y+14,8,7,'#f7e5bc')}
}
function drawItem(g,item,time){
  const x=item.x,y=item.y+Math.sin(time*4+item.x)*3;rect(g,x-4,y-4,38,38,'#fff1bd55');rect(g,x,y,30,30,'#f3d783');rect(g,x+3,y+3,24,24,'#f8ead0');
  const icon=item.icon;
  if(['sketch','print','pdf'].includes(icon)){rect(g,x+8,y+6,15,19,icon==='pdf'?'#db8c70':'#719497');rect(g,x+10,y+9,11,2,'#f6e6c6');rect(g,x+10,y+14,9,2,'#f6e6c6');rect(g,x+10,y+19,7,2,'#f6e6c6')}
  else if(['type','grid'].includes(icon)){rect(g,x+6,y+6,18,18,'#7b9a97');text(g,icon==='type'?'Aa':'#',x+8,y+21,'#fff0d4',12)}
  else if(['palette','logo','vector'].includes(icon)){rect(g,x+7,y+8,17,17,'#e59074');rect(g,x+10,y+11,11,11,'#668e8a');rect(g,x+14,y+14,5,5,'#f9d596')}
  else if(icon==='card'){rect(g,x+5,y+8,20,15,'#648b91');rect(g,x+8,y+11,5,5,'#f6d4a3');rect(g,x+16,y+12,6,2,'#f6d4a3')}
  else{rect(g,x+10,y+5,10,19,'#719497');rect(g,x+12,y+3,6,6,'#dba977');rect(g,x+13,y+14,4,3,'#f7e6c6')}
}
function drawBonus(g,b,time){if(b.taken)return;const bob=Math.sin(time*5)*4,x=b.x,y=b.y+bob;rect(g,x+9,y-5,6,32,'#f9e29b');rect(g,x-4,y+8,32,6,'#f9e29b');rect(g,x+4,y+3,16,16,'#eaa567');rect(g,x+9,y+8,6,6,'#fff1bb')}
function drawDoor(g,d,ready){if(ready)rect(g,d.x+12,d.y+d.h,d.w-24,460-d.y-d.h,'#f3c77f55');rect(g,d.x-8,d.y-20,d.w+16,d.h+23,'#e8cd9a');rect(g,d.x-2,d.y,d.w+4,d.h,'#31545b');rect(g,d.x+5,d.y+7,d.w-10,d.h-7,ready?'#8baba0':'#456b6c');rect(g,d.x+d.w-16,d.y+38,5,5,'#f7d37d');rect(g,d.x-9,d.y-38,d.w+18,18,'#f8e5bd');text(g,d.label,d.x-5,d.y-24,'#2e5257',10);if(ready){rect(g,d.x+14,d.y+20,21,33,'#f3c77f');rect(g,d.x+18,d.y+25,13,24,'#fff1c9')}}
function drawTeacher(g,t,line,time){
  if(t.state==='patrol')return;const x=Math.round(t.x),y=t.y,granny=t.type==='granny';
  const running=t.state==='chase'||t.state==='search'||t.state==='notice';const step=running?Math.round(Math.sin(time*17)*4):0;
  if(running){rect(g,x-8,y+47,7,3,'#e4d5b7');rect(g,x-16,y+49,5,2,'#e4d5b7')}
  rect(g,x+5,y+16,34,29,granny?'#624e65':t.type==='turbo'?'#b96257':'#5b7477');rect(g,x+10,y+39+step,9,12,'#2b4550');rect(g,x+28,y+39-step,9,12,'#2b4550');rect(g,x+2,y+22-step,6,17,'#e7b996');rect(g,x+38,y+22+step,6,17,'#e7b996');rect(g,x+10,y+1,25,21,'#e7b996');
  if(granny){rect(g,x+6,y-10,33,11,'#d9d9cd');rect(g,x+3,y-15,12,11,'#e8e5d8');rect(g,x+7,y+7,33,3,'#253e4a');rect(g,x+9,y+6,11,10,'#263f49');rect(g,x+25,y+6,11,10,'#263f49');rect(g,x+11,y+8,7,5,'#dce9dc');rect(g,x+27,y+8,7,5,'#dce9dc')}
  else if(t.type==='sleepy'){rect(g,x+8,y-7,30,11,'#6d7678');rect(g,x+10,y+10,8,2,'#455052');rect(g,x+27,y+10,8,2,'#455052');text(g,'z',x+33,y-10,'#f7e3be',14)}
  else{rect(g,x+7,y-7,32,10,'#4c404b');rect(g,x+4,y+7,35,4,'#4c404b');rect(g,x+13,y+8,6,4,'#f8dfb2');rect(g,x+27,y+8,6,4,'#f8dfb2')}
  if(t.state==='notice')text(g,'!',x+17,y-23,'#e46e5d',25);if(t.state==='stunned')text(g,'✦',x+17,y-23,'#f9d98f',22);
  if(line){rect(g,x+10,y-74,218,35,'#f5e7c5');rect(g,x+14,y-70,210,27,'#2d4b51');text(g,line.slice(0,27),x+19,y-51,'#fff1cf',10)}
}
const SKIN_COLORS={classic:{jacket:'#d47961',bag:'#597c72',hair:'#283d4a'},coffee:{jacket:'#9c7157',bag:'#d5a36c',hair:'#43343a'},hoodie:{jacket:'#56798d',bag:'#bf8e72',hair:'#2c3e50'},neon:{jacket:'#b76883',bag:'#61aaa0',hair:'#493858'},graduate:{jacket:'#413b59',bag:'#d4b16f',hair:'#363344'}};
function drawPlayer(g,p,skin,invulnerable){if(invulnerable>0&&Math.floor(invulnerable*12)%2)return;const c=SKIN_COLORS[skin]||SKIN_COLORS.classic,x=Math.round(p.x),y=Math.round(p.y),step=p.grounded&&p.vx?Math.sin(p.walk)*3:0;rect(g,x+4,y+15,23,28,c.jacket);rect(g,x+5,y+40+step,8,9,'#233e4a');rect(g,x+19,y+40-step,8,9,'#233e4a');rect(g,x+1,y+20,7,20,c.bag);rect(g,x+27,y+19,5,20,'#edbd8b');rect(g,x+6,y+1,21,20,'#efbb8c');rect(g,x+3,y,25,7,c.hair);rect(g,x+3,y+5,7,8,c.hair);rect(g,x+21,y+9,3,3,'#30414a');rect(g,x+8,y+18,3,20,'#2c4e52');if(skin==='coffee'){rect(g,x+25,y+25,9,10,'#f4d6ad');rect(g,x+28,y+22,4,3,'#f4d6ad')}if(skin==='graduate'){rect(g,x+1,y-5,30,6,'#34344a');rect(g,x+9,y-10,15,7,'#34344a')}}

export function renderWorld(g,level,player,teacher,camera,time,score,skin,line,invulnerable,visibleWidth=960){
  g.save();g.imageSmoothingEnabled=false;
  if(level.theme==='outside')sky(g,camera,time);else if(level.theme==='studio')workshop(g,camera,time);else corridor(g,camera,level.theme);
  const left=camera-60,right=camera+visibleWidth+60,visible=o=>o.x+(o.w||0)>=left&&o.x<=right;
  g.translate(-Math.round(camera),0);drawSolids(g,level,visible,left,right);for(const sign of level.signs)if(visible({x:sign.x,w:Math.max(110,sign.text.length*8+20)})){rect(g,sign.x,392,Math.max(110,sign.text.length*8+20),29,'#f8e4bd');text(g,sign.text,sign.x+10,412,'#36565b',12)}
  for(const hazard of level.hazards)if(visible(hazard))drawHazard(g,hazard);for(const mover of level.movers)if(visible(mover))drawMover(g,mover,time);
  for(const item of level.items)if(!item.taken&&visible(item))drawItem(g,item,time);if(visible(level.bonus))drawBonus(g,level.bonus,time);
  if(visible({x:level.checkpoint,w:42})){rect(g,level.checkpoint,412,5,48,'#d28f6c');rect(g,level.checkpoint+5,412,37,22,'#f2d5a5');text(g,'✓',level.checkpoint+15,430,'#3e6664',16)}
  if(visible(level.door))drawDoor(g,level.door,score===3);if(visible({x:teacher.x,w:260}))drawTeacher(g,teacher,line,time);drawPlayer(g,player,skin,invulnerable);g.restore();
  rect(g,16,16,level.theme==='outside'?285:310,34,'#263f48dd');text(g,level.theme==='outside'?'СПбГУПТД · БОЛЬШАЯ МОРСКАЯ, 18':level.theme==='studio'?'МАСТЕРСКАЯ · ГРАФИЧЕСКИЙ ДИЗАЙН':level.theme==='final'?'НА ЗАЩИТУ · ДЕДЛАЙН БЛИЗКО':'КОРИДОРЫ · ПОИСК АУДИТОРИИ',26,38,'#f8e7bd',12);
  if(teacher.state!=='patrol'){rect(g,335,16,122,34,teacher.state==='stunned'?'#48686a':'#b45f55');text(g,teacher.state==='stunned'?'✦ ПЕРЕДЫШКА':'! ПОГОНЯ',347,38,'#fff0d1',12)}
}
