import GameMediator from '../Helpers/Mediator';
import { ShipType, Ships } from '../Ship/Ship';
import { createElement, validCoordinates } from '../Helpers/index';
import { gameConfig } from '../config/gameConfig';
import components from '../styles/components.module.css';
import layout from '../styles/layout.module.css';
import { PlayerType } from 'Player/Player';

const BattleshipDOM = (() => {
  let mediator: GameMediator = {} as GameMediator;
  let root: HTMLElement | undefined = document.getElementById('app')!;
  let gridPlayerOne: HTMLElement = document.createElement('div');
  let gridPlayerTwo: HTMLElement = document.createElement('div');
  let shipsToPlace = Object.entries(Ships);
  let currentShip = 0;
  let gamePhase: string = 'idle';
  let turnResult: string = '';

  function setTurnResult(status: string) {
    turnResult = status;
  }

  function setMediator(newMediator: GameMediator) {
    mediator = newMediator;
  }

  function setGamePhase(phase: string) {
    gamePhase = phase;
  }

  function setItemClass(element: HTMLElement, status: string | ShipType) {
    if (typeof status !== 'string') {
      element.classList.add(`${components.gridItemBoat}`);
    } else {
      element.classList.add(`${components[status]}`);
    }
  }

  function getItemData(target: HTMLDivElement) {
    let gridRoot = target.id.slice(0, 1);
    let x = +target.id.slice(1, 2);
    let y = +target.id.slice(2);
    return { x, y, gridRoot };
  }

  function handleSiblingClass(
    className: string,
    shipLength: number,
    coords: { x: number; y: number },
    todo = 'add',
    gridRoot = 'p',
  ) {
    for (let i = 1; i < shipLength; i++) {
      let sibling = document.getElementById(
        `${gridRoot}${
          gameConfig.config.mainAxis === 'x'
            ? `${coords.x}${coords.y + i}`
            : `${coords.x + i}${coords.y}`
        }`,
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      todo === 'add' ? sibling!.classList.add(className) : sibling!.classList.remove(className);
    }
  }

  function handleMouse(evt: Event) {
    let target = evt.target as HTMLDivElement;
    if (!target.classList.contains(`${components.gridItem}`)) return;
    let shipLength = shipsToPlace[currentShip][1];
    let { x, y, gridRoot } = getItemData(target);
    if (!validCoordinates(x, y, shipLength, gridRoot)) return;
    if (evt.type === 'mouseover') {
      target.classList.add('hovered');
      handleSiblingClass('hovered', shipLength, { x, y });
    }
    if (evt.type === 'mouseout' || evt.type === 'mouseup') {
      target.classList.remove('hovered');
      handleSiblingClass('hovered', shipLength, { x, y }, 'remove');
    }
  }

  function removeMouseEvents() {
    root!.removeEventListener('mouseover', handleMouse);
    root!.removeEventListener('mouseout', handleMouse);
    root!.removeEventListener('mouseup', handleMouse);
  }

  function closeModal() {
    let modal = document.querySelector(`.${layout.outter}`);
    root?.removeChild(modal!);
  }

  function handleClick(evt: Event) {
    let target = evt.target as HTMLDivElement;
    if (!target.classList.contains(`${components.gridItem}`)) return;
    let { x, y, gridRoot } = getItemData(target);
    if (gamePhase === 'gridConfig' && gridRoot !== 'c') {
      let shipLength = shipsToPlace[currentShip][1];
      if (!validCoordinates(x, y, shipLength, gridRoot)) return;
      mediator.notify(BattleshipDOM, 'placeship', {
        x,
        y,
        shipType: shipsToPlace[currentShip][0],
        gridRoot,
      });
      target.classList.add('ship');
      handleSiblingClass('ship', shipLength, { x, y });
      currentShip++;
    } else if (gamePhase === 'gridConfig') {
      let shipLength = shipsToPlace[currentShip][1];
      if (!validCoordinates(x, y, shipLength, gridRoot)) return;
      mediator.notify(BattleshipDOM, 'placeship', {
        x,
        y,
        shipType: shipsToPlace[currentShip][0],
        gridRoot,
      });
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

  function makeGrid(player: PlayerType): HTMLElement {
    let gridContainer = document.createElement('div');
    let gridContainerFragment = new DocumentFragment();
    gridContainer.classList.add(`${components.gridContainer}`);
    for (let i = 0; i < player.gameboard.grid.length; i++) {
      for (let j = 0; j < player.gameboard.grid[i].length; j++) {
        let item = createElement('div', {
          class: `${components.gridItem}`,
          id: `${player.getName() !== 'cpu' ? 'p' : 'c'}${i}${j}`,
        });
        gridContainerFragment.appendChild(item);
      }
    }
    gridContainer.appendChild(gridContainerFragment);
    return gridContainer;
  }

  function setGrid(player: PlayerType): Promise<void> {
    return new Promise((resolve) => {
      let grid = makeGrid(player);
      if (player.getName() !== 'cpu') {
        gridPlayerOne = grid;
      } else {
        gridPlayerTwo = grid;
      }
      root?.appendChild(grid);
      resolve();
    });
  }

  function placeShipsModal() {
    let axisElement = createElement('div', {}, `Axis: ${gameConfig.config.mainAxis}`);
    let rotateBtn = createElement('button', { class: `${components.btn}` }, 'Rotate');
    rotateBtn.addEventListener('click', () => {
      gameConfig.setConfig(
        gameConfig.config.mainAxis === 'x' ? { mainAxis: 'y' } : { mainAxis: 'x' },
      );
      axisElement.textContent = `Axis: ${gameConfig.config.mainAxis}`;
    });
    let outterDiv = createElement('div', { class: `${layout.outter}` }, [
      createElement(
        'div',
        {
          class: `${layout.dragDiv}`,
        },
        [
          createElement('h2', {}, 'Place your ships'),
          axisElement,
          rotateBtn,
          gridPlayerOne.cloneNode(true),
        ],
      ),
    ]);
    root?.appendChild(outterDiv);
  }

  function closeSetup() {
    removeMouseEvents();
    closeModal();
  }

  return {
    setGrid,
    setupEvent,
    placeShipsModal,
    setTurnResult,
    setMediator,
    setGamePhase,
    closeSetup,
  };
})();

export default BattleshipDOM;
