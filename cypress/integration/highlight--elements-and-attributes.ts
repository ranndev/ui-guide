import UIGuide from '../../src/ui-guide';

describe('highlight - Elements and Attributes', () => {
  let uiguide: typeof UIGuide;

  before(() => {
    cy.visit('/').then((contentWindow) => {
      uiguide = contentWindow.__LIBRARY__['ui-guide'].default;
    });
  });

  before(() => {
    // tslint:disable-next-line: no-floating-promises
    uiguide.highlight('[data-testid="target-1"]');
  });

  it('should add all the required attributes and elements', () => {
    // Body
    cy.get('body').should('have.attr', 'uig-markers-highlighting');

    // Target
    cy.get('[data-testid="target-1"]').then(($target) => {
      expect($target).to.have.attr('uig-elements-target');
      expect($target).to.have.attr('uig-markers-clickable');
      expect($target).to.have.attr('uig-markers-non-positioned');
    });

    // Backdrop
    cy.get('[uig-elements-backdrop]').should('have.attr', 'uig-markers-show');

    // Box
    cy.get('[uig-elements-box]').then(($box) => {
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
  });
});
