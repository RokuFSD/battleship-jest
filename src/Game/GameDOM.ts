import GameMediator from './GameMediator';
import { createElement } from '../Helpers';
import { ShipType, Ships } from '../Ship/Ship';
import { gameConfig } from '../config/gameConfig';
import { PlayerType } from '../Player/Player';
import Modal from '../Components/Modal';
import components from '../styles/components.module.css';

const GameDOM = (() => {
  let mediator: GameMediator = {} as GameMediator;
  let root: HTMLElement | undefined = document.getElementById('app')!;
  let gridPlayerOne: HTMLElement = document.createElement('div');
  let shipsToPlace = Object.entries(Ships);
  let currentShip = 0;
  let gamePhase: string = 'idle';
  let turnResult: string = '';
  let gameModal = Modal();

  function setTurnResult(status: string) {
    turnResult = status;
  }

  function setMediator(newMediator: GameMediator) {
    mediator = newMediator;
  }

  function setGamePhase(phase: string) {
    gamePhase = phase;
  }

  function setShipStatus(element: HTMLElement, status: string | ShipType) {
    if (typeof status === 'string') {
      element.classList.add(`${components[status]}`);
    } else {
      element.classList.add(`${components.gridItemBoat}`);
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
      let siblingCoords =
        gameConfig.config.mainAxis === 'x'
          ? `${coords.x}${coords.y + i}`
          : `${coords.x + i}${coords.y}`;
      let selector = `[data-cell="${gridRoot}${siblingCoords}"]`;
      const siblings = document.querySelectorAll(selector);
      siblings.forEach((sibling) => {
        if (todo === 'add') {
          sibling.classList.add(className);
        } else {
          sibling.classList.remove(className);
        }
      });
    }
  }

  function validTarget(evt: Event): { x: number; y: number; gridRoot: string } | undefined {
    let target = evt.target as HTMLDivElement;
    return target.classList.contains(`${components.gridItem}`) ? getItemData(target) : undefined;
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

  function clickToPlace({ x, y }: { x: number; y: number }) {
    let dataToNotify = { x, y, shipType: shipsToPlace[currentShip][0] };
    mediator.notify(GameDOM, 'placeship', dataToNotify);
  }

  function onPlayerPlaceShip({ x, y }: { x: number; y: number }) {
    clickToPlace({ x, y });
    handleSiblingClass('ship', shipsToPlace[currentShip][1], { x, y });
  }

  function onClickAttack({ x, y }: { x: number; y: number }) {
    mediator.notify(GameDOM, 'handleturn', { x, y });
  }

  function nextShip() {
    currentShip = currentShip >= 4 ? 0 : currentShip + 1;
  }

  function handleClick(evt: Event) {
    let data = validTarget(evt);
    if (data) {
      let { x, y, gridRoot } = data;
      if (gamePhase === 'gridConfig' && gridRoot !== 'c') {
        if (!gameConfig.playerOne.gameboard.validCoordinates(x, y, shipsToPlace[currentShip][1]))
          return;
        onPlayerPlaceShip({ x, y });
      } else if (gamePhase === 'gridConfig' && gridRoot === 'c') {
        clickToPlace({ x, y });
      } else {
        onClickAttack({ x, y });
        setShipStatus(evt.target as HTMLDivElement, turnResult);
      }
      nextShip();
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

  function openStartModal() {
    let axisElement = createElement('div', {}, `Axis: ${gameConfig.config.mainAxis}`);
    let rotateBtn = createElement('button', { class: `${components.btn}` }, 'Rotate');
    rotateBtn.addEventListener('click', () => {
      gameConfig.setConfig(
        gameConfig.config.mainAxis === 'x' ? { mainAxis: 'y' } : { mainAxis: 'x' },
      );
      axisElement.textContent = `Axis: ${gameConfig.config.mainAxis}`;
    });

    gameModal.addItem([
      createElement('h2', {}, 'Place your ships'),
      axisElement,
      rotateBtn,
      gridPlayerOne.cloneNode(true),
    ]);

    root?.appendChild(gameModal.getModal());
  }

  function closeSetup() {
    gridPlayerOne.classList.add(`${components.gridContainerPlayer}`);
    gameModal.closeModal();
    removeMouseEvents();
  }

  return {
    setGrid,
    setupEvent,
    openStartModal,
    setTurnResult,
    setMediator,
    setGamePhase,
    closeSetup,
  };
})();

export default GameDOM;
