import { IRequiredElements } from '../services/ui-update-scheduler';

export default interface IEvents {
  onTargetFound: (element: HTMLElement) => void;
  onElementsReady: (elements: IRequiredElements) => void;
  onHighlightUpdate: (elements: IRequiredElements) => void;
}
