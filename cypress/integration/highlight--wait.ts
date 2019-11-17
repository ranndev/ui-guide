import UIGuide from '../../src/ui-guide';

describe('highlight - Wait', () => {
  let uiguide: typeof UIGuide;

  before(() => {
    cy.visit('highlight--wait.html').then((contentWindow) => {
      uiguide = contentWindow.__LIBRARY__['ui-guide'].default;
    });
  });

  it('should able to wait for the target element', () => {
    uiguide.highlight('[data-testid="target"]');
    cy.get('[uig-highlight-backdrop][uig-show]');
  });
});
