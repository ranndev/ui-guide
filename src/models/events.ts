import IPeripherals from './peripherals';

export default interface IEvents {
  onElementQueried: (element: HTMLElement) => Promise<void> | void;
  onPerepheralsReady: (
    peripherals: IPeripherals,
    element: HTMLElement,
  ) => Promise<void> | void;
}
