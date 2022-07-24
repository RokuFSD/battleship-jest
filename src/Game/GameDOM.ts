import GameMediator from './GameMediator';
import { createElement } from '../Helpers';
import { Ships } from '../Ship/Ship';
import { gameConfig } from '../config/gameConfig';
import { PlayerType } from '../Player/Player';
import components from '../styles/components.module.css';
// @ts-ignore
import { Modal, Button } from '../Components';

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

  function setStatusClass(element: HTMLElement, status: string) {
    element.classList.add(`${components[status]}`);
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
    todo: 'add' | 'remove' = 'add',
  ) {
    for (let i = 0; i < shipLength; i++) {
      let siblingCoords =
        gameConfig.config.mainAxis === 'x'
          ? `${coords.x}${coords.y + i}`
          : `${coords.x + i}${coords.y}`;
      let selector = `[data-cell="p${siblingCoords}"]`;
      const siblings = document.querySelectorAll(selector);
      siblings.forEach((sibling) => {
        sibling.classList[todo](className);
      });
    }
  }

  function validTarget(evt: Event): { x: number; y: number; gridRoot: string } | undefined {
    let target = evt.target as HTMLDivElement;
    return target.classList.contains(`${components.gridItem}`) ? getItemData(target) : undefined;
  }

  function handleMouse(evt: Event) {
    let data = validTarget(evt);
    if (!data) return;
    let { x, y } = data;
    if (!gameConfig.playerOne.getGameboard().validCoordinates(x, y, shipsToPlace[currentShip][1])) {
      handleSiblingClass(`${components.cellInvalid}`, shipsToPlace[currentShip][1], { x, y });
      return;
    }
    if (evt.type === 'mouseover') {
      handleSiblingClass(
        `${components.cellInvalid}`,
        shipsToPlace[currentShip][1],
        { x, y },
        'remove',
      );
      handleSiblingClass(`${components.cellHover}`, shipsToPlace[currentShip][1], { x, y });
    } else {
      handleSiblingClass(
        `${components.cellHover}`,
        shipsToPlace[currentShip][1],
        { x, y },
        'remove',
      );
    }
  }

  function removeMouseEvents() {
    root!.removeEventListener('mouseover', handleMouse);
    root!.removeEventListener('mouseout', handleMouse);
    root!.removeEventListener('mouseup', handleMouse);
  }

  function nextShip() {
    currentShip = currentShip > 3 ? 0 : currentShip + 1;
  }

  function placeShip({ x, y }: { x: number; y: number }) {
    let dataToNotify = { x, y, shipType: shipsToPlace[currentShip][0] };
    mediator.notify(GameDOM, 'placeship', dataToNotify);
  }

  function onPlayerPlaceShip({ x, y }: { x: number; y: number }) {
    placeShip({ x, y });
    handleSiblingClass(`${components.cellShip}`, shipsToPlace[currentShip][1], { x, y });
  }

  function onClickAttack({ x, y }: { x: number; y: number }) {
    mediator.notify(GameDOM, 'handleturn', { x, y });
  }

  function onClickPlace(x: number, y: number, gridRoot: string) {
    if (gridRoot !== 'c') {
      if (!gameConfig.playerOne.getGameboard().validCoordinates(x, y, shipsToPlace[currentShip][1]))
        return;
      onPlayerPlaceShip({ x, y });
    } else {
      placeShip({ x, y });
    }
    nextShip();
  }

  function handleClick(evt: Event) {
    let data = validTarget(evt);
    if (!data) return;
    let { x, y, gridRoot } = data;
    if (gamePhase === 'gridConfig') {
      onClickPlace(x, y, gridRoot);
    } else {
      onClickAttack({ x, y });
      setStatusClass(evt.target as HTMLDivElement, turnResult);
    }
  }

  function setupEvent() {
    root!.addEventListener('mouseover', handleMouse);
    root!.addEventListener('mouseup', handleMouse);
    root!.addEventListener('mouseout', handleMouse);
    root!.addEventListener('click', handleClick);
  }

  function makeGrid(player: PlayerType): HTMLElement {
    let gridContainer = createElement('div', { class: `${components.gridContainer}` });
    let gridContainerFragment = new DocumentFragment();
    for (let i = 0; i < player.getGameboard().grid.length; i++) {
      for (let j = 0; j < player.getGameboard().grid[i].length; j++) {
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
      let title = createElement(
        'h2',
        {},
        player.getName() !== 'cpu' ? 'Your Waters' : 'Enemy Waters',
      );
      let gridSection = createElement('section', { class: `${components.gridSection}` }, [
        title,
        grid,
      ]);
      if (player.getName() !== 'cpu') {
        gridPlayerOne = grid;
      }
      root?.appendChild(gridSection);
      resolve();
    });
  }

  function openStartModal() {
    let axisElement = createElement(
      'div',
      { class: `${components.modalAxis}` },
      `Axis: ${gameConfig.config.mainAxis}`,
    );
    let rotateBtn = Button('Rotate');

    rotateBtn.addEvent('click', () => {
      gameConfig.toggleAxis();
      axisElement.textContent = `Axis: ${gameConfig.config.mainAxis}`;
    });

    gameModal.addItem([
      createElement('h2', {}, [
        createElement('span', { class: `${components.modalTitle}` }, 'Place your ships'),
      ]),
      rotateBtn.getButton(),
      axisElement,
      gridPlayerOne.cloneNode(true),
    ]);
    root?.appendChild(gameModal.getModal());
  }

  function resetGameDom() {
    currentShip = 0;
    root!.removeEventListener('click', handleClick);
    root!.innerHTML = '';
    mediator.notify(GameDOM, 'restart');
  }

  function gameOverModal() {
    let modal = Modal();
    let winner = createElement('h2', {}, `${gameConfig.playerOne.getName()} wins!`);
    let restartBtn = Button('Play again');
    restartBtn.addEvent('click', () => {
      modal.closeModal();
      resetGameDom();
    });
    modal.addItem([winner, restartBtn.getButton()]);
    root?.appendChild(modal.getModal());
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
    gameOverModal,
  };
})();

export default GameDOM;
