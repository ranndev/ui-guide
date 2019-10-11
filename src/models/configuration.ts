import IEvents from './events';
import IHighlightOptions from './highlight-options';

export default interface IConfiguration {
  classNamePrefix: string;
  classes: {
    backdrop: string;
    box: string;
    clickable: string;
    highlighted: string;
    'highlighted-container': string;
    'highlighted-non-positioned': string;
    highlighting: string;
    popup: string;
  };
  highlightOptions: Required<
    Omit<IHighlightOptions, 'context' | 'element' | 'events'>
  >;
  events: Omit<IEvents, 'onUpdate'>;
}
