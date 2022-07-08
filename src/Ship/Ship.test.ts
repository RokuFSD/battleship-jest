import Ship from './Ship';
import { ShipType } from './Ship';

let shipTest: ShipType = Ship(5);

test('a new ship', () => {
  expect(shipTest.length).toBe(5);
});

describe('hit function', () => {
  test('valid hit', () => {
    expect(shipTest.hit(2)).toBe('hit');
  });

  test('invalid hit', () => {
    expect(shipTest.hit(6)).toBe(undefined);
  });

  test('already hit', () => {
    expect(shipTest.hit(2)).toBe(undefined);
  });
});

describe('is sunk', () => {
  test('not sunked', () => {
    expect(shipTest.isSunk()).toBe(false);
  });
  test('sunked', () => {
    let sunkedShip = Ship(2);
    sunkedShip.hit(0);
    sunkedShip.hit(1);
    expect(sunkedShip.isSunk()).toBe(true);
  });
});
