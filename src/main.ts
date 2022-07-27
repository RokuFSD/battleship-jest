import './styles/main.css';
import layout from './styles/layout.module.css';
import Game from './Game/Game';
import GameDOM from './Game/GameDOM';
import GameMediator from './Game/GameMediator';
import { createElement } from './Helpers';

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('mainsvg')!.style.display = 'block';
});

function welcomeScreen(): Promise<HTMLElement> {
  return new Promise((resolve) => {
    let welcome = createElement('div', { class: `${layout.welcome}` }, 'Welcome to Battleship');
    document.body.appendChild(welcome);
    setTimeout(() => {
      resolve(welcome);
    }, 3000);
  });
}

/*TODO: Create a new file for animations*/

function closeAnimation(element: HTMLElement) {
  let opacity = 1;
  function decrease() {
    opacity -= 0.05;
    if (opacity <= 0) {
      element.style.opacity = '0';
      element.remove();
      return;
    }
    element.style.opacity = `${opacity}`;
    requestAnimationFrame(decrease);
  }
  decrease();
}

async function main() {
  const app = document.querySelector<HTMLDivElement>('#app')!;
  const screen = await welcomeScreen();
  closeAnimation(screen);
  app.classList.add(`${layout.app}`);
  new GameMediator(Game, GameDOM);
  Game.start();
  Game.makeUI();
}

main();
