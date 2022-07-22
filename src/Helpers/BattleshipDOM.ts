import GameMediator from '../Helpers/Mediator';
import { ShipType, Ships } from '../Ship/Ship';
import { createElement } from '../Helpers/index';
import { gameConfig } from '../config/gameConfig';
import { PlayerType } from 'Player/Player';
import components from '../styles/components.module.css';
import layout from '../styles/layout.module.css';

const BattleshipDOM = (() => {
  let mediator: GameMediator = {} as GameMediator;
  let root: HTMLElement | undefined = document.getElementById('app')!;
  let gridPlayerOne: HTMLElement = document.createElement('div');
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
    let gridRoot = target.dataset.cell!.slice(0, 1);
    let x = +target.dataset.cell!.slice(1, 2);
    let y = +target.dataset.cell!.slice(2);
    return { x, y, gridRoot };
  }

  function handleSiblingClass(
    className: string,
    shipLength: number,
    coords: { x: number; y: number },
    todo = 'add',
    gridRoot = 'p',
  ) {
    for (let i = 0; i < shipLength; i++) {
      const siblings = document.querySelectorAll(
        `[data-cell="${gridRoot}${
          gameConfig.config.mainAxis === 'x'
            ? `${coords.x}${coords.y + i}`
            : `${coords.x + i}${coords.y}`
        }"]`,
      );
      siblings.forEach((sibling) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        todo === 'add'
          ? sibling.classList.add(`${className}`)
          : sibling.classList.remove(`${className}`);
      });
    }
  }

  function validTarget(evt: Event): { x: number; y: number; gridRoot: string } | undefined {
    let target = evt.target as HTMLDivElement;
    let data: { x: number; y: number; gridRoot: string } | undefined;
    data = target.classList.contains(`${components.gridItem}`) ? getItemData(target) : undefined;
    return data;
  }

  function handleMouse(evt: Event) {
    let data = validTarget(evt);
    if (data) {
      let { x, y } = data;
      if (!gameConfig.playerOne.gameboard.validCoordinates(x, y, shipsToPlace[currentShip][1]))
        return;
      if (evt.type === 'mouseover') {
        handleSiblingClass('hovered', shipsToPlace[currentShip][1], { x, y });
      }
      if (evt.type === 'mouseout' || evt.type === 'mouseup') {
        handleSiblingClass('hovered', shipsToPlace[currentShip][1], { x, y }, 'remove');
      }
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

  function clickToPlace(data: { x: number; y: number }) {
    mediator.notify(BattleshipDOM, 'placeship', {
      x: data.x,
      y: data.y,
      shipType: shipsToPlace[currentShip][0],
    });
  }

  function playerClick(data: { x: number; y: number }) {
    clickToPlace(data);
    handleSiblingClass('ship', shipsToPlace[currentShip][1], { x: data.x, y: data.y });
  }

  /*TODO: Refactor this function*/
  function handleClick(evt: Event) {
    let data = validTarget(evt);
    if (data) {
      if (gamePhase === 'gridConfig' && data.gridRoot !== 'c') {
        if (
          !gameConfig.playerOne.gameboard.validCoordinates(
            data.x,
            data.y,
            shipsToPlace[currentShip][1],
          )
        )
          return;
        playerClick(data);
      } else if (gamePhase === 'gridConfig' && data.gridRoot === 'c') {
        clickToPlace(data);
      } else {
        mediator.notify(BattleshipDOM, 'handleturn', { x: data.x, y: data.y });
        setItemClass(evt.target as HTMLDivElement, turnResult);
      }
      currentShip++;
      if (currentShip === 5) currentShip = 0;
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
          'data-cell': `${player.getName() !== 'cpu' ? 'p' : 'c'}${i}${j}`,
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
    gridPlayerOne.classList.add(`${components.gridContainerPlayer}`);
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