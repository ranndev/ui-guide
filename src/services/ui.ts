import Popper, { PopperOptions } from 'popper.js';
import { IRequiredElements } from './ui-update-scheduler';

export default class UI {
  private readonly attrPrefix = 'uig';
  private highlight: { backdrop?: HTMLElement; box?: HTMLElement } = {};
  private popper?: Popper;
  private popup?: HTMLElement;
  private target?: HTMLElement;

  public toggleBodyAttr(on = true) {
    this.toggleAttrs(document.body, { on });
  }

  public sanitizeTarget() {
    if (this.target) {
      this.toggleAttrs(this.target, {
        clickable: false,
        'non-positioned': false,
        target: false,
      });
    }
  }

  public setTarget(
    target: HTMLElement,
    options: { positioned: boolean; clickable: boolean; focus: boolean },
  ) {
    this.target = target;

    this.toggleAttrs(target, {
      clickable: options.clickable,
      'non-positioned': !options.positioned,
      target: true,
    });

    if (options.focus) {
      target.focus();
    }
  }

  public unsetTarget() {
    this.sanitizeTarget();
    delete this.target;
  }

  public sanitizeHighlight() {
    if (this.highlight.backdrop) {
      this.toggleAttrs(this.highlight.backdrop, { show: false });
    }

    if (this.highlight.box) {
      this.toggleAttrs(this.highlight.box, { show: false });
    }
  }

  public setHightlight(options: { parent: Element }) {
    if (!this.highlight.backdrop) {
      this.highlight.backdrop = document.createElement('div');
      this.toggleAttrs(this.highlight.backdrop, { 'highlight-backdrop': true });
    }

    if (!this.highlight.box) {
      this.highlight.box = document.createElement('div');
      this.toggleAttrs(this.highlight.box, { 'highlight-box': true });
      this.highlight.backdrop.appendChild(this.highlight.box);
    }

    options.parent.appendChild(this.highlight.backdrop);
  }

  public unsetHighlight() {
    this.highlight.backdrop?.parentNode?.removeChild(this.highlight.backdrop);
    delete this.highlight.backdrop;
    this.highlight.box?.parentNode?.removeChild(this.highlight.box);
    delete this.highlight.box;
  }

  public toggleHightlight(show = true) {
    if (this.highlight.backdrop) {
      this.toggleAttrs(this.highlight.backdrop, { show });
    }

    if (this.highlight.box) {
      this.toggleAttrs(this.highlight.box, { show });
    }
  }

  public setPopup(options: {
    popperRef: 'highlight-box' | 'highlight-target';
    popperOptions?: PopperOptions;
  }) {
    this.popup = document.createElement('div');
    this.toggleAttrs(this.popup, { popup: true });

    const popperRef =
      options.popperRef === 'highlight-box' ? this.highlight.box : this.target;

    if (!popperRef) {
      throw new Error(
        __DEV__
          ? /* istanbul ignore next */
            `Popper reference is set to '${
              options.popperRef
            }' but highlight\'s ${
              options.popperRef === 'highlight-box' ? 'box' : 'target'
            } element is not available.`
          : 'Popper reference not available.',
      );
    }

    document.body.appendChild(this.popup);

    this.popper?.destroy();
    this.popper = new Popper(popperRef, this.popup, options.popperOptions);
  }

  public unsetPopup() {
    this.popper?.destroy();
    delete this.popper;
    this.popup?.parentNode?.removeChild(this.popup);
    delete this.popup;
  }

  public togglePopup(show = true) {
    if (this.popup) {
      this.toggleAttrs(this.popup, { show });
    }
  }

  public getUpdateSchedulerRequiredElements(): IRequiredElements {
    if (!this.target) {
      throw new Error(
        __DEV__
          ? /* istanbul ignore next */
            'Unable to get the required elements of UpdateScheduler.\n' +
            'Target element currently not available.'
          : 'Target element not available.',
      );
    }

    if (!this.highlight.backdrop || !this.highlight.box) {
      throw new Error(
        __DEV__
          ? /* istanbul ignore next */
            'Unable to get the required elements of UpdateScheduler.\n' +
            'Highlight elements currently not available.'
          : 'Highlight elements not available.',
      );
    }

    return {
      highlight: { backdrop: this.highlight.backdrop, box: this.highlight.box },
      popper: this.popper,
      popup: this.popup,
      target: this.target,
    };
  }

  /**
   * Toggles multiple attributes on element.
   *
   * **Usage:**
   * ```typescript
   * toggleAttrs(element, {
   *   'data-show': true, // Sets a data-show attribute to element
   *   'data-hide': false, // Removes data-hide attribute to element
   * })
   * ```
   */
  private toggleAttrs(
    element: HTMLElement,
    attrsObject: { [name: string]: boolean },
  ) {
    for (const attr in attrsObject) {
      if (attrsObject.hasOwnProperty(attr)) {
        const attrName = this.attrPrefix + '-' + attr;

        if (attrsObject[attr]) {
          element.setAttribute(attrName, '');
        } else {
          element.removeAttribute(attrName);
        }
      }
    }
  }
}
