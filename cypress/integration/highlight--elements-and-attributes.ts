import UIGuide from '../../src/ui-guide';

describe('highlight - Elements and Attributes', () => {
  let uiguide: typeof UIGuide;

  before(() => {
    cy.visit('/').then((contentWindow) => {
      uiguide = contentWindow.__LIBRARY__['ui-guide'].default;
    });
  });

  it('should add all the required attributes and elements', () => {
    uiguide.highlight('[data-testid="target-1"]');

    // Body
    cy.get('body').should('have.attr', 'uig-on');

    // Target
    cy.get('[data-testid="target-1"]').then(($target) => {
      expect($target).to.have.attr('uig-target');
      expect($target).to.have.attr('uig-clickable');
      expect($target).to.have.attr('uig-non-positioned');
    });

    // Backdrop
    cy.get('[uig-highlight-backdrop][uig-show]').should(
      'have.attr',
      'uig-show',
    );

    // Box
    cy.get('[uig-highlight-box][uig-show]')
      .as('box')
      .then(($box) => {
        expect($box)
          .to.have.css('left')
          .and.match(/^[0-9.]+px$/);
        expect($box)
          .to.have.css('top')
          .and.match(/^[0-9.]+px$/);
        expect($box)
          .to.have.css('width')
          .and.match(/^[0-9.]+px$/);
        expect($box)
          .to.have.css('height')
          .and.match(/^[0-9.]+px$/);
      });
    cy.get('@box')
      .parent()
      .should('have.attr', 'uig-highlight-backdrop');
  });
});
