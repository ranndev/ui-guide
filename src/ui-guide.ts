import Popper from 'popper.js';
import IGlobalConfiguration from './models/global-configuration';
import IHighlightOptions from './models/highlight-options';
import IStates, { IHighlighted } from './models/states';

// Utilities

import createAttrPrefixer from './utils/create-attr-prefixer';
import createElementsUpdater from './utils/create-elements-updater';
import deepExtendConfig from './utils/deep-extend-config';
import elementBoxUpdater from './utils/default-elements-updater';
import isElementPositioned from './utils/is-element-positioned';
import queryWaitElement from './utils/query-wait-element';
import resetStates from './utils/reset-states';

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

const defaults: IGlobalConfiguration = {
  attrPrefix: 'uig',
  events: { onElementsReady: undefined, onTargetElementQueried: undefined },
  highlightOptions: {
    autofocus: true,
    clickable: true,
    popup: true,
    popupRef: 'element-target',
    updateElementsDelay: 0,
    wait: { delay: 0, max: Infinity },
  },
};

const states: IStates = {
  currentUpdateSession: { delay: 0, ref: 0 },
  elements: { backdrop: null, box: null, popup: null, target: null },
  highlightOperation: null,
  popper: null,
};

const attr = createAttrPrefixer(defaults);
const update = createElementsUpdater(states);

export default class UIGuide {
  /**
   * Configure the default highlight settings.
   * @param config New configuration.
   */
  public static configure(config: DeepPartial<IGlobalConfiguration>) {
    if (states.highlightOperation) {
      throw new Error(
        'Changing of configuration is forbidden while there is a pending highlight operation.'
      );
    }

    deepExtendConfig(defaults, config);
  }

  /**
   * Highlight an element from the page.
   * @param opts Highlight options.
   */
  public static highlight(
    opts: IHighlightOptions | Element | string,
  ): Promise<IHighlighted> {
    if (states.highlightOperation) {
      /* istanbul ignore if */
      if (__DEV__) {
        throw new Error(
          'UIGuide currently has a pending highlight operation.\n' +
            'Make sure to await the highlight operation properly before you highlight another element.',
        );
      }

      throw new Error('Highlight operation still pending.');
    }

    if (states.elements.backdrop) {
      // If backdrop element was reused,
      // just reset the `show` marker attribute then.
      states.elements.backdrop.removeAttribute(attr('markers', 'show'));
    }

    if (states.elements.target) {
      // If there's still a highlighted element,
      // just remove the possible UIGuide attributes to it.
      states.elements.target.removeAttribute(attr('elements', 'target'));
      states.elements.target.removeAttribute(attr('markers', 'clickable'));
      states.elements.target.removeAttribute(attr('markers', 'non-positioned'));
    }

    const options =
      opts instanceof Element || typeof opts === 'string'
        ? ({ element: opts } as IHighlightOptions)
        : opts;

    states.highlightOperation = queryWaitElement(defaults, options);

    const events = options.events || {};
    return states.highlightOperation.promise
      .then((target) => {
        states.elements.target = target;

        // Emit target element queried listeners.
        events.onTargetElementQueried?.(target)
        defaults.events.onTargetElementQueried?.(target);

        // Add initial attributes.
        document.body.setAttribute(attr('markers', 'highlighting'), '');
        target.setAttribute(attr('elements', 'target'), '');

        if (!isElementPositioned(target)) {
          target.setAttribute(attr('markers', 'non-positioned'), '');
        }

        if (options.clickable ?? defaults.highlightOptions.clickable) {
          target.setAttribute(attr('markers', 'clickable'), '');
        }

        if (options.autofocus ?? defaults.highlightOptions.autofocus) {
          target.focus();
        }

        // Create backdrop & box elements.
        // Reuse if possible.

        if (!states.elements.backdrop) {
          states.elements.backdrop = document.createElement('div');
          states.elements.backdrop.setAttribute(attr('elements', 'backdrop'), '');
        }

        if (!states.elements.box) {
          states.elements.box = document.createElement('div');
          states.elements.box.setAttribute(attr('elements', 'box'), '');
          states.elements.backdrop.append(states.elements.box);
        }

        // Prevent reusing of popup element.

        if (states.elements.popup) {
          states.elements.popup.remove();
        }

        const popup = options.popup ?? defaults.highlightOptions.popup

        if (popup) {
          states.elements.popup = document.createElement('div');
          states.elements.popup.setAttribute(attr('elements', 'popup'), '');
          document.body.append(states.elements.popup);

          if (states.popper) {
            // Prevent reusing of popper instance.
            states.popper.destroy();
          }

          const popupRef = options.popupRef ?? defaults.highlightOptions.popupRef

          states.popper = new Popper(
            popupRef === 'element-box' ? states.elements.box : target,
            states.elements.popup,
            typeof popup === 'boolean' ? undefined : popup,
          );
        }

        const offsetParent = target.offsetParent || document.body;

        offsetParent.append(states.elements.backdrop);

        // Emit element ready listeners.
        events.onElementsReady?.(states.elements, states.popper);
        defaults.events.onElementsReady?.(states.elements, states.popper);

        states.elements.backdrop.setAttribute(attr('markers', 'show'), '');
        states.elements.popup?.setAttribute(attr('markers', 'show'), '')

        update(events.onElementsUpdate || elementBoxUpdater);

        return {
          element: target,
          unhighlight: () => {
            UIGuide.unhighlight();
          },
        };
      })
      .finally(() => {
        states.highlightOperation = null;
      });
  }

  /**
   * Unhighlight the current highlighted element.
   */
  public static unhighlight() {
    document.body.removeAttribute(attr('markers', 'highlighting'));
    resetStates(states, attr)
  }
}
