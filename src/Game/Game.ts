import GameMediator from '../Helpers/Mediator';
import Player, { PlayerType } from '../Player/Player';
import Gameboard from '../Gameboard/Gameboard';
import { Ships } from '../Ship/Ship';

const Game = (() => {
  let mediator: GameMediator = {} as GameMediator;
  let root = document.querySelector('#app');
  let playerOne: PlayerType = Player(Gameboard());
  let playerTwo: PlayerType = Player(Gameboard());
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
    /*TODO PLACE AUTO BOT*/
    playerTwo.gameboard.placeShip(2, 2, 'carrier');
    playerTwo.gameboard.placeShip(1, 1, 'destroyer');
  }

  function addShip(x: number, y: number, shipType: keyof typeof Ships) {
    playerOne.gameboard.placeShip(x, y, shipType);
  }

  return {
    playerOne,
    playerTwo,
    root,
    start,
    handleTurn,
    placeShips,
    makeUI,
    setMediator,
    addShip,
  };
})();

export default Game;
