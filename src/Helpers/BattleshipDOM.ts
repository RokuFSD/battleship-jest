import GameMediator from '../Helpers/Mediator';
import { GameboardType } from '../Gameboard/Gameboard';
import { ShipType, Ships } from '../Ship/Ship';
import { createElement, validCoordinates } from '../Helpers/index';
import { gameConfig } from '../config/gameConfig';
import components from '../styles/components.module.css';
import layout from '../styles/layout.module.css';

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
    let x = +target.id.slice(0, 1);
    let y = +target.id.slice(1);
    return { x, y };
  }

  function handleSiblingClass(className: string, shipLength: number, coords: { x: number; y: number }, todo = 'add') {
    for (let i = 1; i < shipLength; i++) {
      let sibling = document.getElementById(
        `${gameConfig.config.mainAxis === 'y' ? `${coords.x}${coords.y + i}` : `${coords.x + i}${coords.y}`}`,
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      todo === 'add' ? sibling!.classList.add(className) : sibling!.classList.remove(className);
    }
  }

  function handleMouse(evt: Event) {
    let target = evt.target as HTMLDivElement;
    if (!target.classList.contains(`${components.gridItem}`)) return;
    let shipLength = shipsToPlace[currentShip][1];
    let { x, y } = getItemData(target);
    if (!validCoordinates(x, y, shipLength)) return;
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

  function addPlayersGrids() {
    gridPlayerOne.classList.add(`${components.gridContainerPlayer}`);
    root?.appendChild(gridPlayerOne);
    root?.appendChild(gridPlayerTwo);
  }

  function handleClick(evt: Event) {
    let target = evt.target as HTMLDivElement;
    if (!target.classList.contains(`${components.gridItem}`)) return;
    let { x, y } = getItemData(target);
    if (gamePhase === 'gridConfig') {
      let shipLength = shipsToPlace[currentShip][1];
      if (!validCoordinates(x, y, shipLength)) return;
      mediator.notify(BattleshipDOM, 'placeship', { x, y, shipType: shipsToPlace[currentShip][0] });
      target.classList.add('ship');
      handleSiblingClass('ship', shipLength, { x, y });
      currentShip++;
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
    gridContainer.classList.add(`${components.gridContainer}`);
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
    if (playerType === 'player') {
      gridPlayerOne = grid;
    } else {
      gridPlayerTwo = grid;
    }
  }

  function placeShipsModal() {
    let rotateBtn = createElement('button', { class: `${components.btn}` }, 'Rotate');
    rotateBtn.addEventListener('click', () => {
      gameConfig.setConfig(gameConfig.config.mainAxis === 'x' ? { mainAxis: 'y' } : { mainAxis: 'x' });
    });
    let outterDiv = createElement('div', { class: `${layout.outter}` }, [
      createElement(
        'div',
        {
          class: `${layout.dragDiv}`,
        },
        [createElement('h2', {}, 'Place your ships'), rotateBtn, gridPlayerOne],
      ),
    ]);
    root?.appendChild(outterDiv);
  }

  function closeSetup() {
    removeMouseEvents();
    closeModal();
    addPlayersGrids();
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
