import UIGuide, { IHighlighted } from '../../src/ui-guide';

describe('highlight - Continuous', () => {
  let uiguide: typeof UIGuide;
  let firstHighlightPromise: Promise<IHighlighted>;

  before(() => {
    cy.visit('/').then((contentWindow) => {
      uiguide = contentWindow.__LIBRARY__['ui-guide'].default;
    });
  });

  it('should throw when the first highlight is not finished yet', () => {
    firstHighlightPromise = uiguide.highlight('[data-testid="target-1"]');

    expect(() => {
      uiguide.highlight('[data-testid="target-2"]');
    }).to.throw();
  });

  it('should cleanup the added attributes on previous target and set to current target', () => {
    cy.get('[uig-highlight-backdrop][uig-show]').then(
      () => firstHighlightPromise,
    );

    const secondHighlightPromise = uiguide.highlight(
      '[data-testid="target-2"]',
    );

    cy.get('[uig-highlight-backdrop][uig-show]').then(
      () => secondHighlightPromise,
    );

    // Target 1
    cy.get('[data-testid="target-1"]').then(($target) => {
      expect($target).not.to.have.attr('uig-target');
      expect($target).not.to.have.attr('uig-clickable');
      expect($target).not.to.have.attr('uig-non-positioned');
    });

    // Target 2
    cy.get('[data-testid="target-2"]').then(($target) => {
      expect($target).to.have.attr('uig-target');
      expect($target).to.have.attr('uig-clickable');
      expect($target).to.have.attr('uig-non-positioned');
    });
  });
});
