import Popper from 'popper.js';
import IConfiguration from './models/configuration';
import IEvents from './models/events';
import IHighlightOptions from './models/highlight-options';
import IPeripherals, { IOutputPeripherals } from './models/peripherals';
import classname from './utils/classname';
import { IDeferredPromise } from './utils/defer';
import findHighlightedOffsetParentChild from './utils/find-highlighted-offset-parent-child';
import isElementPositioned from './utils/is-element-positioned';
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
      'highlighted-container': 'highlighted-container',
      'highlighted-non-positioned': 'highlighted-non-positioned',
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
      forcelyMakeClickable: false,
      maxWait: Infinity,
      popup: true,
      popupReference: 'highlighted-element',
      updateDelay: 0,
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

    if (this.peripherals.backdrop) {
      // If backdrop element was reused,
      // just reset the `show` class then.
      this.peripherals.backdrop.classList.remove('show');
    }

    let reused = false;

    if (this.element) {
      // If there's still a highlighted element,
      // just clean up its classes then.
      this.element.classList.remove(classname(this.defaults, 'clickable'));
      this.element.classList.remove(classname(this.defaults, 'highlighted'));
      this.element.classList.remove(
        classname(this.defaults, 'highlighted-non-positioned'),
      );
      reused = true;
    }

    if (this.didForceClickable) {
      this.cleanUpHighlightedContainer();
    }

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

        if (!isElementPositioned(this.element!)) {
          this.element!.classList.add(
            classname(this.defaults, 'highlighted-non-positioned'),
          );
        }

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

        if (this.peripherals.popup) {
          // Prevent reusing of popup element.
          this.peripherals.popup.remove();
        }

        if (popup) {
          this.peripherals.popup = document.createElement('div');
          this.peripherals.popup.classList.add(
            classname(this.defaults, 'popup'),
          );

          document.body.append(this.peripherals.popup);

          if (this.popper) {
            // Prevent reusing of popper instance.
            this.popper.destroy();
          }

          const popupReference =
            options.popupReference === undefined
              ? this.defaults.highlightOptions.popupReference
              : options.popupReference;

          this.popper = new Popper(
            popupReference === 'highlight-box'
              ? this.peripherals.box
              : this.element!,
            this.peripherals.popup,
            typeof popup === 'boolean' ? undefined : popup,
          );
        }

        const offsetParent = (this.element!.offsetParent ||
          document.body) as HTMLElement;
        const isForcedToBeClickable =
          options.forcelyMakeClickable === undefined
            ? this.defaults.highlightOptions.forcelyMakeClickable
            : options.forcelyMakeClickable;

        if (isForcedToBeClickable) {
          const elementGrandParent = findHighlightedOffsetParentChild(
            offsetParent,
            this.element!,
          );

          elementGrandParent.classList.add(
            classname(this.defaults, 'highlighted-container'),
          );
        }

        this.didForceClickable = isForcedToBeClickable;
        offsetParent.append(this.peripherals.backdrop);

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
        this.peripherals.backdrop!.classList.add('show');
        if (this.peripherals.popup) {
          this.peripherals.popup.classList.add('show');
        }

        this.customPeripheralsUpdater = events.onUpdate;
        this.updateDelayUsed =
          options.updateDelay === undefined
            ? this.defaults.highlightOptions.updateDelay
            : options.updateDelay;

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
      .catch((error) => {
        this.unhighlight();
        return Promise.reject(error);
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
      this.element.classList.remove(classname(this.defaults, 'clickable'));
      this.element.classList.remove(classname(this.defaults, 'highlighted'));
      this.element.classList.remove(
        classname(this.defaults, 'highlighted-non-positioned'),
      );
      delete this.element;
    }

    if (this.didForceClickable) {
      this.cleanUpHighlightedContainer();
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
  private static didForceClickable: boolean = false;

  // Session variables

  private static customPeripheralsUpdater?: IEvents['onUpdate'];
  private static updateDelayUsed: number = 0;

  private static cleanUpHighlightedContainer() {
    const className = classname(this.defaults, 'highlighted-container');
    const highlightedContainer = document.querySelector('.' + className);

    if (highlightedContainer) {
      highlightedContainer.classList.remove(className);
    }
  }

  private static udpdatePeripheralsUntilUnhighlight() {
    if (!this.element) return;

    if (this.customPeripheralsUpdater) {
      requestAnimationFrame(() => {
        if (this.customPeripheralsUpdater) {
          this.customPeripheralsUpdater({
            element: this.element,
            peripherals: this.peripherals,
            popper: this.popper,
          });

          setTimeout(() => {
            this.udpdatePeripheralsUntilUnhighlight();
          }, this.updateDelayUsed);
        }
      });

      return;
    }

    if (!this.peripherals.backdrop) return;

    const backdropClientRect = this.peripherals.backdrop.getBoundingClientRect();
    const clientRect = this.element.getBoundingClientRect();

    requestAnimationFrame(() => {
      if (!this.peripherals.box) return;

      this.peripherals.box.style.left =
        clientRect.left - backdropClientRect.left + 'px';
      this.peripherals.box.style.top =
        clientRect.top - backdropClientRect.top + 'px';
      this.peripherals.box.style.width = clientRect.width + 'px';
      this.peripherals.box.style.height = clientRect.height + 'px';

      if (this.popper) {
        this.popper.update();
      }

      setTimeout(() => {
        this.udpdatePeripheralsUntilUnhighlight();
      }, this.updateDelayUsed);
    });
  }
}
