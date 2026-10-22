import {Input} from './input.js';
import {Game} from './Game.js';
import {PosterEditor,POSTER_CHALLENGES} from './poster.js';
import {LEVELS} from './levels.js';

const byId=id=>document.getElementById(id);
const ui={level:byId('level-label'),items:byId('items-label'),time:byId('time-label'),hearts:byId('hearts-label'),best:byId('best-label'),overlay:byId('overlay'),kicker:byId('overlay-kicker'),title:byId('overlay-title'),text:byId('overlay-text'),action:byId('overlay-action'),pause:byId('pause-btn'),restart:byId('restart-btn'),sound:byId('sound-btn'),chapters:byId('chapters-btn'),status:byId('status')};
const game=new Game(byId('game'),new Input(),ui);
const poster=new PosterEditor(byId('poster-studio'),score=>game.finishPoster(score));
game.onPoster=challenge=>poster.open(POSTER_CHALLENGES[challenge],score=>game.previewPoster(score));

ui.action.addEventListener('click',()=>game.action());ui.pause.addEventListener('click',()=>game.togglePause());ui.restart.addEventListener('click',()=>{poster.close();game.restart()});ui.sound.addEventListener('click',()=>game.toggleSound());
document.addEventListener('visibilitychange',()=>{if(document.hidden)game.pause(true)});
window.addEventListener('resize',()=>game.updateViewport());
window.addEventListener('keydown',event=>{if((event.code==='KeyP'||event.code==='Escape')&&!byId('skins-dialog').open&&!byId('chapters-dialog').open&&!document.body.classList.contains('studio-open')){event.preventDefault();game.togglePause()}});

const skinInfo={classic:['Студентка','Классический образ','#d47961'],coffee:['Кофе и дедлайн','Глава 1: бонус и не меньше 2 сердец','#9c7157'],hoodie:['Ночной дизайнер','Глава 2: бонус и не меньше 2 сердец','#56798d'],neon:['Яркий макет','Глава 3: бонус и не меньше 2 сердец','#b76883'],graduate:['Защита пройдена','Финальная оценка A или S','#413b59']};
function showSkins(){if(game.state==='playing')game.pause();const dialog=byId('skins-dialog'),container=byId('skin-options');container.replaceChildren();for(const skin of game.availableSkins()){const [name,description,color]=skinInfo[skin.id],button=document.createElement('button');button.type='button';button.disabled=!skin.unlocked;button.classList.toggle('selected',game.skin===skin.id);button.innerHTML=`<span class="skin-swatch" style="background:${color}"></span>${name}<small>${skin.unlocked?description:'Откроется позже · '+description}</small>`;button.addEventListener('click',()=>{game.setSkin(skin.id);dialog.close()});container.append(button)}dialog.showModal()}
function showChapters(){if(game.state==='playing')game.pause();const dialog=byId('chapters-dialog'),container=byId('chapter-options');container.replaceChildren();LEVELS.forEach((level,index)=>{const button=document.createElement('button');button.type='button';button.disabled=index>game.progress.unlocked;button.innerHTML=`0${index+1} · ${level.name}<small>${index>game.progress.unlocked?'Пока закрыта':index===game.levelIndex?'Текущая глава':'Выбрать маршрут'}</small>`;button.addEventListener('click',()=>{if(game.selectLevel(index))dialog.close()});container.append(button)});dialog.showModal()}
byId('skins-btn').addEventListener('click',showSkins);byId('chapters-btn').addEventListener('click',showChapters);
document.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>byId(button.dataset.close).close()));
