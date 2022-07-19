import { gameConfig } from '../config/gameConfig';

type PropTypes = { [k: string]: string } | undefined;

function createElement(tagName: string, props: PropTypes, innerContent?: HTMLElement[] | string): HTMLElement {
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

function validCoordinates(x: number, y: number, shipLength: number): boolean {
  let axisToCheck = gameConfig.config.mainAxis === 'y' ? y : x;
  for (let i = 1; i < shipLength && axisToCheck + i <= 9; i++) {
    let sibling = document.getElementById(`${gameConfig.config.mainAxis === 'y' ? `${x}${y + i}` : `${x + i}${y}`}`);
    if (sibling!.classList.contains('ship')) {
      return false;
    }
  }
  return axisToCheck + shipLength <= 10;
  // return x < 10 && y + shipLength <= 10;
}

export { createElement, validCoordinates };
