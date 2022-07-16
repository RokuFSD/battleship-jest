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
  return x < 10 && y + shipLength <= 10;
}

export { createElement, validCoordinates };
