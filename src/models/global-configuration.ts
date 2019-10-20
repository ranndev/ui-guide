import IEvents from './events';
import IHighlightOptions, { IHighlightWaitObject } from './highlight-options';

type GlobalHighlightOptions = Required<
  Omit<IHighlightOptions, 'context' | 'element' | 'events' | 'wait'>
> & {
  wait: Required<IHighlightWaitObject>;
};

export default interface IGlobalConfiguration {
  attrPrefix: string;
  events: Required<Omit<IEvents, 'onElementsUpdate'>>;
  highlightOptions: GlobalHighlightOptions;
}
