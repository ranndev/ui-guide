import IHighlightOptions from './models/highlight-options';

// Services

import Config from './services/config';
import UI from './services/ui';
import UIUpdateScheduler from './services/ui-update-scheduler';

// Utilities

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
  private $config = new Config();
  private $ui = new UI();
  private $updateScheduler = new UIUpdateScheduler(this.$ui);
  private $operation: IDeferredPromise<HTMLElement> | null = null;

  /**
   * Configure the global highlight settings.
   *
   * **Important**: *Updating the configuration while there's an on going*
   * *highlight operation is prohibited.*
   *
   * @param config New configuration.
   */
  public configure(configuration: Parameters<Config['update']>[number]) {
    if (this.$operation) {
      throw new Error(
        __DEV__
          ? /* istanbul ignore next */
            'Updating of configuration is forbidden while there is a pending highlight operation.'
          : 'Highlight operation still pending.',
      );
    }

    this.$config.update(configuration);
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

    this.$ui.sanitizeHighlight();
    this.$ui.sanitizeTarget();

    const options =
      opts instanceof Element || typeof opts === 'string'
        ? ({ target: opts } as IHighlightOptions)
        : opts;
    const events = options.events || {};

    this.$operation = queryWaitElement(this.$config.data, options);

    return this.$operation.promise
      .then((target) => {
        this.$ui.toggleBodyAttr();
        this.$ui.setTarget(target, {
          clickable:
            options.clickable ?? this.$config.data.highlightOptions.clickable,
          focus:
            options.autofocus ?? this.$config.data.highlightOptions.autofocus,
          positioned: isElementPositioned(target),
        });

        events.onTargetFound?.(target);
        this.$config.data.events.onTargetFound?.(target);

        this.$ui.setHightlight({
          parent: target.offsetParent || document.body,
        });

        const popper =
          options.popper ?? this.$config.data.highlightOptions.popper;

        this.$ui.unsetPopup();

        if (popper) {
          this.$ui.setPopup({
            popperOptions: typeof popper === 'boolean' ? undefined : popper,
            popperRef:
              options.popperRef ?? this.$config.data.highlightOptions.popperRef,
          });
        }

        const requiredElements = this.$ui.getUpdateSchedulerRequiredElements();
        events.onElementsReady?.(requiredElements);
        this.$config.data.events.onElementsReady?.(requiredElements);

        this.$ui.toggleHightlight();
        this.$ui.togglePopup();
        this.$updateScheduler.schedUpdate(
          events.onHighlightUpdate ??
            this.$config.data.events.onHighlightUpdate,
          options.highlightUpdateDelay ??
            this.$config.data.highlightOptions.highlightUpdateDelay,
        );

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
    this.$updateScheduler.cancelCurrentScheduledUpdate();
    this.$ui.toggleBodyAttr(false);
    this.$ui.unsetPopup();
    this.$ui.unsetHighlight();
    this.$ui.unsetTarget();
  }
}

const uiguide = new UIGuide();
export default uiguide;
