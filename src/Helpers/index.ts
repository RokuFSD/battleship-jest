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
  for (let i = 1; i < shipLength && y + i <= 9; i++) {
    let sibling = document.getElementById(`${x}${y + i}`);
    if (sibling!.classList.contains('ship')) {
      return false;
    }
  }
  return x < 10 && y + shipLength <= 10;
}

export { createElement, validCoordinates };
