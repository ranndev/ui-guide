import ViewHighlight from './view-highlight';
import ViewPopup from './view-popup';
import ViewTarget from './view-target';

export default class View {
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
  public static toggleAttrs(
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

  private static readonly attrPrefix = 'uig';
  public readonly target = new ViewTarget();
  public readonly highlight = new ViewHighlight();
  public readonly popup = new ViewPopup();

  public toggle(on = true) {
    View.toggleAttrs(document.body, { on });
  }
}
