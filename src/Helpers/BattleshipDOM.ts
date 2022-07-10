import { GameboardType } from '../Gameboard/Gameboard';
import components from '../styles/components.module.css';
import Game from '../Game/Game';
import { ShipType } from 'Ship/Ship';

const BattleshipDOM = (() => {
  let root: HTMLElement | undefined = undefined;

  function setItemClass(element: HTMLElement, status: string | ShipType) {
    if (typeof status !== 'string') {
      element.classList.add(`${components.gridItemBoat}`);
    } else {
      element.classList.add(`${components[status]}`);
    }
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
    evt.stopPropagation();
    let target = evt.target as HTMLDivElement;
    if (!target.classList.contains(`${components.gridItem}`)) return;
    let x = target.id.slice(0, 1);
    let y = target.id.slice(1);
    let status = Game.handleTurn(x, y);
    setItemClass(target, status);
  }

  function setupEvent() {
    root!.addEventListener('click', handleClick);
  }

  function setRoot(rootElement: HTMLElement) {
    root = rootElement;
  }

  return {
    makeGrid,
    setupEvent,
    setRoot,
  };
})();

export default BattleshipDOM;
