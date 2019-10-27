import UIGuide from '../../src/ui-guide';

describe('unhighlight', () => {
  let uiguide: typeof UIGuide;
  let unhighlight: typeof UIGuide['unhighlight'];

  before(() => {
    cy.visit('/').then((contentWindow) => {
      uiguide = contentWindow.__LIBRARY__['ui-guide'].default;
    });
  });

  before(() => {
    const promise = uiguide.highlight('[data-testid="target-1"]');

    cy.get('[uig-elements-backdrop][uig-markers-show]')
      .then(() => promise)
      .then((highlighted) => {
        unhighlight = highlighted.unhighlight;
      });
  });

  it('should cleanup the added elements and attributes', () => {
    unhighlight();

    // Body
    cy.get('body').should('not.have.attr', 'uig-markers-highlighting');

    // Target
    cy.get('[data-testid="target-1"]').then(($target) => {
      expect($target).not.to.have.attr('uig-elements-target');
      expect($target).not.to.have.attr('uig-markers-clickable');
      expect($target).not.to.have.attr('uig-markers-non-positioned');
    });

    // Backdrop
    cy.get('[uig-elements-backdrop]').should('not.exist');

    // Box
    cy.get('[uig-elements-box]').should('not.exist');
  });
});
