import './styles/main.css';
import layout from './styles/layout.module.css';
import loader from './styles/loader.module.css';
import Game from './Game/Game';
import GameDOM from './Game/GameDOM';
import GameMediator from './Game/GameMediator';
import Animations from './Helpers/Animations';
import { createElement } from './Helpers';

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('mainsvg')!.style.display = 'block';
});

function welcomeScreen(): Promise<HTMLElement> {
  return new Promise((resolve) => {
    let welcome = createElement('div', { class: `${loader.loader}` }, [
      createElement('h1', { class: `${loader.title}` }, 'Battleship'),
    ]);
    document.body.appendChild(welcome);
    setTimeout(() => {
      resolve(welcome);
    }, 3000);
  });
}

async function main() {
  const app = document.querySelector<HTMLDivElement>('#app')!;
  const screen = await welcomeScreen();
  Animations.closeAnimation(screen);
  app.classList.add(`${layout.app}`);
  new GameMediator(Game, GameDOM);
  Game.start();
  Game.makeUI();
}

main();
