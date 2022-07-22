import { PlayerType } from 'Player/Player';

type GameConfig = {
  mainAxis?: 'x' | 'y';
  theme?: 'light' | 'dark';
};

const gameConfig = {
  playerOne: {} as PlayerType,
  playerTwo: {} as PlayerType,
  config: { mainAxis: 'x', theme: 'light' } as GameConfig,
  setConfig: function (config: GameConfig) {
    this.config = { ...this.config, ...config };
  },
  setPlayerOne: function (playerOne: PlayerType) {
    this.playerOne = playerOne;
  },
  setPlayerTwo: function (playerTwo: PlayerType) {
    this.playerTwo = playerTwo;
  },
};

export { gameConfig };
