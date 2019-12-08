import View from './view';

export default class ViewHighlight {
  private backdrop: HTMLElement | null = null;
  private box: HTMLElement | null = null;

  public set(options: { parent: Element }) {
    if (!this.backdrop) {
      this.backdrop = document.createElement('div');
      View.toggleAttrs(this.backdrop, { 'highlight-backdrop': true });
    }

    if (!this.box) {
      this.box = document.createElement('div');
      View.toggleAttrs(this.box, { 'highlight-box': true });
      this.backdrop.appendChild(this.box);
    }

    options.parent.appendChild(this.backdrop);

    return {
      backdrop: this.backdrop,
      box: this.box,
    };
  }

  public unset() {
    this.backdrop?.parentNode?.removeChild(this.backdrop);
    this.backdrop = null;
    this.box?.parentNode?.removeChild(this.box);
    this.box = null;
  }

  public toggle(show = true) {
    if (this.backdrop) {
      View.toggleAttrs(this.backdrop, { show });
    }

    if (this.box) {
      View.toggleAttrs(this.box, { show });
    }
  }

  public sanitize() {
    this.toggle(false);
  }
}
