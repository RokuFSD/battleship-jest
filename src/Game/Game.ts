import Player, { PlayerType } from '../Player/Player';
import Gameboard from '../Gameboard/Gameboard';
import BattleshipDOM from '../Helpers/BattleshipDOM';

const Game = (() => {
  let gameBoardOne = Gameboard();
  let gameBoardTwo = Gameboard();
  let playerOne: PlayerType = Player(gameBoardOne);
  let playerTwo: PlayerType = Player(gameBoardTwo);
  let currentPlayer = 'player';

  function makeUI() {
    BattleshipDOM.makeGrid(playerOne.gameboard);
    BattleshipDOM.makeGrid(playerTwo.gameboard);
  }

  function start(startElm: HTMLElement) {
    BattleshipDOM.setRoot(startElm);
    BattleshipDOM.setupEvent();
  }

  function checkWinner() {
    return playerOne.gameboard.allSunk() || playerTwo.gameboard.allSunk();
  }

  function handleTurn(x: string, y: string) {
    let moveResult: string = '';
    if (currentPlayer === 'player') {
      moveResult = playerTwo.gameboard.receiveAttack(Number(x), Number(y));
      currentPlayer = 'cpu';
      playerTwo.makeAttack();
    } else {
      moveResult = playerOne.gameboard.receiveAttack(Number(x), Number(y));
      currentPlayer = 'player';
    }
    if (checkWinner()) {
      console.log('winner');
    }
    return moveResult;
  }

  function placeShips() {
    playerOne.gameboard.placeShip(1, 1, 'destroyer');
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
  };
})();

export default Game;
