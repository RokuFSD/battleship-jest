import Ship, { ShipType, Ships } from '../Ship/Ship';
import { gameConfig } from '../config/gameConfig';

export type GameboardType = {
  grid: string[][];
  placeShip(
    xCoord: number,
    yCoord: number,
    shipType: keyof typeof Ships,
    gridRoot: 'c' | 'p',
  ): string | undefined;
  receiveAttack(xCoord: number, yCoord: number): string;
  allSunk(): boolean;
  allShipsPlaced(): boolean;
  validCoordinates(x: number, y: number, shipLength: number): boolean;
};

const Gameboard = (): GameboardType => {
  let ships: ShipType[] = [];
  let grid = Array(10)
    .fill(null)
    .map(() => Array(10).fill('empty'));

  function isCellEmpty(xCoord: number, yCoord: number): boolean {
    return grid[xCoord][yCoord] === 'empty';
  }


  /*TODO: Refactor*/
  function validCoordinates(x: number, y: number, shipLength: number): boolean {
    let axisToCheck = gameConfig.config.mainAxis === 'y' ? x : y;
    for (let i = 0; i < shipLength && axisToCheck + i <= 9; i++) {
      if (gameConfig.config.mainAxis === 'x') {
        if (!isCellEmpty(x, y + i)) {
          return false;
        }
      } else {
        if (!isCellEmpty(x + i, y)) {
          return false;
        }
      }
    }
    return axisToCheck + shipLength <= grid.length;
  }

  function placeShip(xCoord: number, yCoord: number, shipType: keyof typeof Ships) {
    let ship = Ship(Ships[shipType]);
    if (!validCoordinates(xCoord, yCoord, ship.length)) return;
    for (let i = 0; i < ship.length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      gameConfig.config.mainAxis === 'x'
        ? (grid[xCoord][yCoord + i] = { ship: ship, place: i })
        : (grid[xCoord + i][yCoord] = { ship: ship, place: i });
    }
    ships.push(ship);
    return 'placed';
  }

  function allShipsPlaced() {
    return ships.length === 5;
  }

  function receiveAttack(xCoord: number, yCoord: number): string {
    if (grid[xCoord][yCoord] === 'empty') {
      grid[xCoord][yCoord] = 'missed';
      return 'missed';
    }
    let { ship, place } = grid[xCoord][yCoord];
    ship.hit(place);
    return 'hit';
  }

  function allSunk(): boolean {
    for (let ship of ships) {
      if (!ship.isSunk()) return false;
    }
    return true;
  }

  return {
    grid,
    placeShip,
    receiveAttack,
    allSunk,
    allShipsPlaced,
    validCoordinates,
  };
};

export default Gameboard;
