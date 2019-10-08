export type IOutputPeripherals = Pick<IPeripherals, 'popup'> &
  Required<Pick<IPeripherals, 'backdrop' | 'box'>>;

export default interface IPeripherals {
  backdrop?: HTMLElement;
  box?: HTMLElement;
  popup?: HTMLElement;
}
