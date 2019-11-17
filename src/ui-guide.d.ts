import Popper, { PopperOptions } from 'popper.js';

export interface IDeferredPromise<ResolveValue = any> {
  promise: Promise<ResolveValue>;
  resolve(value: ResolveValue): void;
  reject(reason: any): void;
}

export interface IEvents {
  onTargetElementQueried: (element: HTMLElement) => void;
  onElementsReady: (
    elements: IHighlightElements,
    popper: Popper | null,
  ) => void;
  onElementsUpdate: (
    elements: IHighlightElements,
    popper: Popper | null,
  ) => void;
}

export interface IHighlighted {
  element: HTMLElement;
  unhighlight: () => void;
}

export interface IHighlightElements {
  backdrop: HTMLElement | null;
  box: HTMLElement | null;
  target: HTMLElement | null;
  popup: HTMLElement | null;
}

export interface IHighlightOptions {
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

export interface IStates {
  currentUpdateSession: { delay: number; ref: number };
  elements: IHighlightElements;
  popper: Popper | null;
  highlightOperation: IDeferredPromise<HTMLElement> | null;
}

export interface IGlobalConfiguration {
  attrPrefix: string;
  events: Partial<Omit<IEvents, 'onElementsUpdate'>>;
  highlightOptions: GlobalHighlightOptions;
}

export type GlobalHighlightOptions = Required<
  Omit<IHighlightOptions, 'context' | 'element' | 'events' | 'wait'>
> & {
  wait: Required<IHighlightWaitObject>;
};

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export default class UIGuide {
  /**
   * Configure the default highlight settings.
   * @param config New configuration.
   */
  public static configure(config: DeepPartial<IGlobalConfiguration>): void;
  /**
   * Highlight an element from the page.
   * @param opts Highlight options.
   */
  public static highlight(
    opts: IHighlightOptions | Element | string,
  ): Promise<IHighlighted>;
  /**
   * Unhighlight the current highlighted element.
   */
  public static unhighlight(): void;
}

export {};
