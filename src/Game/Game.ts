import GameMediator from '../Helpers/Mediator';
import Player, { PlayerType } from '../Player/Player';
import Gameboard from '../Gameboard/Gameboard';
import { Ships } from '../Ship/Ship';

const Game = (() => {
  let mediator: GameMediator = {} as GameMediator;
  let playerOne: PlayerType = Player(Gameboard(), 'player');
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
    playerTwo.autoplace();
  }

  function addShip(x: number, y: number, shipType: keyof typeof Ships, gridRoot: 'c' | 'p') {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    gridRoot === 'p'
      ? playerOne.gameboard.placeShip(x, y, shipType, gridRoot)
      : playerTwo.gameboard.placeShip(x, y, shipType, gridRoot);

    if (playerOne.gameboard.allShipsPlaced()) {
      mediator.notify(Game, 'startPlaying');
    }
  }

  return {
    playerOne,
    playerTwo,
    start,
    handleTurn,
    placeShips,
    makeUI,
    setMediator,
    addShip,
  };
})();

export default Game;
