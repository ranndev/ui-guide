import UIGuide from '../../src/ui-guide';

describe('configure - attrPrefix', () => {
  let uiguide: typeof UIGuide;

  before(() => {
    cy.visit('/').then((contentWindow) => {
      uiguide = contentWindow.__LIBRARY__['ui-guide'].default;
    });
  });

  it('should able to change the attributes name prefix', () => {
    uiguide.configure({ attrPrefix: 'foo' });
    uiguide.highlight('[data-testid="target-1"]');

    // Body
    cy.get('body').should('have.attr', 'foo-markers-highlighting');

    // Target
    cy.get('[data-testid="target-1"]').then(($target) => {
      expect($target).to.have.attr('foo-elements-target');
      expect($target).to.have.attr('foo-markers-clickable');
      expect($target).to.have.attr('foo-markers-non-positioned');
    });

    // Backdrop
    cy.get('[foo-elements-backdrop]').should('have.attr', 'foo-markers-show');

    // Box
    cy.get('[foo-elements-box]');
  });
});
