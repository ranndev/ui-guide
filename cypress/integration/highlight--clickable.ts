import UIGuide from '../../src/ui-guide';

describe('highlight - clickable', () => {
  let uiguide: typeof UIGuide;

  before(() => {
    cy.visit('/').then((contentWindow) => {
      uiguide = contentWindow.__LIBRARY__['ui-guide'].default;
    });
  });

  it('should resolve the highlighted element and unhighlight function', () => {
    uiguide.highlight('[data-testid="target-1"]');
    cy.get('[uig-elements-target]').click();
  });
});
