import { GameboardType } from '../Gameboard/Gameboard';
import { Ships } from '../Ship/Ship';
import { validCoordinates } from '../Helpers';

type PlayerStatus = 'playing' | 'winner';

export type PlayerType = {
  gameboard: GameboardType;
  setName(value: string): void;
  getName(): string;
  getStatus(): PlayerStatus;
  makeAttack(): void;
  autoplace(): void;
};

const Player = (Gameboard: GameboardType, playerName: string = 'cpu') => {
  let gameboard: GameboardType = Gameboard;
  let name: string = playerName;
  let status: PlayerStatus = 'playing';
  let cacheMoves: { [k: string]: number } = {};

  function setName(value: string): void {
    name = value;
  }

  function getName(): string {
    return name;
  }

  function getStatus(): PlayerStatus {
    return status;
  }

  function randomMove(): { x: number; y: number } {
    if (Object.keys(cacheMoves).length > 99) return { x: 0, y: 0 };
    let x = Math.floor(Math.random() * 10);
    let y = Math.floor(Math.random() * 10);
    if (cacheMoves[`${x}${y}`] == 1) {
      return randomMove();
    } else {
      cacheMoves[`${x}${y}`] = 1;
      return { x, y };
    }
  }

  function makeAttack() {
    let { x, y } = randomMove();
    let item = document.getElementById(`p${x}${y}`)!;
    item.dispatchEvent(new Event('click', { bubbles: true }));
  }

  function autoplace() {
    let ships = Object.keys(Ships);
    for (let ship of ships) {
      let shipLength = Ships[ship as keyof typeof Ships];
      let x = Math.floor(Math.random() * 10);
      let y = Math.floor(Math.random() * 10);
      while (!validCoordinates(x, y, shipLength, 'c')) {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
      }
      let item = document.getElementById(`c${x}${y}`)!;
      item.dispatchEvent(new Event('click', { bubbles: true }));
      //gameboard.placeShip(x, y, ship as keyof typeof Ships);
      console.log('placed');
    }
  }

  return {
    gameboard,
    getStatus,
    setName,
    getName,
    makeAttack,
    autoplace,
  };
};

export default Player;