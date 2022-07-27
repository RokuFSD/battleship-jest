const Animations = (() => {
  function closeAnimation(element: HTMLElement) {
    let opacity = 1;
    function decrease() {
      opacity -= 0.05;
      if (opacity <= 0) {
        element.style.opacity = '0';
        element.remove();
        return;
      }
      element.style.opacity = `${opacity}`;
      requestAnimationFrame(decrease);
    }
    decrease();
  }

  function appearsAnimation(element: HTMLElement) {
    let top = 20;
    let opacity = 0;
    function moveDown() {
      top += 1;
      opacity += 0.2;
      if (top === 25) {
        element.style.opacity = '1';
        element.style.top = `${top}%`;
        return;
      }
      element.style.opacity = `${opacity}`;
      element.style.top = `${top}%`;
      requestAnimationFrame(moveDown);
    }
    moveDown();
  }

  function disappearsAnimation(element: HTMLElement) {
    let top = 25;
    let opacity = 1;
    function moveUp() {
      top -= 1;
      opacity -= 0.2;
      if (top === 20) {
        element.style.opacity = '0';
        element.style.top = `${top}%`;
        return;
      }
      element.style.opacity = `${opacity}`;
      element.style.top = `${top}%`;
      requestAnimationFrame(moveUp);
    }
    moveUp();
  }
  return {
    closeAnimation,
    appearsAnimation,
    disappearsAnimation,
  };
})();

export default Animations;
