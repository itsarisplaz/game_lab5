import assert from 'node:assert/strict';
import {Game} from '../Game.js';

globalThis.requestAnimationFrame=()=>1;globalThis.cancelAnimationFrame=()=>{};
const values=new Map();globalThis.localStorage={getItem:key=>values.get(key),setItem:(key,value)=>values.set(key,value)};
const node=()=>({textContent:'',style:{},classList:{add(){},remove(){}},setAttribute(){},innerHTML:''});
const ui={level:node(),items:node(),time:node(),hearts:node(),best:node(),overlay:node(),kicker:node(),title:node(),text:node(),action:node(),pause:node(),restart:node(),sound:node(),chapters:node(),status:node()};
const ctx={fillRect(){},fillText(){},save(){},restore(){},translate(){},createLinearGradient(){return{addColorStop(){}}},set fillStyle(v){},set font(v){},set imageSmoothingEnabled(v){}};
const jumps=[[105,285,550,875,1170,1360,1730,2010,2320,2600],[110,300,565,880,1230,1540,1780,2090,2380,2720],[120,315,580,925,1240,1600,1880,2150,2480,2820],[110,300,550,900,1210,1540,1800,2090,2370,2670]];
let chapter=0,jumpIndex=0;let game;
const input={clear(){},down(action){return action==='right'},takeJump(){if(jumpIndex<jumps[chapter].length&&game.player.grounded&&game.player.x>=jumps[chapter][jumpIndex]){jumpIndex++;return true}return false}};
game=new Game({width:960,height:540,getContext:()=>ctx},input,ui);game.action();
const hits=[];const originalHit=game.hit.bind(game);game.hit=reason=>{if(game.invulnerable===0)hits.push({chapter:chapter+1,x:Math.round(game.player.x),reason});return originalHit(reason)};
let frames=0;
for(;frames<7500&&game.state!=='poster';frames++){
  if(game.state==='transition'){chapter++;jumpIndex=0;game.action()}
  if(game.state==='playing')game.update(1/60);
  assert.notEqual(game.state,'lost',`глава ${chapter+1}: x=${game.player.x.toFixed(0)}, y=${game.player.y.toFixed(0)}, предметов=${game.levelScore}, прыжков=${jumpIndex}, попыток=${game.hearts}; задержки=${JSON.stringify(hits)}`);
}
assert.equal(game.state,'poster',`незавершённый маршрут: глава ${chapter+1}, x=${game.player.x.toFixed(0)}, предметов=${game.levelScore}, прыжков=${jumpIndex}, время=${game.time.toFixed(0)}`);
console.log(`OK: четыре длинные главы пройдены физикой за ${Math.round(frames/60)} секунд симуляции`);
