import Popper from 'popper.js';
import IConfiguration from './models/configuration';
import IHighlightOptions from './models/highlight-options';
import IPeripherals from './models/peripherals';
import { IDeferredPromise } from './utils/defer';
import noop from './utils/noop';
import queryElement from './utils/query-element';

export default class UIGuide {
  public static config: IConfiguration = {
    classNamePrefix: 'uig',
    classes: {
      backdrop: 'peripherals-backdrop',
      box: 'peripherals-box',
      clickable: 'clickable',
      highlighted: 'highlighted',
      highlighting: 'highlighting',
      popup: 'peripherals-popup',
    },
    events: {
      onElementQueried: noop,
      onPerepheralsReady: noop,
    },
    highlightOptions: {
      autofocus: true,
      clickable: true,
      maxWait: Infinity,
      popup: true,
      wait: true,
      waitDelay: 150,
    },
  };

  public static highlight(options: IHighlightOptions) {
    UIGuide.unhighlight();
    UIGuide.highlighting = queryElement(UIGuide.config, options);

    const events = options.events || {};

    return UIGuide.highlighting.promise
      .then((element) => {
        UIGuide.element = element;

        const emitElementQueried =
          events.onElementQueried === undefined
            ? noop
            : events.onElementQueried;
        return emitElementQueried(element);
      })
      .then(() => {
        return UIGuide.config.events.onElementQueried(UIGuide.element!);
      })
      .then(() => {
        document.body.classList.add(classname('highlighting'));
        UIGuide.element!.classList.add(classname('highlighted'));

        const clickable =
          options.clickable === undefined
            ? UIGuide.config.highlightOptions.clickable
            : options.clickable;

        if (clickable) {
          UIGuide.element!.classList.add(classname('clickable'));
        }

        const autofocus =
          options.autofocus === undefined
            ? UIGuide.config.highlightOptions.clickable
            : options.autofocus;

        if (autofocus) {
          UIGuide.element!.focus();
        }

        if (!UIGuide.peripherals.backdrop) {
          UIGuide.peripherals.backdrop = document.createElement('div');
          UIGuide.peripherals.backdrop.classList.add(classname('backdrop'));
        }

        if (!UIGuide.peripherals.box) {
          UIGuide.peripherals.box = document.createElement('div');
          UIGuide.peripherals.box.classList.add(classname('box'));
          UIGuide.peripherals.backdrop.append(UIGuide.peripherals.box);
        }

        const popup =
          options.popup === undefined
            ? UIGuide.config.highlightOptions.popup
            : options.popup;

        if (popup) {
          UIGuide.peripherals.popup = document.createElement('div');
          UIGuide.peripherals.popup.classList.add(classname('popup'));
          document.body.append(UIGuide.peripherals.popup);
          UIGuide.popper = new Popper(
            UIGuide.element!,
            UIGuide.peripherals.popup,
            typeof popup === 'boolean' ? undefined : popup,
          );
        }

        (UIGuide.element!.offsetParent || document.body).append(
          UIGuide.peripherals.backdrop,
        );

        const emitPeripheralsReady =
          events.onPerepheralsReady === undefined
            ? noop
            : events.onPerepheralsReady;
        return emitPeripheralsReady(UIGuide.peripherals, UIGuide.element!);
      })
      .then(() => {
        return UIGuide.config.events.onPerepheralsReady(
          UIGuide.peripherals,
          UIGuide.element!,
        );
      })
      .then(() => {
        UIGuide.udpdatePeripheralsUntilUnhighlight();
      })
      .then(() => {
        return {
          element: UIGuide.element!,
          unhighlight: () => {
            UIGuide.unhighlight();
          },
        };
      })
      .finally(() => {
        delete UIGuide.highlighting;
      });
  }

  /**
   * Unhighlight the current highlighted element.
   */
  public static unhighlight() {
    document.body.classList.remove(classname('highlighting'));

    if (UIGuide.element) {
      UIGuide.element.classList.remove(classname('highlighted'));
      UIGuide.element.classList.remove(classname('clickable'));
    }

    if (UIGuide.highlighting) {
      UIGuide.highlighting.reject('Highlight operation terminated.');
    }

    if (UIGuide.popper) {
      UIGuide.popper.destroy();
      delete UIGuide.popper;
    }

    if (UIGuide.peripherals.popup) {
      UIGuide.peripherals.popup.remove();
    }

    if (UIGuide.peripherals.backdrop) {
      UIGuide.peripherals.backdrop.remove();
    }

    if (UIGuide.peripherals.box) {
      UIGuide.peripherals.box.remove();
    }

    delete UIGuide.peripherals.popup;
    delete UIGuide.peripherals.backdrop;
    delete UIGuide.peripherals.box;
    delete UIGuide.element;
    delete UIGuide.highlighting;
  }

  private static element?: HTMLElement;
  private static highlighting?: IDeferredPromise<HTMLElement>;
  private static peripherals: IPeripherals = {};
  private static popper?: Popper;

  private static udpdatePeripheralsUntilUnhighlight() {
    if (!UIGuide.element) return;

    const clientRect = UIGuide.element.getBoundingClientRect();

    requestAnimationFrame(() => {
      if (!UIGuide.peripherals.box) return;

      UIGuide.peripherals.box.style.left = clientRect.left + 'px';
      UIGuide.peripherals.box.style.top = clientRect.top + 'px';
      UIGuide.peripherals.box.style.width = clientRect.width + 'px';
      UIGuide.peripherals.box.style.height = clientRect.height + 'px';

      if (UIGuide.popper) {
        UIGuide.popper.update();
      }

      UIGuide.udpdatePeripheralsUntilUnhighlight();
    });
  }
}

function classname(name: keyof IConfiguration['classes']): string {
  return UIGuide.config.classNamePrefix + '-' + UIGuide.config.classes[name];
}
