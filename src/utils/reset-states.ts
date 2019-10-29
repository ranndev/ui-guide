import IStates from '../models/states';
import createAttrPrefixer from './create-attr-prefixer';

export default function resetStates(
  states: IStates,
  attr: ReturnType<typeof createAttrPrefixer>,
) {
  states.highlightOperation?.reject('Highlight operation terminated.');
  states.highlightOperation = null;

  if (states.elements.target) {
    states.elements.target.removeAttribute(attr('elements', 'target'));
    states.elements.target.removeAttribute(attr('markers', 'clickable'));
    states.elements.target.removeAttribute(attr('markers', 'non-positioned'));
    states.elements.target = null;
  }

  states.popper?.destroy();
  states.popper = null;

  states.elements.popup?.remove();
  states.elements.popup = null;

  states.elements.backdrop?.remove();
  states.elements.backdrop = null;

  states.elements.box?.remove();
  states.elements.box = null;
}
