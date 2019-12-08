import Popper, { PopperOptions } from 'popper.js';
import View from './view';

export default class ViewPopup {
  private element: HTMLElement | null = null;
  private popper: Popper | null = null;

  public set(options: { ref: HTMLElement; options?: PopperOptions }) {
    this.element = document.createElement('div');
    View.toggleAttrs(this.element, { popup: true });
    document.body.appendChild(this.element);

    this.popper?.destroy();
    this.popper = new Popper(options.ref, this.element, options.options);

    return { element: this.element, popper: this.popper };
  }

  public unset() {
    this.popper?.destroy();
    this.popper = null;
    this.element?.parentNode?.removeChild(this.element);
    this.element = null;
  }

  public toggle(show = true) {
    if (this.element) {
      View.toggleAttrs(this.element, { show });
    }
  }
}
