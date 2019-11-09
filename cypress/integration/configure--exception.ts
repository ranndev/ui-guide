import UIGuide from '../../src/ui-guide';

describe('configure - Exception', () => {
  let uiguide: typeof UIGuide;

  before(() => {
    cy.visit('/').then((contentWindow) => {
      uiguide = contentWindow.__LIBRARY__['ui-guide'].default;
    });
  });

  it('should able to set the global event listeners', () => {
    uiguide.highlight('[data-testid="target-1"]');

    expect(() => {
      uiguide.configure({});
    }).to.throw();
  });
});
