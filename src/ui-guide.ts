import Popper from 'popper.js';
import IGlobalConfiguration from './models/global-configuration';
import IHighlightOptions from './models/highlight-options';
import IStates, { IHighlighted } from './models/states';

import createClassNamePrefixer from './utils/create-class-name-prefixer';
import createElementsUpdater from './utils/create-elements-updater';
import elementBoxUpdater from './utils/default-elements-updater';
import isElementPositioned from './utils/is-element-positioned';
import noop from './utils/noop';
import queryWaitElement from './utils/query-wait-element';

const defaults: IGlobalConfiguration = {
  classNamePrefix: 'uig',
  events: {
    onElementsReady: noop,
    onTargetElementQueried: noop,
  },
  highlightOptions: {
    autofocus: true,
    clickable: true,
    popup: true,
    popupRef: 'element-target',
    updateElementsDelay: 0,
    wait: {
      delay: 0,
      max: Infinity,
    },
  },
};

const states: IStates = {
  currentUpdateSession: { delay: 0, ref: 0 },
  didForceClickable: false,
  elements: {
    backdrop: null,
    box: null,
    popup: null,
    target: null,
  },
  highlightOperation: null,
  popper: null,
};

const classname = createClassNamePrefixer(defaults);
const update = createElementsUpdater(states);

export default class UIGuide {
  public static highlight(
    opts: IHighlightOptions | Element | string,
  ): Promise<IHighlighted> {
    if (states.highlightOperation) {
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
      // just reset the `show` class then.
      states.elements.backdrop.classList.remove('show');
    }

    if (states.elements.target) {
      // If there's still a highlighted element,
      // just remove the possible UIGuide classes to it.
      states.elements.target.classList.remove(classname('elements', 'target'));
      states.elements.target.classList.remove(
        classname('markers', 'clickable'),
      );
      states.elements.target.classList.remove(
        classname('markers', 'non-positioned'),
      );
    }

    if (states.didForceClickable) {
      const className = classname('markers', 'force-clickable');
      const element = document.querySelector('.' + className);

      if (element) {
        element.classList.remove(className);
      }
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
        const emitTargetElementQueried = events.onTargetElementQueried || noop;
        emitTargetElementQueried(target);
        defaults.events.onTargetElementQueried(target);

        // Add initial classes.
        document.body.classList.add(classname('markers', 'highlighting'));
        target.classList.add(classname('elements', 'target'));

        if (!isElementPositioned(target)) {
          target.classList.add(classname('markers', 'non-positioned'));
        }

        const clickable =
          options.clickable === undefined
            ? defaults.highlightOptions.clickable
            : options.clickable;

        if (clickable) {
          target.classList.add(classname('markers', 'clickable'));
        }

        if (
          options.autofocus === undefined
            ? defaults.highlightOptions.clickable
            : options.autofocus
        ) {
          target.focus();
        }

        // Create backdrop & box elements.
        // Reuse if possible.

        if (!states.elements.backdrop) {
          states.elements.backdrop = document.createElement('div');
          states.elements.backdrop.className = classname(
            'elements',
            'backdrop',
          );
        }

        if (!states.elements.box) {
          states.elements.box = document.createElement('div');
          states.elements.box.className = classname('elements', 'box');
          states.elements.backdrop.append(states.elements.box);
        }

        // Prevent reusing of popup element.

        if (states.elements.popup) {
          states.elements.popup.remove();
        }

        const popup =
          options.popup === undefined
            ? defaults.highlightOptions.popup
            : options.popup;

        if (popup) {
          states.elements.popup = document.createElement('div');
          states.elements.popup.className = classname('elements', 'popup');
          document.body.append(states.elements.popup);

          if (states.popper) {
            // Prevent reusing of popper instance.
            states.popper.destroy();
          }

          const popupRef =
            options.popupRef === undefined
              ? defaults.highlightOptions.popupRef
              : options.popupRef;

          states.popper = new Popper(
            popupRef === 'element-box' ? states.elements.box : target,
            states.elements.popup,
            typeof popup === 'boolean' ? undefined : popup,
          );
        }

        const offsetParent = target.offsetParent || document.body;

        states.didForceClickable = clickable === 'force';
        if (states.didForceClickable) {
          const children = Array.from(offsetParent.children);

          for (const child of children) {
            if (child.contains(target)) {
              child.classList.add(classname('markers', 'force-clickable'));
              break;
            }
          }
        }

        offsetParent.append(states.elements.backdrop);

        // Emit element ready listeners.
        const emitElementsReady = events.onElementsReady || noop;
        emitElementsReady(states.elements, states.popper);
        defaults.events.onElementsReady(states.elements, states.popper);

        states.elements.backdrop.classList.add('show');
        if (states.elements.popup) {
          states.elements.popup.classList.add('show');
        }

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

  public static unhighlight() {
    document.body.classList.remove(classname('markers', 'highlighting'));

    if (states.highlightOperation) {
      states.highlightOperation.reject('Highlight operation terminated.');
      states.highlightOperation = null;
    }

    if (states.elements.target) {
      states.elements.target.classList.remove(classname('elements', 'target'));
      states.elements.target.classList.remove(
        classname('markers', 'clickable'),
      );
      states.elements.target.classList.remove(
        classname('markers', 'non-positioned'),
      );
      states.elements.target = null;
    }

    if (states.didForceClickable) {
      const className = classname('markers', 'force-clickable');
      const element = document.querySelector('.' + className);

      if (element) {
        element.classList.remove(className);
      }
    }

    if (states.popper) {
      states.popper.destroy();
      states.popper = null;
    }

    if (states.elements.popup) {
      states.elements.popup.remove();
      states.elements.popup = null;
    }

    if (states.elements.backdrop) {
      states.elements.backdrop.remove();
      states.elements.backdrop = null;
    }

    if (states.elements.box) {
      states.elements.box.remove();
      states.elements.box = null;
    }
  }
}
