export type ShipType = {
  length: number;
  hit(position: number): string | undefined;
  isSunk(): boolean;
  id: number;
};

const Ship = (length: number): ShipType => {
  let health: number[] = new Array(length).fill(0);
  let id: number = Date.now();

  function hit(position: number) {
    if (position > length) return;
    if (health[position] !== 0) return;
    health[position] = 1;
    return 'hit';
  }

  function isSunk(): boolean {
    let totalHits: number = health.reduce(
      (accum, current) => accum + current,
      0,
    );
    return totalHits === length;
  }

  return {
    length,
    hit,
    isSunk,
    id,
  };
};

export default Ship;
