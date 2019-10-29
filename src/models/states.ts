import Popper from 'popper.js';
import { IDeferredPromise } from '../utils/defer';
import IHighlightElements from './highlight-elements';

export interface IHighlighted {
  element: HTMLElement;
  unhighlight: () => void;
}

export default interface IStates {
  currentUpdateSession: {
    delay: number;
    ref: number;
  };
  elements: IHighlightElements;
  popper: Popper | null;
  highlightOperation: IDeferredPromise<HTMLElement> | null;
}
