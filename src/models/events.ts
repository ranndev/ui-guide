import IPeripherals from './peripherals';

export default interface IEvents {
  onElementQueried: (element: HTMLElement) => Promise<void> | void;
  onPerepheralsReady: (
    peripherals: Pick<IPeripherals, 'popup'> &
      Required<Pick<IPeripherals, 'backdrop' | 'box'>>,
    element: HTMLElement,
  ) => Promise<void> | void;
}
