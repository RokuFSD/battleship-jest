import Ship from '../Ship/Ship';

type GameboardType = {
  grid: Array<Array<number>>;
  placeShip(xCoord: number, yCoord: number): string | undefined;
};

enum Ships {
  'DESTRUCTOR' = 5,
}

const Gameboard = (): GameboardType => {
  let grid = new Array(10).fill(new Array(10).fill('0'));

  function validCoordinates(x: number, y: number, shipLength: number): boolean {
    if (x > 10 || y > 10) return false;
    return !(shipLength + x > 10 || shipLength + y > 10);
  }

  function placeShip(xCoord: number, yCoord: number) {
    let ship = Ship(Ships.DESTRUCTOR);
    if (!validCoordinates(xCoord, yCoord, ship.length)) return;
    for (let i = 0; i < ship.length; i++) {
      grid[xCoord][yCoord + i] = '1';
    }
    return 'placed';
  }

  return {
    grid,
    placeShip,
  };
};

export default Gameboard;
