import './styles/main.css';
import layout from './styles/layout.module.css';
import Game from './Game/Game';
import GameDOM from './Game/GameDOM';
import GameMediator from './Game/GameMediator';

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('mainsvg')!.style.display = 'block';
});

const app = document.querySelector<HTMLDivElement>('#app')!;
app.classList.add(`${layout.app}`);

new GameMediator(Game, GameDOM);

Game.start();
Game.makeUI();
