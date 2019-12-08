import Popper from 'popper.js';

export default interface IEvents {
  /**
   * This event will fire once the target element successfully queried.
   */
  onTargetFound: (target: HTMLElement) => void;

  /**
   * This will fire when the highlight elements ([uig-highlight-backdrop] and
   * [uig-highlight-box]) are created and appended to the dom.
   */
  onHighlightReady: (highlight: {
    backdrop: HTMLElement;
    box: HTMLElement;
  }) => void;

  /**
   * This event will fire when popup element and the popper instance is are
   * ready.
   *
   * Note: If the `popper` option disabled or has a value of `false`, do not
   * expect this to trigger.
   */
  onPopupReady: (popup: { popper: Popper; element: HTMLElement }) => void;

  /**
   * This will fire everytime the highlight's elements request an update.
   *
   * **Important:** *Listening on this event will bring you the full*
   * *responsibility of updating the highlight's elements. Make sure to*
   * *implement this function as performant as possible.*
   */
  onHighlightUpdate: (data: {
    target: HTMLElement;
    backdrop: HTMLElement;
    box: HTMLElement;
  }) => void;

  /**
   * This will fire everytime the popup's element request an update.
   * By default, this is just calling `popper.update()` internally.
   *
   * **Important:** *Listening on this event will bring you the full*
   * *responsibility of updating the highlight & popup elements.*
   */
  onPopupUpdate: (data: { element: HTMLElement; popper: Popper }) => void;
}
