import UIGuide from '../../src/ui-guide';

describe('highlight - Prequeried Element', () => {
  let uiguide: typeof UIGuide;

  before(() => {
    cy.visit('/').then((contentWindow) => {
      uiguide = contentWindow.__LIBRARY__['ui-guide'].default;
    });
  });

  it('should invoke the event listeners', () => {
    cy.document().then((document) => {
      const target = document.querySelector(
        '[data-testid="target-1"]',
      ) as Element;

      uiguide.highlight(target);
    });

    cy.get('[uig-highlight-backdrop][uig-show]');
  });
});
