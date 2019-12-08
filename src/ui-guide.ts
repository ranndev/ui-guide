import IHighlightOptions from './models/highlight-options';

// Services

import Settings from './services/settings';
import View from './services/view';
import ViewUpdateScheduler from './services/view-update-scheduler';

// Utilities

import Popper from 'popper.js';
import { IDeferredPromise } from './utils/defer';
import isElementPositioned from './utils/is-element-positioned';
import queryWaitElement from './utils/query-wait-element';

export interface IHighlighted {
  element: HTMLElement;
  /**
   * Invokes the `UIGuide.clear` internally.
   */
  unhighlight: () => void;
}

export class UIGuide {
  private $settings = new Settings();
  private $view = new View();
  private $operation: IDeferredPromise<HTMLElement> | null = null;
  private $highlightVUS: ViewUpdateScheduler<{
    target: HTMLElement;
    backdrop: HTMLElement;
    box: HTMLElement;
  }> = new ViewUpdateScheduler();
  private $popupVUS: ViewUpdateScheduler<{
    element: HTMLElement;
    popper: Popper;
  }> = new ViewUpdateScheduler();

  /**
   * Configure the global highlight settings.
   *
   * **Important**: *Updating the configuration while there's an on going*
   * *highlight operation is prohibited.*
   *
   * @param config New configuration.
   */
  public configure(configuration: Parameters<Settings['update']>[number]) {
    if (this.$operation) {
      throw new Error(
        __DEV__
          ? /* istanbul ignore next */
            'Updating of configuration is forbidden while there is a pending highlight operation.'
          : 'Highlight operation still pending.',
      );
    }

    this.$settings.update(configuration);
  }

  /**
   * Highlight an element from the page.
   *
   * **Tip:** *It is possible to highlight a new element without*
   * *`unhighlight`ing the current highlighted. Just make sure to wait your*
   * *first highlight operation before you can highlight a new one, otherwise*
   * *it will throw an error.*
   *
   * *Example:*
   * ```javascript
   * UIGuide.highlight('#target-1').then(() => {
   *   UIGuide.highlight('#target-2')
   * })
   * ```
   *
   * @param opts Target element or highlight options for advanced highlighting.
   */
  public highlight(
    opts: IHighlightOptions | Element | string,
  ): Promise<IHighlighted> {
    if (this.$operation) {
      throw new Error(
        __DEV__
          ? /* istanbul ignore next */
            'UIGuide currently has a pending highlight operation.\n' +
            'Make sure that the operation is finished before you highlight again.'
          : 'Highlight operation still pending.',
      );
    }

    this.$view.highlight.sanitize();
    this.$view.target.sanitize();

    const options =
      opts instanceof Element || typeof opts === 'string'
        ? ({ target: opts } as IHighlightOptions)
        : opts;
    const events = options.events || {};

    this.$operation = queryWaitElement(this.$settings.data, options);

    return this.$operation.promise
      .then((target) => {
        this.$view.toggle();
        this.$view.target.set(target, {
          clickable:
            options.clickable ?? this.$settings.data.highlightOptions.clickable,
          focus:
            options.autofocus ?? this.$settings.data.highlightOptions.autofocus,
          positioned: isElementPositioned(target),
        });

        events.onTargetFound?.(target);
        this.$settings.data.events.onTargetFound?.(target);

        const highlight = this.$view.highlight.set({
          parent: target.offsetParent || document.body,
        });

        events.onHighlightReady?.(highlight);
        this.$settings.data.events.onHighlightReady?.(highlight);
        this.$view.highlight.toggle();
        this.$highlightVUS.schedUpdate(
          events.onHighlightUpdate ??
            this.$settings.data.events.onHighlightUpdate,
          { ...highlight, target },
          options.highlightUpdateDelay ??
            this.$settings.data.highlightOptions.highlightUpdateDelay,
        );

        const popper =
          options.popper ?? this.$settings.data.highlightOptions.popper;

        this.$view.popup.unset();

        if (popper) {
          const popup = this.$view.popup.set({
            options: typeof popper === 'boolean' ? undefined : popper,
            ref:
              (options.popperRef ??
                this.$settings.data.highlightOptions.popperRef) ===
              'highlight-box'
                ? highlight.box
                : target,
          });

          events.onPopupReady?.(popup);
          this.$settings.data.events.onPopupReady?.(popup);
          this.$view.popup.toggle();
          this.$popupVUS.schedUpdate(
            events.onPopupUpdate ?? this.$settings.data.events.onPopupUpdate,
            popup,
            options.popupUpdateDelay ??
              this.$settings.data.highlightOptions.highlightUpdateDelay,
          );
        }

        return {
          element: target,
          unhighlight: () => {
            this.clear();
          },
        };
      })
      .finally(() => {
        this.$operation = null;
      });
  }

  /**
   * Unhighlight the current highlighted element.
   *
   * You usually invoke this function after you're done highlighting all your
   * target elements.
   *
   * *Example:*
   * ```typescript
   * UIGuide.highlight('#first-target').then(() => {
   *   UIGuide.highlight('#final-target').then((highlighted) => {
   *     UIGuide.clear() // or highlighted.unhighlight()
   *   })
   * })
   * ```
   */
  public clear() {
    this.$highlightVUS.cancelCurrentScheduledUpdate();
    this.$popupVUS.cancelCurrentScheduledUpdate();
    this.$view.toggle(false);
    this.$view.popup.unset();
    this.$view.highlight.unset();
    this.$view.target.unset();
  }
}

const uiguide = new UIGuide();
export default uiguide;
