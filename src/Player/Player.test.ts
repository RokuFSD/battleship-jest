import Player from './Player';
import Gameboard from '../Gameboard/Gameboard';

let gameboard = Gameboard();
let player = Player(gameboard);

test('new player', () => {
  expect(player.setName('Nick')).toBe(undefined);
  expect(player.getName()).toBe('Nick');
  expect(player.gameboard).toBe(gameboard);
  expect(player.getStatus()).toBe('playing');
});
