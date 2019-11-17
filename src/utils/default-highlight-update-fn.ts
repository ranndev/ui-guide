import { IRequiredElements } from '../services/ui-update-scheduler';

export default function updateHighlight(elements: IRequiredElements) {
  const { backdrop, box } = elements.highlight;
  const targetRect = elements.target.getBoundingClientRect();
  const backdropRect = backdrop.getBoundingClientRect();

  box.style.left = targetRect.left - backdropRect.left + 'px';
  box.style.top = targetRect.top - backdropRect.top + 'px';
  box.style.width = targetRect.width + 'px';
  box.style.height = targetRect.height + 'px';

  elements.popper?.update();
}
