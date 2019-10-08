import Popper from 'popper.js';
import IConfiguration from './models/configuration';
import IHighlightOptions from './models/highlight-options';
import IPeripherals from './models/peripherals';
import { IDeferredPromise } from './utils/defer';
import noop from './utils/noop';
import queryElement from './utils/query-element';

export default class UIGuide {
  public static defaults: IConfiguration = {
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

  public static highlight(opts: IHighlightOptions | Element | string) {
    this.unhighlight();

    const options: IHighlightOptions =
      opts instanceof Element || typeof opts === 'string'
        ? { element: opts }
        : opts;

    this.highlighting = queryElement(this.defaults, options);

    const events = options.events || {};

    return this.highlighting.promise
      .then((element) => {
        this.element = element;

        const emitElementQueried =
          events.onElementQueried === undefined
            ? noop
            : events.onElementQueried;
        return emitElementQueried(element);
      })
      .then(() => {
        return this.defaults.events.onElementQueried(this.element!);
      })
      .then(() => {
        document.body.classList.add(classname('highlighting'));
        this.element!.classList.add(classname('highlighted'));

        const clickable =
          options.clickable === undefined
            ? this.defaults.highlightOptions.clickable
            : options.clickable;

        if (clickable) {
          this.element!.classList.add(classname('clickable'));
        }

        const autofocus =
          options.autofocus === undefined
            ? this.defaults.highlightOptions.clickable
            : options.autofocus;

        if (autofocus) {
          this.element!.focus();
        }

        if (!this.peripherals.backdrop) {
          this.peripherals.backdrop = document.createElement('div');
          this.peripherals.backdrop.classList.add(classname('backdrop'));
        }

        if (!this.peripherals.box) {
          this.peripherals.box = document.createElement('div');
          this.peripherals.box.classList.add(classname('box'));
          this.peripherals.backdrop.append(this.peripherals.box);
        }

        const popup =
          options.popup === undefined
            ? this.defaults.highlightOptions.popup
            : options.popup;

        if (popup) {
          this.peripherals.popup = document.createElement('div');
          this.peripherals.popup.classList.add(classname('popup'));
          document.body.append(this.peripherals.popup);
          this.popper = new Popper(
            this.element!,
            this.peripherals.popup,
            typeof popup === 'boolean' ? undefined : popup,
          );
        }

        (this.element!.offsetParent || document.body).append(
          this.peripherals.backdrop,
        );

        const emitPeripheralsReady =
          events.onPerepheralsReady === undefined
            ? noop
            : events.onPerepheralsReady;

        return emitPeripheralsReady(
          this.peripherals as Pick<IPeripherals, 'popup'> &
            Required<Pick<IPeripherals, 'backdrop' | 'box'>>,
          this.element!,
        );
      })
      .then(() => {
        return this.defaults.events.onPerepheralsReady(
          this.peripherals as Pick<IPeripherals, 'popup'> &
            Required<Pick<IPeripherals, 'backdrop' | 'box'>>,
          this.element!,
        );
      })
      .then(() => {
        this.udpdatePeripheralsUntilUnhighlight();
      })
      .then(() => {
        return {
          element: this.element!,
          unhighlight: () => {
            this.unhighlight();
          },
        };
      })
      .finally(() => {
        delete this.highlighting;
      });
  }

  /**
   * Unhighlight the current highlighted element.
   */
  public static unhighlight() {
    document.body.classList.remove(classname('highlighting'));

    if (this.element) {
      this.element.classList.remove(classname('highlighted'));
      this.element.classList.remove(classname('clickable'));
    }

    if (this.highlighting) {
      this.highlighting.reject('Highlight operation terminated.');
    }

    if (this.popper) {
      this.popper.destroy();
      delete this.popper;
    }

    if (this.peripherals.popup) {
      this.peripherals.popup.remove();
    }

    if (this.peripherals.backdrop) {
      this.peripherals.backdrop.remove();
    }

    if (this.peripherals.box) {
      this.peripherals.box.remove();
    }

    delete this.peripherals.popup;
    delete this.peripherals.backdrop;
    delete this.peripherals.box;
    delete this.element;
    delete this.highlighting;
  }

  private static element?: HTMLElement;
  private static highlighting?: IDeferredPromise<HTMLElement>;
  private static peripherals: IPeripherals = {};
  private static popper?: Popper;

  private static udpdatePeripheralsUntilUnhighlight() {
    if (!this.element) return;

    const clientRect = this.element.getBoundingClientRect();

    requestAnimationFrame(() => {
      if (!this.peripherals.box) return;

      this.peripherals.box.style.left = clientRect.left + 'px';
      this.peripherals.box.style.top = clientRect.top + 'px';
      this.peripherals.box.style.width = clientRect.width + 'px';
      this.peripherals.box.style.height = clientRect.height + 'px';

      if (this.popper) {
        this.popper.update();
      }

      this.udpdatePeripheralsUntilUnhighlight();
    });
  }
}

function classname(name: keyof IConfiguration['classes']) {
  return (
    UIGuide.defaults.classNamePrefix + '-' + UIGuide.defaults.classes[name]
  );
}
