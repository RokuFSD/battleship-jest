import Game from '../Game';

describe('Game start', () => {
  test('Game players', () => {
    expect(Game.playerOne.getStatus()).toBe('playing');
    expect(Game.playerTwo.getStatus()).toBe('playing');
  });
});
