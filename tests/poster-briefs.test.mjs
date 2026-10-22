import assert from 'node:assert/strict';
import {Game} from '../Game.js';
import {POSTER_CHALLENGES,POSTER_INITIAL,PosterEditor,posterAdvice,scorePoster} from '../poster.js';

const difficulty=['easy','standard','hard'].map(id=>scorePoster(POSTER_INITIAL,POSTER_CHALLENGES[id].target));
assert.ok(difficulty[0]>difficulty[1]&&difficulty[1]>difficulty[2],'стартовый макет должен быть ближе к лёгкому референсу');
for(const brief of Object.values(POSTER_CHALLENGES)){
  assert.equal(scorePoster(brief.target,brief.target),100);
  assert.equal(brief.target.length,4);
  assert.match(posterAdvice(POSTER_INITIAL,brief.target),/слоя|референсе/);
}

globalThis.requestAnimationFrame=()=>1;globalThis.cancelAnimationFrame=()=>{};
globalThis.localStorage={getItem:()=>null,setItem(){}};
const node=()=>({textContent:'',style:{},classList:{add(){},remove(){}},setAttribute(){},innerHTML:''});
const ui={level:node(),items:node(),time:node(),hearts:node(),best:node(),overlay:node(),kicker:node(),title:node(),text:node(),action:node(),pause:node(),restart:node(),sound:node(),chapters:node(),status:node()};
const ctx={fillRect(){},fillText(){},save(){},restore(){},translate(){},createLinearGradient(){return{addColorStop(){}}},set fillStyle(v){},set font(v){},set imageSmoothingEnabled(v){}};
const game=new Game({width:960,height:540,getContext:()=>ctx},{clear(){},down(){return false},takeJump(){return false}},ui);
game.bonusCount=4;game.hits=0;assert.equal(game.posterChallenge(),'easy');
game.bonusCount=2;game.hits=2;assert.equal(game.posterChallenge(),'standard');
game.bonusCount=0;game.hits=4;assert.equal(game.posterChallenge(),'hard');
game.startedFromLevel=3;assert.equal(game.posterChallenge(),'standard','выбор последней главы не должен считаться плохим полным прохождением');
game.startedFromLevel=0;game.state='poster';game.savedTime=300;
const predicted=game.previewPoster(87);game.finishPoster(87);
assert.equal(game.progress.bestScore,predicted.points,'предварительная проверка и защита используют одну формулу');
assert.equal(game.grade,predicted.grade);

const makeNode=()=>({textContent:'',dataset:{},classList:{add(){},remove(){},toggle(){},contains(){return false}},listeners:{},addEventListener(type,callback){this.listeners[type]=callback},setAttribute(){},focus(){}});
const canvasContext={clearRect(){},fillRect(){},fillText(){},save(){},restore(){},translate(){},rotate(){},beginPath(){},arc(){},fill(){},lineTo(){},closePath(){},setLineDash(){},strokeRect(){}};
const nodes=new Map(['#reference-canvas','#work-canvas','#poster-feedback','#guides-btn','#poster-check','#poster-submit','#poster-reset','#selected-layer','#poster-brief-title','#poster-brief-reason','#poster-rules'].map(id=>[id,makeNode()]));
for(const id of ['#reference-canvas','#work-canvas'])nodes.get(id).getContext=()=>canvasContext;
const layers=['circle','arch','bar','title'].map(id=>Object.assign(makeNode(),{dataset:{layer:id}}));
const colors=['#dc7f67','#2f535b','#76a49a','#e9bb73'].map(color=>Object.assign(makeNode(),{dataset:{color}}));
const adjustments=['smaller','larger','rotate-left','rotate-right'].map(adjust=>Object.assign(makeNode(),{dataset:{adjust}}));
const root={classList:{add(){},remove(){},contains(){return false}},querySelector:id=>nodes.get(id),querySelectorAll:selector=>({'[data-layer]':layers,'[data-color]':colors,'[data-adjust]':adjustments}[selector])};
globalThis.window={addEventListener(){}};globalThis.document={body:{classList:{add(){},remove(){}}}};
let submitted=null;const editor=new PosterEditor(root,score=>{submitted=score});
editor.open(POSTER_CHALLENGES.hard,score=>game.previewPoster(score));
assert.match(nodes.get('#poster-brief-title').textContent,/Пересдача/);
assert.match(nodes.get('#poster-rules').textContent,/55 баллов/);
nodes.get('#poster-check').listeners.click();
assert.match(nodes.get('#poster-feedback').textContent,/предварительно \d+\/100 · оценка/);
editor.adjust('larger');assert.match(nodes.get('#poster-feedback').textContent,/Макет изменён/);
nodes.get('#poster-submit').listeners.click();assert.equal(submitted,editor.score());
console.log('OK: три разных брифа, выбор по маршруту, подсказка и совпадение предварительной с итоговой оценкой');
