import Player, { PlayerType } from '../Player/Player';
import Gameboard from '../Gameboard/Gameboard';
import BattleshipDOM from '../Helpers/BattleshipDOM';

const Game = (() => {
  let gameBoardOne = Gameboard();
  let gameBoardTwo = Gameboard();
  let playerOne: PlayerType = Player(gameBoardOne);
  let playerTwo: PlayerType = Player(gameBoardTwo);

  function makeUI() {
    BattleshipDOM.makeGrid(playerOne.gameboard);
    BattleshipDOM.makeGrid(playerTwo.gameboard);
    BattleshipDOM.setup();
  }

  function start(startElm: HTMLElement) {
    BattleshipDOM.setRoot(startElm);
  }

  function handleClick(x: string, y: string) {
    playerOne.gameboard.receiveAttack(Number(x), Number(y));
  }

  function placeShips() {
    playerOne.gameboard.placeShip(2, 2, 'carrier');
    playerOne.gameboard.placeShip(1, 1, 'destroyer');
    makeUI();
  }

  return {
    playerOne,
    playerTwo,
    start,
    handleClick,
    placeShips,
  };
})();

export default Game;
