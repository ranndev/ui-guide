import { PopperOptions } from 'popper.js';
import IEvents from './events';

export interface IHighlightWaitObject {
  /**
   * A delay in milliseconds before it will try to find the target element
   * again. Unnecessary when `wait` is `false`. Default value is `150`
   * milliseconds.
   */
  delay?: number;
  /**
   * A maximum wait time before it give up on searching for target element.
   * An error will be thrown when the set `maxWait` reached. Default value is
   * `Infinity`.
   */
  max?: number;
}

export default interface IHighlightOptions {
  /**
   * The target element or the selector for the target element to be highlighted.
   */
  element: string | Element;
  /**
   * The context element on where to find the target element. It will use the
   * `document` by default.
   */
  context?: Element;
  /**
   * Option wether the target element should be clickable. `true` by default.
   */
  clickable?: boolean;
  /**
   * If `clickable` option seems not work, Enabling this option might help.
   */
  autofocus?: boolean;
  /**
   * If `false`, It will throw an error when target element is not found on the
   * first try.
   */
  wait?: boolean | IHighlightWaitObject;
  /**
   * If `true`, a popup will show using the default popper.js options. It can
   * also be a popper options, which will use to override the
   * [default popper options](https://popper.js.org/popper-documentation.html#Popper.Defaults).
   */
  popup?: boolean | PopperOptions;
  popupRef?: 'element-target' | 'element-box';
  /**
   * An object of events on where you can listen to.
   */
  events?: Partial<IEvents>;
  updateElementsDelay?: number;
}
