import { GameboardType } from '../Gameboard/Gameboard';

type PlayerStatus = 'playing' | 'winner';

export type PlayerType = {
  gameboard: GameboardType;
  setName(value: string): void;
  getName(): string;
  getStatus(): PlayerStatus;
  makeAttack(): void;
};

const Player = (Gameboard: GameboardType) => {
  let gameboard: GameboardType = Gameboard;
  let name: string = '';
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
    let item = document.getElementById(`${x}${y}`)!;
    item.dispatchEvent(new Event('click', { bubbles: true }));
  }

  return {
    gameboard,
    getStatus,
    setName,
    getName,
    makeAttack,
  };
};

export default Player;
