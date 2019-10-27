import { IHighlighted } from '../../src/models/states';
import UIGuide from '../../src/ui-guide';

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
      // tslint:disable-next-line: no-floating-promises
      uiguide.highlight('[data-testid="target-2"]');
    }).to.throw();
  });

  it('should cleanup the added attributes on previous target and set to current target', () => {
    cy.get('[uig-elements-backdrop][uig-markers-show]').then(() => firstHighlightPromise);

    const secondHighlightPromise = uiguide.highlight('[data-testid="target-2"]');

    cy.get('[uig-elements-backdrop][uig-markers-show]').then(
      () => secondHighlightPromise,
    );

    // Target 1
    cy.get('[data-testid="target-1"]').then(($target) => {
      expect($target).not.to.have.attr('uig-elements-target');
      expect($target).not.to.have.attr('uig-markers-clickable');
      expect($target).not.to.have.attr('uig-markers-non-positioned');
    });

    // Target 2
    cy.get('[data-testid="target-2"]').then(($target) => {
      expect($target).to.have.attr('uig-elements-target');
      expect($target).to.have.attr('uig-markers-clickable');
      expect($target).to.have.attr('uig-markers-non-positioned');
    });
  });
});
