import IEvents from '../models/events';
import IHighlightOptions from '../models/highlight-options';
import { updateHighlight, updatePopup } from '../utils/default-updaters';

export type ConfigHighlightOptions = Required<
  Omit<IHighlightOptions, 'target' | 'context' | 'events'>
>;

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export default class Settings {
  public data: {
    events: Partial<Omit<IEvents, 'onHighlightUpdate' | 'onPopupUpdate'>> &
      Pick<IEvents, 'onHighlightUpdate' | 'onPopupUpdate'>;
    highlightOptions: ConfigHighlightOptions;
  } = {
    events: {
      onHighlightReady: undefined,
      onHighlightUpdate: updateHighlight,
      onPopupReady: undefined,
      onPopupUpdate: updatePopup,
      onTargetFound: undefined,
    },
    highlightOptions: {
      autofocus: true,
      clickable: true,
      highlightUpdateDelay: 0,
      popper: true,
      popperRef: 'highlight-target',
      popupUpdateDelay: 0,
      wait: true,
    },
  };

  public update(config: DeepPartial<Settings['data']>) {
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
