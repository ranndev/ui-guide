import Popper from 'popper.js';
import IHighlightElements from '../models/highlight-elements';

export default function elementBoxUpdater(
  elements: IHighlightElements,
  popper: Popper | null,
) {
  if (!elements.target || !elements.backdrop || !elements.box) return;

  const targetRect = elements.target.getBoundingClientRect();
  const backdropRect = elements.backdrop.getBoundingClientRect();

  elements.box.style.left = targetRect.left - backdropRect.left + 'px';
  elements.box.style.top = targetRect.top - backdropRect.top + 'px';
  elements.box.style.width = targetRect.width + 'px';
  elements.box.style.height = targetRect.height + 'px';

  if (popper) {
    popper.update();
  }
}
