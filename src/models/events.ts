import { IRequiredElements } from '../services/ui-update-scheduler';

export default interface IEvents {
  /**
   * This event will fire once the target element successfully queried.
   */
  onTargetFound: (target: HTMLElement) => void;
  /**
   * This will fire when the target, highlight, and popup (if available)
   * elements are ready.
   */
  onElementsReady: (elements: IRequiredElements) => void;
  /**
   * This will fire everytime the highlight's element request an update.
   *
   * **Important:** *Listening on this event will bring you the full*
   * *responsibility of updating the highlight & popup elements. Make sure to*
   * *implement this function as performant as possible.*
   */
  onHighlightUpdate: (elements: IRequiredElements) => void;
}
