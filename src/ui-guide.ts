import Popper from 'popper.js';
import IConfiguration from './models/configuration';
import IHighlightOptions from './models/highlight-options';
import IPeripherals, { IOutputPeripherals } from './models/peripherals';
import classname from './utils/classname';
import { IDeferredPromise } from './utils/defer';
import noop from './utils/noop';
import queryWaitElement from './utils/query-wait-element';

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

  /**
   * Highlight an element from the page.
   */
  public static highlight(opts: IHighlightOptions | Element | string) {
    if (this.highlighting) {
      throw new Error(
        'UIGuide currently has a pending highlight operation.\n' +
          'Make sure to await the highlight operation properly before you highlight another element.',
      );
    }

    const reused = !!this.element;
    const options: IHighlightOptions =
      opts instanceof Element || typeof opts === 'string'
        ? { element: opts }
        : opts;

    this.highlighting = queryWaitElement(this.defaults, options);

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
        document.body.classList.add(classname(this.defaults, 'highlighting'));
        this.element!.classList.add(classname(this.defaults, 'highlighted'));

        const clickable =
          options.clickable === undefined
            ? this.defaults.highlightOptions.clickable
            : options.clickable;

        if (clickable) {
          this.element!.classList.add(classname(this.defaults, 'clickable'));
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
          this.peripherals.backdrop.classList.add(
            classname(this.defaults, 'backdrop'),
          );
        }

        if (!this.peripherals.box) {
          this.peripherals.box = document.createElement('div');
          this.peripherals.box.classList.add(classname(this.defaults, 'box'));
          this.peripherals.backdrop.append(this.peripherals.box);
        }

        const popup =
          options.popup === undefined
            ? this.defaults.highlightOptions.popup
            : options.popup;

        if (popup) {
          if (this.peripherals.popup) {
            // Prevent reusing of popup element.
            this.peripherals.popup.remove();
          }

          this.peripherals.popup = document.createElement('div');
          this.peripherals.popup.classList.add(
            classname(this.defaults, 'popup'),
          );

          document.body.append(this.peripherals.popup);

          if (this.popper) {
            // Prevent reusing of popper instance.
            this.popper.destroy();
          }

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
          this.peripherals as IOutputPeripherals,
          this.element!,
        );
      })
      .then(() => {
        return this.defaults.events.onPerepheralsReady(
          this.peripherals as IOutputPeripherals,
          this.element!,
        );
      })
      .then(() => {
        if (!reused) {
          this.udpdatePeripheralsUntilUnhighlight();
        }
      })
      .then(() => {
        return {
          element: this.element!,
          unhighlight: () => {
            this.unhighlight();
          },
        };
      })
      .catch(() => {
        this.unhighlight();
      })
      .finally(() => {
        delete this.highlighting;
      });
  }

  /**
   * Unhighlight the current highlighted element if available.
   */
  public static unhighlight() {
    document.body.classList.remove(classname(this.defaults, 'highlighting'));

    if (this.highlighting) {
      this.highlighting.reject('Highlight operation terminated.');
      delete this.highlighting;
    }

    if (this.element) {
      this.element.classList.remove(classname(this.defaults, 'highlighted'));
      this.element.classList.remove(classname(this.defaults, 'clickable'));
      delete this.element;
    }

    if (this.popper) {
      this.popper.destroy();
      delete this.popper;
    }

    if (this.peripherals.popup) {
      this.peripherals.popup.remove();
      delete this.peripherals.popup;
    }

    if (this.peripherals.backdrop) {
      this.peripherals.backdrop.remove();
      delete this.peripherals.backdrop;
    }

    if (this.peripherals.box) {
      this.peripherals.box.remove();
      delete this.peripherals.box;
    }
  }

  private static element?: HTMLElement;
  private static highlighting?: IDeferredPromise<HTMLElement>;
  private static peripherals: IPeripherals = {};
  private static popper?: Popper;

  private static udpdatePeripheralsUntilUnhighlight() {
    if (!this.element) return;

    const offsetParent = this.element.offsetParent;
    const clientRect =
      !offsetParent || offsetParent === document.body
        ? this.element.getBoundingClientRect()
        : {
            height: this.element.offsetHeight,
            left: this.element.offsetLeft,
            top: this.element.offsetTop,
            width: this.element.offsetWidth,
          };

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
