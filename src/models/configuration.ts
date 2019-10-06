import IEvents from './events';
import IHighlightOptions from './highlight-options';

export default interface IConfiguration {
  classNamePrefix: string;
  classes: {
    highlighted: string;
    clickable: string;
    backdrop: string;
    box: string;
    highlighting: string;
    popup: string;
  };
  highlightOptions: Required<
    Omit<IHighlightOptions, 'context' | 'element' | 'events'>
  >;
  events: IEvents;
}
