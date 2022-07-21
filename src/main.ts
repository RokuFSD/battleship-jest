import './styles/main.css';
import layout from './styles/layout.module.css';
import Game from './Game/Game';
import BattleshipDOM from './Helpers/BattleshipDOM';
import GameMediator from './Helpers/Mediator';

const app = document.querySelector<HTMLDivElement>('#app')!;
app.classList.add(`${layout.app}`);

new GameMediator(Game, BattleshipDOM);

Game.start();
Game.makeUI();