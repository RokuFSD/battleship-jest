import notifier from '../styles/notifier.module.css';
import { createElement } from '../Helpers';
import Animations from '../Helpers/Animations';

const Notifier = (() => {
  function notify(message: string, type: 'hit' | 'miss') {
    const notification = createElement(
      'div',
      { class: `${notifier.notification} ${notifier[type]}` },
      [createElement('p', {}, message)],
    );
    document.body.appendChild(notification);
    Animations.appearsAnimation(notification);
    setTimeout(() => {
      Animations.disappearsAnimation(notification);
    }, 1000);
    setTimeout(() => {
      notification.remove();
    }, 1500);
  }
  return {
    notify,
  };
})();

export default Notifier;
