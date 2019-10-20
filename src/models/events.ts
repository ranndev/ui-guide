import Popper from 'popper.js';
import IHighlightElements from './highlight-elements';

export default interface IEvents {
  onTargetElementQueried: (element: HTMLElement) => void;

  onElementsReady: (elements: IHighlightElements, popper: Popper | null) => void;

  onElementsUpdate: (elements: IHighlightElements, popper: Popper | null) => void;
}
