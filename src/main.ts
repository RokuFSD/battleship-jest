import './styles/main.css';
import layout from './styles/layout.module.css';
import Game from './Game/Game';
import GameDOM from './Game/GameDOM';
import GameMediator from './Game/GameMediator';
import { createElement } from './Helpers';

function welcomeScreen() {
  let welcome = createElement('div', { class: `${layout.welcome}` }, 'Welcome to Battleship');
  document.body.appendChild(welcome);
  setTimeout(() => {
    welcome.remove();
  }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('mainsvg')!.style.display = 'block';
});

const app = document.querySelector<HTMLDivElement>('#app')!;
app.classList.add(`${layout.app}`);

new GameMediator(Game, GameDOM);

welcomeScreen();
Game.start();
Game.makeUI();
