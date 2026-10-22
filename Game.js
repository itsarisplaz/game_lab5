import {Player} from './Player.js';
import {overlaps,moveWithPlatforms} from './collision.js';
import {LEVELS,makeLevel} from './levels.js';
import {renderWorld} from './art.js';
import {Sound} from './sound.js';

const SAVE_KEY='poslednyaya-para-progress-v2';
const SKINS=['classic','coffee','hoodie','neon','graduate'];
const SKIN_REWARDS=['coffee','hoodie','neon'];
const GRADE_RANK={C:1,B:2,A:3,S:4};
const formatTime=value=>{const n=Math.ceil(Math.max(0,value));return `${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`};
const setText=(node,value)=>{if(node.textContent!==value)node.textContent=value};
const FRAME_STEP=1/60;

export class Game{
  constructor(canvas,input,ui){
    this.canvas=canvas;this.g=canvas.getContext('2d');this.input=input;this.ui=ui;this.player=new Player();this.sound=new Sound();
    this.frameId=null;this.lastTime=null;this.accumulator=0;this.elapsed=0;this.camera=0;this.visibleWidth=canvas.width;this.state='ready';this.levelIndex=0;this.total=0;this.hits=0;this.bonusCount=0;this.savedTime=0;this.startedFromLevel=0;this.onPoster=null;
    this.updateViewport();
    this.progress=this.readProgress();this.skin=this.progress.skin;this.loadLevel(0);
    this.showOverlay('ДЕНЬ ЗАЩИТЫ · СПбГУПТД','Последняя пара','Четыре главы, подозрительно быстрые преподаватели и финальный макет. Собери материалы графического дизайна и успей на просмотр.','Начать игру');this.render();
  }
  readProgress(){
    try{const data=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}');const unlockedSkins=Array.isArray(data.unlockedSkins)?data.unlockedSkins.filter(id=>SKINS.includes(id)):['classic'];if(!unlockedSkins.includes('classic'))unlockedSkins.unshift('classic');if(SKINS.includes(data.skin)&&!unlockedSkins.includes(data.skin))unlockedSkins.push(data.skin);return {unlocked:Math.max(0,Math.min(3,Number(data.unlocked)||0)),bestGrade:['C','B','A','S'].includes(data.bestGrade)?data.bestGrade:null,bestScore:Number.isFinite(Number(data.bestScore))&&data.bestScore!=null?Math.max(0,Math.min(100,Number(data.bestScore))):null,skin:unlockedSkins.includes(data.skin)?data.skin:'classic',unlockedSkins,bestPoster:Number(data.bestPoster)||0};}
    catch{return {unlocked:0,bestGrade:null,bestScore:null,skin:'classic',unlockedSkins:['classic'],bestPoster:0};}
  }
  saveProgress(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(this.progress))}catch{/* storage may be unavailable */}}
  availableSkins(){return SKINS.map(id=>({id,unlocked:this.progress.unlockedSkins.includes(id)}));}
  unlockSkin(id){if(!SKINS.includes(id)||this.progress.unlockedSkins.includes(id))return false;this.progress.unlockedSkins.push(id);this.saveProgress();return true}
  setSkin(id){if(!this.availableSkins().some(s=>s.id===id&&s.unlocked))return false;this.skin=id;this.progress.skin=id;this.saveProgress();this.render();return true;}
  updateViewport(){const displayed=this.canvas.getBoundingClientRect?.().width||this.canvas.width;const viewport=this.canvas.parentElement?.clientWidth||displayed;this.visibleWidth=Math.min(this.canvas.width,this.canvas.width*viewport/displayed)}
  selectLevel(index){if(index>this.progress.unlocked||index<0||index>=LEVELS.length)return false;this.stopLoop();this.startedFromLevel=index;this.total=index*3;this.hits=0;this.bonusCount=0;this.savedTime=0;this.loadLevel(index);this.state='ready';this.showOverlay(`ГЛАВА 0${index+1} / 04`,this.level.name,this.level.intro,'В путь');this.render();return true;}
  loadLevel(index){
    this.levelIndex=index;this.level=makeLevel(index);this.level.collisionSolids=[...this.level.solids,...this.level.movingPlatforms];this.player.reset();this.input.clear();this.time=this.level.time;this.levelScore=0;this.hearts=3;this.invulnerable=0;this.checkpointReached=false;this.camera=0;this.teacherLine='';this.teacherLineTime=0;this.teacherQuoteClock=0;this.level.teacher.x=this.level.teacher.trigger-270;this.updateUI();this.ui.status.textContent=this.level.intro;
  }
  updateUI(){
    setText(this.ui.level,`0${this.levelIndex+1} / 04 · ${this.level.short}`);setText(this.ui.items,`${this.levelScore} / 3`);setText(this.ui.time,formatTime(this.time));const color=this.time<30?'#ff9a82':'';if(this.ui.time.style.color!==color)this.ui.time.style.color=color;
    setText(this.ui.hearts,'♥'.repeat(this.hearts)+'♡'.repeat(3-this.hearts));setText(this.ui.best,this.progress.bestGrade?this.progress.bestScore===null?`Оценка ${this.progress.bestGrade}`:`${this.progress.bestScore} баллов · ${this.progress.bestGrade}`:'Пока нет');
    setText(this.ui.pause,this.state==='paused'?'▶ Продолжить':'⏸ Пауза');setText(this.ui.sound,this.sound.enabled?'♪ Звук вкл.':'♪ Звук выкл.');if(this.ui.sound.getAttribute?.('aria-pressed')!==String(this.sound.enabled))this.ui.sound.setAttribute('aria-pressed',String(this.sound.enabled));
    setText(this.ui.chapters,`Маршрут: ${this.progress.unlocked+1} / 4`);
  }
  showOverlay(kicker,title,description,action){this.ui.kicker.textContent=kicker;this.ui.title.textContent=title;this.ui.text.textContent=description;this.ui.action.innerHTML=`${action} <span>→</span>`;this.ui.overlay.classList.remove('hidden')}
  hideOverlay(){this.ui.overlay.classList.add('hidden')}
  stopLoop(){if(this.frameId!==null)cancelAnimationFrame(this.frameId);this.frameId=null;this.lastTime=null;this.accumulator=0;this.input.clear()}
  play(){if(this.state==='playing'||this.state==='poster')return;if(this.state==='won')this.restart();if(this.state==='lost'){this.loadLevel(this.levelIndex)}if(this.state==='transition')this.loadLevel(this.levelIndex+1);this.state='playing';this.hideOverlay();this.updateUI();this.lastTime=null;if(this.frameId===null)this.frameId=requestAnimationFrame(t=>this.tick(t))}
  pause(auto=false){if(this.state!=='playing')return;this.state='paused';this.stopLoop();this.updateUI();this.showOverlay('ПЕРЕРЫВ','Маршрут на паузе',auto?'Вкладка была скрыта. Дедлайн остановлен.':'Можно перевести дух. Преподаватели тоже замерли.','Продолжить')}
  togglePause(){if(this.state==='playing')this.pause();else if(this.state==='paused')this.play()}
  restart(){this.stopLoop();this.startedFromLevel=0;this.total=0;this.hits=0;this.bonusCount=0;this.savedTime=0;this.loadLevel(0);this.state='playing';this.hideOverlay();this.updateUI();this.frameId=requestAnimationFrame(t=>this.tick(t))}
  action(){if(this.state==='won')this.restart();else this.play()}
  toggleSound(){this.sound.toggle();this.updateUI()}
  tick(timestamp){
    this.frameId=null;if(this.state!=='playing')return;
    const dt=this.lastTime===null?0:Math.min(Math.max(0,(timestamp-this.lastTime)/1000),.12);this.lastTime=timestamp;this.accumulator=Math.min(.12,this.accumulator+dt);
    while(this.accumulator>=FRAME_STEP&&this.state==='playing'){this.accumulator-=FRAME_STEP;this.update(FRAME_STEP)}
    this.render();if(this.state==='playing')this.frameId=requestAnimationFrame(t=>this.tick(t));
  }
  update(dt){
    this.elapsed+=dt;this.invulnerable=Math.max(0,this.invulnerable-dt);this.teacherLineTime=Math.max(0,this.teacherLineTime-dt);this.time=Math.max(0,this.time-dt);if(this.time<=0){this.lose('Дедлайн истёк. Преподавательница уже подписывает ведомость.');return}
    this.updatePlatforms(dt);
    const p=this.player,jumped=p.update(dt,this.input);if(jumped)this.sound.play('jump');moveWithPlatforms(p,this.level.collisionSolids,dt);p.x=Math.max(0,Math.min(this.level.width-p.w,p.x));
    if(p.y>570){this.hit('Листы полетели в пропасть!');return}
    const door=this.level.door,exitZone={x:door.x-16,y:door.y-28,w:door.w+32,h:door.h+128};
    if(this.levelScore===3&&overlaps(p,exitZone)){this.completeLevel();return}
    if(!this.checkpointReached&&p.x>=this.level.checkpoint){this.checkpointReached=true;this.ui.status.textContent='Контрольная точка сохранена ✓'}
    for(const hazard of this.level.hazards)if(overlaps(p,hazard)){this.hit('Ой! Препятствие задержало тебя.');return}
    for(const mover of this.level.movers){mover.x+=mover.speed*mover.dir*dt;if(mover.x<mover.min){mover.x=mover.min;mover.dir=1}else if(mover.x>mover.max){mover.x=mover.max;mover.dir=-1}if(overlaps(p,mover)){this.hit(mover.type==='printer'?'Принтер выплюнул «ОШИБКА»!':'Макеты решили погулять сами.');return}}
    this.updateTeacher(dt);
    for(const item of this.level.items)if(!item.taken&&overlaps(p,item)){item.taken=true;this.levelScore++;this.sound.play('collect');this.ui.status.textContent=`Найдено: ${item.name} · ${this.levelScore}/3`}
    if(!this.level.bonus.taken&&overlaps(p,this.level.bonus)){this.level.bonus.taken=true;this.bonusCount++;this.time+=12;this.ui.status.textContent='Вдохновение! +12 секунд и бонус к оценке';this.sound.play('collect')}
    if(overlaps(p,exitZone)){if(this.levelScore===3)this.completeLevel();else this.ui.status.textContent=`Для двери не хватает материалов: ${3-this.levelScore}`}
    const target=Math.max(0,Math.min(this.level.width-this.visibleWidth,p.x-this.visibleWidth*.3));this.camera+=(target-this.camera)*Math.min(1,dt*7);this.updateUI();
  }
  updatePlatforms(dt){for(const q of this.level.movingPlatforms){const old=q.x;q.x+=q.speed*q.dir*dt;if(q.x<q.min){q.x=q.min;q.dir=1}else if(q.x>q.max){q.x=q.max;q.dir=-1}if(this.player.grounded&&Math.abs(this.player.y+this.player.h-q.y)<3&&this.player.x+this.player.w>old&&this.player.x<old+q.w)this.player.x+=q.x-old}}
  updateTeacher(dt){
    const t=this.level.teacher,p=this.player;if(p.x<t.trigger&&t.state==='patrol')return;
    if(t.state==='patrol'){t.state='notice';t.notice=.35;t.x=Math.max(0,p.x-t.lead);this.say(t.quote)}
    if(t.stun>0){t.stun-=dt;t.state='stunned';return}
    if(t.state==='stunned'){t.state='chase';this.say('«Вы думали, я отстала?»')}
    const noticing=t.state==='notice';if(noticing){t.notice-=dt;if(t.notice<=0)t.state='chase'}
    const high=p.y<325;if(!noticing)t.state=high?'search':'chase';
    const target=p.x+8,step=t.speed*(noticing?.7:high?.75:1)*dt;
    t.x+=Math.max(-step,Math.min(step,target-t.x));
    this.teacherQuoteClock+=dt;if(this.teacherQuoteClock>8){this.teacherQuoteClock=0;this.say(t.quote)}
    const touching=Math.abs((p.x+p.w/2)-(t.x+22))<t.catchDistance;
    if(touching&&p.vy>0&&p.y+p.h>=t.y-8&&p.y+p.h<=t.y+12){t.stun=1.8;t.state='stunned';p.vy=-260;this.say('«Акробатика засчитана... наверное»');this.ui.status.textContent='Прыжок над преподавателем: +стиль';return}
    if(this.invulnerable===0&&touching&&overlaps(p,{x:t.x,y:t.y,w:44,h:50}))this.hit('Преподавательница догнала: «А где презентация?»')
  }
  say(line){this.teacherLine=line;this.teacherLineTime=3.2}
  hit(reason){if(this.invulnerable>0)return;this.hearts--;this.hits++;this.time=Math.max(10,this.time-8);this.sound.play('hurt');this.say(this.level.teacher.type==='granny'?'«Вы опять последняя?»':'«До просмотра две минуты!»');if(this.hearts<=0){this.lose(reason);return}this.player.reset();if(this.checkpointReached)this.player.x=this.level.checkpoint+25;this.invulnerable=2.3;this.level.teacher.x=Math.max(0,this.player.x-this.level.teacher.lead);this.level.teacher.state='notice';this.level.teacher.notice=.35;this.ui.status.textContent=`${reason} Осталось попыток: ${this.hearts}`;this.updateUI()}
  lose(reason){this.state='lost';this.stopLoop();this.sound.play('hurt');this.showOverlay('МАРШРУТ ПРЕРВАН','Ещё одна попытка?',`${reason} Начнёшь снова с этой главы: предыдущие главы уже зачтены.`,'Повторить главу');this.ui.status.textContent='Попробуй другой маршрут';this.updateUI()}
  completeLevel(){
    this.stopLoop();this.total+=3;this.savedTime+=this.time;this.sound.play('next');
    if(this.levelIndex<3){this.progress.unlocked=Math.max(this.progress.unlocked,this.levelIndex+1);const reward=this.level.bonus.taken&&this.hearts>=2&&this.unlockSkin(SKIN_REWARDS[this.levelIndex]);this.saveProgress();this.state='transition';this.showOverlay(`ГЛАВА 0${this.levelIndex+1} ПРОЙДЕНА`,this.levelIndex===2?'Макет почти готов!':'Есть! Идём дальше',`Найдено 3/3 материала. ${reward?'Новый образ открыт! ':''}Впереди: ${LEVELS[this.levelIndex+1].name}.`,'Следующая глава')}
    else{this.state='poster';this.ui.status.textContent='Последний шаг: повтори композицию постера';this.onPoster?.(this.posterChallenge())}
    this.updateUI();
  }
  posterChallenge(){if(this.startedFromLevel>0)return 'standard';if(this.hits<=1&&this.bonusCount>=3)return 'easy';if(this.hits>=4||this.bonusCount<=1)return 'hard';return 'standard'}
  previewPoster(score){
    const posterPoints=Math.round(Math.max(0,Math.min(100,Math.round(score)))*.55),bonusPoints=this.bonusCount*6,carePoints=Math.max(0,16-this.hits*3),timePoints=Math.round(Math.min(5,Math.max(0,this.savedTime/LEVELS.reduce((sum,level)=>sum+level.time,0)*5)));
    const routePoints=bonusPoints+carePoints+timePoints,points=Math.min(100,posterPoints+routePoints);
    return {posterPoints,bonusPoints,carePoints,timePoints,routePoints,points,grade:points>=90?'S':points>=75?'A':points>=60?'B':'C'};
  }
  finishPoster(posterScore){
    if(this.state!=='poster')return;this.posterScore=Math.max(0,Math.min(100,Math.round(posterScore)));
    const result=this.previewPoster(this.posterScore),{points,grade}=result;this.grade=grade;this.state='won';
    if(!this.progress.bestGrade||GRADE_RANK[grade]>GRADE_RANK[this.progress.bestGrade])this.progress.bestGrade=grade;
    const reward=(grade==='A'||grade==='S')&&this.unlockSkin('graduate');this.progress.bestScore=Math.max(this.progress.bestScore??0,points);this.progress.bestPoster=Math.max(this.progress.bestPoster,this.posterScore);this.progress.unlocked=3;this.saveProgress();this.sound.play('win');
    const verdict={S:'«Ладно, это действительно сильная работа.»',A:'«Композиция держится. Засчитано!»',B:'«Хорошо. Но сетку ещё поправим.»',C:'«Защиту зачту, макет доработай.»'}[grade];
    this.showOverlay('ЗАЩИТА СОСТОЯЛАСЬ',`Оценка ${grade} · ${points} баллов`,`Макет: ${this.posterScore}% → ${result.posterPoints} баллов. Бонусы: ${result.bonusPoints}, аккуратность: ${result.carePoints}, время: ${result.timePoints}. ${verdict}${reward?' Открыт образ выпускницы!':''}`,'Сыграть ещё раз');this.ui.status.textContent=`Защита завершена · оценка ${grade}`;this.updateUI();this.render();
  }
  render(){renderWorld(this.g,this.level,this.player,this.level.teacher,this.camera,this.elapsed,this.levelScore,this.skin,this.teacherLineTime>0?this.teacherLine:'',this.invulnerable,this.visibleWidth)}
}
