import assert from 'node:assert/strict';
import {Game} from '../Game.js';
import {LEVELS} from '../levels.js';

const frames=new Map();let nextFrame=1;
globalThis.requestAnimationFrame=callback=>{const id=nextFrame++;frames.set(id,callback);return id};
globalThis.cancelAnimationFrame=id=>frames.delete(id);
const storage=new Map();globalThis.localStorage={getItem:key=>storage.get(key),setItem:(key,value)=>storage.set(key,value)};
const node=()=>({textContent:'',style:{},classList:{add(){},remove(){}},setAttribute(){},innerHTML:''});
const makeUI=()=>({level:node(),items:node(),time:node(),hearts:node(),best:node(),overlay:node(),kicker:node(),title:node(),text:node(),action:node(),pause:node(),restart:node(),sound:node(),chapters:node(),status:node()});
const context={fillRect(){},fillText(){},save(){},restore(){},translate(){},createLinearGradient(){return{addColorStop(){}}},set fillStyle(v){},set font(v){},set imageSmoothingEnabled(v){}};
let layoutReads=0;const canvas={width:960,height:540,getContext:()=>context,getBoundingClientRect(){layoutReads++;return{width:960}},parentElement:{clientWidth:960}};
const input={clear(){},down(){return false},takeJump(){return false}};

const game=new Game(canvas,input,makeUI());
assert.deepEqual(game.availableSkins().filter(s=>s.unlocked).map(s=>s.id),['classic']);
assert.equal(game.setSkin('neon'),false);
assert.equal(layoutReads,1,'ширина холста измеряется при инициализации');
game.action();game.tick(0);game.tick(100);
assert.ok(game.level.time-game.time>.08,'после медленного кадра игровое время не должно теряться');
assert.equal(layoutReads,1,'разметка не измеряется на каждом кадре');
game.updateViewport();assert.equal(layoutReads,2,'размер обновляется по событию resize');
game.stopLoop();

game.loadLevel(0);game.levelScore=3;game.level.bonus.taken=false;game.completeLevel();
assert.equal(game.progress.unlocked,1,'следующая глава открывается и без бонуса');
assert.equal(game.availableSkins().find(s=>s.id==='coffee').unlocked,false,'образ требует бонуса');
game.loadLevel(0);game.levelScore=3;game.level.bonus.taken=true;game.hearts=2;game.completeLevel();
assert.equal(game.availableSkins().find(s=>s.id==='coffee').unlocked,true);

storage.set('poslednyaya-para-progress-v2',JSON.stringify({unlocked:3,skin:'classic',bestGrade:'S'}));
const legacy=new Game(canvas,input,makeUI());
assert.deepEqual(legacy.availableSkins().filter(s=>s.unlocked).map(s=>s.id),['classic'],'старый рекорд сам по себе не открывает образы');
storage.set('poslednyaya-para-progress-v2',JSON.stringify({unlocked:3,skin:'hoodie'}));
const selected=new Game(canvas,input,makeUI());
assert.deepEqual(selected.availableSkins().filter(s=>s.unlocked).map(s=>s.id),['classic','hoodie'],'ранее выбранный образ сохраняется');

for(const [index,level] of LEVELS.entries()){
  const item=level.items[1];
  assert.ok(level.movingPlatforms.length>0,`глава ${index+1}: нужна движущаяся платформа`);
  assert.ok(item.y+30<294,`глава ${index+1}: материал должен быть недоступен прыжком с земли`);
  assert.ok(level.movingPlatforms.some(platform=>platform.min<=item.x&&platform.max+platform.w>=item.x),`глава ${index+1}: платформа должна доезжать до материала`);
}
console.log('OK: образы открываются испытаниями, платформы обязательны, медленный кадр и resize обработаны');
