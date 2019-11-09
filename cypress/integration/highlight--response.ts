import UIGuide from '../../src/ui-guide';

describe('highlight - Response', () => {
  let uiguide: typeof UIGuide;

  before(() => {
    cy.visit('/').then((contentWindow) => {
      uiguide = contentWindow.__LIBRARY__['ui-guide'].default;
    });
  });

  it('should resolve the highlighted element and unhighlight function', () => {
    const promise = uiguide.highlight('[data-testid="target-1"]');

    expect(promise).to.be.a('promise');

    cy.get('[uig-elements-backdrop][uig-markers-show]')
      .then(() => promise)
      .then((highlighted) => {
        expect(highlighted.element).to.have.attr('data-testid', 'target-1');
        expect(highlighted.unhighlight).to.be.a('function');
      });
  });
});
