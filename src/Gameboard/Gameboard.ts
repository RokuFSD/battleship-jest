import Ship, { ShipType } from '../Ship/Ship';

export type GameboardType = {
  grid: number[][];
  placeShip(
    xCoord: number,
    yCoord: number,
    shipType: keyof typeof Ships,
  ): string | undefined;
  receiveAttack(xCoord: number, yCoord: number): string;
  allSunk(): boolean;
};

enum Ships {
  'DESTRUCTOR' = 5,
}

const Gameboard = (): GameboardType => {
  let grid = new Array(10).fill(new Array(10).fill('empty'));
  let ships: ShipType[] = [];

  function validCoordinates(x: number, y: number, shipLength: number): boolean {
    if (x > 9 || y > 9) return false;
    return !(shipLength + x > 9 || shipLength + y > 9);
  }

  function placeShip(
    xCoord: number,
    yCoord: number,
    shipType: keyof typeof Ships,
  ) {
    let ship = Ship(Ships[shipType]);
    if (!validCoordinates(xCoord, yCoord, ship.length)) return;
    for (let i = 0; i < ship.length; i++) {
      grid[xCoord][yCoord + i] = { ship: ship, place: i };
      ships.push(ship);
    }
    return 'placed';
  }

  function receiveAttack(xCoord: number, yCoord: number): string {
    if (grid[xCoord][yCoord] === 'empty') {
      grid[xCoord][yCoord] = 'missed';
      return 'missed';
    }

    let { ship, place } = grid[xCoord][yCoord];
    ship.hit(place);
    return 'A ship was attacked';
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
  };
};

export default Gameboard;
