import Ship, { ShipType, Ships } from '../Ship/Ship';
import { gameConfig } from '../config/gameConfig';

export type GameboardType = {
  grid: string[][];
  placeShip(xCoord: number, yCoord: number, shipType: keyof typeof Ships): string | undefined;
  receiveAttack(xCoord: number, yCoord: number): string;
  allSunk(): boolean;
  allShipsPlaced(): boolean;
  validCoordinates(x: number, y: number, shipLength: number): boolean;
};

function newGrid() {
  let grid = new Array(10).fill(null).map(() => Array(10).fill('empty'));
  return grid;
}

const Gameboard = (): GameboardType => {
  let ships: ShipType[] = [];
  let grid = newGrid();

  function isCellEmpty(xCoord: number, yCoord: number): boolean {
    return grid[xCoord][yCoord] === 'empty';
  }

  function validCoordinates(x: number, y: number, shipLength: number): boolean {
    let axisToCheck = gameConfig.config.mainAxis === 'y' ? x : y;
    for (let i = 0; i < shipLength && axisToCheck + i <= 9; i++) {
      if (gameConfig.config.mainAxis === 'x') {
        if (!isCellEmpty(x, y + i)) return false;
      } else if (!isCellEmpty(x + i, y)) return false;
    }
    return axisToCheck + shipLength <= grid.length;
  }

  function placeShip(xCoord: number, yCoord: number, shipType: keyof typeof Ships) {
    let ship = Ship(Ships[shipType]);
    if (!validCoordinates(xCoord, yCoord, ship.length)) return;
    for (let i = 0; i < ship.length; i++) {
      if (gameConfig.config.mainAxis === 'x') {
        grid[xCoord][yCoord + i] = { ship, place: i };
      } else {
        grid[xCoord + i][yCoord] = { ship, place: i };
      }
    }
    ships.push(ship);
    return 'placed';
  }

  function allShipsPlaced() {
    return ships.length === 5; //Change this to the number of ships
  }

  function receiveAttack(xCoord: number, yCoord: number): string {
    if (grid[xCoord][yCoord] === 'empty') {
      grid[xCoord][yCoord] = 'missed';
      return 'misses';
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
