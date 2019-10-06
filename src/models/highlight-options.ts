import { PopperOptions } from 'popper.js';
import IEvents from './events';

export default interface IHighlightOptions {
  /**
   * The target element or the selector for the target element to be highlighted.
   */
  element: string | Element;
  /**
   * The context element for the target element. It's using the document by default.
   */
  context?: Element;
  clickable?: boolean;
  autofocus?: boolean;
  wait?: boolean;
  waitDelay?: number;
  maxWait?: number;
  popup?: boolean | PopperOptions;
  events?: Partial<IEvents>;
}
