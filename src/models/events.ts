import { IOutputPeripherals } from './peripherals';

export default interface IEvents {
  /**
   * This event triggers when the target element sucessfully queried.
   */
  onElementQueried: (element: HTMLElement) => Promise<void> | void;
  /**
   * This event triggers when all the peripherals are ready.
   */
  onPerepheralsReady: (
    peripherals: IOutputPeripherals,
    element: HTMLElement,
  ) => Promise<void> | void;
}
