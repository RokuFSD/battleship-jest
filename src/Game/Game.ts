import GameMediator from '../Helpers/Mediator';
import Player, { PlayerType } from '../Player/Player';
import Gameboard from '../Gameboard/Gameboard';

const Game = (() => {
  let root = document.querySelector('#app');
  let mediator: GameMediator = {} as GameMediator;
  let gameBoardOne = Gameboard();
  let gameBoardTwo = Gameboard();
  let playerOne: PlayerType = Player(gameBoardOne);
  let playerTwo: PlayerType = Player(gameBoardTwo);
  let currentPlayer = 'player';

  function setMediator(newMediator: GameMediator) {
    mediator = newMediator;
  }

  function makeUI() {
    mediator.notify(Game, 'makeui');
  }

  function start() {
    mediator.notify(Game, 'start');
  }

  function checkWinner() {
    return playerOne.gameboard.allSunk() || playerTwo.gameboard.allSunk();
  }

  function handleTurn(x: string, y: string) {
    let moveResult: string = '';
    if (currentPlayer === 'player') {
      currentPlayer = 'cpu';
      moveResult = playerTwo.gameboard.receiveAttack(Number(x), Number(y));
      playerTwo.makeAttack();
    } else {
      currentPlayer = 'player';
      moveResult = playerOne.gameboard.receiveAttack(Number(x), Number(y));
    }
    if (checkWinner()) {
      console.log('winner');
    }
    mediator.notify(Game, 'turnPlayed', moveResult);
  }

  function placeShips() {
    mediator.notify(Game, 'placeShips');

    /*TODO*/
    playerTwo.gameboard.placeShip(2, 2, 'carrier');
    playerTwo.gameboard.placeShip(1, 1, 'destroyer');
  }

  return {
    playerOne,
    playerTwo,
    start,
    handleTurn,
    placeShips,
    makeUI,
    root,
    setMediator,
  };
})();

export default Game;
