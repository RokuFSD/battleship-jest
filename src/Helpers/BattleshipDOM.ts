import GameMediator from '../Helpers/Mediator';
import { GameboardType } from '../Gameboard/Gameboard';
import { ShipType, Ships } from '../Ship/Ship';
import { createElement, validCoordinates } from '../Helpers/index';
import components from '../styles/components.module.css';
import layout from '../styles/layout.module.css';

const BattleshipDOM = (() => {
  let mediator: GameMediator = {} as GameMediator;
  let turnResult: string = '';
  let root: HTMLElement | undefined = undefined;
  let gridPlayerOne: HTMLElement = document.createElement('div');
  let gridPlayerTwo: HTMLElement = document.createElement('div');
  let shipsToPlace = Object.entries(Ships);
  let currentShip = 0;
  let gamePhase: string = 'idle';

  function setItemClass(element: HTMLElement, status: string | ShipType) {
    if (typeof status !== 'string') {
      element.classList.add(`${components.gridItemBoat}`);
    } else {
      element.classList.add(`${components[status]}`);
    }
  }

  function setRoot(rootElement: HTMLElement) {
    root = rootElement;
  }

  function setTurnResult(status: string) {
    turnResult = status;
  }

  function setMediator(newMediator: GameMediator) {
    mediator = newMediator;
  }

  function setGamePhase(phase: string) {
    gamePhase = phase;
  }

  function getItemData(target: HTMLDivElement) {
    let x = +target.id.slice(0, 1);
    let y = +target.id.slice(1);
    return { x, y };
  }

  function handleMouse(evt: Event) {
    let target = evt.target as HTMLDivElement;
    if (!target.classList.contains(`${components.gridItem}`)) return;
    let { x, y } = getItemData(target);
    if (y + shipsToPlace[currentShip][1] > 10) return;
    if (evt.type === 'mouseover') {
      target.classList.add('hovered');
      for (let i = 1; i < shipsToPlace[currentShip][1] && y + i <= 9; i++) {
        let sibling = document.getElementById(`${x}${y + i}`);
        sibling!.classList.add('hovered');
      }
    }
    if (evt.type === 'mouseout' || evt.type === 'mouseup') {
      target.classList.remove('hovered');
      for (let i = 1; i < shipsToPlace[currentShip][1] && y + i <= 9; i++) {
        let sibling = document.getElementById(`${x}${y + i}`);
        sibling!.classList.remove('hovered');
      }
    }
  }

  function removeEvent() {
    root!.removeEventListener('mouseover', handleMouse);
    root!.removeEventListener('mouseout', handleMouse);
    root!.removeEventListener('mouseup', handleMouse);
  }

  function finalStep() {
    let modal = document.querySelector(`.${layout.outter}`);
    root?.appendChild(gridPlayerOne);
    root?.appendChild(gridPlayerTwo);
    root?.removeChild(modal!);
    gridPlayerOne.classList.add(`${components.gridContainerPlayer}`);
    setGamePhase('playing');
  }

  function handleClick(evt: Event) {
    let target = evt.target as HTMLDivElement;
    if (!target.classList.contains(`${components.gridItem}`)) return;
    let { x, y } = getItemData(target);
    if (gamePhase === 'gridConfig') {
      if (!validCoordinates(x, y, shipsToPlace[currentShip][1])) return;
      target.classList.add('ship');
      for (let i = 1; i < shipsToPlace[currentShip][1] && y + i <= 9; i++) {
        let sibling = document.getElementById(`${x}${y + i}`);
        sibling!.classList.add('ship');
      }
      mediator.notify(BattleshipDOM, 'placeship', { x, y, shipType: shipsToPlace[currentShip][0] });
      currentShip++;
      if (currentShip === 5) {
        removeEvent();
        finalStep();
      }
    } else {
      mediator.notify(BattleshipDOM, 'handleturn', { x, y });
      setItemClass(target, turnResult);
    }
  }

  function setupEvent() {
    root!.addEventListener('mouseover', handleMouse);
    root!.addEventListener('mouseup', handleMouse);
    root!.addEventListener('mouseout', handleMouse);
    root!.addEventListener('click', handleClick);
  }

  function makeGrid(gameboard: GameboardType): HTMLElement {
    let gridContainer = document.createElement('div');
    let gridContainerFragment = new DocumentFragment();
    for (let i = 0; i < gameboard.grid.length; i++) {
      for (let j = 0; j < gameboard.grid[i].length; j++) {
        let item = createElement('div', {
          class: `${components.gridItem}`,
          id: `${i}${j}`,
        });
        gridContainerFragment.appendChild(item);
      }
    }
    gridContainer.appendChild(gridContainerFragment);
    return gridContainer;
  }

  function setGrid(gameboard: GameboardType, playerType: string) {
    let grid = makeGrid(gameboard);
    grid.classList.add(`${components.gridContainer}`);
    if (playerType === 'player') {
      gridPlayerOne = grid;
    } else {
      gridPlayerTwo = grid;
    }
  }

  function placeShipsModal() {
    let outterDiv = createElement('div', { class: `${layout.outter}` }, [
      createElement(
        'div',
        {
          class: `${layout.dragDiv}`,
        },
        [
          createElement('h2', {}, 'Place your ships'),
          createElement('button', { class: `${components.btn}` }, 'Rotate'),
          gridPlayerOne,
        ],
      ),
    ]);
    root?.appendChild(outterDiv);
  }

  return {
    setGrid,
    setupEvent,
    setRoot,
    placeShipsModal,
    setTurnResult,
    setMediator,
    setGamePhase,
  };
})();

export default BattleshipDOM;
