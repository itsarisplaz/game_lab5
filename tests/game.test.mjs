import assert from 'node:assert/strict';
import {Game} from '../Game.js';
import {Player} from '../Player.js';
import {moveWithPlatforms} from '../collision.js';
import {LEVELS} from '../levels.js';
import {POSTER_INITIAL,POSTER_TARGET,scorePoster} from '../poster.js';

const callbacks=new Map();let nextId=1;
globalThis.requestAnimationFrame=callback=>{const id=nextId++;callbacks.set(id,callback);return id};
globalThis.cancelAnimationFrame=id=>callbacks.delete(id);
const store=new Map();globalThis.localStorage={getItem:key=>store.get(key),setItem:(key,value)=>store.set(key,value)};
const element=()=>({textContent:'',style:{},classList:{add(){},remove(){}},setAttribute(){},innerHTML:''});
const ui={level:element(),items:element(),time:element(),hearts:element(),best:element(),overlay:element(),kicker:element(),title:element(),text:element(),action:element(),pause:element(),restart:element(),sound:element(),chapters:element(),status:element()};
const context={fillRect(){},fillText(){},save(){},restore(){},translate(){},createLinearGradient(){return{addColorStop(){}}},set fillStyle(v){},set font(v){},set imageSmoothingEnabled(v){}};
const canvas={width:960,height:540,getContext:()=>context};
const input={clear(){},down(){return false},takeJump(){return false}};

assert.equal(LEVELS.length,4);
assert.ok(LEVELS.every(level=>level.width>=2900&&level.items.length===3&&level.solids.filter(s=>s.kind==='platform').length>=5));
const game=new Game(canvas,input,ui);assert.equal(game.state,'ready');game.action();assert.equal(callbacks.size,1);
for(let i=0;i<5;i++){game.pause();assert.equal(callbacks.size,0);game.play();assert.equal(callbacks.size,1);game.restart();assert.equal(callbacks.size,1)}

const teacher=game.level.teacher;
game.player.x=teacher.trigger;game.player.y=413;
game.updateTeacher(1/60);
assert.equal(teacher.state,'notice');
assert.ok(teacher.x>game.player.x-teacher.lead,'преподаватель должен начать движение при обнаружении');
for(let i=0;i<120&&game.hearts===3;i++)game.updateTeacher(1/60);
assert.equal(game.hearts,2,'преподаватель должен догонять стоящего игрока');
game.player.x=500;game.player.y=413;teacher.x=480;teacher.state='chase';game.invulnerable=1;
game.updateTeacher(1/60);
assert.ok(teacher.x>450,'неуязвимость не должна телепортировать преподавателя назад');
game.loadLevel(0);

const player=new Player();player.x=210;player.y=300;player.vy=400;moveWithPlatforms(player,LEVELS[0].solids,.1);
assert.equal(player.grounded,true);assert.equal(player.y,LEVELS[0].solids[4].y-player.h);
player.y-=50;player.vy=-100;moveWithPlatforms(player,LEVELS[0].solids,.01);assert.equal(player.grounded,false);

let posterOpens=0;game.onPoster=()=>posterOpens++;
for(let level=0;level<4;level++){
  assert.equal(game.levelIndex,level);
  for(const item of game.level.items){game.player.x=item.x;game.player.y=item.y;game.player.vy=0;game.update(0)}
  assert.equal(game.levelScore,3);
  const b=game.level.bonus;game.player.x=b.x;game.player.y=b.y;game.player.vy=0;game.update(0);
  game.player.x=game.level.door.x;game.player.y=game.level.door.y;game.player.vy=0;game.update(0);
  if(level<3){assert.equal(game.state,'transition');game.action();assert.equal(callbacks.size,1)}
}
assert.equal(game.state,'poster');assert.equal(posterOpens,1);assert.equal(callbacks.size,0);
assert.ok(scorePoster(POSTER_TARGET)>scorePoster(POSTER_INITIAL));assert.equal(scorePoster(POSTER_TARGET),100);
game.finishPoster(95);assert.equal(game.state,'won');assert.equal(game.grade,'S');assert.equal(game.progress.unlocked,3);assert.equal(game.progress.bestGrade,'S');assert.ok(game.progress.bestScore>=90);assert.equal(game.availableSkins().every(s=>s.unlocked),true);
const reloaded=new Game(canvas,input,ui);assert.equal(reloaded.progress.bestScore,game.progress.bestScore);assert.match(ui.best.textContent,/баллов/);

game.selectLevel(2);assert.equal(game.levelIndex,2);game.play();assert.equal(game.state,'playing');
game.player.x=game.level.checkpoint+1;game.player.y=413;game.update(0);assert.equal(game.checkpointReached,true);
game.hit('Тест');assert.equal(game.hearts,2);assert.ok(game.player.x>game.level.checkpoint);
game.invulnerable=0;game.hit('Тест');game.invulnerable=0;game.hit('Тест');assert.equal(game.state,'lost');assert.equal(callbacks.size,0);
game.action();assert.equal(game.state,'playing');assert.equal(game.levelIndex,2);assert.equal(game.hearts,3);assert.equal(callbacks.size,1);
console.log('OK: 4 главы, один цикл, контрольные точки, попытки, образы, редактор постера и оценка');
