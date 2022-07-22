import { createElement } from '../Helpers';
import components from '../styles/components.module.css';

const Button = (text?: string) => {
  let element = createElement(
    'button',
    { class: `${components.btn}` },
    text !== '' ? text : 'Button',
  );

  function addEvent(type: string, callback: () => void) {
    element.addEventListener(type, callback);
  }

  function getButton(): HTMLElement {
    return element;
  }

  return {
    getButton,
    addEvent,
  };
};

export default Button;
