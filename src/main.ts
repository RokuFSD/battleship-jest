import './styles/main.css';
import layout from './styles/layout.module.css';
import Game from './Game/Game';

const app = document.querySelector<HTMLDivElement>('#app')!;
app.classList.add(`${layout.app}`);

Game.start(app);
Game.placeShips();
Game.makeUI();
