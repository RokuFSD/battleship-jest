import { GameboardType } from '../Gameboard/Gameboard';
import { Ships } from '../Ship/Ship';
import { movesWithCache } from '../Helpers';
import { gameConfig } from '../config/gameConfig';

export type PlayerType = {
  getName(): string;
  makeAttack(): void;
  autoplace(): void;
  setGameboard(gameboard: GameboardType): void;
  getGameboard(): GameboardType;
};

const Player = (playerName: string = 'cpu') => {
  let gameboard = {} as GameboardType;
  let name: string = playerName;
  let randomAttacks = movesWithCache();

  function getName(): string {
    return name;
  }

  function setGameboard(Gameboard: GameboardType) {
    gameboard = Gameboard;
  }

  function getGameboard(): GameboardType {
    return gameboard;
  }

  function makeAttack() {
    let { x, y } = randomAttacks();
    let item = document.querySelector(`[data-cell="p${x}${y}"]`);
    item?.dispatchEvent(new Event('click', { bubbles: true }));
  }

  function autoplace() {
    let ships = Object.keys(Ships);
    let randomMove = movesWithCache();
    for (let ship of ships) {
      let randomAxis: 'x' | 'y' = Math.random() > 0.5 ? 'x' : 'y';
      let shipLength = Ships[ship as keyof typeof Ships];
      gameConfig.setConfig({ mainAxis: randomAxis });
      let { x, y } = randomMove();
      while (!gameboard.validCoordinates(x, y, shipLength)) {
        ({ x, y } = randomMove());
      }
      let item = document.querySelector(`[data-cell="c${x}${y}"]`)!;
      item.dispatchEvent(new Event('click', { bubbles: true }));
    }
    gameConfig.setConfig({ mainAxis: 'x' });
  }

  return {
    setGameboard,
    getGameboard,
    getName,
    makeAttack,
    autoplace,
  };
};

export default Player;
