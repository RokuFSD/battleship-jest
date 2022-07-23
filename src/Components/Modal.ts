import { createElement } from '../Helpers';
import layout from '../styles/layout.module.css';
import components from '../styles/components.module.css';

const Modal = () => {
  let element = createElement('div', { class: `${layout.modal} ${components.modal}` });
  let outterElement = createElement('div', { class: `${layout.modalOutter}` }, [element]);

  function addItem(items: HTMLElement[] | Node[]) {
    let fragment = new DocumentFragment();
    items.forEach((item) => fragment.appendChild(item));
    element.appendChild(fragment);
  }

  function getModal(): HTMLElement {
    return outterElement;
  }

  function closeModal() {
    outterElement.remove();
  }

  return {
    addItem,
    getModal,
    closeModal,
  };
};

export default Modal;
