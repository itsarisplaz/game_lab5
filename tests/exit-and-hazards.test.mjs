import assert from 'node:assert/strict';
import {Game} from '../Game.js';
import {LEVELS} from '../levels.js';

globalThis.requestAnimationFrame=()=>1;
globalThis.cancelAnimationFrame=()=>{};
const saved=new Map();
globalThis.localStorage={getItem:key=>saved.get(key),setItem:(key,value)=>saved.set(key,value)};
const node=()=>({textContent:'',style:{},classList:{add(){},remove(){}},setAttribute(){},innerHTML:''});
const context={fillRect(){},fillText(){},save(){},restore(){},translate(){},createLinearGradient(){return{addColorStop(){}}},set fillStyle(v){},set font(v){},set imageSmoothingEnabled(v){}};
const canvas={width:960,height:540,getContext:()=>context};
const input={clear(){},down(){return false},takeJump(){return false}};
const makeGame=level=>{
  const ui={level:node(),items:node(),time:node(),hearts:node(),best:node(),overlay:node(),kicker:node(),title:node(),text:node(),action:node(),pause:node(),restart:node(),sound:node(),chapters:node(),status:node()};
  const game=new Game(canvas,input,ui);
  game.loadLevel(level);game.state='playing';game.invulnerable=10;
  return game;
};

for(let index=0;index<LEVELS.length;index++){
  const door=LEVELS[index].door;
  const expected=index===3?'poster':'transition';
  for(const approach of ['above','left','right','below']){
    const game=makeGame(index),p=game.player;
    game.levelScore=3;
    if(approach==='above'){
      p.x=door.x+15;p.y=door.y-80;p.vy=320;p.grounded=false;
      for(let frame=0;frame<20&&game.state==='playing';frame++)game.update(1/60);
    }else{
      p.x=approach==='left'?door.x-28:approach==='right'?door.x+door.w+12:door.x+12;
      p.y=approach==='below'?413:door.y+10;
      game.update(0);
    }
    assert.equal(game.state,expected,`глава ${index+1}: выход должен работать ${approach}`);
  }
  const locked=makeGame(index);locked.player.x=door.x+15;locked.player.y=door.y+10;locked.update(0);
  assert.equal(locked.state,'playing','без трёх материалов выход закрыт');
  const hazard=LEVELS[index].hazards.find(h=>h.y<400);
  assert.ok(hazard,`глава ${index+1}: нужна опасность на верхнем пути`);
  const danger=makeGame(index);danger.invulnerable=0;danger.player.x=hazard.x+2;danger.player.y=hazard.y-37;danger.update(0);
  assert.equal(danger.hearts,2,`глава ${index+1}: верхняя опасность должна задерживать игрока`);
  assert.ok(LEVELS[index].hazards.some(h=>h.y>=400&&h.w>=100),`глава ${index+1}: нижняя опасность должна занимать заметную часть пути`);
}

console.log('OK: все выходы доступны сверху, сбоку и снизу; опасности есть на обоих путях');
