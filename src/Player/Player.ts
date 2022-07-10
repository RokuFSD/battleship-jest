import { GameboardType } from '../Gameboard/Gameboard';

type PlayerStatus = 'playing' | 'winner';

export type PlayerType = {
  gameboard: GameboardType;
  setName(value: string): void;
  getName(): string;
  getStatus(): PlayerStatus;
  changeStatus(value: PlayerStatus): void;
};

const Player = (Gameboard: GameboardType) => {
  let gameboard: GameboardType = Gameboard;
  let name: string = '';
  let status: PlayerStatus = 'playing';

  function setName(value: string): void {
    name = value;
  }

  function getName(): string {
    return name;
  }

  function getStatus(): PlayerStatus {
    return status;
  }

  function changeStatus(value: PlayerStatus): void {
    status = value;
  }

  return {
    gameboard,
    setName,
    getName,
    getStatus,
    changeStatus,
  };
};

export default Player;
