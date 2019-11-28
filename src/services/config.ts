import IEvents from '../models/events';
import IHighlightOptions from '../models/highlight-options';
import updateHighlight from '../utils/default-highlight-update-fn';

export type ConfigHighlightOptions = Required<
  Omit<IHighlightOptions, 'target' | 'context' | 'events'>
>;

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export default class Config {
  public data: {
    events: Partial<Omit<IEvents, 'onHighlightUpdate'>> &
      Pick<IEvents, 'onHighlightUpdate'>;
    highlightOptions: ConfigHighlightOptions;
  } = {
    events: {
      onElementsReady: undefined,
      onHighlightUpdate: updateHighlight,
      onTargetFound: undefined,
    },
    highlightOptions: {
      autofocus: true,
      clickable: true,
      highlightUpdateDelay: 0,
      popper: true,
      popperRef: 'highlight-target',
      wait: true,
    },
  };

  public update(config: DeepPartial<Config['data']>) {
    this.extend(this.data, config);
  }

  private extend(target: any, source: any) {
    for (const key in source) {
      if (target.hasOwnProperty(key)) {
        if (typeof source[key] === 'object') {
          this.extend(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
    }
  }
}
