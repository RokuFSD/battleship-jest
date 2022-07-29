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

  function appearsAnimationMobile(element: HTMLElement) {
    let bottomPosition = window.innerHeight + window.scrollY;
    let bottom: number = bottomPosition - (bottomPosition * 15) / 100;
    let top: number = (bottomPosition * 80) / 100;
    let opacity = 0;
    function moveDown() {
      top += 5;
      opacity += 0.2;
      if (top >= bottom) {
        element.style.opacity = '1';
        element.style.top = `${top}px`;
        return;
      }
      element.style.opacity = `${opacity}`;
      element.style.top = `${top}px`;
      requestAnimationFrame(moveDown);
    }
    moveDown();
  }

  function appearsAnimation(element: HTMLElement) {
    let inMediaQuery = window.matchMedia('(max-width: 768px)').matches;
    if (inMediaQuery) {
      appearsAnimationMobile(element);
    } else {
      let top: number = 20;
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
  }

  function disappearsAnimationMobile(element: HTMLElement) {
    let bottomPosition = window.innerHeight + window.scrollY;
    let top: number = bottomPosition - (bottomPosition * 15) / 100;
    let bottom: number = (bottomPosition * 80) / 100;
    let opacity = 1;

    function moveUp() {
      top -= 1;
      opacity -= 0.2;
      if (top <= bottom) {
        element.style.opacity = '0';
        element.style.top = `${top}px`;
        return;
      }
      element.style.opacity = `${opacity}`;
      element.style.top = `${top}px`;
      requestAnimationFrame(moveUp);
    }
    moveUp();
  }

  function disappearsAnimation(element: HTMLElement) {
    let inMediaQuery = window.matchMedia('(max-width: 768px)').matches;
    if (inMediaQuery) {
      disappearsAnimationMobile(element);
    } else {
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
  }

  return {
    closeAnimation,
    appearsAnimation,
    disappearsAnimation,
  };
})();

export default Animations;
