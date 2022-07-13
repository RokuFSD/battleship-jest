import GameMediator from '../Helpers/Mediator';
import { GameboardType } from '../Gameboard/Gameboard';
import components from '../styles/components.module.css';
import layout from '../styles/layout.module.css';
import { ShipType } from 'Ship/Ship';

const BattleshipDOM = (() => {
  let mediator: GameMediator = {} as GameMediator;
  let currentStatus: string = '';
  let root: HTMLElement | undefined = undefined;
  let gridPlayerOne: HTMLElement = document.createElement('div');
  let gridPlayerTwo: HTMLElement = document.createElement('div');

  function setItemClass(element: HTMLElement, status: string | ShipType) {
    if (typeof status !== 'string') {
      element.classList.add(`${components.gridItemBoat}`);
    } else {
      element.classList.add(`${components[status]}`);
    }
  }

  function makeGrid(gameboard: GameboardType): HTMLElement {
    let gridContainer = document.createElement('div');
    let gridContainerFragment = new DocumentFragment();
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
    return gridContainer;
  }

  function setGrid(gameboard: GameboardType, playerType: string) {
    let grid = makeGrid(gameboard);
    if (playerType === 'player') {
      grid.classList.add(`${components.gridContainerPlayer}`);
      gridPlayerOne = grid;
    } else {
      grid.classList.add(`${components.gridContainer}`);
      gridPlayerTwo = grid;
    }
    root?.appendChild(grid);
  }

  function handleClick(evt: Event) {
    let target = evt.target as HTMLDivElement;
    if (!target.classList.contains(`${components.gridItem}`)) return;
    let x = target.id.slice(0, 1);
    let y = target.id.slice(1);
    mediator.notify(BattleshipDOM, 'handleturn', { x, y });
    setItemClass(target, currentStatus);
  }

  function setupEvent() {
    root!.addEventListener('click', handleClick);
  }

  function setRoot(rootElement: HTMLElement) {
    root = rootElement;
  }

  function setStatus(status: string) {
    currentStatus = status;
  }

  function setMediator(newMediator: GameMediator) {
    mediator = newMediator;
  }

  /*TODO CREATE ELEMENT HELPER*/
  function playerDrag() {
    let outterDiv = document.createElement('div');
    let dragDiv = document.createElement('div');
    let btn = document.createElement('button');
    outterDiv.setAttribute('class', `${layout.outter}`);
    dragDiv.setAttribute('class', `${layout.dragDiv}`);
    btn.setAttribute('class', `${components.btn}`);
    btn.textContent = 'Rotate';
    dragDiv.innerHTML = `<h2>Place your ships</h2>${btn.outerHTML}${gridPlayerOne.outerHTML}`;
    outterDiv.appendChild(dragDiv);
    root?.appendChild(outterDiv);
  }

  return {
    setGrid,
    setupEvent,
    setRoot,
    playerDrag,
    setStatus,
    setMediator,
  };
})();

export default BattleshipDOM;
