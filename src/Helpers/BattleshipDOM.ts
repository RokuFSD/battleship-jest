import { GameboardType } from '../Gameboard/Gameboard';
import components from '../styles/components.module.css';
import Game from '../Game/Game';

const BattleshipDOM = (() => {
  let root: HTMLElement | undefined = undefined;

  function setItemClass(element: HTMLElement, status: string) {
    if (status === 'empty') return;
    if (status === 'missed')
      return element.classList.add(`${components.gridItemMissed}`);
    return element.classList.add(`${components.gridItemBoat}`);
  }

  function makeGrid(gameboard: GameboardType) {
    let gridContainer = document.createElement('div');
    let gridContainerFragment = new DocumentFragment();
    gridContainer.classList.add(`${components.gridContainer}`);

    for (let i = 0; i < gameboard.grid.length; i++) {
      for (let j = 0; j < gameboard.grid[i].length; j++) {
        let item = document.createElement('div');
        item.classList.add(`${components.gridItem}`);
        setItemClass(item, gameboard.grid[i][j]);
        item.setAttribute('id', `${i}${j}`);
        gridContainerFragment.appendChild(item);
      }
    }
    gridContainer.appendChild(gridContainerFragment);
    root?.appendChild(gridContainer);
  }

  function handleClick(evt: Event) {
    let target = evt.target as HTMLDivElement;
    if (!target.classList.contains(`${components.gridItem}`)) return;
    let x = target.id.slice(0, 1);
    let y = target.id.slice(1);
    Game.handleClick(x, y);
  }

  function setup() {
    root!.addEventListener('click', handleClick);
  }

  function setRoot(rootElement: HTMLElement) {
    root = rootElement;
  }

  return {
    makeGrid,
    setup,
    setRoot,
  };
})();

export default BattleshipDOM;
