import IPeripherals from './peripherals';

export default interface IEvents {
  onElementQueried: (element: HTMLElement) => Promise<void> | void;
  onPerepheralsReady: (
    peripherals: IPeripherals & Required<Omit<IPeripherals, 'popup'>>,
    element: HTMLElement,
  ) => Promise<void> | void;
}
