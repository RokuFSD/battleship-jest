import Game from './Game';
import GameDOM from './GameDOM';

interface Mediator {
  notify(sender: Object, event: string): void;
}

class GameMediator implements Mediator {
  private readonly gameComponent: typeof Game;

  private readonly domComponent: typeof GameDOM;

  constructor(c1: typeof Game, c2: typeof GameDOM) {
    this.gameComponent = c1;
    this.gameComponent.setMediator(this);
    this.domComponent = c2;
    this.domComponent.setMediator(this);
  }

  public notify(sender: typeof Game | typeof GameDOM, event: string, data?: any) {
    if (sender === this.gameComponent) {
      if (event === 'makeui') {
        this.domComponent
          .setGrid(sender.getPlayerOne())
          .then(() => {
            this.domComponent.setGrid(sender.getPlayerTwo());
          })
          .then(() => {
            this.gameComponent.getPlayerTwo().autoplace();
            this.domComponent.openStartModal();
          });
      }
      if (event === 'start') {
        this.domComponent.setupEvent();
        this.domComponent.setGamePhase('gridConfig');
      }
      if (event === 'turnPlayed') {
        this.domComponent.setTurnResult(data as string);
      }
      if (event === 'startPlaying') {
        this.domComponent.setGamePhase('playing');
        this.domComponent.closeSetup();
      }
      if (event === 'gameover') {
        this.domComponent.gameOverModal();
      }
    }
    if (sender === this.domComponent) {
      if (event === 'handleturn') {
        let { x, y } = data as { x: string; y: string };
        this.gameComponent.handleTurn(x, y);
      }
      if (event === 'placeship') {
        let { x, y, shipType } = data;
        this.gameComponent.addShip(+x, +y, shipType);
      }
      if (event === 'restart') {
        this.gameComponent.reset();
        this.gameComponent.start();
        this.gameComponent.makeUI();
      }
    }
  }
}

export default GameMediator;
