import Ship, { ShipType, Ships } from '../Ship/Ship';
import { validCoordinates } from '../Helpers';
import { gameConfig } from '../config/gameConfig';

export type GameboardType = {
  grid: string[][];
  placeShip(xCoord: number, yCoord: number, shipType: keyof typeof Ships): string | undefined;
  receiveAttack(xCoord: number, yCoord: number): string;
  allSunk(): boolean;
  allShipsPlaced(): boolean;
};

const Gameboard = (): GameboardType => {
  let ships: ShipType[] = [];
  let grid = Array(10)
    .fill(null)
    .map(() => Array(10).fill('empty'));

  function placeShip(xCoord: number, yCoord: number, shipType: keyof typeof Ships) {
    let ship = Ship(Ships[shipType]);
    if (!validCoordinates(xCoord, yCoord, ship.length)) return;
    for (let i = 0; i < ship.length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      gameConfig.config.mainAxis === 'y'
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
  };
};

export default Gameboard;
