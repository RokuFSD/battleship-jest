import Gameboard from './Gameboard';

let newGameboard = Gameboard();

test('gameboard factory', () => {
  expect(newGameboard.grid).toEqual(
    new Array(10).fill(new Array(10).fill('empty')),
  );
});

test('place ship', () => {
  expect(newGameboard.placeShip(4, 3, 'destroyer')).toBe('placed');
});

test('valid place', () => {
  expect(newGameboard.placeShip(12, 30, 'destroyer')).toBe(undefined);
});

test('attack', () => {
  expect(newGameboard.receiveAttack(4, 3)).toBe('A ship was attacked');
});

test('failed Attack', () => {
  expect(newGameboard.receiveAttack(9, 8)).toBe('missed');
});

test('still ships', () => {
  expect(newGameboard.allSunk()).toBe(false);
});

test('no more ships', () => {
  newGameboard.receiveAttack(4, 4);
  newGameboard.receiveAttack(4, 5);
  newGameboard.receiveAttack(4, 6);
  newGameboard.receiveAttack(4, 7);
  expect(newGameboard.allSunk()).toBe(true);
});
