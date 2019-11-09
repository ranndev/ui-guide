import UIGuide from '../../src/ui-guide';

describe("configure - highlight's autofocus", () => {
  let uiguide: typeof UIGuide;

  before(() => {
    cy.visit('/').then((contentWindow) => {
      uiguide = contentWindow.__LIBRARY__['ui-guide'].default;
    });
  });

  it('should able to set the default "autofocus" highlight configuration', () => {
    uiguide.configure({
      highlightOptions: {
        autofocus: false,
      },
    });

    uiguide.highlight('[data-testid="target-1"]');
    cy.get('[uig-elements-target]').should('not.have.focus');
  });
});
