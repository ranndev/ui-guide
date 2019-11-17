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
  unhighlight: () => void;
}

const config = new Config();
const ui = new UI();
const updateScheduler = new UIUpdateScheduler(ui);

let operation: IDeferredPromise<HTMLElement> | null = null;

export default class UIGuide {
  /**
   * Configure the default highlight settings.
   * @param config New configuration.
   */
  public static configure(configuration: Parameters<Config['update']>[number]) {
    if (operation) {
      throw new Error(
        'Updating of configuration is forbidden while there is a pending highlight operation.',
      );
    }

    config.update(configuration);
  }

  /**
   * Highlight an element from the page.
   * @param opts Highlight options.
   */
  public static highlight(
    opts: IHighlightOptions | Element | string,
  ): Promise<IHighlighted> {
    if (operation) {
      throw new Error(
        __DEV__
          ? 'UIGuide currently has a pending highlight operation.\n' +
            'Make sure that the operation is finished before you highlight again.'
          : 'Highlight operation still pending.',
      );
    }

    ui.sanitizeHighlight();
    ui.sanitizeTarget();

    const options =
      opts instanceof Element || typeof opts === 'string'
        ? ({ element: opts } as IHighlightOptions)
        : opts;
    const events = options.events || {};

    operation = queryWaitElement(config.data, options);

    return operation.promise
      .then((target) => {
        ui.toggleBodyAttr();
        ui.setTarget(target, {
          clickable:
            options.clickable ?? config.data.highlightOptions.clickable,
          focus: options.autofocus ?? config.data.highlightOptions.autofocus,
          positioned: isElementPositioned(target),
        });

        events.onTargetFound?.(target);
        config.data.events.onTargetFound?.(target);

        ui.setHightlight({
          parent: target.offsetParent || document.body,
        });

        const popper = options.popper ?? config.data.highlightOptions.popper;

        if (popper) {
          ui.setPopup({
            popperOptions: typeof popper === 'boolean' ? undefined : popper,
            popperRef:
              options.popperRef ?? config.data.highlightOptions.popperRef,
          });
        }

        const requiredElements = ui.getUpdateSchedulerRequiredElements();
        events.onElementsReady?.(requiredElements);
        config.data.events.onElementsReady?.(requiredElements);

        ui.toggleHightlight();
        ui.togglePopup();
        updateScheduler.scheduleUpdate(
          events.onHighlightUpdate ?? config.data.events.onHighlightUpdate,
          options.highlightUpdateDelay ??
            config.data.highlightOptions.highlightUpdateDelay,
        );

        return {
          element: target,
          unhighlight: () => {
            UIGuide.unhighlight();
          },
        };
      })
      .finally(() => {
        operation = null;
      });
  }

  /**
   * Unhighlight the current highlighted element.
   */
  public static unhighlight() {
    updateScheduler.cancelCurrentScheduledUpdate();
    ui.toggleBodyAttr(false);
    ui.unsetPopup();
    ui.unsetHighlight();
    ui.unsetTarget();
  }
}
