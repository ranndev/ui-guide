import UIGuide from '../../src/ui-guide';

describe('configure - autofocus', () => {
  let uiguide: typeof UIGuide;

  before(() => {
    cy.visit('/').then((contentWindow) => {
      uiguide = contentWindow.__LIBRARY__['ui-guide'].default;
    });
  });

  it('should able to disable the default autofocus ability', () => {
    uiguide.configure({ highlightOptions: { autofocus: false } });
    uiguide.highlight('[data-testid="target-1"]');

    cy.get('[uig-target]').should('not.have.focus');
  });
});
