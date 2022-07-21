type GameConfig = {
  mainAxis?: 'x' | 'y';
  theme?: 'light' | 'dark';
};

const gameConfig = {
  config: { mainAxis: 'x', theme: 'light' } as GameConfig,
  setConfig: function (config: GameConfig) {
    this.config = { ...this.config, ...config };
  },
};

export { gameConfig };