import UIGuide from '../../src/ui-guide';

describe('unhighlight', () => {
  let uiguide: typeof UIGuide;
  let unhighlight: typeof UIGuide['clear'];

  before(() => {
    cy.visit('/').then((contentWindow) => {
      uiguide = contentWindow.__LIBRARY__['ui-guide'].default;
    });
  });

  before(() => {
    const promise = uiguide.highlight('[data-testid="target-1"]');

    cy.get('[uig-highlight-backdrop][uig-show]')
      .then(() => promise)
      .then((highlighted) => {
        unhighlight = highlighted.unhighlight;
      });
  });

  it('should cleanup the added elements and attributes', () => {
    unhighlight();

    // Body
    cy.get('body').should('not.have.attr', 'uig-on');

    // Target
    cy.get('[data-testid="target-1"]').then(($target) => {
      expect($target).not.to.have.attr('uig-target');
      expect($target).not.to.have.attr('uig-clickable');
      expect($target).not.to.have.attr('uig-non-positioned');
    });

    // Backdrop
    cy.get('[uig-highlight-backdrop]').should('not.exist');

    // Box
    cy.get('[uig-highlight-box]').should('not.exist');
  });
});
