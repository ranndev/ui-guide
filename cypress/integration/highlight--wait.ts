import UIGuide from '../../src/ui-guide';

describe('highlight - Wait', () => {
  let uiguide: typeof UIGuide;

  before(() => {
    cy.visit('highlight--wait.html').then((contentWindow) => {
      uiguide = contentWindow.__LIBRARY__['ui-guide'].default;
    });
  });

  it('should able to wait for the target element', () => {
    // tslint:disable-next-line: no-floating-promises
    uiguide.highlight('[data-testid="target"]');
    cy.get('[uig-elements-backdrop][uig-markers-show]');
  });
});
