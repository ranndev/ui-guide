export default function isElementPositioned(element: Element) {
  // 1st check.
  // Using the element's computed style position.

  if (window.getComputedStyle(element).position !== 'static') {
    return true;
  }

  // 2nd check.
  // Using the element's first child.

  if (element.firstElementChild instanceof HTMLElement) {
    return element.firstElementChild.offsetParent === element;
  }

  // 3rd check.
  // Mimicking the 2nd check by appending a temporary element.

  const tempElement = document.createElement('span');
  tempElement.style.visibility = 'hidden';
  element.append(tempElement);
  const isPositioned = tempElement.offsetParent === element;
  tempElement.remove();
  return isPositioned;
}
