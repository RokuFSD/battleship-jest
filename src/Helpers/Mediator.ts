import Game from '../Game/Game';
import BattleshipDOM from './BattleshipDOM';

interface Mediator {
  notify(sender: Object, event: string): void;
}

class GameMediator implements Mediator {
  private readonly gameComponent: typeof Game;

  private readonly domComponent: typeof BattleshipDOM;

  constructor(c1: typeof Game, c2: typeof BattleshipDOM) {
    this.gameComponent = c1;
    this.gameComponent.setMediator(this);
    this.domComponent = c2;
    this.domComponent.setMediator(this);
  }

  public notify(sender: typeof Game | typeof BattleshipDOM, event: string, data?: any) {
    if (sender === this.gameComponent) {
      if (event === 'makeui') {
        this.domComponent
          .setGrid(sender.playerOne)
          .then(() => {
            this.domComponent.setGrid(sender.playerTwo);
          })
          .then(() => {
            this.gameComponent.placeShips();
            this.domComponent.placeShipsModal();
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
    }
  }
}

export default GameMediator;
