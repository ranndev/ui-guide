import UIGuide from '../../src/ui-guide';

describe("configure - highlight's clickable", () => {
  let uiguide: typeof UIGuide;

  before(() => {
    cy.visit('/').then((contentWindow) => {
      uiguide = contentWindow.__LIBRARY__['ui-guide'].default;
    });
  });

  it('should able to set the default "autofocus" highlight configuration', () => {
    uiguide.configure({
      highlightOptions: {
        clickable: false,
      },
    });

    uiguide.highlight('[data-testid="target-1"]');
    cy.get('[uig-elements-target]').should('have.css', 'pointer-events', 'none');
  });
});
