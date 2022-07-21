import { GameboardType } from '../Gameboard/Gameboard';
import { Ships } from '../Ship/Ship';
import { validCoordinates, movesWithCache } from '../Helpers';

export type PlayerType = {
  gameboard: GameboardType;
  getName(): string;
  makeAttack(): void;
  autoplace(): void;
};

const Player = (Gameboard: GameboardType, playerName: string = 'cpu') => {
  let gameboard: GameboardType = Gameboard;
  let name: string = playerName;
  let randomAttacks = movesWithCache();

  function getName(): string {
    return name;
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
      let shipLength = Ships[ship as keyof typeof Ships];
      let { x, y } = randomMove();
      while (!validCoordinates(x, y, shipLength, 'c')) {
        ({ x, y } = randomMove());
      }
      let item = document.querySelector(`[data-cell="c${x}${y}"]`)!;
      item.dispatchEvent(new Event('click', { bubbles: true }));
    }
  }

  return {
    gameboard,
    getName,
    makeAttack,
    autoplace,
  };
};

export default Player;
