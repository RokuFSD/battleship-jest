import GameMediator from './GameMediator';
import Player, { PlayerType } from '../Player/Player';
import Gameboard from '../Gameboard/Gameboard';
import { Ships } from '../Ship/Ship';
import { gameConfig } from '../config/gameConfig';

const Game = (() => {
  let mediator: GameMediator = {} as GameMediator;
  let playerOne: PlayerType = Player('player');
  let playerTwo: PlayerType = Player();
  let currentPlayer = playerOne;

  function setMediator(newMediator: GameMediator) {
    mediator = newMediator;
  }

  function getPlayerOne(): PlayerType {
    return playerOne;
  }

  function getPlayerTwo(): PlayerType {
    return playerTwo;
  }

  function reset() {
    playerOne = Player('player');
    playerTwo = Player();
    currentPlayer = playerOne;
    gameConfig.currentPlaying = 'Player';
  }

  function makeUI() {
    mediator.notify(Game, 'makeui');
  }

  function start() {
    playerOne.setGameboard(Gameboard());
    playerTwo.setGameboard(Gameboard());
    gameConfig.setPlayerOne(playerOne);
    gameConfig.setPlayerTwo(playerTwo);
    mediator.notify(Game, 'start');
  }

  function gameOver() {
    return playerOne.getGameboard().allSunk() || playerTwo.getGameboard().allSunk();
  }

  function handleTurn(x: string, y: string) {
    if (gameOver()) {
      mediator.notify(Game, 'gameover');
      return;
    }
    let moveResult: string = '';
    if (currentPlayer.getName() !== 'cpu') {
      currentPlayer = playerTwo;
      moveResult = playerTwo.getGameboard().receiveAttack(Number(x), Number(y));
      setTimeout(() => {
        playerTwo.makeAttack();
      }, 1500);
      gameConfig.currentPlaying = 'Player';
    } else {
      currentPlayer = playerOne;
      moveResult = playerOne.getGameboard().receiveAttack(Number(x), Number(y));
      gameConfig.currentPlaying = 'Cpu';
    }
    mediator.notify(Game, 'turnPlayed', moveResult);
  }

  function addShip(x: number, y: number, shipType: keyof typeof Ships) {
    if (!playerTwo.getGameboard().allShipsPlaced()) {
      playerTwo.getGameboard().placeShip(x, y, shipType);
    } else {
      playerOne.getGameboard().placeShip(x, y, shipType);
    }
    if (playerOne.getGameboard().allShipsPlaced()) {
      mediator.notify(Game, 'startPlaying');
    }
  }

  return {
    getPlayerOne,
    getPlayerTwo,
    start,
    handleTurn,
    makeUI,
    setMediator,
    addShip,
    reset,
  };
})();

export default Game;
