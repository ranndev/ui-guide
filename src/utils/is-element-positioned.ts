export default function isElementPositioned(element: Element) {
  if (element.firstElementChild) {
    return (element.firstElementChild as HTMLElement).offsetParent === element;
  }

  const style = getComputedStyle(element);
  if (['absolute', 'fixed', 'relative'].includes(style.position || '')) {
    return true;
  }

  const tempElement = document.createElement('span');
  tempElement.style.visibility = 'hidden';
  element.append(tempElement);

  const isPositioned = tempElement.offsetParent === element;
  tempElement.remove();

  return isPositioned;
}
