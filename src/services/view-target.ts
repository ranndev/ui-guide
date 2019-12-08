import View from './view';

export default class ViewTarget {
  private element: HTMLElement | null = null;

  public sanitize() {
    if (this.element) {
      View.toggleAttrs(this.element, {
        clickable: false,
        'non-positioned': false,
        target: false,
      });
    }
  }

  public set(
    element: HTMLElement,
    options: { positioned: boolean; clickable: boolean; focus: boolean },
  ) {
    this.element = element;

    View.toggleAttrs(element, {
      clickable: options.clickable,
      'non-positioned': !options.positioned,
      target: true,
    });

    if (options.focus) {
      element.focus();
    }
  }

  public unset() {
    this.sanitize();
    this.element = null;
  }
}
