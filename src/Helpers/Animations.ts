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
  return {
    closeAnimation,
  };
})();

export default Animations;
