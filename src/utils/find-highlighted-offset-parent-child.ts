export default function findHighlightedOffsetParentChild(
  offsetParent: HTMLElement,
  element: HTMLElement,
): HTMLElement {
  const children = Array.from(offsetParent.children);

  for (const child of children) {
    if (child.contains(element)) {
      return child as HTMLElement;
    }
  }

  throw new Error('Element is not child of offset parent children');
}
