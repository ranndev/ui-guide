import IEvents from '../models/events';
import IHighlightOptions, {
  IHighlightWaitObject,
} from '../models/highlight-options';
import updateHighlight from '../utils/default-highlight-update-fn';

export type ConfigHighlightOptions = Required<
  Omit<IHighlightOptions, 'element' | 'context' | 'events' | 'wait'>
> & {
  wait: Required<IHighlightWaitObject>;
};

type DeepPartial<T> = {
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
      popperRef: 'highlight-target',
      popup: true,
      wait: { delay: 0, max: Infinity },
    },
  };

  public set(config: DeepPartial<Config['data']>) {
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
