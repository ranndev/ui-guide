import { PopperOptions } from 'popper.js';
import IEvents from './events';

export interface IHighlightWaitObject {
  /**
   * A delay (in milliseconds) before it will try to search for the target
   * element again. Default value is `150`.
   */
  delay?: number;
  /**
   * A maximum wait time before it give up on searching for the target element.
   * An error will be thrown when the set `max` reached. Default value is
   * `Infinity`.
   */
  max?: number;
}

export default interface IHighlightOptions {
  /**
   * The target element or the selector for the target element.
   */
  target: string | Element;
  /**
   * The context element on where to find the target element. It will be the
   * `document` if not provided.
   */
  context?: Element;
  /**
   * Option on wether the target element should be clickable. `true` by default.
   */
  clickable?: boolean;
  /**
   * Automatically set the focus on the target element. Enabled by default.
   */
  autofocus?: boolean;
  /**
   * If `false`, It will throw an error immediately once searching for the
   * target element fail on the first try.
   */
  wait?: boolean | IHighlightWaitObject;
  /**
   * If `true`, a popup will show using the default popper.js options. It can
   * also be a popper options, which will use to override the
   * [default popper options](https://popper.js.org/popper-documentation.html#Popper.Defaults).
   */
  popper?: boolean | PopperOptions;
  /**
   * When this is set to `'highlight-box'`, the highlight's element
   * (`[uig-highlight-box]`) will be used as the popper reference element.
   * It will be the highlighted element otherwise.
   */
  popperRef?: 'highlight-target' | 'highlight-box';
  /**
   * Options for listening on events.
   */
  events?: Partial<IEvents>;
  /**
   * Overrides the update delay for the highlight element.
   *
   * By default, the position and size of highlight element were updated every
   * `0` miliseconds.
   */
  highlightUpdateDelay?: number;
}
