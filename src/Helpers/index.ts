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

function movesWithCache() {
  let cacheMoves: { [k: string]: number } = {};
  return function move(): { x: number; y: number } {
    let x = Math.floor(Math.random() * 10);
    let y = Math.floor(Math.random() * 10);
    if (cacheMoves[`${x}${y}`] == 1) {
      return move();
    } else {
      cacheMoves[`${x}${y}`] = 1;
    }
    return { x, y };
  };
}

function makeUnclickableBy(element: HTMLElement, timer: number) {
  element.style.pointerEvents = 'none';
  setTimeout(() => {
    element.style.pointerEvents = 'auto';
  }, timer);
}

export { createElement, movesWithCache, makeUnclickableBy };
