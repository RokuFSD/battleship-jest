import { gameConfig } from '../config/gameConfig';

type PropTypes = { [k: string]: string } | undefined;

function createElement(
  tagName: string,
  props: PropTypes,
  innerContent?: HTMLElement[] | string | Node[],
): HTMLElement {
  const element = document.createElement(tagName);

  for (let key of Object.keys(props!)) {
    if (key && key !== '') {
      element.setAttribute(key, props![key]);
    }
  }
  if (typeof innerContent === 'string') {
    element.appendChild(new Text(innerContent));
  } else {
    innerContent?.forEach((innerElement) => element.appendChild(innerElement));
  }
  return element;
}

function validCoordinates(x: number, y: number, shipLength: number, gridRoot: string): boolean {
  let axisToCheck = gameConfig.config.mainAxis === 'y' ? x : y;
  for (let i = 1; i < shipLength && axisToCheck + i <= 9; i++) {
    let id = `${gridRoot}${gameConfig.config.mainAxis === 'x' ? `${x}${y + i}` : `${x + i}${y}`}`;
    let sibling = document.getElementById(id);
    if (sibling!.classList.contains('ship')) {
      return false;
    }
  }
  return axisToCheck + shipLength <= 10;
}


function movesWithCache() {
  let cacheMoves: { [k: string]: number } = {};
  return function move(): { x: number; y: number } {
    let x = Math.floor(Math.random() * 10);
    let y = Math.floor(Math.random() * 10);
    if (cacheMoves[`${x}${y}`] == 1) {
      return move();
    } else {
      cacheMoves[`${x}${y}`] = 1;
      return { x, y };
    }
  };
}


export { createElement, validCoordinates, movesWithCache };
