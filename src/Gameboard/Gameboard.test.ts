import Gameboard from './Gameboard';

let newGameboard = Gameboard();

test('gameboard factory', () => {
  expect(newGameboard.grid).toEqual(new Array(10).fill(new Array(10).fill('0')));
});

test('place ship', () => {
  expect(newGameboard.placeShip(4, 3)).toBe('placed');
});

test('valid place', () => {
  expect(newGameboard.placeShip(12, 30)).toBe(undefined);
});