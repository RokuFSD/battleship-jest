import Game from '../Game/Game';
import BattleshipDOM from './BattleshipDOM';

interface Mediator {
  notify(sender: Object, event: string): void;
}

class GameMediator implements Mediator {
  private readonly firstComponent: typeof Game;

  private readonly secondComponent: typeof BattleshipDOM;

  constructor(c1: typeof Game, c2: typeof BattleshipDOM) {
    this.firstComponent = c1;
    this.firstComponent.setMediator(this);
    this.secondComponent = c2;
    this.secondComponent.setMediator(this);
  }

  public notify(sender: typeof Game | typeof BattleshipDOM, event: string, data?: any) {
    if (sender === this.firstComponent) {
      if (event === 'makeui') {
        this.secondComponent.setGrid(sender.playerOne.gameboard, 'player');
        this.secondComponent.setGrid(sender.playerTwo.gameboard, 'cpu');
      }
      if (event === 'start') {
        this.secondComponent.setRoot(Game.root as HTMLDivElement);
        this.secondComponent.setupEvent();
        this.secondComponent.setGamePhase('gridConfig');
      }
      if (event === 'placeShips') {
        this.secondComponent.placeShipsModal();
      }
      if (event === 'turnPlayed') {
        this.secondComponent.setTurnResult(data as string);
      }
    }
    if (sender === this.secondComponent) {
      if (event === 'handleturn') {
        let { x, y } = data as { x: string; y: string };
        this.firstComponent.handleTurn(x, y);
      }
      if (event === 'placeship') {
        let { x, y, shipType } = data;
        this.firstComponent.addShip(+x, +y, shipType);
      }
    }
  }
}

export default GameMediator;
