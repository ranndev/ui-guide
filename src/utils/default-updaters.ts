import Popper from 'popper.js';

export function updateHighlight(data: {
  target: HTMLElement;
  backdrop: HTMLElement;
  box: HTMLElement;
}) {
  const targetRect = data.target.getBoundingClientRect();
  const backdropRect = data.backdrop.getBoundingClientRect();

  data.box.style.left = targetRect.left - backdropRect.left + 'px';
  data.box.style.top = targetRect.top - backdropRect.top + 'px';
  data.box.style.width = targetRect.width + 'px';
  data.box.style.height = targetRect.height + 'px';
}

export function updatePopup(data: { element: HTMLElement; popper: Popper }) {
  data.popper.update();
}
